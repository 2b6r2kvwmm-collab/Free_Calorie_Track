# Free Calorie Track - Astro Blog

**SEO-optimized blog** powered by Astro static site generation.

---

## Purpose

This blog provides nutrition, fitness, and gear review content for Free Calorie Track. It uses Astro to generate static HTML pages with proper meta tags and Open Graph data for optimal SEO performance.

### Why Astro?

The main Free Calorie Track app is a React SPA (Single Page Application). While great for interactivity, SPAs have a problem: search engine bots see generic meta tags because JavaScript hasn't run yet.

Astro solves this by:
- Generating static HTML at build time with article-specific meta tags
- Providing instant page loads with no JavaScript execution required
- Supporting Markdown for easy article authoring

---

## Quick Start

### Development
```bash
cd blog-astro
npm install
npm run dev
# Visit http://localhost:4321/blog
```

### Build
```bash
npm run build
# Output: /dist
```

### Preview Production Build
```bash
npm run preview
```

---

## Project Structure

```
blog-astro/
├── src/
│   ├── content/
│   │   ├── blog/               # Blog articles (Markdown)
│   │   │   ├── what-are-calories.md
│   │   │   ├── what-are-macros.md
│   │   │   └── ...
│   │   └── config.ts           # Content collection schema
│   ├── layouts/
│   │   └── BlogLayout.astro    # Blog layout (imports shared footer)
│   ├── pages/
│   │   └── blog/
│   │       ├── index.astro     # Blog index page
│   │       └── [...slug].astro # Dynamic blog post routes
│   └── styles/
│       └── global.css          # Tailwind CSS
├── public/
│   └── images/blog/            # Blog images
├── astro.config.mjs            # Astro configuration
└── package.json
```

---

## How It Works

### 1. Content Collections

Articles are stored as Markdown files in `/src/content/blog/`. Each file has frontmatter defining metadata:

```markdown
---
title: "Article Title"
description: "SEO description (150-160 chars)"
pubDate: 2026-02-25
author: "FCT Staff"
image: "/images/blog/image.webp"
---

# Article content here...
```

### 2. Shared Footer

The blog footer is **NOT defined in this project**. Instead, it imports from `/shared/footer-content.js`:

```astro
import { footerContent } from '../../../shared/footer-content.js';
```

This ensures the blog and main app always show the same footer. See `/shared/README.md` for details.

### 3. Dynamic Routes

`/src/pages/blog/[...slug].astro` generates a page for each Markdown file:
- `what-are-calories.md` → `/blog/what-are-calories`
- `how-to-calculate-tdee.md` → `/blog/how-to-calculate-tdee`

Astro reads the frontmatter and injects it into the page's meta tags at build time.

### 4. Dark Mode

Dark mode is synced with the main app via `localStorage`:

```javascript
if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark');
}
```

This script runs before the page renders to prevent flashing.

---

## Adding a New Blog Article

1. **Create Markdown file:**
   ```bash
   cd src/content/blog
   touch new-article-slug.md
   ```

2. **Add frontmatter:**
   ```markdown
   ---
   title: "Your Article Title"
   description: "SEO-optimized description (150-160 characters)"
   pubDate: 2026-03-15
   author: "FCT Staff"
   image: "/images/blog/article-image.webp"
   ---
   ```

3. **Write content:**
   Use Markdown syntax. You can include HTML for custom styling:
   ```markdown
   ## Heading

   Regular paragraph text.

   <div class="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded">
     Callout box with custom styling
   </div>
   ```

4. **Add images (if needed):**
   ```bash
   cp image.webp public/images/blog/
   ```

5. **Test locally:**
   ```bash
   npm run dev
   ```

6. **Build and deploy:**
   ```bash
   cd ..
   ./build-all.sh
   ```

---

## Deployment

The blog is deployed alongside the main app using the root `/build-all.sh` script:

1. **Main app builds** → `/calorie-tracker/dist`
2. **Blog builds** → `/blog-astro/dist`
3. **Blog copied into main app** → `/calorie-tracker/dist/blog`

Vercel serves everything from `/calorie-tracker/dist`:
- Main app: `freecalorietrack.com`
- Blog: `freecalorietrack.com/blog/*`

---

## Styling

The blog uses **Tailwind CSS v3** with the `@astrojs/tailwind` integration to match the main app's design:

- Dark mode: `.dark` class on `<html>` (class-based)
- Colors: Emerald primary, gray backgrounds
- Typography: Inter font (loaded from Google Fonts)
- Custom prose styles for article content

Custom styles in `/src/styles/global.css` include:
- Article typography (.prose classes)
- Accessibility utilities (sr-only, focus-visible)
- Dark mode variants

**Note:** We use Tailwind v3 instead of v4 for better compatibility with the Astro ecosystem and reliable dark mode support.

---

## Important: Shared Footer

**DO NOT edit footer HTML in `BlogLayout.astro` or `index.astro`.**

To update the footer:
1. Edit `/shared/footer-content.js`
2. Rebuild both projects: `./build-all.sh`
3. Footer updates automatically in both main app and blog

See `/shared/README.md` and `/.ai-context.md` for details.

---

## SEO Features

- ✅ Static HTML with meta tags pre-rendered
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card support
- ✅ Canonical URLs
- ✅ Semantic HTML (proper headings, article structure)
- ✅ Fast page loads (static HTML, no JS hydration)
- ✅ Mobile-responsive
- ✅ Dark mode support

---

## Accessibility (ADA Compliance)

The blog is built to WCAG 2.1 AA standards:

### Keyboard Navigation
- ✅ Skip-to-content link (press Tab on page load)
- ✅ All interactive elements keyboard accessible
- ✅ Visible focus indicators (green outline on focus)
- ✅ Proper tab order

### Screen Reader Support
- ✅ Semantic HTML (header, main, nav, footer, article)
- ✅ ARIA labels on all interactive elements
- ✅ ARIA live regions announce filter changes
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ Alt text on all images
- ✅ Screen reader-only text for context (.sr-only)

### Visual Accessibility
- ✅ High contrast text (passes WCAG AA)
- ✅ Focus-visible outlines for keyboard users
- ✅ Responsive text sizing
- ✅ Dark mode with proper contrast ratios

### Interactive Elements
- ✅ All buttons have `type="button"`
- ✅ Toggle buttons use `aria-pressed`
- ✅ Links have descriptive text or aria-labels
- ✅ Category filters announce changes to screen readers

---

## Troubleshooting

### Footer not showing

**Cause:** Shared footer file not found.

**Fix:**
```bash
ls -la ../shared/footer-content.js
```
Ensure the file exists at `/shared/footer-content.js`.

---

### Build fails with "Cannot find module"

**Cause:** Dependencies not installed.

**Fix:**
```bash
npm install
```

---

### Blog images not showing

**Cause:** Images not in `/public/images/blog/`.

**Fix:**
```bash
mkdir -p public/images/blog
cp your-image.webp public/images/blog/
```

Images in `/public` are served from the root URL:
- File: `/public/images/blog/calories.webp`
- URL: `https://freecalorietrack.com/images/blog/calories.webp`

---

### Dark mode not working

**Cause:** Using Tailwind CSS v4 with incompatible dark mode configuration.

**Fix:**
We use Tailwind v3 with `@astrojs/tailwind` integration:
```bash
npm install @astrojs/tailwind tailwindcss@^3
```

In `astro.config.mjs`:
```javascript
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: false })]
});
```

In `tailwind.config.mjs`:
```javascript
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}']
};
```

---

### Favicon shows wrong icon

**Cause:** Browser caching or incorrect file format.

**Fix:**
1. Ensure files exist in `/public/`:
   - `favicon.ico`
   - `favicon-32x32.png`
   - `apple-touch-icon.png`

2. Clear browser cache or use hard refresh (Cmd+Shift+R on Mac)

3. Try incognito/private browsing mode

4. Check favicon links include cache-busting:
   ```html
   <link rel="icon" type="image/x-icon" href="/favicon.ico?v=3">
   ```

---

## Links to Other Documentation

- **Root README:** Project overview and architecture
- **Main App README:** `/calorie-tracker/README.md`
- **Shared Content README:** `/shared/README.md`
- **Maintenance Guide:** `/calorie-tracker/MAINTENANCE.md`
- **AI Context:** `/calorie-tracker/.ai-context.md`

---

**For questions or issues, see MAINTENANCE.md or contact FreeCalorieTrack@gmail.com.**
