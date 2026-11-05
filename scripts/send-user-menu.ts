const BOT_TOKEN = '9293997731:AAGCbBiXZeOH02OSsXyWuNyJTW9Udc93R2k';
const CHAT_ID = '7552517378';
const APP_URL = 'https://f5850827e41353.lhr.life';

const text = `🏛️ <b>VELTRON — BESPOKE ROYAL LUXURY FINANCIAL ECOSYSTEM</b>
<i>Beyond Finance. A New Era.</i>

Assalomu alaykum!
Siz <b>VELTRON</b> institutsional moliya texnologiyalari va avtonom AI platformasiga xush kelibsiz.

👑 <b>PLATFORMA IMKONIYATLARI:</b>
• 💼 <b>$100,000 Demo Kapital:</b> O‘z pulingizni xavf ostiga qo‘ymasdan savdo qilish
• 📈 <b>Real Vaqt Kotirovkalari:</b> BTC, ETH, Oltin, Neft va Valyutalar
• 🤖 <b>AI Financial Advisor:</b> Shaxsiy sun’iy intellekt tahlilchisi
• 🎓 <b>Akademiya:</b> Boshlang‘ichdan xalqaro fond boshqaruvchisigacha

⚡ <b>SAYTNI TELEGRAM ICHIDA OCHISH:</b>
Quyidagi <b>«🚀 VELTRON Platformasini Ochish»</b> tugmasini bosing — sayt to‘g‘ridan-to‘g‘ri Telegram ichida ochiladi!`;

const replyMarkup = {
  inline_keyboard: [
    [{ text: '🚀 VELTRON Platformasini Ochish (Telegram Ichida)', web_app: { url: APP_URL + '/tma' } }],
    [{ text: '🎯 VELTRON Nima Muammoni Hal Qiladi?', callback_data: 'cmd_problems' }],
    [
      { text: '📈 Jonli Bozorlar & Kripto', callback_data: 'cmd_markets' },
      { text: '💼 $100,000 Virtual Portfel', callback_data: 'cmd_portfolio' },
    ],
    [
      { text: '🎓 Moliyaviy Akademiya', callback_data: 'cmd_education' },
      { text: '🤖 AI Moliya Maslahatchisi', callback_data: 'cmd_ai' },
    ],
    [
      { text: '📊 Mening Hisobim & ID', callback_data: 'cmd_dashboard' },
      { text: 'ℹ️ Qo‘llanma & Yordam', callback_data: 'cmd_help' },
    ],
  ],
};

async function send() {
  const res = await fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'HTML',
      reply_markup: replyMarkup,
    }),
  });
  const data = await res.json();
  console.log(data);
}

send();
