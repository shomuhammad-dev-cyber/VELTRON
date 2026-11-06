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
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '7552517378';

const agent = new https.Agent({ keepAlive: true });

const text = `🏛️ <b>VELTRON MUKAMMAL FINTECH BOTI ISHGA TUSHDI!</b>
<i>Beyond Finance. A New Era.</i>

Assalomu alaykum!
Botingiz chuqur tahlil asosida tubdan takomillashtirildi va mukammal darajaga yetkazildi.

👑 <b>YANGI AVTONOM IMKONIYATLAR:</b>
• 💼 <b>Bot Ichida Haqiqiy Savdo:</b> Bitcoin, Ethereum, Oltin xarid qilish va sotish (Xarid cheki bilan!)
• 🤖 <b>AI Financial Coach:</b> Botga istalgan moliya savolingizni yozing — sun’iy intellekt darhol tahliliy maslahat beradi.
• 🧠 <b>Moliyaviy Akademiya Testi:</b> 100 XP lik interaktiv viktorinalar va unvonlar (Explorer ➔ Master).
• ⌨️ <b>Doimiy Pastki Menyu:</b> Ekranning pastida doimiy qulay navigatsiya tugmalari.

<i>Pastdagi tugmalar orqali bot imkoniyatlarini sinab ko‘ring:</i>`;

const payload = JSON.stringify({
  chat_id: ADMIN_CHAT_ID,
  text: text,
  parse_mode: 'HTML',
  reply_markup: {
    keyboard: [
      [{ text: '🚀 VELTRON Platformasi' }, { text: '🎯 Muammolar & Yechim' }],
      [{ text: '📈 Jonli Bozorlar' }, { text: '💼 Savdo Qilish ($100k)' }],
      [{ text: '🎓 Akademiya & Test' }, { text: '🤖 AI Maslahat' }],
      [{ text: '📊 Mening Hisobim' }, { text: 'ℹ️ Yordam' }],
    ],
    resize_keyboard: true,
    is_persistent: true,
  },
});

const req = https.request(
  `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
    agent: agent,
  },
  (res) => {
    let raw = '';
    res.on('data', (c) => (raw += c));
    res.on('end', () => console.log('Message delivered:', JSON.parse(raw).ok));
  }
);
req.on('error', console.error);
req.write(payload);
req.end();
