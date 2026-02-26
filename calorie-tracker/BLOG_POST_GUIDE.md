# How to Add a New Blog Post

Complete step-by-step guide to add a new blog article to Free Calorie Track.

---

## 📋 Checklist Overview

- [ ] Create hero image (1600x900px WebP)
- [ ] Add article metadata to `blogPosts.js`
- [ ] Create article component file
- [ ] Add article to sitemap.xml
- [ ] Test locally
- [ ] Commit and push
- [ ] Request indexing in Google Search Console

---

## Step 1: Prepare Your Hero Image

### Image Specifications
- **Dimensions:** 1600 x 900 pixels (16:9 aspect ratio)
- **Format:** WebP
- **File size:** Under 200KB (recommended)
- **Quality:** 75-85 in compression tool

### Tools to Create/Convert
- **Squoosh.app** (https://squoosh.app) - Online, free
- **GIMP** - Free desktop app
- **Canva** - For designing images from scratch

### Naming Convention
Use lowercase, hyphens, descriptive names:
- ✅ `best-meal-prep-containers.webp`
- ✅ `protein-powder-guide.webp`
- ✅ `how-to-count-calories.webp`
- ❌ `IMG_1234.webp`
- ❌ `My Article.webp`

### Save Location
```
public/images/blog/your-image-name.webp
```

---

## Step 2: Add Article Metadata

**File:** `src/components/blog/blogPosts.js`

Add your article to the array:

```javascript
{
  slug: 'your-article-slug',  // URL: /blog/your-article-slug
  title: 'Your Article Title',  // Shows in blog list
  excerpt: 'Short description (1-2 sentences) that appears on blog home.',
  category: 'Guides',  // Options: 'Guides', 'Gear Reviews', 'Calculators', or ['Guides', 'Calculators']
  readTime: 5,  // Estimated minutes to read
  emoji: '📊',  // Fallback if image fails to load
  image: 'your-image-name.webp',  // Just filename, not full path
  date: '2026-02-26',  // YYYY-MM-DD format
  keywords: ['keyword1', 'keyword2', 'keyword3', 'keyword4'],  // For SEO
},
```

### Category Options
- **Single category:** `category: 'Guides'`
- **Multiple categories:** `category: ['Guides', 'Calculators']`
- **Valid categories:** `'Guides'`, `'Gear Reviews'`, `'Calculators'`

### Example Entry
```javascript
{
  slug: 'best-meal-prep-containers',
  title: 'Best Meal Prep Containers for Calorie Counting',
  excerpt: 'The best meal prep containers with portion markings to make calorie counting easier.',
  category: 'Gear Reviews',
  readTime: 6,
  emoji: '🍱',
  image: 'best-meal-prep-containers.webp',
  date: '2026-03-01',
  keywords: ['meal prep containers', 'calorie counting containers', 'portion control containers', 'best meal prep'],
},
```

---

## Step 3: Create Article Component

### File Location
```
src/components/blog/articles/YourArticleName.jsx
```

**Naming:** Use PascalCase (capitalize each word, no spaces)
- ✅ `MealPrepContainersArticle.jsx`
- ✅ `ProteinPowderGuide.jsx`
- ❌ `meal-prep-article.jsx`
- ❌ `article.jsx`

### Article Template

Use this exact template and fill in your content:

```jsx
import BlogLayout from '../BlogLayout';
import SEO from '../../SEO';
import { Link } from 'react-router-dom';

export default function YourArticleNameArticle() {
  return (
    <BlogLayout>
      <SEO
        title="Your Article Title (55-60 chars max)"
        description="Your meta description for search results (150-160 chars max)"
        keywords={['keyword1', 'keyword2', 'keyword3', 'keyword4']}
        url="/blog/your-article-slug"
        image="https://freecalorietrack.com/images/blog/your-image-name.webp"
      />

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <Link to="/blog" className="hover:text-emerald-600 dark:hover:text-emerald-400">Blog</Link>
        {' > '}
        <span>Guides</span>  {/* Change to: Guides, Gear Reviews, or Calculators */}
      </div>

      {/* Hero Image */}
      <div className="w-full aspect-video rounded-xl overflow-hidden mb-8 shadow-lg">
        <img
          src="/images/blog/your-image-name.webp"
          alt="Descriptive alt text for image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Header */}
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          Your Article Title
        </h1>

        {/* TL;DR Section */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 p-6 my-8 rounded-r-lg">
          <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mt-0 mb-3">
            💡 TL;DR
          </h3>
          <ul className="mb-0 list-disc ml-6 space-y-2 text-gray-800 dark:text-gray-200">
            <li>Key takeaway point 1</li>
            <li>Key takeaway point 2</li>
            <li>Key takeaway point 3</li>
            <li>Key takeaway point 4</li>
          </ul>
        </div>

        {/* Article Content */}
        <h2 className="text-2xl font-bold mt-8 mb-4">First Section Heading</h2>
        <p>
          Your paragraph content here. You can use <Link to="/blog/other-article" className="text-emerald-600 dark:text-emerald-400 hover:underline">internal links</Link> to other articles.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Subsection Heading</h3>
        <p>
          More content here.
        </p>

        <ul className="list-disc ml-6 space-y-2 my-6">
          <li>Bullet point 1</li>
          <li>Bullet point 2</li>
          <li>Bullet point 3</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Second Section Heading</h2>
        <p>
          More content here.
        </p>

        {/* Call to Action - Track with App */}
        <h2 className="text-2xl font-bold mt-8 mb-4">Track Your Progress with Free Calorie Track</h2>
        <p>
          Free Calorie Track makes it easy to track your calories and macros.
        </p>

        <ul className="list-disc ml-6 space-y-2 my-6">
          <li>✅ Barcode scanning for easy food logging</li>
          <li>✅ Macro tracking for protein, carbs, and fat</li>
          <li>✅ Exercise logging and net calorie calculation</li>
          <li>✅ 100% free forever, no paywalls</li>
        </ul>

        <div className="text-center my-8">
          <Link
            to="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Start Tracking Free
          </Link>
        </div>

        {/* Related Posts */}
        <div className="border-t border-gray-300 dark:border-gray-700 pt-8 mt-12">
          <h3 className="text-xl font-bold mb-4">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/blog/related-article-1"
              className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-2xl mb-2">🔥</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Related Article Title 1
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Short description of related article
              </p>
            </Link>
            <Link
              to="/blog/related-article-2"
              className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Related Article Title 2
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Short description of related article
              </p>
            </Link>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
```

### For Gear Review Articles (With Affiliate Links)

Add these sections **before** the hero image:

```jsx
{/* Affiliate Disclosure */}
<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 text-sm text-gray-700 dark:text-gray-300">
  <strong>Affiliate Disclosure:</strong> This post contains affiliate links. If you purchase through these links, Free Calorie Track may earn a small commission at no extra cost to you. I only recommend products I genuinely use and love.
</div>

{/* Hero Image */}
<div className="w-full aspect-video rounded-xl overflow-hidden mb-2 shadow-lg">
  <img
    src="/images/blog/your-product-image.webp"
    alt="Product name"
    className="w-full h-full object-cover"
  />
</div>

{/* AI Image Disclosure (if product images are AI-generated) */}
<p className="text-xs text-gray-500 dark:text-gray-500 italic mb-8 text-center">
  Product images were staged using AI for visual presentation purposes.
</p>
```

**For Amazon affiliate links:**
```jsx
<a href="https://amzn.to/YOURCODE" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">Product Name</a>
```

---

## Step 4: Register Route in App.jsx

**File:** `src/App.jsx`

Find the blog routes section and add your route:

```jsx
<Route path="/blog/your-article-slug" element={<YourArticleNameArticle />} />
```

**Import at the top:**
```jsx
import YourArticleNameArticle from './components/blog/articles/YourArticleNameArticle';
```

**Example:**
```jsx
// At top of file
import MealPrepContainersArticle from './components/blog/articles/MealPrepContainersArticle';

// In routes
<Route path="/blog/best-meal-prep-containers" element={<MealPrepContainersArticle />} />
```

---

## Step 5: Update Sitemap

**File:** `public/sitemap.xml`

Add your article URL before the closing `</urlset>` tag:

```xml
<url>
  <loc>https://freecalorietrack.com/blog/your-article-slug</loc>
  <priority>0.8</priority>
  <changefreq>monthly</changefreq>
</url>
```

**Priority guide:**
- Homepage: `1.0`
- Blog home: `0.9`
- Guides/Calculators: `0.8`
- Gear Reviews: `0.7`

**Example:**
```xml
<url>
  <loc>https://freecalorietrack.com/blog/best-meal-prep-containers</loc>
  <priority>0.7</priority>
  <changefreq>monthly</changefreq>
</url>
```

---

## Step 6: Test Locally

```bash
npm run dev
```

Visit: http://localhost:5173/blog

**Check:**
- [ ] Article appears in blog list
- [ ] Clicking article loads correctly
- [ ] Hero image displays
- [ ] TL;DR section shows
- [ ] All links work
- [ ] Related articles load
- [ ] Mobile view looks good

**Test specific article:**
http://localhost:5173/blog/your-article-slug

**Verify SEO tags:**
- Right-click → Inspect → Elements tab
- Look in `<head>` for tags with `data-rh="true"`
- Should see your title, description, keywords

---

## Step 7: Commit and Deploy

```bash
# Stage all changes
git add public/images/blog/your-image-name.webp
git add src/components/blog/blogPosts.js
git add src/components/blog/articles/YourArticleNameArticle.jsx
git add src/App.jsx
git add public/sitemap.xml

# Commit
git commit -m "Add blog article: Your Article Title

- Add hero image (your-image-name.webp)
- Add article component with SEO metadata
- Update sitemap and blog post list
- Add route to App.jsx

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

# Push to deploy
git push
```

---

## Step 8: Post-Deployment

### Verify Live Site (wait 1-2 min for deploy)
- Visit: https://freecalorietrack.com/blog
- Article should appear in list
- Click article to verify it loads

### Request Google Indexing
1. Go to https://search.google.com/search-console
2. Select your property
3. **URL Inspection** → Enter: `https://freecalorietrack.com/blog/your-article-slug`
4. Click **Request Indexing**

### Test Social Sharing (Optional)
1. Go to https://www.opengraph.xyz/
2. Enter your article URL
3. Check preview (will show homepage image/tagline - this is expected)

---

## 📝 Quick Reference: File Checklist

For every new blog post, you need to modify these **5 files:**

1. ✅ `public/images/blog/your-image.webp` - Hero image
2. ✅ `src/components/blog/blogPosts.js` - Article metadata
3. ✅ `src/components/blog/articles/YourArticle.jsx` - Article content
4. ✅ `src/App.jsx` - Route registration
5. ✅ `public/sitemap.xml` - SEO sitemap

---

## 🎨 Content Style Guide

### Writing Tips
- Use short paragraphs (2-4 sentences max)
- Break up text with headings every 2-3 paragraphs
- Use bullet points for lists
- Include TL;DR at top for busy readers
- Link to related articles internally
- End with call-to-action to use the app

### Heading Hierarchy
- **H1:** Article title (only one per article)
- **H2:** Main sections
- **H3:** Subsections
- Don't skip levels (no H1 → H3)

### Images
- Hero image required at top
- Optional: Add inline images in article body
- All images need descriptive alt text

### Links
- **Internal links:** Use `<Link to="/blog/slug">` (fast navigation)
- **External links:** Use `<a href="..." target="_blank" rel="noopener noreferrer">`
- Affiliate links: Add Amazon affiliate tag

---

## 🚨 Common Mistakes to Avoid

❌ **Forgetting to update sitemap.xml**
- Search engines won't discover your article

❌ **Not adding route to App.jsx**
- Article will 404 when visited directly

❌ **Using spaces in slug or image filename**
- Use hyphens: `best-meal-prep` not `best meal prep`

❌ **Wrong image dimensions**
- Must be 1600x900 or will look stretched/cropped

❌ **Forgetting SEO component**
- Article won't have proper meta tags for search engines

❌ **Not testing locally first**
- Push broken code → site breaks in production

---

## 💡 Pro Tips

### Repurpose Content
- Turn long articles into multiple shorter ones
- Create "ultimate guide" by combining related articles
- Update old articles with new info (better than creating duplicate)

### Internal Linking Strategy
- Link to 2-3 related articles at bottom
- Link to main app features in content
- Link to calculators when relevant

### Keyword Research
- Use Google Autocomplete (type keyword, see suggestions)
- Check "People also ask" section on Google
- Look at competitor articles for keyword ideas

### Update Existing Posts
To update an existing article:
1. Edit the `.jsx` file in `src/components/blog/articles/`
2. Update the `date` in `blogPosts.js`
3. Commit with message: `"Update: Article Title - describe changes"`
4. Push to deploy

---

## 📞 Need Help?

If you get stuck:
1. Check existing articles in `src/components/blog/articles/` for examples
2. Copy an existing article and modify it
3. Verify all 5 files are updated
4. Test locally before pushing

Common issues:
- **404 on article:** Did you add route to App.jsx?
- **Image not showing:** Check filename matches exactly in component
- **Not in blog list:** Did you add to blogPosts.js?
- **SEO not working:** Did you add `<SEO>` component?
