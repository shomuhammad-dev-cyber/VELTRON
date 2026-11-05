// ==============================================================================
// VALIXEN TELEGRAM WEB APPS JAVASCRIPT SDK WRAPPER & REACT HOOK
// Native Telegram Mini App Viewport, Fullscreen, ThemeParams & Haptic Integration
// ==============================================================================

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

export interface TelegramWebAppUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
  section_header_text_color?: string;
  subtitle_text_color?: string;
  destructive_text_color?: string;
}

export interface TelegramWebAppData {
  query_id?: string;
  user?: TelegramWebAppUser;
  receiver?: TelegramWebAppUser;
  chat?: any;
  start_param?: string;
  auth_date?: number;
  hash?: string;
}

export interface UseTelegramWebAppReturn {
  isAvailable: boolean;
  isReady: boolean;
  initData: string;
  initDataUnsafe: TelegramWebAppData;
  themeParams: TelegramThemeParams;
  colorScheme: 'light' | 'dark';
  viewportHeight: number;
  viewportStableHeight: number;
  isExpanded: boolean;
  isFullscreen: boolean;
  startParam: string | null;
  expand: () => void;
  requestFullscreen: () => void;
  close: () => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  setBackButton: (visible: boolean, onClick?: () => void) => void;
  setMainButton: (options: {
    text: string;
    visible?: boolean;
    isActive?: boolean;
    showProgress?: boolean;
    onClick?: () => void;
  }) => void;
  haptic: {
    impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notification: (type: 'error' | 'success' | 'warning') => void;
    selection: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

export function useTelegramWebApp(): UseTelegramWebAppReturn {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(800);
  const [viewportStableHeight, setViewportStableHeight] = useState(800);
  const [themeParams, setThemeParams] = useState<TelegramThemeParams>({});
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('dark');

  // Detect and initialize Telegram WebApp SDK
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tg = window.Telegram?.WebApp;
    if (tg) {
      setIsAvailable(true);

      try {
        tg.ready();
        tg.expand();
        setIsExpanded(Boolean(tg.isExpanded));
        setViewportHeight(tg.viewportHeight || window.innerHeight);
        setViewportStableHeight(tg.viewportStableHeight || window.innerHeight);
        setThemeParams(tg.themeParams || {});
        setColorScheme(tg.colorScheme || 'dark');

        // Check fullscreen support (Telegram 8.0+)
        if (typeof tg.requestFullscreen === 'function') {
          tg.requestFullscreen();
          setIsFullscreen(Boolean(tg.isFullscreen));
        }

        // Set header color to match futuristic Valixen cyber aesthetic
        if (typeof tg.setHeaderColor === 'function') {
          tg.setHeaderColor('#07090E');
        }
        if (typeof tg.setBackgroundColor === 'function') {
          tg.setBackgroundColor('#07090E');
        }

        // Viewport resize listener
        const handleViewportChanged = (event: any) => {
          setIsExpanded(Boolean(tg.isExpanded));
          setViewportHeight(tg.viewportHeight || window.innerHeight);
          setViewportStableHeight(tg.viewportStableHeight || window.innerHeight);
          if (typeof tg.isFullscreen !== 'undefined') {
            setIsFullscreen(Boolean(tg.isFullscreen));
          }
        };

        const handleThemeChanged = () => {
          setThemeParams(tg.themeParams || {});
          setColorScheme(tg.colorScheme || 'dark');
        };

        tg.onEvent?.('viewportChanged', handleViewportChanged);
        tg.onEvent?.('themeChanged', handleThemeChanged);

        setIsReady(true);

        return () => {
          tg.offEvent?.('viewportChanged', handleViewportChanged);
          tg.offEvent?.('themeChanged', handleThemeChanged);
        };
      } catch (err) {
        console.warn('Telegram WebApp initialization notice:', err);
        setIsReady(true);
      }
    } else {
      setIsReady(true);
    }
  }, []);

  const initData = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return window.Telegram?.WebApp?.initData || '';
  }, [isAvailable]);

  const initDataUnsafe = useMemo(() => {
    if (typeof window === 'undefined') return {};
    return window.Telegram?.WebApp?.initDataUnsafe || {};
  }, [isAvailable]);

  // Extract startapp parameter from initData or URL search params
  const startParam = useMemo(() => {
    if (initDataUnsafe.start_param) return initDataUnsafe.start_param;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return (
        urlParams.get('startapp') ||
        urlParams.get('tgWebAppStartParam') ||
        urlParams.get('tab') ||
        null
      );
    }
    return null;
  }, [initDataUnsafe]);

  const expand = useCallback(() => {
    window.Telegram?.WebApp?.expand?.();
    setIsExpanded(true);
  }, []);

  const requestFullscreen = useCallback(() => {
    const tg = window.Telegram?.WebApp;
    if (tg?.requestFullscreen) {
      tg.requestFullscreen();
      setIsFullscreen(true);
    } else {
      tg?.expand?.();
      setIsExpanded(true);
    }
  }, []);

  const close = useCallback(() => {
    window.Telegram?.WebApp?.close?.();
  }, []);

  const openLink = useCallback((url: string, options?: { try_instant_view?: boolean }) => {
    if (window.Telegram?.WebApp?.openLink) {
      window.Telegram?.WebApp?.openLink(url, options);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const openTelegramLink = useCallback((url: string) => {
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram?.WebApp?.openTelegramLink(url);
    } else {
      window.location.href = url;
    }
  }, []);

  const setBackButton = useCallback((visible: boolean, onClick?: () => void) => {
    const btn = window.Telegram?.WebApp?.BackButton;
    if (!btn) return;
    if (visible) {
      btn.show();
      if (onClick) {
        btn.onClick(onClick);
      }
    } else {
      btn.hide();
    }
  }, []);

  const setMainButton = useCallback((options: {
    text: string;
    visible?: boolean;
    isActive?: boolean;
    showProgress?: boolean;
    onClick?: () => void;
  }) => {
    const btn = window.Telegram?.WebApp?.MainButton;
    if (!btn) return;

    btn.setText(options.text);
    if (options.visible !== false) {
      btn.show();
    } else {
      btn.hide();
    }

    if (options.isActive !== false) {
      btn.enable();
    } else {
      btn.disable();
    }

    if (options.showProgress) {
      btn.showProgress();
    } else {
      btn.hideProgress();
    }

    if (options.onClick) {
      btn.onClick(options.onClick);
    }
  }, []);

  const haptic = useMemo(
    () => ({
      impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
        try {
          window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.(style);
        } catch {}
      },
      notification: (type: 'error' | 'success' | 'warning') => {
        try {
          window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.(type);
        } catch {}
      },
      selection: () => {
        try {
          window.Telegram?.WebApp?.HapticFeedback?.selectionChanged?.();
        } catch {}
      },
    }),
    []
  );

  return {
    isAvailable,
    isReady,
    initData,
    initDataUnsafe,
    themeParams,
    colorScheme,
    viewportHeight,
    viewportStableHeight,
    isExpanded,
    isFullscreen,
    startParam,
    expand,
    requestFullscreen,
    close,
    openLink,
    openTelegramLink,
    setBackButton,
    setMainButton,
    haptic,
  };
}
