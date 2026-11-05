import { chromium } from 'playwright';
import path from 'path';

async function generateAvatar() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  });
  const page = await browser.newPage({
    viewport: { width: 800, height: 800 },
    deviceScaleFactor: 2, // 1600x1600 retina quality
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Plus+Jakarta+Sans:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 800px;
      height: 800px;
      background: radial-gradient(circle at 50% 45%, #2A1714 0%, #170E0C 50%, #0C0706 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    /* Fine gold radial glow */
    .glow {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(180, 154, 114, 0.18) 0%, rgba(80, 30, 39, 0.12) 40%, transparent 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    /* Circular luxury border line */
    .outer-ring {
      position: absolute;
      width: 740px;
      height: 740px;
      border-radius: 50%;
      border: 1px solid rgba(180, 154, 114, 0.25);
      top: 30px;
      left: 30px;
      pointer-events: none;
    }
    .inner-ring {
      position: absolute;
      width: 720px;
      height: 720px;
      border-radius: 50%;
      border: 1px dashed rgba(180, 154, 114, 0.15);
      top: 40px;
      left: 40px;
      pointer-events: none;
    }

    .container {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .emblem-svg {
      width: 280px;
      height: 280px;
      filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 30px rgba(180, 154, 114, 0.35));
    }

    .brand-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 68px;
      font-weight: 700;
      letter-spacing: 0.18em;
      margin-top: 25px;
      background: linear-gradient(135deg, #FFF9F0 0%, #EAD8BE 30%, #C4A478 70%, #9C7E52 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 4px 15px rgba(0, 0, 0, 0.7));
      text-transform: uppercase;
      padding-left: 0.18em; /* optical balance */
    }

    .tagline {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.55em;
      color: #B49A72;
      opacity: 0.85;
      text-transform: uppercase;
      margin-top: 10px;
      padding-left: 0.55em;
    }
  </style>
</head>
<body>
  <div class="glow"></div>
  <div class="outer-ring"></div>
  <div class="inner-ring"></div>

  <div class="container">
    <svg class="emblem-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF5E5" />
          <stop offset="30%" stop-color="#DFCAAA" />
          <stop offset="70%" stop-color="#B49A72" />
          <stop offset="100%" stop-color="#7D6546" />
        </linearGradient>
        <linearGradient id="innerVGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="50%" stop-color="#F5EBE1" />
          <stop offset="100%" stop-color="#D9C2A3" />
        </linearGradient>
      </defs>

      <!-- Classical Arch Outline -->
      <path
        d="M 24 74 L 24 44 C 24 29.64 35.64 18 50 18 C 64.36 18 76 29.64 76 44 L 76 74"
        stroke="url(#goldGrad)"
        stroke-width="3"
        stroke-linecap="round"
      />

      <!-- Sovereign Double Chevron V -->
      <path
        d="M 33 40 L 50 67 L 67 40"
        stroke="url(#innerVGrad)"
        stroke-width="4.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M 40 40 L 50 56 L 60 40"
        stroke="url(#goldGrad)"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.85"
      />

      <!-- Keystone Crown Jewel Dot -->
      <circle cx="50" cy="18" r="3.5" fill="url(#goldGrad)" />
      
      <!-- Base Horizon Line -->
      <line
        x1="18"
        y1="74"
        x2="82"
        y2="74"
        stroke="url(#goldGrad)"
        stroke-width="2.8"
        stroke-linecap="round"
      />
    </svg>

    <div class="brand-name">VELTRON</div>
    <div class="tagline">BEYOND FINANCE</div>
  </div>
</body>
</html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle' });
  // Wait for Google Fonts to render
  await page.waitForTimeout(1000);

  const outputPath = path.resolve(process.cwd(), 'public/images/veltron-bot-avatar.jpg');
  await page.screenshot({
    path: outputPath,
    type: 'jpeg',
    quality: 95,
  });

  console.log('✔ Avatar saved to:', outputPath);
  await browser.close();
}

generateAvatar().catch(console.error);
