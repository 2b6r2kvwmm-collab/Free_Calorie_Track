import { useState, useEffect, useRef } from 'react';
import { searchFoods } from '../utils/foodApi';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { lockScroll, unlockScroll } from '../utils/scrollLock';

// Rate limit tracking (1000 searches per hour for USDA API)
// Note: Uses dual-API approach (USDA primary, Open Food Facts fallback)
const RATE_LIMIT = 1000;
const RATE_WINDOW = 3600000; // 60 minutes

export default function FoodSearch({ onAddFood, onClose }) {
  const modalRef = useModalAccessibility(true, onClose);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [rateLimitRemaining, setRateLimitRemaining] = useState(RATE_LIMIT);
  const [rateLimitResetTime, setRateLimitResetTime] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const scrollRef = useRef(null);
  const abortControllerRef = useRef(null);
  const searchTimestampsRef = useRef([]);

  // Lock body scroll when modal opens
  useEffect(() => {
    lockScroll();
    return () => {
      unlockScroll();
    };
  }, []);

  // Scroll to top when results change
  useEffect(() => {
    if (scrollRef.current && searched) {
      scrollRef.current.scrollTop = 0;
    }
  }, [results, searched]);

  // Cleanup: abort search on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Countdown timer for rate limit reset
  useEffect(() => {
    if (!rateLimitResetTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeLeft = Math.max(0, Math.ceil((rateLimitResetTime - now) / 1000));
      setCountdown(timeLeft);

      if (timeLeft === 0) {
        // Reset rate limit
        searchTimestampsRef.current = [];
        setRateLimitRemaining(RATE_LIMIT);
        setRateLimitResetTime(null);
        setCountdown(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [rateLimitResetTime]);

  // Update rate limit status
  const updateRateLimit = () => {
    const now = Date.now();

    // Remove timestamps older than 1 minute
    searchTimestampsRef.current = searchTimestampsRef.current.filter(
      timestamp => now - timestamp < RATE_WINDOW
    );

    // Add current timestamp
    searchTimestampsRef.current.push(now);

    // Calculate remaining searches
    const remaining = RATE_LIMIT - searchTimestampsRef.current.length;
    setRateLimitRemaining(remaining);

    // If at limit, set reset time
    if (remaining === 0) {
      const oldestTimestamp = searchTimestampsRef.current[0];
      setRateLimitResetTime(oldestTimestamp + RATE_WINDOW);
    }

    return remaining > 0;
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      setError(null);
      return;
    }

    // Check rate limit before searching
    const canSearch = updateRateLimit();
    if (!canSearch) {
      setError(`Hold on! You've made 1000 searches this hour. The app will automatically use Open Food Facts as a backup, but please wait ${Math.floor(countdown / 60)}m ${countdown % 60}s for USDA to reset for best results.`);
      return;
    }

    // Cancel previous search if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setSearched(true);
    setError(null);

    try {
      const foods = await searchFoods(query.trim(), abortControllerRef.current.signal);
      setResults(foods);
      setError(null);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Search failed:', error.message);
        setResults([]);

        // Check error type and show appropriate message
        const isApiKeyError = error.message && error.message.includes('API key');
        const isRateLimit = error.message && (error.message.includes('429') || error.message.includes('Rate limit'));
        const isBothApiFailed = error.message && error.message.includes('Both APIs failed');
        const isNetworkError = (error.message && (
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.message.includes('Load failed')
        )) || error.name === 'TypeError';

        if (isApiKeyError) {
          setError('USDA API key limit reached. The app will fall back to Open Food Facts, but for best results get a free API key at https://fdc.nal.usda.gov/api-key-signup and add it to your .env file as VITE_USDA_API_KEY.');
        } else if (isRateLimit) {
          setError('USDA API rate limit reached (1000 requests/hour). The app will fall back to Open Food Facts for now. Or use Common Foods (1,400+ items), Barcode Scanner, or Quick Add.');
        } else if (isBothApiFailed) {
          setError('Both food databases (USDA and Open Food Facts) are currently experiencing issues. This is unusual and usually temporary. Please try again in a few minutes, or use Common Foods (1,400+ items), Barcode Scanner, or Quick Add.');
        } else if (isNetworkError) {
          setError('Food databases are currently unavailable. This could be due to network issues. Please check your connection and try again, or use Common Foods (1,400+ items), Barcode Scanner, or Quick Add.');
        } else {
          setError('Search failed. Please try again, or use Common Foods (1,400+ items), Barcode Scanner, or Quick Add instead.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = (food) => {
    onAddFood({
      name: food.brand ? `${food.brand} - ${food.name}` : food.name,
      calories: food.calories,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
      fiber: food.fiber || 0,
      sodium: food.sodium || 0,
      sugar: food.sugar || 0,
      saturatedFat: food.saturatedFat || 0,
      servingSize: food.servingSize,
      barcode: food.barcode,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto" role="dialog" aria-modal="true" ref={modalRef}>
      <div className="card max-w-2xl w-full my-8 max-h-[calc(100vh-4rem)] overflow-y-auto" ref={scrollRef}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Search Foods</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
            aria-label="Close food search"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3">
            <label htmlFor="food-search-input" className="sr-only">Search for food in database</label>
            <input
              id="food-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for food..."
              className="input-field flex-1"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
            />
            <button type="submit" className="btn-primary" disabled={loading || rateLimitRemaining === 0}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Rate limit status */}
          {rateLimitRemaining === 0 && (
            <div className="mt-2 text-sm text-orange-600 dark:text-orange-400 font-semibold">
              <span>🍕 Rate limit reached! Back in {Math.floor(countdown / 60)}m {countdown % 60}s</span>
            </div>
          )}
          {rateLimitRemaining > 0 && rateLimitRemaining <= 10 && (
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{rateLimitRemaining} searches remaining this hour</span>
            </div>
          )}
        </form>

        {loading && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg">Searching...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6">
              <div className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">⚠️ Service Unavailable</div>
              <div className="text-sm text-red-600 dark:text-red-300">{error}</div>
            </div>
          </div>
        )}

        {!loading && !error && searched && results.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg">No foods found. Try a different search.</div>
          </div>
        )}

        <div className="space-y-3">
          {results.map((food, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-emerald-500 transition-colors"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {food.brand && <span className="text-emerald-600 dark:text-emerald-400">{food.brand} - </span>}
                    {food.name}
                  </h3>
                  <div className="text-gray-600 dark:text-gray-400 mt-1">
                    <div className="font-semibold text-lg">{food.calories} cal</div>
                    <div className="text-sm">
                      P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                    </div>
                    <div className="text-xs">{food.servingSize}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleAddFood(food)}
                  className="btn-primary whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
