// ==============================================================================
// VALIXEN INTERACTIVE CLASSROOM (/education/[slug])
// Interactive Lessons, Verified Knowledge Quizzes, Instant Rationale & Certification
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  XCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Check,
  RotateCcw,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LessonDetail {
  id: string;
  order: number;
  title: string;
  duration: string;
  content: string;
  keyTakeaways: string[];
  quiz: QuizQuestion[];
  isCompleted?: boolean;
}

interface CourseDetail {
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
  lessons: LessonDetail[];
}

export default function CourseClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Quiz state for current lesson
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    explanation: string;
    xpEarned: number;
  } | null>(null);

  // Certificate Modal State
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Load Course
  const fetchCourse = async () => {
    if (!slug) return;
    try {
      setIsLoading(true);
      setLoadError(null);
      const res = await fetch(`/api/v1/education/courses/${slug}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Course not found');
      }
      setCourse(json.data);

      // Auto-jump to first incomplete lesson if any
      const lessons: LessonDetail[] = json.data.lessons || [];
      const firstIncompleteIdx = lessons.findIndex((l) => !l.isCompleted);
      if (firstIncompleteIdx >= 0) {
        setActiveLessonIndex(firstIncompleteIdx);
      }
    } catch (err: any) {
      setLoadError(err.message || 'Failed to load course');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  // Reset quiz state when active lesson changes
  useEffect(() => {
    setSelectedOption(null);
    setQuizResult(null);
  }, [activeLessonIndex]);

  const activeLesson = course?.lessons[activeLessonIndex];
  const activeQuiz = activeLesson?.quiz[0];

  // Submit Quiz Answer
  const handleSubmitQuiz = async () => {
    if (selectedOption === null || !activeLesson || isSubmittingQuiz) return;

    try {
      setIsSubmittingQuiz(true);
      const res = await fetch(`/api/v1/education/courses/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: activeLesson.id,
          selectedOptionIndex: selectedOption,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Quiz submission failed');
      }

      setQuizResult({
        submitted: true,
        isCorrect: json.data.isCorrect,
        explanation: json.data.explanation,
        xpEarned: json.data.xpEarned,
      });

      if (json.data.isCorrect) {
        // Update local lesson completion state
        setCourse((prev) => {
          if (!prev) return null;
          const updatedLessons = prev.lessons.map((l, idx) =>
            idx === activeLessonIndex ? { ...l, isCompleted: true } : l
          );
          const completedCount = updatedLessons.filter((l) => l.isCompleted).length;
          const progressPercent = Math.round((completedCount / prev.lessonsCount) * 100);
          return {
            ...prev,
            completedLessonsCount: completedCount,
            progressPercent,
            isCompleted: json.data.courseCompleted,
            lessons: updatedLessons,
          };
        });

        if (json.data.courseCompleted) {
          setShowCompletionModal(true);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Error recording answer');
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const handleNextLesson = () => {
    if (course && activeLessonIndex < course.lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(activeLessonIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center p-6 text-white font-mono space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-valixen-violet border-t-valixen-ice animate-spin" />
        <p className="text-xs text-slate-400 tracking-wider">INITIALIZING ACADEMY CLASSROOM...</p>
      </div>
    );
  }

  if (loadError || !course) {
    return (
      <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center p-6 text-white text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <XCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-display">Course Curriculum Unavailable</h2>
        <p className="text-xs font-mono text-slate-400 max-w-md">{loadError || 'The requested track could not be resolved.'}</p>
        <Link href="/education">
          <Button variant="default" size="sm" className="font-mono text-xs">
            Return to Academy Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-valixen-violet selection:text-white">
      {/* 1. Header Toolbar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0A0D14]/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/education"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Catalog</span>
            </Link>

            <div className="h-6 w-px bg-white/[0.08] hidden sm:block" />

            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                {course.category.replace('_', ' ')} • {course.level}
              </p>
              <h1 className="text-sm sm:text-base font-bold text-white leading-tight truncate max-w-sm sm:max-w-md">
                {course.title}
              </h1>
            </div>
          </div>

          {/* Right Status */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end text-xs font-mono">
              <span className="text-slate-400 text-[10px]">Progress</span>
              <span className="font-bold text-valixen-ice">{course.progressPercent}% Completed</span>
            </div>

            <div className="w-24 sm:w-32 h-2 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-valixen-violet to-valixen-ice transition-all duration-300"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-valixen-violet/15 border border-valixen-violet/30 text-xs font-mono text-valixen-violet">
              <Trophy className="w-3.5 h-3.5 text-valixen-ice" />
              <span className="font-bold text-white">+{course.xpReward} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Content Split View */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Syllabus Navigation (4 cols) */}
        <aside className="lg:col-span-4 rounded-2xl bg-[#0B0F18]/90 border border-white/[0.08] p-5 space-y-5 sticky top-24">
          <div className="space-y-1">
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">Course Syllabus</h2>
            <p className="text-sm font-bold text-white">
              {course.completedLessonsCount} of {course.lessonsCount} Lessons Completed
            </p>
          </div>

          {/* Lesson List */}
          <div className="space-y-2">
            {course.lessons.map((lesson, idx) => {
              const isActive = idx === activeLessonIndex;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonIndex(idx)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 border flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-valixen-violet/20 border-valixen-violet/50 shadow-glow-violet text-white'
                      : lesson.isCompleted
                      ? 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.04]'
                      : 'bg-transparent border-transparent text-slate-400 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                        lesson.isCompleted
                          ? 'bg-valixen-telemetry-profit/20 text-valixen-telemetry-profit border border-valixen-telemetry-profit/30'
                          : isActive
                          ? 'bg-valixen-ice/20 text-valixen-ice border border-valixen-ice/30'
                          : 'bg-white/[0.04] text-slate-400'
                      }`}
                    >
                      {lesson.isCompleted ? <Check className="w-4 h-4" /> : lesson.order}
                    </div>

                    <div>
                      <p className={`text-xs font-semibold leading-tight line-clamp-1 ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {lesson.title}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400">{lesson.duration}</span>
                    </div>
                  </div>

                  {lesson.isCompleted && (
                    <span className="text-[10px] font-mono text-valixen-telemetry-profit">Passed</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Pedagogy Note */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] font-mono text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-valixen-ice font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Mastery Verification</span>
            </div>
            <p className="leading-relaxed">
              Every lesson includes an institutional knowledge check. Correct quiz completion awards XP and records progress immutably.
            </p>
          </div>
        </aside>

        {/* Right Column: Active Lesson & Interactive Quiz (8 cols) */}
        <main className="lg:col-span-8 space-y-8">
          {activeLesson ? (
            <div className="rounded-3xl bg-gradient-to-br from-[#0C101A]/95 to-[#090C14]/95 border border-white/[0.08] p-6 sm:p-8 space-y-8 shadow-xl">
              {/* Lesson Header */}
              <div className="space-y-3 pb-6 border-b border-white/[0.06]">
                <div className="flex items-center justify-between gap-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase bg-valixen-violet/15 text-valixen-violet-light border border-valixen-violet/30">
                    Lesson {activeLesson.order} of {course.lessonsCount}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{activeLesson.duration} read</span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  {activeLesson.title}
                </h2>
              </div>

              {/* Lesson Text Body */}
              <article className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4 font-light">
                {activeLesson.content.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </article>

              {/* Key Takeaways Callout Card */}
              {activeLesson.keyTakeaways && activeLesson.keyTakeaways.length > 0 && (
                <div className="rounded-2xl p-5 bg-gradient-to-r from-valixen-ice/5 to-valixen-violet/10 border border-valixen-ice/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-valixen-ice font-bold">
                    <Lightbulb className="w-4 h-4" />
                    <span>KEY INSTITUTIONAL TAKEAWAYS</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300 font-light">
                    {activeLesson.keyTakeaways.map((takeaway, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-valixen-ice mt-1.5 shrink-0" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Interactive Quiz Section */}
              {activeQuiz && (
                <div className="rounded-2xl p-6 bg-[#080B12] border border-white/[0.08] space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-valixen-violet">
                      <HelpCircle className="w-4 h-4 text-valixen-ice" />
                      <span className="font-bold uppercase tracking-wider">Interactive Knowledge Check</span>
                    </div>
                    {activeLesson.isCompleted && (
                      <span className="text-[11px] font-mono text-valixen-telemetry-profit flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {activeQuiz.question}
                  </h3>

                  {/* Options List */}
                  <div className="space-y-3">
                    {activeQuiz.options.map((option, optIdx) => {
                      const isSelected = selectedOption === optIdx;
                      return (
                        <button
                          key={optIdx}
                          disabled={isSubmittingQuiz}
                          onClick={() => setSelectedOption(optIdx)}
                          className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition-all duration-200 flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-valixen-violet/20 border-valixen-violet text-white shadow-glow-violet'
                              : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                                isSelected ? 'bg-valixen-violet text-white' : 'bg-white/[0.06] text-slate-400'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-normal">{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Quiz Rationale / Instant Feedback Alert */}
                  {quizResult && quizResult.submitted && (
                    <div
                      className={`p-4 rounded-xl border space-y-2 transition-all ${
                        quizResult.isCorrect
                          ? 'bg-valixen-telemetry-profit/10 border-valixen-telemetry-profit/30 text-emerald-300'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-mono text-xs font-bold">
                        {quizResult.isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-valixen-telemetry-profit" />
                            <span>Correct Answer! (+{quizResult.xpEarned} XP Awarded)</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-amber-400" />
                            <span>Incorrect — Re-evaluate the concept below</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs font-light leading-relaxed text-slate-200">
                        {quizResult.explanation}
                      </p>
                    </div>
                  )}

                  {/* Quiz Action Bar */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <Button
                      onClick={handleSubmitQuiz}
                      disabled={selectedOption === null || isSubmittingQuiz}
                      variant="default"
                      size="sm"
                      className="font-mono text-xs px-6 py-2.5 flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isSubmittingQuiz ? 'Verifying...' : 'Submit Answer'}</span>
                    </Button>

                    {quizResult?.isCorrect && activeLessonIndex < course.lessons.length - 1 && (
                      <Button
                        onClick={handleNextLesson}
                        variant="secondary"
                        size="sm"
                        className="font-mono text-xs flex items-center gap-1.5"
                      >
                        <span>Next Lesson</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Pagination */}
              <div className="flex items-center justify-between pt-6 border-t border-white/[0.06]">
                <Button
                  onClick={handlePrevLesson}
                  disabled={activeLessonIndex === 0}
                  variant="secondary"
                  size="sm"
                  className="font-mono text-xs flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                <span className="text-xs font-mono text-slate-400">
                  {activeLessonIndex + 1} / {course.lessonsCount}
                </span>

                <Button
                  onClick={handleNextLesson}
                  disabled={activeLessonIndex === course.lessons.length - 1}
                  variant="secondary"
                  size="sm"
                  className="font-mono text-xs flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 font-mono text-xs">
              Select a lesson from the syllabus.
            </div>
          )}
        </main>
      </div>

      {/* 3. Course Completion Certification Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-md w-full rounded-3xl bg-gradient-to-b from-[#111624] to-[#0A0D15] border border-valixen-ice/30 p-8 text-center space-y-6 shadow-2xl shadow-valixen-violet/20">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-valixen-violet to-valixen-ice flex items-center justify-center shadow-lg shadow-valixen-violet/30">
              <Award className="w-10 h-10 text-black" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-valixen-ice font-bold">
                CURRICULUM COMPLETED
              </span>
              <h3 className="text-2xl font-display font-extrabold text-white">
                Certification of Mastery
              </h3>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                You have successfully completed all lessons and quizzes for <br />
                <strong className="text-white font-semibold">"{course.title}"</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-around">
              <div>
                <p className="text-[10px] font-mono text-slate-400 uppercase">XP Awarded</p>
                <p className="text-lg font-mono font-bold text-valixen-ice">+{course.xpReward} XP</p>
              </div>
              <div className="h-8 w-px bg-white/[0.08]" />
              <div>
                <p className="text-[10px] font-mono text-slate-400 uppercase">Credential Status</p>
                <p className="text-lg font-mono font-bold text-valixen-telemetry-profit">VERIFIED</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Link href="/education">
                <Button variant="default" size="sm" className="w-full font-mono text-xs py-2.5">
                  Return to Academy Catalog
                </Button>
              </Link>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
              >
                Close & Review Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
