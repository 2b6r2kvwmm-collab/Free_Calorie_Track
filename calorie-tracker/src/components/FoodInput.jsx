import { useState } from 'react';
import { getFavorites, getRecentFoods, addFavorite, removeFavorite } from '../utils/storage';
import FoodSearch from './FoodSearch';
import BarcodeScanner from './BarcodeScanner';
import QuickAdd from './QuickAdd';
import CommonFoods from './CommonFoods';
import CustomFoodManager from './CustomFoodManager';
import MealTemplates from './MealTemplates';

export default function FoodInput({ onAddFood, onClose }) {
  const [mode, setMode] = useState('menu'); // menu, search, barcode, quick, favorites, recent, common, custom, templates
  const favorites = getFavorites();
  const recentFoods = getRecentFoods();

  const handleAddFood = (food) => {
    onAddFood(food);
    onClose();
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

  if (mode === 'templates') {
    return <MealTemplates onAddMeal={handleAddFood} onClose={() => setMode('menu')} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="card max-w-2xl w-full my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add Food</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {mode === 'menu' && (
          <div className="space-y-4">
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
              onClick={() => setMode('barcode')}
              className="btn-primary w-full text-left flex items-center justify-between"
            >
              <span>📷 Scan Barcode</span>
              <span className="text-sm opacity-75">Or Enter Manually</span>
            </button>

            <button
              onClick={() => setMode('quick')}
              className="btn-primary w-full text-left"
            >
              ⚡ Quick Add Calories
            </button>

            <button
              onClick={() => setMode('custom')}
              className="btn-secondary w-full text-left"
            >
              ✏️ Custom Foods
            </button>

            <button
              onClick={() => setMode('templates')}
              className="btn-secondary w-full text-left"
            >
              📋 Meal Templates
            </button>

            <button
              onClick={() => setMode('recent')}
              className="btn-secondary w-full text-left flex items-center justify-between"
            >
              <span>🕐 Recent Foods</span>
              {recentFoods.length > 0 && (
                <span className="bg-emerald-500 text-white text-sm px-2 py-1 rounded-full">
                  {recentFoods.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setMode('favorites')}
              className="btn-secondary w-full text-left flex items-center justify-between"
            >
              <span>⭐ Favorites</span>
              {favorites.length > 0 && (
                <span className="bg-yellow-500 text-white text-sm px-2 py-1 rounded-full">
                  {favorites.length}
                </span>
              )}
            </button>
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
      </div>
    </div>
  );
}
