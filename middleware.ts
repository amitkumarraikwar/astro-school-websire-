import { next } from '@vercel/edge';

const gonePrefixes = [
  '/wp-admin/',
  '/wp-content/',
  '/wp-includes/',
  '/wp-json/',
];

function isGone(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  return (
    pathname === '/wp-admin' ||
    pathname === '/wp-content' ||
    pathname === '/wp-includes' ||
    pathname === '/wp-json' ||
    gonePrefixes.some((prefix) => pathname.startsWith(prefix)) ||
    pathname === '/wp-login.php' ||
    pathname === '/xmlrpc.php' ||
    (pathname === '/' && (url.searchParams.has('p') || url.searchParams.has('page_id')))
  );
}

export default function middleware(request: Request) {
  if (isGone(request)) {
    return new Response('Gone\n', {
      status: 410,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return next();
}
