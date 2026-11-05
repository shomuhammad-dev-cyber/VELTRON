// ==============================================================================
// VALIXEN EMAIL VERIFICATION SCREEN (/verify-email)
// Cryptographic Token Verification & KYC Tier-1 Activation
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, ShieldAlert, KeyRound, ArrowRight, Loader2, MailCheck } from 'lucide-react';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const executeVerification = async (tokenToVerify: string) => {
    if (!tokenToVerify) return;
    setIsVerifying(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/v1/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenToVerify }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error?.message || 'Verification token is invalid or has expired.');
      } else {
        setIsSuccess(true);
      }
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      executeVerification(urlToken);
    }
  }, [searchParams]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeVerification(token);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#120A08]">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[140px] bg-[#C6A477]/10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[140px] bg-[#54252D]/20" />
      </div>

      <div className="relative z-10 w-full max-w-md my-8">
        <GlassPanel variant="elevated" specularEdge className="p-8 sm:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <Logo variant="symbol" size="lg" />
            </div>

            <div>
              <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
                IDENTITY VERIFICATION
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                TIER-1 KYC & EMAIL REPUTATION AUDIT
              </p>
            </div>

            <Badge variant="cyan" dot className="px-2.5 py-0.5 text-[10px]">
              CRYPTOGRAPHIC HANDSHAKE
            </Badge>
          </div>

          {/* Auto-verifying state */}
          {isVerifying ? (
            <div className="text-center py-12 space-y-4">
              <Loader2 className="w-10 h-10 text-valixen-ice animate-spin mx-auto" />
              <p className="text-xs font-mono text-slate-300">
                Verifying digital cryptographic signature with ledger...
              </p>
            </div>
          ) : isSuccess ? (
            /* Success State */
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-2xl bg-valixen-telemetry-profit/15 border border-valixen-telemetry-profit/40 text-valixen-telemetry-profit mx-auto flex items-center justify-center shadow-glow-profit">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-display font-bold text-white">
                  EMAIL VERIFIED
                </h3>
                <p className="text-xs font-mono text-slate-300 leading-relaxed">
                  Your identity has been authenticated. Tier-1 KYC verification status is now active on your sovereign ledger account.
                </p>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <Button
                  onClick={() => router.push('/login')}
                  variant="primary"
                  size="lg"
                  className="w-full font-mono font-bold"
                >
                  PROCEED TO SIGN IN →
                </Button>
              </div>
            </div>
          ) : (
            /* Manual Token Entry or Dispatch Info */
            <div className="space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-valixen-telemetry-risk/15 border border-valixen-telemetry-risk/40 text-xs font-mono text-white flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-valixen-telemetry-risk shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <MailCheck className="w-5 h-5 text-valixen-ice shrink-0 mt-0.5" />
                <p className="text-xs font-sans text-slate-300 leading-relaxed">
                  During registration, an activation token was generated for your sovereign account. Paste the verification token below to complete setup.
                </p>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">
                    ACTIVATION TOKEN
                  </label>
                  <Input
                    type="text"
                    required
                    value={token}
                    onChange={(e: any) => setToken(e.target.value)}
                    placeholder="Paste 64-character token"
                    leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isVerifying || !token.trim()}
                  variant="primary"
                  size="lg"
                  className="w-full font-mono font-bold tracking-wider"
                >
                  VERIFY IDENTITY NOW →
                </Button>
              </form>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
            <p className="text-[11px] font-mono text-slate-500">
              VELTRON ZERO-KNOWLEDGE LEDGER PROTOCOL
            </p>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-valixen-obsidian flex items-center justify-center text-slate-500 font-mono">Verifying cryptographic token...</div>}>
      <VerifyEmailForm />
    </React.Suspense>
  );
}
