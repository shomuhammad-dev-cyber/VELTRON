// ==============================================================================
// VALIXEN FINANCIAL NEWS & MARKET DISPATCHES (/news)
// Curated Legitimate Market Feeds, Direct Source Attribution, Bookmarks & Admin Publishing
// Strictly Zero-Fabrication Architecture
// ==============================================================================

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import {
  Newspaper,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Search,
  Filter,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Coins,
  Landmark,
  Layers,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertCircle,
  Share2,
  Lock,
} from 'lucide-react';

interface NewsArticleItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: 'GLOBAL_FINANCE' | 'CRYPTO' | 'CURRENCY_MARKETS' | 'ECONOMIC_POLICY' | 'AI_FINANCE';
  sourceName: string;
  sourceUrl: string;
  author: string;
  publishedAt: string;
  imageUrl?: string;
  tags: string[];
  readTimeMinutes: number;
  isFeatured: boolean;
  isBookmarked?: boolean;
}

const CATEGORY_TABS = [
  { id: 'ALL', label: 'All Dispatches' },
  { id: 'GLOBAL_FINANCE', label: 'Global Finance & BIS' },
  { id: 'CRYPTO', label: 'Digital Assets & ETFs' },
  { id: 'CURRENCY_MARKETS', label: 'CBU & Currency Markets' },
  { id: 'ECONOMIC_POLICY', label: 'Macro & Policy' },
  { id: 'AI_FINANCE', label: 'AI & Algorithmic Regs' },
];

export default function FinancialNewsPage() {
  const [articles, setArticles] = useState<NewsArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  // Admin Publishing Modal State
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);
  const [publishErrorMsg, setPublishErrorMsg] = useState<string | null>(null);

  // Form fields
  const [newArticle, setNewArticle] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'GLOBAL_FINANCE',
    sourceName: '',
    sourceUrl: '',
    author: '',
    imageUrl: '',
    tags: '',
    readTimeMinutes: 4,
    isFeatured: false,
  });

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'ALL') queryParams.set('category', selectedCategory);
      if (searchQuery.trim()) queryParams.set('search', searchQuery.trim());
      if (onlyBookmarked) queryParams.set('bookmarkedOnly', 'true');

      const res = await fetch(`/api/v1/news?${queryParams.toString()}`);
      const json = await res.json();
      if (json.data?.articles) {
        setArticles(json.data.articles);
      }
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, onlyBookmarked]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  // Toggle Bookmark
  const handleToggleBookmark = async (articleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic toggle
    setArticles((prev) =>
      prev.map((a) => (a.id === articleId ? { ...a, isBookmarked: !a.isBookmarked } : a))
    );

    try {
      const res = await fetch('/api/v1/news/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message);
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      // Revert on error
      setArticles((prev) =>
        prev.map((a) => (a.id === articleId ? { ...a, isBookmarked: !a.isBookmarked } : a))
      );
    }
  };

  // Submit Admin Article
  const handlePublishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingArticle(true);
    setPublishErrorMsg(null);
    setPublishSuccessMsg(null);

    try {
      const res = await fetch('/api/v1/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newArticle,
          slug: newArticle.slug || newArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          tags: newArticle.tags.split(',').map((t) => t.trim()).filter(Boolean),
          readTimeMinutes: Number(newArticle.readTimeMinutes) || 4,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || json.data?.error || 'Failed to publish article');
      }

      setPublishSuccessMsg('Dispatch successfully published with verified attribution.');
      setTimeout(() => {
        setIsAdminModalOpen(false);
        setPublishSuccessMsg(null);
        fetchArticles();
      }, 1500);
    } catch (err: any) {
      setPublishErrorMsg(err.message || 'Authorization or validation error');
    } finally {
      setIsSubmittingArticle(false);
    }
  };

  const featuredArticle = useMemo(() => {
    return articles.find((a) => a.isFeatured) || articles[0];
  }, [articles]);

  const regularArticles = useMemo(() => {
    if (!featuredArticle) return articles;
    return articles.filter((a) => a.id !== featuredArticle.id);
  }, [articles, featuredArticle]);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-valixen-violet selection:text-white">
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0A0D14]/85 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Logo variant="main" size="md" />
            </Link>

            <nav className="hidden lg:flex items-center gap-1 p-1 bg-white/[0.02] rounded-xl border border-white/[0.06] text-xs font-mono">
              <Link href="/dashboard" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                Dashboard
              </Link>
              <Link href="/markets" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                Markets
              </Link>
              <Link href="/trading" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                Trading
              </Link>
              <Link href="/wallet" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                Wallet
              </Link>
              <Link href="/analytics" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                Analytics
              </Link>
              <Link href="/ai-assistant" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                AI Assistant
              </Link>
              <Link href="/education" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                Academy
              </Link>
              <Link
                href="/news"
                className="px-3 py-1.5 rounded-lg text-valixen-violet font-semibold bg-valixen-violet/10 border border-valixen-violet/25 transition-all flex items-center gap-1.5"
              >
                <Newspaper className="w-3.5 h-3.5 text-valixen-ice" />
                News
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsAdminModalOpen(true)}
              variant="secondary"
              size="sm"
              className="text-xs font-mono flex items-center gap-1.5 bg-white/[0.03] border-white/[0.1] hover:bg-white/[0.06]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish Dispatch</span>
            </Button>

            <button
              onClick={() => setOnlyBookmarked(!onlyBookmarked)}
              className={`p-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
                onlyBookmarked
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white'
              }`}
              title="Filter Saved Bookmarks"
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Saved</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Anti-Fabrication Notice Ribbon */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-valixen-telemetry-profit" />
            <span>EDITORIAL CODE: Direct official attribution. Legitimate public source citations only.</span>
          </div>
          <span className="hidden sm:inline text-valixen-ice">CBU • BIS • IMF • COINDESK VERIFIED</span>
        </div>

        {/* 3. Featured Cinematic Hero Article */}
        {featuredArticle && !onlyBookmarked && selectedCategory === 'ALL' && (
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.1] bg-[#0A0D15] shadow-2xl group">
            {featuredArticle.imageUrl && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(${featuredArticle.imageUrl})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/80 to-transparent" />

            <div className="relative z-10 p-6 sm:p-10 max-w-4xl space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-valixen-violet/30 text-white border border-valixen-violet/50">
                  Featured Dispatch
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/[0.08] text-valixen-ice border border-white/[0.1]">
                  {featuredArticle.category.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{featuredArticle.readTimeMinutes} min read</span>
                </div>
              </div>

              <Link href={`/news/${featuredArticle.slug}`}>
                <h2 className="text-2xl sm:text-4xl font-display font-bold text-white hover:text-valixen-ice transition-colors tracking-tight leading-tight">
                  {featuredArticle.title}
                </h2>
              </Link>

              <p className="text-sm text-slate-300 leading-relaxed font-light max-w-3xl">
                {featuredArticle.summary}
              </p>

              {/* Attribution and Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="text-slate-500">Source:</span>
                  <a
                    href={featuredArticle.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-valixen-ice hover:underline flex items-center gap-1"
                  >
                    <span>{featuredArticle.sourceName}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-600">•</span>
                  <span>{new Date(featuredArticle.publishedAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleToggleBookmark(featuredArticle.id, e)}
                    className={`p-2 rounded-xl border text-xs font-mono transition-all ${
                      featuredArticle.isBookmarked
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <Link href={`/news/${featuredArticle.slug}`}>
                    <Button variant="default" size="sm" className="font-mono text-xs flex items-center gap-1.5">
                      <span>Read Full Dispatch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Filter Toolbar & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-valixen-violet/20 text-white border border-valixen-violet/40 shadow-glow-violet font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search news or symbols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D111A] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-valixen-ice transition-colors"
            />
          </form>
        </div>

        {/* 5. Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <Newspaper className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No articles matched your filter</h3>
            <p className="text-xs text-slate-400">
              {onlyBookmarked ? 'You have no saved bookmarked articles yet.' : 'Try adjusting your search criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(onlyBookmarked ? articles : regularArticles).map((article) => (
              <div
                key={article.id}
                className="group relative rounded-2xl p-5 bg-gradient-to-br from-[#0C101A]/90 to-[#0A0D15]/90 border border-white/[0.08] hover:border-valixen-violet/40 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-valixen-violet/10"
              >
                <div className="space-y-3">
                  {/* Category & Bookmark */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/[0.04] text-valixen-ice border border-white/[0.08]">
                      {article.category.replace('_', ' ')}
                    </span>

                    <button
                      onClick={(e) => handleToggleBookmark(article.id, e)}
                      className={`p-1.5 rounded-lg border text-xs font-mono transition-all ${
                        article.isBookmarked
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white'
                      }`}
                      title={article.isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Headline */}
                  <Link href={`/news/${article.slug}`}>
                    <h3 className="text-base font-bold text-white group-hover:text-valixen-ice transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>

                  {/* Summary */}
                  <p className="text-xs text-slate-400 leading-relaxed font-light line-clamp-3">
                    {article.summary}
                  </p>
                </div>

                {/* Footer Attribution */}
                <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[11px] text-slate-300">
                      <ShieldCheck className="w-3 h-3 text-valixen-telemetry-profit" />
                      <span className="truncate max-w-[140px]">{article.sourceName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>

                  <Link href={`/news/${article.slug}`}>
                    <span className="text-valixen-violet hover:text-valixen-ice transition-colors flex items-center gap-1 text-[11px] font-semibold">
                      Read
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 6. Admin Publishing Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative max-w-2xl w-full rounded-3xl bg-[#0C101A] border border-white/[0.1] p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-valixen-violet" />
                <h3 className="text-lg font-bold text-white font-display">Publish Financial Dispatch</h3>
              </div>
              <button
                onClick={() => setIsAdminModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handlePublishArticle} className="space-y-4">
              <div className="p-3 rounded-xl bg-valixen-violet/10 border border-valixen-violet/20 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-1.5 text-valixen-ice font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin / Compliance Officer Protected Route</span>
                </div>
                <p className="mt-1 text-slate-400">
                  All dispatches require legitimate public source attribution. Never submit fabricated stories or unverified price rumours.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400">Headline *</label>
                <input
                  type="text"
                  required
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  placeholder="e.g. Central Bank Announces Monetary Policy Rate"
                  className="w-full mt-1 bg-[#07090E] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-valixen-ice"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400">Category *</label>
                  <select
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value as any })}
                    className="w-full mt-1 bg-[#07090E] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-valixen-ice"
                  >
                    <option value="GLOBAL_FINANCE">Global Finance & BIS</option>
                    <option value="CRYPTO">Crypto & Digital Assets</option>
                    <option value="CURRENCY_MARKETS">Currency Markets & CBU</option>
                    <option value="ECONOMIC_POLICY">Economic Policy</option>
                    <option value="AI_FINANCE">AI Finance Standards</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400">Legitimate Source Name *</label>
                  <input
                    type="text"
                    required
                    value={newArticle.sourceName}
                    onChange={(e) => setNewArticle({ ...newArticle, sourceName: e.target.value })}
                    placeholder="e.g. Central Bank of Uzbekistan (CBU) / BIS"
                    className="w-full mt-1 bg-[#07090E] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-valixen-ice"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400">Source URL</label>
                  <input
                    type="url"
                    value={newArticle.sourceUrl}
                    onChange={(e) => setNewArticle({ ...newArticle, sourceUrl: e.target.value })}
                    placeholder="https://cbu.uz/..."
                    className="w-full mt-1 bg-[#07090E] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-valixen-ice"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400">Author / Department</label>
                  <input
                    type="text"
                    value={newArticle.author}
                    onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                    placeholder="e.g. Monetary Policy Desk"
                    className="w-full mt-1 bg-[#07090E] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-valixen-ice"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400">Executive Summary *</label>
                <textarea
                  required
                  rows={2}
                  value={newArticle.summary}
                  onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                  placeholder="Concise overview of the regulatory or financial market development..."
                  className="w-full mt-1 bg-[#07090E] border border-white/[0.08] rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-valixen-ice"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400">Full Editorial Content *</label>
                <textarea
                  required
                  rows={4}
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  placeholder="Detailed factual paragraphs, quotations, and official data..."
                  className="w-full mt-1 bg-[#07090E] border border-white/[0.08] rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-valixen-ice"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newArticle.tags}
                  onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
                  placeholder="CBU, Inflation, UZS, Rates"
                  className="w-full mt-1 bg-[#07090E] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-valixen-ice"
                />
              </div>

              {publishErrorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{publishErrorMsg}</span>
                </div>
              )}

              {publishSuccessMsg && (
                <div className="p-3 rounded-xl bg-valixen-telemetry-profit/10 border border-valixen-telemetry-profit/20 text-emerald-300 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{publishSuccessMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="font-mono text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingArticle}
                  variant="default"
                  size="sm"
                  className="font-mono text-xs"
                >
                  {isSubmittingArticle ? 'Verifying & Publishing...' : 'Publish Official Dispatch'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
