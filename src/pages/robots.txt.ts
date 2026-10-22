import type { APIRoute } from 'astro';

const restrictedPaths = ['Disallow: /admin/', 'Disallow: /api/'];
const crawlerAgents = [
  'AdsBot-Google',
  'AdsBot-Google-Mobile',
  'Googlebot',
  'Bingbot',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'ClaudeBot',
  'Claude-SearchBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
];

const robotsTxt = [
  'User-agent: *',
  'Allow: /',
  ...restrictedPaths,
  ...crawlerAgents.flatMap((agent) => [
    '',
    `User-agent: ${agent}`,
    'Allow: /',
    ...restrictedPaths,
  ]),
  '',
  `Sitemap: ${new URL('sitemap-index.xml', import.meta.env.SITE).href}`,
].join('\n');

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
