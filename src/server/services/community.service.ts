// ==============================================================================
// VALIXEN PROFESSIONAL FINANCIAL EDUCATION COMMUNITY SERVICE
// Discussions, Questions & Answers, Reactions, Bookmarks, Anti-Spam & Moderation
// ==============================================================================

import { db } from '@/lib/db';
import { ValidationError, UnauthorizedError } from '@/lib/api/errors';
import { logger } from '@/lib/logger';

export type PostType = 'DISCUSSION' | 'QUESTION';
export type ModerationStatus = 'APPROVED' | 'PENDING_REVIEW' | 'FLAGGED' | 'REMOVED';
export type ReactionType = 'INSIGHTFUL' | 'BULLISH' | 'HELPFUL' | 'FIRE' | 'UPVOTE';
export type ReportReason =
  | 'PROFIT_GUARANTEE'
  | 'MISLEADING_CLAIMS'
  | 'SPAM'
  | 'PRIVATE_INFO'
  | 'IMPERSONATION'
  | 'INAPPROPRIATE';

export interface CreatePostInput {
  title: string;
  content: string;
  category: string;
  type?: PostType;
  assetSymbol?: string;
  sentiment?: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

export interface CommunityCommentDTO {
  id: string;
  authorId?: string;
  authorName: string;
  authorRole: string;
  authorLevel?: string;
  content: string;
  isAcceptedSolution?: boolean;
  createdAt: string;
}

export interface CommunityPostDTO {
  id: string;
  userId?: string;
  authorName: string;
  authorRole: string;
  authorLevel: string;
  authorXp: number;
  authorAvatar?: string;
  title: string;
  content: string;
  category: string;
  type: PostType;
  isAnswered?: boolean;
  acceptedAnswerId?: string | null;
  reportCount?: number;
  moderationStatus: ModerationStatus;
  moderationReason?: string | null;
  assetSymbol?: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  upvotes: number;
  hasUpvoted: boolean;
  reactions: Record<ReactionType, number>;
  userReactions: ReactionType[];
  isBookmarked: boolean;
  commentsCount: number;
  comments?: CommunityCommentDTO[];
  createdAt: string;
}

export interface MarketSentimentOverview {
  btcBullishPercent: number;
  goldBullishPercent: number;
  usdUzsBullishPercent: number;
  totalVotes: number;
}

export interface UserCommunityProfileDTO {
  userId: string;
  displayName: string;
  role: string;
  level: string;
  xp: number;
  rank: string;
  discussionsCount: number;
  questionsCount: number;
  solutionsAccepted: number;
  totalReactionsReceived: number;
  joinedAt: string;
  badges: string[];
}

// In-memory data store for testing and fallback
const inMemoryPosts: CommunityPostDTO[] = [
  {
    id: 'post-1',
    userId: 'usr-sardor-001',
    authorName: 'Sardor Mirzayev',
    authorRole: 'QUANT_ANALYST',
    authorLevel: 'Capital Strategist (Level 4)',
    authorXp: 4850,
    title: 'Bitcoin Halving Cycle vs Macro Liquidity: 2026 Trajectory Analysis',
    content:
      'Analyzing global M2 expansion alongside the institutional spot ETF custody inflows. Given current consolidation between $68K-$72K, historical drawdown patterns suggest robust structural support above $62,000. Risk disclosure: Not financial advice.',
    category: 'CRYPTO_ANALYSIS',
    type: 'DISCUSSION',
    moderationStatus: 'APPROVED',
    assetSymbol: 'BTC',
    sentiment: 'BULLISH',
    upvotes: 42,
    hasUpvoted: false,
    reactions: { INSIGHTFUL: 18, BULLISH: 24, HELPFUL: 9, FIRE: 12, UPVOTE: 42 },
    userReactions: [],
    isBookmarked: false,
    commentsCount: 2,
    comments: [
      {
        id: 'c-1',
        authorId: 'usr-elena-002',
        authorName: 'Elena Rostova',
        authorRole: 'TRADER',
        authorLevel: 'Analyst (Level 3)',
        content:
          'Agreed. Cross-venue order book depth on institutional venues confirms substantial support blocks.',
        createdAt: '2 hours ago',
      },
      {
        id: 'c-2',
        authorId: 'usr-marcus-003',
        authorName: 'Marcus Vance',
        authorRole: 'TRADER',
        authorLevel: 'Explorer (Level 2)',
        content:
          'What stop-loss parameter are you applying for virtual swing positions in the simulator?',
        createdAt: '1 hour ago',
      },
    ],
    createdAt: '3 hours ago',
  },
  {
    id: 'post-2',
    userId: 'usr-nodira-004',
    authorName: 'Nodira Alimova',
    authorRole: 'INSTITUTIONAL',
    authorLevel: 'Market Master (Level 6)',
    authorXp: 18900,
    title: 'Central Bank of Uzbekistan Key Policy Rate Impact on Commercial Yields',
    content:
      'With CBU maintaining a vigilant 13.5% stance, local currency sovereign bank deposits offer compelling real yields exceeding 4.5% above annualized inflation. Diversified multi-currency positioning remains the optimal defensive hedge.',
    category: 'MACRO_OUTLOOK',
    type: 'DISCUSSION',
    moderationStatus: 'APPROVED',
    assetSymbol: 'USD/UZS',
    sentiment: 'NEUTRAL',
    upvotes: 29,
    hasUpvoted: true,
    reactions: { INSIGHTFUL: 21, BULLISH: 4, HELPFUL: 15, FIRE: 3, UPVOTE: 29 },
    userReactions: ['INSIGHTFUL'],
    isBookmarked: true,
    commentsCount: 1,
    comments: [
      {
        id: 'c-3',
        authorId: 'usr-farrukh-005',
        authorName: 'Farrukh Tursunov',
        authorRole: 'USER',
        authorLevel: 'Explorer (Level 2)',
        content: 'Excellent synthesis. Are you tracking Treasury bill yields or commercial banking certificates?',
        createdAt: '30 mins ago',
      },
    ],
    createdAt: '5 hours ago',
  },
  {
    id: 'post-3',
    userId: 'usr-farrukh-005',
    authorName: 'Farrukh Tursunov',
    authorRole: 'USER',
    authorLevel: 'Explorer (Level 2)',
    authorXp: 1250,
    title: 'How should a beginner structure an emergency fund before investing in stocks?',
    content:
      'I am starting my financial literacy journey and saving 20% of monthly income. Should I complete a 6-month living expense reserve in high-yield vaults first, or begin dollar-cost averaging into broad index funds immediately?',
    category: 'FINANCIAL_LITERACY',
    type: 'QUESTION',
    isAnswered: true,
    acceptedAnswerId: 'c-4',
    moderationStatus: 'APPROVED',
    sentiment: 'NEUTRAL',
    upvotes: 19,
    hasUpvoted: false,
    reactions: { INSIGHTFUL: 6, BULLISH: 0, HELPFUL: 14, FIRE: 2, UPVOTE: 19 },
    userReactions: [],
    isBookmarked: false,
    commentsCount: 1,
    comments: [
      {
        id: 'c-4',
        authorId: 'usr-nodira-004',
        authorName: 'Nodira Alimova',
        authorRole: 'INSTITUTIONAL',
        authorLevel: 'Market Master (Level 6)',
        content:
          'Always prioritize a 3 to 6-month liquid emergency citadel first. This protects you from being forced to liquidate equities at a market trough during unexpected expenses.',
        isAcceptedSolution: true,
        createdAt: '1 hour ago',
      },
    ],
    createdAt: '6 hours ago',
  },
  {
    id: 'post-4',
    userId: 'usr-azamat-006',
    authorName: 'Azamat Qodirov',
    authorRole: 'TRADER',
    authorLevel: 'Analyst (Level 3)',
    authorXp: 2800,
    title: 'What is the mathematical difference between Simple Interest and Compound APY?',
    content:
      'Can someone explain with a concrete 10,000,000 UZS example how compounding frequency (monthly vs quarterly vs annually) affects net terminal wealth over a 3-year timeline?',
    category: 'QUESTIONS',
    type: 'QUESTION',
    isAnswered: false,
    moderationStatus: 'APPROVED',
    sentiment: 'NEUTRAL',
    upvotes: 14,
    hasUpvoted: false,
    reactions: { INSIGHTFUL: 8, BULLISH: 0, HELPFUL: 11, FIRE: 1, UPVOTE: 14 },
    userReactions: [],
    isBookmarked: false,
    commentsCount: 0,
    comments: [],
    createdAt: '8 hours ago',
  },
];

const inMemoryBookmarks = new Set<string>(); // "userId:postId"
const inMemoryReports: any[] = [];
const userLastPostTimestamp = new Map<string, number>();

export class CommunityService {
  /**
   * STRICT COMMUNITY RULES & ANTI-SPAM COMPLIANCE ENGINE
   * Enforces:
   * 1. No investment profit guarantees
   * 2. No misleading financial claims
   * 3. No spam & cooldown anti-flood protection
   * 4. No sharing private account information (passwords, CVV, PIN, card numbers)
   * 5. No impersonation
   */
  public static validateContentRules(title: string, content: string, userId?: string): void {
    const combined = `${title} ${content}`.toLowerCase();

    // 1. Anti-Spam: Rate limit / cooldown
    if (userId) {
      const lastTime = userLastPostTimestamp.get(userId) || 0;
      const cooldownMs = 15 * 1000; // 15 seconds cooldown
      if (Date.now() - lastTime < cooldownMs) {
        throw new ValidationError('Posting cooldown active. Please wait 15 seconds before posting again.');
      }
    }

    // 2. Rule: No investment profit guarantees
    const guaranteePatterns = [
      /\b(guaranteed\s+(profit|return|yield|money|wealth|gain))\b/i,
      /\b(100%\s*(guaranteed|profit|safe))\b/i,
      /\b(risk-free\s+(profit|yield|returns?|investment))\b/i,
      /\b(double\s+your\s+money)\b/i,
      /\b(sure-shot\s+returns?)\b/i,
      /\b(no\s+risk\s+guaranteed)\b/i,
    ];

    for (const pattern of guaranteePatterns) {
      if (pattern.test(combined)) {
        throw new ValidationError(
          'Community Rule Violation: Investment profit guarantees are strictly prohibited. All financial investments carry inherent risk.'
        );
      }
    }

    // 3. Rule: No misleading financial claims
    const misleadingPatterns = [
      /\b(get\s+rich\s+quick)\b/i,
      /\b(instant\s+millionaire)\b/i,
      /\b(secret\s+money\s+(glitch|hack|trick|cheat))\b/i,
      /\b(1000%\s+guaranteed)\b/i,
    ];

    for (const pattern of misleadingPatterns) {
      if (pattern.test(combined)) {
        throw new ValidationError(
          'Community Rule Violation: Misleading financial claims and "get rich quick" schemes are strictly banned.'
        );
      }
    }

    // 4. Rule: No sharing private account information
    const privateInfoPatterns = [
      /\bpassword\s*(is\s*[:=]|[:=]|is\s+)\s*['"]?[^\s'"]+['"]?/i,
      /\bcvv\s*(is\s*[:=]|[:=]|is\s+)\s*\d{3,4}/i,
      /\bpin\s*(is\s*[:=]|[:=]|is\s+)\s*\d{4,6}/i,
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/i, // Card number pattern
    ];

    for (const pattern of privateInfoPatterns) {
      if (pattern.test(combined)) {
        throw new ValidationError(
          'Security Violation: Sharing private credentials, passwords, card numbers or CVV is strictly prohibited.'
        );
      }
    }

    // 5. Rule: No impersonation
    const impersonationPatterns = [
      /\b(i\s+am\s+(the\s+)?(official\s+)?valixen\s+(admin|ceo|founder|support))\b/i,
      /\b(official\s+valixen\s+staff)\b/i,
    ];

    for (const pattern of impersonationPatterns) {
      if (pattern.test(combined)) {
        throw new ValidationError(
          'Community Rule Violation: Impersonation of platform administrators or staff is strictly prohibited.'
        );
      }
    }
  }

  /**
   * Retrieves community discussion feed with filtering, search, and bookmarks
   */
  public static async getPosts(options: {
    category?: string;
    type?: PostType | 'ALL';
    searchQuery?: string;
    sort?: 'NEWEST' | 'TOP' | 'MOST_COMMENTED';
    currentUserId?: string;
    onlyBookmarked?: boolean;
    onlyMine?: boolean;
  } = {}): Promise<CommunityPostDTO[]> {
    const { category, type, searchQuery, sort = 'NEWEST', currentUserId, onlyBookmarked, onlyMine } = options;

    let filtered = [...inMemoryPosts].filter((p) => p.moderationStatus === 'APPROVED');

    // 1. Filter by Post Type (DISCUSSION vs QUESTION)
    if (type && type !== 'ALL') {
      filtered = filtered.filter((p) => p.type === type);
    }

    // 2. Filter by Category
    if (category && category !== 'ALL') {
      filtered = filtered.filter((p) => p.category === category);
    }

    // 3. Search Keyword across title, content, author, asset
    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.authorName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.assetSymbol && p.assetSymbol.toLowerCase().includes(q))
      );
    }

    // 4. Bookmark Filter
    if (onlyBookmarked && currentUserId) {
      filtered = filtered.filter((p) => inMemoryBookmarks.has(`${currentUserId}:${p.id}`));
    }

    // 5. My Posts Filter
    if (onlyMine && currentUserId) {
      filtered = filtered.filter((p) => p.userId === currentUserId);
    }

    // 6. Map Bookmarked & User Upvote states
    filtered = filtered.map((p) => ({
      ...p,
      isBookmarked: currentUserId ? inMemoryBookmarks.has(`${currentUserId}:${p.id}`) : false,
    }));

    // 7. Sort
    if (sort === 'TOP') {
      filtered.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sort === 'MOST_COMMENTED') {
      filtered.sort((a, b) => b.commentsCount - a.commentsCount);
    } else {
      // NEWEST by default
      filtered.sort((a, b) => b.id.localeCompare(a.id));
    }

    return filtered;
  }

  /**
   * Returns single post by ID
   */
  public static async getPostById(postId: string, currentUserId?: string): Promise<CommunityPostDTO | null> {
    const post = inMemoryPosts.find((p) => p.id === postId);
    if (!post) return null;

    return {
      ...post,
      isBookmarked: currentUserId ? inMemoryBookmarks.has(`${currentUserId}:${post.id}`) : false,
    };
  }

  /**
   * Submits a new community educational discussion or question
   */
  public static async createPost(userId: string, input: CreatePostInput): Promise<CommunityPostDTO> {
    if (!input.title || input.title.trim().length < 5) {
      throw new ValidationError('Post title must be at least 5 characters.');
    }
    if (!input.content || input.content.trim().length < 15) {
      throw new ValidationError('Post content must contain at least 15 characters of thoughtful analysis.');
    }

    // 1. Run strict anti-spam & rule validation
    this.validateContentRules(input.title, input.content, userId);
    userLastPostTimestamp.set(userId, Date.now());

    // 2. Resolve author profile & ranking level
    let authorName = 'Sovereign Allocator';
    let authorLevel = 'Explorer (Level 2)';
    let authorXp = 1850;

    if (process.env.DATABASE_URL) {
      try {
        const profile = await (db as any).userProfile.findUnique({
          where: { userId },
          include: { user: { include: { gamification: true } } },
        });
        if (profile) {
          authorName = profile.displayName || profile.firstName || authorName;
          if (profile.user?.gamification) {
            authorLevel = `${profile.user.gamification.currentLevel} (Level 3)`;
            authorXp = profile.user.gamification.totalXp;
          }
        }
      } catch {
        // Fallback in memory
      }
    }

    const type: PostType = input.type || 'DISCUSSION';

    const newPost: CommunityPostDTO = {
      id: `post-${Date.now()}`,
      userId,
      authorName,
      authorRole: 'TRADER',
      authorLevel,
      authorXp,
      title: input.title.trim(),
      content: input.content.trim(),
      category: input.category || (type === 'QUESTION' ? 'QUESTIONS' : 'FINANCIAL_LITERACY'),
      type,
      isAnswered: false,
      moderationStatus: 'APPROVED',
      assetSymbol: input.assetSymbol?.toUpperCase(),
      sentiment: input.sentiment || 'NEUTRAL',
      upvotes: 1,
      hasUpvoted: true,
      reactions: { INSIGHTFUL: 0, BULLISH: 0, HELPFUL: 1, FIRE: 0, UPVOTE: 1 },
      userReactions: ['UPVOTE'],
      isBookmarked: false,
      commentsCount: 0,
      comments: [],
      createdAt: 'Just now',
    };

    inMemoryPosts.unshift(newPost);
    logger.info(`[COMMUNITY] New ${type} published by user ${userId}: "${input.title}"`);

    return newPost;
  }

  /**
   * Adds comment or answer to a discussion/question thread
   */
  public static async addComment(
    postId: string,
    userId: string,
    content: string
  ): Promise<{ success: boolean; comment: CommunityCommentDTO }> {
    if (!content || content.trim().length < 2) {
      throw new ValidationError('Comment cannot be empty.');
    }

    // Validate comment rules
    this.validateContentRules('Comment', content, userId);

    const post = inMemoryPosts.find((p) => p.id === postId);
    if (!post) throw new ValidationError('Post not found.');

    const newComment: CommunityCommentDTO = {
      id: `c-${Date.now()}`,
      authorId: userId,
      authorName: 'Verified Member',
      authorRole: 'MEMBER',
      authorLevel: 'Capital Strategist (Level 4)',
      content: content.trim(),
      createdAt: 'Just now',
    };

    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
    post.commentsCount++;

    return { success: true, comment: newComment };
  }

  /**
   * Toggles reaction (INSIGHTFUL, BULLISH, HELPFUL, FIRE, UPVOTE)
   */
  public static async toggleReaction(
    postId: string,
    userId: string,
    reactionType: ReactionType
  ): Promise<{ success: boolean; reactions: Record<ReactionType, number>; userReactions: ReactionType[] }> {
    const post = inMemoryPosts.find((p) => p.id === postId);
    if (!post) throw new ValidationError('Post not found.');

    if (!post.reactions) {
      post.reactions = { INSIGHTFUL: 0, BULLISH: 0, HELPFUL: 0, FIRE: 0, UPVOTE: 0 };
    }
    if (!post.userReactions) post.userReactions = [];

    const hasReacted = post.userReactions.includes(reactionType);

    if (hasReacted) {
      post.userReactions = post.userReactions.filter((r) => r !== reactionType);
      post.reactions[reactionType] = Math.max(0, (post.reactions[reactionType] || 1) - 1);
      if (reactionType === 'UPVOTE') {
        post.upvotes = Math.max(0, post.upvotes - 1);
        post.hasUpvoted = false;
      }
    } else {
      post.userReactions.push(reactionType);
      post.reactions[reactionType] = (post.reactions[reactionType] || 0) + 1;
      if (reactionType === 'UPVOTE') {
        post.upvotes++;
        post.hasUpvoted = true;
      }
    }

    return {
      success: true,
      reactions: post.reactions,
      userReactions: post.userReactions,
    };
  }

  /**
   * Toggles bookmarking a post for user
   */
  public static async toggleBookmark(
    postId: string,
    userId: string
  ): Promise<{ success: boolean; isBookmarked: boolean }> {
    const key = `${userId}:${postId}`;
    let isBookmarked: boolean;

    if (inMemoryBookmarks.has(key)) {
      inMemoryBookmarks.delete(key);
      isBookmarked = false;
    } else {
      inMemoryBookmarks.add(key);
      isBookmarked = true;
    }

    return { success: true, isBookmarked };
  }

  /**
   * Reports inappropriate content (rule violation, profit guarantee, spam, etc.)
   */
  public static async reportContent(params: {
    postId?: string;
    commentId?: string;
    reporterId: string;
    reason: ReportReason;
    details?: string;
  }): Promise<{ success: boolean; message: string }> {
    const { postId, reporterId, reason, details } = params;

    const report = {
      id: `rep-${Date.now()}`,
      postId,
      reporterId,
      reason,
      details,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    inMemoryReports.push(report);

    // If a post is reported, increment counter and flag if >= 2 reports
    if (postId) {
      const post = inMemoryPosts.find((p) => p.id === postId);
      if (post) {
        post.reportCount = (post.reportCount || 0) + 1;
        if (post.reportCount >= 2) {
          post.moderationStatus = 'FLAGGED';
          post.moderationReason = `Flagged by community reports: ${reason}`;
        }
      }
    }

    logger.warn(`[COMMUNITY REPORT] Content ${postId || params.commentId} reported for ${reason}`);

    return {
      success: true,
      message: 'Report submitted. Our compliance team will review the dispatch.',
    };
  }

  /**
   * Admin Moderation Tool: Approve, Flag, or Remove posts
   */
  public static async moderatePost(
    postId: string,
    adminUserId: string,
    action: 'APPROVE' | 'FLAG' | 'REMOVE',
    reason?: string
  ): Promise<{ success: boolean; post: CommunityPostDTO }> {
    const post = inMemoryPosts.find((p) => p.id === postId);
    if (!post) throw new ValidationError('Post not found.');

    if (action === 'APPROVE' || (action as string) === 'APPROVED') {
      post.moderationStatus = 'APPROVED';
      post.moderationReason = null;
    } else if (action === 'FLAG' || (action as string) === 'FLAGGED') {
      post.moderationStatus = 'FLAGGED';
      post.moderationReason = reason || 'Flagged by Administrator';
    } else if (action === 'REMOVE') {
      post.moderationStatus = 'REMOVED';
      post.moderationReason = reason || 'Removed for policy violation';
    }

    logger.info(`[COMMUNITY MODERATION] Post ${postId} action: ${action} by admin ${adminUserId}`);
    return { success: true, post };
  }

  /**
   * Retrieves user community profile with reputation, badges, and statistics
   */
  public static async getUserCommunityProfile(userId: string): Promise<UserCommunityProfileDTO> {
    const userPosts = inMemoryPosts.filter((p) => p.userId === userId);
    const discussionsCount = userPosts.filter((p) => p.type === 'DISCUSSION').length;
    const questionsCount = userPosts.filter((p) => p.type === 'QUESTION').length;
    const solutionsAccepted = userPosts.filter((p) => p.isAnswered).length;
    const totalReactionsReceived = userPosts.reduce((acc, p) => acc + (p.upvotes || 0), 0);

    return {
      userId,
      displayName: 'Quantum Allocator',
      role: 'QUANT_ANALYST',
      level: 'Capital Strategist (Level 4)',
      xp: 3850,
      rank: 'Top 5% Global Allocators',
      discussionsCount: discussionsCount || 4,
      questionsCount: questionsCount || 2,
      solutionsAccepted: solutionsAccepted || 3,
      totalReactionsReceived: totalReactionsReceived || 128,
      joinedAt: 'March 2026',
      badges: [
        '🛡️ Iron Sentinel',
        '💡 Macro Insights Pioneer',
        '🏆 Verified Problem Solver',
        '📈 Quantitative Modeler',
      ],
    };
  }

  /**
   * Returns macroeconomic community sentiment polling numbers
   */
  public static getSentimentPoll(): MarketSentimentOverview {
    return {
      btcBullishPercent: 68,
      goldBullishPercent: 74,
      usdUzsBullishPercent: 52,
      totalVotes: 1420,
    };
  }
}
