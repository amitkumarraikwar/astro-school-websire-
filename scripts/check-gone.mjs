import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { isGone, REAL_ROUTES, SPAM_SLUGS } from '../src/lib/gone.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const vercel = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));

const issues = [];

function check(label, pathname, searchParams, expected) {
  const url = new URL(`https://mppublicschool.online${pathname}`);
  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) url.searchParams.set(k, v);
  }
  const result = isGone(url);
  if (result !== expected) {
    issues.push(`${label}: isGone("${url.href}") returned ${result}, expected ${expected}`);
  }
}

// --- Must return TRUE (410 Gone) ---

// Every known spam slug, with and without trailing slash
for (const slug of SPAM_SLUGS) {
  check(`SPAM_SLUG /${slug}`, `/${slug}`, null, true);
  check(`SPAM_SLUG /${slug}/`, `/${slug}/`, null, true);
}

// WordPress paths
check('wp-login.php', '/wp-login.php', null, true);
check('wp-admin subpage', '/wp-admin/admin.php', { page: 'presto-dashboard' }, true);
check('wp-content upload', '/wp-content/uploads/x.jpg', null, true);
check('wp-config.php', '/wp-config.php', null, true);
check('xmlrpc.php', '/xmlrpc.php', null, true);
check('wp-cron.php', '/wp-cron.php', null, true);
check('wp-signup.php', '/wp-signup.php', null, true);
check('wp-trackback.php', '/wp-trackback.php', null, true);
check('homepage ?p=12', '/', { p: '12' }, true);
check('homepage ?page_id=5', '/', { page_id: '5' }, true);

// Generic spam patterns
check('random-casino-review', '/random-casino-review', null, true);
check('best-slots-2026', '/best-slots-2026', null, true);

// PHP files (not index.php)
check('random.php', '/random.php', null, true);

// --- Must return FALSE (pass through) ---

// Every real route
for (const route of REAL_ROUTES) {
  check(`REAL_ROUTE ${route}`, route, null, false);
}

// Specific pages and assets
check('news article', '/news/school-diary-2026-27', null, false);
check('/admissions', '/admissions', null, false);
check('/fee-structure', '/fee-structure', null, false);
check('/index.php', '/index.php', null, false);
check('/sitemap-index.xml', '/sitemap-index.xml', null, false);
check('/robots.txt', '/robots.txt', null, false);
check('/_astro/x.js', '/_astro/x.js', null, false);
check('document PDF', '/documents/mpps-academic-calendar-2026-27.pdf', null, false);
check('optimized image', '/optimized/events/IMG_20260912_132414.webp', null, false);
check('/random-test-page', '/random-test-page', null, false);
check('/sw.js', '/sw.js', null, false);
check('/manifest.webmanifest', '/manifest.webmanifest', null, false);
check('/llms.txt', '/llms.txt', null, false);
check('/llm.json', '/llm.json', null, false);
check('/favicon.ico', '/favicon.ico', null, false);

// Every redirect source in vercel.json must not be caught by isGone
for (const rule of vercel.redirects ?? []) {
  // Skip host-based redirects (www → apex)
  if (rule.has?.some((c) => c.type === 'host')) continue;
  // Replace path parameters with a test value
  const testPath = rule.source
    .replace(/:path\+/g, 'x')
    .replace(/:path\*/g, 'x')
    .replace(/:year\(\\\\d\{4\}\)/g, '2025')
    .replace(/:year\(\\d\{4\}\)/g, '2025')
    .replace(/:\w+/g, 'x');
  check(`redirect source ${rule.source}`, testPath, null, false);
}

if (issues.length) {
  console.error(`Middleware isGone() verification failed (${issues.length} issues):\n${issues.map((i) => `- ${i}`).join('\n')}`);
  process.exitCode = 1;
} else {
  const trueCount = SPAM_SLUGS.size * 2 + 14; // spam slugs (x2) + WP + PHP + patterns
  const falseCount = REAL_ROUTES.size + 15 + (vercel.redirects ?? []).filter((r) => !r.has?.some((c) => c.type === 'host')).length;
  console.log(`Middleware isGone() verification passed: ${trueCount} gone assertions and ${falseCount} pass-through assertions.`);
}
