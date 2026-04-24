import { useState } from 'react';

const GOALS = [
  {
    id: 'standard',
    label: 'GLP-1, sedentary',
    minKg: 1.2,
    maxKg: 1.4,
    description: 'Minimum target for lean mass preservation with little to no exercise.',
  },
  {
    id: 'active',
    label: 'GLP-1 + light activity',
    minKg: 1.4,
    maxKg: 1.6,
    description: 'Walking, light cardio, or yoga a few times per week.',
  },
  {
    id: 'lifting',
    label: 'GLP-1 + resistance training',
    minKg: 1.6,
    maxKg: 2.2,
    description: 'Strength training 2–4× per week — the most effective strategy for preserving muscle on a GLP-1.',
  },
];

export default function GLP1ProteinCalculator() {
  const [unit, setUnit] = useState('imperial');
  const [weight, setWeight] = useState('');
  const [calories, setCalories] = useState('');
  const [goalId, setGoalId] = useState('active');
  const [result, setResult] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();

    const goal = GOALS.find(g => g.id === goalId);
    let weightKg = parseFloat(weight);
    if (unit === 'imperial') weightKg = weightKg * 0.453592;

    const minProtein = Math.round(weightKg * goal.minKg);
    const maxProtein = Math.round(weightKg * goal.maxKg);
    const midProtein = Math.round((minProtein + maxProtein) / 2);

    // Calories from protein (4 cal/g)
    const dailyCal = parseFloat(calories) || null;
    const minCalFromProtein = minProtein * 4;
    const maxCalFromProtein = maxProtein * 4;
    const minPct = dailyCal ? Math.round((minCalFromProtein / dailyCal) * 100) : null;
    const maxPct = dailyCal ? Math.round((maxCalFromProtein / dailyCal) * 100) : null;

    // Per-meal split across 3 and 4 meals
    const per3 = Math.round(midProtein / 3);
    const per4 = Math.round(midProtein / 4);

    setResult({ minProtein, maxProtein, midProtein, per3, per4, minPct, maxPct, goal, dailyCal });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 my-8 border-2 border-emerald-200 dark:border-emerald-800">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
        💊 GLP-1 Protein Calculator
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Tailored protein targets for people on semaglutide or tirzepatide medications.
      </p>

      <form onSubmit={handleCalculate} className="space-y-5">
        {/* Unit Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Units
          </label>
          <div className="flex gap-3">
            {['imperial', 'metric'].map(u => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                  unit === u
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {u === 'imperial' ? 'lbs' : 'kg'}
              </button>
            ))}
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Body weight ({unit === 'imperial' ? 'lbs' : 'kg'})
          </label>
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder={unit === 'imperial' ? '180' : '82'}
            required
            min="50"
            max={unit === 'imperial' ? '500' : '225'}
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Daily Calorie Intake (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Daily calorie intake <span className="text-gray-400 font-normal">(optional — shows protein as % of calories)</span>
          </label>
          <input
            type="number"
            value={calories}
            onChange={e => setCalories(e.target.value)}
            placeholder="e.g. 1000"
            min="400"
            max="4000"
            step="50"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Activity level on GLP-1
          </label>
          <div className="space-y-2">
            {GOALS.map(g => (
              <label
                key={g.id}
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  goalId === g.id
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="goal"
                  value={g.id}
                  checked={goalId === g.id}
                  onChange={() => setGoalId(g.id)}
                  className="mt-0.5 accent-emerald-600"
                />
                <div>
                  <div className="font-medium text-sm text-gray-800 dark:text-gray-200">{g.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{g.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Calculate My Protein Target
        </button>
      </form>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Main result */}
          <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-2 border-emerald-500">
            <div className="text-center mb-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 mb-1">
                Daily Protein Target
              </div>
              <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
                {result.minProtein}–{result.maxProtein}g
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">per day · {result.goal.label}</div>
            </div>

            {/* Per-meal split */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">~{result.per3}g</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">per meal (3 meals)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">~{result.per4}g</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">per meal (4 meals)</div>
              </div>
            </div>
          </div>

          {/* Calorie breakdown (if provided) */}
          {result.dailyCal && (
            <div className={`p-4 rounded-lg border-2 ${
              result.minPct > 60
                ? 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-700'
                : result.minPct > 40
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 dark:border-yellow-700'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
            }`}>
              <div className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1">
                At {result.dailyCal} calories/day:
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.minPct}–{result.maxPct}% of calories from protein
              </div>
              {result.minPct > 50 && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  At this calorie level, hitting your protein target requires prioritizing high-protein, low-calorie foods at almost every meal. Lean meats, egg whites, Greek yogurt, cottage cheese, and protein shakes become essential — not optional.
                </p>
              )}
              {result.minPct <= 50 && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  This is achievable with intentional food choices. Prioritize a high-protein source at every meal.
                </p>
              )}
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            These ranges are based on current research for people in a significant calorie deficit. Individual needs vary based on age, kidney function, activity level, and health conditions. Consult your prescribing physician or a registered dietitian for personalized guidance.
          </p>
        </div>
      )}
    </div>
  );
}
