import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../SEO';
import BlogLayout from './BlogLayout';
import { blogPosts } from './blogPosts';

export default function BlogHome() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const categories = ['All', 'Guides', 'Gear Reviews', 'Calculators'];

  // Update selected category if URL param changes
  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post =>
        Array.isArray(post.category)
          ? post.category.includes(selectedCategory)
          : post.category === selectedCategory
      );

  return (
    <BlogLayout>
      <SEO
        title="Blog - Guides, Calculators & Gear Reviews"
        description="Free guides on calorie tracking, macros, TDEE, and honest reviews of fitness gear including blenders and adjustable dumbbells."
        keywords={['calorie tracking guide', 'macro calculator', 'TDEE calculator', 'fitness gear reviews', 'adjustable dumbbells review', 'blender review']}
        url="/blog"
        type="website"
      />
      {/* Categories */}
      <div className="mb-8 flex flex-wrap gap-3" role="group" aria-label="Filter articles by category">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            aria-pressed={selectedCategory === category}
            aria-label={`Filter by ${category}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {filteredPosts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            aria-label={`Read article: ${post.title}`}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="aspect-video bg-gradient-to-br from-emerald-400 to-emerald-600 relative overflow-hidden" aria-hidden="true">
              {post.image ? (
                <img
                  src={`/images/blog/${post.image}`}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`absolute inset-0 flex items-center justify-center ${post.image ? 'hidden' : ''}`}>
                <span className="text-6xl">{post.emoji}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  {Array.isArray(post.category) ? post.category[0] : post.category}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{post.readTime} min read</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                {post.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed"
                 style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </BlogLayout>
  );
}
