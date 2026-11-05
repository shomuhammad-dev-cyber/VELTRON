// ==============================================================================
// VALIXEN FINANCIAL ACADEMY & EDUCATION HUB (/education)
// Institutional Financial Literacy, Interactive Lessons, Quizzes & Certification
// ==============================================================================

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';
import {
  GraduationCap,
  BookOpen,
  Award,
  Trophy,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Coins,
  Landmark,
  Layers,
  ChevronRight,
  Play,
  HelpCircle,
  Newspaper,
} from 'lucide-react';

interface CourseItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: string;
  xpReward: number;
  icon: string;
  lessonsCount: number;
  completedLessonsCount: number;
  progressPercent: number;
  isCompleted: boolean;
}

const CATEGORY_TABS = [
  { id: 'ALL', label: 'All Disciplines' },
  { id: 'BANKING_FUNDAMENTALS', label: 'Banking & Reserves' },
  { id: 'BUDGETING', label: 'Budgeting & Cashflow' },
  { id: 'CRYPTOCURRENCY', label: 'Crypto & Digital Assets' },
  { id: 'INVESTMENT', label: 'Portfolio & Investing' },
];

const INITIAL_COURSES: CourseItem[] = [
  {
    id: 'course-banking-fundamentals',
    slug: 'banking-fundamentals',
    title: 'Modern Banking & Liquidity Architecture',
    description: 'Master the mechanics of modern digital banking, clearing houses, settlement networks, and liquid vault custody.',
    category: 'BANKING_FUNDAMENTALS',
    level: 'BEGINNER',
    duration: '35 min',
    xpReward: 150,
    icon: 'Landmark',
    lessonsCount: 3,
    completedLessonsCount: 1,
    progressPercent: 33,
    isCompleted: false,
  },
  {
    id: 'course-budgeting-cashflow',
    slug: 'budgeting-cashflow',
    title: 'Institutional Cash Flow & Capital Allocation',
    description: 'Deploy advanced budgeting frameworks: 50/30/20 allocation, automated savings vaults, and zero-based capital reserves.',
    category: 'BUDGETING_CASHFLOW',
    level: 'BEGINNER',
    duration: '40 min',
    xpReward: 180,
    icon: 'Coins',
    lessonsCount: 3,
    completedLessonsCount: 2,
    progressPercent: 66,
    isCompleted: false,
  },
  {
    id: 'course-crypto-digital-assets',
    slug: 'crypto-digital-assets',
    title: 'Cryptographic Networks & Digital Asset Custody',
    description: 'Understand blockchain consensus, UTXO vs account models, smart contracts, on-chain telemetry, and cold storage.',
    category: 'CRYPTOCURRENCY',
    level: 'INTERMEDIATE',
    duration: '50 min',
    xpReward: 250,
    icon: 'Layers',
    lessonsCount: 3,
    completedLessonsCount: 0,
    progressPercent: 0,
    isCompleted: false,
  },
  {
    id: 'course-portfolio-investing',
    slug: 'portfolio-investing',
    title: 'Modern Portfolio Theory & Asset Allocation',
    description: 'Construct diversified, risk-adjusted portfolios leveraging Modern Portfolio Theory, Sharpe ratios, and dollar-cost averaging.',
    category: 'INVESTMENT',
    level: 'ADVANCED',
    duration: '60 min',
    xpReward: 300,
    icon: 'TrendingUp',
    lessonsCount: 3,
    completedLessonsCount: 0,
    progressPercent: 0,
    isCompleted: false,
  },
];

export default function EducationHubPage() {
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('ALL');

  useEffect(() => {
    async function loadCourses() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/v1/education/courses');
        const json = await res.json();
        if (json.data?.courses) {
          setCourses(json.data.courses);
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCourses();
  }, []);

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
      const matchesLevel = selectedLevel === 'ALL' || c.level === selectedLevel;
      const matchesSearch =
        !searchQuery.trim() ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [courses, selectedCategory, selectedLevel, searchQuery]);

  // Aggregate Stats
  const totalCourses = courses.length;
  const completedCount = courses.filter((c) => c.isCompleted).length;
  const totalXp = courses.reduce((acc, c) => acc + (c.isCompleted ? c.xpReward : Math.round((c.progressPercent / 100) * c.xpReward)), 0);
  const potentialXp = courses.reduce((acc, c) => acc + c.xpReward, 0);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'BANKING_FUNDAMENTALS':
        return <Landmark className="w-5 h-5 text-amber-400" />;
      case 'BUDGETING':
        return <Layers className="w-5 h-5 text-emerald-400" />;
      case 'CRYPTOCURRENCY':
      case 'CRYPTO_FUNDAMENTALS':
        return <Coins className="w-5 h-5 text-cyan-400" />;
      case 'INVESTMENT':
      case 'INVESTMENT_FUNDAMENTALS':
        return <TrendingUp className="w-5 h-5 text-purple-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#090706] text-[#E9DDCA] flex flex-col font-manrope selection:bg-[#C6A477]/30 selection:text-white">
      {/* 1. Global Navigation Bar */}
      <LuxuryNavbar />

      {/* 2. Main Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="relative rounded-3xl p-8 sm:p-10 overflow-hidden border border-[#C6A477]/30 bg-gradient-to-br from-[#481B24]/40 via-[#170F0D] to-[#090706] shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-valixen-violet/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-valixen-ice/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-valixen-ice/10 border border-valixen-ice/30 text-[11px] font-mono text-valixen-ice tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Institutional Literacy & Quantitative Curriculum
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              Master Modern Finance, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-valixen-ice via-valixen-violet to-purple-400">
                Sovereign Reserves & Web3
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              Interactive lessons verified against international Basel III frameworks, Central Bank of Uzbekistan (CBU) monetary standards, and modern algorithmic portfolio mechanics. Complete quizzes to earn verifiable certification.
            </p>

            {/* Quick Metrics Ribbon */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Available Tracks</p>
                <p className="text-xl font-mono font-bold text-white mt-1">{totalCourses}</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Completed</p>
                <p className="text-xl font-mono font-bold text-valixen-telemetry-profit mt-1">
                  {completedCount} / {totalCourses}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Academy XP</p>
                <p className="text-xl font-mono font-bold text-valixen-ice mt-1">
                  {totalXp} <span className="text-xs text-slate-500 font-normal">/ {potentialXp}</span>
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Simulated Mode</p>
                <p className="text-xl font-mono font-bold text-amber-400 mt-1">Zero Risk</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Category & Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
          {/* Category Tabs */}
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

          {/* Search & Level Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search concepts or courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0D111A] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-valixen-ice transition-colors"
              />
            </div>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="bg-[#0D111A] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-valixen-ice"
            >
              <option value="ALL">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>

        {/* 4. Course Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No courses match your filter</h3>
            <p className="text-xs text-slate-400">Try adjusting your keyword or discipline tab.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => {
              return (
                <div
                  key={course.id}
                  className="group relative rounded-2xl p-6 bg-gradient-to-br from-[#0C101A]/90 to-[#0A0D15]/90 border border-white/[0.08] hover:border-valixen-violet/40 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-valixen-violet/10"
                >
                  <div className="space-y-4">
                    {/* Header Metadata */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                          {getCategoryIcon(course.category)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                              {course.category.replace('_', ' ')}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${
                                course.level === 'BEGINNER'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : course.level === 'INTERMEDIATE'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                              }`}
                            >
                              {course.level}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white group-hover:text-valixen-ice transition-colors mt-1">
                            {course.title}
                          </h3>
                        </div>
                      </div>

                      {course.isCompleted && (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-valixen-telemetry-profit bg-valixen-telemetry-profit/10 px-2.5 py-1 rounded-full border border-valixen-telemetry-profit/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Certified
                        </span>
                      )}
                    </div>

                    {/* Course Summary */}
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      {course.description}
                    </p>

                    {/* Attributes Bar */}
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-white/[0.04]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        <span>{course.lessonsCount} Interactive Lessons</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-valixen-ice">
                        <Award className="w-3.5 h-3.5" />
                        <span>+{course.xpReward} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Action CTA */}
                  <div className="pt-6 mt-4 border-t border-white/[0.06] space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white font-semibold">
                        {course.completedLessonsCount} / {course.lessonsCount} Lessons ({course.progressPercent}%)
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-white/[0.05] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-valixen-violet to-valixen-ice transition-all duration-500 rounded-full"
                        style={{ width: `${course.progressPercent}%` }}
                      />
                    </div>

                    <div className="pt-2">
                      <Link href={`/education/${course.slug}`}>
                        <Button
                          variant={course.isCompleted ? 'secondary' : 'default'}
                          size="sm"
                          className="w-full flex items-center justify-center gap-2 group-hover:shadow-glow-violet"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>
                            {course.isCompleted
                              ? 'Review Curriculum'
                              : course.progressPercent > 0
                              ? 'Continue Course'
                              : 'Start Lesson 1'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. Institutional Standards Callout */}
        <section className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-valixen-violet/10 via-black to-valixen-ice/5 border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-valixen-ice">
              <ShieldCheck className="w-4 h-4" />
              <span>PEDAGOGICAL INTEGRITY GUARANTEE</span>
            </div>
            <h4 className="text-xl font-bold text-white">
              Strict Anti-Hallucination & Legitimate Market Grounding
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every lesson is structured on verified interbank clearing logic, real statutory liquidity ratios (Basel III / Central Bank of Uzbekistan), and peer-reviewed modern portfolio theory. Quizzes provide instant rationale checks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/trading">
              <Button variant="secondary" size="sm" className="font-mono text-xs">
                Open Paper Simulator
              </Button>
            </Link>
            <Link href="/news">
              <Button variant="default" size="sm" className="font-mono text-xs flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5" />
                Market Dispatches
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* 3. LUXURY FOOTER */}
      <LuxuryFooter />
    </div>
  );
}
