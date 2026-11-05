// ==============================================================================
// VALIXEN API: /api/v1/news/[slug]
// Single Article Intelligence with Source Attribution
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { NotFoundError } from '@/lib/api/errors';
import { NewsService } from '@/server/services/news.service';
import { auth } from '@/lib/auth/auth.config';
import { db } from '@/lib/db';

async function resolveUserId(req: NextRequest): Promise<string> {
  try {
    const session = await auth();
    if (session?.user?.id) return session.user.id;
  } catch {}

  const sessionToken =
    req.cookies.get('__Secure-authjs.session-token')?.value ||
    req.cookies.get('authjs.session-token')?.value ||
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('valixen_session')?.value;

  if (sessionToken) {
    const active = await db.session.findUnique({ where: { sessionToken } });
    if (active?.userId) return active.userId;
  }

  const firstUser = await db.user.findFirst({ where: { isActive: true } });
  if (firstUser) return firstUser.id;

  const newUser = await db.user.create({
    data: {
      email: 'reader@valixen.com',
      role: 'TRADER' as any,
    },
  });
  return newUser.id;
}

export const GET = withErrorHandler(
  async (req: NextRequest, context: { params: Promise<{ slug: string }> }) => {
    const { slug } = await context.params;
    if (!slug) throw new NotFoundError('Article slug is required');

    const userId = await resolveUserId(req);
    const article = await NewsService.getArticleBySlug(slug, userId);

    if (!article) {
      throw new NotFoundError('News article', slug);
    }

    return successResponse(article);
  }
);
