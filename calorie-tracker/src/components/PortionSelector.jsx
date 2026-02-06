import { useState, useEffect } from 'react';
import { supportsToppings, sandwichToppings, supportsPastaToppings, pastaToppings } from '../utils/commonFoods';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

export default function PortionSelector({ food, onConfirm, onCancel }) {
  const modalRef = useModalAccessibility(true, onCancel);
  const [inputMode, setInputMode] = useState('servings'); // 'servings' or 'weight'
  const [servings, setServings] = useState('1');
  const [exactWeight, setExactWeight] = useState('');
  const [selectedToppings, setSelectedToppings] = useState([]);

  // Lock body scroll when modal opens
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const hasSandwichToppings = supportsToppings(food.name);
  const hasPastaToppings = supportsPastaToppings(food.name);
  const hasToppings = hasSandwichToppings || hasPastaToppings;

  // Select the appropriate toppings array
  const toppingsArray = hasPastaToppings ? pastaToppings : sandwichToppings;

  // Parse base serving size to extract weight if possible
  const baseServingWeight = (() => {
    const match = food.servingSize.match(/(\d+\.?\d*)\s*g/i);
    return match ? parseFloat(match[1]) : null;
  })();

  // Calculate multiplier based on input mode
  const multiplier = (() => {
    if (inputMode === 'servings') {
      return parseFloat(servings) || 0;
    } else if (inputMode === 'weight' && baseServingWeight) {
      const weight = parseFloat(exactWeight) || 0;
      return weight / baseServingWeight;
    }
    return 0;
  })();

  // Calculate totals including toppings
  const toppingsTotal = selectedToppings.reduce(
    (totals, topping) => ({
      calories: totals.calories + topping.calories,
      protein: totals.protein + topping.protein,
      carbs: totals.carbs + topping.carbs,
      fat: totals.fat + topping.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const baseCalories = food.calories * multiplier;
  const baseProtein = (food.protein || 0) * multiplier;
  const baseCarbs = (food.carbs || 0) * multiplier;
  const baseFat = (food.fat || 0) * multiplier;

  const adjustedCalories = Math.round(baseCalories + toppingsTotal.calories);
  const adjustedProtein = Math.round((baseProtein + toppingsTotal.protein) * 10) / 10;
  const adjustedCarbs = Math.round((baseCarbs + toppingsTotal.carbs) * 10) / 10;
  const adjustedFat = Math.round((baseFat + toppingsTotal.fat) * 10) / 10;

  const handleConfirm = () => {
    if (multiplier <= 0) return;

    let name = food.name;
    if (selectedToppings.length > 0) {
      const toppingNames = selectedToppings.map((t) => t.name).join(', ');
      name = `${food.name} + ${toppingNames}`;
    }

    // Determine serving size display
    let servingSizeDisplay;
    if (inputMode === 'weight' && exactWeight) {
      servingSizeDisplay = `${exactWeight}g`;
    } else if (multiplier === 1) {
      servingSizeDisplay = food.servingSize;
    } else {
      servingSizeDisplay = `${multiplier}x ${food.servingSize}`;
    }

    onConfirm({
      ...food,
      name,
      calories: adjustedCalories,
      protein: adjustedProtein,
      carbs: adjustedCarbs,
      fat: adjustedFat,
      servingSize: servingSizeDisplay,
    });
  };

  const toggleTopping = (topping) => {
    setSelectedToppings((prev) => {
      const exists = prev.find((t) => t.name === topping.name);
      if (exists) {
        return prev.filter((t) => t.name !== topping.name);
      } else {
        return [...prev, topping];
      }
    });
  };

  // Quick multiplier buttons
  const quickOptions = [0.5, 1, 1.5, 2, 2.5, 3];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto" role="dialog" aria-modal="true" ref={modalRef}>
      <div className="card max-w-md w-full my-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Select Portion Size</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
            aria-label="Close portion selector"
          >
            ×
          </button>
        </div>

        {/* Food Info */}
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-lg mb-2">{food.name}</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Base serving: {food.servingSize}
          </div>
        </div>

        {/* Input Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setInputMode('servings')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold border-2 transition-colors ${
              inputMode === 'servings'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-emerald-500'
            }`}
          >
            Servings
          </button>
          <button
            onClick={() => setInputMode('weight')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold border-2 transition-colors ${
              inputMode === 'weight'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-emerald-500'
            }`}
            disabled={!baseServingWeight}
          >
            Exact Weight
          </button>
        </div>

        {/* Servings Input */}
        {inputMode === 'servings' && (
          <>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-3">
                Number of Servings
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="input-field text-center text-2xl"
                autoFocus
              />
            </div>

            {/* Quick Options */}
            <div className="grid grid-cols-6 gap-2 mb-6">
              {quickOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setServings(option.toString())}
                  className={`py-2 px-3 rounded-lg font-semibold border-2 transition-colors ${
                    parseFloat(servings) === option
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-emerald-500'
                  }`}
                >
                  {option}x
                </button>
              ))}
            </div>
          </>
        )}

        {/* Exact Weight Input */}
        {inputMode === 'weight' && (
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-3">
              Weight in Grams
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={exactWeight}
              onChange={(e) => setExactWeight(e.target.value)}
              placeholder="Enter weight in grams"
              className="input-field text-center text-2xl"
              autoFocus
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Base: {baseServingWeight}g = {food.calories} cal
            </div>
          </div>
        )}

        {/* Preview */}
        {multiplier > 0 && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              You're adding:
            </div>
            <div className="font-bold text-2xl mb-2">{adjustedCalories} calories</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              P: {adjustedProtein}g • C: {adjustedCarbs}g • F: {adjustedFat}g
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {inputMode === 'weight' && exactWeight
                ? `${exactWeight}g`
                : `${multiplier}x ${food.servingSize}`}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <button onClick={onCancel} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="btn-primary flex-1"
            disabled={multiplier <= 0}
          >
            Add to Log
          </button>
        </div>

        {/* Toppings Selection */}
        {hasToppings && (
          <div className="border-t border-gray-300 dark:border-gray-600 pt-6">
            <h3 className="font-semibold text-lg mb-3">
              {hasPastaToppings ? 'Add Sauce & Toppings (Optional)' : 'Add Toppings (Optional)'}
            </h3>

            {/* Group by category */}
            {['sauce', 'cheese', 'protein', 'vegetable'].map((category) => {
              const categoryToppings = toppingsArray.filter(
                (t) => t.category === category
              );
              if (categoryToppings.length === 0) return null;

              const categoryLabel = {
                protein: hasPastaToppings ? 'Protein' : 'Extra Protein',
                cheese: 'Cheese',
                vegetable: hasPastaToppings ? 'Vegetables' : 'Veggies',
                sauce: 'Sauces',
              }[category];

              return (
                <div key={category} className="mb-4">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 capitalize">
                    {categoryLabel}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryToppings.map((topping) => {
                      const isSelected = selectedToppings.find(
                        (t) => t.name === topping.name
                      );
                      return (
                        <button
                          key={topping.name}
                          onClick={() => toggleTopping(topping)}
                          className={`py-2 px-3 rounded-lg text-sm border-2 transition-colors text-left ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-emerald-500'
                          }`}
                        >
                          <div className="font-semibold">{topping.name}</div>
                          <div className="text-xs opacity-80">
                            +{topping.calories} cal
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
