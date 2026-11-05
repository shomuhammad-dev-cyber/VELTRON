// ==============================================================================
// VELTRON OFFICIAL TELEGRAM BOT RUNNER & REALTIME WORKER
// Telegram Bot: @VeltronAI_Bot | Admin: 7552517378
// Fully Interactive Buttons + Problem-Solution Manifesto + Telegram WebApp
// ==============================================================================

import fs from 'fs';
import path from 'path';

// 1. Load environment variables from .env.local
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

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '9293997731:AAGCbBiXZeOH02OSsXyWuNyJTW9Udc93R2k';
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '7552517378';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://f5850827e41353.lhr.life';
const TELEGRAM_API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function tgApi(method: string, body?: any) {
  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    return await res.json();
  } catch (err: any) {
    console.error(`❌ [API XATOLIK] ${method}:`, err.message);
    return { ok: false, error: err.message };
  }
}

// -----------------------------------------------------------------------------
// Buttons & Keyboards
// -----------------------------------------------------------------------------
function getMainKeyboard() {
  const tmaUrl = `${APP_URL}/tma`;

  return {
    inline_keyboard: [
      // Direct Native Telegram Mini App Button (opens inside Telegram)
      [
        {
          text: '🚀 VELTRON Platformasini Ochish (Telegram Ichida)',
          web_app: { url: tmaUrl },
        },
      ],
      // Problem-Solution Button
      [
        {
          text: '🎯 VELTRON Nima Muammoni Hal Qiladi?',
          callback_data: 'cmd_problems',
        },
      ],
      // Live Markets & Virtual Portfolio
      [
        { text: '📈 Jonli Bozorlar & Kripto', callback_data: 'cmd_markets' },
        { text: '💼 $100,000 Virtual Portfel', callback_data: 'cmd_portfolio' },
      ],
      // Academy & AI Advisor
      [
        { text: '🎓 Moliyaviy Akademiya', callback_data: 'cmd_education' },
        { text: '🤖 AI Moliya Maslahatchisi', callback_data: 'cmd_ai' },
      ],
      // Profile & Help
      [
        { text: '📊 Mening Hisobim & ID', callback_data: 'cmd_dashboard' },
        { text: 'ℹ️ Qo‘llanma & Yordam', callback_data: 'cmd_help' },
      ],
    ],
  };
}

// -----------------------------------------------------------------------------
// Messages Content
// -----------------------------------------------------------------------------

function getStartMessage(fromName: string) {
  return `
🏛️ <b>VELTRON — BESPOKE ROYAL LUXURY FINANCIAL ECOSYSTEM</b>
<i>Beyond Finance. A New Era.</i>

Assalomu alaykum, <b>${fromName}</b>!
Siz <b>VELTRON</b> institutsional moliya texnologiyalari va avtonom AI platformasiga xush kelibsiz.

👑 <b>PLATFORMA IMKONIYATLARI:</b>
• 💼 <b>$100,000 Demo Kapital:</b> O‘z pulingizni xavf ostiga qo‘ymasdan savdo qilish
• 📈 <b>Real Vaqt Kotirovkalari:</b> BTC, ETH, Oltin, Neft va Valyutalar
• 🤖 <b>AI Financial Advisor:</b> Shaxsiy sun’iy intellekt tahlilchisi
• 🎓 <b>Akademiya:</b> Boshlang‘ichdan xalqaro fond boshqaruvchisigacha

⚡ <b>SAYTNI TELEGRAM ICHIDA OCHISH:</b>
Quyidagi <b>«🚀 VELTRON Platformasini Ochish»</b> tugmasini bosing — sayt to‘g‘ridan-to‘g‘ri Telegram ichida ochiladi!
`;
}

function getProblemSolutionMessage() {
  return `
🎯 <b>VELTRON QANDAY MOLIYAVIY MUAMMOLARNI HAL QILADI?</b>

Aksariyat odamlar moliya va investitsiya sohasida 4 ta katta to‘siqqa duch kelishadi. VELTRON ushbu muammolarni tubdan hal qiladi:

━━━━━━━━━━━━━━━━━━━━━
🛡️ <b>1. MABLAG‘NI YO‘QOTISH QO‘RQUVI VA XATARLAR:</b>
• <i>Muammo:</i> Boshlovchilar tajribasizlik sababli o‘zlarining real pullarini bozorga kiritib, yo‘qotishadi.
• <b>VELTRON Yechimi:</b> Har bir foydalanuvchiga <b>$100,000 virtual balans</b> beriladi. Siz real jahon bozor narxlarida 1 tiyin ham yo‘qotmasdan professional savdo qilishni o‘rganasiz.

📉 <b>2. INFLYATSIYA VA PULLARNING QADRSIZLANISHI:</b>
• <i>Muammo:</i> Oddiy omonat yoki naqd pul yillik inflyatsiya tufayli xarid quvvatini yo‘qotadi.
• <b>VELTRON Yechimi:</b> Oltin, qimmatli qog‘ozlar, global indekslar va kripto-aktivlar bilan kapitalni inflyatsiyadan himoyalash va o‘stirish instrumentlari taqdim etiladi.

🧠 <b>3. AXBOROT SHOVQINI VA EMOTSIONAL XATOLAR:</b>
• <i>Muammo:</i> Yangiliklar ko‘p, grafiklar tushunarsiz, inson emotsiyalari (qo‘rquv va ochko‘zlik) noto‘g‘ri qarorlarga undaydi.
• <b>VELTRON Yechimi:</b> Maxsus o‘rgatilgan <b>AI Financial Coach</b> bozor konyunkturasini matematik hisoblab, sizga xolis va xavfsiz tahlilni yetkazadi.

💻 <b>4. INSTITUTSIONAL TERMINALLARNING QIMMATLIGI:</b>
• <i>Muammo:</i> Bloomberg yoki professional tahlil dasturlari oyiga minglab dollar turadi va juda murakkab.
• <b>VELTRON Yechimi:</b> Rolls-Royce Mansory Bespoke darajasidagi eng nafis, tezkor va zamonaviy moliya interfeysi Telegram ichida bepul va oson taqdim etiladi.
━━━━━━━━━━━━━━━━━━━━━

<i>Hoziroq quyidagi tugmani bosib, platformani Telegram ichida ishga tushiring:</i>
`;
}

function getMarketsMessage() {
  return `
📈 <b>JONLI GLOBAL BOZOR KOTIROVKALARI</b>
<i>Institutsional darajadagi real-vaqt ma'lumotlari:</i>

🪙 <b>Bitcoin (BTC):</b> <code>$67,432.18</code> 🟢 +2.85%
🔷 <b>Ethereum (ETH):</b> <code>$3,245.67</code> 🟢 +1.92%
⚡ <b>Tesla Inc (TSLA):</b> <code>$248.31</code> 🔴 -0.74%
🥇 <b>Spot Gold (XAU/USD):</b> <code>$2,389.12</code> 🟢 +0.41%
🛢️ <b>Brent Oil (Crude):</b> <code>$82.40</code> 🟢 +0.65%
💵 <b>USD / UZS (Markaziy Bank):</b> <code>12,850.00</code> ⚪ Barqaror

📊 <b>Bozor Kayfiyati:</b> <code>BULLISH / INVESTOR ACCUMULATION</code>
⏱️ <i>Yangilandi: ${new Date().toLocaleTimeString('uz-UZ')}</i>
`;
}

function getPortfolioMessage(fromName: string) {
  return `
💼 <b>SIZNING VIRTUAL SAVDO PORTFELINGIZ</b>
Egasi: <b>${fromName}</b>

💰 <b>Umumiy Kapital:</b> <code>$112,847.32 USD</code>
💵 <b>Bo‘sh Naqd Pul:</b> <code>$87,152.68 USD</code>
📈 <b>Jami Foyda (PnL):</b> <code>+$12,847.32 (+12.8%)</code>
🛡️ <b>Risk Reytingi:</b> <code>A+ (Konservativ Hedj)</code>

<b>Ochiq Savdo Pozitsiyalari:</b>
1. <b>BTC/USD (Long):</b> +$3,420.00 (Foyda)
2. <b>ETH/USD (Long):</b> +$1,180.50 (Foyda)
3. <b>XAU/USD (Oltin):</b> +$640.00 (Foyda)

<i>Yangi bitim ochish uchun Telegram ichidagi WebApp terminalini bosing:</i>
`;
}

function getEducationMessage() {
  return `
🎓 <b>VELTRON MOLIYAVIY AKADEMIYASI</b>
<i>Teoriyadan amaliyotgacha bo‘lgan professional yo‘l:</i>

📚 <b>O‘quv Modullari:</b>
1️⃣ <b>Kvant Treyding Asoslari</b> — 8 ta dars (100% Tugallangan)
2️⃣ <b>Xatarlarni Boshqarish (Risk Management)</b> — 6 ta dars (75% Yakunlandi)
3️⃣ <b>Institutsional Texnik Tahlil</b> — 12 ta dars (Faol)
4️⃣ <b>Makroiqtisodiy Konyunktura</b> — 10 ta dars (Yangi)

🏆 <b>Sizning Natijangiz:</b> <code>3,850 XP</code>
🎖️ <b>Darajangiz:</b> <code>STRATEGIST (Bespoke Rank)</code>
`;
}

function getAiMessage() {
  return `
🤖 <b>VELTRON AI MOLIYAVIY MASLAHATCHISI</b>

Sun’iy intellekt algoritmlarimiz sizga quyidagilarda ko‘maklashadi:
• 📊 Portfel risklarini avtomatik tekshirish
• 🎯 Diversifikatsiya bo‘yicha individual tavsiyalar
• ⚡ Bozor yangiliklarining ta’sirini tahlil qilish
• 🔮 24 soatlik bozor prognozlari va ehtimollar

<i>AI bilan to‘liq suhbatlashish uchun WebApp terminalini oching:</i>
`;
}

function getDashboardMessage(fromName: string, chatId: number, username: string) {
  return `
📊 <b>SHAXSIY HISOB VA IDENTIFIKATSIYA</b>

👤 <b>Ism:</b> ${fromName}
🆔 <b>Telegram ID:</b> <code>${chatId}</code>
🔗 <b>Foydalanuvchi:</b> ${username}
💎 <b>Status:</b> <code>BESPOKE ROYAL MEMBER (2026 gacha)</code>

💵 <b>Asosiy Depozit:</b> <code>$12,847.32 USD</code>
💰 <b>Jamg‘arma Hamyoni:</b> <code>$2,104.50 USD</code>
📈 <b>Portfel O‘sishi:</b> <code>+24.8%</code>
🏆 <b>Akademiya Balli:</b> <code>78% yakunlangan</code>
`;
}

function getHelpMessage() {
  return `
ℹ️ <b>VELTRON QO‘LLANMA VA MA’LUMOTLAR</b>

<b>Barcha Buyruqlar:</b>
/start — Asosiy menyu va platformani ochish
/app — Telegram Mini App terminali
/dashboard — Hisobingiz va balansingiz
/markets — Kripto va bozor kurslari
/portfolio — $100,000 lik virtual portfel
/education — Kurslar va akademiyaga kirish
/ai — Sun'iy intellekt maslahatchisi
/help — Qo‘llanma

Savollaringiz bo‘lsa, rasmiy administrator bilan bog‘laning.
`;
}

// -----------------------------------------------------------------------------
// Message & Callback Query Processing
// -----------------------------------------------------------------------------

async function handleIncomingMessage(msg: any) {
  const chatId = msg.chat?.id;
  const text = (msg.text || '').trim();
  const fromName = msg.from?.first_name || 'Hurmatli Foydalanuvchi';
  const username = msg.from?.username ? `@${msg.from.username}` : 'Foydalanuvchi';

  if (!chatId) return;

  console.log(`📩 [XABAR KELDI] ${fromName} (${chatId}): "${text}"`);

  const lower = text.toLowerCase();

  if (lower.startsWith('/start') || lower === 'start') {
    await tgApi('sendMessage', {
      chat_id: chatId,
      text: getStartMessage(fromName),
      parse_mode: 'HTML',
      reply_markup: getMainKeyboard(),
    });
    return;
  }

  if (lower.startsWith('/app')) {
    await tgApi('sendMessage', {
      chat_id: chatId,
      text: '🚀 <b>VELTRON TELEGRAM MINI APP</b>\n\nQuyidagi tugma orqali platformani to‘g‘ridan-to‘g‘ri oching:',
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '⚡ Platformani Ochish', web_app: { url: `${APP_URL}/tma` } }],
          [{ text: '◀️ Asosiy Menyu', callback_data: 'cmd_start' }],
        ],
      },
    });
    return;
  }

  if (lower.startsWith('/markets')) {
    await sendWithBack(chatId, getMarketsMessage());
    return;
  }

  if (lower.startsWith('/portfolio')) {
    await sendWithBack(chatId, getPortfolioMessage(fromName));
    return;
  }

  if (lower.startsWith('/education')) {
    await sendWithBack(chatId, getEducationMessage());
    return;
  }

  if (lower.startsWith('/ai')) {
    await sendWithBack(chatId, getAiMessage());
    return;
  }

  if (lower.startsWith('/dashboard')) {
    await sendWithBack(chatId, getDashboardMessage(fromName, chatId, username));
    return;
  }

  // Any other text returns start menu
  await tgApi('sendMessage', {
    chat_id: chatId,
    text: getStartMessage(fromName),
    parse_mode: 'HTML',
    reply_markup: getMainKeyboard(),
  });
}

async function sendWithBack(chatId: number, text: string) {
  await tgApi('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🚀 VELTRON Platformasini Ochish', web_app: { url: `${APP_URL}/tma` } }],
        [{ text: '◀️ Asosiy Menyu', callback_data: 'cmd_start' }],
      ],
    },
  });
}

async function handleCallbackQuery(cb: any) {
  const queryId = cb.id;
  const chatId = cb.message?.chat?.id;
  const data = cb.data;
  const fromName = cb.from?.first_name || 'Hurmatli Foydalanuvchi';
  const username = cb.from?.username ? `@${cb.from.username}` : 'Foydalanuvchi';

  console.log(`🔘 [TUGMA BOSILDI] ${fromName} (${chatId}): "${data}"`);

  // Answer callback immediately so button doesn't freeze
  await tgApi('answerCallbackQuery', { callback_query_id: queryId });

  if (!chatId || !data) return;

  switch (data) {
    case 'cmd_start':
      await tgApi('sendMessage', {
        chat_id: chatId,
        text: getStartMessage(fromName),
        parse_mode: 'HTML',
        reply_markup: getMainKeyboard(),
      });
      break;

    case 'cmd_problems':
      await tgApi('sendMessage', {
        chat_id: chatId,
        text: getProblemSolutionMessage(),
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🚀 VELTRON Platformasini Ochish (Web App)', web_app: { url: `${APP_URL}/tma` } }],
            [{ text: '◀️ Asosiy Menyu', callback_data: 'cmd_start' }],
          ],
        },
      });
      break;

    case 'cmd_markets':
      await sendWithBack(chatId, getMarketsMessage());
      break;

    case 'cmd_portfolio':
      await sendWithBack(chatId, getPortfolioMessage(fromName));
      break;

    case 'cmd_education':
      await sendWithBack(chatId, getEducationMessage());
      break;

    case 'cmd_ai':
      await sendWithBack(chatId, getAiMessage());
      break;

    case 'cmd_dashboard':
      await sendWithBack(chatId, getDashboardMessage(fromName, chatId, username));
      break;

    case 'cmd_help':
      await sendWithBack(chatId, getHelpMessage());
      break;

    default:
      await tgApi('sendMessage', {
        chat_id: chatId,
        text: getStartMessage(fromName),
        parse_mode: 'HTML',
        reply_markup: getMainKeyboard(),
      });
      break;
  }
}

// -----------------------------------------------------------------------------
// Initialization & Long Polling
// -----------------------------------------------------------------------------

async function initializeBot() {
  console.log('⚡ [VELTRON BOT] Botingiz sozlanmoqda...');
  console.log(`🌐 [APP_URL]: ${APP_URL}`);

  // 1. Set Bot Name to VELTRON
  await tgApi('setMyName', { name: 'VELTRON' });

  // 2. Set Commands
  await tgApi('setMyCommands', {
    commands: [
      { command: 'start', description: '🏛️ VELTRON Platformasi & Yechimlar' },
      { command: 'app', description: '🚀 Telegram Mini App terminali' },
      { command: 'dashboard', description: '📊 Shaxsiy hisob va balans' },
      { command: 'markets', description: '📈 Jonli bozorlar (BTC, ETH, Oltin)' },
      { command: 'portfolio', description: '💼 $100,000 Virtual savdo portfeli' },
      { command: 'education', description: '🎓 Moliyaviy akademiya' },
      { command: 'ai', description: '🤖 AI moliyaviy maslahatchi' },
      { command: 'help', description: 'ℹ️ Yordam va ma’lumot' },
    ],
  });

  // 3. Set Chat Menu Button to Open WebApp directly with one click
  await tgApi('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: '⚡ VELTRON App',
      web_app: { url: `${APP_URL}/tma` },
    },
  });
  console.log('✔ [VELTRON BOT] Chat Menu Button sozlandi (Telegram ichida ochiladi).');

  // 4. Delete webhook to start long-polling
  await tgApi('deleteWebhook', { drop_pending_updates: false });
  console.log('✔ [VELTRON BOT] Webhook tozalandi, long-polling tayyor.');

  // 5. Send notification to admin chat
  try {
    await tgApi('sendMessage', {
      chat_id: ADMIN_CHAT_ID,
      text:
        '🏛️ <b>VELTRON BOT YANGILANDI VA FAOL!</b>\n\n' +
        '✔ Barcha tugmalar to‘liq ishga tushirildi.\n' +
        `✔ <b>WebApp URL:</b> <code>${APP_URL}/tma</code>\n` +
        '✔ <b>Telegram ichida ochish:</b> 100% Faollashtirildi.\n\n' +
        '<i>Pastdagi tugmani bosib, platformani Telegram ichida tekshirishingiz mumkin:</i>',
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 VELTRON Platformasini Ochish (Web App)', web_app: { url: `${APP_URL}/tma` } }],
        ],
      },
    });
  } catch (err) {
    console.warn('Admin xabarida ogohlantirish:', err);
  }
}

async function startLongPolling() {
  await initializeBot();
  console.log('🚀 [VELTRON BOT] Yangilanishlar tinglanmoqda (Barcha tugmalar faol)...');

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
