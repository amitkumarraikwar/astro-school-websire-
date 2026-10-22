import { readdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative, sep } from 'node:path';
import { attr, auditDocument, criticalRoutes, isSchoolHost, siteOrigin, utilityRoutes } from './site-audit.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist');
async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? filesIn(join(directory, entry.name)) : join(directory, entry.name)))).flat();
}
const files = await filesIn(output);
const pages = new Map();
const issues = [];
for (const file of files.filter(file => file.endsWith('.html'))) {
  const path = relative(output, file).split(sep).join('/');
  const route = path === 'index.html' ? '/' : `/${path.replace(/\/index\.html$|\.html$/g, '')}`;
  const page = auditDocument(await readFile(file, 'utf8'), route);
  pages.set(route, page);
  issues.push(...page.issues.map(issue => `${route}: ${issue}`));
}
for (const route of criticalRoutes) if (!pages.has(route)) issues.push(`Required school page is missing: ${route}`);
const facultyHtml = await readFile(join(output, 'faculty', 'index.html'), 'utf8');
for (const excludedName of ['Priya Maheshwari', 'Preeti Panwar', 'Chandni Jain', 'Chandani Jain']) {
  if (facultyHtml.includes(excludedName)) issues.push(`Excluded staff member remains on the public faculty page: ${excludedName}`);
}
const nikitaIndex = facultyHtml.indexOf('Nikita Verma');
if (nikitaIndex < 0) issues.push('Nikita Verma is missing from the public faculty/staff page.');
else {
  const nikitaContext = facultyHtml.slice(Math.max(0, nikitaIndex - 2000), nikitaIndex + 2000);
  if (!nikitaContext.includes('Office Staff') || !nikitaContext.includes('Administration')) {
    issues.push('Nikita Verma is not classified as office staff in Administration on the public faculty page.');
  }
}
const galleryHtml = await readFile(join(output, 'gallery', 'index.html'), 'utf8');
if (/<video\b|1000034560\.mp4/i.test(galleryHtml)) issues.push('Removed school event video remains on the public gallery page.');
if (files.some(file => file.endsWith('/EVENTS/1000034560.mp4'))) issues.push('Removed school event video asset remains in the build output.');
let linksChecked = 0;
async function checkDestination(href, from) {
  if (!href || /^(mailto:|tel:|javascript:|data:)/i.test(href)) return;
  const url = new URL(href, new URL(from, siteOrigin));
  if (!isSchoolHost(url)) return;
  linksChecked++;
  const path = decodeURIComponent(url.pathname).replace(/\/+$/, '') || '/';
  const page = pages.get(path);
  if (page) {
    if (url.hash && !page.ids.has(decodeURIComponent(url.hash.slice(1)))) issues.push(`${from}: Broken page anchor ${href}`);
    return;
  }
  // Asset names resolve under dist; a malformed URL must not escape the output.
  const asset = join(output, path.replace(/^\/+/, ''));
  if (relative(output, asset).startsWith('..')) { issues.push(`${from}: Invalid local destination ${href}`); return; }
  try { if (!(await stat(asset)).isFile()) issues.push(`${from}: Destination is not a file or page: ${href}`); }
  catch { issues.push(`${from}: Broken internal link or asset ${href}`); }
}
for (const [route, page] of pages) {
  for (const node of page.nodes) {
    if (node.tagName === 'a' || node.tagName === 'link') await checkDestination(attr(node, 'href'), route);
    if (['img', 'script'].includes(node.tagName)) await checkDestination(attr(node, 'src'), route);
    if (node.tagName === 'img' && attr(node, 'srcset')) {
      for (const source of attr(node, 'srcset').split(',')) await checkDestination(source.trim().split(/\s+/)[0], route);
    }
  }
}
for (const asset of [
  'optimized/logo.webp',
  'optimized/classes/classImages1.webp',
  'optimized/events/IMG_20260912_132414.webp',
  'STAFF_FINAL_PICS_OPTIMIZED/ABHISHEK KUMAR YADAV (1).webp',
]) {
  try { if (!(await stat(join(output, asset))).isFile()) issues.push(`Required generated media is not a file: ${asset}`); }
  catch { issues.push(`Required generated media is missing: ${asset}`); }
}
const robots = await readFile(join(output, 'robots.txt'), 'utf8');
for (const agent of ['AdsBot-Google', 'AdsBot-Google-Mobile']) {
  const group = robots.match(new RegExp(`User-agent:\\s*${agent}\\s*\n([\\s\\S]*?)(?=User-agent:|$)`, 'i'))?.[1];
  if (!group || !/^Allow:\s*\/$/m.test(group)) issues.push(`robots.txt does not explicitly allow ${agent}.`);
}
if (/Disallow:.*(?:utm_|gclid|gbraid|wbraid)/i.test(robots)) issues.push('robots.txt blocks ad landing-page parameters.');
for (const agent of ['Googlebot', 'GPTBot', 'ClaudeBot']) {
  const group = robots.match(new RegExp(`User-agent:\\s*${agent}\\s*\\n([\\s\\S]*?)(?=User-agent:|$)`, 'i'))?.[1];
  if (!group || !/^Disallow:\s*\/admin\/$/m.test(group) || !/^Disallow:\s*\/api\/$/m.test(group)) {
    issues.push(`robots.txt does not protect private paths for ${agent}.`);
  }
}
const sitemap = await readFile(join(output, 'sitemap-0.xml'), 'utf8');
const sitemapIndex = await readFile(join(output, 'sitemap-index.xml'), 'utf8');
if (!sitemapIndex.includes('/sitemap-0.xml')) issues.push('sitemap-index.xml does not reference sitemap-0.xml.');
const sitemapAlias = await readFile(join(output, 'sitemap.xml'), 'utf8');
if (!sitemapAlias.includes('<sitemapindex') || !sitemapAlias.includes('/sitemap-0.xml')) issues.push('sitemap.xml is not a valid sitemap index alias.');
const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname.replace(/\/+$/, '') || '/'));
for (const route of listed) if (!pages.has(route) || utilityRoutes.has(route)) issues.push(`Sitemap includes a missing or utility page: ${route}`);
for (const route of criticalRoutes) if (!listed.has(route)) issues.push(`Sitemap omits school page: ${route}`);
for (const sample of ['/news/cbse-results-2025', '/news/annual-sports-day-2025', '/news/smart-classrooms-inauguration']) {
  if (pages.has(sample)) issues.push(`Unverified sample article is publicly built: ${sample}`);
}
const llms = await readFile(join(output, 'llms.txt'), 'utf8');
if (!llms.includes(`${siteOrigin}/llm.json`) || !llms.includes(`${siteOrigin}/sitemap-index.xml`)) {
  issues.push('llms.txt is missing machine-readable resource links.');
}
try {
  const llmJson = JSON.parse(await readFile(join(output, 'llm.json'), 'utf8'));
  if (llmJson.url !== siteOrigin || !Array.isArray(llmJson.pages) || !llmJson.pages.some(page => page.url === `${siteOrigin}/admissions`)) {
    issues.push('llm.json is missing the canonical site URL or admissions page.');
  }
} catch {
  issues.push('llm.json is missing or invalid JSON.');
}
const manifest = JSON.parse(await readFile(join(output, 'manifest.webmanifest'), 'utf8'));
if (manifest.name !== 'M.P. Public School, Indore' || manifest.short_name !== 'MPPS') {
  issues.push('PWA manifest branding does not match the verified school name and short name.');
}
for (const icon of manifest.icons ?? []) await checkDestination(icon.src, '/manifest.webmanifest');
const serviceWorker = await readFile(join(output, 'sw.js'), 'utf8');
if (!serviceWorker.includes('offline/index.html')) issues.push('Service worker does not precache or configure the offline navigation fallback.');
if (!serviceWorker.includes('NetworkFirst') || !serviceWorker.includes('images-cache')) issues.push('Service worker runtime caching configuration is incomplete.');
const vercel = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));
for (const redirect of vercel.redirects ?? []) await checkDestination(redirect.destination, `redirect ${redirect.source}`);
if ((vercel.rewrites ?? []).some(rule => rule.destination === '/' || rule.destination === '/index.html')) issues.push('Hosting rewrites can turn missing pages into successful homepage responses.');
if (issues.length) {
  console.error(`Website verification failed (${issues.length} issues):\n${issues.map(issue => `- ${issue}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Website verification passed: ${pages.size} pages, ${linksChecked} link/asset references, ${listed.size} sitemap entries, and ${vercel.redirects?.length ?? 0} migration redirects.`);
}
