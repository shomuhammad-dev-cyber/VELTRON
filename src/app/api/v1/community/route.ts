// ==============================================================================
// VALIXEN API: /api/v1/community
// Professional Financial Education Community, Discussions, Q&A, Moderation & Profiles
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { CommunityService, ReactionType, ReportReason } from '@/server/services/community.service';
import { resolveUserId } from '@/lib/api/auth-helper';
import { z } from 'zod';

const ActionSchema = z.object({
  action: z
    .enum(['CREATE_POST', 'UPVOTE', 'COMMENT', 'REACTION', 'BOOKMARK', 'REPORT', 'MODERATE'])
    .default('CREATE_POST'),
  postId: z.string().optional(),
  commentId: z.string().optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  type: z.enum(['DISCUSSION', 'QUESTION']).optional(),
  assetSymbol: z.string().optional(),
  sentiment: z.enum(['BULLISH', 'BEARISH', 'NEUTRAL']).optional(),
  commentText: z.string().optional(),
  reactionType: z.enum(['INSIGHTFUL', 'BULLISH', 'HELPFUL', 'FIRE', 'UPVOTE']).optional(),
  reportReason: z
    .enum(['PROFIT_GUARANTEE', 'MISLEADING_CLAIMS', 'SPAM', 'PRIVATE_INFO', 'IMPERSONATION', 'INAPPROPRIATE'])
    .optional(),
  reportDetails: z.string().optional(),
  moderateAction: z.enum(['APPROVE', 'FLAG', 'REMOVE']).optional(),
  moderateReason: z.string().optional(),
});

export const GET = withErrorHandler(async (req: NextRequest) => {
  const url = new URL(req.url);
  const userId = await resolveUserId(req).catch(() => 'anon-user');

  // Check if requesting single post
  const postId = url.searchParams.get('postId');
  if (postId) {
    const post = await CommunityService.getPostById(postId, userId);
    return successResponse({ post }, 200);
  }

  // Check if requesting user profile
  const profileUserId = url.searchParams.get('profileUserId');
  if (profileUserId || url.searchParams.get('profile') === 'me') {
    const targetUserId = profileUserId || userId;
    const profile = await CommunityService.getUserCommunityProfile(targetUserId);
    return successResponse({ profile }, 200);
  }

  const category = url.searchParams.get('category') || undefined;
  const typeParam = url.searchParams.get('type') as any;
  const type = typeParam === 'QUESTION' || typeParam === 'DISCUSSION' ? typeParam : 'ALL';
  const searchQuery = url.searchParams.get('search') || undefined;
  const sort = (url.searchParams.get('sort') as any) || 'NEWEST';
  const onlyBookmarked = url.searchParams.get('onlyBookmarked') === 'true';
  const onlyMine = url.searchParams.get('onlyMine') === 'true';

  const [posts, sentiment] = await Promise.all([
    CommunityService.getPosts({
      category,
      type,
      searchQuery,
      sort,
      currentUserId: userId,
      onlyBookmarked,
      onlyMine,
    }),
    CommunityService.getSentimentPoll(),
  ]);

  return successResponse({ posts, sentiment }, 200);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const userId = await resolveUserId(req).catch(() => 'demo-user-community');
  const body = await req.json();
  const validated = ActionSchema.parse(body);

  // 1. REACTION
  if (validated.action === 'REACTION') {
    if (!validated.postId || !validated.reactionType) {
      throw new Error('postId and reactionType are required for reaction.');
    }
    const result = await CommunityService.toggleReaction(
      validated.postId,
      userId,
      validated.reactionType as ReactionType
    );
    return successResponse(result, 200);
  }

  // 2. BOOKMARK
  if (validated.action === 'BOOKMARK') {
    if (!validated.postId) throw new Error('postId is required to bookmark.');
    const result = await CommunityService.toggleBookmark(validated.postId, userId);
    return successResponse(result, 200);
  }

  // 3. REPORT INAPPROPRIATE CONTENT
  if (validated.action === 'REPORT') {
    if (!validated.reportReason) throw new Error('reportReason is required to submit a report.');
    const result = await CommunityService.reportContent({
      postId: validated.postId,
      commentId: validated.commentId,
      reporterId: userId,
      reason: validated.reportReason as ReportReason,
      details: validated.reportDetails,
    });
    return successResponse(result, 200);
  }

  // 4. ADMIN MODERATION
  if (validated.action === 'MODERATE') {
    if (!validated.postId || !validated.moderateAction) {
      throw new Error('postId and moderateAction are required for moderation.');
    }
    const result = await CommunityService.moderatePost(
      validated.postId,
      userId,
      validated.moderateAction,
      validated.moderateReason
    );
    return successResponse(result, 200);
  }

  // 5. UPVOTE (Shortcut for toggleReaction UPVOTE)
  if (validated.action === 'UPVOTE') {
    if (!validated.postId) throw new Error('postId is required to upvote.');
    const result = await CommunityService.toggleReaction(validated.postId, userId, 'UPVOTE');
    return successResponse(result, 200);
  }

  // 6. COMMENT / ANSWER
  if (validated.action === 'COMMENT') {
    if (!validated.postId || !validated.commentText) {
      throw new Error('postId and commentText are required to comment.');
    }
    const result = await CommunityService.addComment(validated.postId, userId, validated.commentText);
    return successResponse(result, 201);
  }

  // 7. CREATE POST / QUESTION
  if (!validated.title || !validated.content) {
    throw new Error('title and content are required to create a post.');
  }

  const post = await CommunityService.createPost(userId, {
    title: validated.title,
    content: validated.content,
    category: validated.category || 'FINANCIAL_LITERACY',
    type: validated.type || 'DISCUSSION',
    assetSymbol: validated.assetSymbol,
    sentiment: validated.sentiment || 'NEUTRAL',
  });

  return successResponse({ post }, 201);
});
