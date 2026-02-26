import { useState } from 'react';

export default function MacroCalculator() {
  const [calories, setCalories] = useState('');
  const [goal, setGoal] = useState('balanced');
  const [result, setResult] = useState(null);

  const macroRatios = {
    balanced: { protein: 30, carbs: 40, fat: 30, label: 'Balanced' },
    highProtein: { protein: 40, carbs: 30, fat: 30, label: 'High Protein' },
    lowCarb: { protein: 35, carbs: 20, fat: 45, label: 'Low Carb' },
    lowFat: { protein: 30, carbs: 50, fat: 20, label: 'Low Fat' },
    keto: { protein: 25, carbs: 5, fat: 70, label: 'Keto' },
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    const totalCalories = parseFloat(calories);
    const ratios = macroRatios[goal];

    // Calculate grams (protein/carbs = 4 cal/g, fat = 9 cal/g)
    const proteinGrams = Math.round((totalCalories * (ratios.protein / 100)) / 4);
    const carbsGrams = Math.round((totalCalories * (ratios.carbs / 100)) / 4);
    const fatGrams = Math.round((totalCalories * (ratios.fat / 100)) / 9);

    setResult({
      protein: { grams: proteinGrams, percentage: ratios.protein },
      carbs: { grams: carbsGrams, percentage: ratios.carbs },
      fat: { grams: fatGrams, percentage: ratios.fat },
      label: ratios.label,
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 my-8 border-2 border-emerald-200 dark:border-emerald-800">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        🧮 Macro Calculator
      </h3>

      <form onSubmit={handleCalculate} className="space-y-4">
        {/* Daily Calorie Goal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Daily Calorie Goal
          </label>
          <input
            type="number"
            required
            min="500"
            max="6000"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="2000"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Use your TDEE from above or your custom calorie goal
          </p>
        </div>

        {/* Macro Split */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Macro Split
          </label>
          <div className="space-y-2">
            {Object.entries(macroRatios).map(([key, value]) => (
              <label
                key={key}
                className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  goal === key
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="goal"
                    value={key}
                    checked={goal === key}
                    onChange={(e) => setGoal(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {value.label}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      P: {value.protein}% · C: {value.carbs}% · F: {value.fat}%
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calculate Macros
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
          <div className="mb-4">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Your {result.label} Macro Targets
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Based on {calories} calories per day
            </p>
          </div>

          <div className="space-y-3">
            {/* Protein */}
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Protein
                </span>
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  {result.protein.percentage}%
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {result.protein.grams}g
              </div>
            </div>

            {/* Carbs */}
            <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                  Carbohydrates
                </span>
                <span className="text-xs text-orange-600 dark:text-orange-400">
                  {result.carbs.percentage}%
                </span>
              </div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {result.carbs.grams}g
              </div>
            </div>

            {/* Fat */}
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                  Fat
                </span>
                <span className="text-xs text-purple-600 dark:text-purple-400">
                  {result.fat.percentage}%
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {result.fat.grams}g
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            💡 These are daily targets. Track your intake with Free Calorie Track to hit your goals consistently.
          </p>
        </div>
      )}
    </div>
  );
}
