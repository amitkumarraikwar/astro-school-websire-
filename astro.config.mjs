import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  site: 'https://mppublicschool.online',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  prefetch: true,
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !['/404', '/thank-you', '/offline'].some(path => new URL(page).pathname.startsWith(path)),
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        const url = new URL(item.url);
        
        // Custom priority and changefreq based on route
        if (url.pathname === '/') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (url.pathname.startsWith('/admissions') || url.pathname.startsWith('/academics')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (['/about', '/facilities', '/faculty', '/contact'].some(p => url.pathname.startsWith(p))) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (url.pathname.startsWith('/news')) {
          item.priority = 0.7;
          item.changefreq = 'weekly';
        } else if (url.pathname.startsWith('/gallery')) {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        } else if (url.pathname.startsWith('/privacy-policy') || url.pathname.startsWith('/terms')) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
        }
        return item;
      },
    }),
    react(),
    AstroPWA({
      registerType: 'prompt',
      // Registration and error handling live in PwaUpdateToast.astro.
      injectRegister: false,
      manifest: {
        name: "M.P. Public School, Indore",
        short_name: "MP School",
        start_url: "/?source=pwa",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#2A2B6B",
        theme_color: "#43449A",
        lang: "en-IN",
        icons: [
          {
            src: "/favicon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/favicon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],
        shortcuts: [
          { name: "Admissions", url: "/admissions" },
          { name: "Contact", url: "/contact" },
          { name: "News & Events", url: "/news" },
          { name: "Gallery", url: "/gallery" }
        ]
      },
      workbox: {
        // Fetch HTML from the network so corrected school information is not pinned in a precache.
        globPatterns: ['**/*.{js,css,svg,png,jpg,jpeg,webp,woff,woff2,json}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              expiration: {
                maxEntries: 50,
              },
            }
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              }
            }
          }
        ],
        ignoreURLParametersMatching: [/^utm_/, /^gclid$/, /^gbraid$/, /^wbraid$/, /^fbclid$/]
      }
    })
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: [],
  },
});
