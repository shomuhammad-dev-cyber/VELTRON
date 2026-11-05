// ==============================================================================
// VELTRON BESPOKE ROYAL LUXURY REGISTRATION SCREEN (/register)
// Milanese Editorial Architecture & Private Sovereign Banking Aesthetics
// Palette: Espresso Brown (#120A08), Royal Burgundy (#54252D), Antique Gold (#C6A477), Ivory (#FAF7F1)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Input } from '@/components/ui/Input';
import { Lock, Mail, User, ShieldCheck, AlertCircle, CheckCircle, ArrowRight, Sparkles, Send } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Password Strength Evaluation
  const calculateStrength = (p: string) => {
    let score = 0;
    if (p.length >= 8) score += 25;
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
      setErrorMessage('Parollar bir-biriga mos kelmadi. Qayta tekshiring.');
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setErrorMessage('Davom etish uchun VELTRON Foydalanish Shartlarini qabul qilishingiz kerak.');
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
        setErrorMessage(data.error?.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi. Ma’lumotlarni tekshiring.');
      } else {
        setIsSuccess(true);
      }
    } catch {
      setErrorMessage('Tarmoq xatosi yuz berdi. Internet aloqangizni tekshiring.');
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
      setErrorMessage('Google OAuth xizmati bilan ulanishda muammo yuz berdi.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#120A08] font-sans selection:bg-[#C6A477]/30 selection:text-white">
      {/* 1. Cinematic Luxury Ambient Background Light */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full blur-[160px] bg-[#C6A477]/10" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[160px] bg-[#54252D]/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#120A08_80%)]" />
      </div>

      {/* 2. Main Register Card Container */}
      <div className="relative z-10 w-full max-w-lg my-8">
        <div className="relative rounded-2xl bg-[#1C1210]/90 backdrop-blur-2xl border border-[#C6A477]/30 p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
          {/* Subtle Golden Hairline Accent Top */}
          <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-[#C6A477]/60 to-transparent" />

          {isSuccess ? (
            /* Success State */
            <div className="text-center space-y-6 py-6">
              <div className="w-16 h-16 rounded-2xl bg-[#3DD898]/15 border border-[#3DD898]/40 text-[#3DD898] mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(61,216,152,0.25)]">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-serif font-bold text-[#FAF7F1]">
                  HISOBINGIZ MUVAFFAQIYATLI OCHILDI
                </h2>
                <p className="text-xs font-sans text-[#C7BAA7] max-w-sm mx-auto leading-relaxed">
                  Siz uchun shaxsiy xavfsiz portfel va <strong className="text-[#FAF7F1]">$100,000 Paper Trading</strong> balansi faollashtirildi.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => router.push('/login')}
                  className="w-full h-12 rounded-xl bg-[#C6A477] hover:bg-[#B38E60] text-[#120A08] font-mono font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-[0_4px_20px_rgba(198,164,119,0.3)] flex items-center justify-center gap-2"
                >
                  <span>TIZIMGA KIRISH</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <>
              {/* Brand Header */}
              <div className="text-center space-y-3 mb-8">
                <div className="flex justify-center">
                  <Logo variant="symbol" size="lg" />
                </div>

                <div>
                  <h1 className="text-3xl font-serif font-bold text-[#FAF7F1] tracking-wide">
                    VELTRON
                  </h1>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-[#C6A477] mt-1">
                    YANGI INVESTOR HISOBI OCHISH
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-6 p-3.5 rounded-xl bg-[#54252D]/60 border border-[#EF4444]/40 text-xs font-sans text-[#FAF7F1] flex items-start gap-2.5 shadow-lg">
                  <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {/* 3. Social / OAuth Buttons (Google & Telegram) */}
              <div className="space-y-2.5 mb-6">
                {/* Google OAuth Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full h-11 rounded-xl bg-[#241512] hover:bg-[#2E1B17] border border-[#C6A477]/25 hover:border-[#C6A477]/50 text-xs font-mono font-semibold text-[#FAF7F1] flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
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
                  <span>GOOGLE ORQALI RO‘YXATDAN O‘TISH</span>
                </button>

                {/* Telegram Bot Auth Button */}
                <a
                  href="https://t.me/VeltronAI_Bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 rounded-xl bg-[#241512] hover:bg-[#2E1B17] border border-[#C6A477]/25 hover:border-[#C6A477]/50 text-xs font-mono font-semibold text-[#FAF7F1] flex items-center justify-center gap-2.5 transition-all duration-200"
                >
                  <Send className="w-4 h-4 text-[#2AABEE]" />
                  <span>TELEGRAM BOT BILAN BIRIKTIRISH (@VeltronAI_Bot)</span>
                </a>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-6">
                <div className="w-full h-px bg-[#C6A477]/20" />
                <span className="absolute px-3 bg-[#1C1210] text-[10px] font-mono text-[#C7BAA7] uppercase tracking-wider">
                  YOKI EMAIL ORQALI
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-[#C7BAA7] block mb-1">ISM</label>
                    <Input
                      required
                      value={formData.firstName}
                      onChange={(e: any) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Alexandr"
                      leftIcon={<User className="w-4 h-4 text-[#C6A477]" />}
                      className="bg-[#140D0B] border-[#C6A477]/30 text-[#FAF7F1] focus:border-[#C6A477]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-[#C7BAA7] block mb-1">FAMILIYA</label>
                    <Input
                      required
                      value={formData.lastName}
                      onChange={(e: any) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Sobirov"
                      leftIcon={<User className="w-4 h-4 text-[#C6A477]" />}
                      className="bg-[#140D0B] border-[#C6A477]/30 text-[#FAF7F1] focus:border-[#C6A477]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#C7BAA7] block mb-1">
                    ELEKTRON POCHTA
                  </label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="investor@veltron.com"
                    leftIcon={<Mail className="w-4 h-4 text-[#C6A477]" />}
                    className="bg-[#140D0B] border-[#C6A477]/30 text-[#FAF7F1] focus:border-[#C6A477]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#C7BAA7] block mb-1">
                    MAXFIY PAROL
                  </label>
                  <Input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    leftIcon={<Lock className="w-4 h-4 text-[#C6A477]" />}
                    className="bg-[#140D0B] border-[#C6A477]/30 text-[#FAF7F1] focus:border-[#C6A477]"
                  />
                  {/* Strength Bar */}
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-[#C7BAA7]">
                        <span>Parol mustahkamligi:</span>
                        <span className={strength >= 75 ? 'text-[#3DD898]' : strength >= 50 ? 'text-[#C6A477]' : 'text-[#EF4444]'}>
                          {strength >= 75 ? 'Yuqori (Xavfsiz)' : strength >= 50 ? 'O‘rtacha' : 'Zaif'}
                        </span>
                      </div>
                      <div className="w-full bg-[#140D0B] h-1.5 rounded-full overflow-hidden border border-[#C6A477]/20">
                        <div
                          className={`h-full transition-all duration-300 ${
                            strength >= 75 ? 'bg-[#3DD898]' : strength >= 50 ? 'bg-[#C6A477]' : 'bg-[#EF4444]'
                          }`}
                          style={{ width: `${strength}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#C7BAA7] block mb-1">
                    PAROLNI TASDIQLASH
                  </label>
                  <Input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e: any) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••••••"
                    leftIcon={<Lock className="w-4 h-4 text-[#C6A477]" />}
                    className="bg-[#140D0B] border-[#C6A477]/30 text-[#FAF7F1] focus:border-[#C6A477]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                    className="w-4 h-4 rounded bg-[#140D0B] border-[#C6A477]/30 text-[#C6A477] accent-[#C6A477] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-[#C7BAA7] cursor-pointer">
                    VELTRON xavfsizlik va xizmat ko‘rsatish qoidalariga roziman
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-[#C6A477] hover:bg-[#B38E60] text-[#120A08] font-mono font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-[0_4px_20px_rgba(198,164,119,0.3)] active:scale-[0.99] flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 rounded-full border-2 border-[#120A08] border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <span>HISOB OCHISH</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Login Link */}
              <div className="mt-8 text-center pt-6 border-t border-[#C6A477]/20">
                <p className="text-xs text-[#C7BAA7]">
                  Allaqachon hisobingiz bormi?{' '}
                  <Link
                    href="/login"
                    className="text-[#C6A477] hover:underline font-semibold font-mono"
                  >
                    Tizimga kirish →
                  </Link>
                </p>
              </div>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-mono text-[#C7BAA7]/70">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C6A477]" />
                <span>Argon2id & 256-Bit Xavfsiz Shifrlash Standarti</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
