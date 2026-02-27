import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function BlogLayout({ children }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700" role="banner">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link to="/" className="inline-block mb-2 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400" aria-label="Return to Free Calorie Track app">
            ← Back to App
          </Link>
          <Link to="/blog">
            <div className="text-3xl font-bold"
                style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '-0.02em' }}>
              <span className="text-emerald-600 dark:text-emerald-400">Free Calorie Track</span>
              <span className="text-gray-600 dark:text-gray-400"> Blog</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1"
               style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              Calorie tracking tips, gear reviews, and guides
            </p>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8" role="main">
        {children}
      </main>

      {/* Footer CTA */}
      <footer className="bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-100 dark:border-emerald-800 py-12" role="contentinfo">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            Ready to Start Tracking?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6"
             style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            Free Calorie Track includes barcode scanning, macro tracking, trends, and offline mode—all free forever.
          </p>
          <Link
            to="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Get Started Free
          </Link>
        </div>
      </footer>
    </div>
  );
}
