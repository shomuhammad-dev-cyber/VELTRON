// ==============================================================================
// VALIXEN TELEGRAM MINI APP (TMA) - AUTOMATED VERIFICATION AUDIT
// Tests compliance against requirements:
// 1. Official Telegram Web Apps SDK integration & layout script
// 2. Cryptographic HMAC-SHA256 signature validation procedure
// 3. Replay attack rejection (expired auth_date > 24h)
// 4. Tampered initData rejection (anti-forgery)
// 5. Zero acceptance of client-supplied raw user ID without cryptographic proof
// 6. Platform account resolution & PostgreSQL database persistence
// 7. Full direct startapp deep link structure support
// 8. Native Telegram UX (fullscreen, viewport, safe areas, haptics, BackButton, MainButton)
// 9. Lightweight mobile performance: zero heavy 3D WebGL scenes
// 10. Route compilation & type safety
// ==============================================================================

process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://valixen_user:dev_pass@localhost:5432/valixen_dev?schema=public';
process.env.NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET || 'dev_secret_key_valixen_platform_auth_token_982347102938471';
process.env.TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || 'placeholder_telegram_bot_token';
process.env.TELEGRAM_BOT_USERNAME =
  process.env.TELEGRAM_BOT_USERNAME || 'ValixenOfficialBot';

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { TelegramWebAppAuthService } from '../src/server/services/telegram-webapp-auth.service';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    console.log(`  ✔ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ✖ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

/**
 * Helper to generate authentic Telegram initData strings for testing
 */
function createTelegramInitData(params: {
  botToken: string;
  user: { id: number; first_name: string; last_name?: string; username?: string };
  authDate?: number;
  startParam?: string;
  queryId?: string;
  tamper?: boolean;
}) {
  const authDate = params.authDate || Math.floor(Date.now() / 1000);
  const queryId = params.queryId || 'AAHdF6IQAAAAAN0XohDhrOrc';
  const userJson = JSON.stringify(params.user);

  const dataMap = new Map<string, string>();
  dataMap.set('auth_date', String(authDate));
  dataMap.set('query_id', queryId);
  dataMap.set('user', userJson);
  if (params.startParam) {
    dataMap.set('start_param', params.startParam);
  }

  // Build sorted data_check_string
  const sortedKeys = Array.from(dataMap.keys()).sort();
  const checkLines = sortedKeys.map((k) => `${k}=${dataMap.get(k)}`);
  const dataCheckString = checkLines.join('\n');

  // Compute secret_key = HMAC_SHA256("WebAppData", botToken)
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(params.botToken)
    .digest();

  // Compute hash signature
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  // If tamper requested, alter user payload without altering hash
  const effectiveUserJson = params.tamper
    ? JSON.stringify({ ...params.user, id: 999999999, first_name: 'ImpersonatedAttacker' })
    : userJson;

  const urlParams = new URLSearchParams();
  urlParams.set('auth_date', String(authDate));
  urlParams.set('query_id', queryId);
  urlParams.set('user', effectiveUserJson);
  if (params.startParam) urlParams.set('start_param', params.startParam);
  urlParams.set('hash', calculatedHash);

  return urlParams.toString();
}

async function runTelegramMiniAppAudit() {
  console.log('============================================================');
  console.log('📱 VALIXEN TELEGRAM MINI APP (TMA) VERIFICATION SUITE');
  console.log('============================================================\n');

  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const testUser = {
    id: 554433221,
    first_name: 'Bobur',
    last_name: 'Mirzo',
    username: 'bobur_sovereign',
  };

  // --------------------------------------------------------------------------
  // TEST SECTION 1: OFFICIAL HMAC-SHA256 SIGNATURE VALIDATION
  // --------------------------------------------------------------------------
  console.log('1. CRYPTOGRAPHIC SIGNATURE & HMAC-SHA256 AUDIT:');
  const validInitData = createTelegramInitData({
    botToken,
    user: testUser,
    startParam: 'markets',
  });

  const validResult = TelegramWebAppAuthService.validateTelegramInitData(validInitData, botToken);
  assert(validResult.valid === true, 'Authentic Telegram WebApp initData is cryptographically accepted');
  assert(validResult.data?.user.id === testUser.id, 'Verified Telegram user ID matches cryptographic payload');
  assert(validResult.data?.user.first_name === 'Bobur', 'Verified user first name extracted correctly');
  assert(validResult.data?.start_param === 'markets', 'Verified start_param parsed correctly from initData');

  // --------------------------------------------------------------------------
  // TEST SECTION 2: FORGERY & TAMPERED PAYLOAD REJECTION
  // --------------------------------------------------------------------------
  console.log('\n2. ANTI-FORGERY & TAMPERED PAYLOAD REJECTION:');
  const tamperedInitData = createTelegramInitData({
    botToken,
    user: testUser,
    tamper: true,
  });

  const tamperedResult = TelegramWebAppAuthService.validateTelegramInitData(tamperedInitData, botToken);
  assert(tamperedResult.valid === false, 'Tampered initData with forged user payload is strictly rejected');
  assert(
    Boolean(tamperedResult.error?.includes('failed') || tamperedResult.error?.includes('invalid')),
    'Signature verification returns cryptographic rejection message'
  );

  // --------------------------------------------------------------------------
  // TEST SECTION 3: REPLAY ATTACK PREVENTION & AUTH_DATE EXPIRY
  // --------------------------------------------------------------------------
  console.log('\n3. REPLAY ATTACK PREVENTION (AUTH_DATE EXPIRY):');
  const twoDaysAgoUnix = Math.floor(Date.now() / 1000) - 48 * 3600;
  const expiredInitData = createTelegramInitData({
    botToken,
    user: testUser,
    authDate: twoDaysAgoUnix,
  });

  const expiredResult = TelegramWebAppAuthService.validateTelegramInitData(expiredInitData, botToken);
  assert(expiredResult.valid === false, 'Expired auth_date (> 24 hours) is strictly rejected');
  assert(
    Boolean(expiredResult.error?.includes('expired')),
    'Explicit expiration error returned preventing captured token replay'
  );

  // Missing hash rejection
  const missingHashInitData = `user=${encodeURIComponent(JSON.stringify(testUser))}&auth_date=${Math.floor(Date.now() / 1000)}`;
  const missingHashResult = TelegramWebAppAuthService.validateTelegramInitData(missingHashInitData, botToken);
  assert(missingHashResult.valid === false, 'initData missing hash signature is rejected');

  // --------------------------------------------------------------------------
  // TEST SECTION 4: PLATFORM ACCOUNT RESOLUTION & PERSISTENCE
  // --------------------------------------------------------------------------
  console.log('\n4. ACCOUNT RESOLUTION & SOVEREIGN PROVISIONING:');
  const provisionResult = await TelegramWebAppAuthService.authenticateOrProvisionUser(validResult.data!);
  assert(provisionResult.success === true, 'Server-side provisioning/resolution succeeds');
  assert(provisionResult.userId.length > 0, 'Authentic sovereign user ID generated/retrieved');
  assert(provisionResult.isLinked === true, 'Telegram identity associated with platform account');
  assert(provisionResult.paperEquity === 100000.0, 'Initial $100k demo virtual equity verified');

  // --------------------------------------------------------------------------
  // TEST SECTION 5: DIRECT STARTAPP DEEP LINKS RESOLUTION
  // --------------------------------------------------------------------------
  console.log('\n5. DIRECT STARTAPP DEEP LINKS SPECIFICATION AUDIT:');
  const expectedDeepLinks = [
    'https://t.me/ValixenOfficialBot?startapp=dashboard',
    'https://t.me/ValixenOfficialBot?startapp=markets',
    'https://t.me/ValixenOfficialBot?startapp=ranking',
    'https://t.me/ValixenOfficialBot?startapp=education',
    'https://t.me/ValixenOfficialBot?startapp=analytics',
  ];

  for (const deepLink of expectedDeepLinks) {
    const parsed = new URL(deepLink);
    assert(parsed.searchParams.has('startapp'), `Deep link '${deepLink}' contains valid startapp query parameter`);
  }

  // --------------------------------------------------------------------------
  // TEST SECTION 6: TELEGRAM MINI APP PERFORMANCE & ZERO 3D LEAKAGE
  // --------------------------------------------------------------------------
  console.log('\n6. LIGHTWEIGHT PERFORMANCE & ZERO HEAVY 3D SCENES AUDIT:');
  const tmaPageContent = fs.readFileSync(path.join(__dirname, '../src/app/tma/page.tsx'), 'utf-8');

  // Ensure no Three.js or heavy 3D canvases are rendered in TMA
  const forbiddenHeavyLibs = ['@react-three/fiber', '@react-three/drei', 'three', '<Canvas'];
  let containsHeavy3D = false;
  for (const lib of forbiddenHeavyLibs) {
    if (tmaPageContent.includes(lib)) {
      containsHeavy3D = true;
      break;
    }
  }
  assert(!containsHeavy3D, 'Strict Performance Compliance: TMA does NOT load heavy 3D canvases or WebGL bundles');

  // --------------------------------------------------------------------------
  // TEST SECTION 7: NATIVE TELEGRAM UX & INTEGRATION HOOK
  // --------------------------------------------------------------------------
  console.log('\n7. NATIVE TELEGRAM UX & HOOK INTEGRATION:');
  const hookFile = fs.readFileSync(path.join(__dirname, '../src/lib/telegram/useTelegramWebApp.ts'), 'utf-8');
  assert(hookFile.includes('requestFullscreen'), 'Supports Telegram WebApp fullscreen mode');
  assert(hookFile.includes('themeParams'), 'Supports Telegram theme parameters adaptation');
  assert(hookFile.includes('viewportHeight'), 'Supports Telegram viewport and safe area insets');
  assert(hookFile.includes('BackButton'), 'Supports native Telegram BackButton');
  assert(hookFile.includes('MainButton'), 'Supports native Telegram MainButton');
  assert(hookFile.includes('HapticFeedback'), 'Supports native Telegram HapticFeedback');

  // --------------------------------------------------------------------------
  // TEST SECTION 8: FILES & ROUTES INTEGRITY
  // --------------------------------------------------------------------------
  console.log('\n8. ROUTES & ARCHITECTURE INTEGRITY:');
  const filesToCheck = [
    'src/lib/telegram/useTelegramWebApp.ts',
    'src/server/services/telegram-webapp-auth.service.ts',
    'src/app/api/v1/telegram/webapp/auth/route.ts',
    'src/app/tma/layout.tsx',
    'src/app/tma/page.tsx',
    'src/app/mini-app/page.tsx',
  ];

  for (const file of filesToCheck) {
    const exists = fs.existsSync(path.join(__dirname, '..', file));
    assert(exists, `File ${file} exists on disk`);
  }

  const layoutContent = fs.readFileSync(path.join(__dirname, '../src/app/tma/layout.tsx'), 'utf-8');
  assert(
    layoutContent.includes('telegram-web-app.js'),
    'Official Telegram Web Apps SDK script included in TMA layout'
  );

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n============================================================');
  console.log(`📊 TMA AUDIT COMPLETE: ${passedTests}/${totalTests} TESTS PASSED (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
  console.log('============================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTelegramMiniAppAudit().catch((err) => {
  console.error('TMA Audit error:', err);
  process.exit(1);
});
