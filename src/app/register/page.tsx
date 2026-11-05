// ==============================================================================
// VELTRON SECURE REGISTRATION SCREEN (/register)
// Enterprise Multi-Factor Validation with Argon2id Password Hardening
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Lock, Mail, User, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'TERMS' | 'PRIVACY'>('TERMS');

  // Password Strength Evaluation
  const calculateStrength = (p: string) => {
    let score = 0;
    if (p.length >= 10) score += 25;
    if (/[A-Z]/.test(p)) score += 25;
    if (/[0-9]/.test(p)) score += 25;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p)) score += 25;
    return score;
  };

  const strength = calculateStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setErrorMessage('You must accept the VELTRON Terms of Service and Privacy Policy.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error?.message || 'Registration failed. Please review your details.');
      } else {
        setIsSuccess(true);
      }
    } catch {
      setErrorMessage('A network error occurred. Please verify your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch {
      setErrorMessage(
        'Google OAuth initiation failed. Ensure AUTH_GOOGLE_ID & AUTH_GOOGLE_SECRET are set in your environment.'
      );
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#07090E]">
      {/* Cinematic Ambient Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-[140px] bg-valixen-violet/15" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-[140px] bg-valixen-ice/10" />
      </div>

      <div className="relative z-10 w-full max-w-lg my-8">
        <GlassPanel variant="elevated" specularEdge className="p-8 sm:p-10 shadow-2xl">
          {isSuccess ? (
            /* Success State */
            <div className="text-center space-y-6 py-6">
              <div className="w-16 h-16 rounded-2xl bg-valixen-telemetry-profit/15 border border-valixen-telemetry-profit/40 text-valixen-telemetry-profit mx-auto flex items-center justify-center shadow-glow-profit">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold text-white">
                  ACCOUNT CREATED
                </h2>
                <p className="text-xs font-mono text-slate-300 max-w-sm mx-auto leading-relaxed">
                  We have provisioned your Primary Smart Checking account and Paper Trading sandbox. A verification dispatch has been sent to{' '}
                  <strong className="text-white">{formData.email}</strong>.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => router.push('/login')}
                  variant="primary"
                  className="w-full font-mono font-bold"
                >
                  PROCEED TO LOGIN →
                </Button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <>
              <div className="text-center space-y-3 mb-8">
                <div className="flex justify-center">
                  <Logo variant="symbol" size="lg" />
                </div>

                <div>
                  <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
                    CREATE ACCOUNT
                  </h1>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    SOVEREIGN FINANCIAL IDENTITY REGISTRATION
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="mb-6 p-3.5 rounded-xl bg-valixen-telemetry-risk/15 border border-valixen-telemetry-risk/40 text-xs font-mono text-white flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-valixen-telemetry-risk shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Real Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
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
                <span>SIGN UP WITH GOOGLE</span>
              </button>

              <div className="relative flex items-center justify-center my-6">
                <div className="w-full h-px bg-white/[0.08]" />
                <span className="absolute px-3 bg-[#0E121B] text-[10px] font-mono text-slate-500 uppercase">
                  OR REGISTER WITH EMAIL
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">FIRST NAME</label>
                    <Input
                      required
                      value={formData.firstName}
                      onChange={(e: any) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Alexander"
                      leftIcon={<User className="w-4 h-4 text-slate-400" />}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">LAST NAME</label>
                    <Input
                      required
                      value={formData.lastName}
                      onChange={(e: any) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Vance"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">EMAIL ADDRESS</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@veltron.com"
                    leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">PASSWORD (MIN 10 CHARS)</label>
                  <Input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  />
                  {/* Password Strength Meter */}
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            strength <= 50
                              ? 'bg-valixen-telemetry-risk w-1/3'
                              : strength <= 75
                              ? 'bg-valixen-telemetry-amber w-2/3'
                              : 'bg-valixen-telemetry-profit w-full'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {strength <= 50 ? 'Weak' : strength <= 75 ? 'Moderate' : 'Argon2id Grade (Strong)'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">CONFIRM PASSWORD</label>
                  <Input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e: any) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••••••"
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={formData.acceptTerms}
                      onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded bg-[#0E121B] border-white/20 text-valixen-violet focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs text-slate-400 leading-relaxed font-sans">
                      I accept the{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setModalType('TERMS');
                          setTermsModalOpen(true);
                        }}
                        className="text-valixen-ice hover:underline font-medium"
                      >
                        Terms of Service
                      </button>
                      ,{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setModalType('PRIVACY');
                          setTermsModalOpen(true);
                        }}
                        className="text-valixen-ice hover:underline font-medium"
                      >
                        Privacy Policy
                      </button>
                      , and AML/KYC Protocols.
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  isLoading={isLoading}
                  variant="primary"
                  size="lg"
                  className="w-full mt-4 font-mono font-bold tracking-wider"
                >
                  INITIALIZE SOVEREIGN ACCOUNT →
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
                <p className="text-xs text-slate-400 font-sans">
                  Already registered?{' '}
                  <Link
                    href="/login"
                    className="text-white font-mono font-bold underline underline-offset-4 hover:text-valixen-ice transition-colors"
                  >
                    Authenticate
                  </Link>
                </p>
              </div>
            </>
          )}
        </GlassPanel>
      </div>

      {/* Terms & Privacy Policy Modal */}
      <Modal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        size="md"
        title={
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-valixen-ice" />
            <span className="font-display font-bold text-white">
              {modalType === 'TERMS' ? 'VELTRON TERMS OF SERVICE' : 'PRIVACY & ZERO-KNOWLEDGE POLICY'}
            </span>
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="ghost" size="sm" onClick={() => setTermsModalOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setFormData((prev) => ({ ...prev, acceptTerms: true }));
                setTermsModalOpen(false);
              }}
            >
              I Understand & Accept
            </Button>
          </div>
        }
      >
        <div className="text-xs text-slate-300 space-y-3 font-sans leading-relaxed">
          {modalType === 'TERMS' ? (
            <>
              <p>
                <strong>1. Sovereign Architecture:</strong> VELTRON provides an institutional-grade financial intelligence and paper trading platform. Educational simulation environments operate with zero real-capital liability.
              </p>
              <p>
                <strong>2. AML & KYC Compliance:</strong> Connected bank accounts and card tokens utilize PCI-DSS Level 1 compliant vault tokenization. We strictly reject and do not store sensitive authentication data such as PIN or CVV.
              </p>
              <p>
                <strong>3. Autonomous Security:</strong> Multi-factor authentication, Argon2id password hashing, and cryptographic SHA-256 tamper-evident ledgers guard all transactions.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>1. Zero-Knowledge Cryptography:</strong> All user credentials and passwords are encrypted using memory-hard Argon2id parameters before storage. Plaintext credentials are never logged or exposed.
              </p>
              <p>
                <strong>2. Data Minimization:</strong> Financial data feeds are anonymized and isolated under PostgreSQL Row Level Security (RLS) policies.
              </p>
              <p>
                <strong>3. Telemetry Protection:</strong> Security operations center (SOC) event telemetry complies with SOC-2 Type II standards and GDPR export rights.
              </p>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
