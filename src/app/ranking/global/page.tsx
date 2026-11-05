// ==============================================================================
// VALIXEN GLOBAL LEADERBOARD (/ranking/global)
// Cross-Border Merit Hierarchy & Worldwide Financial Mastery Rankings
// ==============================================================================

import { LeaderboardView } from '@/components/gamification/LeaderboardView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Global Allocator Leaderboard | Valixen',
  description: 'Worldwide financial education and risk discipline leaderboard across all registered sovereign allocators.',
};

export default function RankingGlobalPage() {
  return (
    <div className="w-full sm:px-0 md:px-0 lg:px-0">
      <LeaderboardView
        initialScope="GLOBAL"
        pageTitle="GLOBAL ALLOCATOR LEADERBOARD"
        pageSubtitle="Cross-border merit standings tracking verified financial education completion, algorithmic risk management, and smart savings streaks worldwide."
      />
    </div>
  );
}
