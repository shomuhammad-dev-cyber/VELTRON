import { spawn } from 'child_process';
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

const httpsAgent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: false,
});

async function tgApi(method: string, body?: any): Promise<any> {
  return new Promise((resolve) => {
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
        timeout: 8000,
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(raw));
          } catch {
            resolve({ ok: false });
          }
        });
      }
    );
    req.on('error', () => resolve({ ok: false }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false });
    });
    if (payload) req.write(payload);
    req.end();
  });
}

let currentUrl = '';

function updateActiveUrl(url: string) {
  if (url === currentUrl) return;
  currentUrl = url;
  console.log(`\n🎉 [TUNNEL ACTIVE]: ${url}`);

  // Save to file for other processes
  const dataDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(
    path.join(dataDir, 'active-tunnel.json'),
    JSON.stringify({ url, updatedAt: new Date().toISOString() }, null, 2),
    'utf8'
  );

  // Update .env.local
  const envLocalPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    let content = fs.readFileSync(envLocalPath, 'utf8');
    content = content.replace(
      /NEXT_PUBLIC_APP_URL=".*?"/,
      `NEXT_PUBLIC_APP_URL="${url}"`
    );
    fs.writeFileSync(envLocalPath, content, 'utf8');
  }

  // Update Telegram Bot Menu Button
  const tmaUrl = `${url}/tma?v=${Date.now()}`;
  tgApi('setChatMenuButton', {
    chat_id: ADMIN_CHAT_ID,
    menu_button: {
      type: 'web_app',
      text: '🚀 VELTRON Ochish',
      web_app: { url: tmaUrl },
    },
  }).then((res) => {
    console.log(`✔ [MENU BUTTON UPDATED]: ${url} ->`, res?.ok ? 'OK' : 'FAILED');
  });
}

function startSshTunnel() {
  console.log('🔄 [SSH TUNNEL] Starting serveo connection with keepalive...');
  const child = spawn(
    'ssh',
    [
      '-o', 'ServerAliveInterval=10',
      '-o', 'ServerAliveCountMax=9999',
      '-o', 'ExitOnForwardFailure=yes',
      '-o', 'StrictHostKeyChecking=no',
      '-R', '80:127.0.0.1:3000',
      'serveo.net',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] }
  );

  const handleOutput = (data: Buffer) => {
    const text = data.toString('utf8');
    console.log('[SSH OUT]', text.trim());
    const match = text.match(/https:\/\/[a-zA-Z0-9\-_.]+\.serveousercontent\.com/);
    if (match) {
      updateActiveUrl(match[0]);
    }
  };

  child.stdout?.on('data', handleOutput);
  child.stderr?.on('data', handleOutput);

  child.on('close', (code) => {
    console.warn(`⚠️ [SSH TUNNEL] Closed with code ${code}. Reconnecting in 2 seconds...`);
    setTimeout(startSshTunnel, 2000);
  });

  child.on('error', (err) => {
    console.error(`❌ [SSH TUNNEL] Process error:`, err.message);
  });
}

// Keep connection alive by pinging localhost:3000 every 20s
setInterval(() => {
  if (currentUrl) {
    const req = https.get(`${currentUrl}/api/health`, { agent: httpsAgent }, () => {});
    req.on('error', () => {});
  }
}, 20000);

startSshTunnel();
