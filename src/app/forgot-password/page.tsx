// ==============================================================================
// VALIXEN SECURE PASSWORD RECOVERY (/forgot-password)
// Anti-Enumeration Cryptographic Token Dispatch Screen
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Mail, ArrowLeft, ShieldAlert, CheckCircle2, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setDevToken(null);

    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error?.message || 'Unable to process reset request.');
      } else {
        setIsSubmitted(true);
        // In local development / staging, provide the token shortcut for immediate testing
        if (data.data?.token) {
          setDevToken(data.data.token);
        }
      }
    } catch {
      setErrorMessage('Network connection error. Please verify your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#07090E]">
      {/* 1. Cinematic Background Nebula */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-[140px] bg-valixen-violet/15" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-[140px] bg-valixen-ice/10" />
      </div>

      {/* 2. Forgot Password Container */}
      <div className="relative z-10 w-full max-w-md my-8">
        <GlassPanel variant="elevated" specularEdge className="p-8 sm:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <Logo variant="symbol" size="lg" />
            </div>

            <div>
              <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
                PASSWORD RECOVERY
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                SECURE ACCESS RESTORATION DISPATCH
              </p>
            </div>

            <Badge variant="warning" dot className="px-2.5 py-0.5 text-[10px]">
              ANTI-ENUMERATION PROTECTED
            </Badge>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-valixen-telemetry-risk/15 border border-valixen-telemetry-risk/40 text-xs font-mono text-white flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-valixen-telemetry-risk shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSubmitted ? (
            /* Success Feedback */
            <div className="space-y-6 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-valixen-ice/10 border border-valixen-ice/30 text-valixen-ice mx-auto flex items-center justify-center shadow-glow-ice">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-display font-bold text-white">
                  DISPATCH CONFIRMATION
                </h3>
                <p className="text-xs font-mono text-slate-300 leading-relaxed">
                  If an account exists for <strong className="text-valixen-ice">{email}</strong>, a cryptographic password reset token with 1-hour expiry has been dispatched.
                </p>
              </div>

              {devToken && (
                <div className="p-3.5 rounded-xl bg-valixen-violet/15 border border-valixen-violet/30 text-left space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-valixen-violet font-bold">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>DEVELOPMENT ACCESS TOKEN:</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300 break-all select-all bg-black/40 p-2 rounded border border-white/5">
                    {devToken}
                  </p>
                  <Link
                    href={`/reset-password?token=${devToken}`}
                    className="inline-block text-[11px] font-mono text-valixen-ice underline hover:text-white"
                  >
                    Quick Link: Reset Password with this Token →
                  </Link>
                </div>
              )}

              <div className="pt-4 flex flex-col gap-3">
                <Link href="/reset-password">
                  <Button variant="secondary" size="md" className="w-full font-mono text-xs">
                    I ALREADY HAVE A TOKEN →
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" size="md" className="w-full font-mono text-xs text-slate-400">
                    RETURN TO LOGIN
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* Reset Request Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-xs font-sans text-slate-400 leading-relaxed">
                Enter your registered institutional email. If verified, our zero-knowledge authentication engine will generate a cryptographically signed reset token.
              </p>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">
                  INSTITUTIONAL EMAIL
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  placeholder="trader@valixen.com"
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                variant="primary"
                size="lg"
                className="w-full font-mono font-bold tracking-wider"
              >
                REQUEST RESET TOKEN →
              </Button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Secure Login</span>
                </Link>
              </div>
            </form>
          )}

          {/* Security Guarantee */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
            <p className="text-[11px] font-mono text-slate-500">
              ARGON2ID KEY DERIVATION • TIMING-ATTACK RESISTANT
            </p>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
