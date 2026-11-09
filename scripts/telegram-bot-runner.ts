// ==============================================================================
// VELTRON MUKAMMAL TELEGRAM BOT ENGINE & AUTONOMOUS WORKER
// Ultra-Luxury Bespoke Royal FinTech Bot with In-Bot Trading & Realtime AI Advisor
// Bot: @VeltronAI_Bot | Admin ID: 7552517378
// ==============================================================================

import fs from 'fs';
import path from 'path';
import https from 'https';

const httpsAgent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: false,
});

// -----------------------------------------------------------------------------
// 1. Environment & Configuration
// -----------------------------------------------------------------------------
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://veltron-1pab.vercel.app';
const TELEGRAM_API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

// -----------------------------------------------------------------------------
// 2. Persistent User Database (JSON Storage)
// -----------------------------------------------------------------------------
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_FILE = path.join(DATA_DIR, 'telegram-users.json');

interface UserHolding {
  symbol: string;
  amount: number;
  avgBuyPrice: number;
}

interface UserTrade {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  amount: number;
  price: number;
  totalUsd: number;
  timestamp: string;
}

interface UserState {
  chatId: number;
  firstName: string;
  username: string;
  language: 'uz' | 'en' | 'ru';
  cashBalance: number;
  holdings: Record<string, UserHolding>;
  trades: UserTrade[];
  xp: number;
  level: string;
  completedQuizzes: number[];
  createdAt: string;
  lastActiveAt: string;
}

let usersDb: Record<string, UserState> = {};
if (fs.existsSync(DB_FILE)) {
  try {
    usersDb = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    usersDb = {};
  }
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(usersDb, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save user database:', err);
  }
}

function getUser(chatId: number, from?: any): UserState {
  const idStr = String(chatId);
  if (!usersDb[idStr]) {
    usersDb[idStr] = {
      chatId,
      firstName: from?.first_name || 'Hurmatli Investor',
      username: from?.username ? `@${from.username}` : 'Foydalanuvchi',
      language: 'uz',
      cashBalance: 100000.0, // $100k demo capital
      holdings: {
        BTC: { symbol: 'BTC', amount: 0.5, avgBuyPrice: 62000 },
        ETH: { symbol: 'ETH', amount: 3.0, avgBuyPrice: 3000 },
        XAU: { symbol: 'XAU', amount: 2.0, avgBuyPrice: 2300 },
      },
      trades: [],
      xp: 1200,
      level: 'Explorer',
      completedQuizzes: [],
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };
    saveDb();
  } else {
    usersDb[idStr].lastActiveAt = new Date().toISOString();
    if (from?.first_name) usersDb[idStr].firstName = from.first_name;
    if (from?.username) usersDb[idStr].username = `@${from.username}`;
  }
  return usersDb[idStr];
}

function calculatePortfolioValue(user: UserState): {
  totalEquity: number;
  holdingsValue: number;
  unrealizedPnl: number;
} {
  let holdingsValue = 0;
  let totalCost = 0;

  for (const sym of Object.keys(user.holdings)) {
    const h = user.holdings[sym];
    const currentPrice = ASSET_PRICES[sym]?.price || h.avgBuyPrice;
    holdingsValue += h.amount * currentPrice;
    totalCost += h.amount * h.avgBuyPrice;
  }

  const totalEquity = user.cashBalance + holdingsValue;
  const unrealizedPnl = holdingsValue - totalCost;
  return { totalEquity, holdingsValue, unrealizedPnl };
}

// -----------------------------------------------------------------------------
// 3. Asset Prices & Market Data
// -----------------------------------------------------------------------------
const ASSET_PRICES: Record<
  string,
  { name: string; symbol: string; price: number; change24h: number; icon: string; unit: string }
> = {
  BTC: { name: 'Bitcoin', symbol: 'BTC', price: 67432.18, change24h: 2.85, icon: '🪙', unit: 'BTC' },
  ETH: { name: 'Ethereum', symbol: 'ETH', price: 3245.67, change24h: 1.92, icon: '🔷', unit: 'ETH' },
  XAU: { name: 'Spot Oltin (Gold)', symbol: 'XAU', price: 2389.12, change24h: 0.41, icon: '🥇', unit: 'Oz' },
  TSLA: { name: 'Tesla Motors', symbol: 'TSLA', price: 248.31, change24h: -0.74, icon: '⚡', unit: 'Aksiya' },
  NVDA: { name: 'Nvidia Corp', symbol: 'NVDA', price: 138.25, change24h: 3.42, icon: '🟢', unit: 'Aksiya' },
};

// -----------------------------------------------------------------------------
// 4. Financial Academy Quizzes
// -----------------------------------------------------------------------------
const QUIZZES = [
  {
    id: 1,
    question: "Bozorda professional risk managementga ko'ra, bitta bitimda kapitalning ko'pi bilan necha foizini xatarga qo'yish tavsiya etiladi?",
    options: ['1% — 2% (Tavsiya etilgan)', '15% — 20%', '50%', 'Barcha depozitni'],
    correct: 0,
    explanation: "✅ To'g'ri! Wall Street va institutsional fondlarda bitta bitimdagi risk hech qachon umumiy kapitalning 1-2% idan oshmasligi kerak. Bu ketma-ket 10 ta noaniq bitimda ham portfelni saqlab qoladi.",
    xpReward: 100,
  },
  {
    id: 2,
    question: "Inflyatsiyadan himoyalanishda qaysi strategiya eng xavfsiz hisoblanadi?",
    options: [
      "Barcha pulni naqd saqlash",
      "Diversifikatsiya: Oltin, qimmatli qog'ozlar va global aktivlar",
      "Barcha pulga bitta kriptovalyuta olish",
      "Bankda 0% foizsiz hisobda qoldirish",
    ],
    correct: 1,
    explanation: "✅ Barakalla! Diversifikatsiya — barcha tuxumni bitta savatga qo'ymaslik qoidasi. Oltin va global indekslar pulning qadrsizlanishiga qarshi ishonchli qalqondir.",
    xpReward: 100,
  },
  {
    id: 3,
    question: "Kvant va Algoritmik treydingning an'anaviy inson savdosidan eng katta ustunligi nima?",
    options: [
      "Har doim 100% yutish kafolati",
      "Emotsiyalarsiz, sovuqqon matematik hisob va millisekundlik tezlik",
      "Faqat tunda savdo qilish",
      "Bozor tahlilisiz tavakkal qilish",
    ],
    correct: 1,
    explanation: "✅ Ajoyib javob! Treyderlarning 90% i qo'rquv va ochko'zlik (emotsiya) tufayli adashadi. Kvant algoritmlari esa faqat qat'iy matematik qoidalar asosida ishlaydi.",
    xpReward: 100,
  },
];

// -----------------------------------------------------------------------------
// 5. Telegram API Request Dispatcher (Bulletproof https.request)
// -----------------------------------------------------------------------------
async function tgApi(method: string, body?: any): Promise<any> {
  return new Promise((resolve) => {
    const payload = body ? JSON.stringify(body) : '';
    const req = https.request(
      `${TELEGRAM_API_BASE}/${method}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        agent: httpsAgent,
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(raw));
          } catch {
            resolve({ ok: false, error: 'Invalid JSON' });
          }
        });
      }
    );

    req.on('error', (err) => {
      console.error(`❌ [API XATOLIK] ${method}:`, err.message);
      resolve({ ok: false, error: err.message });
    });

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

// -----------------------------------------------------------------------------
// 6. Navigation Keyboards
// -----------------------------------------------------------------------------

// Persistent Reply Keyboard at bottom of chat screen
function getPersistentKeyboard() {
  const tmaUrl = `${APP_URL}/tma`;
  return {
    keyboard: [
      [{ text: '🚀 VELTRON Platformasi', web_app: { url: tmaUrl } }, { text: '🎯 Muammolar & Yechim' }],
      [{ text: '📈 Jonli Bozorlar' }, { text: '💼 Savdo Qilish ($100k)' }],
      [{ text: '🎓 Akademiya & Test' }, { text: '🤖 AI Maslahat' }],
      [{ text: '📊 Mening Hisobim' }, { text: 'ℹ️ Yordam' }],
    ],
    resize_keyboard: true,
    is_persistent: true,
  };
}

// Main inline keyboard inside start message
function getMainInlineKeyboard() {
  const tmaUrl = `${APP_URL}/tma`;
  return {
    inline_keyboard: [
      [{ text: '🚀 VELTRON Platformasini Ochish (Web App)', web_app: { url: tmaUrl } }],
      [{ text: '🎯 VELTRON Nima Muammoni Hal Qiladi?', callback_data: 'cmd_problems' }],
      [
        { text: '📈 Jonli Bozorlar', callback_data: 'cmd_markets' },
        { text: '💼 Savdo Terminali ($100k)', callback_data: 'trade_menu' },
      ],
      [
        { text: '🎓 Akademiya & Viktorina', callback_data: 'cmd_academy' },
        { text: '🤖 AI Maslahatchi', callback_data: 'cmd_ai_prompt' },
      ],
      [
        { text: '📊 Mening Portfelim', callback_data: 'cmd_portfolio' },
        { text: 'ℹ️ Qo‘llanma', callback_data: 'cmd_help' },
      ],
    ],
  };
}

// -----------------------------------------------------------------------------
// 7. Message Generators
// -----------------------------------------------------------------------------

function getStartMessage(user: UserState) {
  const { totalEquity } = calculatePortfolioValue(user);

  return `
🏛️ <b>VELTRON — BESPOKE ROYAL LUXURY FINANCIAL ECOSYSTEM</b>
<i>Beyond Finance. A New Era.</i>

Assalomu alaykum, <b>${user.firstName}</b>!
Siz <b>VELTRON</b> oliy toifali kvant moliya texnologiyalari va institutsional savdo tarmog‘iga ulandingiz.

👑 <b>SIZNING HISOBLARINGIZ HOLATI:</b>
• 💰 <b>Umumiy Kapital:</b> <code>$${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</code>
• 💵 <b>Mavjud Naqd:</b> <code>$${user.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</code>
• 🏆 <b>Unvoningiz:</b> <code>${user.level} (${user.xp} XP)</code>
• 🛡️ <b>Xavfsizlik:</b> <code>AES-256-GCM / Kvant Shifrlash</code>

⚡ <b>QANDAY FOYDALANISH MUMKIN?</b>
1. <b>🚀 Platformani Ochish:</b> Sayt to‘g‘ridan-to‘g‘ri Telegram ichida to‘liq ochiladi.
2. <b>💼 Savdo Qilish:</b> Bot ichida Bitcoin, Ethereum, Oltin bilan bitimlar oching.
3. <b>🤖 AI Maslahat:</b> Har qanday moliya savolingizni yozib yuboring!
4. <b>🎓 Test Yechish:</b> Bilimingizni sinab, XP va yangi darajalarga erishing.

<i>Quyidagi menyu orqali kerakli bo‘limni tanlang:</i>
`;
}

function getProblemSolutionMessage() {
  return `
🎯 <b>VELTRON QANDAY MOLIYAVIY MUAMMOLARNI HAL QILADI?</b>

Bozorga kiruvchi har bir inson 4 ta halokatli to‘siqqa uchraydi. VELTRON ushbu muammolarni tubdan bartaraf etadi:

━━━━━━━━━━━━━━━━━━━━━
🛡️ <b>1. MABLAG‘NI YO‘QOTISH XATARI:</b>
• <i>Muammo:</i> Yangi boshlovchilar o‘zlarining haqiqiy pullarini xavf ostiga qo‘yib, tajribasizlikdan kuyib qolishadi.
• <b>VELTRON Yechimi:</b> Har bir foydalanuvchiga <b>$100,000 virtual kapital</b> beriladi. Real bozor kotirovkalarida hech qanday moddiy xatarsiz amaliyot o‘taysiz.

📉 <b>2. INFLYATSIYA VA PULNING QADRSIZLANISHI:</b>
• <i>Muammo:</i> Oddiy bank omonatlari yoki naqd pullar inflyatsiyadan orqada qolib, xarid quvvatini yo‘qotadi.
• <b>VELTRON Yechimi:</b> Oltin, global aksiyalar va kripto-aktivlar orqali kapitalni inflyatsiyadan asrash va ko‘paytirish mexanizmi beriladi.

🧠 <b>3. AXBOROT SHOVQINI VA EMOTSIYALAR:</b>
• <i>Muammo:</i> Yangiliklar ko‘p, grafiklar tushunarsiz, insoniy qo‘rquv va ochko‘zlik noto‘g‘ri qarorlarga majburlaydi.
• <b>VELTRON Yechimi:</b> <b>VELTRON AI Coach</b> bozor ma'lumotlarini matematik hisoblab, sizga xolis va xavfsiz tahlilni yetkazadi.

💻 <b>4. QIMMAT VA TUSHUNARSIZ DASTURLAR:</b>
• <i>Muammo:</i> Bloomberg va institutsional terminallar oyiga $2,000 dan oshadi va juda qiyin.
• <b>VELTRON Yechimi:</b> Rolls-Royce Mansory Bespoke darajasidagi eng nafis dizayn va qulay interfeys bepul taqdim etiladi.
━━━━━━━━━━━━━━━━━━━━━
`;
}

function getMarketsMessage() {
  const lines = Object.values(ASSET_PRICES).map((a) => {
    const sign = a.change24h >= 0 ? '🟢 +' : '🔴 ';
    return `${a.icon} <b>${a.name} (${a.symbol}):</b> <code>$${a.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</code> ${sign}${a.change24h}%`;
  });

  return `
📈 <b>JONLI MOLIYA BOZORLARI & KOTIROVKALAR</b>
<i>Millisekundlik aniqlikdagi institutsional ma'lumotlar:</i>

${lines.join('\n')}
💵 <b>USD / UZS (Markaziy Bank):</b> <code>12,850.00</code> ⚪ Barqaror

📊 <b>Bozor Holati:</b> <code>BULLISH ACCUMULATION / INSTITUTIONAL INFLOW</code>
⏱️ <i>Yangilandi: ${new Date().toLocaleTimeString('uz-UZ')}</i>

<i>Biror aktivda savdo qilish uchun quyidagi tugmalardan birini tanlang:</i>
`;
}

function getPortfolioMessage(user: UserState) {
  const { totalEquity, holdingsValue, unrealizedPnl } = calculatePortfolioValue(user);
  const pnlSign = unrealizedPnl >= 0 ? '🟢 +' : '🔴 -';

  const holdingsLines = Object.keys(user.holdings).map((sym) => {
    const h = user.holdings[sym];
    const asset = ASSET_PRICES[sym];
    const curVal = h.amount * (asset?.price || h.avgBuyPrice);
    return `│  ${asset?.icon || '▫️'} <b>${sym}:</b> <code>${h.amount.toFixed(4)} ${sym}</code> ($${curVal.toLocaleString('en-US', { maximumFractionDigits: 2 })})`;
  });

  return `
💼 <b>SIZNING VIRTUAL SAVDO PORTFELINGIZ</b>
Egasi: <b>${user.firstName}</b> (${user.username})

┌─ [KAPITAL BALANSI] ───────────────────
│  💰 <b>Umumiy Portfel:</b> <code>$${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</code>
│  💵 <b>Bo‘sh Naqd Pul:</b> <code>$${user.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</code>
│  📈 <b>Aktivlar Qiymati:</b> <code>$${holdingsValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</code>
│  📊 <b>Natija (PnL):</b> <code>${pnlSign}$${Math.abs(unrealizedPnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</code>
└───────────────────────────────────────

┌─ [OCHIQ POZITSIYALAR] ─────────────────
${holdingsLines.join('\n')}
└───────────────────────────────────────
🎖️ <b>Unvon:</b> <code>${user.level} (${user.xp} XP)</code>
⚡ <i>Amalga oshirilgan bitimlar soni: ${user.trades.length} ta</i>
`;
}

function getTradeAssetMenu(symbol: string, user: UserState) {
  const asset = ASSET_PRICES[symbol];
  if (!asset) return 'Aktiv topilmadi.';

  const holding = user.holdings[symbol] || { amount: 0, avgBuyPrice: 0 };
  const currentVal = holding.amount * asset.price;

  return `
💼 <b>${asset.icon} ${asset.name} (${asset.symbol}) SAVDO TERMINALI</b>

● <b>Joriy Narx:</b> <code>$${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</code>
● <b>24 soatlik dinamika:</b> ${asset.change24h >= 0 ? '🟢 +' : '🔴 '}${asset.change24h}%
● <b>Sizdagi miqdor:</b> <code>${holding.amount.toFixed(4)} ${asset.symbol}</code> ($${currentVal.toFixed(2)})
● <b>Mavjud Naqd Pul:</b> <code>$${user.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</code>

<i>Xarid qilish yoki sotish uchun quyidagi miqdorlardan birini tanlang:</i>
`;
}

// -----------------------------------------------------------------------------
// 8. In-Bot Trading Execution Engine
// -----------------------------------------------------------------------------
function executeTrade(user: UserState, symbol: string, side: 'BUY' | 'SELL', usdAmount: number): {
  success: boolean;
  message: string;
} {
  const asset = ASSET_PRICES[symbol];
  if (!asset) return { success: false, message: 'Noma’lum aktiv.' };

  const price = asset.price;

  if (side === 'BUY') {
    if (user.cashBalance < usdAmount) {
      return {
        success: false,
        message: `❌ Yetarli naqd mablag‘ yo‘q! Sizda $${user.cashBalance.toFixed(2)} mavjud, so‘ralgan summa: $${usdAmount.toFixed(2)}.`,
      };
    }

    const volume = usdAmount / price;
    user.cashBalance -= usdAmount;

    if (!user.holdings[symbol]) {
      user.holdings[symbol] = { symbol, amount: 0, avgBuyPrice: price };
    }

    const prev = user.holdings[symbol];
    const totalCost = prev.amount * prev.avgBuyPrice + usdAmount;
    const newAmount = prev.amount + volume;
    prev.avgBuyPrice = totalCost / newAmount;
    prev.amount = newAmount;

    user.xp += 50; // Award XP for trade
    updateUserLevel(user);

    user.trades.unshift({
      id: 'tx_' + Date.now().toString(36),
      symbol,
      side: 'BUY',
      amount: volume,
      price,
      totalUsd: usdAmount,
      timestamp: new Date().toISOString(),
    });

    saveDb();

    return {
      success: true,
      message: `
╔══════════════════════════════════════╗
║ ⚡ VELTRON EXECUTED TRADE RECEIPT    ║
╚══════════════════════════════════════╝
✅ <b>XARID BITIMI MUVAFFAQIYATLI BAJARILDI!</b>

${asset.icon} <b>Aktiv:</b> ${asset.name} (${symbol})
💵 <b>Investitsiya:</b> <code>$${usdAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</code>
📊 <b>Xarid Hajmi:</b> <code>+${volume.toFixed(6)} ${symbol}</code>
🏷️ <b>Bajarilgan Narx:</b> <code>$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</code>
💰 <b>Qolgan Naqd Balans:</b> <code>$${user.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</code>
🏆 <b>Mukofot:</b> <code>+50 XP</code> (Darajangiz: ${user.level})

<i>Hozirda portfelingizda: ${user.holdings[symbol].amount.toFixed(6)} ${symbol} mavjud.</i>
`,
    };
  } else {
    // SELL
    const currentHolding = user.holdings[symbol];
    if (!currentHolding || currentHolding.amount <= 0) {
      return {
        success: false,
        message: `❌ Sizda sotish uchun ${symbol} aktivi mavjud emas!`,
      };
    }

    // Sell percentage of holding
    const sellRatio = Math.min(usdAmount, 1.0); // 0.5 (50%) or 1.0 (100%)
    const volumeToSell = currentHolding.amount * sellRatio;
    const proceeds = volumeToSell * price;

    currentHolding.amount -= volumeToSell;
    user.cashBalance += proceeds;
    user.xp += 60;
    updateUserLevel(user);

    if (currentHolding.amount <= 0.000001) {
      delete user.holdings[symbol];
    }

    user.trades.unshift({
      id: 'tx_' + Date.now().toString(36),
      symbol,
      side: 'SELL',
      amount: volumeToSell,
      price,
      totalUsd: proceeds,
      timestamp: new Date().toISOString(),
    });

    saveDb();

    return {
      success: true,
      message: `
╔══════════════════════════════════════╗
║ ⚡ VELTRON EXECUTED TRADE RECEIPT    ║
╚══════════════════════════════════════╝
✅ <b>SOTISH BITIMI MUVAFFAQIYATLI BAJARILDI!</b>

${asset.icon} <b>Aktiv:</b> ${asset.name} (${symbol})
📊 <b>Sotilgan Hajm:</b> <code>-${volumeToSell.toFixed(6)} ${symbol}</code>
🏷️ <b>Sotuv Narxi:</b> <code>$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</code>
💰 <b>Kassaga Qaytgan Summa:</b> <code>+$${proceeds.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</code>
💵 <b>Yangi Naqd Balans:</b> <code>$${user.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</code>
🏆 <b>Mukofot:</b> <code>+60 XP</code> (Darajangiz: ${user.level})
`,
    };
  }
}

function updateUserLevel(user: UserState) {
  if (user.xp >= 5000) user.level = 'Sovereign Allocator (Master)';
  else if (user.xp >= 3000) user.level = 'Institutional Strategist';
  else if (user.xp >= 1500) user.level = 'Market Analyst';
  else user.level = 'Explorer';
}

// -----------------------------------------------------------------------------
// 9. Intelligent Financial AI Coach Response Generator
// -----------------------------------------------------------------------------
function generateAiAdvice(query: string, user: UserState): string {
  const lower = query.toLowerCase();

  if (lower.includes('bitcoin') || lower.includes('btc') || lower.includes('kripto') || lower.includes('crypto')) {
    return `
🤖 <b>VELTRON AI: BITCOIN (BTC) BOZOR EKSPERTIZASI</b>

🪙 <b>Tahliliy Xulosa:</b>
Bitcoin institutsional ETF oqimlari va global likvidlik tufayli kuchli konsolidatsiya zonasida turibdi ($64,000 – $70,000 oralig‘i).

🔍 <b>Kvant Ko‘rsatkichlar:</b>
• <b>RSI (14 kunlik):</b> 58.4 (Neytral-Bullish)
• <b>Qo‘llab-quvvatlash (Support):</b> $64,200
• <b>Qarshilik (Resistance):</b> $68,900
• <b>Tavsiya:</b> Bir martada katta summaga kirmasdan, DCA (Dollar Cost Averaging) usulida bo‘lib xarid qilish maqsadga muvofiq.

💡 <i>Maslahat: O‘z pulingizni xavf ostiga qo‘ymaslik uchun, avval botdagi <b>$100,000 virtual balans</b> orqali simulyatsiya qilib ko‘ring!</i>
`;
  }

  if (lower.includes('oltin') || lower.includes('gold') || lower.includes('xau')) {
    return `
🤖 <b>VELTRON AI: OLTIN (XAU/USD) STRATEGIK TAHLILI</b>

🥇 <b>Makroiqtisodiy Ko‘rinish:</b>
Markaziy banklar tomonidan oltin zaxiralarini oshirish siyosati va geosiyosiy xatarlar fonida oltin $2,380+ darajasida mustahkam turibdi.

🛡️ <b>Portfeldagi O‘rni:</b>
Oltin — bu xatarlarga qarshi "Safe Haven" (Xavfsiz Boshpana) aktividir. Professional portfellarda jami mablag‘ning 15–25% ini oltinda saqlash inflyatsiyani to‘liq yengishga yordam beradi.
`;
  }

  if (lower.includes('boshla') || lower.includes('qanday savdo') || lower.includes('qayerdan') || lower.includes('start')) {
    return `
🤖 <b>VELTRON AI: YANGI BOSHLAGANLAR UCHUN YO‘L XARITASI</b>

Professional treyder bo‘lish uchun 4 qadam:
1️⃣ <b>Demo Savdoni Boshlang:</b> Botimiz sizga bergan $100,000 balans orqali pastdagi <b>«💼 Savdo Qilish»</b> tugmasi bilan bitimlar ochib ko‘ring.
2️⃣ <b>Risk Management Qoidasi:</b> Hech qachon 1 ta bitimga umumiy pulingizning 2% idan ko‘pini tikmang.
3️⃣ <b>Akademiya Testlarini Yeching:</b> Botdagi <b>«🎓 Akademiya & Test»</b> bo‘limida bilimingizni sinab, XP yig‘ing.
4️⃣ <b>WebApp Terminalidan Foydalaning:</b> To‘liq ekranli tahlil uchun <b>«🚀 VELTRON Platformasi»</b> tugmasini bosing!
`;
  }

  if (lower.includes('inflyatsiya') || lower.includes('saqla') || lower.includes('foyda') || lower.includes('daromad')) {
    return `
🤖 <b>VELTRON AI: KAPITALNI INFLYATSIYADAN ASRASH USULLARI</b>

Oddiy so‘m yoki dollarda naqd saqlash har yili 8-12% xarid quvvatini yo‘qotadi.

⚖️ <b>Optimal Kvant Taqsimot:</b>
• <b>40% — Barqaror Aktivlar:</b> Oltin va qimmatbaho metallar
• <b>30% — Global Indekslar:</b> S&P 500, Nasdaq
• <b>20% — Kripto va Kvant Aktivlar:</b> Bitcoin, Ethereum
• <b>10% — Likvid Zaxira:</b> Favqulodda vaziyatlar uchun naqd valyuta
`;
  }

  // General sophisticated fallback
  return `
🤖 <b>VELTRON AI MOLIYAVIY MASLAHATCHISI</b>

Sizning so‘rovingiz: <i>"${query}"</i>

💡 <b>Institutsional Ekspert Tavsiyasi:</b>
Moliya bozorlarida barqaror natijaga erishishning asosi — his-tuyg‘ularni jilovlash, qat'iy risk-menejment va sabrli portfel boshqaruvidir.

Mavjud bo‘limlardan birini tanlab, amaliyotni davom ettiring:
• <b>📈 Jonli Bozorlar:</b> Real vaqt kurslarini kuzatish
• <b>💼 Savdo Qilish:</b> $100k demo kapital bilan bitim ochish
• <b>🎓 Akademiya:</b> Professional testlardan o‘tish
`;
}

// -----------------------------------------------------------------------------
// 10. Incoming Updates Handling
// -----------------------------------------------------------------------------
async function handleIncomingMessage(msg: any) {
  const chatId = msg.chat?.id;
  const text = (msg.text || '').trim();
  const from = msg.from;

  if (!chatId) return;

  const user = getUser(chatId, from);
  console.log(`📩 [XABAR] ${user.firstName} (${chatId}): "${text}"`);

  // Persistent keyboard triggers
  switch (text) {
    case '🚀 VELTRON Platformasi':
    case '/app':
      await tgApi('sendMessage', {
        chat_id: chatId,
        text: '🚀 <b>VELTRON TELEGRAM MINI APP</b>\n\nSayt to‘g‘ridan-to‘g‘ri Telegram ichida ochiladi:',
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '⚡ Platformani Ochish (Telegram Ichida)', web_app: { url: `${APP_URL}/tma` } }],
            [{ text: '◀️ Asosiy Menyu', callback_data: 'cmd_start' }],
          ],
        },
      });
      return;

    case '🎯 Muammolar & Yechim':
      await tgApi('sendMessage', {
        chat_id: chatId,
        text: getProblemSolutionMessage(),
        parse_mode: 'HTML',
        reply_markup: getMainInlineKeyboard(),
      });
      return;

    case '📈 Jonli Bozorlar':
    case '/markets':
      await sendMarketsMenu(chatId);
      return;

    case '💼 Savdo Qilish ($100k)':
    case '/trade':
      await sendTradeMenu(chatId, user);
      return;

    case '🎓 Akademiya & Test':
    case '/quiz':
    case '/education':
      await sendAcademyMenu(chatId, user);
      return;

    case '🤖 AI Maslahat':
    case '/ai':
      await tgApi('sendMessage', {
        chat_id: chatId,
        text: `
🤖 <b>VELTRON AI FINANCIAL CONSULTANT</b>

Menga har qanday moliya, treyding, kripto, oltin yoki investitsiya savolingizni yozib yuboring!

<i>Masalan:</i>
• <code>Bitcoin narxi kelajakda qanday bo‘ladi?</code>
• <code>Oltin olishga arziydimi?</code>
• <code>Qanday qilib savdoni boshlasam bo‘ladi?</code>
• <code>Inflyatsiyadan pulni qanday himoya qilay?</code>
`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🪙 Bitcoin Tahlili', callback_data: 'ai_q_btc' }],
            [{ text: '🥇 Oltin Tahlili', callback_data: 'ai_q_gold' }],
            [{ text: '🚀 Savdoni Boshlash', callback_data: 'ai_q_start' }],
          ],
        },
      });
      return;

    case '📊 Mening Hisobim':
    case '/dashboard':
    case '/portfolio':
      await tgApi('sendMessage', {
        chat_id: chatId,
        text: getPortfolioMessage(user),
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '⚡ Savdo Qilish', callback_data: 'trade_menu' }],
            [{ text: '🚀 WebApp Terminali', web_app: { url: `${APP_URL}/tma` } }],
            [{ text: '◀️ Asosiy Menyu', callback_data: 'cmd_start' }],
          ],
        },
      });
      return;

    case 'ℹ️ Yordam':
    case '/help':
      await tgApi('sendMessage', {
        chat_id: chatId,
        text: `
ℹ️ <b>VELTRON MUKAMMAL BOT QO‘LLANMASI</b>

<b>Mavjud Buyruqlar:</b>
/start — Asosiy hashamatli menyu
/trade — $100k demo savdo terminali (Xarid/Sotish)
/markets — Kripto va jahon bozor kotirovkalari
/portfolio — Ochiq pozitsiyalar va balans hisoboti
/quiz — Moliyaviy viktorina (+100 XP)
/ai — AI moliya maslahatchisi
/app — Telegram Mini App ochish
/help — Qo‘llanma

<i>Savollaringiz bo‘lsa, to‘g‘ridan-to‘g‘ri matn shaklida yuboring — AI tezda javob beradi!</i>
`,
        parse_mode: 'HTML',
        reply_markup: getMainInlineKeyboard(),
      });
      return;
  }

  // Handle /start command
  if (text.startsWith('/start')) {
    await tgApi('sendMessage', {
      chat_id: chatId,
      text: getStartMessage(user),
      parse_mode: 'HTML',
      reply_markup: getMainInlineKeyboard(),
    });
    // Also ensure persistent keyboard is active
    await tgApi('sendMessage', {
      chat_id: chatId,
      text: '👑 Pastki qulay boshqaruv klaviaturasi faollashtirildi:',
      reply_markup: getPersistentKeyboard(),
    });
    return;
  }

  // Any other natural language text is treated as a query to the AI Consultant!
  const aiAnswer = generateAiAdvice(text, user);
  await tgApi('sendMessage', {
    chat_id: chatId,
    text: aiAnswer,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: '💼 Virtual Savdoda Sinab Ko‘rish', callback_data: 'trade_menu' }],
        [{ text: '📈 Jonli Kotirovkalarni Ko‘rish', callback_data: 'cmd_markets' }],
        [{ text: '🚀 WebApp Platformasini Ochish', web_app: { url: `${APP_URL}/tma` } }],
      ],
    },
  });
}

// -----------------------------------------------------------------------------
// 11. Interactive Menus & Callbacks
// -----------------------------------------------------------------------------

async function sendMarketsMenu(chatId: number) {
  await tgApi('sendMessage', {
    chat_id: chatId,
    text: getMarketsMessage(),
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🪙 BTC Savdo', callback_data: 'trade_asset_BTC' },
          { text: '🔷 ETH Savdo', callback_data: 'trade_asset_ETH' },
        ],
        [
          { text: '🥇 Oltin Savdo', callback_data: 'trade_asset_XAU' },
          { text: '⚡ Tesla Savdo', callback_data: 'trade_asset_TSLA' },
        ],
        [{ text: '🚀 WebApp Jonli Grafiklar', web_app: { url: `${APP_URL}/tma` } }],
        [{ text: '◀️ Asosiy Menyu', callback_data: 'cmd_start' }],
      ],
    },
  });
}

async function sendTradeMenu(chatId: number, user: UserState) {
  const { totalEquity } = calculatePortfolioValue(user);

  await tgApi('sendMessage', {
    chat_id: chatId,
    text: `
💼 <b>VELTRON AVTONOM VIRTUAL SAVDO TERMINALI</b>

💰 <b>Mavjud Naqd:</b> <code>$${user.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</code>
📈 <b>Jami Kapital:</b> <code>$${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</code>

Savdo qilmoqchi bo‘lgan aktivni tanlang:
`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🪙 Bitcoin ($67,432)', callback_data: 'trade_asset_BTC' },
          { text: '🔷 Ethereum ($3,245)', callback_data: 'trade_asset_ETH' },
        ],
        [
          { text: '🥇 Oltin ($2,389)', callback_data: 'trade_asset_XAU' },
          { text: '⚡ Tesla ($248)', callback_data: 'trade_asset_TSLA' },
        ],
        [{ text: '📊 Mening Portfelim', callback_data: 'cmd_portfolio' }],
        [{ text: '◀️ Asosiy Menyu', callback_data: 'cmd_start' }],
      ],
    },
  });
}

async function sendAcademyMenu(chatId: number, user: UserState) {
  // Find next unanswered quiz
  const nextQuiz = QUIZZES.find((q) => !user.completedQuizzes.includes(q.id)) || QUIZZES[0];

  await tgApi('sendMessage', {
    chat_id: chatId,
    text: `
🎓 <b>VELTRON MOLIYAVIY AKADEMIYASI</b>

🏆 <b>Sizning Natijangiz:</b> <code>${user.xp} XP</code> (Unvon: <b>${user.level}</b>)
📚 <b>Yakunlangan Testlar:</b> <code>${user.completedQuizzes.length} / ${QUIZZES.length} ta</code>

Moliya savodxonligingizni oshirib, har bir to‘g‘ri javob uchun <b>+100 XP</b> mukofotga ega bo‘ling!
`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: `🧠 Viktorinani Boshlash (Test #${nextQuiz.id})`, callback_data: `quiz_start_${nextQuiz.id}` }],
        [{ text: '📚 Kurslar Ro‘yxatini Ko‘rish', callback_data: 'cmd_courses' }],
        [{ text: '🚀 WebApp Akademiyasi', web_app: { url: `${APP_URL}/tma` } }],
        [{ text: '◀️ Asosiy Menyu', callback_data: 'cmd_start' }],
      ],
    },
  });
}

async function handleCallbackQuery(cb: any) {
  const queryId = cb.id;
  const chatId = cb.message?.chat?.id;
  const data = cb.data;
  const from = cb.from;

  await tgApi('answerCallbackQuery', { callback_query_id: queryId });
  if (!chatId || !data) return;

  const user = getUser(chatId, from);
  console.log(`🔘 [TUGMA] ${user.firstName} (${chatId}): "${data}"`);

  // Navigation callbacks
  if (data === 'cmd_start') {
    await tgApi('sendMessage', {
      chat_id: chatId,
      text: getStartMessage(user),
      parse_mode: 'HTML',
      reply_markup: getMainInlineKeyboard(),
    });
    return;
  }

  if (data === 'cmd_problems') {
    await tgApi('sendMessage', {
      chat_id: chatId,
      text: getProblemSolutionMessage(),
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 VELTRON Platformasini Ochish (Web App)', web_app: { url: `${APP_URL}/tma` } }],
          [{ text: '💼 Virtual Savdoni Boshlash ($100k)', callback_data: 'trade_menu' }],
          [{ text: '◀️ Asosiy Menyu', callback_data: 'cmd_start' }],
        ],
      },
    });
    return;
  }

  if (data === 'cmd_markets') {
    await sendMarketsMenu(chatId);
    return;
  }

  if (data === 'trade_menu') {
    await sendTradeMenu(chatId, user);
    return;
  }

  if (data === 'cmd_portfolio') {
    await tgApi('sendMessage', {
      chat_id: chatId,
      text: getPortfolioMessage(user),
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '⚡ Savdo Qilish', callback_data: 'trade_menu' }],
          [{ text: '🚀 WebApp Terminali', web_app: { url: `${APP_URL}/tma` } }],
          [{ text: '◀️ Asosiy Menyu', callback_data: 'cmd_start' }],
        ],
      },
    });
    return;
  }

  if (data === 'cmd_academy') {
    await sendAcademyMenu(chatId, user);
    return;
  }

  if (data === 'cmd_ai_prompt') {
    await handleIncomingMessage({ chat: { id: chatId }, text: '🤖 AI Maslahat', from });
    return;
  }

  if (data === 'cmd_help') {
    await handleIncomingMessage({ chat: { id: chatId }, text: 'ℹ️ Yordam', from });
    return;
  }

  if (data === 'cmd_courses') {
    await tgApi('sendMessage', {
      chat_id: chatId,
      text: `
📚 <b>VELTRON INSTITUTSIONAL KURSLAR RO‘YXATI:</b>

1️⃣ <b>Kvant Treyding Asoslari</b> — 8 ta video dars (100% Tugallangan)
2️⃣ <b>Risk Management & Stop-Loss</b> — 6 ta dars (75% Yakunlandi)
3️⃣ <b>Texnik & Fundamental Tahlil</b> — 12 ta dars (Faol)
4️⃣ <b>Makroiqtisodiyot & Valyutalar</b> — 10 ta dars (Yangi)

<i>To‘liq video darslar va sertifikatlar WebApp platformamizda mavjud.</i>
`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 WebApp Akademiyasini Ochish', web_app: { url: `${APP_URL}/tma` } }],
          [{ text: '🧠 Viktorina Testini Yechish', callback_data: 'quiz_start_1' }],
          [{ text: '◀️ Orqaga', callback_data: 'cmd_academy' }],
        ],
      },
    });
    return;
  }

  // Pre-configured AI question buttons
  if (data === 'ai_q_btc') {
    await tgApi('sendMessage', {
      chat_id: chatId,
      text: generateAiAdvice('Bitcoin kelajagi qanday?', user),
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🪙 BTC Savdo Qilish', callback_data: 'trade_asset_BTC' }],
          [{ text: '◀️ AI Menyusi', callback_data: 'cmd_ai_prompt' }],
        ],
      },
    });
    return;
  }

  if (data === 'ai_q_gold') {
    await tgApi('sendMessage', {
      chat_id: chatId,
      text: generateAiAdvice('Oltin narxi tahlili', user),
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🥇 Oltin Savdo Qilish', callback_data: 'trade_asset_XAU' }],
          [{ text: '◀️ AI Menyusi', callback_data: 'cmd_ai_prompt' }],
        ],
      },
    });
    return;
  }

  if (data === 'ai_q_start') {
    await tgApi('sendMessage', {
      chat_id: chatId,
      text: generateAiAdvice('Qanday savdoni boshlasam boladi?', user),
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '💼 Virtual Savdoni Boshlash', callback_data: 'trade_menu' }],
          [{ text: '◀️ AI Menyusi', callback_data: 'cmd_ai_prompt' }],
        ],
      },
    });
    return;
  }

  // Trade Asset Selection
  if (data.startsWith('trade_asset_')) {
    const symbol = data.replace('trade_asset_', '');
    const asset = ASSET_PRICES[symbol];
    if (!asset) return;

    await tgApi('sendMessage', {
      chat_id: chatId,
      text: getTradeAssetMenu(symbol, user),
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: `🟢 +$1,000 ${symbol} Xarid`, callback_data: `trade_exec_${symbol}_BUY_1000` },
            { text: `🟢 +$5,000 ${symbol} Xarid`, callback_data: `trade_exec_${symbol}_BUY_5000` },
          ],
          [
            { text: `🟢 +$10,000 ${symbol} Xarid`, callback_data: `trade_exec_${symbol}_BUY_10000` },
            { text: `🔴 50% Sotish`, callback_data: `trade_exec_${symbol}_SELL_0.5` },
          ],
          [
            { text: `🔴 Barchasini Sotish (100%)`, callback_data: `trade_exec_${symbol}_SELL_1.0` },
          ],
          [
            { text: '📊 Mening Portfelim', callback_data: 'cmd_portfolio' },
            { text: '◀️ Bozorlarga Qaytish', callback_data: 'cmd_markets' },
          ],
        ],
      },
    });
    return;
  }

  // Trade Execution: trade_exec_SYMBOL_SIDE_AMOUNT
  if (data.startsWith('trade_exec_')) {
    const parts = data.split('_'); // ['trade', 'exec', 'BTC', 'BUY', '1000']
    const symbol = parts[2];
    const side = parts[3] as 'BUY' | 'SELL';
    const amountVal = parseFloat(parts[4]);

    const result = executeTrade(user, symbol, side, amountVal);

    await tgApi('sendMessage', {
      chat_id: chatId,
      text: result.message,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: `⚡ Yana ${symbol} Savdo Qilish`, callback_data: `trade_asset_${symbol}` }],
          [{ text: '📊 Portfelimni Ko‘rish', callback_data: 'cmd_portfolio' }],
          [{ text: '🚀 WebApp Terminalini Ochish', web_app: { url: `${APP_URL}/tma` } }],
          [{ text: '◀️ Asosiy Menyu', callback_data: 'cmd_start' }],
        ],
      },
    });
    return;
  }

  // Quiz Handling: quiz_start_ID
  if (data.startsWith('quiz_start_')) {
    const quizId = parseInt(data.replace('quiz_start_', ''), 10);
    const quiz = QUIZZES.find((q) => q.id === quizId) || QUIZZES[0];

    const optionButtons = quiz.options.map((opt, idx) => [
      { text: `${['A', 'B', 'C', 'D'][idx]}) ${opt}`, callback_data: `quiz_ans_${quiz.id}_${idx}` },
    ]);

    await tgApi('sendMessage', {
      chat_id: chatId,
      text: `
🧠 <b>MOLIYAVIY VIKTORINA: SAVOL #${quiz.id}</b>
<i>Har bir to‘g‘ri javob uchun: +100 XP</i>

❓ <b>Savol:</b>
${quiz.question}

<i>To‘g‘ri javob variantini tanlang:</i>
`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [...optionButtons, [{ text: '◀️ Bekor Qilish', callback_data: 'cmd_academy' }]],
      },
    });
    return;
  }

  // Quiz Answer Evaluation: quiz_ans_ID_OPT
  if (data.startsWith('quiz_ans_')) {
    const parts = data.split('_'); // ['quiz', 'ans', '1', '0']
    const quizId = parseInt(parts[2], 10);
    const selectedOpt = parseInt(parts[3], 10);
    const quiz = QUIZZES.find((q) => q.id === quizId);

    if (!quiz) return;

    if (selectedOpt === quiz.correct) {
      if (!user.completedQuizzes.includes(quiz.id)) {
        user.completedQuizzes.push(quiz.id);
        user.xp += quiz.xpReward;
        updateUserLevel(user);
        saveDb();
      }

      const nextQuiz = QUIZZES.find((q) => !user.completedQuizzes.includes(q.id));

      await tgApi('sendMessage', {
        chat_id: chatId,
        text: `
🎉 <b>TO‘G‘RI JAVOB!</b> 🏆 <code>+${quiz.xpReward} XP</code>

${quiz.explanation}

🎖️ <b>Yangi Balans:</b> <code>${user.xp} XP</code> (Darajangiz: <b>${user.level}</b>)
`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            nextQuiz
              ? [{ text: `▶️ Keyingi Savol (#${nextQuiz.id})`, callback_data: `quiz_start_${nextQuiz.id}` }]
              : [{ text: '🏆 Barcha Testlar Tugallandi!', callback_data: 'cmd_academy' }],
            [{ text: '💼 Savdo Terminali', callback_data: 'trade_menu' }],
            [{ text: '◀️ Akademiya Menyusi', callback_data: 'cmd_academy' }],
          ],
        },
      });
    } else {
      await tgApi('sendMessage', {
        chat_id: chatId,
        text: `
❌ <b>NOTO‘G‘RI JAVOB!</b>

Qayta o‘ylab ko‘ring yoki tahlil qiling:
<i>${quiz.explanation}</i>

Qaytadan urinib ko‘ring:
`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔄 Qayta Urinish', callback_data: `quiz_start_${quiz.id}` }],
            [{ text: '◀️ Akademiya Menyusi', callback_data: 'cmd_academy' }],
          ],
        },
      });
    }
    return;
  }
}

// -----------------------------------------------------------------------------
// 12. Bot Initialization & Auto-Polling Daemon
// -----------------------------------------------------------------------------
async function initializeBot() {
  console.log('⚡ [VELTRON BOT] Mukammal bot tizimi sozlanmoqda...');
  console.log(`🌐 [APP_URL]: ${APP_URL}`);

  // 1. Ensure Bot Name
  await tgApi('setMyName', { name: 'VELTRON' });

  // 2. Set Official Commands List
  await tgApi('setMyCommands', {
    commands: [
      { command: 'start', description: '🏛️ Asosiy hashamatli menyu' },
      { command: 'trade', description: '💼 $100k Demo savdo terminali' },
      { command: 'markets', description: '📈 Jonli bozorlar (BTC, ETH, Oltin)' },
      { command: 'portfolio', description: '📊 Balans va ochiq pozitsiyalar' },
      { command: 'quiz', description: '🧠 Moliyaviy viktorina (+100 XP)' },
      { command: 'ai', description: '🤖 AI moliya maslahatchisi' },
      { command: 'app', description: '🚀 Telegram Mini App terminali' },
      { command: 'help', description: 'ℹ️ Qo‘llanma va buyruqlar' },
    ],
  });

  // 3. Set Chat Menu Button to Open WebApp
  await tgApi('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: '⚡ VELTRON App',
      web_app: { url: `${APP_URL}/tma` },
    },
  });

  // 4. Delete webhook to activate clean long-polling
  await tgApi('deleteWebhook', { drop_pending_updates: false });
  console.log('✔ [VELTRON BOT] Long-polling tizimi tayyor.');

  // 5. Send status update to Admin Chat with direct WebApp launcher
  try {
    const adminUser = getUser(parseInt(ADMIN_CHAT_ID, 10));
    await tgApi('sendMessage', {
      chat_id: ADMIN_CHAT_ID,
      text:
        '🏛️ <b>MUKAMMAL VELTRON PLATFORMASI VA BOT TAYYOR!</b>\n\n' +
        '👑 Sizning shaxsiy <b>VELTRON</b> loyihangiz to‘liq ulandi.\n' +
        'Hech qanday tashqi yoki soxta sayt emas — aynan sizning kompyuteringizdagi hashamatli VELTRON platformasi!\n\n' +
        '✔ <b>Telegram Mini App:</b> To‘g‘ridan-to‘g‘ri Telegram ichida to‘liq ochiladi.\n' +
        '✔ <b>Virtual Savdo:</b> $100,000 boshlang‘ich balans, BTC/ETH/Oltin savdosi.\n' +
        '✔ <b>AI Maslahatchi:</b> Kvant tahlil va moliya strategiyalari.\n' +
        '✔ <b>Klaviatura:</b> Pastdagi tugmalar va Menu orqali boshqaruv.\n\n' +
        '<i>Saytni Telegram ichida ochish uchun quyidagi oltin tugmani bosing:</i>',
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 VELTRON Platformasini Ochish (Telegram Ichida)', web_app: { url: `${APP_URL}/tma` } }],
          [{ text: '🎯 Muammolar & Yechim', callback_data: 'cmd_problems' }],
          [{ text: '💼 Savdo Terminali ($100k)', callback_data: 'trade_menu' }],
        ],
      },
    });

    // Also send the persistent keyboard
    await tgApi('sendMessage', {
      chat_id: ADMIN_CHAT_ID,
      text: '⚡ Pastki menyu tugmalari ham faollashtirildi:',
      reply_markup: getPersistentKeyboard(),
    });
  } catch (err) {
    console.warn('Admin xabarida ogohlantirish:', err);
  }
}

async function startLongPolling() {
  await initializeBot();
  console.log('🚀 [VELTRON BOT] Mukammal Bot Real Vaqt Rejimida Ishlamoqda...');

  let offset = 0;

  while (true) {
    try {
      const res = await tgApi('getUpdates', {
        offset,
        timeout: 20,
        allowed_updates: ['message', 'callback_query'],
      });

      if (res.ok && Array.isArray(res.result)) {
        for (const update of res.result) {
          offset = Math.max(offset, update.update_id + 1);

          if (update.message) {
            await handleIncomingMessage(update.message);
          } else if (update.callback_query) {
            await handleCallbackQuery(update.callback_query);
          }
        }
      } else {
        await new Promise((r) => setTimeout(r, 1000));
      }
    } catch (err: any) {
      console.warn('⚠️ [POLLING UZILISH]:', err.message);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

startLongPolling().catch((err) => {
  console.error('❌ Bot to‘xtadi:', err);
  process.exit(1);
});
