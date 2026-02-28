# Search Engine Submission Guide

**How to request Google and Bing to index/re-index your blog after deployment.**

---

## Google Search Console

### 1. Set Up Google Search Console (One-Time)

**If you haven't already:**

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **"Add Property"**
3. Enter `https://freecalorietrack.com`
4. Choose verification method:
   - **Recommended:** HTML file upload to `/public`
   - Alternative: DNS TXT record
5. Follow verification steps
6. Wait for Google to verify (usually instant)

### 2. Submit Sitemap

Astro automatically generates a sitemap at `/sitemap-index.xml`.

1. In Google Search Console, go to **Sitemaps** (left sidebar)
2. Enter sitemap URL: `https://freecalorietrack.com/sitemap-index.xml`
3. Click **Submit**
4. Google will start crawling within 24-48 hours

### 3. Request Indexing for Individual Pages

**For immediate indexing of blog posts:**

1. Go to **URL Inspection** (top of page)
2. Enter full URL: `https://freecalorietrack.com/blog/what-are-calories`
3. Click **Test Live URL**
4. If test passes, click **Request Indexing**
5. Google typically indexes within 1-7 days

**Repeat for all blog posts:**
- `https://freecalorietrack.com/blog/`
- `https://freecalorietrack.com/blog/what-are-calories`
- `https://freecalorietrack.com/blog/what-are-macros`
- `https://freecalorietrack.com/blog/how-to-calculate-tdee`
- `https://freecalorietrack.com/blog/macro-calculator-guide`
- `https://freecalorietrack.com/blog/best-adjustable-dumbbells-beginners`
- `https://freecalorietrack.com/blog/best-adjustable-dumbbells-advanced`
- `https://freecalorietrack.com/blog/best-blenders-for-protein-shakes`

### 4. Monitor Indexing Status

1. Go to **Pages** (left sidebar under "Indexing")
2. Check **"Not indexed"** section for issues
3. Fix any errors and re-request indexing
4. Typical indexing timeline: 1-7 days per page

---

## Bing Webmaster Tools

### 1. Set Up Bing Webmaster Tools (One-Time)

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Sign in with Microsoft account
3. Click **"Add Site"**
4. Enter `https://freecalorietrack.com`
5. Verification options:
   - **Option 1:** Import from Google Search Console (easiest if already set up)
   - **Option 2:** XML file upload to `/public`
   - **Option 3:** Add meta tag to `<head>`
6. Click **Verify**

### 2. Submit Sitemap

1. In Bing Webmaster Tools, go to **Sitemaps**
2. Click **Submit Sitemap**
3. Enter: `https://freecalorietrack.com/sitemap-index.xml`
4. Click **Submit**
5. Bing will start crawling within 48 hours

### 3. Submit Individual URLs

**For faster indexing:**

1. Go to **URL Submission** (left sidebar)
2. Enter URLs one per line:
```
https://freecalorietrack.com/blog/
https://freecalorietrack.com/blog/what-are-calories
https://freecalorietrack.com/blog/what-are-macros
https://freecalorietrack.com/blog/how-to-calculate-tdee
https://freecalorietrack.com/blog/macro-calculator-guide
https://freecalorietrack.com/blog/best-adjustable-dumbbells-beginners
https://freecalorietrack.com/blog/best-adjustable-dumbbells-advanced
https://freecalorietrack.com/blog/best-blenders-for-protein-shakes
```
3. Click **Submit**
4. **Daily limit:** 10 URLs per day (submit in batches if needed)

### 4. Monitor Crawling

1. Go to **Site Explorer** → **Pages**
2. Check which pages are indexed
3. Typical indexing timeline: 1-2 weeks per page

---

## Quick Submission Checklist

After deploying new blog content:

### Immediate (Day 1)
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Request indexing for blog index page in Google
- [ ] Submit blog index URL to Bing

### Days 2-3
- [ ] Request indexing for high-priority articles in Google
- [ ] Submit high-priority articles to Bing (10 URL limit)

### Week 1
- [ ] Request indexing for remaining articles in Google
- [ ] Submit remaining articles to Bing

### Week 2-4
- [ ] Monitor indexing status in both consoles
- [ ] Fix any crawl errors
- [ ] Re-request indexing for failed pages

---

## Verify Indexing Worked

### Google

**Method 1: Site search**
```
site:freecalorietrack.com/blog
```
in Google search - should show all blog pages

**Method 2: Search Console**
- Go to **Pages** → **Indexed** to see all indexed URLs

### Bing

**Method 1: Site search**
```
site:freecalorietrack.com/blog
```
in Bing search

**Method 2: Bing Webmaster Tools**
- Go to **Site Explorer** → **Pages** to see indexed URLs

---

## Expected Timeline

| Search Engine | Action | Timeline |
|--------------|--------|----------|
| **Google** | Sitemap submitted | Crawl starts in 24-48 hours |
| | Manual URL request | Index in 1-7 days |
| | Full blog indexed | 1-2 weeks |
| | Rankings appear | 2-4 weeks |
| **Bing** | Sitemap submitted | Crawl starts in 48 hours |
| | Manual URL submission | Index in 1-2 weeks |
| | Full blog indexed | 2-4 weeks |
| | Rankings appear | 4-8 weeks |

---

## Social Media Debuggers

### Facebook Sharing Debugger

Test Open Graph tags for Facebook/LinkedIn sharing:

1. Go to [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter URL: `https://freecalorietrack.com/blog/what-are-calories`
3. Click **Debug**
4. Check preview shows:
   - Correct title
   - Correct description
   - Article image
5. Click **Scrape Again** to refresh cache
6. Repeat for each article you want to share

### Twitter Card Validator

Test Twitter Card tags:

1. Go to [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Enter URL: `https://freecalorietrack.com/blog/what-are-calories`
3. Click **Preview Card**
4. Verify card shows:
   - Correct title
   - Correct description
   - Article image
5. Repeat for important articles

---

## Common Issues & Fixes

### "Page not found" in Search Console

**Cause:** URL not yet crawled or 404 error

**Fix:**
- Verify URL loads in browser
- Check Vercel deployment succeeded
- Request indexing again in 24 hours

### "Crawled - currently not indexed"

**Cause:** Google crawled but deemed low quality or duplicate

**Fix:**
- Ensure content is unique (not copied from elsewhere)
- Add more valuable content (aim for 800+ words)
- Improve meta description to be more compelling
- Add internal links to other blog posts

### "Blocked by robots.txt"

**Cause:** robots.txt blocking search engines

**Fix:**
- Check `/public/robots.txt` doesn't block `/blog/*`
- Astro default allows all crawlers
- If blocked, update robots.txt and re-request indexing

### Sitemap errors

**Cause:** Sitemap URL incorrect or inaccessible

**Fix:**
- Verify sitemap loads: `https://freecalorietrack.com/sitemap-index.xml`
- Check Vercel build succeeded
- Re-submit sitemap URL

### Bing slow to index

**Cause:** Bing crawls slower than Google (normal)

**Solution:**
- Be patient (2-4 weeks typical)
- Submit URLs manually via URL Submission tool
- Ensure sitemap is submitted
- Build backlinks to blog (share on social media, etc.)

---

## Accelerate Indexing

### 1. Share on Social Media

Post new blog articles to:
- Twitter/X
- Facebook
- LinkedIn
- Reddit (relevant subreddits)

Social signals help search engines discover content faster.

### 2. Internal Linking

Link to blog posts from:
- Main app footer (already done via shared footer)
- Settings page
- Relevant sections in the app

### 3. Build Backlinks

- Guest post on fitness/nutrition sites
- Comment on relevant blogs (include blog link in author profile)
- Submit to fitness directories
- Share in fitness communities

### 4. Create More Content

- Publish 1-2 new blog posts per month
- More content = more crawling
- Regular updates signal active site to Google

---

## Monitor SEO Performance

### Google Search Console

**Check weekly:**
- **Performance** → Impressions, clicks, CTR, position
- **Pages** → Indexing status
- **Experience** → Core Web Vitals
- **Enhancements** → Structured data errors

### Bing Webmaster Tools

**Check weekly:**
- **Reports & Data** → Search Performance
- **Site Explorer** → Pages indexed
- **Crawl** → Crawl stats

### Analytics

Track in Google Analytics or similar:
- Organic traffic to `/blog/*`
- Top landing pages
- Bounce rate
- Time on page
- Conversions (visits to main app from blog)

---

## Quick Copy-Paste URLs

**For URL submission:**

```
https://freecalorietrack.com/blog/
https://freecalorietrack.com/blog/what-are-calories
https://freecalorietrack.com/blog/what-are-macros
https://freecalorietrack.com/blog/how-to-calculate-tdee
https://freecalorietrack.com/blog/macro-calculator-guide
https://freecalorietrack.com/blog/best-adjustable-dumbbells-beginners
https://freecalorietrack.com/blog/best-adjustable-dumbbells-advanced
https://freecalorietrack.com/blog/best-blenders-for-protein-shakes
```

---

## Summary

**After deploying the blog:**

1. ✅ Submit sitemap to Google Search Console
2. ✅ Submit sitemap to Bing Webmaster Tools
3. ✅ Request indexing for all blog URLs in Google (8 URLs)
4. ✅ Submit URLs to Bing (8 URLs, within daily limit)
5. ✅ Test social sharing with Facebook/Twitter debuggers
6. ✅ Monitor indexing status over next 2-4 weeks
7. ✅ Share blog posts on social media to accelerate discovery

**Expected results:** Full blog indexed within 1-4 weeks, traffic growth in 1-3 months.
