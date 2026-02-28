import { useState } from 'react';
import { calculateBMR, calculateTDEE } from '../../utils/calculations';

export default function TDEECalculator() {
  const [unit, setUnit] = useState('imperial');
  const [formData, setFormData] = useState({
    age: '',
    sex: 'male',
    height: '',
    weight: '',
    activityLevel: 'moderate',
  });
  const [result, setResult] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();

    // Convert to metric if needed
    let heightCm = parseFloat(formData.height);
    let weightKg = parseFloat(formData.weight);

    if (unit === 'imperial') {
      heightCm = heightCm * 2.54; // inches to cm
      weightKg = weightKg * 0.453592; // lbs to kg
    }

    const profile = {
      age: parseInt(formData.age),
      sex: formData.sex,
      height: heightCm,
      weight: weightKg,
      activityLevel: formData.activityLevel,
    };

    const bmr = calculateBMR(profile);
    const tdee = calculateTDEE(bmr, profile.activityLevel);

    setResult({ bmr, tdee });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 my-8 border-2 border-emerald-200 dark:border-emerald-800">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        🔥 TDEE Calculator
      </h3>

      <form onSubmit={handleCalculate} className="space-y-4">
        {/* Unit Toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setUnit('imperial')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              unit === 'imperial'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Imperial (lbs/in)
          </button>
          <button
            type="button"
            onClick={() => setUnit('metric')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              unit === 'metric'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Metric (kg/cm)
          </button>
        </div>

        {/* Age & Sex */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Age
            </label>
            <input
              type="number"
              required
              min="15"
              max="100"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sex
            </label>
            <select
              value={formData.sex}
              onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {/* Height & Weight */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Height ({unit === 'imperial' ? 'inches' : 'cm'})
            </label>
            <input
              type="number"
              required
              step="0.1"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={unit === 'imperial' ? '70' : '178'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Weight ({unit === 'imperial' ? 'lbs' : 'kg'})
            </label>
            <input
              type="number"
              required
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={unit === 'imperial' ? '180' : '82'}
            />
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Activity Level
          </label>
          <select
            value={formData.activityLevel}
            onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="sedentary">Sedentary (little to no exercise)</option>
            <option value="light">Light (1-3 days/week)</option>
            <option value="moderate">Moderate (3-5 days/week)</option>
            <option value="active">Active (6-7 days/week)</option>
            <option value="veryActive">Very Active (intense exercise daily)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calculate TDEE
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600 space-y-3">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              BMR (Basal Metabolic Rate)
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(result.bmr)} calories/day
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Calories burned at complete rest
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-4 border-2 border-emerald-200 dark:border-emerald-700">
            <div className="text-sm text-emerald-700 dark:text-emerald-400 mb-1">
              TDEE (Total Daily Energy Expenditure)
            </div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {Math.round(result.tdee)} calories/day
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              Your maintenance calories (including activity)
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            💡 To lose weight, eat below your TDEE. To gain weight, eat above it. To maintain, eat at your TDEE.
          </p>
        </div>
      )}
    </div>
  );
}
