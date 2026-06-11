# How to Add a New Blog Post

> **⚠️ This guide is obsolete.** The blog was migrated from React JSX components to the
> **Astro static site** in `/blog-astro`. The old `src/components/blog/` directory has been deleted.
>
> **Use these instead:**
> - `/blog-astro/BLOG_POST_GUIDE.md` — full writing/formatting guide
> - `/blog-astro/BLOG_POST_CHECKLIST.md` — pre/post-publish checklist (sitemap, llms.txt, schema)
>
> Quick summary of the current workflow:
> 1. Add a markdown/MDX file to `/blog-astro/src/content/blog/your-slug.md`
> 2. Add the post to `/calorie-tracker/public/sitemap.xml` (with `<lastmod>`)
> 3. Add the post link to `/calorie-tracker/public/llms.txt`
> 4. Build with `./build-all.sh` from the repo root (Vercel runs this automatically on deploy)
