import { useState } from 'react';

export default function FFMICalculator() {
  const [unit, setUnit] = useState('imperial');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [result, setResult] = useState(null);

  const getFFMICategory = (ffmi, sex) => {
    // FFMI categories based on research
    if (sex === 'male') {
      if (ffmi < 18) return { category: 'Below Average', color: 'text-blue-600 dark:text-blue-400' };
      if (ffmi < 20) return { category: 'Average', color: 'text-green-600 dark:text-green-400' };
      if (ffmi < 22) return { category: 'Above Average', color: 'text-emerald-600 dark:text-emerald-400' };
      if (ffmi < 23) return { category: 'Excellent', color: 'text-cyan-600 dark:text-cyan-400' };
      if (ffmi < 25) return { category: 'Superior (natural limit)', color: 'text-purple-600 dark:text-purple-400' };
      return { category: 'Exceptional (rare naturally)', color: 'text-orange-600 dark:text-orange-400' };
    } else {
      if (ffmi < 15) return { category: 'Below Average', color: 'text-blue-600 dark:text-blue-400' };
      if (ffmi < 17) return { category: 'Average', color: 'text-green-600 dark:text-green-400' };
      if (ffmi < 18) return { category: 'Above Average', color: 'text-emerald-600 dark:text-emerald-400' };
      if (ffmi < 19) return { category: 'Excellent', color: 'text-cyan-600 dark:text-cyan-400' };
      if (ffmi < 21) return { category: 'Superior (natural limit)', color: 'text-purple-600 dark:text-purple-400' };
      return { category: 'Exceptional (rare naturally)', color: 'text-orange-600 dark:text-orange-400' };
    }
  };

  const [sex, setSex] = useState('male');

  const handleCalculate = (e) => {
    e.preventDefault();

    let heightM = parseFloat(height);
    let weightKg = parseFloat(weight);
    const bfPercent = parseFloat(bodyFat);

    if (unit === 'imperial') {
      heightM = (heightM * 2.54) / 100; // inches to meters
      weightKg = weightKg * 0.453592; // lbs to kg
    } else {
      heightM = heightM / 100; // cm to meters
    }

    // Calculate fat-free mass
    const fatMass = weightKg * (bfPercent / 100);
    const fatFreeMass = weightKg - fatMass;

    // Calculate FFMI
    const ffmi = fatFreeMass / (heightM * heightM);

    // Normalized FFMI (adjusts for height)
    const normalizedFFMI = ffmi + 6.1 * (1.8 - heightM);

    const category = getFFMICategory(normalizedFFMI, sex);

    setResult({
      ffmi: ffmi.toFixed(1),
      normalizedFFMI: normalizedFFMI.toFixed(1),
      fatFreeMass: fatFreeMass.toFixed(1),
      ...category,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 my-8 border border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        FFMI Calculator
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Fat-Free Mass Index (FFMI) measures muscle mass relative to height, accounting for body fat.
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

        {/* Sex */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sex
          </label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
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

        {/* Body Fat Percentage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Body Fat Percentage (%)
          </label>
          <input
            type="number"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
            placeholder="15"
            required
            min="3"
            max="60"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Not sure? Watch the video in the article below to estimate your body fat percentage.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Calculate FFMI
        </button>
      </form>

      {result && (
        <div className="mt-6 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-2 border-emerald-500">
          <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mb-3">
            Your FFMI
          </h4>
          <div className="text-center mb-3">
            <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
              {result.normalizedFFMI}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Normalized FFMI
            </div>
            <div className={`text-lg font-semibold mt-2 ${result.color}`}>
              {result.category}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded">
              <div className="text-xs text-gray-600 dark:text-gray-400">Raw FFMI</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{result.ffmi}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded">
              <div className="text-xs text-gray-600 dark:text-gray-400">Fat-Free Mass</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{result.fatFreeMass} {unit === 'imperial' ? 'lbs' : 'kg'}</div>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>{sex === 'male' ? 'Male' : 'Female'} FFMI Categories:</strong></p>
            {sex === 'male' ? (
              <>
                <div className="flex justify-between"><span>Below Average:</span><span>&lt; 18</span></div>
                <div className="flex justify-between"><span>Average:</span><span>18 – 20</span></div>
                <div className="flex justify-between"><span>Above Average:</span><span>20 – 22</span></div>
                <div className="flex justify-between"><span>Excellent:</span><span>22 – 23</span></div>
                <div className="flex justify-between"><span>Superior:</span><span>23 – 25</span></div>
                <div className="flex justify-between"><span>Exceptional:</span><span>25+</span></div>
              </>
            ) : (
              <>
                <div className="flex justify-between"><span>Below Average:</span><span>&lt; 15</span></div>
                <div className="flex justify-between"><span>Average:</span><span>15 – 17</span></div>
                <div className="flex justify-between"><span>Above Average:</span><span>17 – 18</span></div>
                <div className="flex justify-between"><span>Excellent:</span><span>18 – 19</span></div>
                <div className="flex justify-between"><span>Superior:</span><span>19 – 21</span></div>
                <div className="flex justify-between"><span>Exceptional:</span><span>21+</span></div>
              </>
            )}
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
            <strong>Note:</strong> An FFMI above {sex === 'male' ? '25' : '21'} is rare without performance-enhancing substances. FFMI is a better indicator of muscle mass than BMI.
          </p>
        </div>
      )}
    </div>
  );
}
