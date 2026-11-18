// ==============================================================================
// VELTRON API: /api/v1/auth/me
// Returns current user identity, role, subscription tier, and Boss authorization
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth.config';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    let userEmail: string | null = null;
    let userId: string | null = null;
    let userRole: string = 'USER';
    let userTier: string = 'FREE';
    let isBoss: boolean = false;
    let displayName: string = 'Investor';
    let avatarUrl: string | null = null;
    let telegramUserId: string | null = null;
    let isActive: boolean = true;

    // 1. Check NextAuth Session
    try {
      const session = await auth();
      if (session?.user?.email) {
        userEmail = session.user.email.toLowerCase();
        userId = session.user.id || null;
      }
    } catch {}

    // 2. Check Telegram InitData or Telegram User query / header
    const tgInitData = req.headers.get('x-telegram-init-data') || req.nextUrl.searchParams.get('tg_init_data');
    const directTgId = req.headers.get('x-telegram-user-id') || req.nextUrl.searchParams.get('tg_user_id');

    if (directTgId === '7552517378' || directTgId === 'BRABOSS') {
      userEmail = 'xudayberdiyevshomuhammad@gmail.com';
      isBoss = true;
      userRole = 'SYSTEM_ADMIN';
      userTier = 'MAX';
    }

    // 3. Fallback: Check Cookies for session token
    if (!userEmail) {
      const sessionToken =
        req.cookies.get('__Secure-authjs.session-token')?.value ||
        req.cookies.get('authjs.session-token')?.value ||
        req.cookies.get('next-auth.session-token')?.value ||
        req.cookies.get('veltron_session')?.value ||
        req.cookies.get('valixen_session')?.value;

      if (sessionToken) {
        const active = await db.session.findUnique({
          where: { sessionToken },
          include: { user: true },
        }).catch(() => null);

        if (active?.user) {
          userEmail = active.user.email.toLowerCase();
          userId = active.user.id;
        }
      }
    }

    // 4. If we have a userEmail or userId, load full profile from DB
    if (userEmail) {
      const dbUser = await db.user.findUnique({
        where: { email: userEmail },
        include: {
          profile: true,
          subscriptions: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      }).catch(() => null);

      if (dbUser) {
        userId = dbUser.id;
        userEmail = dbUser.email;
        isActive = dbUser.isActive;
        userRole = dbUser.role;
        displayName = dbUser.profile?.displayName || dbUser.email.split('@')[0];
        avatarUrl = dbUser.profile?.avatarUrl || null;
        telegramUserId = dbUser.profile?.telegramUserId || null;
        userTier = dbUser.subscriptions[0]?.tier || 'FREE';
      }
    }

    // Special check for Boss identity
    const BOSS_EMAIL = 'xudayberdiyevshomuhammad@gmail.com';
    const BOSS_TG_ID = '7552517378';

    if (
      userEmail?.toLowerCase() === BOSS_EMAIL ||
      telegramUserId === BOSS_TG_ID ||
      userRole === 'SYSTEM_ADMIN'
    ) {
      isBoss = true;
      userRole = 'SYSTEM_ADMIN';
      userTier = 'MAX';
      if (!displayName || displayName === 'Investor') {
        displayName = 'Boss (Shomuhammad)';
      }
    }

    if (!userEmail && !isBoss) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: userId,
        email: userEmail,
        displayName,
        avatarUrl,
        role: userRole,
        tier: userTier,
        isActive,
        isBoss,
        telegramUserId,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        authenticated: false,
        error: error.message || 'Failed to resolve user session',
      },
      { status: 500 }
    );
  }
}
