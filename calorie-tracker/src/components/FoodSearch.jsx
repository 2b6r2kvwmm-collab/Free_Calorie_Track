import { useState, useEffect, useRef } from 'react';
import { searchFoods } from '../utils/openfoodfacts';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { lockScroll, unlockScroll } from '../utils/scrollLock';
import { useDebounce } from '../hooks/useDebounce';

export default function FoodSearch({ onAddFood, onClose }) {
  const modalRef = useModalAccessibility(true, onClose);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const scrollRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Debounce query to reduce INP during typing
  const debouncedQuery = useDebounce(query, 300);

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

  // Auto-search when debounced query changes (improves UX and reduces INP)
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    // Cancel previous search if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const performSearch = async () => {
      abortControllerRef.current = new AbortController();
      setLoading(true);
      setSearched(true);

      try {
        const foods = await searchFoods(debouncedQuery, abortControllerRef.current.signal);
        setResults(foods);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Search failed:', error);
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    };

    performSearch();

    // Cleanup: abort on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search now handled by useEffect with debounced query
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
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg">Searching...</div>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
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
