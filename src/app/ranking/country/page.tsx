// ==============================================================================
// VALIXEN JURISDICTIONAL COUNTRY LEADERBOARD (/ranking/country)
// National Financial Literacy Champions & Domestic Allocation Leaders
// ==============================================================================

import { LeaderboardView } from '@/components/gamification/LeaderboardView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Country Financial Leaderboard | Valixen',
  description: 'Jurisdiction-specific financial education and discipline rankings across Uzbekistan and global financial centers.',
};

export default function RankingCountryPage() {
  return (
    <div className="w-full sm:px-0 md:px-0 lg:px-0">
      <LeaderboardView
        initialScope="COUNTRY"
        pageTitle="NATIONAL SOVEREIGN LEADERBOARD"
        pageSubtitle="Jurisdiction-filtered financial literacy standings. Track domestic knowledge leaders and budgeting champions across Uzbekistan and international capitals."
      />
    </div>
  );
}
