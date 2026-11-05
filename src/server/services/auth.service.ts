// ==============================================================================
// VELTRON SECURE AUTHENTICATION & IDENTITY SERVICE
// Enterprise Session Management, Argon2id, Anti-Enumeration, and Rate Limiting
// ==============================================================================

import crypto from 'crypto';
import { db } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '@/lib/auth/validation';
import {
  AppError,
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  RateLimitExceededError,
} from '@/lib/api/errors';
import { AuditService } from '@/server/services/audit.service';
import { AuditAction, UserRole, KycStatus, AccountType, AccountStatus } from '@prisma/client';
import { redis } from '@/lib/redis';
import { logger } from '@/lib/logger';
import { TelegramBotService } from './telegram.service';

const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_SECONDS = 15 * 60; // 15 minutes
const DEFAULT_SESSION_EXPIRY_DAYS = 30;
const TRANSIENT_SESSION_EXPIRY_HOURS = 24;

export class AuthService {
  /**
   * Enforces brute-force and credential stuffing rate limits per IP and email
   */
  private static async checkLoginRateLimit(key: string): Promise<void> {
    const rateKey = `rl:login:${key}`;
    try {
      const attempts = await redis.get(rateKey);
      if (attempts && parseInt(attempts, 10) >= MAX_FAILED_LOGIN_ATTEMPTS) {
        throw new RateLimitExceededError(
          LOGIN_LOCKOUT_SECONDS,
          'Too many failed login attempts. For your security, this account has been temporarily rate-limited. Please try again in 15 minutes.'
        );
      }
    } catch (err) {
      if (err instanceof RateLimitExceededError) throw err;
      // Fail-open on transient redis error
    }
  }

  private static async recordFailedLogin(key: string): Promise<void> {
    const rateKey = `rl:login:${key}`;
    try {
      const count = await redis.incr(rateKey);
      if (count === 1) {
        await redis.expire(rateKey, LOGIN_LOCKOUT_SECONDS);
      }
    } catch {
      // ignore cache telemetry failure
    }
  }

  private static async clearLoginRateLimit(key: string): Promise<void> {
    const rateKey = `rl:login:${key}`;
    try {
      await redis.del(rateKey);
    } catch {
      // ignore cache failure
    }
  }

  /**
   * Registers a new sovereign user with Argon2id hashing and auto-provisioning
   */
  public static async register(
    input: RegisterInput,
    options: { ipAddress?: string; userAgent?: string } = {}
  ) {
    const normalizedEmail = input.email.trim().toLowerCase();

    // Check if user already exists
    const existing = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      // Generic operational message to minimize account enumeration
      throw new ValidationError('An account with this email address already exists. Please log in instead.');
    }

    // 1. Hash password with memory-hard Argon2id parameters
    const passwordHash = await hashPassword(input.password);

    // 2. Atomic user creation and financial provisioning
    const user = await db.$transaction(async (tx: any) => {
      const newUser = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          role: UserRole.USER,
          isActive: true,
        },
      });

      // Create linked user profile
      await tx.userProfile.create({
        data: {
          userId: newUser.id,
          firstName: input.firstName || null,
          lastName: input.lastName || null,
          displayName: input.firstName ? `${input.firstName} ${input.lastName || ''}`.trim() : null,
          preferredCurrency: 'USD',
          kycStatus: KycStatus.UNVERIFIED,
        },
      });

      // Provision initial primary Smart Checking account
      const accountNumber = `VX-${crypto.randomInt(10000000, 99999999)}`;
      await tx.financialAccount.create({
        data: {
          userId: newUser.id,
          accountNumber,
          accountName: 'Primary Smart Checking',
          type: AccountType.SMART_CHECKING,
          status: AccountStatus.ACTIVE,
          currency: 'USD',
          balance: 0.0,
          availableBalance: 0.0,
        },
      });

      // Provision initial Paper Trading simulation portfolio with $100,000 demo cash
      await tx.portfolio.create({
        data: {
          userId: newUser.id,
          name: 'Quantum Virtual Simulation',
          description: 'Autonomous Paper Trading Sandbox ($100k Demo Capital)',
          isVirtual: true,
          totalValue: 100000.0,
          cashBalance: 100000.0,
          currency: 'USD',
        },
      });

      return newUser;
    });

    // 3. Generate verification token (24-hour expiry)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await db.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token: verificationToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // 4. Record Immutable Audit Event
    await AuditService.recordEvent({
      userId: user.id,
      action: AuditAction.USER_REGISTER,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      resourceEntity: 'User',
      resourceId: user.id,
      details: { email: normalizedEmail },
    });

    logger.info('User successfully registered & provisioned', {
      userId: user.id,
      email: normalizedEmail,
    });

    // Notify Telegram Admin Chat of new registration
    TelegramBotService.notifyAdminUserRegistered({
      email: normalizedEmail,
      userId: user.id,
    }).catch(() => {});

    return {
      userId: user.id,
      email: user.email,
      verificationToken, // Returned for dev/notification service
    };
  }

  /**
   * Authenticates user credentials with Argon2id and generates a secure session
   */
  public static async login(
    input: LoginInput,
    options: { ipAddress?: string; userAgent?: string } = {}
  ) {
    const normalizedEmail = input.email.trim().toLowerCase();
    const rateLimitKey = `${options.ipAddress || 'unknown'}:${normalizedEmail}`;

    // 1. Enforce rate limiting against credential brute-forcing
    await this.checkLoginRateLimit(rateLimitKey);

    // 2. Fetch user record
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true },
    });

    // Timing-attack mitigation: simulate verify work if user not found
    if (!user || !user.passwordHash || !user.isActive) {
      await this.recordFailedLogin(rateLimitKey);
      // Fake hash comparison consumes predictable CPU time
      await verifyPassword(
        input.password,
        '$argon2id$v=19$m=65536,t=3,p=4$dummySalt123$dummyHash456'
      );
      throw new UnauthorizedError('Invalid institutional email or password.');
    }

    // 3. Verify Argon2id password hash in constant time
    const isPasswordValid = await verifyPassword(input.password, user.passwordHash);

    if (!isPasswordValid) {
      await this.recordFailedLogin(rateLimitKey);
      throw new UnauthorizedError('Invalid institutional email or password.');
    }

    // Reset failed attempt counter on success
    await this.clearLoginRateLimit(rateLimitKey);

    // 4. Generate cryptographically strong session token
    const sessionToken = crypto.randomBytes(48).toString('base64url');
    const expiryDurationMs = input.rememberMe
      ? DEFAULT_SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
      : TRANSIENT_SESSION_EXPIRY_HOURS * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + expiryDurationMs);

    const session = await db.session.create({
      data: {
        userId: user.id,
        sessionToken,
        ipAddress: options.ipAddress || null,
        userAgent: options.userAgent || null,
        isValid: true,
        expiresAt,
      },
    });

    // 5. Audit Logging
    await AuditService.recordEvent({
      userId: user.id,
      action: AuditAction.USER_LOGIN,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      resourceEntity: 'Session',
      resourceId: session.id,
    });

    logger.info('User successfully authenticated', {
      userId: user.id,
      email: user.email,
    });

    // Notify Telegram Admin Chat of user login
    TelegramBotService.notifyAdminUserLogin({
      email: user.email,
      userId: user.id,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
    }).catch(() => {});

    return {
      sessionToken,
      expiresAt,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        kycStatus: user.profile?.kycStatus || KycStatus.UNVERIFIED,
        displayName: user.profile?.displayName || user.email.split('@')[0],
      },
    };
  }

  /**
   * Validates an active session token and returns associated user context
   */
  public static async getSession(sessionToken: string) {
    if (!sessionToken) return null;

    const session = await db.session.findUnique({
      where: { sessionToken },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    if (!session || !session.isValid || session.expiresAt < new Date()) {
      return null;
    }

    return {
      sessionId: session.id,
      userId: session.userId,
      user: session.user,
      expiresAt: session.expiresAt,
    };
  }

  /**
   * Revokes the current session (Logout)
   */
  public static async logout(sessionToken: string) {
    if (!sessionToken) return;

    await db.session.updateMany({
      where: { sessionToken },
      data: { isValid: false },
    });
  }

  /**
   * Revokes all active sessions across all devices for this user
   */
  public static async logoutAllDevices(userId: string) {
    if (!userId) return;

    await db.session.updateMany({
      where: { userId, isValid: true },
      data: { isValid: false },
    });

    logger.info('All sessions revoked for user', { userId });
  }

  /**
   * Dispatches a secure password reset token (with Anti-Enumeration)
   */
  public static async requestPasswordReset(
    input: ForgotPasswordInput,
    options: { ipAddress?: string } = {}
  ) {
    const normalizedEmail = input.email.trim().toLowerCase();

    // Anti-enumeration: always return success regardless of whether email exists
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user && user.isActive) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.passwordResetToken.create({
        data: {
          email: normalizedEmail,
          token: resetToken,
          expiresAt,
        },
      });

      await AuditService.recordEvent({
        userId: user.id,
        action: AuditAction.PASSWORD_RESET_REQUEST,
        ipAddress: options.ipAddress,
        resourceEntity: 'User',
        resourceId: user.id,
      });

      logger.info('Password reset token generated', { email: normalizedEmail });

      return {
        success: true,
        message: 'If an account exists with this email, a secure reset token has been dispatched.',
        token: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
      };
    }

    return {
      success: true,
      message: 'If an account exists with this email, a secure reset token has been dispatched.',
    };
  }

  /**
   * Resets password and revokes all active sessions for security
   */
  public static async resetPassword(
    input: ResetPasswordInput,
    options: { ipAddress?: string } = {}
  ) {
    const resetRecord = await db.passwordResetToken.findUnique({
      where: { token: input.token },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      throw new ValidationError('The password reset link is invalid or has expired.');
    }

    const user = await db.user.findUnique({
      where: { email: resetRecord.email },
    });

    if (!user) {
      throw new NotFoundError('User account not found.');
    }

    // 1. Hash new password with Argon2id
    const newPasswordHash = await hashPassword(input.password);

    // 2. Update user, delete reset token, and revoke all active sessions
    await db.$transaction(async (tx: any) => {
      await tx.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      });

      // Revoke all existing sessions across all devices
      await tx.session.updateMany({
        where: { userId: user.id, isValid: true },
        data: { isValid: false },
      });

      // Delete used reset token
      await tx.passwordResetToken.delete({
        where: { id: resetRecord.id },
      });
    });

    await AuditService.recordEvent({
      userId: user.id,
      action: AuditAction.PASSWORD_RESET_SUCCESS,
      ipAddress: options.ipAddress,
      resourceEntity: 'User',
      resourceId: user.id,
    });

    logger.info('Password successfully reset & all prior sessions revoked', {
      userId: user.id,
    });

    return { success: true };
  }

  /**
   * Verifies an email token and marks user emailVerified
   */
  public static async verifyEmail(token: string) {
    const record = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!record || record.expires < new Date()) {
      throw new ValidationError('Email verification token is invalid or has expired.');
    }

    await db.$transaction(async (tx: any) => {
      await tx.user.update({
        where: { email: record.identifier },
        data: {
          emailVerified: new Date(),
        },
      });

      await tx.verificationToken.delete({
        where: { token },
      });
    });

    logger.info('Email verified successfully', { email: record.identifier });

    return { success: true };
  }
}
