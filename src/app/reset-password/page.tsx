// ==============================================================================
// VALIXEN PASSWORD RESET SCREEN (/reset-password)
// Argon2id Password Hardening & Multi-Device Session Invalidation
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
import { Lock, KeyRound, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const queryToken = searchParams.get('token');
    if (queryToken) {
      setToken(queryToken);
    }
  }, [searchParams]);

  // Password strength calculation
  const calculateStrength = (p: string) => {
    let score = 0;
    if (p.length >= 10) score += 25;
    if (/[A-Z]/.test(p)) score += 25;
    if (/[0-9]/.test(p)) score += 25;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p)) score += 25;
    return score;
  };

  const strength = calculateStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (strength < 75) {
      setErrorMessage('Password must be at least 10 characters with uppercase, numbers, and symbols.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error?.message || 'Password reset failed. Token may be invalid or expired.');
      } else {
        setIsSuccess(true);
      }
    } catch {
      setErrorMessage('A network error occurred. Please verify your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#120A08]">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-[140px] bg-[#C6A477]/10" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full blur-[140px] bg-[#54252D]/20" />
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
                SET NEW CREDENTIALS
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                ARGON2ID KEY STRETCHING WITH SESSION PURGE
              </p>
            </div>

            <Badge variant="cyan" dot className="px-2.5 py-0.5 text-[10px]">
              64MB MEMORY-HARD DERIVATION
            </Badge>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-valixen-telemetry-risk/15 border border-valixen-telemetry-risk/40 text-xs font-mono text-white flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-valixen-telemetry-risk shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            /* Success State */
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-2xl bg-valixen-telemetry-profit/15 border border-valixen-telemetry-profit/40 text-valixen-telemetry-profit mx-auto flex items-center justify-center shadow-glow-profit">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-display font-bold text-white">
                  CREDENTIALS UPDATED
                </h3>
                <p className="text-xs font-mono text-slate-300 leading-relaxed">
                  Your password has been re-encrypted with Argon2id parameters. For maximum security, all existing sessions across all browsers and devices have been revoked.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => router.push('/login')}
                  variant="primary"
                  size="lg"
                  className="w-full font-mono font-bold"
                >
                  LOG IN WITH NEW PASSWORD →
                </Button>
              </div>
            </div>
          ) : (
            /* Reset Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">
                  VERIFICATION RESET TOKEN
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

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">
                  NEW PASSWORD (MIN 10 CHARACTERS)
                </label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                />

                {/* Strength Meter */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span>STRENGTH:</span>
                      <span className={
                        strength >= 75 ? 'text-valixen-telemetry-profit font-bold' : 'text-valixen-gold font-bold'
                      }>
                        {strength >= 75 ? 'ENTERPRISE STRONG' : 'MODERATE / WEAK'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength < 50
                            ? 'bg-valixen-telemetry-risk'
                            : strength < 75
                            ? 'bg-valixen-gold'
                            : 'bg-valixen-ice shadow-glow-ice'
                        }`}
                        style={{ width: `${strength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">
                  CONFIRM NEW PASSWORD
                </label>
                <Input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e: any) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                variant="primary"
                size="lg"
                className="w-full mt-2 font-mono font-bold tracking-wider"
              >
                UPDATE PASSWORD & PURGE SESSIONS →
              </Button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
                >
                  Cancel and Return to Login
                </Link>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
            <p className="text-[11px] font-mono text-slate-500">
              VALIXEN ENTERPRISE SECURITY PLATFORM
            </p>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-valixen-obsidian flex items-center justify-center text-slate-500 font-mono">Loading recovery portal...</div>}>
      <ResetPasswordForm />
    </React.Suspense>
  );
}
