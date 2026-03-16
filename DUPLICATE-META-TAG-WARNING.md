# ⚠️ CRITICAL: Avoid Duplicate Meta Tags

## The Problem

**Bing and Google penalize pages with duplicate meta tags** (especially meta description and title).

This has happened **multiple times** on this project. The pattern is:

### Homepage Issue (React + React Helmet)
- **Static HTML file** (`/calorie-tracker/index.html`) contains hardcoded meta tags in `<head>`
- **React component** (`LandingPage.jsx`) uses React Helmet to dynamically inject meta tags
- **Result:** Both render in the final HTML = DUPLICATE TAGS

### What Bing Sees:
```html
<!-- Static from index.html -->
<meta name="description" content="First description">

<!-- Dynamic from React Helmet -->
<meta name="description" content="Second description" data-rh="true">
```

## The Solution

### For React Pages (Main App):
1. **Remove static meta tags** from `index.html` (except basic charset, viewport)
2. **Let React Helmet manage ALL meta tags** in the component
3. **Add comment** in index.html explaining why tag is removed:
   ```html
   <!-- Meta description managed by React Helmet in LandingPage.jsx to avoid duplicates -->
   ```

### For Astro Pages (Blog/Landing Pages):
1. **One layout, one set of meta tags** - Use `LandingPageLayout.astro` or `BlogLayout.astro`
2. **Pass props to layout** - Don't hardcode meta tags in page files
3. **No duplicate definitions** - Each meta tag should only appear once in the layout

## Checklist Before Committing

When adding/editing meta tags:

- [ ] Check for existing meta description in both HTML file AND component
- [ ] Verify only ONE meta description renders in final HTML
- [ ] Verify only ONE title tag renders in final HTML
- [ ] Check for duplicate OG tags (og:title, og:description, og:image)
- [ ] Test in Bing Webmaster Tools "Live Page Inspection" after deploy

## Files to Watch

### Main App (React):
- `/calorie-tracker/index.html` - Should have NO meta description
- `/calorie-tracker/src/components/LandingPage.jsx` - Controls meta via React Helmet
- `/calorie-tracker/src/components/SEO.jsx` - React Helmet component

### Blog/Landing Pages (Astro):
- `/blog-astro/src/layouts/LandingPageLayout.astro` - Controls meta for landing pages
- `/blog-astro/src/pages/*.astro` - Should only pass props to layout, not define meta tags

## How to Check for Duplicates

### Method 1: Build and grep
```bash
npm run build
grep -n 'meta name="description"' calorie-tracker/dist/index.html
# Should return ONLY ONE line
```

### Method 2: Live inspection
1. Deploy to production
2. Go to Bing Webmaster Tools → Site Explorer → Live Page Inspection
3. Check "Rendered Page" HTML for duplicates

### Method 3: View source in browser
```bash
curl https://freecalorietrack.com/ | grep 'meta name="description"'
# Should return ONLY ONE line
```

## Why This Matters

**SEO Impact:**
- Bing flags this as an error in Webmaster Tools
- Google may show wrong description in search results
- Reduces trust signals for ranking algorithms
- Confuses crawlers about which description to index

**Previous Incidents:**
1. March 16, 2026 - Homepage had duplicate meta description (index.html + React Helmet)
2. [Add date when this happens again - hopefully never!]

## Remember:

**"If you're using React Helmet, the HTML file should be MINIMAL. Let React control the meta tags."**
