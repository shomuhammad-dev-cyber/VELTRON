// ==============================================================================
// VALIXEN COMMUNITY POST & QUESTION CARD
// Full interactive card with reactions, bookmarks, comments, reports & moderation
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CommunityPostDTO, ReactionType } from '@/server/services/community.service';
import {
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  ShieldAlert,
  Send,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Award,
  Flame,
  Lightbulb,
  Check,
  Trash2,
} from 'lucide-react';

interface PostCardProps {
  key?: string;
  post: CommunityPostDTO;
  onPostUpdated: () => void;
  onReportClick: (postId: string) => void;
  isAdmin?: boolean;
}

export function PostCard({ post, onPostUpdated, onReportClick, isAdmin = false }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [isReacting, setIsReacting] = useState(false);

  // Toggle Bookmark
  const handleToggleBookmark = async () => {
    try {
      const res = await fetch('/api/v1/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'BOOKMARK', postId: post.id }),
      });
      const json = await res.json();
      if (json.success) {
        setIsBookmarked(json.data.isBookmarked);
      }
    } catch {
      alert('Failed to update bookmark.');
    }
  };

  // Toggle Reaction
  const handleReaction = async (type: ReactionType) => {
    if (isReacting) return;
    setIsReacting(true);
    try {
      const res = await fetch('/api/v1/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REACTION', postId: post.id, reactionType: type }),
      });
      const json = await res.json();
      if (json.success) {
        onPostUpdated();
      }
    } catch {
      alert('Failed to submit reaction.');
    } finally {
      setIsReacting(false);
    }
  };

  // Add Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmittingComment(true);

    try {
      const res = await fetch('/api/v1/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'COMMENT',
          postId: post.id,
          commentText,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Failed to submit comment');

      setCommentText('');
      onPostUpdated();
    } catch (err: any) {
      alert(err.message || 'Error submitting comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Admin Moderation Action
  const handleAdminModerate = async (action: 'APPROVE' | 'FLAG' | 'REMOVE') => {
    if (!confirm(`Are you sure you want to set moderation status to ${action}?`)) return;
    try {
      const res = await fetch('/api/v1/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'MODERATE',
          postId: post.id,
          moderateAction: action,
        }),
      });
      const json = await res.json();
      if (json.success) {
        onPostUpdated();
      }
    } catch {
      alert('Moderation action failed.');
    }
  };

  const isQuestion = post.type === 'QUESTION';
  const isBullish = post.sentiment === 'BULLISH';
  const isBearish = post.sentiment === 'BEARISH';

  return (
    <GlassPanel variant="prismatic" className="p-5 sm:p-6 space-y-4 border-white/[0.08] sm:px-6 md:px-6 lg:px-6">
      {/* Top Author & Meta Bar */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-valixen-violet via-indigo-600 to-valixen-cyan flex items-center justify-center font-bold text-xs text-white shadow-glow-violet">
            {post.authorName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display font-bold text-white text-sm">{post.authorName}</span>
              <Badge variant="cyan" className="text-[9px] px-1.5 py-0.2">
                {post.authorRole}
              </Badge>
              {isQuestion ? (
                <Badge
                  variant={post.isAnswered ? 'green' : 'gold'}
                  className="text-[9px] px-1.5 py-0.2 font-mono"
                >
                  {post.isAnswered ? 'SOLVED' : 'UNANSWERED'}
                </Badge>
              ) : (
                <Badge variant="violet" className="text-[9px] px-1.5 py-0.2 font-mono">
                  DISCUSSION
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] font-mono text-valixen-ice flex items-center gap-1">
                <Award className="w-3 h-3 text-valixen-gold" />
                {post.authorLevel} • {post.authorXp?.toLocaleString() || 1200} XP
              </span>
              <span className="text-[10px] text-slate-500">• {post.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleToggleBookmark}
            title={isBookmarked ? 'Remove Bookmark' : 'Save to Bookmarks'}
            className={`p-2 rounded-lg text-xs font-mono transition-all ${
              isBookmarked
                ? 'bg-valixen-gold/20 text-valixen-gold border border-valixen-gold/40'
                : 'text-slate-400 hover:text-white bg-white/[0.04]'
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onReportClick(post.id)}
            title="Report policy violation"
            className="p-2 rounded-lg text-xs font-mono text-slate-400 hover:text-valixen-telemetry-loss bg-white/[0.04] transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title & Body */}
      <div className="space-y-2">
        <h3 className="font-display font-bold text-white text-base sm:text-lg leading-snug">
          {post.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      </div>

      {/* Tags & Asset Sentiment */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono text-slate-400">
          #{post.category}
        </span>

        {post.assetSymbol && (
          <span className="px-2.5 py-1 rounded-md bg-valixen-violet/10 border border-valixen-violet/30 text-[10px] font-mono text-valixen-ice font-bold">
            {post.assetSymbol}
          </span>
        )}

        {post.sentiment && post.sentiment !== 'NEUTRAL' && (
          <span
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold ${
              isBullish
                ? 'bg-valixen-telemetry-profit/15 text-valixen-telemetry-profit border border-valixen-telemetry-profit/30'
                : 'bg-valixen-telemetry-loss/15 text-valixen-telemetry-loss border border-valixen-telemetry-loss/30'
            }`}
          >
            {isBullish ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {post.sentiment}
          </span>
        )}
      </div>

      {/* Reactions Bar */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 border-t border-white/[0.06]">
        <button
          onClick={() => handleReaction('UPVOTE')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
            post.hasUpvoted
              ? 'bg-valixen-cyan/20 border border-valixen-cyan/60 text-valixen-cyan font-bold'
              : 'bg-white/[0.04] text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{post.upvotes || 0}</span>
        </button>

        <button
          onClick={() => handleReaction('INSIGHTFUL')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
            post.userReactions?.includes('INSIGHTFUL')
              ? 'bg-valixen-violet/30 border border-valixen-violet text-white font-bold'
              : 'bg-white/[0.04] text-slate-400 hover:text-white'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
          <span>Insightful {post.reactions?.INSIGHTFUL ? `(${post.reactions.INSIGHTFUL})` : ''}</span>
        </button>

        <button
          onClick={() => handleReaction('HELPFUL')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
            post.userReactions?.includes('HELPFUL')
              ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-bold'
              : 'bg-white/[0.04] text-slate-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Helpful {post.reactions?.HELPFUL ? `(${post.reactions.HELPFUL})` : ''}</span>
        </button>

        <button
          onClick={() => handleReaction('FIRE')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
            post.userReactions?.includes('FIRE')
              ? 'bg-amber-500/20 border border-amber-500 text-amber-400 font-bold'
              : 'bg-white/[0.04] text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          <span>Fire {post.reactions?.FIRE ? `(${post.reactions.FIRE})` : ''}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-white/[0.04] text-slate-400 hover:text-white ml-auto"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{post.commentsCount || 0} Responses</span>
        </button>
      </div>

      {/* Admin Moderation Bar (Optional) */}
      {isAdmin && (
        <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between text-xs font-mono">
          <span className="text-purple-300 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> Moderation Status: {post.moderationStatus}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAdminModerate('APPROVE')}
              className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
            >
              Approve
            </button>
            <button
              onClick={() => handleAdminModerate('FLAG')}
              className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
            >
              Flag
            </button>
            <button
              onClick={() => handleAdminModerate('REMOVE')}
              className="px-2 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Comments & Answers Thread */}
      {showComments && (
        <div className="pt-4 border-t border-white/[0.08] space-y-4">
          <div className="space-y-3">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comm) => (
                <div
                  key={comm.id}
                  className={`p-3.5 rounded-xl border space-y-1.5 ${
                    comm.isAcceptedSolution
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                      : 'bg-black/30 border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{comm.authorName}</span>
                      <Badge variant="cyan" className="text-[8px] px-1 py-0">
                        {comm.authorRole}
                      </Badge>
                      {comm.isAcceptedSolution && (
                        <span className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                          <Check className="w-3 h-3" /> ACCEPTED SOLUTION
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{comm.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">{comm.content}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 font-mono italic">
                {isQuestion ? 'No answers yet. Share your financial analysis.' : 'No responses yet. Start the conversation.'}
              </p>
            )}
          </div>

          {/* New Comment / Answer Input */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={isQuestion ? 'Write your expert answer...' : 'Contribute to this discussion...'}
              className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-valixen-violet"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmittingComment || !commentText.trim()}
              className="font-mono text-xs px-4"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              {isSubmittingComment ? 'SENDING...' : isQuestion ? 'ANSWER' : 'REPLY'}
            </Button>
          </form>
        </div>
      )}
    </GlassPanel>
  );
}
