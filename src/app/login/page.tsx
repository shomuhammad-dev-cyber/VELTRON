// ==============================================================================
// VELTRON SECURE LOGIN SCREEN (/login)
// Dark Cinematic AI Finance Aesthetics with Real Google OAuth & Argon2id Auth
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { signIn } from 'next-auth/react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMessage('Invalid institutional email or password. Please try again.');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage('A network error occurred. Please verify your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    try {
      // Trigger actual NextAuth Google OAuth flow
      await signIn('google', { callbackUrl });
    } catch {
      setErrorMessage(
        'Google OAuth initiation failed. Ensure AUTH_GOOGLE_ID & AUTH_GOOGLE_SECRET are set in your environment.'
      );
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#07090E]">
      {/* 1. Cinematic Background Nebula & Particle Glow */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[140px] bg-valixen-violet/15" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[140px] bg-valixen-ice/10" />
      </div>

      {/* 2. Main Login Card Container */}
      <div className="relative z-10 w-full max-w-md my-8">
        <GlassPanel variant="elevated" specularEdge className="p-8 sm:p-10 shadow-2xl">
          {/* Brand Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <Logo variant="symbol" size="lg" />
            </div>

            <div>
              <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
                VELTRON TERMINAL
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                ENTERPRISE IDENTITY & QUANTUM ACCESS
              </p>
            </div>

            <Badge variant="default" dot className="px-2.5 py-0.5 text-[10px]">
              ARGON2ID ZERO-KNOWLEDGE LEDGER
            </Badge>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-valixen-telemetry-risk/15 border border-valixen-telemetry-risk/40 text-xs font-mono text-white flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-valixen-telemetry-risk shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Telegram Login / Bot Access Button */}
          <a
            href="https://t.me/VeltronAI_Bot"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-12 rounded-xl bg-[#2AABEE]/15 hover:bg-[#2AABEE]/25 border border-[#2AABEE]/40 hover:border-[#2AABEE]/70 text-xs font-mono font-bold text-white flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] mb-3 group shadow-lg shadow-[#2AABEE]/5"
          >
            <svg className="w-5 h-5 text-[#2AABEE] transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
            <span>TELEGRAM BOT BILAN KIRISH (@VeltronAI_Bot)</span>
          </a>

          {/* Real Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full h-12 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-valixen-ice/40 text-xs font-mono font-bold text-white flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] mb-6 disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <span className="w-4 h-4 rounded-full border-2 border-valixen-ice border-t-transparent animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>CONTINUE WITH GOOGLE</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full h-px bg-white/[0.08]" />
            <span className="absolute px-3 bg-[#0E121B] text-[10px] font-mono text-slate-500 uppercase">
              OR EMAIL IDENTITY
            </span>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">
                INSTITUTIONAL EMAIL
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="trader@veltron.com"
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono text-slate-400 uppercase">
                  PASSWORD
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-mono text-valixen-ice hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0E121B] border-white/20 text-valixen-violet focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-400">Remember 30 days</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              isLoading={isLoading}
              variant="primary"
              size="lg"
              className="w-full mt-2 font-mono font-bold tracking-wider"
            >
              AUTHENTICATE SESSION →
            </Button>
          </form>

          {/* Bottom Footer Link */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
            <p className="text-xs text-slate-400 font-sans">
              New to the sovereign ecosystem?{' '}
              <Link
                href="/register"
                className="text-white font-mono font-bold underline underline-offset-4 hover:text-valixen-ice transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-valixen-obsidian flex items-center justify-center text-slate-500 font-mono">Loading authentication gate...</div>}>
      <LoginForm />
    </React.Suspense>
  );
}
