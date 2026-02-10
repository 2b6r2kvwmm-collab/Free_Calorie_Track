import { useState, useEffect } from 'react';
import {
  supportsToppings, sandwichToppings,
  supportsPastaToppings, pastaToppings,
  supportsPizzaToppings, pizzaToppings,
  supportsSaladToppings, saladToppings,
  supportsSmoothieToppings, smoothieToppings,
  supportsBowlToppings, bowlToppings,
  supportsOatmealToppings, oatmealToppings,
  supportsTacoToppings, tacoToppings,
  supportsStirFryToppings, stirFryToppings
} from '../utils/commonFoods';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

export default function PortionSelector({ food, onConfirm, onCancel }) {
  const modalRef = useModalAccessibility(true, onCancel);
  const [servings, setServings] = useState('1');
  // selectedToppings: array of { topping, multiplier }
  const [selectedToppings, setSelectedToppings] = useState([]);

  // Lock body scroll when modal opens
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Detect which topping system applies
  const hasSandwichToppings = supportsToppings(food.name);
  const hasPastaToppings = supportsPastaToppings(food.name);
  const hasPizzaToppings = supportsPizzaToppings(food.name);
  const hasSaladToppings = supportsSaladToppings(food.name);
  const hasSmoothieToppings = supportsSmoothieToppings(food.name);
  const hasBowlToppings = supportsBowlToppings(food.name);
  const hasOatmealToppings = supportsOatmealToppings(food.name);
  const hasTacoToppings = supportsTacoToppings(food.name);
  const hasStirFryToppings = supportsStirFryToppings(food.name);

  const hasToppings = hasSandwichToppings || hasPastaToppings || hasPizzaToppings ||
                      hasSaladToppings || hasSmoothieToppings || hasBowlToppings ||
                      hasOatmealToppings || hasTacoToppings || hasStirFryToppings;

  // Detect if this is a "build your own" item
  const isBuildYourOwn = food.name.includes('build your own');

  // Detect if this is a pizza item
  const isPizza = hasPizzaToppings || food.name.toLowerCase().includes('pizza') || food.servingSize.toLowerCase().includes('slice');

  // Select the appropriate toppings array and type
  let toppingsArray = [];
  let toppingType = '';

  if (hasPastaToppings) {
    toppingsArray = pastaToppings;
    toppingType = 'pasta';
  } else if (hasSandwichToppings) {
    toppingsArray = sandwichToppings;
    toppingType = 'sandwich';
  } else if (hasPizzaToppings) {
    toppingsArray = pizzaToppings;
    toppingType = 'pizza';
  } else if (hasSaladToppings) {
    toppingsArray = saladToppings;
    toppingType = 'salad';
  } else if (hasSmoothieToppings) {
    toppingsArray = smoothieToppings;
    toppingType = 'smoothie';
  } else if (hasBowlToppings) {
    toppingsArray = bowlToppings;
    toppingType = 'bowl';
  } else if (hasOatmealToppings) {
    toppingsArray = oatmealToppings;
    toppingType = 'oatmeal';
  } else if (hasTacoToppings) {
    toppingsArray = tacoToppings;
    toppingType = 'taco';
  } else if (hasStirFryToppings) {
    toppingsArray = stirFryToppings;
    toppingType = 'stirfry';
  }

  // Calculate base multiplier
  const multiplier = parseFloat(servings) || 0;

  // Calculate totals including toppings with their multipliers
  const toppingsTotal = selectedToppings.reduce(
    (totals, item) => ({
      calories: totals.calories + (item.topping.calories * item.multiplier),
      protein: totals.protein + (item.topping.protein * item.multiplier),
      carbs: totals.carbs + (item.topping.carbs * item.multiplier),
      fat: totals.fat + (item.topping.fat * item.multiplier),
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
    // For build-your-own (except pizza), allow confirmation even with multiplier 0 if toppings selected
    if (!isBuildYourOwn && multiplier <= 0) return;
    if (isBuildYourOwn && !isPizza && selectedToppings.length === 0) return;
    if (isBuildYourOwn && isPizza && (multiplier <= 0 || selectedToppings.length === 0)) return;

    let name = food.name;
    if (selectedToppings.length > 0) {
      const toppingNames = selectedToppings.map((item) => {
        const multiplierText = item.multiplier !== 1 ? ` (${item.multiplier}x)` : '';
        return item.topping.name + multiplierText;
      }).join(', ');

      if (isBuildYourOwn) {
        // Extract header from food name (e.g., "Salad (build your own)" -> "Salad:")
        const headerMatch = food.name.match(/^([^(]+)/);
        let header = headerMatch ? headerMatch[1].trim() : '';

        // For pizza, include slice count in header
        if (isPizza && multiplier > 0) {
          const sliceText = multiplier === 1 ? '1 slice' : `${multiplier} slices`;
          header = `${header} (${sliceText})`;
        }

        name = header + ': ' + toppingNames;
      } else {
        name = `${food.name} + ${toppingNames}`;
      }
    }

    // Determine serving size display
    let servingSizeDisplay;
    if (isBuildYourOwn && !isPizza) {
      servingSizeDisplay = 'custom';
    } else if (isPizza && Number.isInteger(multiplier)) {
      // For pizza, show as "2 slices" instead of "2x 1 slice base"
      servingSizeDisplay = multiplier === 1 ? '1 slice' : `${multiplier} slices`;
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
      const exists = prev.find((item) => item.topping.name === topping.name);
      if (exists) {
        return prev.filter((item) => item.topping.name !== topping.name);
      } else {
        return [...prev, { topping, multiplier: 1 }];
      }
    });
  };

  const updateToppingMultiplier = (toppingName, multiplier) => {
    setSelectedToppings((prev) =>
      prev.map((item) =>
        item.topping.name === toppingName
          ? { ...item, multiplier: parseFloat(multiplier) || 0 }
          : item
      )
    );
  };

  // Quick multiplier buttons
  const quickOptions = [0.5, 1, 1.5, 2, 2.5, 3];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto" role="dialog" aria-modal="true" ref={modalRef}>
      <div className="card max-w-md w-full my-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {isBuildYourOwn ? food.name : 'Select Portion Size'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
            aria-label="Close portion selector"
          >
            ×
          </button>
        </div>

        {/* Food Info */}
        {!isBuildYourOwn && (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-lg mb-2">{food.name}</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Base serving: {food.servingSize}
            </div>
          </div>
        )}

        {/* Servings Input - show for non-build-your-own items AND pizza build-your-own */}
        {(!isBuildYourOwn || isPizza) && (
          <>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-3">
                {isPizza ? 'Number of Slices' : 'Number of Servings'}
              </label>
              <input
                type="number"
                min={isPizza ? "1" : "0.1"}
                step={isPizza ? "1" : "0.1"}
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="input-field text-center text-2xl"
                autoFocus={!hasToppings}
              />
            </div>

            {/* Quick Options */}
            <div className="grid grid-cols-6 gap-2 mb-6">
              {(isPizza ? [1, 2, 3, 4, 5, 6] : quickOptions).map((option) => (
                <button
                  key={option}
                  onClick={() => setServings(option.toString())}
                  className={`py-2 px-3 rounded-lg font-semibold border-2 transition-colors ${
                    parseFloat(servings) === option
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-emerald-500'
                  }`}
                >
                  {isPizza ? `${option}` : `${option}x`}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Preview */}
        {(multiplier > 0 || selectedToppings.length > 0) && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              You're adding:
            </div>
            <div className="font-bold text-2xl mb-2">{adjustedCalories} calories</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              P: {adjustedProtein}g • C: {adjustedCarbs}g • F: {adjustedFat}g
            </div>
            {(!isBuildYourOwn || isPizza) && (
              <div className="text-xs text-gray-500 mt-2">
                {isPizza && Number.isInteger(multiplier)
                  ? (multiplier === 1 ? '1 slice' : `${multiplier} slices`)
                  : `${multiplier}x ${food.servingSize}`
                }
              </div>
            )}
          </div>
        )}

        {/* Toppings Selection */}
        {hasToppings && (
          <div className={!isBuildYourOwn ? "border-t border-gray-300 dark:border-gray-600 pt-6" : ""}>
            <h3 className="font-semibold text-lg mb-3">
              {toppingType === 'pasta' && (isBuildYourOwn ? 'Build Your Pasta' : 'Add Sauce & Toppings (Optional)')}
              {toppingType === 'sandwich' && (isBuildYourOwn ? 'Build Your Sandwich' : 'Add Toppings (Optional)')}
              {toppingType === 'pizza' && (isBuildYourOwn ? 'Build Your Pizza' : 'Add Toppings (Optional)')}
              {toppingType === 'salad' && (isBuildYourOwn ? 'Build Your Salad' : 'Add Toppings (Optional)')}
              {toppingType === 'smoothie' && (isBuildYourOwn ? 'Build Your Smoothie' : 'Add Toppings (Optional)')}
              {toppingType === 'bowl' && (isBuildYourOwn ? 'Build Your Bowl' : 'Add Toppings (Optional)')}
              {toppingType === 'oatmeal' && (isBuildYourOwn ? 'Build Your Oatmeal' : 'Add Toppings (Optional)')}
              {toppingType === 'taco' && (isBuildYourOwn ? 'Build Your Taco/Burrito' : 'Add Toppings (Optional)')}
              {toppingType === 'stirfry' && (isBuildYourOwn ? 'Build Your Stir-Fry' : 'Add Toppings (Optional)')}
            </h3>

            {/* Get unique categories from toppings array */}
            {(() => {
              const categories = [...new Set(toppingsArray.map(t => t.category))];

              return categories.map((category) => {
                const categoryToppings = toppingsArray.filter(
                  (t) => t.category === category
                );
                if (categoryToppings.length === 0) return null;

                // Define category labels for all types
                const categoryLabels = {
                  // Common categories
                  protein: 'Protein',
                  cheese: 'Cheese',
                  vegetable: 'Vegetables',
                  sauce: 'Sauces',
                  topping: 'Toppings',
                  // Smoothie/Bowl specific
                  liquid: 'Liquid Base',
                  fruit: 'Fruits',
                  green: 'Greens',
                  superfood: 'Superfoods',
                  nuts: 'Nuts & Seeds',
                  sweetener: 'Sweeteners',
                  // Bowl specific
                  base: 'Base',
                  grain: 'Grains',
                  // Salad specific
                  dressing: 'Dressings',
                  // Taco specific
                  shell: 'Shell',
                  beans: 'Beans',
                  rice: 'Rice',
                  salsa: 'Salsa & Sauces',
                  dairy: 'Dairy',
                };

                const categoryLabel = categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1);

                return (
                  <div key={category} className="mb-4">
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      {categoryLabel}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {categoryToppings.map((topping) => {
                        const selectedItem = selectedToppings.find(
                          (item) => item.topping.name === topping.name
                        );
                        const isSelected = !!selectedItem;
                        return (
                          <div key={topping.name} className="flex flex-col gap-1">
                            <button
                              onClick={() => toggleTopping(topping)}
                              className={`py-2 px-3 rounded-lg text-sm border-2 transition-colors text-left ${
                                isSelected
                                  ? 'bg-emerald-600 text-white border-emerald-500'
                                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-emerald-500'
                              }`}
                            >
                              <div className="font-semibold">{topping.name}</div>
                              <div className="text-xs opacity-80">
                                {topping.calories} cal
                              </div>
                            </button>
                            {isSelected && (
                              <input
                                type="number"
                                min="0.1"
                                step="0.1"
                                value={selectedItem.multiplier}
                                onChange={(e) => updateToppingMultiplier(topping.name, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="input-field text-center text-sm py-1"
                                placeholder="Qty"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}

            {/* Actions for build-your-own items (shown in toppings section) */}
            {isBuildYourOwn && !isPizza && (
              <div className="flex gap-3 mt-6">
                <button onClick={onCancel} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="btn-primary flex-1"
                  disabled={selectedToppings.length === 0}
                >
                  Add to Log
                </button>
              </div>
            )}
          </div>
        )}

        {/* Actions for regular items and pizza build-your-own */}
        {(!isBuildYourOwn || isPizza) && (
          <div className="flex gap-3 mb-6">
            <button onClick={onCancel} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="btn-primary flex-1"
              disabled={isPizza && isBuildYourOwn
                ? (multiplier <= 0 || selectedToppings.length === 0)
                : multiplier <= 0}
            >
              Add to Log
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
