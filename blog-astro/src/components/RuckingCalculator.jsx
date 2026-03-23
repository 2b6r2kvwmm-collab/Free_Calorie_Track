import { useState } from 'react';

export default function RuckingCalculator() {
  const [weight, setWeight] = useState(180);
  const [loadWeight, setLoadWeight] = useState(20);
  const [duration, setDuration] = useState(60);
  const [speed, setSpeed] = useState(3);
  const [useBackpack, setUseBackpack] = useState(false);
  const [unit, setUnit] = useState('imperial'); // imperial or metric

  // Convert to metric if needed
  const bodyWeightKg = unit === 'imperial' ? weight * 0.453592 : weight;
  const loadWeightKg = unit === 'imperial' ? loadWeight * 0.453592 : loadWeight;
  const speedMph = unit === 'imperial' ? speed : speed / 1.60934;

  // Determine vest weight category for MET adjustment
  const getVestCategory = (lbs) => {
    const vestLbs = unit === 'imperial' ? lbs : lbs * 2.20462;
    if (vestLbs <= 15) return '10-15';
    if (vestLbs <= 20) return '20';
    if (vestLbs <= 30) return '30';
    return '40+';
  };

  // Get speed category (round to nearest: 2, 3, or 4 mph)
  const getSpeedCategory = (mph) => {
    if (mph <= 2.5) return '2mph';
    if (mph <= 3.5) return '3mph';
    return '4mph';
  };

  // Base MET values for walking at different speeds (no load)
  const getBaseMET = (mph) => {
    if (mph <= 2.5) return 2.8;  // Slow walk
    if (mph <= 3.5) return 3.5;  // Normal walk
    return 5.0;  // Brisk walk
  };

  // MET adjustments for weighted vest (from Free Calorie Track app)
  const getMETAdjustment = (speedCat, vestCat) => {
    const adjustments = {
      '2mph': { '10-15': 0.5, '20': 0.8, '30': 1.2, '40+': 1.5 },
      '3mph': { '10-15': 0.8, '20': 1.2, '30': 1.8, '40+': 2.0 },
      '4mph': { '10-15': 1.3, '20': 1.7, '30': 2.3, '40+': 2.5 },
    };
    return adjustments[speedCat]?.[vestCat] || 0;
  };

  const calculateCalories = () => {
    // Get base MET for walking speed
    const baseMET = getBaseMET(speedMph);

    // Add weighted vest adjustment if load > 0
    let totalMET = baseMET;
    if (loadWeight > 0) {
      const speedCat = getSpeedCategory(speedMph);
      const vestCat = getVestCategory(loadWeight);
      const adjustment = getMETAdjustment(speedCat, vestCat);
      totalMET = baseMET + adjustment;
    }

    // Apply backpack penalty (7% harder than vest)
    if (useBackpack && loadWeight > 0) {
      totalMET = totalMET * 1.07;
    }

    // Calories = MET × body weight (kg) × duration (hours)
    const caloriesPerHour = totalMET * bodyWeightKg;
    const totalCalories = caloriesPerHour * (duration / 60);

    return Math.round(totalCalories);
  };

  // Calculate calories without load for comparison
  const calculateBaseCalories = () => {
    const baseMET = getBaseMET(speedMph);
    const caloriesPerHour = baseMET * bodyWeightKg;
    const totalCalories = caloriesPerHour * (duration / 60);
    return Math.round(totalCalories);
  };

  const totalCalories = calculateCalories();
  const baseCalories = calculateBaseCalories();
  const extraCalories = totalCalories - baseCalories;
  const percentIncrease = Math.round((extraCalories / baseCalories) * 100);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
        Rucking Calorie Calculator
      </h3>

      {/* Unit Toggle */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Units:</span>
        <button
          onClick={() => setUnit('imperial')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            unit === 'imperial'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Imperial (lbs, mph)
        </button>
        <button
          onClick={() => setUnit('metric')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            unit === 'metric'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Metric (kg, km/h)
        </button>
      </div>

      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Body Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Body Weight ({unit === 'imperial' ? 'lbs' : 'kg'})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            min="1"
          />
        </div>

        {/* Load Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Weight Carried ({unit === 'imperial' ? 'lbs' : 'kg'})
          </label>
          <input
            type="number"
            value={loadWeight}
            onChange={(e) => setLoadWeight(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            min="0"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {Math.round((loadWeightKg / bodyWeightKg) * 100)}% of body weight
          </p>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            min="1"
          />
        </div>

        {/* Speed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Walking Speed ({unit === 'imperial' ? 'mph' : 'km/h'})
          </label>
          <input
            type="number"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(Math.max(0.1, parseFloat(e.target.value) || 0))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            min="0.1"
          />
        </div>
      </div>

      {/* Backpack Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="backpack-toggle"
          checked={useBackpack}
          onChange={(e) => setUseBackpack(e.target.checked)}
          className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor="backpack-toggle" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Using backpack instead of weighted vest (+7% calorie burn)
        </label>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/30 dark:to-blue-900/30 rounded-xl p-6 border-2 border-emerald-500">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Calories Burned</div>
            <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
              {totalCalories}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              with {loadWeight} {unit === 'imperial' ? 'lbs' : 'kg'} load
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Without Weight</div>
            <div className="text-4xl font-bold text-gray-400">
              {baseCalories}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              regular walking
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Extra Burn</div>
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
              +{extraCalories}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {percentIncrease}% increase
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-700">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            💡 <strong>Calories per hour:</strong> {Math.round(totalCalories / (duration / 60))} cal/hr
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Note: This calculator uses simplified metabolic equations. Actual calorie burn varies based on terrain, elevation, temperature, fitness level, and individual metabolism.
          </p>
        </div>
      </div>

    </div>
  );
}
