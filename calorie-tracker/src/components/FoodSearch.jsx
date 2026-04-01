import { useState, useEffect, useRef } from 'react';
import { searchFoods } from '../utils/openfoodfacts';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { lockScroll, unlockScroll } from '../utils/scrollLock';

// Rate limit tracking (10 searches per minute per Open Food Facts API)
const RATE_LIMIT = 10;
const RATE_WINDOW = 60000; // 60 seconds

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
      setError(`Hold on! The food database (not us!) limits searches to 10 per minute to keep their servers happy. Please wait ${countdown} seconds, then search again.`);
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
        console.error('Search failed:', error);
        console.error('Error message:', error.message);
        console.error('Error name:', error.name);
        setResults([]);

        // Check error type and show appropriate message
        const is403 = error.message && error.message.includes('403');
        const is503 = error.message && error.message.includes('503');
        const isNetworkError = error.message && (
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.message.includes('Load failed') ||
          error.name === 'TypeError'
        );

        if (is403) {
          setError('Food database rate limit reached. Your searches may be temporarily restricted. Please wait a few minutes and try again, or use Common Foods (1,400+ items), Barcode Scanner, or Quick Add.');
        } else if (is503) {
          setError('Food database is currently down (503). Please use Common Foods (1,400+ items), Barcode Scanner, or Quick Add. We apologize for the inconvenience.');
        } else if (isNetworkError) {
          setError('Food database is currently unavailable. We\'re working on resolving this issue. In the meantime, please use Common Foods (1,400+ items), Barcode Scanner, or Quick Add. We apologize for the inconvenience.');
        } else {
          setError('Search failed. We\'re working on resolving this issue. In the meantime, please use Common Foods (1,400+ items), Barcode Scanner, or Quick Add instead.');
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
              <span>🍕 Food database is on a snack break! Back in {countdown}s</span>
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
