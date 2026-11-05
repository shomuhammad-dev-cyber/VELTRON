// ==============================================================================
// VELTRON BESPOKE ROYAL LUXURY LOGIN SCREEN (/login)
// Milanese Editorial Architecture & Private Sovereign Banking Aesthetics
// Palette: Espresso Brown (#140C0A), Royal Burgundy (#54252D), Antique Gold (#C6A477), Ivory (#FAF7F1)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Input } from '@/components/ui/Input';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles, Send } from 'lucide-react';
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
        setErrorMessage('Noto‘g‘ri elektron pochta yoki maxfiy parol. Qayta urinib ko‘ring.');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage('Tarmoq xatosi yuz berdi. Internet aloqangizni tekshiring.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    try {
      await signIn('google', { callbackUrl });
    } catch {
      setErrorMessage('Google OAuth xizmati bilan ulanishda muammo yuz berdi.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#120A08]">
      {/* 1. Cinematic Luxury Ambient Background Light */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full blur-[160px] bg-[#C6A477]/10" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[160px] bg-[#54252D]/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#120A08_80%)]" />
      </div>

      {/* 2. Main Login Card Container */}
      <div className="relative z-10 w-full max-w-md my-8">
        <div className="relative rounded-2xl bg-[#1C1210]/90 backdrop-blur-2xl border border-[#C6A477]/30 p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
          {/* Subtle Golden Hairline Accent Top */}
          <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-[#C6A477]/60 to-transparent" />

          {/* Brand Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <Logo variant="symbol" size="lg" />
            </div>

            <div>
              <h1 className="text-3xl font-serif font-bold text-[#FAF7F1] tracking-wide">
                VELTRON
              </h1>
              <p className="text-[11px] font-sans tracking-[0.22em] text-[#C6A477] uppercase mt-1">
                SOVEREIGN FINANCIAL TERMINAL
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#54252D]/30 border border-[#C6A477]/30 text-[10px] font-sans text-[#EAD8BE]">
              <ShieldCheck className="w-3 h-3 text-[#C6A477]" />
              <span>AES-256 ZERO-KNOWLEDGE LEDGER</span>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs font-sans text-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Telegram Login / Direct Bot Access Button */}
          <a
            href="https://t.me/VeltronAI_Bot"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-12 rounded-xl bg-[#2AABEE]/15 hover:bg-[#2AABEE]/25 border border-[#2AABEE]/40 hover:border-[#2AABEE]/70 text-xs font-sans font-bold text-[#FAF7F1] flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] mb-3 group shadow-lg shadow-[#2AABEE]/5"
          >
            <Send className="w-4 h-4 text-[#2AABEE] transition-transform group-hover:scale-110" />
            <span>TELEGRAM BOT BILAN KIRISH (@VeltronAI_Bot)</span>
          </a>

          {/* Real Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full h-12 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-[#C6A477]/25 hover:border-[#C6A477]/50 text-xs font-sans font-medium text-[#FAF7F1] flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] mb-6 disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <span className="w-4 h-4 rounded-full border-2 border-[#C6A477] border-t-transparent animate-spin" />
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
            <span>GOOGLE AKKAUNT BILAN KIRISH</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full h-px bg-[#C6A477]/20" />
            <span className="absolute px-3 bg-[#1C1210] text-[10px] font-sans tracking-widest text-[#C6A477] uppercase">
              YOKI EMAIL ORQALI
            </span>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-sans font-medium text-[#EAD8BE] block mb-1.5 uppercase tracking-wider">
                Elektron Pochta
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="investor@veltron.com"
                leftIcon={<Mail className="w-4 h-4 text-[#C6A477]" />}
                className="bg-[#120A08] border-[#C6A477]/30 text-[#FAF7F1] placeholder:text-stone-500 focus:border-[#C6A477]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-sans font-medium text-[#EAD8BE] uppercase tracking-wider">
                  Maxfiy Parol
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-sans text-[#C6A477] hover:underline"
                >
                  Unutdingizmi?
                </Link>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4 text-[#C6A477]" />}
                className="bg-[#120A08] border-[#C6A477]/30 text-[#FAF7F1] placeholder:text-stone-500 focus:border-[#C6A477]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#120A08] border-[#C6A477]/40 text-[#C6A477] focus:ring-0 cursor-pointer accent-[#C6A477]"
                />
                <span className="text-xs font-sans text-stone-300">30 kunga eslab qolish</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full h-12 rounded-xl mt-2 bg-gradient-to-r from-[#DFCAAA] via-[#C6A477] to-[#A88B5B] hover:brightness-110 text-[#120A08] text-xs font-sans font-bold tracking-wider uppercase transition-all duration-200 active:scale-[0.98] shadow-lg shadow-[#C6A477]/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="w-4 h-4 rounded-full border-2 border-[#120A08] border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>Tizimga Kirish</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Footer Link */}
          <div className="mt-8 pt-6 border-t border-[#C6A477]/20 text-center">
            <p className="text-xs text-stone-300 font-sans">
              Ekotizimda yangimisiz?{' '}
              <Link
                href="/register"
                className="text-[#FAF7F1] font-semibold underline underline-offset-4 hover:text-[#C6A477] transition-colors"
              >
                Yangi Hisob Ochish
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#120A08] flex items-center justify-center text-[#C6A477] font-sans">Tizimga kirish yuklanmoqda...</div>}>
      <LoginForm />
    </React.Suspense>
  );
}
