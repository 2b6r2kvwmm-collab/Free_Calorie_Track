# Shared Content

**Purpose:** This folder contains content shared between multiple projects in this repository.

---

## Why This Exists

Free Calorie Track has **two separate applications**:
1. **Main App** (`/calorie-tracker`) - Vite + React calorie tracker
2. **Blog** (`/blog-astro`) - Astro static blog for SEO

Both need **identical footer content** (medical disclaimer, affiliate links, legal links, copyright).

**Problem:** Maintaining footer in two places = easy to forget to update both.

**Solution:** Define footer ONCE in this folder, import in both projects.

---

## Files in This Folder

### `footer-content.js`

**Single source of truth for footer content.**

Defines:
- Medical disclaimer
- Support/donation section
- Affiliate gear links
- Feedback link
- Legal links (Terms, Privacy)
- Copyright notice

**Used by:**
- `/calorie-tracker/index.html` (build-time injection via Vite plugin)
- `/blog-astro/src/layouts/BlogLayout.astro` (direct import)

---

## How to Update Footer

**✅ Correct:**
1. Edit `/shared/footer-content.js`
2. Rebuild both projects
3. Footer updates everywhere automatically

**❌ Wrong:**
1. Edit footer HTML directly in `index.html` or `BlogLayout.astro`
2. Changes only apply to one project
3. Footer gets out of sync

---

## Example: Add Affiliate Link

**Edit `/shared/footer-content.js`:**

```javascript
gearLinks: {
  items: [
    // ... existing items ...
    {
      emoji: "🎽",
      text: "Favorite Workout Shirt",
      url: "https://amzn.to/..."
    }
  ]
}
```

**Rebuild:**
```bash
cd calorie-tracker && npm run build
cd blog-astro && npm run build
```

**Result:** New link appears in both main app and blog footer.

---

## Example: Update Copyright Year

**Edit `/shared/footer-content.js`:**

```javascript
copyright: {
  year: 2027, // or new Date().getFullYear() for auto
  entity: "Unexpectable LLC"
}
```

**Rebuild and copyright updates everywhere.**

---

## Architecture

```
Main App (index.html)
     ↓ (imports at build time)
footer-content.js  ← SINGLE SOURCE OF TRUTH
     ↑ (imports directly)
Blog (BlogLayout.astro)
```

Both projects render the same footer from shared data.

---

## Future Shared Content

**This folder can expand to include:**
- Shared Tailwind configuration (if needed)
- Shared CSS variables
- Shared metadata (site name, social links)
- Shared schema.org structured data

**For now:** Just footer content.

---

## Troubleshooting

### Footer not updating after edit

**Cause:** Didn't rebuild projects.

**Fix:**
```bash
cd calorie-tracker && npm run build
cd blog-astro && npm run build
```

---

### Footer looks different in main app vs blog

**Cause:** Styling out of sync (Tailwind configs differ).

**Fix:** Copy Tailwind config from main app to blog, rebuild.

**Note:** This folder only shares *content*, not *styles*. Styles must be synced manually.

---

## Need More Info?

- **Comprehensive guide:** `/MAINTENANCE.md`
- **AI-specific instructions:** `/.ai-context.md`
- **Footer structure:** Read comments in `footer-content.js`

---

**Remember: Update footer here, and only here.**
