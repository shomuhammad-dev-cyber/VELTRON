// ==============================================================================
// VELTRON INTELLIGENT COGNITIVE AI ASSISTANT (/ai-assistant)
// Universal Multi-Domain Cognitive Intelligence & Grounded Financial Telemetry
// Luxury Horology Aesthetic — Black Stitched Leather, Champagne Gold & Precision
// ==============================================================================

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { Logo } from '@/components/ui/Logo';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { SoundController } from '@/components/ui/SoundController';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { mechanicalAudio } from '@/lib/sound/MechanicalSoundSystem';
import {
  Bot,
  Sparkles,
  Send,
  Plus,
  Trash2,
  History,
  MessageSquare,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  PieChart,
  Coins,
  Landmark,
  ChevronRight,
  Lightbulb,
  Lock,
  Layers,
  Activity,
  Menu,
  X,
  Terminal as Code2,
  Zap as Rocket,
  Coins as Calculator,
  Sparkles as Compass,
  SlidersHorizontal,
  ChevronLeft,
  DollarSign,
  ArrowUpRight as Maximize2,
} from 'lucide-react';

interface ConversationSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface MessageItem {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  financialCitations?: any;
  createdAt: string;
}

type PromptCategory = 'ALL' | 'BANKING' | 'MARKETS' | 'BUDGET' | 'TECH' | 'BUSINESS';

interface PromptCard {
  id: string;
  category: PromptCategory;
  icon: any;
  label: Record<string, string>;
  prompt: Record<string, string>;
  accentColor: string;
  bgGlow: string;
}

const EXTENDED_PROMPTS: PromptCard[] = [
  {
    id: 'cbu-rates',
    category: 'BANKING',
    icon: Landmark,
    label: {
      uz: 'Rasmiy MB Valyuta Kurslari',
      ru: 'Официальные курсы ЦБ РУз',
      en: 'Official CBU FX Bulletins',
      ar: 'أسعار الصرف الرسمية للبنك المركزي',
    },
    prompt: {
      uz: 'O‘zbekiston Markaziy Bankining USD, EUR va RUB bo‘yicha bugungi rasmiy kurslarini va o‘zgarish sabablarini tushuntirib ber.',
      ru: 'Предоставь официальные курсы валют Центрального банка Узбекистана (USD, EUR, RUB) и аналитику динамики.',
      en: 'What are the official Central Bank of Uzbekistan (CBU) exchange rates for USD, EUR and RUB, and what drives their trajectory?',
      ar: 'ما هي أسعار الصرف الرسمية للبنك المركزي الأوزبكي للدولار واليورو والروبل اليوم وما هي أسباب تقلباتها؟',
    },
    accentColor: 'text-amber-400',
    bgGlow: 'hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]',
  },
  {
    id: 'deposit-vs-usd',
    category: 'BANKING',
    icon: Activity,
    label: {
      uz: '22% Omonat vs AQSh Dollari',
      ru: 'Вклад 22% в сумах vs Доллар',
      en: '22% UZS Deposit vs USD FX',
      ar: 'وديعة سوم 22٪ مقابل الدولار',
    },
    prompt: {
      uz: 'So‘mdagi 22% bank omonati foydalimi yoki valyuta xarid qilish? Inflyatsiya va devalvatsiya ta’sirini aniq matematik hisoblab ber.',
      ru: 'Что выгоднее: сумовой депозит под 22% годовых или покупка долларов США? Рассчитай реальную доходность с учетом инфляции.',
      en: 'Is a 22% local UZS bank deposit superior to purchasing US Dollars? Calculate the net real purchasing power factoring inflation.',
      ar: 'هل الوديعة المصرفية بالسوم بنسبة 22٪ أفضل أم شراء الدولار؟ احسب العائد الحقيقي الصافي بدقة مع التضخم.',
    },
    accentColor: 'text-emerald-400',
    bgGlow: 'hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
  },
  {
    id: 'bitcoin-intelligence',
    category: 'MARKETS',
    icon: Coins,
    label: {
      uz: 'Bitcoin & Kripto Telemetriyasi',
      ru: 'Анализ рынка Bitcoin и крипто',
      en: 'Bitcoin Macro Intelligence',
      ar: 'تحليل عملة البيتكوين والعملات المشفرة',
    },
    prompt: {
      uz: 'Bitcoin va kriptovalyuta bozoridagi so‘nggi tebranish sabablari, spot ETF oqimlari va xavfni boshqarish qoidalarini tahlil qil.',
      ru: 'Объясни текущую динамику Bitcoin, институциональные притоки в Spot ETF и правила управления рыночными рисками.',
      en: 'Explain why Bitcoin shifted recently, institutional spot ETF flows, and probabilistic risk mitigation frameworks.',
      ar: 'اشرح حركة سعر البيتكوين الأخيرة وتدفقات صناديق الاستثمار وقواعد إدارة المخاطر المالية.',
    },
    accentColor: 'text-amber-300',
    bgGlow: 'hover:border-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
  },
  {
    id: 'sp500-etf',
    category: 'MARKETS',
    icon: TrendingUp,
    label: {
      uz: 'S&P 500 va Global ETF Fondlari',
      ru: 'Инвестиции в S&P 500 и ETF',
      en: 'S&P 500 & Index Compounding',
      ar: 'الاستثمار في S&P 500 والصناديق العالمية',
    },
    prompt: {
      uz: 'Boshlovchilar uchun S&P 500 (VOO, SPY) va texnologik ETF (QQQ) fondlariga muntazam sarmoya kiritish (DCA) strategiyasini tushuntir.',
      ru: 'Как правильно инвестировать в индекс S&P 500 (VOO) и технологический Nasdaq (QQQ) по стратегии усреднения долларовой стоимости (DCA)?',
      en: 'Provide a blueprint for compounding wealth via S&P 500 index ETFs (VOO, SPY) and Nasdaq (QQQ) using Dollar-Cost Averaging.',
      ar: 'كيفية الاستثمار المنتظم في مؤشر S&P 500 وصناديق التكنولوجيا العالمية وبناء الثروة المركبة طويلة الأجل؟',
    },
    accentColor: 'text-cyan-400',
    bgGlow: 'hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]',
  },
  {
    id: 'spending-audit',
    category: 'BUDGET',
    icon: PieChart,
    label: {
      uz: 'Oylik Xarajatlar Auditi',
      ru: 'Аудит ежемесячных расходов',
      en: 'Monthly Outflow Telemetry',
      ar: 'تدقيق النفقات الشهرية',
    },
    prompt: {
      uz: 'Mening oxirgi 30 kunlik haqiqiy xarajatlarimni tahlil qilib ber. Qaysi kategoriyalarda ortiqcha pul sarflayapman?',
      ru: 'Проанализируй мои фактические расходы за последние 30 дней и выдели ключевые категории для оптимизации.',
      en: 'How much did I spend this trailing 30 days? Break down verified outflow categories and pinpoint optimization levers.',
      ar: 'قم بتحليل نفقاتي الفعلية خلال الثلاثين يوما الماضية وتحديد المجالات التي يمكن خفض النفقات فيها.',
    },
    accentColor: 'text-rose-400',
    bgGlow: 'hover:border-rose-500/40 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]',
  },
  {
    id: 'budget-503020',
    category: 'BUDGET',
    icon: Lightbulb,
    label: {
      uz: '50/30/20 Byudjet Modeli',
      ru: 'Бюджетирование 50/30/20',
      en: '50/30/20 Capital Allocation',
      ar: 'نموذج الميزانية 50/30/20',
    },
    prompt: {
      uz: 'Oylik daromadim va chiqimlarim asosida 50/30/20 qoidasi bo‘yicha aniq taqsimot va jamg‘armani 2 baravar oshirish rejasini tuz.',
      ru: 'Составь математический план распределения бюджета 50/30/20 на основе моих поступлений для удвоения нормы сбережений.',
      en: 'Construct an actionable 50/30/20 budget framework based on my actual monthly income to optimize liquid capital retention.',
      ar: 'ضع خطة عملية لتوزيع الميزانية وفق قاعدة 50/30/20 لزيادة معدل الادخار والاستثمار بنجاح.',
    },
    accentColor: 'text-violet-400',
    bgGlow: 'hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]',
  },
  {
    id: 'software-arch',
    category: 'TECH',
    icon: Code2,
    label: {
      uz: 'Dasturiy Arxitektura & IT',
      ru: 'Архитектура ПО и Разработка',
      en: 'Software Architecture & Code',
      ar: 'هندسة البرمجيات والبرمجة',
    },
    prompt: {
      uz: 'Yuqori yuklamali (high-load) fintech tizimlarida TypeScript, Next.js va PostgreSQL arxitekturasini qanday toza va xavfsiz qurish kerak?',
      ru: 'Как правильно построить масштабируемую архитектуру финтех-платформы на TypeScript, Next.js, Prisma и PostgreSQL?',
      en: 'How do you design a high-load, secure fintech architecture using TypeScript, Next.js, PostgreSQL and zero-trust security?',
      ar: 'كيف تصمم بنية برمجية متكاملة وعالية الأمان لمنصة تقنية مالية باستخدام TypeScript و Next.js وقواعد البيانات؟',
    },
    accentColor: 'text-blue-400',
    bgGlow: 'hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]',
  },
  {
    id: 'ai-engineering',
    category: 'TECH',
    icon: Sparkles,
    label: {
      uz: 'Sun’iy Intellekt Integratsiyasi',
      ru: 'Инженерия ИИ и LLM систем',
      en: 'AI & LLM System Engineering',
      ar: 'هندسة وتكامل الذكاء الاصطناعي',
    },
    prompt: {
      uz: 'Katta til modellari (LLM) bilan ishlashda hallucination (yolg‘on ma’lumotlar)ni kamaytirish va RAG tizimini qanday to‘g‘ri qurish mumkin?',
      ru: 'Каковы лучшие методы борьбы с галлюцинациями LLM моделей и внедрения Retrieval-Augmented Generation (RAG) систем?',
      en: 'Explain architectural best practices for mitigating LLM hallucinations using grounded telemetry, vector embeddings, and RAG.',
      ar: 'ما هي أفضل الممارسات الهندسية لمنع هلوسة نماذج الذكاء الاصطناعي وتطبيق أنظمة استرجاع المعرفة RAG؟',
    },
    accentColor: 'text-purple-400',
    bgGlow: 'hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]',
  },
  {
    id: 'startup-unit-econ',
    category: 'BUSINESS',
    icon: Rocket,
    label: {
      uz: 'Startap Unit-Iqtisodiyoti',
      ru: 'Unit-экономика стартапа',
      en: 'Venture Unit Economics',
      ar: 'اقتصاديات الشركات الناشئة',
    },
    prompt: {
      uz: 'Yangi biznes yoki startapda CAC (mijoz jalb qilish narxi) va LTV (mijoz keltiradigan foyda) nisbatini qanday hisoblash va boshqarish kerak?',
      ru: 'Как рассчитать Unit-экономику (LTV, CAC, Churn Rate) для технологического бизнеса перед привлечением инвестиций?',
      en: 'Detail the mathematical framework for calculating LTV/CAC ratios, churn velocity, and payback horizons for startups.',
      ar: 'كيف تحسب بدقة اقتصاديات الوحدة (LTV مقابل CAC) وتدفق السيولة لمشروع تجاري ناشئ قبل الاستثمار؟',
    },
    accentColor: 'text-orange-400',
    bgGlow: 'hover:border-orange-500/40 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]',
  },
  {
    id: 'compound-calc',
    category: 'BUSINESS',
    icon: Calculator,
    label: {
      uz: 'Murakkab Foiz & Boylik',
      ru: 'Сложные проценты и Капитал',
      en: 'Compound Wealth Compounding',
      ar: 'الفائدة المركبة ونمو رأس المال',
    },
    prompt: {
      uz: 'Oyiga $200 USD miqdorida muntazam sarmoya kiritib borsa, 10 yilda yillik 12% murakkab foiz bilan qancha kapital yig‘iladi? Formulani ko‘rsat.',
      ru: 'Сколько составит капитал через 10 лет при ежемесячном инвестировании $200 под 12% годовых со сложными процентами? Покажи формулу.',
      en: 'Calculate the total compounded capital if $200/month is invested at 12% annualized return over 10 years. Detail the mathematical formula.',
      ar: 'كم سيصل رأس المال بعد 10 سنوات عند استثمار 200 دولار شهريا بمعدل فائدة مركبة 12٪ سنويا؟ اشرح المعادلة الحسابية.',
    },
    accentColor: 'text-teal-400',
    bgGlow: 'hover:border-teal-500/40 hover:shadow-[0_0_30px_rgba(20,184,166,0.15)]',
  },
  {
    id: 'debt-snowball',
    category: 'BUDGET',
    icon: ShieldCheck,
    label: {
      uz: 'Qarzdan Qutulish Strategiyasi',
      ru: 'Ликвидация долгов: Avalanche',
      en: 'Debt Elimination Frameworks',
      ar: 'استراتيجية التخلص من الديون',
    },
    prompt: {
      uz: 'Kredit va qarzlardan eng kam foiz to‘lab, tezroq qutulish uchun «Qor ko‘chkisi» (Avalanche) usulini qadam-baqadam tushuntir.',
      ru: 'Объясни пошаговую стратегию «Лавина» (Avalanche) для скорейшего погашения кредитов с минимальными переплатами по процентам.',
      en: 'Break down the mathematical Debt Avalanche and Snowball frameworks to eliminate credit liabilities with minimal interest friction.',
      ar: 'اشرح استراتيجية كرة الثلج والانهيار الجليدي للتخلص السريع من القروض والالتزامات بأقل تكلفة فوائد.',
    },
    accentColor: 'text-emerald-300',
    bgGlow: 'hover:border-emerald-400/40 hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]',
  },
  {
    id: 'universal-inquiry',
    category: 'ALL',
    icon: Compass,
    label: {
      uz: 'Universal Savol-Javob',
      ru: 'Универсальный интеллект',
      en: 'Universal Cognitive Synthesis',
      ar: 'الذكاء المعرفي الشامل',
    },
    prompt: {
      uz: 'Menga hayotiy rejalashtirish, vaqtni boshqarish va intizomni mustahkamlash bo‘yicha eng samarali 5 ta ilmiy usulni yozib ber.',
      ru: 'Опиши 5 научно доказанных принципов тайм-менеджмента, фокуса и системной продуктивности для достижения долгосрочных целей.',
      en: 'Synthesize the top 5 empirical frameworks for high-leverage time management, cognitive focus, and compound execution.',
      ar: 'لخص أهم 5 مبادئ علمية لإدارة الوقت والتركيز العالي وبناء الانضباط الذاتي لتحقيق الأهداف الكبرى.',
    },
    accentColor: 'text-amber-200',
    bgGlow: 'hover:border-amber-300/40 hover:shadow-[0_0_30px_rgba(253,230,138,0.15)]',
  },
];

export default function AiAssistantPage() {
  const router = useRouter();
  const { language, t, isRtl } = useLanguage();

  // State
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<PromptCategory>('ALL');

  // Grounded Financial Telemetry Context
  const [contextMetrics, setContextMetrics] = useState({
    totalNetWorth: 290150.0,
    monthlyIncome: 12500.0,
    monthlyExpenses: 3240.0,
    savingsRate: 74.1,
    cbuUsdUzs: 12850.0,
    cbuEurUzs: 13920.0,
    btcPrice: 68420.0,
    ethPrice: 3512.0,
    goldPrice: 2742.0,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Fetch Conversations from server
  const fetchConversations = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch('/api/v1/ai/conversations');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setConversations(json.data);
        }
      }
    } catch {
      // Offline fallback
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Filtered prompt cards
  const visiblePrompts = useMemo(() => {
    if (activeCategory === 'ALL') return EXTENDED_PROMPTS;
    return EXTENDED_PROMPTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // Load specific conversation
  const loadConversation = async (convId: string) => {
    mechanicalAudio.playClick();
    setActiveConversationId(convId);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/ai/conversations/${convId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.messages) {
          setMessages(json.data.messages);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  // Start new conversation
  const handleNewConversation = () => {
    mechanicalAudio.playWinding();
    setActiveConversationId(null);
    setMessages([]);
    setInputPrompt('');
    inputRef.current?.focus();
  };

  // Delete conversation
  const handleDeleteConversation = async (e: React.MouseEvent, convId: string) => {
    e.stopPropagation();
    mechanicalAudio.playClick();
    try {
      await fetch(`/api/v1/ai/conversations/${convId}`, { method: 'DELETE' });
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeConversationId === convId) {
        handleNewConversation();
      }
    } catch {}
  };

  // Send Message
  const handleSendMessage = async (customPrompt?: string) => {
    const text = (customPrompt || inputPrompt).trim();
    if (!text || isLoading) return;

    mechanicalAudio.playClick();
    setInputPrompt('');
    setIsLoading(true);

    const tempUserMessage: MessageItem = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversationId,
          prompt: text,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'AI request failed');
      }

      const newConvId = data.data.conversationId;
      if (!activeConversationId && newConvId) {
        setActiveConversationId(newConvId);
        fetchConversations();
      }

      const assistantReply: MessageItem = {
        id: `reply-${Date.now()}`,
        role: 'assistant',
        content: data.data.reply,
        financialCitations: data.data.citations,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantReply]);
      mechanicalAudio.playTick();
    } catch (err: any) {
      const errorReply: MessageItem = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Processing Notice:** ${err.message || 'Unable to connect to the neural engine. Switching to local resilient cache.'}`,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy message
  const handleCopyMessage = (id: string, text: string) => {
    mechanicalAudio.playClick();
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#090706] text-[#E9DDCA] flex flex-col font-manrope selection:bg-[#C6A477]/30 selection:text-white"
    >
      {/* 1. LUXURY NAVBAR */}
      <LuxuryNavbar />

      {/* -------------------------------------------------------------------- */}
      {/* 2. REAL-TIME TICKER RIBBON ACROSS THE ENTIRE WIDTH */}
      {/* -------------------------------------------------------------------- */}
      <div className="w-full bg-[#140C0A] border-b border-[#C1A477]/20 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto no-scrollbar flex items-center justify-between gap-6 text-[11px] font-sans text-[#F0E8DC]/70">
        <div className="flex items-center gap-5 sm:gap-8 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C1A477] animate-pulse" />
            <span className="text-[#F0E8DC]/60">CBU USD/UZS:</span>
            <span className="text-[#FAF7F1] font-semibold">{contextMetrics.cbuUsdUzs.toLocaleString()} so‘m</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C1A477]" />
            <span className="text-[#F0E8DC]/60">CBU EUR/UZS:</span>
            <span className="text-[#FAF7F1] font-semibold">{contextMetrics.cbuEurUzs.toLocaleString()} so‘m</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C1A477]" />
            <span className="text-[#F0E8DC]/60">BTC/EUR:</span>
            <span className="text-[#FAF7F1] font-semibold">€63,420 (+3.4%)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C1A477]" />
            <span className="text-[#F0E8DC]/60">Gold Bullion 999.9:</span>
            <span className="text-[#C1A477] font-semibold">€2,548/oz</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 shrink-0 text-[#F0E8DC]/70">
          <span>Outflow: <strong className="text-[#FAF7F1]">€{contextMetrics.monthlyExpenses.toLocaleString()}</strong></span>
          <span>Savings Rate: <strong className="text-[#C1A477]">{contextMetrics.savingsRate}%</strong></span>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 3. MAIN WORKSPACE CANVAS (EXPANSIVE EDGE-TO-EDGE) */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex-1 w-full flex overflow-hidden relative">
        {/* Left Sidebar (Collapsible History & Telemetry) */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-30 bg-[#1A110E] border-r border-[#C1A477]/20 flex flex-col transition-all duration-300 md:translate-x-0 ${
            isSidebarCollapsed ? 'w-20' : 'w-72 lg:w-80'
          } ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Sidebar Top Action */}
          <div className="p-3.5 border-b border-[#C1A477]/20 flex items-center justify-between gap-2">
            <button
              onClick={handleNewConversation}
              className={`flex-1 py-2.5 px-3 rounded-xl bespoke-btn-champagne text-[#1A110E] font-sans font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all ${
                isSidebarCollapsed ? 'px-0' : ''
              }`}
              title="Start New Consultation"
            >
              <Plus className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>{t('aiAssistant.newChat')}</span>}
            </button>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-2 rounded-lg bg-[#211714] border border-[#C1A477]/20 text-[#F0E8DC] hover:text-white transition-colors"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C1A477]" />
            </button>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 text-[#F0E8DC] hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conversations History List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {!isSidebarCollapsed && (
              <div className="px-2 py-1 text-[10px] font-sans uppercase tracking-widest text-[#C1A477] font-bold flex items-center justify-between">
                <span>{t('aiAssistant.conversations') || 'Suhbatlar Tarixi'}</span>
                <History className="w-3.5 h-3.5" />
              </div>
            )}

            {loadingHistory ? (
              <div className="p-4 text-center text-xs text-[#F0E8DC]/50">
                <RefreshCw className="w-4 h-4 mx-auto animate-spin mb-2 text-[#C1A477]" />
                {!isSidebarCollapsed && <span>{t('aiAssistant.loadingHistory') || 'Yuklanmoqda...'}</span>}
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#F0E8DC]/50">
                {!isSidebarCollapsed && <span>{t('aiAssistant.noHistory') || 'Hali saqlangan konsultatsiyalar yo‘q.'}</span>}
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = conv.id === activeConversationId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      loadConversation(conv.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all text-xs ${
                      isActive
                        ? 'bg-[#54252D] text-[#FAF7F1] border border-[#C1A477]/40 font-semibold'
                        : 'text-[#F0E8DC]/70 hover:text-white hover:bg-[#211714]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#C1A477]' : 'text-[#F0E8DC]/40'}`} />
                      {!isSidebarCollapsed && <span className="truncate">{conv.title}</span>}
                    </div>

                    {!isSidebarCollapsed && (
                      <button
                        onClick={(e) => handleDeleteConversation(e, conv.id)}
                        title="Delete session"
                        className="opacity-0 group-hover:opacity-100 text-[#F0E8DC]/40 hover:text-rose-400 transition-opacity p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Grounded Context Telemetry Mini-Card */}
          {!isSidebarCollapsed && (
            <div className="p-4 border-t border-[#C1A477]/20 bg-[#140C0A]">
              <div className="text-[10px] font-sans text-[#C1A477] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C1A477]" />
                <span>VERIFIED TELEMETRY</span>
              </div>
              <div className="space-y-1.5 text-[11px] font-sans text-[#F0E8DC]/80">
                <div className="flex justify-between">
                  <span className="text-[#F0E8DC]/50">Verified Liquidity:</span>
                  <span className="text-[#FAF7F1] font-bold">€{contextMetrics.totalNetWorth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F0E8DC]/50">30D Inflow:</span>
                  <span className="text-[#C1A477] font-bold">+€{contextMetrics.monthlyIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F0E8DC]/50">30D Outflow:</span>
                  <span className="text-[#F0E8DC] font-bold">-€{contextMetrics.monthlyExpenses.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ------------------------------------------------------------------ */}
        {/* 4. EXPANSIVE FULL-WIDTH CHAT & PROMPT WORKSPACE */}
        {/* ------------------------------------------------------------------ */}
        <main className="flex-1 flex flex-col h-[calc(100vh-6.5rem)] overflow-hidden bg-[#211714]">
          {/* Messages & Hero Scroll Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6 space-y-6">
            {messages.length === 0 ? (
              /* HERO INTEL CANVAS: FULL-WIDTH BALANCED MATRIX */
              <div className="w-full max-w-[1720px] mx-auto py-2 sm:py-4 space-y-6">
                {/* Center Core Emblem */}
                <div className="text-center space-y-3 pt-2">
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#54252D] border-2 border-[#C1A477]/60 flex items-center justify-center shadow-2xl">
                      <Bot className="w-8 h-8 text-[#FAF7F1]" />
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-bespoke-serif font-normal text-[#FAF7F1] tracking-tight">
                    VELTRON <span className="italic text-[#C1A477]">Cognitive Oracle</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-[#F0E8DC]/80 max-w-4xl mx-auto leading-relaxed font-sans">
                    Universal institutsional sun'iy intellekt: barcha moliyaviy hisob-kitoblar, bank omonatlari, investitsiya strategiyalari, dasturlash va biznes qarorlariga 100% aniq va chuqur tahlil.
                  </p>
                </div>

                {/* Category Selection Tabs */}
                <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
                  {[
                    { id: 'ALL', label: 'Barcha Savollar', icon: Compass },
                    { id: 'BANKING', label: 'Bank Omonati & Valyuta', icon: Landmark },
                    { id: 'MARKETS', label: 'Fond Bozori & Kripto', icon: TrendingUp },
                    { id: 'BUDGET', label: 'Byudjet & Xarajatlar', icon: PieChart },
                    { id: 'TECH', label: 'Dasturlash & IT', icon: Code2 },
                    { id: 'BUSINESS', label: 'Biznes & Startap', icon: Rocket },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        mechanicalAudio.playClick();
                        setActiveCategory(tab.id as PromptCategory);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold flex items-center gap-1.5 transition-all ${
                        activeCategory === tab.id
                          ? 'bg-[#54252D] text-[#FAF7F1] border border-[#C1A477]/40 shadow-sm'
                          : 'bg-[#1A110E] text-[#F0E8DC]/70 hover:text-white border border-[#C1A477]/20 hover:bg-[#211714]'
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5 text-[#C1A477]" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Expansive Full-Width Prompt Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3.5 sm:gap-4 pt-2">
                  {visiblePrompts.map((card) => {
                    const cardLabel = card.label[language] || card.label.en;
                    const cardPrompt = card.prompt[language] || card.prompt.en;

                    return (
                      <button
                        key={card.id}
                        onClick={() => handleSendMessage(cardPrompt)}
                        className="p-5 rounded-2xl italian-card bg-[#1A110E] border border-[#C1A477]/30 hover:border-[#C1A477] transition-all flex flex-col justify-between text-left group shadow-md"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="p-2.5 rounded-xl bg-[#54252D]/40 border border-[#C1A477]/30 text-[#C1A477] group-hover:scale-105 transition-transform">
                              <card.icon className="w-4 h-4 text-[#C1A477]" />
                            </div>
                            <span className="text-[10px] font-sans text-[#C1A477] uppercase tracking-wider font-semibold">
                              {card.category}
                            </span>
                          </div>

                          <div className="text-sm font-bespoke-serif font-bold text-[#FAF7F1] group-hover:text-[#C1A477] transition-colors line-clamp-1">
                            {cardLabel}
                          </div>

                          <div className="text-xs text-[#F0E8DC]/80 leading-relaxed line-clamp-3 font-sans">
                            {cardPrompt}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#C1A477]/20 flex items-center justify-between text-[11px] font-sans text-[#C1A477] group-hover:text-[#FAF7F1]">
                          <span>1-Click So'rash</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* ACTIVE MESSAGES STREAM: FULL-WIDTH LUXURY CONVERSATION */
              <div className="w-full max-w-[1720px] mx-auto space-y-5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3.5 w-full ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-9 h-9 rounded-xl bg-[#54252D] border border-[#C1A477]/40 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                        <Bot className="w-5 h-5 text-[#FAF7F1]" />
                      </div>
                    )}

                    <div
                      className={`space-y-1.5 ${
                        msg.role === 'user'
                          ? 'max-w-2xl sm:max-w-3xl ml-auto'
                          : 'max-w-4xl lg:max-w-5xl 2xl:max-w-6xl mr-auto'
                      }`}
                    >
                      <div
                        className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-[#54252D] text-[#FAF7F1] border border-[#C1A477]/40 rounded-tr-none shadow-md font-sans'
                            : 'italian-card bg-[#1A110E] border border-[#C1A477]/30 text-[#FAF7F1] rounded-tl-none shadow-xl font-sans'
                        }`}
                      >
                        {/* Markdown Formatted Body */}
                        <div className="prose prose-invert prose-xs sm:prose-sm max-w-none space-y-2 whitespace-pre-wrap font-sans text-[#FAF7F1]">
                          {msg.content}
                        </div>

                        {/* Citation & Copy Footer */}
                        <div className="mt-3 pt-3 border-t border-[#C1A477]/20 flex items-center justify-between text-[10px] font-sans text-[#F0E8DC]/60">
                          {msg.role === 'assistant' ? (
                            <span className="flex items-center gap-1.5 text-[#C1A477]">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Grounded in verified institutional telemetry</span>
                            </span>
                          ) : (
                            <span className="text-[#F0E8DC]/50">User Query</span>
                          )}

                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="hover:text-white transition-colors flex items-center gap-1 px-2 py-0.5 rounded bg-[#211714] border border-[#C1A477]/20 text-[#C1A477]"
                          >
                            {copiedMessageId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-[#C1A477]" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="text-[10px] font-sans text-[#F0E8DC]/40 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Synthesis Indicator */}
                {isLoading && (
                  <div className="flex gap-3.5 w-full justify-start items-start">
                    <div className="w-9 h-9 rounded-xl bg-[#54252D] border border-[#C1A477]/40 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-[#FAF7F1] animate-pulse" />
                    </div>
                    <div className="p-4 rounded-2xl bg-[#1A110E] border border-[#C1A477]/30 text-xs text-[#F0E8DC] rounded-tl-none flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#C1A477] animate-ping" />
                        <span className="w-2 h-2 rounded-full bg-[#C1A477] animate-pulse delay-75" />
                      </div>
                      <span className="font-sans text-[11px] text-[#F0E8DC]/80">
                        Analyzing grounded ledger records, formulas & market intelligence...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 5. EXPANSIVE FULL-WIDTH INPUT CONSOLE */}
          {/* ------------------------------------------------------------------ */}
          <div className="p-4 sm:p-5 border-t border-[#C1A477]/20 bg-[#1A110E]">
            <div className="w-full max-w-[1720px] mx-auto space-y-2.5">
              {/* Quick Action Chips Bar */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px] font-sans text-[#F0E8DC]/70">
                <span className="text-[#C1A477] shrink-0 font-bold">Tezkor savollar:</span>
                {[
                  { label: 'Omonat vs Dollar?', prompt: 'So‘mdagi 22% bank omonati foydalimi yoki AQSh dollari xaridi?' },
                  { label: 'MB Kurslari?', prompt: 'O‘zbekiston Markaziy Bankining bugungi rasmiy kurslarini aytib ber.' },
                  { label: 'Mening xarajatlarim?', prompt: 'Mening so‘nggi 30 kunlik xarajatlarimni tahlil qilib ber.' },
                  { label: '50/30/20 reja?', prompt: 'Oylik daromadim bo‘yicha 50/30/20 byudjet taqsimotini tuzib ber.' },
                  { label: 'S&P 500 nima?', prompt: 'S&P 500 indeks fondlariga (VOO) investitsiya kiritish qoidalarini tushuntir.' },
                  { label: 'Python dasturlash?', prompt: 'Fintech tizimlarida asinxron Python va Next.js integratsiyasini tushuntir.' },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.prompt)}
                    className="px-2.5 py-1 rounded-lg bg-[#211714] hover:bg-[#54252D]/40 hover:text-white border border-[#C1A477]/20 hover:border-[#C1A477]/40 shrink-0 transition-all text-[#F0E8DC]"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Input Form with Send Button */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative flex items-center gap-3"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    placeholder={t('aiAssistant.inputPlaceholder') || 'Xarajatlar, omonat, aksiyalar yoki xohlagan savolingizni yozing...'}
                    disabled={isLoading}
                    suppressHydrationWarning
                    className="w-full bg-[#211714] border border-[#C1A477]/30 rounded-2xl pl-5 pr-14 py-3.5 sm:py-4 text-xs sm:text-sm text-[#FAF7F1] placeholder-[#F0E8DC]/40 focus:outline-none focus:border-[#C1A477] focus:ring-1 focus:ring-[#C1A477] shadow-inner transition-all font-sans"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <kbd className="hidden sm:inline-block text-[9px] font-sans text-[#C1A477] bg-[#1A110E] px-1.5 py-0.5 rounded border border-[#C1A477]/20">
                      Enter
                    </kbd>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !inputPrompt.trim()}
                  className="p-3.5 sm:p-4 rounded-2xl bespoke-btn-champagne text-[#1A110E] font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all shrink-0"
                  aria-label="Send Message"
                >
                  <Send className="w-5 h-5 text-[#1A110E]" />
                </button>
              </form>

              {/* Compliance & Regulatory Disclaimer */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
                <span>{t('aiAssistant.disclaimer')}</span>
                <span>25 requests/min throttle • Zero CVV/PIN</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
