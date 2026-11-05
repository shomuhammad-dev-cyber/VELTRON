// ==============================================================================
// VELTRON AUTH API ROUTE: [...nextauth]
// Handles OAuth redirects, sessions, and credentials callbacks
// ==============================================================================

import { handlers } from '@/lib/auth/auth.config';

export const { GET, POST } = handlers;
