import { useState } from 'react';
import { getProfile, saveProfile, saveDailyGoal } from '../utils/storage';
import { calculateBMR, calculateTDEE, getBaselineTDEE } from '../utils/calculations';
import { FITNESS_GOALS, GOAL_INFO, calculateMacroTargets } from '../utils/macros';

export default function Settings({ onUpdateProfile, onClose }) {
  const currentProfile = getProfile();

  // Convert stored metric values to user's preferred unit for display
  const displayHeight = currentProfile.unit === 'imperial'
    ? Math.round(currentProfile.height / 2.54 * 10) / 10  // cm to inches
    : currentProfile.height;

  const displayWeight = currentProfile.unit === 'imperial'
    ? Math.round(currentProfile.weight / 0.453592 * 10) / 10  // kg to lbs
    : currentProfile.weight;

  const [formData, setFormData] = useState({
    age: currentProfile.age,
    sex: currentProfile.sex,
    height: displayHeight,
    weight: displayWeight,
    activityLevel: currentProfile.activityLevel,
    unit: currentProfile.unit,
    fitnessGoal: currentProfile.fitnessGoal || FITNESS_GOALS.MAINTENANCE,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert imperial to metric if needed for storage
    let height = parseFloat(formData.height);
    let weight = parseFloat(formData.weight);

    if (formData.unit === 'imperial') {
      height = height * 2.54; // inches to cm
      weight = weight * 0.453592; // lbs to kg
    }

    const profile = {
      age: parseInt(formData.age),
      sex: formData.sex,
      height,
      weight,
      activityLevel: formData.activityLevel,
      unit: formData.unit,
      fitnessGoal: formData.fitnessGoal,
    };

    // Auto-set NET calorie goal based on fitness goal (now weight-adjusted)
    const bmrForGoal = calculateBMR(profile);
    const tdeeForGoal = calculateTDEE(bmrForGoal, formData.activityLevel);
    const macroTargets = calculateMacroTargets(weight, tdeeForGoal, formData.fitnessGoal);
    saveDailyGoal(macroTargets.calorieAdjustment);

    saveProfile(profile);
    onUpdateProfile(profile);
    onClose();
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // When unit changes, convert height/weight
  const handleUnitChange = (newUnit) => {
    if (newUnit === formData.unit) return;

    let newHeight = parseFloat(formData.height);
    let newWeight = parseFloat(formData.weight);

    if (newUnit === 'imperial') {
      // Converting from metric to imperial
      newHeight = Math.round(newHeight / 2.54 * 10) / 10;  // cm to inches
      newWeight = Math.round(newWeight / 0.453592 * 10) / 10;  // kg to lbs
    } else {
      // Converting from imperial to metric
      newHeight = Math.round(newHeight * 2.54 * 10) / 10;  // inches to cm
      newWeight = Math.round(newWeight * 0.453592 * 10) / 10;  // lbs to kg
    }

    setFormData(prev => ({
      ...prev,
      unit: newUnit,
      height: newHeight,
      weight: newWeight,
    }));
  };

  // For BMR calculation, we need metric values
  const metricHeight = formData.unit === 'imperial'
    ? parseFloat(formData.height) * 2.54  // inches to cm
    : parseFloat(formData.height);

  const metricWeight = formData.unit === 'imperial'
    ? parseFloat(formData.weight) * 0.453592  // lbs to kg
    : parseFloat(formData.weight);

  const bmrProfile = {
    ...formData,
    height: metricHeight,
    weight: metricWeight,
  };

  const bmr = calculateBMR(bmrProfile);
  const tdee = calculateTDEE(bmr, formData.activityLevel);
  const baselineTDEE = getBaselineTDEE(bmr);

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Unit System */}
          <div>
            <label className="block text-lg font-semibold mb-3">Unit System</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleUnitChange('metric')}
                className={`py-3 px-6 rounded-lg font-semibold text-lg border-2 transition-colors ${
                  formData.unit === 'metric'
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                }`}
              >
                Metric (kg, cm)
              </button>
              <button
                type="button"
                onClick={() => handleUnitChange('imperial')}
                className={`py-3 px-6 rounded-lg font-semibold text-lg border-2 transition-colors ${
                  formData.unit === 'imperial'
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                }`}
              >
                Imperial (lbs, in)
              </button>
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-lg font-semibold mb-3">Age (years)</label>
            <input
              type="number"
              required
              min="13"
              max="120"
              value={formData.age}
              onChange={(e) => updateField('age', e.target.value)}
              className="input-field"
            />
          </div>

          {/* Sex */}
          <div>
            <label className="block text-lg font-semibold mb-3">Sex</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => updateField('sex', 'male')}
                className={`py-3 px-6 rounded-lg font-semibold text-lg border-2 transition-colors ${
                  formData.sex === 'male'
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => updateField('sex', 'female')}
                className={`py-3 px-6 rounded-lg font-semibold text-lg border-2 transition-colors ${
                  formData.sex === 'female'
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Height */}
          <div>
            <label className="block text-lg font-semibold mb-3">
              Height ({formData.unit === 'metric' ? 'cm' : 'inches'})
            </label>
            <input
              type="number"
              required
              min="50"
              max="300"
              step="0.1"
              value={formData.height}
              onChange={(e) => updateField('height', e.target.value)}
              className="input-field"
              placeholder={formData.unit === 'metric' ? '170' : '67'}
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-lg font-semibold mb-3">
              Weight ({formData.unit === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input
              type="number"
              required
              min="20"
              max="500"
              step="0.1"
              value={formData.weight}
              onChange={(e) => updateField('weight', e.target.value)}
              className="input-field"
              placeholder={formData.unit === 'metric' ? '70' : '154'}
            />
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-lg font-semibold mb-3">Daily Activity Level</label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Choose based on your daily lifestyle, NOT planned exercise. Exercise should be logged separately to avoid double-counting.
            </p>
            <select
              value={formData.activityLevel}
              onChange={(e) => updateField('activityLevel', e.target.value)}
              className="input-field"
            >
              <option value="sedentary">Sedentary - Desk job, little movement</option>
              <option value="light">Light - Teacher, salesperson, light daily tasks</option>
              <option value="moderate">Moderate - Nurse, on feet most of day</option>
              <option value="active">Active - Construction, farm work, very physical job</option>
              <option value="veryActive">Very Active - Professional athlete, extremely physical job</option>
            </select>

            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm">
              <p className="font-semibold mb-2">💡 How to Choose:</p>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                <li><strong>Sedentary:</strong> Desk job, mostly sitting all day</li>
                <li><strong>Light:</strong> Standing/walking occasionally during work</li>
                <li><strong>Moderate:</strong> On your feet most of the day</li>
                <li><strong>Active:</strong> Heavy lifting or very physical work daily</li>
                <li><strong>Very Active:</strong> Extreme physical job + training</li>
              </ul>
              <p className="mt-3 text-xs italic">
                Most people choose Sedentary or Light. Log your workouts separately in the Exercise section!
              </p>
            </div>
          </div>

          {/* Fitness Goal */}
          <div>
            <label className="block text-lg font-semibold mb-3">Fitness Goal</label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Automatically sets your NET calorie goal and research-based macro targets
            </p>
            <div className="space-y-3">
              {Object.values(FITNESS_GOALS).map((goalKey) => {
                const goal = GOAL_INFO[goalKey];
                // Calculate NET goal based on current weight (preview)
                const previewBMR = calculateBMR(bmrProfile);
                const previewTDEE = calculateTDEE(previewBMR, formData.activityLevel);
                const previewTargets = calculateMacroTargets(metricWeight, previewTDEE, goalKey);
                const netCalorieGoal = previewTargets.calorieAdjustment;

                return (
                  <button
                    key={goalKey}
                    type="button"
                    onClick={() => updateField('fitnessGoal', goalKey)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      formData.fitnessGoal === goalKey
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-semibold text-base">{goal.label}</div>
                      <div className={`text-sm font-semibold ${
                        netCalorieGoal > 0 ? 'text-blue-600 dark:text-blue-400' :
                        netCalorieGoal < 0 ? 'text-orange-600 dark:text-orange-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`}>
                        NET: {netCalorieGoal >= 0 ? '+' : ''}{netCalorieGoal} cal
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {goal.description}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300">
              <p className="font-semibold mb-1">💡 Science-Backed Recommendations:</p>
              <p className="text-xs">
                Your NET calorie goal will be automatically set based on your fitness goal.
                You can still adjust it manually from the Dashboard if needed.
              </p>
            </div>
          </div>

          {/* Calculated Values */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg space-y-3">
            <p className="font-semibold text-sm">Your Calorie Numbers:</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>BMR (calories to stay alive):</span>
                <span className="font-semibold">{Math.round(bmr)} cal/day</span>
              </div>
              <div className="flex justify-between">
                <span>Resting Burn (used in tracking):</span>
                <span className="font-semibold">{baselineTDEE} cal/day</span>
              </div>
              <div className="flex justify-between">
                <span>Lifestyle TDEE (with activity level):</span>
                <span className="font-semibold">{tdee} cal/day</span>
              </div>
            </div>
            <p className="text-xs italic text-gray-600 dark:text-gray-400 mt-2">
              Note: The app uses "Resting Burn" (sedentary TDEE) to avoid counting exercise twice. Your logged exercises are added separately.
            </p>
          </div>

          <button type="submit" className="btn-primary w-full">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
