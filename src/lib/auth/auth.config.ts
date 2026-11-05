// ==============================================================================
// VALIXEN ENTERPRISE AUTH.JS (NEXTAUTH v5) ARCHITECTURE
// Google OAuth & Argon2id Credentials with Role-Based Access Control
// ==============================================================================

import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { AuthService } from '@/server/services/auth.service';
import { LoginSchema } from '@/lib/auth/validation';
import { UserRole, KycStatus, AccountType, AccountStatus } from '@prisma/client';
import { logger } from '@/lib/logger';
import crypto from 'crypto';

// Diagnostic check for actual Google OAuth credentials (no simulation)
const isGoogleOAuthConfigured =
  Boolean(process.env.AUTH_GOOGLE_ID) && Boolean(process.env.AUTH_GOOGLE_SECRET);

if (!isGoogleOAuthConfigured) {
  logger.warn(
    'Google OAuth credentials (AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET) are not set in environment variables. Real Google Sign-In requires authentic credentials from Google Cloud Console.'
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'valixen-secure-auth-secret-change-in-production-min32chars',
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-authjs.session-token' : 'authjs.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.COOKIE_DOMAIN || undefined,
      },
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/register',
    verifyRequest: '/verify-email',
  },
  providers: [
    // 1. Google OAuth Provider (Using real configuration, not simulated)
    ...(isGoogleOAuthConfigured
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            authorization: {
              params: {
                prompt: 'consent',
                access_type: 'offline',
                response_type: 'code',
              },
            },
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),

    // 2. Argon2id Institutional Credentials Provider
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any, req: any) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        try {
          const ipAddress = req?.headers?.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
          const userAgent = req?.headers?.get('user-agent') || 'Unknown Client';

          const result = await AuthService.login(parsed.data, {
            ipAddress,
            userAgent,
          });

          return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.displayName,
            role: result.user.role,
            kycStatus: result.user.kycStatus,
          };
        } catch (err) {
          logger.warn('Credentials authentication rejected', { error: String(err) });
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Auto-provision profile & financial account for Google OAuth signups
    async signIn({ user, account }: any) {
      if (account?.provider === 'google' && user?.email) {
        const normalizedEmail = user.email.toLowerCase();

        const existingUser = await db.user.findUnique({
          where: { email: normalizedEmail },
          include: { profile: true },
        });

        if (!existingUser) {
          await db.$transaction(async (tx: any) => {
            const newUser = await tx.user.create({
              data: {
                email: normalizedEmail,
                emailVerified: new Date(), // Google emails are pre-verified
                role: UserRole.USER,
                isActive: true,
              },
            });

            await tx.userProfile.create({
              data: {
                userId: newUser.id,
                displayName: user.name || normalizedEmail.split('@')[0],
                avatarUrl: user.image || null,
                preferredCurrency: 'USD',
                kycStatus: KycStatus.TIER_1_VERIFIED,
              },
            });

            // Initial Smart Checking account
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

            // Initial Paper Trading portfolio
            await tx.portfolio.create({
              data: {
                userId: newUser.id,
                name: 'Quantum Virtual Simulation',
                isVirtual: true,
                totalValue: 100000.0,
                cashBalance: 100000.0,
                currency: 'USD',
              },
            });
          });
        }
      }
      return true;
    },

    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role || UserRole.USER;
        token.kycStatus = user.kycStatus || KycStatus.UNVERIFIED;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.kycStatus = token.kycStatus as KycStatus;
      }
      return session;
    },
  },
});
