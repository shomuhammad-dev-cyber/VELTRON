// ==============================================================================
// VALIXEN GLOBAL FINANCIAL COMMUNITY (/community)
// Verified Peer Network, Educational Discussions, Q&A, and Sentiment Radar
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
import { CommunityPostDTO, MarketSentimentOverview } from '@/server/services/community.service';
import { CommunityNavTabs } from '@/components/community/CommunityNavTabs';
import { CommunityRulesModal } from '@/components/community/CommunityRulesModal';
import { ReportModal } from '@/components/community/ReportModal';
import { PostCard } from '@/components/community/PostCard';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';
import {
  Users,
  MessageSquare,
  Sparkles,
  Plus,
  RefreshCw,
  Search,
  Globe,
  Filter,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function GlobalCommunityPage() {
  const [posts, setPosts] = useState<CommunityPostDTO[]>([]);
  const [sentiment, setSentiment] = useState<MarketSentimentOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<'NEWEST' | 'TOP' | 'MOST_COMMENTED'>('NEWEST');

  // Modals
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [reportPostId, setReportPostId] = useState<string | null>(null);

  // New Post Form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<'DISCUSSION' | 'QUESTION'>('DISCUSSION');
  const [newCategory, setNewCategory] = useState('FINANCIAL_LITERACY');
  const [newAsset, setNewAsset] = useState('');
  const [newSentiment, setNewSentiment] = useState<'BULLISH' | 'BEARISH' | 'NEUTRAL'>('NEUTRAL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchCommunity = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') params.set('category', selectedCategory);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedSort) params.set('sort', selectedSort);

      const res = await fetch(`/api/v1/community?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setPosts(json.data.posts || []);
        setSentiment(json.data.sentiment || null);
      }
    } catch (err) {
      console.error('Failed to load community feed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, [selectedCategory, selectedSort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCommunity();
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/v1/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_POST',
          title: newTitle,
          content: newContent,
          type: newType,
          category: newCategory,
          assetSymbol: newAsset || undefined,
          sentiment: newSentiment,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to submit post');
      }

      setIsPostModalOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewAsset('');
      fetchCommunity();
    } catch (err: any) {
      setSubmitError(err.message || 'Error publishing post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090706] text-[#FAF7F1] flex flex-col font-sans selection:bg-[#C6A477]/30 selection:text-white sm:px-0 md:px-0 lg:px-0">
      {/* 1. Global Navigation Bar */}
      <LuxuryNavbar />

      {/* 2. Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 sm:px-6 md:px-8 lg:px-8">
        {/* Unified Community Navigation */}
        <CommunityNavTabs onOpenRules={() => setIsRulesModalOpen(true)} />

        {/* Page Title & Mission Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="cyan" dot className="px-2.5 py-0.5 text-[10px] font-mono">
                VERIFIED PEER NETWORK
              </Badge>
              <span className="text-xs font-mono text-slate-400">FINANCIAL LITERACY & QUANT INTELLIGENCE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              GLOBAL FINANCIAL COMMUNITY
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl font-sans">
              Collaborative hub for macro discussions, educational questions, and cross-asset sentiment radar. Protected by zero-fraud and anti-scam compliance algorithms.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button
              variant="glass"
              size="sm"
              onClick={fetchCommunity}
              disabled={isLoading}
              className="text-xs font-mono"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              REFRESH
            </Button>
          </div>
        </div>

        {/* Real-Time Sentiment Radar */}
        {sentiment && (
          <GlassPanel variant="prismatic" className="p-6 space-y-4 border-valixen-violet/30 sm:px-6 md:px-6 lg:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-valixen-ice" />
                <h3 className="font-display font-bold text-white text-base">MACRO SENTIMENT RADAR</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                SAMPLE: {sentiment.totalVotes.toLocaleString()} ALLOCATORS WORLDWIDE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div className="p-4 rounded-xl bg-black/30 border border-white/[0.06] space-y-2">
                <div className="flex justify-between items-baseline font-mono text-xs">
                  <span className="text-white font-bold">BITCOIN (BTC/USD)</span>
                  <span className="text-valixen-telemetry-profit font-bold">{sentiment.btcBullishPercent}% BULLISH</span>
                </div>
                <div className="w-full bg-white/[0.08] rounded-full h-2 overflow-hidden">
                  <div className="bg-valixen-telemetry-profit h-full rounded-full" style={{ width: `${sentiment.btcBullishPercent}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/30 border border-white/[0.06] space-y-2">
                <div className="flex justify-between items-baseline font-mono text-xs">
                  <span className="text-white font-bold">GOLD SPOT (XAU/USD)</span>
                  <span className="text-valixen-telemetry-profit font-bold">{sentiment.goldBullishPercent}% BULLISH</span>
                </div>
                <div className="w-full bg-white/[0.08] rounded-full h-2 overflow-hidden">
                  <div className="bg-valixen-gold h-full rounded-full" style={{ width: `${sentiment.goldBullishPercent}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/30 border border-white/[0.06] space-y-2">
                <div className="flex justify-between items-baseline font-mono text-xs">
                  <span className="text-white font-bold">USD/UZS EXCHANGE RATE</span>
                  <span className="text-valixen-ice font-bold">{sentiment.usdUzsBullishPercent}% STABLE HEDGE</span>
                </div>
                <div className="w-full bg-white/[0.08] rounded-full h-2 overflow-hidden">
                  <div className="bg-valixen-ice h-full rounded-full" style={{ width: `${sentiment.usdUzsBullishPercent}%` }} />
                </div>
              </div>
            </div>
          </GlassPanel>
        )}

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-black/20 p-4 rounded-2xl border border-white/[0.06]">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> TOPIC:
            </span>
            {[
              { id: 'ALL', label: 'All Topics' },
              { id: 'FINANCIAL_LITERACY', label: 'Financial Literacy' },
              { id: 'INVESTING_FUNDAMENTALS', label: 'Investing' },
              { id: 'MACRO_OUTLOOK', label: 'Macro' },
              { id: 'CRYPTO_ANALYSIS', label: 'Crypto' },
              { id: 'QUESTIONS', label: 'Q&A' },
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

          {/* Search Bar & Sort */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics or keywords..."
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
              <option value="TOP">Most Upvoted</option>
              <option value="MOST_COMMENTED">Most Responses</option>
            </select>
          </div>
        </div>

        {/* Posts & Questions Feed */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 font-mono text-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-valixen-violet" />
              Loading verified dispatches...
            </div>
          ) : posts.length === 0 ? (
            <GlassPanel variant="prismatic" className="p-12 text-center space-y-3">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-base font-display font-bold text-white">No dispatches found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                No discussions or questions match your current topic filter. Start the discourse with a new dispatch.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsPostModalOpen(true)}
                className="font-mono text-xs mt-2"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> CREATE FIRST POST
              </Button>
            </GlassPanel>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostUpdated={fetchCommunity}
                onReportClick={(id) => setReportPostId(id)}
              />
            ))
          )}
        </div>
      </main>

      {/* Rules Modal */}
      <CommunityRulesModal isOpen={isRulesModalOpen} onClose={() => setIsRulesModalOpen(false)} />

      {/* Report Modal */}
      {reportPostId && (
        <ReportModal
          isOpen={true}
          onClose={() => setReportPostId(null)}
          postId={reportPostId}
          onReportSubmitted={fetchCommunity}
        />
      )}

      {/* Create Dispatch / Question Modal */}
      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title="SUBMIT COMMUNITY DISPATCH OR QUESTION"
        size="md"
      >
        <form onSubmit={handleCreatePost} className="space-y-4 pt-2 sm:px-0 md:px-0 lg:px-0">
          {submitError && (
            <div className="p-3 rounded-xl bg-valixen-telemetry-loss/20 border border-valixen-telemetry-loss/40 text-valixen-telemetry-loss text-xs font-mono">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setNewType('DISCUSSION')}
              className={`p-3 rounded-xl border text-xs font-mono transition-all text-center ${
                newType === 'DISCUSSION'
                  ? 'bg-valixen-violet/20 border-valixen-violet text-white font-bold'
                  : 'bg-black/30 border-white/[0.08] text-slate-400'
              }`}
            >
              💬 EDUCATIONAL DISCUSSION
            </button>
            <button
              type="button"
              onClick={() => setNewType('QUESTION')}
              className={`p-3 rounded-xl border text-xs font-mono transition-all text-center ${
                newType === 'QUESTION'
                  ? 'bg-valixen-cyan/20 border-valixen-cyan text-white font-bold'
                  : 'bg-black/30 border-white/[0.08] text-slate-400'
              }`}
            >
              ❓ ASK A QUESTION
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">TITLE / TOPIC</label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={newType === 'QUESTION' ? 'e.g. How does dollar-cost averaging reduce downside volatility?' : 'e.g. Analysis of Q1 2026 Sovereign Bond Yield Inversions'}
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
                <option value="QUESTIONS">General Q&A</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">ASSET SYMBOL (OPTIONAL)</label>
              <Input
                value={newAsset}
                onChange={(e) => setNewAsset(e.target.value)}
                placeholder="e.g. BTC, XAU, USD/UZS"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">CONTENT & METHODOLOGY</label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Provide analytical context or describe your question with specific parameters..."
              required
              rows={4}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-valixen-violet"
            />
            <p className="text-[10px] text-slate-500 font-mono">
              Zero-Tolerance: No investment profit guarantees, get-rich-quick claims, or private credentials.
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
              {isSubmitting ? 'VERIFYING COMPLIANCE...' : 'PUBLISH DISPATCH'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Luxury Footer */}
      <LuxuryFooter />
    </div>
  );
}
