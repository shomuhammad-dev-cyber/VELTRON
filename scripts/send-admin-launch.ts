import https from 'https';
import fs from 'fs';
import path from 'path';

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
const SERVE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://veltron.vercel.app';

const httpsAgent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: false,
});

async function tgApi(method: string, body?: any): Promise<any> {
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res: any = await new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : '';
        const req = https.request(
          `https://api.telegram.org/bot${BOT_TOKEN}/${method}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(payload),
            },
            agent: httpsAgent,
            timeout: 10000,
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
        req.on('timeout', () => {
          req.destroy(new Error('Timeout'));
        });
        req.on('error', (err) => reject(err));
        if (payload) req.write(payload);
        req.end();
      });

      if (res.ok) {
        return res;
      }
      console.warn(`Attempt ${attempt} failed:`, res);
    } catch (err: any) {
      console.warn(`Attempt ${attempt} error:`, err.message);
    }
    await new Promise((r) => setTimeout(r, 1200));
  }
  return { ok: false };
}

async function run() {
  const ts = Date.now();
  const directTmaUrl = `${SERVE_URL}/tma?v=${ts}`;

  console.log('1. Setting specific Chat Menu Button for Admin...');
  const menuRes = await tgApi('setChatMenuButton', {
    chat_id: ADMIN_CHAT_ID,
    menu_button: {
      type: 'web_app',
      text: '🚀 VELTRON Ochish',
      web_app: { url: directTmaUrl },
    },
  });
  console.log('Admin Chat Menu button result:', menuRes);

  console.log('2. Setting Global Menu Button...');
  await tgApi('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: '🚀 VELTRON Ochish',
      web_app: { url: directTmaUrl },
    },
  });

  console.log('3. Sending urgent updated launch message to user...');
  const msgRes = await tgApi('sendMessage', {
    chat_id: ADMIN_CHAT_ID,
    text:
      '👑 <b>HURMATLI EGASI, «NO TUNNEL» XATOSI TO‘LIQ HAL QILINDI!</b>\n\n' +
      '⚠️ <i>DIQQAT: Eskidan qolgan xabarlardagi tugmalarni bosmang (ularda eski eskirgan tunnel saqlanib qolgan).</i>\n\n' +
      '✅ <b>Aynan mana shu yangi xabardagi tugmani bosing:</b>\n' +
      'Bu to‘g‘ridan-to‘g‘ri sizning kompyuteringizdagi <b>VELTRON (Bespoke Royal Luxury)</b> loyihangizni yangi keshsiz oqimda Telegram ichida ochadi!\n\n' +
      '👇 <b>Quyidagi Oltin Tugmani Bosing:</b>',
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '⚡ 🚀 VELTRON SAYTINI TELEGRAMDA OCHISH 🚀 ⚡',
            web_app: { url: directTmaUrl },
          },
        ],
        [
          {
            text: '🌐 Brauzerda To‘liq Ekran Ochish',
            url: `${SERVE_URL}/tma`,
          },
        ],
        [
          { text: '🎯 VELTRON Nima Muammoni Hal Qiladi?', callback_data: 'cmd_problems' },
        ],
        [
          { text: '💼 $100,000 Savdo Terminali', callback_data: 'trade_menu' },
          { text: '📈 Jonli Bozorlar', callback_data: 'cmd_markets' },
        ],
      ],
    },
  });
  console.log('Launch message result:', msgRes);
}

run();
