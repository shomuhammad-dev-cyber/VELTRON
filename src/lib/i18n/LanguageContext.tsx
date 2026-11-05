// ==============================================================================
// VELTRON 4-LANGUAGE INTERNATIONALIZATION PROVIDER & HOOK
// Dynamic Locale Switching, Arabic RTL Alignment & Safe Fallback Architecture
// ==============================================================================

'use client';

import React, { useState, useEffect, useMemo } from 'react';

const createContext = (React as any).createContext;
const useContext = (React as any).useContext;
import { Locale, Direction, SUPPORTED_LANGUAGES, DEFAULT_LOCALE, TranslationDictionary } from './types';
import { uz } from './dictionaries/uz';
import { ru } from './dictionaries/ru';
import { en } from './dictionaries/en';
import { ar } from './dictionaries/ar';

const DICTIONARIES: Record<Locale, TranslationDictionary> = {
  uz,
  ru,
  en,
  ar,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (newLocale: Locale) => void;
  dir: Direction;
  isRtl: boolean;
  t: (path: string, params?: Record<string, string | number>) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatNumber: (value: number) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  dict: TranslationDictionary;
}

const I18nContext = (createContext as any)(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('veltron_locale') as Locale;
      if (saved && SUPPORTED_LANGUAGES[saved]) {
        setLocaleState(saved);
      }
    } catch {}
    setIsHydrated(true);
  }, []);

  const dir: Direction = SUPPORTED_LANGUAGES[locale]?.dir || 'ltr';
  const isRtl = dir === 'rtl';

  // Apply HTML dir and lang attributes dynamically without page reload
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', locale);
    }
  }, [locale, dir]);

  const setLocale = (newLocale: Locale) => {
    if (!SUPPORTED_LANGUAGES[newLocale]) return;
    setLocaleState(newLocale);
    try {
      localStorage.setItem('veltron_locale', newLocale);
      document.cookie = `veltron_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}
  };

  const dict = useMemo(() => DICTIONARIES[locale] || DICTIONARIES[DEFAULT_LOCALE], [locale]);

  /**
   * Safe nested key translation resolver (e.g. t('nav.dashboard') or t('home.heroTitle'))
   * Graceful fallback to UZ then EN dictionaries; never outputs raw keys or undefined
   */
  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.');

    const resolveFromDict = (d: any): any => {
      let cur = d;
      for (const k of keys) {
        if (!cur || typeof cur !== 'object') return undefined;
        cur = cur[k];
      }
      return cur;
    };

    let result = resolveFromDict(dict);
    if (typeof result !== 'string') {
      result = resolveFromDict(DICTIONARIES.uz);
    }
    if (typeof result !== 'string') {
      result = resolveFromDict(DICTIONARIES.en);
    }
    if (typeof result !== 'string') {
      return path; // Fallback gracefully to key path if missing
    }

    if (params) {
      let templated = result;
      for (const [key, val] of Object.entries(params)) {
        templated = templated.replace(new RegExp(`{${key}}`, 'g'), String(val));
      }
      return templated;
    }

    return result;
  };

  /**
   * Currency formatter respecting active locale while preserving value
   */
  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    try {
      const localeMap: Record<Locale, string> = {
        uz: 'uz-UZ',
        ru: 'ru-RU',
        en: 'en-US',
        ar: 'ar-SA',
      };
      return new Intl.NumberFormat(localeMap[locale] || 'en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `$${amount.toLocaleString()}`;
    }
  };

  /**
   * Number formatter with localized thousand/decimal separators
   */
  const formatNumber = (value: number): string => {
    try {
      const localeMap: Record<Locale, string> = {
        uz: 'uz-UZ',
        ru: 'ru-RU',
        en: 'en-US',
        ar: 'ar-SA',
      };
      return new Intl.NumberFormat(localeMap[locale] || 'en-US').format(value);
    } catch {
      return value.toLocaleString();
    }
  };

  /**
   * Localized date formatter
   */
  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      const localeMap: Record<Locale, string> = {
        uz: 'uz-UZ',
        ru: 'ru-RU',
        en: 'en-US',
        ar: 'ar-SA',
      };
      return new Intl.DateTimeFormat(
        localeMap[locale] || 'en-US',
        options || { year: 'numeric', month: 'short', day: 'numeric' }
      ).format(d);
    } catch {
      return String(date);
    }
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        dir,
        isRtl,
        t,
        formatCurrency,
        formatNumber,
        formatDate,
        dict,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    // Graceful fallback for components rendered outside or before provider hydration
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      dir: 'ltr' as Direction,
      isRtl: false,
      t: (path: string) => path,
      formatCurrency: (amount: number) => `$${amount.toLocaleString()}`,
      formatNumber: (v: number) => v.toLocaleString(),
      formatDate: (d: Date | string) => String(d),
      dict: DICTIONARIES[DEFAULT_LOCALE],
    };
  }
  return context;
}

export function useLanguage() {
  const i18n = useI18n();
  return {
    ...i18n,
    language: i18n.locale,
    setLanguage: i18n.setLocale,
  };
}

