# SEO Setup & Optimization Guide

## ✅ What's Already Configured

### 1. Sitemap (sitemap.xml)
- **Location:** `public/sitemap.xml`
- **Status:** ✅ Updated with all blog pages
- **Includes:**
  - Homepage
  - Blog home (/blog)
  - All 7 blog articles with proper priorities

### 2. Robots.txt
- **Location:** `public/robots.txt`
- **Status:** ✅ Properly configured
- **Content:** Allows all crawlers, points to sitemap

### 3. Dynamic Meta Tags (react-helmet-async)
- **Package:** Installed (`react-helmet-async`)
- **Component:** `src/components/SEO.jsx`
- **Status:** ✅ Implemented on all blog pages
- **Includes:**
  - Title tags (unique per page)
  - Meta descriptions
  - Keywords
  - Open Graph tags (Facebook)
  - Twitter Cards
  - Canonical URLs
  - Article metadata

### 4. Image Optimization
- **Format:** WebP (modern, compressed)
- **Size:** 1600x900px (16:9 aspect ratio)
- **Alt text:** ✅ Present on all images
- **Location:** `public/images/blog/`

### 5. Internal Linking
- **Breadcrumbs:** ✅ Present on all blog articles
- **Related articles:** ✅ Present at bottom of articles
- **Cross-linking:** ✅ Links between related content

### 6. Content Security Policy (CSP)
- **Location:** `vercel.json`
- **Status:** ✅ Hardened (no unsafe-inline)

---

## 📋 Additional Steps for Production

### 1. Submit Sitemap to Search Engines

**Google Search Console:**
1. Go to https://search.google.com/search-console
2. Add property: `freecalorietrack.com`
3. Verify ownership (DNS or HTML file)
4. Submit sitemap: `https://freecalorietrack.com/sitemap.xml`
5. Request indexing for key pages

**Bing Webmaster Tools:**
1. Go to https://www.bing.com/webmasters
2. Add site: `freecalorietrack.com`
3. Submit sitemap: `https://freecalorietrack.com/sitemap.xml`

### 2. Create og-image.png (Social Sharing Image)

**Required:**
- **Dimensions:** 1200x630px (Facebook/Twitter recommended)
- **Location:** `public/og-image.png`
- **Content:** App logo + tagline ("Free Calorie Track - No Paywalls, No Ads")
- **Format:** PNG or JPG

**Current:** The SEO component references this image, but it doesn't exist yet.

**Action:** Create this image and place in `public/og-image.png`

### 3. Verify Deployment

After deploying, verify:
1. `https://freecalorietrack.com/sitemap.xml` loads
2. `https://freecalorietrack.com/robots.txt` loads
3. Each blog page has unique `<title>` in browser tab
4. View page source - meta tags are visible (not just in React)

### 4. Schema.org Structured Data (Optional but Recommended)

Add JSON-LD structured data to blog articles for rich snippets:

**For Articles:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Article description",
  "image": "https://freecalorietrack.com/images/blog/image.webp",
  "author": {
    "@type": "Person",
    "name": "FCT Staff"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Free Calorie Track",
    "logo": {
      "@type": "ImageObject",
      "url": "https://freecalorietrack.com/logo.png"
    }
  },
  "datePublished": "2026-02-25"
}
```

**For Product Reviews:**
```json
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Product",
    "name": "NutriBullet Pro 900"
  },
  "author": {
    "@type": "Person",
    "name": "FCT Staff"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "4.5",
    "bestRating": "5"
  }
}
```

I can add this if you want - it helps with Google rich results (star ratings in search).

---

## 🎯 SEO Best Practices (Already Implemented)

✅ **Mobile-friendly:** Responsive design
✅ **Fast loading:** Optimized images, minimal JS
✅ **HTTPS:** Required for Vercel deployment
✅ **Unique titles:** Every page has unique title
✅ **Meta descriptions:** All pages have descriptions
✅ **Heading hierarchy:** Proper H1, H2, H3 structure
✅ **Alt text:** All images have descriptive alt text
✅ **Internal links:** Cross-linking between articles
✅ **External links:** Marked with rel="noopener noreferrer"
✅ **Canonical URLs:** Prevent duplicate content issues

---

## 🔍 Testing Tools

### Before Launch:
1. **Lighthouse (Chrome DevTools):** Run audit (Performance, SEO, Accessibility)
2. **PageSpeed Insights:** https://pagespeed.web.dev/
3. **Mobile-Friendly Test:** https://search.google.com/test/mobile-friendly

### After Launch:
1. **Google Search Console:** Monitor indexing, errors, search performance
2. **Bing Webmaster Tools:** Monitor Bing indexing
3. **Rich Results Test:** https://search.google.com/test/rich-results (for structured data)

---

## 📊 Expected SEO Timeline

- **Week 1-2:** Google starts crawling, indexing homepage
- **Week 2-4:** Blog pages get indexed
- **Month 2-3:** Pages start appearing in search results
- **Month 3-6:** Ranking improves for long-tail keywords
- **Month 6+:** Competitive rankings for target keywords

---

## 🚀 Next Steps Summary

### Immediately (Before Deploy):
1. ✅ Sitemap updated
2. ✅ Meta tags on all pages
3. ✅ Images optimized
4. ❌ Create `public/og-image.png` (1200x630px social share image)

### After Deploy:
1. Submit sitemap to Google Search Console
2. Submit sitemap to Bing Webmaster Tools
3. Run Lighthouse audit
4. Verify robots.txt and sitemap are accessible

### Optional (Improves SEO):
1. Add JSON-LD structured data for articles
2. Add JSON-LD structured data for product reviews
3. Get backlinks from fitness/nutrition sites
4. Share articles on social media for engagement signals

---

## 📝 How to Update SEO for New Articles

When adding new blog articles:

1. **Add to sitemap.xml:**
   ```xml
   <url>
     <loc>https://freecalorietrack.com/blog/your-article-slug</loc>
     <priority>0.8</priority>
     <changefreq>monthly</changefreq>
   </url>
   ```

2. **Add SEO component in article:**
   ```jsx
   <SEO
     title="Your Article Title"
     description="Your meta description (150-160 chars)"
     keywords={['keyword1', 'keyword2', 'keyword3']}
     url="/blog/your-article-slug"
     image="https://freecalorietrack.com/images/blog/your-image.webp"
   />
   ```

3. **Update blogPosts.js** with article metadata

That's it! The rest is handled automatically.
