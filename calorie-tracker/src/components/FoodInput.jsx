import { useState, useEffect, useRef } from 'react';
import { getFavorites, getRecentFoods, addFavorite, removeFavorite, copyYesterdaysMeals, getMealTypeEnabled, saveMealTypeEnabled } from '../utils/storage';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import FoodSearch from './FoodSearch';
import BarcodeScanner from './BarcodeScanner';
import QuickAdd from './QuickAdd';
import CommonFoods from './CommonFoods';
import CustomFoodManager from './CustomFoodManager';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export default function FoodInput({ onAddFood, onClose, onRefresh }) {
  const [mode, setMode] = useState('menu'); // menu, search, barcode, quick, favorites, recent, common, custom
  const [selectedMealType, setSelectedMealType] = useState(null); // null = Unspecified
  const [pendingFood, setPendingFood] = useState(null); // Food waiting for meal type selection
  const [copyMessage, setCopyMessage] = useState('');
  const favorites = getFavorites();
  const recentFoods = getRecentFoods();
  const modalRef = useModalAccessibility(true, onClose);

  // Lock body scroll when modal opens
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Scroll to top when mode changes
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [mode]);

  const mealTypeEnabled = getMealTypeEnabled();

  const handleAddFood = (food) => {
    if (!mealTypeEnabled) {
      onAddFood({ ...food, mealType: 'Unspecified' });
      onClose();
      return;
    }
    setPendingFood(food);
    setMode('menu'); // ensure meal selector overlay renders from any sub-menu
  };

  const confirmAddFood = (mealType) => {
    if (pendingFood) {
      onAddFood({ ...pendingFood, mealType: mealType || 'Unspecified' });
      setPendingFood(null);
      onClose();
    }
  };

  const skipMealType = () => {
    if (pendingFood) {
      onAddFood({ ...pendingFood, mealType: 'Unspecified' });
      setPendingFood(null);
      onClose();
    }
  };

  const toggleFavorite = (food, isFavorite) => {
    if (isFavorite) {
      removeFavorite(food);
    } else {
      addFavorite(food);
    }
    // Force re-render
    setMode(mode);
  };

  const handleCopyYesterday = () => {
    const result = copyYesterdaysMeals();
    setCopyMessage(result.message);
    if (result.success && onRefresh) {
      onRefresh();
    }
    // Clear message after 3 seconds
    setTimeout(() => setCopyMessage(''), 3000);
  };

  if (mode === 'search') {
    return <FoodSearch onAddFood={handleAddFood} onClose={() => setMode('menu')} />;
  }

  if (mode === 'barcode') {
    return <BarcodeScanner onAddFood={handleAddFood} onClose={() => setMode('menu')} />;
  }

  if (mode === 'quick') {
    return <QuickAdd onAddFood={handleAddFood} onClose={() => setMode('menu')} />;
  }

  if (mode === 'common') {
    return <CommonFoods onAddFood={handleAddFood} onClose={() => setMode('menu')} />;
  }

  if (mode === 'custom') {
    return <CustomFoodManager onAddFood={handleAddFood} onClose={() => setMode('menu')} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto" role="dialog" aria-modal="true" ref={modalRef}>
      <div className="card max-w-2xl w-full my-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add Food</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
            aria-label="Close add food dialog"
          >
            ×
          </button>
        </div>

        {mode === 'menu' && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('barcode')}
              className="btn-primary w-full text-left"
            >
              📷 Scan Barcode
            </button>

            <button
              onClick={() => setMode('common')}
              className="btn-primary w-full text-left flex items-center justify-between"
            >
              <span>🥗 Common Foods</span>
              <span className="text-sm opacity-75">Ingredients & Meals</span>
            </button>

            <button
              onClick={() => setMode('search')}
              className="btn-primary w-full text-left flex items-center justify-between"
            >
              <span>🔍 Search Food Database</span>
              <span className="text-sm opacity-75">Branded Products</span>
            </button>

            <button
              onClick={() => setMode('favorites')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors w-full text-left flex items-center justify-between"
            >
              <span>⭐ Favorites</span>
              {favorites.length > 0 && (
                <span className="bg-yellow-500 text-white text-sm px-2 py-1 rounded-full">
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setMode('quick')}
              className="bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors w-full text-left"
            >
              ⚡ Quick Add Calories
            </button>

            <button
              onClick={() => setMode('custom')}
              className="btn-secondary w-full text-left"
            >
              ✏️ Recipes & Custom Foods
            </button>

            <button
              onClick={() => setMode('recent')}
              className="btn-secondary w-full text-left flex items-center justify-between"
            >
              <span>🕐 Recent Foods</span>
              {recentFoods.length > 0 && (
                <span className="bg-emerald-600 text-white text-sm px-2 py-1 rounded-full">
                  {recentFoods.length}
                </span>
              )}
            </button>

            <button
              onClick={handleCopyYesterday}
              className="btn-secondary w-full text-left"
            >
              📋 Copy Yesterday's Meals
            </button>

            {/* Copy Message */}
            {copyMessage && (
              <div className={`p-3 rounded-lg text-center font-semibold ${
                copyMessage.includes('No meals')
                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                  : 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
              }`}>
                {copyMessage}
              </div>
            )}
          </div>
        )}

        {mode === 'favorites' && (
          <div>
            <button
              onClick={() => setMode('menu')}
              className="text-emerald-600 dark:text-emerald-400 mb-4 text-lg font-semibold"
            >
              ← Back
            </button>

            {favorites.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-lg">No favorites yet</div>
                <div className="text-sm mt-2">Add foods to your favorites from search results</div>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((food, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{food.name}</h3>
                        <div className="text-gray-600 dark:text-gray-400 mt-1">
                          <span className="font-semibold text-lg">{food.calories} cal</span>
                          {food.servingSize && (
                            <span className="text-sm"> • {food.servingSize}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleFavorite(food, true)}
                          className="text-2xl"
                          aria-label="Remove from favorites"
                        >
                          ⭐
                        </button>
                        <button
                          onClick={() => handleAddFood(food)}
                          className="btn-primary"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {mode === 'recent' && (
          <div>
            <button
              onClick={() => setMode('menu')}
              className="text-emerald-600 dark:text-emerald-400 mb-4 text-lg font-semibold"
            >
              ← Back
            </button>

            {recentFoods.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-lg">No recent foods</div>
                <div className="text-sm mt-2">Foods you log will appear here</div>
              </div>
            ) : (
              <div className="space-y-3">
                {recentFoods.map((food, index) => {
                  const isFavorite = favorites.some(
                    f => f.name === food.name && f.calories === food.calories
                  );

                  return (
                    <div
                      key={index}
                      className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{food.name}</h3>
                          <div className="text-gray-600 dark:text-gray-400 mt-1">
                            <span className="font-semibold text-lg">{food.calories} cal</span>
                            {food.servingSize && (
                              <span className="text-sm"> • {food.servingSize}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleFavorite(food, isFavorite)}
                            className="text-2xl"
                            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            {isFavorite ? '⭐' : '☆'}
                          </button>
                          <button
                            onClick={() => handleAddFood(food)}
                            className="btn-primary"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Meal Type Selector Overlay */}
        {pendingFood && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-60">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl">
              <h3 className="text-lg font-bold mb-2">Add to which meal?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {pendingFood.name} - {pendingFood.calories} cal
              </p>

              <div className="space-y-2 mb-4">
                {MEAL_TYPES.map((mealType) => (
                  <button
                    key={mealType}
                    onClick={() => confirmAddFood(mealType)}
                    className="w-full py-3 px-4 text-left font-semibold rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    {mealType}
                  </button>
                ))}
              </div>

              <button
                onClick={skipMealType}
                className="w-full py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm"
              >
                Skip (don't categorize)
              </button>

              <button
                onClick={() => {
                  saveMealTypeEnabled(false);
                  skipMealType();
                }}
                className="w-full pt-3 mt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                Turn off meal categories
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
