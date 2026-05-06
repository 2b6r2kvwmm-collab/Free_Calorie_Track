# Blog Post Pre-Creation Checklist

**⚠️ READ THIS BEFORE WRITING ANY BLOG POST ⚠️**

## Required Character Limits (SEO Critical)

Before writing frontmatter, verify these limits:

### Title
- **Maximum: 60 characters**
- Include primary keyword
- Front-load important words
- Example: "Rucking Guide: Burn 35-50% More Calories Walking" (50 chars ✓)

### Description
- **Target: 150-160 characters**
- **Maximum: 160 characters**
- Include 1-2 keywords naturally
- Complete sentences
- Actionable and compelling
- Example: "Complete rucking guide with benefits, training programs, and calorie calculator. Burn 35-50% more calories than regular walking with added weight." (153 chars ✓)

## Quick Validation

Count characters BEFORE writing:
```
Title length: [YOUR_TITLE].length
Description length: [YOUR_DESCRIPTION].length
```

**If title > 60 or description > 160, REWRITE before creating the post.**

## Category (Required)

Choose ONE:
- `"Guides"` - Educational content, how-to
- `"Gear Reviews"` - Product reviews
- `"Calculators"` - Tools, calculations

## After Publishing Checklist

Once your blog post is created, **you MUST update these files:**

### 1. Add to Sitemap (CRITICAL for SEO)

**File:** `/calorie-tracker/public/sitemap.xml`

Add entry before the closing `</urlset>` tag:

```xml
<url>
  <loc>https://freecalorietrack.com/blog/your-post-slug</loc>
  <priority>0.8</priority>  <!-- Use 0.85 for Gear Reviews -->
  <changefreq>monthly</changefreq>
</url>
```

**Priority values:**
- `0.85` - Gear Reviews (affiliate revenue potential)
- `0.8` - Guides and Calculators

**⚠️ If you skip this step, your post will NOT appear in search engines!**

### 2. Verify Schema Markup (Automatic)

The following are automatically added by `BlogLayout.astro`:
- ✅ Article schema (headline, author, dates, publisher)
- ✅ Open Graph tags (og:title, og:description, og:image, og:site_name)
- ✅ Twitter Cards
- ✅ Canonical URLs

**No action needed** - just verify by viewing page source after build.

### 3. Test Build

```bash
npm run build
npm run preview
```

Visit `http://localhost:4321/blog/your-post-slug` and verify:
- Meta tags show correct title/description (View Source)
- Image appears in header
- Dark mode works
- All links work
- Schema appears in page source (search for `application/ld+json`)

## Required Content Elements

Every post must include these elements before publishing:

### "At a Glance" Block
- [ ] Present immediately after the hero image
- [ ] Uses the standard format (subtle border-bottom, "At a glance" label, plain list)
- [ ] 3–5 bullet points, each a standalone scannable takeaway

```html
<div class="my-6 pb-6 border-b border-gray-200 dark:border-gray-700">
  <p class="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3 mt-0">At a glance</p>
  <ul class="space-y-1.5 text-gray-700 dark:text-gray-300 text-sm mb-0 list-none pl-0">
    <li>Key takeaway</li>
  </ul>
</div>
```

### Medical / Health Disclaimer
- [ ] Present if the post contains calculators, dietary advice, or exercise guidance
- [ ] Uses the subtle single-line `<p>` format (not a yellow box)
- [ ] Placed adjacent to the relevant content

```html
<p class="text-sm text-gray-400 dark:text-gray-500 mt-2 mb-6">One-sentence disclaimer — consult a healthcare provider before making significant changes.</p>
```

### Affiliate Disclosure
- [ ] Present if any affiliate links appear in the post
- [ ] Uses the subtle italic `<p>` format (not a yellow box)
- [ ] Placed right after the hero image (and AI caption if present), before the "At a glance" block

```html
<p class="text-xs text-gray-400 dark:text-gray-500 italic mb-6">Contains affiliate links — we earn a small commission if you buy through them, at no extra cost to you. We only recommend products we genuinely use.</p>
```

---

## Common Mistakes to Avoid

❌ "The Complete Guide to Rucking and Weighted Vest Training" (59 chars - barely fits)
❌ "ZELUS Weighted Vest Review: Best Budget Option for Rucking & Calisthenics" (73 chars - TOO LONG)
❌ Descriptions over 160 characters get truncated in search results

✅ "Rucking Guide: Burn 35-50% More Calories Walking" (50 chars)
✅ "ZELUS Weighted Vest Review: Budget Pick for Rucking" (53 chars)

## Full Documentation

See `/blog-astro/BLOG_POST_GUIDE.md` for complete formatting guidelines.
