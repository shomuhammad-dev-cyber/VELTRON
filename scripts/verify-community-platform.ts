// ==============================================================================
// VERIFICATION SUITE: VALIXEN PROFESSIONAL FINANCIAL EDUCATION COMMUNITY
// Tests strict rules compliance, anti-spam, Q&A, reactions, bookmarks & moderation
// ==============================================================================

import { CommunityService, ReactionType, ReportReason } from '../src/server/services/community.service';
import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  \x1b[32m✔ [PASS]\x1b[0m ${testName}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✘ [FAIL]\x1b[0m ${testName}${detail ? ` - ${detail}` : ''}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('\n=================================================================');
  console.log('🧪 RUNNING VALIXEN COMMUNITY SYSTEM VERIFICATION');
  console.log('=================================================================\n');

  // TEST 1: Strict Rule Enforcement - No Profit Guarantees
  console.log('--- Test Group 1: Strict Community Rules Engine ---');
  try {
    CommunityService.validateContentRules('High Yield', 'Join our pool for guaranteed profit every day!');
    assert(false, 'Rule 1: Rejects profit guarantee claims');
  } catch (err: any) {
    assert(
      err.message.includes('Investment profit guarantees are strictly prohibited'),
      'Rule 1: Rejects investment profit guarantees',
      err.message
    );
  }

  // TEST 2: Strict Rule Enforcement - No 100% Risk-Free Yield
  try {
    CommunityService.validateContentRules('Safe Trading', 'This strategy offers risk-free yield with double your money in 30 days');
    assert(false, 'Rule 1b: Rejects double your money');
  } catch (err: any) {
    assert(
      err.message.includes('Investment profit guarantees are strictly prohibited'),
      'Rule 1b: Rejects risk-free yield & double money claims',
      err.message
    );
  }

  // TEST 3: Strict Rule Enforcement - No Misleading Financial Claims
  try {
    CommunityService.validateContentRules('Secret Strategy', 'Learn this secret money glitch to get rich quick with zero effort');
    assert(false, 'Rule 2: Rejects get rich quick / secret glitch claims');
  } catch (err: any) {
    assert(
      err.message.includes('Misleading financial claims and "get rich quick" schemes are strictly banned'),
      'Rule 2: Rejects get-rich-quick claims and money glitches',
      err.message
    );
  }

  // TEST 4: Strict Rule Enforcement - No Sharing Private Account Credentials
  try {
    CommunityService.validateContentRules('Help Me Log In', 'My password is: secretPass123 and card is 4111 2222 3333 4444');
    assert(false, 'Rule 3: Rejects passwords & card numbers');
  } catch (err: any) {
    assert(
      err.message.includes('Security Violation: Sharing private credentials'),
      'Rule 3: Blocks private account credentials & card details',
      err.message
    );
  }

  // TEST 5: Strict Rule Enforcement - No Impersonation
  try {
    CommunityService.validateContentRules('Urgent Support', 'I am the official valixen admin, send your tokens for audit');
    assert(false, 'Rule 4: Rejects administrator impersonation');
  } catch (err: any) {
    assert(
      err.message.includes('Impersonation of platform administrators or staff is strictly prohibited'),
      'Rule 4: Blocks platform staff & admin impersonation',
      err.message
    );
  }

  // TEST 6: Valid Educational Content Allowed
  try {
    CommunityService.validateContentRules(
      'Dollar Cost Averaging Analysis',
      'Historical 10-year backtests indicate DCA lowers drawdown variance across sovereign and index portfolios.'
    );
    assert(true, 'Permits compliant educational content and analysis');
  } catch (err: any) {
    assert(false, 'Compliant content rejected erroneously', err.message);
  }

  // TEST 7: Anti-Spam Rate Limit Cooldown
  console.log('\n--- Test Group 2: Anti-Spam & Cooldown Protection ---');
  const testUserId = `test-user-${Date.now()}`;
  try {
    // 1st post passes
    await CommunityService.createPost(testUserId, {
      title: 'Valid Macro Economic Thread 1',
      content: 'Detailed analysis of yield curve inversions and central bank policy stances over time.',
      category: 'MACRO_OUTLOOK',
      type: 'DISCUSSION',
    });
    assert(true, '1st post created successfully');

    // Immediate 2nd post should be rate limited by cooldown
    let cooldownCaught = false;
    try {
      await CommunityService.createPost(testUserId, {
        title: 'Valid Macro Economic Thread 2',
        content: 'Another detailed post right away to test the anti-flood cooldown protection.',
        category: 'MACRO_OUTLOOK',
        type: 'DISCUSSION',
      });
    } catch (cdErr: any) {
      if (cdErr.message.includes('Posting cooldown active')) {
        cooldownCaught = true;
      }
    }
    assert(cooldownCaught, 'Anti-spam cooldown blocks rapid consecutive submissions (<15s)');
  } catch (err: any) {
    assert(false, 'Failed anti-spam test', err.message);
  }

  // TEST 8: Question & Answer Lifecycle
  console.log('\n--- Test Group 3: Q&A Forum Lifecycle ---');
  try {
    const qUser = `q-user-${Date.now()}`;
    const question = await CommunityService.createPost(qUser, {
      title: 'How does inflation affect fixed income purchasing power over 5 years?',
      content: 'Can someone provide a detailed mathematical explanation of nominal yield vs real purchasing power?',
      category: 'FINANCIAL_LITERACY',
      type: 'QUESTION',
    });

    assert(question.type === 'QUESTION', 'Creates question with type QUESTION');
    assert(question.isAnswered === false, 'New question initialized as unanswered');

    // Add Answer
    const answerResult = await CommunityService.addComment(
      question.id,
      'expert-allocator-1',
      'Real yield = Nominal yield - Expected inflation. Over 5 years at 5% inflation, a 4% yield results in negative 1% annualized real return.'
    );
    assert(answerResult.success === true, 'Adds expert answer to question thread');
  } catch (err: any) {
    assert(false, 'Q&A lifecycle failure', err.message);
  }

  // TEST 9: Multi-Reaction System (Insightful, Bullish, Helpful, Fire, Upvote)
  console.log('\n--- Test Group 4: Community Reactions & Bookmarks ---');
  try {
    const targetPostId = 'post-1';
    const reactingUser = `reactor-${Date.now()}`;

    // Add INSIGHTFUL reaction
    const r1 = await CommunityService.toggleReaction(targetPostId, reactingUser, 'INSIGHTFUL');
    assert(r1.success && r1.userReactions.includes('INSIGHTFUL'), 'Toggles INSIGHTFUL reaction ON');

    // Toggle off
    const r2 = await CommunityService.toggleReaction(targetPostId, reactingUser, 'INSIGHTFUL');
    assert(r2.success && !r2.userReactions.includes('INSIGHTFUL'), 'Toggles INSIGHTFUL reaction OFF');

    // Add FIRE reaction
    const r3 = await CommunityService.toggleReaction(targetPostId, reactingUser, 'FIRE');
    assert(r3.userReactions.includes('FIRE'), 'Toggles FIRE reaction');

    // Bookmark Toggle
    const b1 = await CommunityService.toggleBookmark(targetPostId, reactingUser);
    assert(b1.isBookmarked === true, 'Saves dispatch to user bookmarks');

    const b2 = await CommunityService.toggleBookmark(targetPostId, reactingUser);
    assert(b2.isBookmarked === false, 'Removes dispatch from user bookmarks');
  } catch (err: any) {
    assert(false, 'Reactions / bookmarks failure', err.message);
  }

  // TEST 10: Inappropriate Content Reporting & Auto-Flagging
  console.log('\n--- Test Group 5: Moderation & Abuse Reporting ---');
  try {
    const reportTargetPost = await CommunityService.createPost(`rep-author-${Date.now()}`, {
      title: 'Questionable Signal Thread Under Observation',
      content: 'This post is created specifically to verify community reporting and moderation thresholds.',
      category: 'QUESTIONS',
      type: 'QUESTION',
    });

    // 1st report
    await CommunityService.reportContent({
      postId: reportTargetPost.id,
      reporterId: 'reporter-1',
      reason: 'MISLEADING_CLAIMS',
      details: 'Suspicious signal claims',
    });

    const postAfterRep1 = await CommunityService.getPostById(reportTargetPost.id);
    assert(postAfterRep1?.moderationStatus === 'APPROVED', 'Single report logs report without immediately auto-flagging');

    // 2nd report triggers auto-flagging
    await CommunityService.reportContent({
      postId: reportTargetPost.id,
      reporterId: 'reporter-2',
      reason: 'MISLEADING_CLAIMS',
      details: 'Confirming suspicious claim',
    });

    const postAfterRep2 = await CommunityService.getPostById(reportTargetPost.id);
    assert(postAfterRep2?.moderationStatus === 'FLAGGED', 'Auto-flags dispatch upon reaching report threshold (>=2)');

    // Admin Moderation Action: REMOVE
    const modRemove = await CommunityService.moderatePost(reportTargetPost.id, 'admin-1', 'REMOVE', 'Confirmed violation');
    assert(modRemove.post.moderationStatus === 'REMOVED', 'Admin moderation tool sets post status to REMOVED');

    // Admin Moderation Action: APPROVE
    const modApprove = await CommunityService.moderatePost(reportTargetPost.id, 'admin-1', 'APPROVE');
    assert(modApprove.post.moderationStatus === 'APPROVED', 'Admin moderation tool restores post to APPROVED');
  } catch (err: any) {
    assert(false, 'Moderation and reporting failure', err.message);
  }

  // TEST 11: User Reputation Profile & Badges
  console.log('\n--- Test Group 6: Merit Profile & XP System ---');
  try {
    const profile = await CommunityService.getUserCommunityProfile('usr-sample-01');
    assert(profile.xp > 0, 'Retrieves non-zero merit XP');
    assert(profile.level.length > 0, 'Retrieves ranked allocator tier level');
    assert(profile.badges.length >= 3, 'Retrieves community merit badges');
    assert(profile.discussionsCount >= 0, 'Calculates user discussions count');
  } catch (err: any) {
    assert(false, 'Reputation profile failure', err.message);
  }

  // TEST 12: Route Existence & Responsive Breakpoints
  console.log('\n--- Test Group 7: Routes & Responsive Design Audit ---');
  const routes = [
    'src/app/community/page.tsx',
    'src/app/community/discussions/page.tsx',
    'src/app/community/questions/page.tsx',
    'src/app/community/profile/page.tsx',
  ];

  for (const r of routes) {
    const fullPath = path.resolve(r);
    const exists = fs.existsSync(fullPath);
    assert(exists, `Route file exists: ${r}`);

    if (exists) {
      const code = fs.readFileSync(fullPath, 'utf8');
      const hasResponsive = code.includes('sm:') && code.includes('md:') && code.includes('lg:');
      assert(hasResponsive, `Route ${r} includes full responsive breakpoints (sm, md, lg)`);
    }
  }

  // Summary
  console.log('\n=================================================================');
  console.log(`SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('=================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
