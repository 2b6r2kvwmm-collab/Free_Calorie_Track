import { useState } from 'react';

export default function PortionSelector({ food, onConfirm, onCancel }) {
  const [servings, setServings] = useState('1');

  const multiplier = parseFloat(servings) || 0;
  const adjustedCalories = Math.round(food.calories * multiplier);
  const adjustedProtein = Math.round((food.protein || 0) * multiplier * 10) / 10;
  const adjustedCarbs = Math.round((food.carbs || 0) * multiplier * 10) / 10;
  const adjustedFat = Math.round((food.fat || 0) * multiplier * 10) / 10;

  const handleConfirm = () => {
    if (multiplier <= 0) return;

    onConfirm({
      ...food,
      calories: adjustedCalories,
      protein: adjustedProtein,
      carbs: adjustedCarbs,
      fat: adjustedFat,
      servingSize: multiplier === 1
        ? food.servingSize
        : `${multiplier}x ${food.servingSize}`,
    });
  };

  // Quick multiplier buttons
  const quickOptions = [0.5, 1, 1.5, 2, 2.5, 3];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Select Portion Size</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
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

        {/* Servings Input */}
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
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-emerald-500'
              }`}
            >
              {option}x
            </button>
          ))}
        </div>

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
              {multiplier}x {food.servingSize}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
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
      </div>
    </div>
  );
}
