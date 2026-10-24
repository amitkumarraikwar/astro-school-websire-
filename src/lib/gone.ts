// Real site routes and asset folders: never return 410 for these.
const REAL_ROUTES = new Set([
  '/', '/about', '/academics', '/admissions', '/contact', '/disclosure',
  '/facilities', '/faculty', '/fee-structure', '/gallery', '/news',
  '/privacy-policy', '/refund-policy', '/terms', '/offline', '/404',
]);

const SAFE_PREFIXES = [
  '/news/', '/_astro/', '/documents/', '/fonts/', '/optimized/', '/EVENTS/',
  '/classes/', '/STAFF_FINAL_PICS_PRO_HD_ENHANCED/', '/STAFF_FINAL_PICS_OPTIMIZED/',
  '/.well-known/', '/workbox-', '/sw.js', '/manifest.webmanifest', '/sitemap',
  '/robots.txt', '/llms.txt', '/llm.json', '/favicon', '/apple-touch-icon',
];

// Old WordPress paths
const WP_PREFIXES = ['/wp-admin', '/wp-content', '/wp-includes', '/wp-json'];
const WP_EXACT = new Set(['/wp-login.php', '/xmlrpc.php', '/wp-cron.php', '/wp-signup.php', '/wp-trackback.php']);

// Spam pages injected into the hacked WordPress site (from Google Search Console)
const SPAM_SLUGS = new Set([
  'wie-fresh-casino-die-kontoerstellung-einfach-gestaltet',
  'pin-up-casino-az-rbaycanda-onlayn-kazino-pin-up',
  'welche-slot-highlights-finden-sich-im-cat-spins-casino',
  'ist-spinline-casino-nur-ein-weiteres-casino-oder-viel-mehr',
  'winnerz-casino-und-sein-beitrag-zum-verantwortungsvollen-spielen',
  'was-macht-die-ocean-breeze-casino-app-besonders-im-vergleich-zu-anderen',
  'winnerz-casino-im-test-2026-authentische-bewertung',
  'fambet-casino-atmosphare-und-design-hintergrund-der-marke',
  'warum-spieler-spin-macho-casino-gerade-zum-einstieg-wahlen',
  'welche-bonusarten-gibt-es-bei-goldwin-und-wie-nutzt-man-sie-optimal',
]);

// Catches future spam slugs of the same kind
const SPAM_WORDS = /(casino|kazino|slot|bonus|poker|goldwin|spins?\b|wett|betting|\bbet\b|jackpot|roulette|lottery)/i;

export { REAL_ROUTES, SAFE_PREFIXES, SPAM_SLUGS, SPAM_WORDS };

export function isGone(url: URL): boolean {
  const raw = url.pathname;
  const path = raw.length > 1 ? raw.replace(/\/+$/, '') : raw; // strip trailing slash

  // 1. WordPress
  if (WP_EXACT.has(path)) return true;
  if (WP_PREFIXES.some((p) => path === p || path.startsWith(p + '/') || path.startsWith(p + '-'))) return true;
  if (path.startsWith('/wp-') && path.endsWith('.php')) return true;
  if (path === '/' && (url.searchParams.has('p') || url.searchParams.has('page_id'))) return true;

  // Never touch real pages or assets
  if (REAL_ROUTES.has(path)) return false;
  if (SAFE_PREFIXES.some((p) => raw.startsWith(p))) return false;

  // 2. Any other .php (except /index.php, which vercel.json redirects to /)
  if (path.endsWith('.php') && path !== '/index.php') return true;

  // 3. Known spam slugs (top-level, with or without trailing slash)
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 1 && SPAM_SLUGS.has(segments[0].toLowerCase())) return true;

  // 4. Generic spam pattern: any segment with gambling words
  if (segments.some((s) => SPAM_WORDS.test(s.replace(/-/g, ' ')))) return true;

  return false;
}
