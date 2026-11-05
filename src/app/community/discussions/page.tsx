// ==============================================================================
// VALIXEN EDUCATIONAL DISCUSSIONS (/community/discussions)
// Dedicated peer discussions, investment theses, and macro research debates
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { CommunityPostDTO } from '@/server/services/community.service';
import { CommunityNavTabs } from '@/components/community/CommunityNavTabs';
import { CommunityRulesModal } from '@/components/community/CommunityRulesModal';
import { ReportModal } from '@/components/community/ReportModal';
import { PostCard } from '@/components/community/PostCard';
import {
  MessageSquare,
  Sparkles,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';

export default function CommunityDiscussionsPage() {
  const [posts, setPosts] = useState<CommunityPostDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<'NEWEST' | 'TOP' | 'MOST_COMMENTED'>('NEWEST');

  // Modals
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [reportPostId, setReportPostId] = useState<string | null>(null);

  // New Discussion Form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('FINANCIAL_LITERACY');
  const [newAsset, setNewAsset] = useState('');
  const [newSentiment, setNewSentiment] = useState<'BULLISH' | 'BEARISH' | 'NEUTRAL'>('NEUTRAL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchDiscussions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('type', 'DISCUSSION');
      if (selectedCategory !== 'ALL') params.set('category', selectedCategory);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedSort) params.set('sort', selectedSort);

      const res = await fetch(`/api/v1/community?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setPosts(json.data.posts || []);
      }
    } catch (err) {
      console.error('Failed to load discussions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [selectedCategory, selectedSort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDiscussions();
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/v1/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_POST',
          type: 'DISCUSSION',
          title: newTitle,
          content: newContent,
          category: newCategory,
          assetSymbol: newAsset || undefined,
          sentiment: newSentiment,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to submit discussion');
      }

      setIsPostModalOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewAsset('');
      fetchDiscussions();
    } catch (err: any) {
      setSubmitError(err.message || 'Error publishing discussion.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <span className="text-valixen-ice font-bold">EDUCATIONAL DISCUSSIONS</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center gap-2 font-mono text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> START DISCUSSION
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 sm:px-6 md:px-8 lg:px-8">
        <CommunityNavTabs onOpenRules={() => setIsRulesModalOpen(true)} />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="violet" dot className="px-2.5 py-0.5 text-[10px] font-mono">
                THOUGHT LEADERSHIP
              </Badge>
              <span className="text-xs font-mono text-slate-400">FINANCIAL DISCUSSIONS & MODELS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              EDUCATIONAL DISCUSSIONS
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl font-sans">
              Peer-reviewed debates on macroeconomic trends, capital allocation theory, portfolio rebalancing, and algorithmic backtests.
            </p>
          </div>

          <Button
            variant="glass"
            size="sm"
            onClick={fetchDiscussions}
            disabled={isLoading}
            className="text-xs font-mono self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            REFRESH
          </Button>
        </div>

        {/* Categories & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-black/20 p-4 rounded-2xl border border-white/[0.06]">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> CATEGORY:
            </span>
            {[
              { id: 'ALL', label: 'All Discussions' },
              { id: 'FINANCIAL_LITERACY', label: 'Financial Literacy' },
              { id: 'INVESTING_FUNDAMENTALS', label: 'Investing' },
              { id: 'MACRO_OUTLOOK', label: 'Macro Outlook' },
              { id: 'CRYPTO_ANALYSIS', label: 'Crypto Analysis' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-valixen-violet text-white font-bold shadow-glow-violet'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search discussions..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-valixen-violet"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </form>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs font-mono text-slate-300 focus:outline-none"
            >
              <option value="NEWEST">Newest</option>
              <option value="TOP">Most Insightful</option>
              <option value="MOST_COMMENTED">Most Responses</option>
            </select>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 font-mono text-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-valixen-violet" />
              Loading discussions...
            </div>
          ) : posts.length === 0 ? (
            <GlassPanel variant="prismatic" className="p-12 text-center space-y-3">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-base font-display font-bold text-white">No discussions found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                Be the first to publish a verified macro thesis or portfolio allocation strategy.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsPostModalOpen(true)}
                className="font-mono text-xs mt-2"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> START FIRST DISCUSSION
              </Button>
            </GlassPanel>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostUpdated={fetchDiscussions}
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
          onReportSubmitted={fetchDiscussions}
        />
      )}

      {/* Modal: New Discussion */}
      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title="START AN EDUCATIONAL DISCUSSION"
        size="md"
      >
        <form onSubmit={handleCreateDiscussion} className="space-y-4 pt-2 sm:px-0 md:px-0 lg:px-0">
          {submitError && (
            <div className="p-3 rounded-xl bg-valixen-telemetry-loss/20 border border-valixen-telemetry-loss/40 text-valixen-telemetry-loss text-xs font-mono">
              {submitError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">DISCUSSION TITLE</label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Real Yield Dynamics: Central Bank of Uzbekistan vs Emerging Market Peers"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">CATEGORY</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs font-mono text-white focus:outline-none"
              >
                <option value="FINANCIAL_LITERACY">Financial Literacy</option>
                <option value="INVESTING_FUNDAMENTALS">Investing Fundamentals</option>
                <option value="MACRO_OUTLOOK">Macroeconomics</option>
                <option value="CRYPTO_ANALYSIS">Crypto Education</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">TICKER / ASSET (OPTIONAL)</label>
              <Input
                value={newAsset}
                onChange={(e) => setNewAsset(e.target.value)}
                placeholder="e.g. BTC, XAU, UZS"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">YOUR THESIS / ANALYSIS</label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Outline your qualitative rationale, liquidity parameters, and risk disclosures..."
              required
              rows={5}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-valixen-violet"
            />
            <p className="text-[10px] text-slate-500 font-mono">
              Policy Compliance: No guaranteed returns, get-rich-quick claims, or private account credentials.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsPostModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              className="font-mono text-xs"
            >
              {isSubmitting ? 'VALIDATING RULES...' : 'POST DISCUSSION'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
