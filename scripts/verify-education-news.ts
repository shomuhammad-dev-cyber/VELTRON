// ==============================================================================
// VALIXEN VERIFICATION SUITE: EDUCATION & NEWS MODULES
// Automated verification for curriculum, interactive quizzes, progress tracking,
// legitimate news source attribution, bookmarking, and anti-fabrication controls
// ==============================================================================

process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://valixen_user:dev_pass@localhost:5432/valixen_dev?schema=public';

import { db } from '../src/lib/db';
import { EducationService } from '../src/server/services/education.service';
import { NewsService } from '../src/server/services/news.service';

async function runEducationNewsVerification() {
  console.log('\n============================================================');
  console.log('🏛️  VALIXEN FINTECH: EDUCATION & NEWS VERIFICATION SUITE');
  console.log('============================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✔ [PASS] Test ${totalTests}: ${testName}`);
      passedTests++;
    } else {
      console.error(`  ✘ [FAIL] Test ${totalTests}: ${testName} - Detail: ${detail || 'Assertion failed'}`);
    }
  }

  // Self-contained in-memory mock harness for unit isolation
  const mockBookmarks = new Set<string>();
  let mockUserProg: any = null;

  (db as any).newsBookmark = {
    findMany: async ({ where }: any) => {
      const list: any[] = [];
      mockBookmarks.forEach((key) => {
        const [uId, aId] = key.split(':');
        if (!where?.userId || where.userId === uId) {
          list.push({ id: key, userId: uId, articleId: aId });
        }
      });
      return list;
    },
    findFirst: async ({ where }: any) => {
      const key = `${where.userId}:${where.articleId}`;
      return mockBookmarks.has(key) ? { id: key, ...where } : null;
    },
    create: async ({ data }: any) => {
      mockBookmarks.add(`${data.userId}:${data.articleId}`);
      return { id: `${data.userId}:${data.articleId}`, ...data };
    },
    delete: async ({ where }: any) => {
      mockBookmarks.delete(where.id);
      return { id: where.id };
    },
  };

  (db as any).userCourseProgress = {
    findMany: async () => (mockUserProg ? [mockUserProg] : []),
    findFirst: async () => mockUserProg,
    create: async ({ data }: any) => {
      mockUserProg = { id: 'prog-1', ...data };
      return mockUserProg;
    },
    update: async ({ data }: any) => {
      mockUserProg = { ...mockUserProg, ...data };
      return mockUserProg;
    },
  };

  (db as any).newsArticle = {
    findMany: async () => [],
    create: async ({ data }: any) => ({
      id: 'art-' + Date.now(),
      ...data,
      publishedAt: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  };

  (db.user as any).findUnique = async ({ where }: any) => {
    if (where.id === 'test-admin-id') return { id: 'test-admin-id', role: 'SYSTEM_ADMIN' };
    if (where.id === 'test-trader-id') return { id: 'test-trader-id', role: 'TRADER' };
    return null;
  };

  const testTraderId = 'test-trader-id';
  const testAdminId = 'test-admin-id';

  console.log('1. EDUCATION MODULE VERIFICATION:');

  // Test 1: Fetch All Courses
  const courses = await EducationService.getAllCourses(testTraderId);
  assert(courses.length >= 4, 'EducationService returns all foundational courses (>=4)', `Got ${courses.length}`);

  // Test 2: Check Course Categories
  const categories = new Set(courses.map((c) => c.category));
  assert(
    categories.has('BANKING_FUNDAMENTALS') &&
      categories.has('BUDGETING') &&
      (categories.has('CRYPTOCURRENCY') || categories.has('CRYPTO_FUNDAMENTALS')) &&
      (categories.has('INVESTMENT') || categories.has('INVESTMENT_FUNDAMENTALS')),
    'All curriculum tracks (Banking, Budgeting, Crypto, Investment) are present'
  );

  // Test 3: Fetch Single Course by Slug
  const bankingCourse = await EducationService.getCourseBySlug('banking-fundamentals', testTraderId);
  assert(
    bankingCourse !== null && bankingCourse.slug === 'banking-fundamentals',
    'Retrieves full course by slug "banking-fundamentals"'
  );
  assert(
    (bankingCourse?.lessons.length || 0) >= 3,
    'Course contains interactive multi-lesson syllabus',
    `Got ${bankingCourse?.lessons.length} lessons`
  );

  // Test 4: Key Takeaways and Quizzes Structure
  const firstLesson = bankingCourse?.lessons[0];
  assert(
    (firstLesson?.keyTakeaways.length || 0) > 0,
    'Lesson includes verified Key Institutional Takeaways',
    `Got ${firstLesson?.keyTakeaways.length} takeaways`
  );
  assert((firstLesson?.quiz.length || 0) > 0, 'Lesson includes embedded interactive quiz question');

  // Test 5: Quiz Submission - Correct Option
  const correctRes = await EducationService.submitLessonQuiz(
    testTraderId,
    'banking-fundamentals',
    'lesson-bf-1',
    1 // Correct answer for RTGS
  );
  assert(correctRes.isCorrect === true, 'Quiz evaluation correctly identifies correct option');
  assert(correctRes.xpEarned > 0, 'Awards positive XP for correct answers', `XP: ${correctRes.xpEarned}`);
  assert(
    typeof correctRes.explanation === 'string' && correctRes.explanation.length > 10,
    'Returns educational explanation rationale'
  );

  // Test 6: Quiz Submission - Incorrect Option
  const incorrectRes = await EducationService.submitLessonQuiz(
    testTraderId,
    'banking-fundamentals',
    'lesson-bf-1',
    0 // Wrong option
  );
  assert(incorrectRes.isCorrect === false, 'Quiz evaluation correctly rejects incorrect option');

  // Test 7: Progress Recalculation
  const updatedCourse = await EducationService.getCourseBySlug('banking-fundamentals', testTraderId);
  assert(
    (updatedCourse?.completedLessonsCount || 0) >= 1 && (updatedCourse?.progressPercent || 0) > 0,
    'Course progress percentage updates upon successful quiz completion',
    `Progress: ${updatedCourse?.progressPercent}%`
  );

  console.log('\n2. NEWS MODULE VERIFICATION:');

  // Test 8: Fetch All News Articles
  const allArticles = await NewsService.getArticles(testTraderId);
  assert(allArticles.length >= 4, 'NewsService returns curated factual dispatches', `Got ${allArticles.length}`);

  // Test 9: Strict Legitimate Source Attribution
  const allHaveAttribution = allArticles.every(
    (a) => a.sourceName && a.sourceName.trim().length > 0 && a.sourceUrl && a.publishedAt && a.author
  );
  assert(
    allHaveAttribution,
    'Strict Compliance: Every article displays direct legitimate source attribution (sourceName, URL, author, date)'
  );

  // Test 10: Official Central Bank of Uzbekistan (CBU) Rate Bulletin
  const cbuArticle = allArticles.find((a) => a.tags.includes('CBU'));
  assert(
    cbuArticle !== undefined && cbuArticle.sourceName.includes('Central Bank of the Republic of Uzbekistan'),
    'Includes verified Central Bank of Uzbekistan monetary policy release'
  );

  // Test 11: Category Filtering
  const cryptoArticles = await NewsService.getArticles(testTraderId, { category: 'CRYPTO' });
  const allCrypto = cryptoArticles.every((a) => a.category === 'CRYPTO');
  assert(allCrypto && cryptoArticles.length > 0, 'Category filter correctly isolates CRYPTO dispatches');

  // Test 12: Keyword Search Filtering
  const searchResults = await NewsService.getArticles(testTraderId, { search: '13.5%' });
  assert(
    searchResults.some((a) => a.title.includes('13.5%') || a.summary.includes('13.5%')),
    'Search filtering locates articles by monetary rate keyword ("13.5%")'
  );

  // Test 13: Bookmark Toggle Feature
  const firstArticle = allArticles[0];
  const bookmarkRes1 = await NewsService.toggleBookmark(testTraderId, firstArticle.id);
  assert(typeof bookmarkRes1.isBookmarked === 'boolean', 'NewsService toggles bookmark state');

  const bookmarkFilter = await NewsService.getArticles(testTraderId, { bookmarkedOnly: true });
  assert(
    bookmarkFilter.some((a) => a.id === firstArticle.id) === bookmarkRes1.isBookmarked,
    'Saved bookmarks filter accurately reflects user bookmark state'
  );

  // Revert bookmark
  await NewsService.toggleBookmark(testTraderId, firstArticle.id);

  console.log('\n3. EDITORIAL SECURITY & ANTI-FABRICATION CONTROLS:');

  // Test 14: Non-Admin Publishing Forbidden
  let nonAdminBlocked = false;
  try {
    await NewsService.createAdminArticle(testTraderId, {
      title: 'Unauthorized Financial Dispatch',
      slug: 'unauthorized-dispatch',
      summary: 'Should be blocked by RBAC',
      content: 'Content',
      category: 'GLOBAL_FINANCE',
      sourceName: 'Fake Source',
      tags: [],
    });
  } catch (err: any) {
    if (err.statusCode === 403 || err.name === 'ForbiddenError') {
      nonAdminBlocked = true;
    }
  }
  assert(nonAdminBlocked, 'RBAC Enforcement: Non-admin users are strictly blocked from publishing news');

  // Test 15: Anti-Fabrication: Source Attribution Mandatory
  let missingSourceBlocked = false;
  try {
    await NewsService.createAdminArticle(testAdminId, {
      title: 'Fabricated Speculation Without Attribution',
      slug: 'fabricated-speculation',
      summary: 'No source given',
      content: 'Content',
      category: 'GLOBAL_FINANCE',
      sourceName: '', // Empty source attribution
      tags: [],
    });
  } catch (err: any) {
    if (err.statusCode === 400 || err.name === 'ValidationError') {
      missingSourceBlocked = true;
    }
  }
  assert(
    missingSourceBlocked,
    'Anti-Fabrication Enforcement: Dispatches without legitimate source attribution are rejected'
  );

  // Test 16: Admin Publishing With Verified Attribution
  const published = await NewsService.createAdminArticle(testAdminId, {
    title: 'IMF Regional Economic Outlook for Central Asia 2026',
    slug: 'imf-regional-economic-outlook-ca-2026',
    summary:
      'International Monetary Fund projects sustained GDP growth for Uzbekistan underpinned by financial market modernization.',
    content: 'The IMF highlighted macroeconomic resilience, foreign direct investments, and fiscal balance.',
    category: 'ECONOMIC_POLICY',
    sourceName: 'International Monetary Fund (IMF) Regional Report',
    sourceUrl: 'https://www.imf.org',
    author: 'Middle East and Central Asia Department',
    tags: ['IMF', 'Macroeconomics', 'Uzbekistan', 'GDP'],
    readTimeMinutes: 5,
    isFeatured: false,
  });
  assert(
    published !== null && published.slug === 'imf-regional-economic-outlook-ca-2026',
    'Authorized admin can publish verified dispatch with legitimate source attribution'
  );

  console.log('\n------------------------------------------------------------');
  console.log(`SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('------------------------------------------------------------\n');

  if (passedTests === totalTests) {
    console.log('🎉 ALL EDUCATION & NEWS MODULE VERIFICATION TESTS PASSED!\n');
    process.exit(0);
  } else {
    console.error('❌ SOME TESTS FAILED.\n');
    process.exit(1);
  }
}

runEducationNewsVerification();
