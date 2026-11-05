// ==============================================================================
// VALIXEN CYBERSECURITY TEST RUNNER
// Executes full automated security suite and formats console diagnostics
// ==============================================================================

import { SecurityTestSuite } from '../src/tests/security/security-suite.test';

async function main() {
  console.log('==============================================================================');
  console.log('🛡️  VALIXEN FINTECH SECURITY PLATFORM - AUTOMATED AUDIT & TEST SUITE');
  console.log('==============================================================================\n');

  const suite = new SecurityTestSuite();
  const startTime = Date.now();
  const results = await suite.runAll();
  const durationMs = Date.now() - startTime;

  let passedCount = 0;
  let failedCount = 0;

  // Group by category
  const grouped: Record<string, typeof results> = {};
  for (const res of results) {
    if (!grouped[res.category]) grouped[res.category] = [];
    grouped[res.category].push(res);
  }

  for (const [category, tests] of Object.entries(grouped)) {
    console.log(`\x1b[1m\x1b[36m▶ CATEGORY: ${category.toUpperCase()}\x1b[0m`);
    for (const test of tests) {
      if (test.passed) {
        passedCount++;
        console.log(`  \x1b[32m✔ [PASS]\x1b[0m ${test.name}`);
      } else {
        failedCount++;
        console.log(`  \x1b[31m✘ [FAIL]\x1b[0m ${test.name}`);
        console.log(`     \x1b[33mError: ${test.error}\x1b[0m`);
      }
    }
    console.log('');
  }

  console.log('------------------------------------------------------------------------------');
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log(`EXECUTION TIME: ${durationMs}ms`);
  console.log('==============================================================================\n');

  if (failedCount > 0) {
    console.error('❌ SECURITY TEST SUITE FAILED. CRITICAL VULNERABILITIES IDENTIFIED.');
    process.exit(1);
  } else {
    console.log('✅ ALL CYBERSECURITY TESTS PASSED WITH ZERO BREACHES.');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
