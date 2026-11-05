// ==============================================================================
// VALIXEN MONTHLY APEX LEADERBOARD (/ranking/monthly)
// Calendar Month Wealth Discipline, Net Savings Capture & Macro Resilience
// ==============================================================================

import { LeaderboardView } from '@/components/gamification/LeaderboardView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Monthly Apex Leaderboard | Valixen',
  description: 'Top monthly wealth capture allocators and advanced curriculum graduates for the current calendar cycle.',
};

export default function RankingMonthlyPage() {
  return (
    <div className="w-full sm:px-0 md:px-0 lg:px-0">
      <LeaderboardView
        initialScope="MONTHLY"
        pageTitle="MONTHLY APEX LEADERBOARD"
        pageSubtitle="Comprehensive 30-day allocation standings highlighting top net savings capture percentages, debt avalanche execution, and multi-asset risk management."
      />
    </div>
  );
}
