# Blog Post Creation Guide

**Complete guide for creating SEO-optimized, ADA-compliant blog posts for Free Calorie Track.**

---

## Quick Start Checklist

- [ ] Create Markdown file in `/src/content/blog/`
- [ ] Add proper frontmatter with all required fields
- [ ] Use correct heading hierarchy (h2 → h3, no h1)
- [ ] Add descriptive alt text to all images
- [ ] Include affiliate disclosure if needed
- [ ] Test in dark mode
- [ ] Check accessibility with keyboard navigation
- [ ] Verify SEO meta tags
- [ ] Build and preview before deploying

---

## SEO Optimization

### Why This Fixes the Old Blog's SEO Issues

**Problem with old React blog:**
- React SPA rendered meta tags via JavaScript
- Search engine bots saw generic meta tags before JS executed
- Poor indexing, no rich snippets in search results
- Bing and other crawlers couldn't read article content properly

**How Astro blog solves this:**
- ✅ **Static HTML generation** - meta tags rendered at build time
- ✅ **No JavaScript required** - bots see full content immediately
- ✅ **Article-specific meta tags** - unique title, description, image for each post
- ✅ **Open Graph & Twitter Cards** - proper social sharing previews
- ✅ **Canonical URLs** - prevents duplicate content issues
- ✅ **Semantic HTML** - proper article structure, headings, landmarks

**Result:** Search engines can properly index content, show rich snippets, and rank articles.

---

## File Structure

### 1. Create Markdown File

**Location:** `/src/content/blog/`

**Naming convention:**
- Use lowercase, hyphen-separated slugs
- Match the article title closely
- Keep it short but descriptive

**Examples:**
```
what-are-calories.md
best-blenders-for-protein-shakes.md
macro-calculator-guide.md
```

The filename becomes the URL:
- `what-are-calories.md` → `freecalorietrack.com/blog/what-are-calories`

---

## Frontmatter Template

**Every blog post must start with frontmatter** (YAML between `---` markers).

### Required Fields

```markdown
---
title: "Your Article Title (60 chars max for SEO)"
description: "SEO meta description - 150-160 characters. Include primary keyword. This appears in search results."
pubDate: 2026-02-28
author: "FCT Staff"
image: "/images/blog/your-image.webp"
---
```

### Field Guidelines

**title:**
- **Max 60 characters** (Google truncates longer titles)
- Include primary keyword near the beginning
- Capitalize major words (Title Case)
- No periods at the end
- Example: `"What Are Calories? Complete Guide for Beginners"`

**description:**
- **150-160 characters** (sweet spot for Google)
- Include 1-2 keywords naturally
- Actionable and compelling (encourages clicks)
- Complete sentence(s)
- Example: `"Learn what calories are, how they affect weight loss, and why tracking them works. Science-backed guide for beginners starting their fitness journey."`

**pubDate:**
- Format: `YYYY-MM-DD`
- Use current date for new posts
- Don't backdate unless necessary

**author:**
- Use `"FCT Staff"` for consistency

**image:**
- **Path:** `/images/blog/filename.webp`
- **Format:** WebP preferred (smaller file size)
- **Dimensions:** 1200x630px (Open Graph standard)
- **File size:** Under 200KB
- Image appears in social shares and article header

---

## Typography & Formatting

### Font

All text uses **Inter font** (loaded from Google Fonts).

### Heading Hierarchy

**NEVER use h1 (`#`) in article content** - the layout automatically adds h1 for the title.

```markdown
## Section Heading (h2)

Paragraph text goes here.

### Subsection Heading (h3)

More detailed content.
```

**Rules:**
- Start with `##` (h2) for main sections
- Use `###` (h3) for subsections
- Never skip levels (h2 → h3, not h2 → h4)
- Keep headings descriptive and keyword-rich

**Example structure:**
```markdown
## What Is a Calorie?

Content...

## How Do Calories Affect Weight?

Content...

### Creating a Calorie Deficit

Content...

### Calorie Surplus for Muscle Gain

Content...

## Common Myths About Calories

Content...
```

### Paragraphs & Line Breaks

**Spacing:**
- Leave **one blank line** between paragraphs
- Leave **one blank line** before and after headings
- Leave **one blank line** before and after lists

```markdown
## Section Title

First paragraph with important information.

Second paragraph continues the thought.

- Bullet point one
- Bullet point two

Next paragraph after the list.
```

### Lists

**Unordered (bullet) lists:**
```markdown
- Item one
- Item two
- Item three
```

**Ordered (numbered) lists:**
```markdown
1. First step
2. Second step
3. Third step
```

**Best practices:**
- Use bullets for non-sequential items
- Use numbers for sequential steps
- Keep list items concise (1-2 lines)
- Parallel structure (all items same grammatical form)

### Bold & Emphasis

```markdown
**Bold text** for important terms or emphasis.

*Italic text* for subtle emphasis (use sparingly).
```

### Links

```markdown
[Link text](https://example.com)
```

**Best practices:**
- Descriptive link text (not "click here")
- Open external links in new tab (handled automatically for external domains)
- Use relative links for internal pages: `[Main app](/)`

---

## Images

### Adding Images

1. **Save image** to `/public/images/blog/`
2. **Use WebP format** when possible
3. **Optimize file size** (use ImageOptim or similar)
4. **Reference in Markdown:**

```markdown
![Descriptive alt text](/images/blog/your-image.webp)
```

### Image Requirements

**Alt text:**
- **Always required** (accessibility & SEO)
- Describe what's in the image
- Include keywords naturally
- 100-125 characters max

**Examples:**
```markdown
![Person using barcode scanner in Free Calorie Track app](/images/blog/barcode-scanner.webp)

![Adjustable dumbbells on home gym floor](/images/blog/dumbbells-review.webp)
```

**Dimensions:**
- **Header images:** 1200x630px (Open Graph standard)
- **In-article images:** 800-1200px wide
- **Icons/small graphics:** 200-400px

**File size:**
- Keep under 200KB
- Use WebP for best compression
- Compress with tools like ImageOptim, Squoosh, or TinyPNG

---

## Custom HTML Elements

### Callout Boxes

**Highlighted information boxes:**

```html
<div class="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 p-4 rounded">
  <strong>Pro Tip:</strong> This is a helpful callout that stands out from regular text.
</div>
```

**Warning boxes:**

```html
<div class="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded">
  <strong>Important:</strong> Critical information users should know.
</div>
```

### CTA Buttons

**Affiliate product links:**

```html
<div class="text-center my-8">
  <a href="https://amzn.to/your-affiliate-link" target="_blank" rel="noopener noreferrer" class="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg">
    Check Price on Amazon
  </a>
</div>
```

**Link to main app:**

```html
<div class="text-center my-8">
  <a href="/" class="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg">
    Start Tracking Free
  </a>
</div>
```

**Best practices:**
- Use sparingly (1-3 per article)
- Place after compelling content
- Use action-oriented text ("Start Tracking", "Check Price")

### Feature Lists

**For product features or key points:**

```markdown
- ✅ Feature one
- ✅ Feature two
- ✅ Feature three
```

Or with custom styling:

```html
<ul class="space-y-2">
  <li>✅ <strong>Feature name</strong> — Description of the feature</li>
  <li>✅ <strong>Another feature</strong> — Why it matters</li>
</ul>
```

---

## Accessibility (ADA Compliance)

### Why Accessibility Matters

- **Legal requirement** (ADA compliance)
- **Better UX** for all users
- **SEO benefits** (Google rewards accessible sites)
- **Larger audience** (15% of people have disabilities)

### Checklist

**Images:**
- [ ] All images have descriptive alt text
- [ ] Alt text describes content, not "image of..."
- [ ] Decorative images can use empty alt: `alt=""`

**Headings:**
- [ ] Proper hierarchy (h2 → h3, no skipping)
- [ ] Headings describe section content
- [ ] No heading used just for styling

**Links:**
- [ ] Descriptive link text (not "click here")
- [ ] External links open in new tab (automatic)
- [ ] Links are visually distinct (underlined in prose)

**Color & Contrast:**
- [ ] Text readable in both light and dark mode
- [ ] High contrast ratios (automatic in our theme)
- [ ] Don't rely on color alone to convey meaning

**Content Structure:**
- [ ] Logical reading order
- [ ] Lists used for list content
- [ ] Tables used for tabular data
- [ ] Short paragraphs (3-5 sentences max)

---

## Dark Mode Support

All blog posts automatically support dark mode. The theme switches based on user preference (synced with main app via localStorage).

### Test Your Post in Dark Mode

1. **Toggle dark mode** using the dev button in the header
2. **Check readability** of all text
3. **Verify images** look good on dark backgrounds
4. **Test custom HTML** elements (callouts, buttons)

**Colors that work in both modes:**
- ✅ Use Tailwind utility classes (`text-gray-900 dark:text-gray-100`)
- ✅ Emerald/green colors (brand colors)
- ✅ Built-in prose styles (automatically adapt)

**Avoid:**
- ❌ Hardcoded hex colors without dark variants
- ❌ White backgrounds without dark equivalents
- ❌ Low contrast colors

---

## Affiliate Disclosure

**When to include:**
- Any article with Amazon affiliate links
- Gear reviews
- Product recommendations

**Template:**

Add at the bottom of the article, before the final CTA:

```markdown
---

**Affiliate Disclosure:** This post contains affiliate links. If you purchase through these links, we may earn a small commission at no extra cost to you. We only recommend products we've personally tested and believe in.
```

---

## Example Article Structure

```markdown
---
title: "Best Adjustable Dumbbells for Home Gyms"
description: "In-depth review of the best adjustable dumbbells for home workouts. Compare weight ranges, build quality, and value to find the perfect set."
pubDate: 2026-02-28
author: "FCT Staff"
image: "/images/blog/adjustable-dumbbells.webp"
---

## Why Adjustable Dumbbells?

Opening paragraph that explains the topic and hooks the reader.

Second paragraph that provides context or addresses a pain point.

## What to Look For

### Weight Range

Content about weight range considerations.

### Build Quality

Content about durability and materials.

### Price vs. Value

Content about pricing considerations.

## Our Top Pick: [Product Name]

![Adjustable dumbbells set on gym floor](/images/blog/dumbbells-review.webp)

Detailed review content with specifics.

<div class="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 p-4 rounded">
  <strong>Pro Tip:</strong> Start with lighter weights and focus on form before increasing load.
</div>

**Key Features:**
- ✅ Weight range: 5-80 lbs per dumbbell
- ✅ Quick adjustment mechanism
- ✅ Compact storage

<div class="text-center my-8">
  <a href="https://amzn.to/link" target="_blank" rel="noopener noreferrer" class="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg">
    Check Price on Amazon
  </a>
</div>

## Track Your Strength Training

Content about how Free Calorie Track helps with strength training.

<div class="text-center my-8">
  <a href="/" class="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg">
    Start Tracking Free
  </a>
</div>

---

**Affiliate Disclosure:** This post contains affiliate links. If you purchase through these links, we may earn a small commission at no extra cost to you.
```

---

## Testing Checklist

Before committing a new blog post:

### Content
- [ ] Frontmatter complete and accurate
- [ ] Title under 60 characters
- [ ] Description 150-160 characters
- [ ] No h1 headings in content
- [ ] Proper heading hierarchy
- [ ] All images have alt text
- [ ] Links are descriptive
- [ ] Spelling and grammar checked

### Visual
- [ ] Images load properly
- [ ] Spacing looks correct
- [ ] Lists formatted properly
- [ ] CTA buttons visible and styled
- [ ] Dark mode looks good
- [ ] Mobile responsive (test in DevTools)

### Accessibility
- [ ] Tab through with keyboard only
- [ ] Headings in logical order
- [ ] Links have clear text
- [ ] Color contrast sufficient
- [ ] No flashing or animations

### SEO
- [ ] Meta description compelling
- [ ] Primary keyword in title
- [ ] Keyword in first paragraph
- [ ] Internal links to main app
- [ ] Image alt text includes keywords
- [ ] Canonical URL correct

### Technical
- [ ] Dev server runs without errors
- [ ] Build succeeds (`npm run build`)
- [ ] Preview looks correct (`npm run preview`)
- [ ] No console errors

---

## Publishing Workflow

### 1. Create Article

```bash
cd /Users/Griffin/Documents/GitHub/Free_Calorie_Track/blog-astro
touch src/content/blog/your-article-slug.md
```

### 2. Write Content

Follow this guide's formatting and accessibility standards.

### 3. Add Images (if needed)

```bash
cp your-image.webp public/images/blog/
```

### 4. Test Locally

```bash
npm run dev
# Visit http://localhost:4321/blog/your-article-slug
```

**Test:**
- All content renders correctly
- Images load
- Links work
- Dark mode looks good
- Keyboard navigation works

### 5. Build

```bash
cd ..
./build-all.sh
```

This builds both the main app and blog, then copies blog into main app's dist.

### 6. Deploy

```bash
cd calorie-tracker
git add .
git commit -m "Add new blog post: [Article Title]"
git push
```

Vercel automatically deploys on push to main.

### 7. Verify in Production

- Visit `freecalorietrack.com/blog/your-article-slug`
- Check SEO meta tags (View Page Source)
- Test social sharing (Facebook Debugger, Twitter Card Validator)
- Verify in Google Search Console

---

## Common Patterns

### Educational Guide

**Structure:**
1. Introduction (what, why)
2. Background/fundamentals
3. How-to steps
4. Common mistakes
5. CTA to app

**Example:** "What Are Calories?"

### Product Review

**Structure:**
1. Overview (what, who it's for)
2. What to look for (buying guide)
3. Detailed review
4. Pros/cons
5. Verdict/recommendation
6. Affiliate CTA
7. App CTA (how to track workouts)

**Example:** "Best Adjustable Dumbbells"

### Calculator/Tool

**Structure:**
1. What it is
2. Why it matters
3. How to use it
4. Example calculation
5. CTA to app (with built-in calculator)

**Example:** "TDEE Calculator Guide"

---

## SEO Best Practices

### Keyword Research

1. **Primary keyword** in title
2. **Primary keyword** in first paragraph
3. **Related keywords** throughout (naturally)
4. **Long-tail variations** in headings

### Internal Linking

- Link to main app (`/`)
- Link to related blog posts
- Use descriptive anchor text

### External Linking

- Link to authoritative sources (studies, .gov, .edu)
- Open in new tab (automatic for external links)
- Use `rel="noopener noreferrer"` (automatic)

### Meta Tags

All automatic via frontmatter:
- Title tag
- Meta description
- Open Graph (Facebook, LinkedIn)
- Twitter Cards
- Canonical URL

### Performance

- WebP images (smaller file size)
- Lazy loading (automatic for images)
- Static HTML (no JavaScript required)
- Fast server response (Vercel edge network)

---

## Troubleshooting

### Images not showing

**Cause:** Incorrect path or file not in `/public`

**Fix:**
```bash
# Check file exists
ls public/images/blog/your-image.webp

# Path in Markdown should be:
![Alt text](/images/blog/your-image.webp)
```

### Spacing looks wrong

**Cause:** Missing blank lines in Markdown

**Fix:** Always leave one blank line between elements:
```markdown
## Heading

Paragraph text.

- List item
- List item

Next paragraph.
```

### Dark mode styling broken

**Cause:** Custom HTML without dark mode classes

**Fix:** Use Tailwind dark variants:
```html
<div class="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
```

### Build fails

**Cause:** Invalid frontmatter or Markdown syntax

**Fix:**
- Check YAML syntax in frontmatter
- Ensure all strings are quoted
- Verify date format (YYYY-MM-DD)
- Check for unclosed HTML tags

---

## Resources

### Tools

- **Image optimization:** [Squoosh](https://squoosh.app/), ImageOptim
- **SEO preview:** [Meta Tags](https://metatags.io/)
- **Accessibility:** Browser DevTools Lighthouse
- **Markdown preview:** VS Code Markdown preview

### Documentation

- **Astro:** https://docs.astro.build
- **Tailwind CSS:** https://tailwindcss.com/docs
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

### Internal Docs

- `/blog-astro/README.md` - Technical documentation
- `/shared/README.md` - Shared footer system
- `/.ai-context.md` - Project architecture
- `/calorie-tracker/MAINTENANCE.md` - Deployment guide

---

## Questions?

Contact: FreeCalorieTrack@gmail.com
