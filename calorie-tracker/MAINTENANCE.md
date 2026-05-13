# Maintenance Guide - Free Calorie Track

**Last Updated:** 2026-02-27

---

## Project Overview

This repository contains **TWO applications**:

1. **Main App** (`/calorie-tracker`) - Vite + React SPA
   - Calorie tracking application
   - Client-side only (no backend)
   - Deployed to: `freecalorietrack.com`

2. **Blog** (`/blog-astro`) - Astro static site (FUTURE - Not yet created)
   - SEO-optimized blog articles
   - Pre-rendered HTML at build time
   - Deployed to: `freecalorietrack.com/blog/*`

Both applications are deployed together on Vercel from the same repository.

---

## Quick Start

### Main App (Calorie Tracker)
```bash
cd calorie-tracker
npm install
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Blog (Astro) - WHEN CREATED
```bash
cd blog-astro
npm install
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## Critical: Shared Footer System

**SINGLE SOURCE OF TRUTH:** `/shared/footer-content.js`

### How It Works

The footer (medical disclaimer, affiliate links, legal links, copyright) is defined ONCE in `/shared/footer-content.js` and automatically injected into BOTH projects at build time.

**DO NOT edit footer HTML directly in:**
- ❌ `/calorie-tracker/index.html`
- ❌ `/blog-astro/src/layouts/BlogLayout.astro`

**ALWAYS edit:** ✅ `/shared/footer-content.js`

### Why This System Exists

Before: Footer was copy-pasted in two places. Easy to forget to update both.
After: Footer is defined once. Changes propagate automatically.

### How to Update Footer

**1. Update Medical Disclaimer:**
```javascript
// In /shared/footer-content.js
medicalDisclaimer: {
  title: "⚠️ Medical Disclaimer",
  text: "Your updated disclaimer text here..."
}
```

**2. Add New Affiliate Link:**
```javascript
// In /shared/footer-content.js
gearLinks: {
  items: [
    // ... existing items ...
    { emoji: "🎽", text: "Favorite Workout Shirt", url: "https://amzn.to/..." }
  ]
}
```

**3. Update Copyright Year:**
```javascript
// In /shared/footer-content.js
copyright: {
  year: 2027, // or new Date().getFullYear() for auto
  entity: "Unexpectable LLC"
}
```

**4. Change Support Button:**
```javascript
// In /shared/footer-content.js
supportSection: {
  heading: "Help keep Free Calorie Track free",
  description: "No ads. No paywalls...",
  buttonText: "Chip in $5",
  buttonUrl: "https://bit.ly/supportFCT"
}
```

### Verify Footer Changes

After editing `/shared/footer-content.js`:
```bash
# Test main app
cd calorie-tracker
npm run dev
# Visit http://localhost:5173 and check footer

# Test blog (when created)
cd blog-astro
npm run dev
# Visit http://localhost:4321 and check footer
```

Both should show the updated footer.

---

## Common Maintenance Tasks

### 1. Update Terms of Service or Privacy Policy

**Files:**
- `/calorie-tracker/public/terms-of-service.html`
- `/calorie-tracker/public/privacy-policy.html`

**Note:** Blog links to main app's legal pages. No need to duplicate.

**After editing:**
- Review for accuracy
- Update "Last updated" date at top
- Commit with clear message

---

### 2. Update Tailwind Styles

**IMPORTANT:** When blog is created, Tailwind config must stay in sync.

**Main app:**
- `/calorie-tracker/tailwind.config.js`

**Blog (when created):**
- `/blog-astro/tailwind.config.mjs`

**Best practice:** Copy entire config from main app to blog after changes.

**Colors, fonts, spacing must match** for consistent branding.

---

### 3. Update Dark Mode

**Main app only** (blog reads same localStorage):
- `/calorie-tracker/public/dark-mode-init.js` - Initialization script
- `/calorie-tracker/src/components/Settings.jsx` - Toggle UI

Blog auto-detects dark mode from `localStorage.getItem('darkMode')`.

---

### 4. Add New Blog Article (WHEN BLOG EXISTS)

**1. Create Markdown file:**
```bash
cd blog-astro
touch src/content/blog/article-slug.md
```

**2. Add frontmatter:**
```yaml
---
title: "Article Title (50-60 characters)"
description: "Meta description for SEO (150-160 characters)"
pubDate: 2026-03-15
author: "FCT Staff"
image: "/images/blog/article-image.webp"
---

# Article Title

Your content here in Markdown...
```

**3. Add to sitemap:**
Edit `/blog-astro/public/sitemap.xml`:
```xml
<url>
  <loc>https://freecalorietrack.com/blog/article-slug</loc>
  <priority>0.8</priority>
  <changefreq>monthly</changefreq>
</url>
```

**4. Test locally:**
```bash
cd blog-astro
npm run dev
```

**5. Build and commit:**
```bash
npm run build
git add .
git commit -m "Add blog article: Article Title"
git push
```

---

### 5. Update Copyright Year (Annually)

**Option A: Automatic (Recommended)**
Footer uses `new Date().getFullYear()` - no action needed.

**Option B: Manual**
If you set a static year in `/shared/footer-content.js`:
```javascript
copyright: {
  year: 2027, // Update this
  entity: "Unexpectable LLC"
}
```

---

### 6. Update Dependencies

**Main app:**
```bash
cd calorie-tracker
npm audit fix
npm update
npm test # If you add tests
```

**Blog (when created):**
```bash
cd blog-astro
npm audit fix
npm update
```

**Warning:** Run separately for each project. No package.json in root.

---

### 7. Deploy to Production

**Automatic:** Vercel auto-deploys on `git push` to `main` branch.

**Manual deploy:**
```bash
git push origin main
```

Vercel builds both projects and deploys automatically.

---

## Things That MUST Stay in Sync

When blog is created, these must match between main app and blog:

| Element | Main App Location | Blog Location | Why |
|---------|------------------|---------------|-----|
| **Footer** | Automatic (shared) | Automatic (shared) | Single source of truth |
| **Tailwind Config** | tailwind.config.js | tailwind.config.mjs | Colors, fonts, spacing |
| **Copyright Year** | Automatic (shared) | Automatic (shared) | Single source |
| **Dark Mode Colors** | index.css | BlogLayout.astro | CSS variables |
| **Google Fonts** | index.html | BlogLayout.astro | Inter font |

---

## Project Structure

```
/
├── calorie-tracker/              # Main Vite + React app
│   ├── public/
│   │   ├── terms-of-service.html
│   │   ├── privacy-policy.html
│   │   └── dark-mode-init.js
│   ├── src/
│   │   ├── components/
│   │   └── utils/
│   ├── index.html                # Main HTML (imports shared footer)
│   ├── tailwind.config.js
│   └── package.json
│
├── blog-astro/                   # Astro blog (FUTURE - Not yet created)
│   ├── src/
│   │   ├── content/blog/         # Blog articles (Markdown)
│   │   ├── layouts/
│   │   │   └── BlogLayout.astro  # Uses shared footer
│   │   └── pages/
│   ├── public/
│   │   ├── sitemap.xml
│   │   └── images/blog/
│   ├── tailwind.config.mjs
│   └── package.json
│
├── shared/                       # Shared content between projects
│   ├── footer-content.js         # SINGLE SOURCE OF TRUTH for footer
│   └── README.md
│
├── MAINTENANCE.md                # This file
├── .ai-context.md                # AI-specific maintenance instructions
├── vercel.json                   # Deployment config
└── .gitignore
```

---

## Troubleshooting

### Footer looks different in blog vs main app

**Cause:** Tailwind configs out of sync or styles not matching.

**Fix:**
1. Copy `/calorie-tracker/tailwind.config.js` to `/blog-astro/tailwind.config.mjs`
2. Verify Google Fonts loading in both `index.html` and `BlogLayout.astro`
3. Check CSS classes match between projects

---

### Blog dark mode not working

**Cause:** Blog not reading localStorage correctly.

**Fix:** Check `BlogLayout.astro` has this script:
```javascript
<script>
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
  }
</script>
```

---

### Footer content not updating

**Cause:** Build cache or didn't rebuild.

**Fix:**
```bash
# Clear build and rebuild
rm -rf dist
npm run build
```

---

### Deploy failed on Vercel

**Cause:** Build error in one of the projects.

**Fix:**
1. Check Vercel build logs
2. Run `npm run build` locally in both projects
3. Fix errors and push again

---

## When You Forget Everything

**Look at these files:**
1. This file (`MAINTENANCE.md`) - Comprehensive guide
2. `/.ai-context.md` - AI-specific instructions
3. `/shared/README.md` - Explains shared content system

**If documentation is outdated:**
- Update it immediately
- Future you will thank you

---

## Need Help?

**For AI assistance:**
- Read `/.ai-context.md` first
- Reference `/shared/footer-content.js` structure

**For human assistance:**
- Email: FreeCalorieTrack@gmail.com
- Review git history: `git log --oneline`
- Check commit messages for context

---

## Deployment Configuration

### Vercel Setup

**Project:** Free Calorie Track

**Build Settings:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Root Directory: `calorie-tracker`

**Environment Variables:** (None currently needed)

**Rewrites:** See `vercel.json` for routing configuration

---

## Best Practices

1. ✅ **Always edit footer in `/shared/footer-content.js`**
2. ✅ **Test both projects locally before pushing**
3. ✅ **Keep Tailwind configs in sync**
4. ✅ **Write clear commit messages**
5. ✅ **Update documentation when architecture changes**
6. ✅ **Review Vercel deploy logs after push**
7. ✅ **Export user data regularly (app feature)**

---

**This guide is your friend. Keep it updated.**
