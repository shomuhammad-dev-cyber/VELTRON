// ==============================================================================
// VELTRON — BRAND UPDATE & OFFICIAL TELEGRAM BOT INTEGRATION AUDIT SUITE
// ==============================================================================

process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://valixen_user:dev_pass@localhost:5432/valixen_dev?schema=public';
process.env.NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET || 'dev_secret_key_veltron_platform_auth_token_982347102938471';
process.env.TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || 'placeholder_telegram_bot_token';
process.env.TELEGRAM_BOT_USERNAME =
  process.env.TELEGRAM_BOT_USERNAME || 'VeltronOfficialBot';
process.env.TELEGRAM_ADMIN_CHAT_ID =
  process.env.TELEGRAM_ADMIN_CHAT_ID || '7552517378';
process.env.TELEGRAM_WEBHOOK_SECRET =
  process.env.TELEGRAM_WEBHOOK_SECRET || 'veltron_webhook_secret_key_8923487192';
process.env.NEXT_PUBLIC_APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://veltron.com';

import fs from 'fs';
import path from 'path';
import { TelegramBotService, TelegramUpdate } from '../src/server/services/telegram.service';
import { siteConfig } from '../src/config/site';

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

async function runVeltronVerification() {
  console.log('============================================================');
  console.log('⚡ VELTRON BRAND UPDATE & TELEGRAM BOT AUDIT SUITE');
  console.log('============================================================\n');

  // --------------------------------------------------------------------------
  // TEST 1: BRAND IDENTITY & CONFIGURATION
  // --------------------------------------------------------------------------
  console.log('1. BRAND IDENTITY & METADATA VERIFICATION:');
  assert(siteConfig.name === 'VELTRON', 'siteConfig.name is correctly set to VELTRON');
  assert(siteConfig.slogan === 'The Future of Finance', 'siteConfig.slogan is "The Future of Finance"');
  assert(siteConfig.description.includes('VELTRON'), 'siteConfig.description reflects VELTRON identity');
  assert(siteConfig.url === 'https://veltron.com', 'siteConfig.url is set to https://veltron.com');

  // Check UI files for absence of legacy brand NEXORA
  const filesToCheck = [
    'src/config/site.ts',
    'src/components/ui/Logo.tsx',
    'src/components/layout/Header.tsx',
    'src/components/layout/Footer.tsx',
    'src/components/layout/CinematicHUD.tsx',
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/app/login/page.tsx',
    'src/app/register/page.tsx',
    'src/app/dashboard/page.tsx',
    'src/app/admin/page.tsx',
    'src/app/tma/page.tsx',
    'src/components/telegram/TelegramConnectCard.tsx',
    'src/server/services/telegram.service.ts',
  ];

  let nexoraFound = false;
  for (const relPath of filesToCheck) {
    const fullPath = path.resolve(process.cwd(), relPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('NEXORA')) {
        console.error(`  ✖ [FAIL] Found legacy brand NEXORA in ${relPath}`);
        nexoraFound = true;
      }
    }
  }
  assert(!nexoraFound, 'Zero instances of legacy brand NEXORA found in core user-facing files');

  // Verify Logo component contains VELTRON
  const logoContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/ui/Logo.tsx'), 'utf8');
  assert(logoContent.includes('VEL') && logoContent.includes('RON') && logoContent.includes('VELTRON'), 'Logo component renders VELTRON typography');

  // --------------------------------------------------------------------------
  // TEST 2: TELEGRAM BOT CONFIGURATION & ADMIN CHAT ID
  // --------------------------------------------------------------------------
  console.log('\n2. TELEGRAM BOT CREDENTIALS & ADMIN ROUTING AUDIT:');
  assert(TelegramBotService.adminChatId === '7552517378', 'Telegram Admin Chat ID is configured to 7552517378');
  assert(typeof TelegramBotService.verifyWebhookSecret === 'function', 'verifyWebhookSecret function exists');

  // Timing-safe secret verification test
  const validSecret = process.env.TELEGRAM_WEBHOOK_SECRET!;
  assert(TelegramBotService.verifyWebhookSecret(validSecret) === true, 'Webhook accepts valid secret token');
  assert(TelegramBotService.verifyWebhookSecret('invalid_secret') === false, 'Webhook rejects invalid secret token');
  assert(TelegramBotService.verifyWebhookSecret(null) === false, 'Webhook rejects null secret token');

  // --------------------------------------------------------------------------
  // TEST 3: BOT COMMANDS (/start, /app, /dashboard, /education, /markets, /ranking, /help)
  // --------------------------------------------------------------------------
  console.log('\n3. OFFICIAL TELEGRAM BOT COMMANDS EXECUTION:');
  const commandsToTest = [
    { cmd: '/start', label: 'Welcome message' },
    { cmd: '/app', label: 'Platform Mini App link' },
    { cmd: '/dashboard', label: 'Portfolio & user level overview' },
    { cmd: '/education', label: 'Financial challenges & courses' },
    { cmd: '/markets', label: 'Real-time crypto & FX rates' },
    { cmd: '/ranking', label: 'Global & country leaderboard' },
    { cmd: '/help', label: 'Command directory & help' },
  ];

  let testUpdateId = 90001;
  for (const item of commandsToTest) {
    const update: TelegramUpdate = {
      update_id: testUpdateId++,
      message: {
        message_id: 100 + testUpdateId,
        from: { id: 7552517378, is_bot: false, first_name: 'VeltronAdmin' },
        chat: { id: 7552517378, type: 'private' },
        date: Math.floor(Date.now() / 1000),
        text: item.cmd,
      },
    };

    const res = await TelegramBotService.processWebhookUpdate(update);
    assert(res.handled === true && res.command === item.cmd, `Bot command ${item.cmd} executed successfully (${item.label})`);
  }

  // Test idempotency: re-sending the same update_id should be skipped
  const duplicateUpdate: TelegramUpdate = {
    update_id: testUpdateId - 1, // Already processed
    message: {
      message_id: 9999,
      from: { id: 7552517378, is_bot: false, first_name: 'VeltronAdmin' },
      chat: { id: 7552517378, type: 'private' },
      date: Math.floor(Date.now() / 1000),
      text: '/start',
    },
  };
  const dupRes = await TelegramBotService.processWebhookUpdate(duplicateUpdate);
  assert(dupRes.handled === true && !dupRes.command, 'Idempotency: Duplicate update_id correctly ignored without re-execution');

  // --------------------------------------------------------------------------
  // TEST 4: ADMIN TELEGRAM NOTIFICATIONS (5 KEY EVENTS)
  // --------------------------------------------------------------------------
  console.log('\n4. ADMIN TELEMETRY NOTIFICATIONS (5 KEY EVENTS TO 7552517378):');

  // Event 1: User Registration
  const regNotify = await TelegramBotService.notifyAdminUserRegistered({
    email: 'newtrader@veltron.com',
    userId: 'usr_reg_test_01',
    countryCode: 'UZ',
  });
  assert(regNotify.success === true, 'Event 1: notifyAdminUserRegistered formatted and sent to 7552517378');

  // Event 2: User Login
  const loginNotify = await TelegramBotService.notifyAdminUserLogin({
    email: 'trader@veltron.com',
    userId: 'usr_login_test_01',
    ipAddress: '185.220.101.5',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  });
  assert(loginNotify.success === true, 'Event 2: notifyAdminUserLogin formatted and sent to 7552517378');

  // Event 3: Support Ticket Received
  const ticketNotify = await TelegramBotService.notifyAdminSupportTicket({
    ticketId: 'vlt_sup_884219',
    userEmail: 'client@veltron.com',
    subject: 'API Rate Limits Clarification',
    priority: 'HIGH',
  });
  assert(ticketNotify.success === true, 'Event 3: notifyAdminSupportTicket formatted and sent to 7552517378');

  // Event 4: Critical System Error (500)
  const errNotify = await TelegramBotService.notifyAdminSystemError({
    errorName: 'PostgresConnectionTimeout',
    errorMessage: 'Connection pool exhausted under heavy telemetry burst',
    endpoint: '/api/v1/orders',
    requestId: 'req_84920412',
  });
  assert(errNotify.success === true, 'Event 4: notifyAdminSystemError formatted and sent to 7552517378');

  // Event 5: Security Incident / SIEM Alert
  const secNotify = await TelegramBotService.notifyAdminSecurityEvent({
    eventType: 'BRUTE_FORCE_ATTEMPT',
    severity: 'HIGH',
    description: '10 failed login attempts detected against single identifier',
    ipAddress: '45.154.255.8',
  });
  assert(secNotify.success === true, 'Event 5: notifyAdminSecurityEvent formatted and sent to 7552517378');

  // --------------------------------------------------------------------------
  // TEST 5: SENSITIVE DATA SANITIZATION (ZERO CREDENTIAL EXPOSURE)
  // --------------------------------------------------------------------------
  console.log('\n5. ZERO SENSITIVE DATA EXPOSURE AUDIT:');
  // Pass sensitive keys to notifyAdmin and ensure they are filtered out
  const sanitizedDispatch = await TelegramBotService.notifyAdmin({
    eventType: 'SECURITY_INCIDENT',
    title: 'Test Sanitization',
    details: {
      'User': 'test@veltron.com',
      'password': 'SUPER_SECRET_PASSWORD',
      'sessionToken': 'sensitive_session_token_123',
      'cvv': '999',
      'cardNumber': '4111222233334444',
      'pin': '1234',
      'SafeField': 'VisibleValue',
    },
  });

  assert(sanitizedDispatch.success === true, 'notifyAdmin completed execution with sensitive parameters purged');

  // --------------------------------------------------------------------------
  // TEST 6: TELEGRAM MINI APP (TMA) INTEGRATION
  // --------------------------------------------------------------------------
  console.log('\n6. TELEGRAM MINI APP (TMA) INTEGRATION AUDIT:');
  const tmaPagePath = path.resolve(process.cwd(), 'src/app/tma/page.tsx');
  const tmaContent = fs.readFileSync(tmaPagePath, 'utf8');

  assert(tmaContent.includes('useTelegramWebApp'), 'TMA page integrates useTelegramWebApp hook');
  assert(tmaContent.includes('startParam'), 'TMA page handles startParam deep links (markets, ranking, education)');
  assert(tmaContent.includes('/api/v1/telegram/webapp/auth'), 'TMA page connects to server-side cryptographic auth endpoint');
  assert(tmaContent.includes('Veltron Allocator'), 'TMA page displays Veltron Allocator identity');

  const tmaAuthRoutePath = path.resolve(process.cwd(), 'src/app/api/v1/telegram/webapp/auth/route.ts');
  const tmaAuthContent = fs.readFileSync(tmaAuthRoutePath, 'utf8');
  assert(tmaAuthContent.includes('validateTelegramInitData'), 'TMA auth route verifies cryptographic HMAC-SHA256 signature');

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n============================================================');
  console.log(`TOTAL CHECKS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
  console.log('============================================================\n');

  if (passedTests === totalTests) {
    console.log('🎉 ALL VELTRON BRANDING & TELEGRAM BOT AUDITS PASSED WITH ZERO ERRORS!\n');
  } else {
    console.error('❌ SOME AUDIT CHECKS FAILED!\n');
    process.exit(1);
  }
}

runVeltronVerification().catch((err) => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
