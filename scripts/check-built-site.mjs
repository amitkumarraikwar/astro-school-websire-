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
const robots = await readFile(join(output, 'robots.txt'), 'utf8');
for (const agent of ['AdsBot-Google', 'AdsBot-Google-Mobile']) {
  const group = robots.match(new RegExp(`User-agent:\\s*${agent}\\s*\n([\\s\\S]*?)(?=User-agent:|$)`, 'i'))?.[1];
  if (!group || !/^Allow:\s*\/$/m.test(group)) issues.push(`robots.txt does not explicitly allow ${agent}.`);
}
if (/Disallow:.*(?:utm_|gclid|gbraid|wbraid)/i.test(robots)) issues.push('robots.txt blocks ad landing-page parameters.');
const sitemap = await readFile(join(output, 'sitemap-0.xml'), 'utf8');
const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname.replace(/\/+$/, '') || '/'));
for (const route of listed) if (!pages.has(route) || utilityRoutes.has(route)) issues.push(`Sitemap includes a missing or utility page: ${route}`);
for (const route of criticalRoutes) if (!listed.has(route)) issues.push(`Sitemap omits school page: ${route}`);
for (const sample of ['/news/cbse-results-2025', '/news/annual-sports-day-2025', '/news/smart-classrooms-inauguration']) {
  if (pages.has(sample)) issues.push(`Unverified sample article is publicly built: ${sample}`);
}
const manifest = JSON.parse(await readFile(join(output, 'manifest.webmanifest'), 'utf8'));
for (const icon of manifest.icons ?? []) await checkDestination(icon.src, '/manifest.webmanifest');
const vercel = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));
for (const redirect of vercel.redirects ?? []) await checkDestination(redirect.destination, `redirect ${redirect.source}`);
if ((vercel.rewrites ?? []).some(rule => rule.destination === '/' || rule.destination === '/index.html')) issues.push('Hosting rewrites can turn missing pages into successful homepage responses.');
if (issues.length) {
  console.error(`Website verification failed (${issues.length} issues):\n${issues.map(issue => `- ${issue}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Website verification passed: ${pages.size} pages, ${linksChecked} link/asset references, ${listed.size} sitemap entries, and ${vercel.redirects?.length ?? 0} migration redirects.`);
}
