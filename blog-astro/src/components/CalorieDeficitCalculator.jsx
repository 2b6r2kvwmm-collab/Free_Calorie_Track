import { useState } from 'react';
import { calculateBMR, calculateTDEE } from '../utils/calculations';

export default function CalorieDeficitCalculator() {
  const [unit, setUnit] = useState('imperial');
  const [formData, setFormData] = useState({
    age: '',
    sex: 'male',
    height: '',
    weight: '',
    activityLevel: 'moderate',
    pace: 'moderate',
  });
  const [result, setResult] = useState(null);

  const deficitRanges = {
    slow: { deficit: 250, label: 'Slow & Sustainable', lbsPerWeek: 0.5 },
    moderate: { deficit: 500, label: 'Moderate', lbsPerWeek: 1.0 },
    aggressive: { deficit: 700, label: 'Aggressive (Max Recommended)', lbsPerWeek: 1.5 },
  };

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
    const tdee = calculateTDEE(bmr, formData.activityLevel);
    const deficitInfo = deficitRanges[formData.pace];
    const targetCalories = Math.round(tdee - deficitInfo.deficit);

    // Safety checks - use percentage-based minimum with absolute floor
    // Never exceed 25% deficit (backed by CALERIE study), and never go below 1200/1500 cal
    const absoluteMinimum = formData.sex === 'female' ? 1200 : 1500;
    const percentageBasedMinimum = Math.round(tdee * 0.75); // Max 25% deficit
    const minimumCalories = Math.max(absoluteMinimum, percentageBasedMinimum);
    const isTooLow = targetCalories < minimumCalories;

    setResult({
      tdee: Math.round(tdee),
      deficit: deficitInfo.deficit,
      targetCalories: targetCalories,
      pace: deficitInfo.label,
      expectedLossPerWeek: deficitInfo.lbsPerWeek,
      isTooLow,
      minimumCalories,
      safeTarget: Math.max(targetCalories, minimumCalories),
    });
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 my-8 border border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Calorie Deficit Calculator
      </h3>

      <form onSubmit={handleCalculate} className="space-y-4">
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
              Imperial
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
              Metric
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => updateField('age', e.target.value)}
              required
              min="18"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>

          {/* Sex */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sex
            </label>
            <select
              value={formData.sex}
              onChange={(e) => updateField('sex', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Height ({unit === 'imperial' ? 'inches' : 'cm'})
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => updateField('height', e.target.value)}
              placeholder={unit === 'imperial' ? '70' : '178'}
              required
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Weight ({unit === 'imperial' ? 'lbs' : 'kg'})
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => updateField('weight', e.target.value)}
              placeholder={unit === 'imperial' ? '180' : '82'}
              required
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
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
            onChange={(e) => updateField('activityLevel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="sedentary">Sedentary (little to no exercise)</option>
            <option value="light">Light (1-3 days/week)</option>
            <option value="moderate">Moderate (3-5 days/week)</option>
            <option value="active">Active (6-7 days/week)</option>
            <option value="veryActive">Very Active (intense daily)</option>
          </select>
        </div>

        {/* Weight Loss Pace */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Weight Loss Pace
          </label>
          <select
            value={formData.pace}
            onChange={(e) => updateField('pace', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="slow">Slow & Sustainable (0.5 lbs/week)</option>
            <option value="moderate">Moderate (1 lb/week)</option>
            <option value="aggressive">Aggressive (1.5 lbs/week) - Max Safe</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Calculate Calorie Target
        </button>
      </form>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Your Maintenance Calories (TDEE)
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {result.tdee} calories/day
            </div>
          </div>

          {result.isTooLow ? (
            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-500">
              <h4 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">
                ⚠️ Warning: Deficit Too Aggressive
              </h4>
              <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                Your selected pace would result in only <strong>{result.targetCalories} calories/day</strong>,
                which is below the safe minimum of <strong>{result.minimumCalories} calories/day</strong>. This deficit would exceed 25% of your TDEE, which research shows increases risks of muscle loss and metabolic adaptation.
              </p>
              <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                <strong>Eating too few calories can:</strong>
              </p>
              <ul className="text-sm text-red-800 dark:text-red-200 list-disc list-inside space-y-1 mb-4">
                <li>Slow your metabolism</li>
                <li>Cause muscle loss</li>
                <li>Lead to nutrient deficiencies</li>
                <li>Increase risk of gallstones</li>
                <li>Cause fatigue, irritability, and poor concentration</li>
              </ul>
              <div className="bg-white dark:bg-gray-800 p-4 rounded border border-red-300 dark:border-red-700">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Safe Target Calories
                </div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {result.safeTarget} cal/day
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  This is the minimum safe intake. Consider choosing a slower pace for sustainable results.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-2 border-emerald-500">
              <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mb-3">
                Your Calorie Target
              </h4>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                  {result.targetCalories} calories
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  per day
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white dark:bg-gray-800 p-3 rounded">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Deficit</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">-{result.deficit} cal</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Expected Loss</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{result.expectedLossPerWeek} lbs/week</div>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Pace:</strong> {result.pace}. This is a {formData.pace === 'slow' ? 'sustainable' : formData.pace === 'moderate' ? 'balanced' : 'maximum safe'} rate of weight loss. Adjust based on your results and how you feel.
              </p>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300">
            <strong>💡 Important Tips:</strong>
            <ul className="list-disc list-inside space-y-1 mt-2 text-xs">
              <li>Slower weight loss (0.5-1 lb/week) is more sustainable and preserves muscle</li>
              <li>Track your weight weekly and adjust calories if you're losing faster than expected</li>
              <li>Prioritize protein intake (0.7-1g per lb body weight) to preserve muscle mass</li>
              <li>Don't exceed a 25% deficit - larger deficits cause muscle loss and metabolic slowdown</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
