// ==============================================================================
// VALIXEN CINEMATIC ARTICLE INTELLIGENCE (/news/[slug])
// Deep Financial Dispatch, Direct Legitimate Attribution & Market Telemetry
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Newspaper,
  Bookmark,
  BookmarkCheck,
  Share2,
  ExternalLink,
  ChevronLeft,
  Clock,
  ShieldCheck,
  Calendar,
  Coins,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Check,
  AlertCircle,
  XCircle,
} from 'lucide-react';

interface NewsArticleDetail {
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

export default function SingleArticlePage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const [article, setArticle] = useState<NewsArticleDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      if (!slug) return;
      try {
        setIsLoading(true);
        setErrorMsg(null);
        const res = await fetch(`/api/v1/news/${slug}`);
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error?.message || 'Article not found');
        }
        setArticle(json.data);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load dispatch');
      } finally {
        setIsLoading(false);
      }
    }
    loadArticle();
  }, [slug]);

  const handleToggleBookmark = async () => {
    if (!article) return;
    const newState = !article.isBookmarked;
    setArticle({ ...article, isBookmarked: newState });

    try {
      await fetch('/api/v1/news/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id }),
      });
    } catch (err) {
      console.error('Failed to update bookmark:', err);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center p-6 text-white font-mono space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-valixen-violet border-t-valixen-ice animate-spin" />
        <p className="text-xs text-slate-400 tracking-wider">LOADING MARKET DISPATCH...</p>
      </div>
    );
  }

  if (errorMsg || !article) {
    return (
      <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center p-6 text-white text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <XCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-display">Dispatch Unavailable</h2>
        <p className="text-xs font-mono text-slate-400 max-w-md">{errorMsg || 'The specified article could not be retrieved.'}</p>
        <Link href="/news">
          <Button variant="default" size="sm" className="font-mono text-xs">
            Back to Financial News
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-valixen-violet selection:text-white">
      {/* 1. Header Toolbar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0A0D14]/90 backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/news"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>All News</span>
            </Link>

            <span className="hidden sm:inline-block text-xs font-mono text-slate-500">
              {article.category.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-slate-400 hover:text-white transition-all flex items-center gap-1.5"
              title="Share article link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
                article.isBookmarked
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">{article.isBookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Article Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Article Metadata Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="px-3 py-1 rounded-full uppercase bg-valixen-violet/20 text-valixen-violet-light border border-valixen-violet/30 font-semibold">
              {article.category.replace('_', ' ')}
            </span>
            <div className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTimeMinutes} min read</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed border-l-2 border-valixen-violet pl-4 py-1">
            {article.summary}
          </p>
        </div>

        {/* Legitimate Source Attribution Card */}
        <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-valixen-ice/5 via-white/[0.02] to-valixen-violet/5 border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-valixen-telemetry-profit/10 border border-valixen-telemetry-profit/20 flex items-center justify-center text-valixen-telemetry-profit shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Direct Official Source Attribution
              </p>
              <h3 className="text-sm font-bold text-white">
                {article.sourceName}
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Author / Office: <span className="text-slate-200">{article.author}</span>
              </p>
            </div>
          </div>

          {article.sourceUrl && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-valixen-ice hover:bg-white/[0.08] transition-all"
            >
              <span>View Source Release</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Hero Image */}
        {article.imageUrl && (
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl h-72 sm:h-96">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090E]/80 via-transparent to-transparent" />
          </div>
        )}

        {/* Article Editorial Content */}
        <article className="prose prose-invert max-w-none text-slate-200 text-base leading-relaxed space-y-6 font-light">
          {article.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-white/[0.06] space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400">Related Topic Tags:</span>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-white/[0.03] text-slate-300 border border-white/[0.06]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Market Navigation Quick Access Banner */}
        <div className="rounded-2xl p-6 bg-gradient-to-r from-[#0E131F] to-[#090C14] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white">Track Impact on Real-Time Markets</h4>
            <p className="text-xs text-slate-400 mt-1">
              Analyze live orderbooks, official CBU exchange rates, or test strategies in paper trading.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/markets">
              <Button variant="secondary" size="sm" className="font-mono text-xs">
                Live Markets
              </Button>
            </Link>
            <Link href="/trading">
              <Button variant="default" size="sm" className="font-mono text-xs">
                Simulated Trading
              </Button>
            </Link>
          </div>
        </div>

        {/* Anti-Fabrication Guarantee Box */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11px] font-mono text-slate-400 space-y-1">
          <p className="text-slate-300 font-semibold">Valixen Institutional Editorial Guarantee</p>
          <p className="leading-relaxed">
            All dispatches adhere to international verification protocols. Valixen strictly prohibits AI hallucinations and ungrounded speculation. Dispatches cite official announcements, statutory filings, or direct institutional news feeds.
          </p>
        </div>
      </main>
    </div>
  );
}
