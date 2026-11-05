// ==============================================================================
// VALIXEN WEEKLY SPRINT LEADERBOARD (/ranking/weekly)
// Real-Time 7-Day Sprint Telemetry & Fast-Paced Financial Habit Rankings
// ==============================================================================

import { LeaderboardView } from '@/components/gamification/LeaderboardView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Weekly Sprint Leaderboard | Valixen',
  description: 'Track the fastest learning allocators and top budgeting sprint finishers over the active 7-day rolling cycle.',
};

export default function RankingWeeklyPage() {
  return (
    <div className="w-full sm:px-0 md:px-0 lg:px-0">
      <LeaderboardView
        initialScope="WEEKLY"
        pageTitle="WEEKLY SPRINT LEADERBOARD"
        pageSubtitle="Rolling 7-day sprint velocity tracking active knowledge acquisition, 48-hour cooling-off rule adherence, and newly earned challenge badges."
      />
    </div>
  );
}
