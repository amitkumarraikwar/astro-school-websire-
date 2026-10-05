import { auditDocument, criticalRoutes, isSchoolHost, siteOrigin } from './site-audit.mjs';

const target = new URL(process.argv[2] ?? siteOrigin);
const agents = [
  { name: 'AdsBot-Google', value: 'AdsBot-Google (+http://www.google.com/adsbot.html)' },
  { name: 'AdsBot-Google-Mobile', value: 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)' },
];
const issues = [];
const grouped = new Map();
function report(label, issue) {
  issues.push(`${label}: ${issue}`);
  if (!grouped.has(issue)) grouped.set(issue, new Set());
  grouped.get(issue).add(label);
}
let checked = 0;
const results = [];
for (const route of criticalRoutes) {
  for (const agent of agents) {
    const label = `${agent.name} ${route}`;
    try {
      const response = await fetch(new URL(route, target), { headers: { 'User-Agent': agent.value }, signal: AbortSignal.timeout(20000) });
      checked++;
      if (response.status !== 200) { report(label, `HTTP ${response.status}`); continue; }
      if (new URL(response.url).hostname !== target.hostname && !isSchoolHost(new URL(response.url))) report(label, 'Redirected to an unrelated host.');
      if (!response.headers.get('content-type')?.includes('text/html')) { report(label, 'Response is not an HTML page.'); continue; }
      const audit = auditDocument(await response.text(), route);
      audit.issues.forEach(issue => report(label, issue));
      results.push({ page: route, crawler: agent.name, finalUrl: response.url, title: audit.title, issues: audit.issues.length });
    } catch (error) { report(label, error.message); }
  }
}
try {
  const missing = await fetch(new URL('/school-website-verification-missing-page', target), { signal: AbortSignal.timeout(20000) });
  if (missing.status !== 404) report('Missing-page check', `Unknown page returns HTTP ${missing.status} instead of 404.`);
} catch (error) { report('Missing-page check', error.message); }
console.table(results);
if (issues.length) {
  console.error(`Live deployment verification failed (${grouped.size} finding types across ${checked} crawler responses):\n${[...grouped].map(([issue, labels]) => `- ${issue} (${labels.size} checks)`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Live-site checks passed: ${checked} crawler responses and a genuine missing-page 404.`);
}
console.log('This compares delivered HTML with this project’s deployment requirements. It does not execute page JavaScript, submit enquiries, validate certificates, or identify the reason for a Google Ads suspension. PWA, metadata, and Google Forms checks are project checks, not a list of mandatory Google Ads policies.');
