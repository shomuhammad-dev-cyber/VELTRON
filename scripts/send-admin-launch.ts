import https from 'https';

const BOT_TOKEN = '9293997731:AAGCbBiXZeOH02OSsXyWuNyJTW9Udc93R2k';
const ADMIN_CHAT_ID = '7552517378';
const APP_URL = 'https://3c68d6a7b1d0bc.lhr.life';

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
    await new Promise((r) => setTimeout(r, 1500));
  }
  return { ok: false };
}

async function run() {
  console.log('1. Setting chat menu button...');
  const menuRes = await tgApi('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: '🚀 VELTRON App',
      web_app: { url: `${APP_URL}/tma` },
    },
  });
  console.log('Menu button result:', menuRes);

  console.log('2. Sending launch message with inline web_app button...');
  const msgRes = await tgApi('sendMessage', {
    chat_id: ADMIN_CHAT_ID,
    text:
      '🏛️ <b>MUKAMMAL VELTRON PLATFORMASI VA TELEGRAM BOTI ULATILDI!</b>\n\n' +
      '👑 <b>Sizning Haqiqiy VELTRON Loyihangiz:</b>\n' +
      'Hech qanday tashqi yoki begona sayt emas — aynan o‘zingizning kompyuteringizda ishlayotgan <b>VELTRON (Bespoke Royal Luxury)</b> tizimingiz!\n\n' +
      '🛡️ <i>X-Frame-Options to‘sig‘i olib tashlandi, endi Telegram ichida Mini App xatosiz ochiladi.</i>\n\n' +
      'Pastdagi oltin tugmani bosing va o‘z platformangizni to‘g‘ridan-to‘g‘ri Telegram ichida oching:',
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🚀 VELTRON Platformasini Ochish (Web App)',
            web_app: { url: `${APP_URL}/tma` },
          },
        ],
        [
          { text: '🎯 Muammolar & Yechim', callback_data: 'cmd_problems' },
          { text: '💼 Savdo Terminali ($100k)', callback_data: 'trade_menu' },
        ],
        [
          { text: '📈 Jonli Bozorlar', callback_data: 'cmd_markets' },
          { text: '🎓 Akademiya & Viktorina', callback_data: 'cmd_academy' },
        ],
      ],
    },
  });
  console.log('Message result:', msgRes);
}

run();
