import { useState, useEffect, useRef, useMemo } from 'react';
import { searchCommonFoods, getCategories } from '../utils/commonFoods';
import { getFavorites, addFavorite, removeFavorite } from '../utils/storage';
import PortionSelector from './PortionSelector';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

export default function CommonFoods({ onAddFood, onClose }) {
  const modalRef = useModalAccessibility(true, onClose);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFood, setSelectedFood] = useState(null);
  const [favorites, setFavorites] = useState(getFavorites());
  const scrollRef = useRef(null);

  // Lock body scroll when modal opens
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Scroll to top when search or category changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [searchQuery, selectedCategory]);

  const categories = ['All', ...getCategories()];

  // Memoize search results to prevent re-filtering on every render
  const allFoods = useMemo(() => {
    return searchCommonFoods(searchQuery);
  }, [searchQuery]);

  // Filter by category if not "All"
  const filteredFoods = selectedCategory === 'All'
    ? allFoods
    : allFoods.filter(food => food.category === selectedCategory);

  const handleFoodClick = (food) => {
    setSelectedFood(food);
  };

  const handlePortionConfirm = (adjustedFood) => {
    onAddFood(adjustedFood);
    setSelectedFood(null);
  };

  const handlePortionCancel = () => {
    setSelectedFood(null);
  };

  const toggleFavorite = (food, e) => {
    e.stopPropagation(); // Prevent triggering parent click
    const isFav = favorites.some(f => f.name === food.name && f.calories === food.calories);

    if (isFav) {
      removeFavorite(food);
    } else {
      addFavorite(food);
    }

    setFavorites(getFavorites()); // Refresh favorites list
  };

  const isFavoriteFood = (food) => {
    return favorites.some(f => f.name === food.name && f.calories === food.calories);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto" role="dialog" aria-modal="true" ref={modalRef}>
      <div className="card max-w-2xl w-full my-8 max-h-[calc(100vh-4rem)] overflow-y-auto" ref={scrollRef}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Common Foods</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
            aria-label="Close common foods"
          >
            ×
          </button>
        </div>

        {/* Search */}
        <label htmlFor="common-foods-search" className="sr-only">Search common foods</label>
        <input
          id="common-foods-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search foods..."
          className="input-field mb-4"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck="false"
        />

        {/* Category Filter */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Foods List */}
        {filteredFoods.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg">No foods found</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFoods.map((food, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-emerald-500 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{food.name}</h3>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {food.category}
                      </span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <div className="font-semibold text-lg">{food.calories} cal</div>
                      <div className="text-sm">
                        P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                      </div>
                      <div className="text-xs">{food.servingSize}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => toggleFavorite(food, e)}
                      className="text-2xl hover:scale-110 transition-transform"
                      title={isFavoriteFood(food) ? "Remove from favorites" : "Add to favorites"}
                      aria-label={isFavoriteFood(food) ? "Remove from favorites" : "Add to favorites"}
                    >
                      {isFavoriteFood(food) ? '⭐' : '☆'}
                    </button>
                    <button
                      onClick={() => handleFoodClick(food)}
                      className="btn-primary whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredFoods.length} food{filteredFoods.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Portion Selector Modal */}
      {selectedFood && (
        <PortionSelector
          food={selectedFood}
          onConfirm={handlePortionConfirm}
          onCancel={handlePortionCancel}
        />
      )}
    </div>
  );
}
