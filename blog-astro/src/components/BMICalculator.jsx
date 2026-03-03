import { useState } from 'react';

export default function BMICalculator() {
  const [unit, setUnit] = useState('imperial');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600 dark:text-blue-400' };
    if (bmi < 25) return { category: 'Normal Weight', color: 'text-green-600 dark:text-green-400' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600 dark:text-yellow-400' };
    return { category: 'Obese', color: 'text-red-600 dark:text-red-400' };
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    let heightM = parseFloat(height);
    let weightKg = parseFloat(weight);

    if (unit === 'imperial') {
      heightM = (heightM * 2.54) / 100; // inches to meters
      weightKg = weightKg * 0.453592; // lbs to kg
    } else {
      heightM = heightM / 100; // cm to meters
    }

    const bmi = weightKg / (heightM * heightM);
    const category = getBMICategory(bmi);

    setResult({
      bmi: bmi.toFixed(1),
      ...category,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 my-8 border border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        BMI Calculator
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Body Mass Index (BMI) is a simple height-to-weight ratio used to categorize weight status.
      </p>

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
          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Height ({unit === 'imperial' ? 'inches' : 'cm'})
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={unit === 'imperial' ? '70' : '178'}
              required
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Weight ({unit === 'imperial' ? 'lbs' : 'kg'})
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === 'imperial' ? '180' : '82'}
              required
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Calculate BMI
        </button>
      </form>

      {result && (
        <div className="mt-6 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-2 border-emerald-500">
          <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mb-3">
            Your BMI
          </h4>
          <div className="text-center mb-3">
            <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
              {result.bmi}
            </div>
            <div className={`text-lg font-semibold mt-2 ${result.color}`}>
              {result.category}
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Underweight:</span>
              <span>&lt; 18.5</span>
            </div>
            <div className="flex justify-between">
              <span>Normal Weight:</span>
              <span>18.5 – 24.9</span>
            </div>
            <div className="flex justify-between">
              <span>Overweight:</span>
              <span>25 – 29.9</span>
            </div>
            <div className="flex justify-between">
              <span>Obese:</span>
              <span>≥ 30</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
            <strong>Note:</strong> BMI doesn't account for muscle mass. Athletes and very muscular individuals may have a high BMI despite low body fat.
          </p>
        </div>
      )}
    </div>
  );
}
