// ==============================================================================
// VALIXEN TELEGRAM MINI APP - ALTERNATIVE ROUTE ALIAS (/mini-app)
// Re-exports the unified Telegram Mini App client entry point
// ==============================================================================

'use client';

import TelegramMiniAppPage from '../tma/page';

export default function MiniAppAliasPage() {
  return (
    <div className="w-full min-h-screen sm:px-0 md:px-0 lg:px-0">
      <TelegramMiniAppPage />
    </div>
  );
}
