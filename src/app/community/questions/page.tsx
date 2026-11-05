// ==============================================================================
// VALIXEN FINANCIAL QUESTIONS & ANSWERS (/community/questions)
// Dedicated Q&A forum for financial literacy, budgeting, asset allocation & mechanics
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
  HelpCircle,
  CheckCircle2,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Check,
  AlertCircle,
} from 'lucide-react';

export default function CommunityQuestionsPage() {
  const [questions, setQuestions] = useState<CommunityPostDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNANSWERED' | 'SOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<'NEWEST' | 'TOP' | 'MOST_COMMENTED'>('NEWEST');

  // Modals
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [reportPostId, setReportPostId] = useState<string | null>(null);

  // New Question Form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('FINANCIAL_LITERACY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('type', 'QUESTION');
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedSort) params.set('sort', selectedSort);

      const res = await fetch(`/api/v1/community?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        let fetched: CommunityPostDTO[] = json.data.posts || [];
        if (statusFilter === 'SOLVED') {
          fetched = fetched.filter((q) => q.isAnswered);
        } else if (statusFilter === 'UNANSWERED') {
          fetched = fetched.filter((q) => !q.isAnswered);
        }
        setQuestions(fetched);
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [statusFilter, selectedSort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions();
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/v1/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_POST',
          type: 'QUESTION',
          title: newTitle,
          content: newContent,
          category: newCategory,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to post question');
      }

      setIsQuestionModalOpen(false);
      setNewTitle('');
      setNewContent('');
      fetchQuestions();
    } catch (err: any) {
      setSubmitError(err.message || 'Error publishing question.');
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
            <span className="text-valixen-ice font-bold">FINANCIAL Q&A HUB</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsQuestionModalOpen(true)}
            className="flex items-center gap-2 font-mono text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> ASK A QUESTION
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 sm:px-6 md:px-8 lg:px-8">
        <CommunityNavTabs onOpenRules={() => setIsRulesModalOpen(true)} />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="cyan" dot className="px-2.5 py-0.5 text-[10px] font-mono">
                PEER SOLVERS
              </Badge>
              <span className="text-xs font-mono text-slate-400">FINANCIAL EDUCATION & MECHANICS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              QUESTIONS & ANSWERS
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl font-sans">
              Get clear, mathematically sound answers to your financial questions from ranked allocators and community experts.
            </p>
          </div>

          <Button
            variant="glass"
            size="sm"
            onClick={fetchQuestions}
            disabled={isLoading}
            className="text-xs font-mono self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            REFRESH
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-black/20 p-4 rounded-2xl border border-white/[0.06]">
          {/* Status Pills */}
          <div className="flex items-center gap-2">
            {[
              { id: 'ALL', label: 'All Questions' },
              { id: 'UNANSWERED', label: 'Unanswered' },
              { id: 'SOLVED', label: 'Solved' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  statusFilter === f.id
                    ? 'bg-valixen-cyan/20 border border-valixen-cyan text-valixen-cyan font-bold'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-valixen-cyan"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </form>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs font-mono text-slate-300 focus:outline-none"
            >
              <option value="NEWEST">Newest</option>
              <option value="TOP">Most Helpful</option>
              <option value="MOST_COMMENTED">Most Answers</option>
            </select>
          </div>
        </div>

        {/* Questions Feed */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 font-mono text-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-valixen-cyan" />
              Loading verified questions...
            </div>
          ) : questions.length === 0 ? (
            <GlassPanel variant="prismatic" className="p-12 text-center space-y-3">
              <HelpCircle className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-base font-display font-bold text-white">No questions found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                Have a dilemma about savings, compounding interest, or risk budgeting? Ask the community!
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsQuestionModalOpen(true)}
                className="font-mono text-xs mt-2"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> ASK FIRST QUESTION
              </Button>
            </GlassPanel>
          ) : (
            questions.map((q) => (
              <PostCard
                key={q.id}
                post={q}
                onPostUpdated={fetchQuestions}
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
          onReportSubmitted={fetchQuestions}
        />
      )}

      {/* Modal: Ask Question */}
      <Modal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        title="ASK A FINANCIAL QUESTION"
        size="md"
      >
        <form onSubmit={handleAskQuestion} className="space-y-4 pt-2 sm:px-0 md:px-0 lg:px-0">
          {submitError && (
            <div className="p-3 rounded-xl bg-valixen-telemetry-loss/20 border border-valixen-telemetry-loss/40 text-valixen-telemetry-loss text-xs font-mono">
              {submitError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">QUESTION TITLE</label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. What is the mathematical advantage of annual compounding vs monthly compounding?"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">TOPIC CATEGORY</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs font-mono text-white focus:outline-none"
            >
              <option value="FINANCIAL_LITERACY">Financial Literacy</option>
              <option value="INVESTING_FUNDAMENTALS">Investing Fundamentals</option>
              <option value="MACRO_OUTLOOK">Macroeconomics</option>
              <option value="CRYPTO_ANALYSIS">Crypto Mechanics</option>
              <option value="QUESTIONS">General Financial Questions</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">QUESTION DETAILS</label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Provide background context, figures, or specific scenarios you want answered..."
              required
              rows={4}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-valixen-cyan"
            />
            <p className="text-[10px] text-slate-500 font-mono">
              Remember: Never include passwords, card details, or personal private banking data.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsQuestionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              className="font-mono text-xs"
            >
              {isSubmitting ? 'VALIDATING...' : 'POST QUESTION'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
