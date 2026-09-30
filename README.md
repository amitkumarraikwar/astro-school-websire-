# M.P. Public School, Indore - Website

A modern, high-performance, accessible school website built with Astro, Tailwind CSS v4, and GSAP.

## Tech Stack
- **Astro**: Core framework (static site generation, islands architecture)
- **Tailwind CSS v4**: Styling and design system via CSS variables
- **GSAP & Lenis**: Smooth scrolling and scroll-triggered animations
- **Three.js**: Interactive 3D hero animation (lazy-loaded client-side)
- **TypeScript**: Type safety across the project

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the local development server:
```bash
npm run dev
```
The site will be available at `http://localhost:4321`.

### Build & Preview

To create a production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## Content Management
The website uses Astro Content Collections (Content Layer API) for easy management of dynamic content:
- **News**: Markdown files in `src/content/news/`
- **Events**: JSON data in `src/content/events/events.json`
- **Faculty**: JSON data in `src/content/faculty/staff.json`
- **Gallery**: JSON data in `src/content/gallery/gallery.json`

## Deployment
This project outputs a fully static site in the `dist` directory. You can deploy it to any static hosting provider such as:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

## Performance & SEO
- **Lighthouse**: Optimized for 95+ scores across Performance, Accessibility, Best Practices, and SEO.
- **Images**: Automatically optimized using `astro:assets`.
- **SEO**: Complete metadata, Open Graph tags, and JSON-LD schema generated for every page.
- **Sitemap**: Automatically generated on build via `@astrojs/sitemap`.
