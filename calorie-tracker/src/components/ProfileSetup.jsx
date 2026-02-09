import { useState } from 'react';
import { FITNESS_GOALS, GOAL_INFO } from '../utils/macros';
import { saveCustomMacros, clearCustomMacros, saveCustomCalorieGoal, clearCustomCalorieGoal } from '../utils/storage';
import { calculateBMR, getBaselineTDEE } from '../utils/calculations';

export default function ProfileSetup({ onComplete }) {
  const [step, setStep] = useState(1); // 1: basic info, 2: fitness goal
  const [useCustomGoals, setUseCustomGoals] = useState(false);
  const [customMacros, setCustomMacros] = useState({ protein: 150, carbs: 200, fat: 65 });
  const [formData, setFormData] = useState({
    age: '',
    sex: 'male',
    height: '',
    weight: '',
    activityLevel: 'moderate',
    unit: 'imperial', // metric or imperial
    fitnessGoal: FITNESS_GOALS.MAINTENANCE,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === 1) {
      // Move to fitness goal selection
      setStep(2);
      return;
    }

    // Step 2: Complete profile setup
    // Convert imperial to metric if needed
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

    // Save or clear custom goals
    if (useCustomGoals) {
      saveCustomMacros(customMacros);
      // Calculate net goal: Total Calories from Macros - Lifestyle TDEE
      const totalCaloriesFromMacros = (customMacros.protein * 4) + (customMacros.carbs * 4) + (customMacros.fat * 9);
      const bmr = calculateBMR(profile);
      const baselineTDEE = getBaselineTDEE(bmr);
      const netGoal = Math.round(totalCaloriesFromMacros - baselineTDEE);
      saveCustomCalorieGoal(netGoal);
    } else {
      clearCustomMacros();
      clearCustomCalorieGoal();
    }

    onComplete(profile);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">
          {step === 1 ? 'Welcome to Calorie Tracker' : 'Choose Your Fitness Goal'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center text-lg">
          {step === 1
            ? "Let's set up your profile to calculate your daily calorie needs"
            : "We'll calculate research-based macro targets for your goal"
          }
        </p>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            step === 1 ? 'bg-emerald-600 text-white' : 'bg-emerald-600 text-white'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 ${step === 2 ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            step === 2 ? 'bg-emerald-600 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600'
          }`}>
            2
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
          {/* Unit System */}
          <div>
            <label className="block text-lg font-semibold mb-3">Unit System</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => updateField('unit', 'metric')}
                className={`py-4 px-6 rounded-lg font-semibold text-lg border-2 transition-colors ${
                  formData.unit === 'metric'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                }`}
              >
                Metric (kg, cm)
              </button>
              <button
                type="button"
                onClick={() => updateField('unit', 'imperial')}
                className={`py-4 px-6 rounded-lg font-semibold text-lg border-2 transition-colors ${
                  formData.unit === 'imperial'
                    ? 'bg-emerald-600 text-white border-emerald-500'
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
              placeholder="25"
            />
          </div>

          {/* Sex */}
          <div>
            <label className="block text-lg font-semibold mb-3">Sex</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => updateField('sex', 'male')}
                className={`py-4 px-6 rounded-lg font-semibold text-lg border-2 transition-colors ${
                  formData.sex === 'male'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => updateField('sex', 'female')}
                className={`py-4 px-6 rounded-lg font-semibold text-lg border-2 transition-colors ${
                  formData.sex === 'female'
                    ? 'bg-emerald-600 text-white border-emerald-500'
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
              Choose based on your daily lifestyle, NOT planned exercise. You'll log workouts separately.
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

            <div className="mt-4 text-sm">
              <p className="mt-3 text-xs italic text-gray-600 dark:text-gray-400">
                Most people choose Sedentary or Light. Your workouts will be logged separately!
              </p>
            </div>
          </div>

            </>
          )}

          {step === 2 && (
            <>
              {/* Custom Goals Toggle */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="useCustomGoals"
                    checked={useCustomGoals}
                    onChange={(e) => setUseCustomGoals(e.target.checked)}
                    className="w-5 h-5 text-emerald-500 rounded"
                  />
                  <label htmlFor="useCustomGoals" className="text-lg font-semibold cursor-pointer">
                    Custom Calories & Macros (Advanced)
                  </label>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {useCustomGoals
                    ? "Set your own calorie and macro targets instead of using preset goals."
                    : "Choose from research-based fitness goals with automatic calorie and macro calculations."}
                </p>
              </div>

              {/* Custom Macros Input - Only shown when using custom goals */}
              {useCustomGoals && (
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Protein (g)</label>
                      <input
                        type="number"
                        min="0"
                        value={customMacros.protein}
                        onChange={(e) => setCustomMacros({ ...customMacros, protein: parseInt(e.target.value) || 0 })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Carbs (g)</label>
                      <input
                        type="number"
                        min="0"
                        value={customMacros.carbs}
                        onChange={(e) => setCustomMacros({ ...customMacros, carbs: parseInt(e.target.value) || 0 })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Fat (g)</label>
                      <input
                        type="number"
                        min="0"
                        value={customMacros.fat}
                        onChange={(e) => setCustomMacros({ ...customMacros, fat: parseInt(e.target.value) || 0 })}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total: {(customMacros.protein * 4) + (customMacros.carbs * 4) + (customMacros.fat * 9)} calories from macros
                  </div>
                </div>
              )}

              {/* Fitness Goal Selection - Only shown when NOT using custom goals */}
              {!useCustomGoals && (
                <div className="space-y-4">
                  {Object.values(FITNESS_GOALS).map((goalKey) => {
                  const goal = GOAL_INFO[goalKey];
                  return (
                    <button
                      key={goalKey}
                      type="button"
                      onClick={() => updateField('fitnessGoal', goalKey)}
                      className={`w-full text-left p-6 rounded-lg border-2 transition-colors ${
                        formData.fitnessGoal === goalKey
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-emerald-300'
                      }`}
                    >
                      <div className="font-bold text-xl mb-2">{goal.label}</div>
                      <div className="text-gray-600 dark:text-gray-400 mb-3">
                        {goal.description}
                      </div>
                      <div className="text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                        <span className="font-semibold">Research-based targets: </span>
                        {goal.explanation}
                      </div>
                    </button>
                  );
                })}
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary w-full"
              >
                ← Back
              </button>
            </>
          )}

          <button type="submit" className="btn-primary w-full mt-8">
            {step === 1 ? 'Continue' : 'Complete Setup'}
          </button>
        </form>

        {/* Medical Disclaimer */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong className="font-semibold">Disclaimer:</strong> This app provides estimates for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Consult a doctor or registered dietitian before starting any diet or exercise program, especially if you have any pre-existing health conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
