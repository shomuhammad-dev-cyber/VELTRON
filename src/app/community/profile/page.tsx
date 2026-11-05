// ==============================================================================
// VALIXEN COMMUNITY REPUTATION PROFILE (/community/profile)
// Merit Ranking, XP, Badges, User Discussions, Questions & Bookmarks
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CommunityPostDTO, UserCommunityProfileDTO } from '@/server/services/community.service';
import { CommunityNavTabs } from '@/components/community/CommunityNavTabs';
import { CommunityRulesModal } from '@/components/community/CommunityRulesModal';
import { ReportModal } from '@/components/community/ReportModal';
import { PostCard } from '@/components/community/PostCard';
import {
  User,
  Award,
  Sparkles,
  Bookmark,
  MessageSquare,
  HelpCircle,
  CheckCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function CommunityProfilePage() {
  const [profile, setProfile] = useState<UserCommunityProfileDTO | null>(null);
  const [posts, setPosts] = useState<CommunityPostDTO[]>([]);
  const [activeTab, setActiveTab] = useState<'DISCUSSIONS' | 'QUESTIONS' | 'BOOKMARKS'>('DISCUSSIONS');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [reportPostId, setReportPostId] = useState<string | null>(null);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch profile metrics
      const profRes = await fetch('/api/v1/community?profile=me');
      const profJson = await profRes.json();
      if (profJson.success && profJson.data) {
        setProfile(profJson.data.profile);
      }

      // 2. Fetch tab content
      let query = '';
      if (activeTab === 'BOOKMARKS') {
        query = '?onlyBookmarked=true';
      } else if (activeTab === 'QUESTIONS') {
        query = '?type=QUESTION';
      } else {
        query = '?type=DISCUSSION';
      }

      const postsRes = await fetch(`/api/v1/community${query}`);
      const postsJson = await postsRes.json();
      if (postsJson.success && postsJson.data) {
        setPosts(postsJson.data.posts || []);
      }
    } catch (err) {
      console.error('Failed to load profile details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col font-sans selection:bg-valixen-violet selection:text-white sm:px-0 md:px-0 lg:px-0">
      {/* Header */}
      <header className="h-16 border-b border-white/[0.08] bg-[#0A0D14]/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo variant="main" size="sm" />
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">/</span>
            <span className="text-valixen-ice font-bold">REPUTATION & PROFILE</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/ranking">
            <Button variant="ghost" size="sm" className="font-mono text-xs text-slate-300">
              <Award className="w-3.5 h-3.5 mr-1.5 text-valixen-gold" /> Global Leaderboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 sm:px-6 md:px-8 lg:px-8">
        <CommunityNavTabs onOpenRules={() => setIsRulesModalOpen(true)} />

        {/* User Profile Header Card */}
        {profile && (
          <GlassPanel variant="prismatic" className="p-6 sm:p-8 space-y-6 border-valixen-violet/30 sm:px-8 md:px-8 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-valixen-violet via-indigo-600 to-valixen-cyan flex items-center justify-center font-bold text-xl sm:text-2xl text-white shadow-glow-violet">
                  QA
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-display font-extrabold text-white">{profile.displayName}</h2>
                    <Badge variant="cyan" className="font-mono text-[10px]">
                      {profile.role}
                    </Badge>
                    <Badge variant="gold" className="font-mono text-[10px]">
                      {profile.rank}
                    </Badge>
                  </div>
                  <p className="text-xs font-mono text-valixen-ice mt-1 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-valixen-gold" />
                    {profile.level} • <span className="text-white font-bold">{profile.xp.toLocaleString()} Total XP</span>
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Member since {profile.joinedAt} • Verified Academic Contributor
                  </p>
                </div>
              </div>

              {/* Merit Badges */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
                  Verified Merit Badges
                </span>
                <div className="flex flex-wrap gap-1.5 max-w-md">
                  {profile.badges.map((b, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/[0.08] text-xs font-mono text-slate-300 flex items-center gap-1"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/[0.08]">
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/[0.06] text-center">
                <div className="text-xs font-mono text-slate-400">DISCUSSIONS</div>
                <div className="text-xl font-bold font-display text-white mt-1">
                  {profile.discussionsCount}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/[0.06] text-center">
                <div className="text-xs font-mono text-slate-400">QUESTIONS</div>
                <div className="text-xl font-bold font-display text-white mt-1">
                  {profile.questionsCount}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/[0.06] text-center">
                <div className="text-xs font-mono text-emerald-400">ACCEPTED SOLUTIONS</div>
                <div className="text-xl font-bold font-display text-emerald-400 mt-1">
                  {profile.solutionsAccepted}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/[0.06] text-center">
                <div className="text-xs font-mono text-valixen-gold">REACTIONS EARNED</div>
                <div className="text-xl font-bold font-display text-valixen-gold mt-1">
                  {profile.totalReactionsReceived}
                </div>
              </div>
            </div>
          </GlassPanel>
        )}

        {/* Tab Controls: Discussions, Questions, Bookmarks */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
          <button
            onClick={() => setActiveTab('DISCUSSIONS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === 'DISCUSSIONS'
                ? 'bg-valixen-violet text-white font-bold shadow-glow-violet'
                : 'bg-white/[0.04] text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>My Discussions</span>
          </button>

          <button
            onClick={() => setActiveTab('QUESTIONS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === 'QUESTIONS'
                ? 'bg-valixen-cyan text-black font-bold'
                : 'bg-white/[0.04] text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>My Questions</span>
          </button>

          <button
            onClick={() => setActiveTab('BOOKMARKS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === 'BOOKMARKS'
                ? 'bg-valixen-gold text-black font-bold'
                : 'bg-white/[0.04] text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Bookmarks</span>
          </button>

          <Button
            variant="glass"
            size="sm"
            onClick={fetchProfileData}
            disabled={isLoading}
            className="text-xs font-mono ml-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            REFRESH
          </Button>
        </div>

        {/* Posts in Tab */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 font-mono text-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-valixen-violet" />
              Loading profile records...
            </div>
          ) : posts.length === 0 ? (
            <GlassPanel variant="prismatic" className="p-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-base font-display font-bold text-white">No items found in this section</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                {activeTab === 'BOOKMARKS'
                  ? 'You have not saved any dispatches to bookmarks yet. Browse the community and bookmark insightful threads.'
                  : 'You have not published any entries in this category yet.'}
              </p>
            </GlassPanel>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostUpdated={fetchProfileData}
                onReportClick={(id) => setReportPostId(id)}
              />
            ))
          )}
        </div>
      </main>

      <CommunityRulesModal isOpen={isRulesModalOpen} onClose={() => setIsRulesModalOpen(false)} />

      {reportPostId && (
        <ReportModal
          isOpen={true}
          onClose={() => setReportPostId(null)}
          postId={reportPostId}
          onReportSubmitted={fetchProfileData}
        />
      )}
    </div>
  );
}
