# Blog Post Quick Checklist

Use this for quick reference when adding a new blog post. See `BLOG_POST_GUIDE.md` for detailed instructions.

---

## ☑️ Before You Start

- [ ] Article topic chosen
- [ ] Keywords researched
- [ ] Hero image created (1600x900px WebP, <200KB)

---

## ☑️ Files to Create/Modify

### 1. Add Hero Image
```
public/images/blog/your-image-name.webp
```

### 2. Add to Blog List
**File:** `src/components/blog/blogPosts.js`
```javascript
{
  slug: 'your-article-slug',
  title: 'Your Article Title',
  excerpt: 'Short description.',
  category: 'Guides',
  readTime: 5,
  emoji: '📊',
  image: 'your-image-name.webp',
  date: '2026-02-26',
  keywords: ['keyword1', 'keyword2'],
},
```

### 3. Create Article Component
**File:** `src/components/blog/articles/YourArticleNameArticle.jsx`
- Copy template from BLOG_POST_GUIDE.md
- Update SEO component
- Update breadcrumb category
- Update hero image path
- Write content
- Add related articles

### 4. Add Route
**File:** `src/App.jsx`

Import:
```javascript
import YourArticleNameArticle from './components/blog/articles/YourArticleNameArticle';
```

Route:
```javascript
<Route path="/blog/your-article-slug" element={<YourArticleNameArticle />} />
```

### 5. Update Sitemap
**File:** `public/sitemap.xml`
```xml
<url>
  <loc>https://freecalorietrack.com/blog/your-article-slug</loc>
  <priority>0.8</priority>
  <changefreq>monthly</changefreq>
</url>
```

---

## ☑️ Testing

- [ ] `npm run dev` - Start local server
- [ ] Visit http://localhost:5173/blog
- [ ] Article appears in blog list
- [ ] Click article - loads correctly
- [ ] Hero image displays
- [ ] All sections visible
- [ ] Links work
- [ ] Mobile view looks good
- [ ] Inspect → Elements → Check `<head>` for SEO tags

---

## ☑️ Deploy

```bash
git add public/images/blog/your-image.webp
git add src/components/blog/blogPosts.js
git add src/components/blog/articles/YourArticle.jsx
git add src/App.jsx
git add public/sitemap.xml

git commit -m "Add blog article: Your Title"
git push
```

---

## ☑️ Post-Deploy

- [ ] Wait 1-2 minutes for Vercel deploy
- [ ] Visit https://freecalorietrack.com/blog
- [ ] Verify article appears and loads
- [ ] Google Search Console → URL Inspection → Request indexing
- [ ] (Optional) Test social sharing preview

---

## 📐 Specifications

- **Image:** 1600x900px, WebP, <200KB
- **Slug:** lowercase-with-hyphens
- **Categories:** `'Guides'`, `'Gear Reviews'`, `'Calculators'`, or `['Multiple', 'Categories']`
- **Sitemap priority:** Guides/Calculators: 0.8, Gear Reviews: 0.7
- **SEO title:** 55-60 characters max
- **SEO description:** 150-160 characters max

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Article returns 404 | Add route to `App.jsx` |
| Image not showing | Check filename matches exactly |
| Not in blog list | Add to `blogPosts.js` |
| No SEO tags | Add `<SEO>` component to article |
| Build fails | Check for syntax errors, missing imports |
