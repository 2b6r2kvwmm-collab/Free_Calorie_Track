import { useState } from 'react';

export default function ProteinCalculator() {
  const [unit, setUnit] = useState('imperial');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('general');
  const [result, setResult] = useState(null);

  const proteinRanges = {
    sedentary: { min: 0.8, max: 1.0, label: 'Sedentary / Minimum (RDA)' },
    general: { min: 1.2, max: 1.6, label: 'Active / General Fitness' },
    muscle: { min: 1.6, max: 2.2, label: 'Building Muscle' },
    athlete: { min: 1.4, max: 2.0, label: 'Athlete / High Activity' },
    cutting: { min: 1.8, max: 2.7, label: 'Fat Loss (preserve muscle)' },
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    let weightKg = parseFloat(weight);
    if (unit === 'imperial') {
      weightKg = weightKg * 0.453592; // lbs to kg
    }

    const range = proteinRanges[goal];
    const minProtein = Math.round(weightKg * range.min);
    const maxProtein = Math.round(weightKg * range.max);

    setResult({
      min: minProtein,
      max: maxProtein,
      goalLabel: range.label,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 my-8 border border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Protein Calculator
      </h3>

      <form onSubmit={handleCalculate} className="space-y-6">
        {/* Unit Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Unit System
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setUnit('imperial')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                unit === 'imperial'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Imperial (lbs)
            </button>
            <button
              type="button"
              onClick={() => setUnit('metric')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                unit === 'metric'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Metric (kg)
            </button>
          </div>
        </div>

        {/* Weight Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Body Weight ({unit === 'imperial' ? 'lbs' : 'kg'})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === 'imperial' ? '150' : '68'}
            required
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Goal Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Goal / Activity Level
          </label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="sedentary">Sedentary / Minimum (RDA)</option>
            <option value="general">Active / General Fitness</option>
            <option value="muscle">Building Muscle</option>
            <option value="athlete">Athlete / High Activity</option>
            <option value="cutting">Fat Loss (preserve muscle)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Calculate Protein Needs
        </button>
      </form>

      {result && (
        <div className="mt-6 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-2 border-emerald-500">
          <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mb-3">
            Recommended Protein Intake
          </h4>
          <div className="text-center mb-3">
            <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
              {result.min}–{result.max}g
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              per day
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Goal:</strong> {result.goalLabel}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
            This range is based on current research for optimal protein intake. Individual needs may vary based on age, health status, and specific training goals. Consult a healthcare provider or registered dietitian for personalized recommendations.
          </p>
        </div>
      )}
    </div>
  );
}
