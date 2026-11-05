// ==============================================================================
// VELTRON SOVEREIGN ALLOCATOR RANKING HUB (/ranking)
// Global Leaderboards, Merit Progression & Financial Education Telemetry
// Palette: Obsidian Black (#090706), Deep Espresso (#170F0D), Burgundy (#481B24), Champagne Gold (#C6A477)
// ==============================================================================

import { LeaderboardView } from '@/components/gamification/LeaderboardView';
import { Metadata } from 'next';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';

export const metadata: Metadata = {
  title: 'Global Financial Education Ranking | VELTRON',
  description: 'Merit-based financial education and discipline leaderboard. Zero wealth bias, purely quantitative knowledge mastery.',
};

export default function RankingOverviewPage() {
  return (
    <div className="min-h-screen bg-[#090706] text-[#E9DDCA] font-manrope flex flex-col selection:bg-[#C6A477]/30 selection:text-white">
      <LuxuryNavbar />
      <div className="flex-1">
        <LeaderboardView
          initialScope="GLOBAL"
          pageTitle="SOVEREIGN ALLOCATOR RANKINGS"
          pageSubtitle="Merit-driven financial literacy and discipline leaderboards. Ranked purely by verified course completions, quizzes, and budgeting habits—never personal wealth."
        />
      </div>
      <LuxuryFooter />
    </div>
  );
}
