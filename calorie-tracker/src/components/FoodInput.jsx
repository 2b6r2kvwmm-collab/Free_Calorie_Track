import { useState, useEffect, useRef } from 'react';
import { getFavorites, getRecentFoods, addFavorite, removeFavorite, copyYesterdaysMeals, getMealTypeEnabled, saveMealTypeEnabled, getAITermsAccepted, setAITermsAccepted, getAILogsToday, AI_DAILY_LIMIT } from '../utils/storage';
import { useNavigate } from 'react-router-dom';
import { ScanBarcode, Salad, Search, Star, Clock, ChefHat, Sparkles, Zap, ClipboardCopy } from 'lucide-react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { lockScroll, unlockScroll } from '../utils/scrollLock';
import FoodSearch from './FoodSearch';
import BarcodeScanner from './BarcodeScanner';
import QuickAdd from './QuickAdd';
import CommonFoods from './CommonFoods';
import CustomFoodManager from './CustomFoodManager';
import AIFoodLogger from './AIFoodLogger';
import AIOnboardingModal from './AIOnboardingModal';

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
    lockScroll();
    return () => {
      unlockScroll();
    };
  }, []);

  // Scroll to top when mode changes
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [mode]);

  const navigate = useNavigate();
  const mealTypeEnabled = getMealTypeEnabled();
  const [showAIOnboarding, setShowAIOnboarding] = useState(false);
  const aiLogsToday = getAILogsToday();
  const aiAtLimit = aiLogsToday >= AI_DAILY_LIMIT;

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

  if (mode === 'ai') {
    return (
      <AIFoodLogger
        onLog={(entry) => onAddFood({ ...entry, mealType: 'Unspecified' })}
        onClose={() => { onClose(); navigate('/'); }}
        onLogged={() => navigate('/ai-food-logged')}
      />
    );
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
          <div className="space-y-2">
            {[
              { icon: <ScanBarcode size={18} />, label: 'Scan Barcode', sub: 'Any product', onClick: () => setMode('barcode') },
              { icon: <Salad size={18} />, label: 'Common Foods', sub: 'Ingredients & meals', onClick: () => setMode('common') },
              { icon: <Search size={18} />, label: 'Search Food Database', sub: 'Branded products', onClick: () => setMode('search') },
            ].map(({ icon, label, sub, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <span className="flex-shrink-0 opacity-90">{icon}</span>
                <span className="font-semibold text-sm flex-1">{label}</span>
                {sub && <span className="text-xs opacity-70">{sub}</span>}
              </button>
            ))}

            {/* AI logging */}
            <button
              onClick={() => {
                if (!getAITermsAccepted()) { setShowAIOnboarding(true); return; }
                if (aiAtLimit) { setCopyMessage(`You've used all ${AI_DAILY_LIMIT} AI logs for today — resets at midnight.`); setTimeout(() => setCopyMessage(''), 4000); return; }
                setMode('ai'); window.history.pushState(null, '', '/ai-log');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors bg-purple-600 hover:bg-purple-700 text-white"
            >
              <span className="flex-shrink-0 opacity-90"><Sparkles size={18} /></span>
              <span className="flex-1">
                <span className="font-semibold text-sm block">{aiAtLimit ? 'AI limit reached' : 'Log with AI'}</span>
                <span className="text-xs text-purple-200">
                  {getAITermsAccepted()
                    ? aiAtLimit ? 'Resets at midnight' : `${aiLogsToday} / ${AI_DAILY_LIMIT} used today`
                    : 'Photo, description, or recipe'}
                </span>
              </span>
              <span className="text-xs bg-purple-500/50 px-2 py-0.5 rounded-full">Beta</span>
            </button>

            {[
              { icon: <Star size={18} />, label: 'Favorites', badge: favorites.length || null, onClick: () => setMode('favorites') },
              { icon: <Clock size={18} />, label: 'Recent Foods', badge: recentFoods.length || null, onClick: () => setMode('recent') },
              { icon: <ChefHat size={18} />, label: 'Recipes & Custom Foods', onClick: () => setMode('custom') },
              { icon: <Zap size={18} />, label: 'Quick Add Calories', onClick: () => setMode('quick') },
              { icon: <ClipboardCopy size={18} />, label: "Copy Yesterday's Meals", onClick: handleCopyYesterday },
            ].map(({ icon, label, badge, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
              >
                <span className="flex-shrink-0 opacity-75">{icon}</span>
                <span className="font-semibold text-sm flex-1">{label}</span>
                {badge > 0 && <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>}
              </button>
            ))}

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
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{food.name}</h3>
                        <div className="text-gray-600 dark:text-gray-400 mt-1">
                          <span className="font-semibold text-lg">{food.calories} cal</span>
                          {food.servingSize && (
                            <span className="text-sm"> • {food.servingSize}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 sm:flex-shrink-0">
                        <button
                          onClick={() => toggleFavorite(food, true)}
                          className="text-2xl"
                          aria-label="Remove from favorites"
                        >
                          ⭐
                        </button>
                        <button
                          onClick={() => handleAddFood(food)}
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
                      className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg">{food.name}</h3>
                          <div className="text-gray-600 dark:text-gray-400 mt-1">
                            <span className="font-semibold text-lg">{food.calories} cal</span>
                            {food.servingSize && (
                              <span className="text-sm"> • {food.servingSize}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 sm:flex-shrink-0">
                          <button
                            onClick={() => toggleFavorite(food, isFavorite)}
                            className="text-2xl"
                            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            {isFavorite ? '⭐' : '☆'}
                          </button>
                          <button
                            onClick={() => handleAddFood(food)}
                            className="btn-primary whitespace-nowrap"
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

        {/* AI Onboarding Modal — shown once before first AI log */}
        {showAIOnboarding && (
          <AIOnboardingModal
            onAccept={() => {
              setAITermsAccepted();
              setShowAIOnboarding(false);
              setMode('ai');
              window.history.pushState(null, '', '/ai-log');
            }}
            onClose={() => setShowAIOnboarding(false)}
          />
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
