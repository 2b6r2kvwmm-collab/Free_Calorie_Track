import { useState, useEffect } from 'react';
import { FITNESS_GOALS, GOAL_INFO } from '../utils/macros';
import { saveCustomMacros, clearCustomMacros, saveCustomCalorieGoal, clearCustomCalorieGoal } from '../utils/storage';
import { calculateBMR, calculateTDEE, getBaselineTDEE } from '../utils/calculations';

const toggleBtn = (active) =>
  `flex-1 py-2 px-3 rounded-lg text-sm font-semibold border-2 transition-all ${
    active
      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-sm'
      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-emerald-300'
  }`;

export default function ProfileSetup({ onComplete }) {
  const [step, setStep] = useState(1);
  const [useCustomGoals, setUseCustomGoals] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(true);
  const [customMacros, setCustomMacros] = useState({ protein: 150, carbs: 200, fat: 65 });
  const [formData, setFormData] = useState({
    birthYear: '',
    sex: 'male',
    height: '',
    heightFeet: '',
    heightInches: '',
    weight: '',
    activityLevel: 'moderate',
    unit: 'imperial',
    fitnessGoal: FITNESS_GOALS.MAINTENANCE,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    history.pushState({}, '', '/profile-setup-shown');
  }, []);

  const isTooYoung = formData.birthYear && (new Date().getFullYear() - parseInt(formData.birthYear) < 13);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isTooYoung) return;
    if (step === 1) { setStep(2); window.scrollTo(0, 0); return; }

    let height = parseFloat(formData.height);
    let weight = parseFloat(formData.weight);

    if (formData.unit === 'imperial') {
      const totalInches = (parseInt(formData.heightFeet) || 0) * 12 + (parseInt(formData.heightInches) || 0);
      height = totalInches * 2.54;
      weight = weight * 0.453592;
    }

    const age = new Date().getFullYear() - parseInt(formData.birthYear);

    const profile = {
      age,
      birthYear: parseInt(formData.birthYear),
      sex: formData.sex,
      height,
      weight,
      activityLevel: formData.activityLevel,
      unit: formData.unit,
      fitnessGoal: formData.fitnessGoal,
    };

    if (useCustomGoals) {
      saveCustomMacros(customMacros);
      const totalCaloriesFromMacros = (customMacros.protein * 4) + (customMacros.carbs * 4) + (customMacros.fat * 9);
      const bmr = calculateBMR(profile);
      const baselineTDEE = getBaselineTDEE(bmr);
      saveCustomCalorieGoal(Math.round(totalCaloriesFromMacros - baselineTDEE));
    } else {
      clearCustomMacros();
      clearCustomCalorieGoal();
    }

    onComplete(profile);
  };

  const updateField = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-lg w-full">

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold mb-1">
            {step === 1 ? 'Set up your profile' : 'Choose your goal'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {step === 1
              ? 'We use this to calculate your daily calorie needs'
              : "We'll calculate macro targets based on research"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 1 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
          }`}>1</div>
          <div className={`h-0.5 w-12 rounded ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 2 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
          }`}>2</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              {/* Unit System */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Unit system</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => updateField('unit', 'imperial')} className={toggleBtn(formData.unit === 'imperial')}>
                    Imperial (lbs, ft)
                  </button>
                  <button type="button" onClick={() => updateField('unit', 'metric')} className={toggleBtn(formData.unit === 'metric')}>
                    Metric (kg, cm)
                  </button>
                </div>
              </div>

              {/* Birth Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Birth year</label>
                <input
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear() - 13}
                  value={formData.birthYear}
                  onChange={(e) => updateField('birthYear', e.target.value)}
                  className="input-field"
                  placeholder={new Date().getFullYear() - 30}
                />
                {isTooYoung && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    You must be at least 13 years old to use Free Calorie Track.
                  </p>
                )}
              </div>

              {/* Sex */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Sex</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => updateField('sex', 'male')} className={toggleBtn(formData.sex === 'male')}>
                    Male
                  </button>
                  <button type="button" onClick={() => updateField('sex', 'female')} className={toggleBtn(formData.sex === 'female')}>
                    Female
                  </button>
                </div>
              </div>

              {/* Height + Weight */}
              {formData.unit === 'metric' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Height (cm)</label>
                    <input
                      type="number"
                      required
                      min="50"
                      max="300"
                      step="0.1"
                      value={formData.height}
                      onChange={(e) => updateField('height', e.target.value)}
                      className="input-field"
                      placeholder="170"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Weight (kg)</label>
                    <input
                      type="number"
                      required
                      min="20"
                      max="500"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => updateField('weight', e.target.value)}
                      className="input-field"
                      placeholder="70"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Feet</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="8"
                      value={formData.heightFeet}
                      onChange={(e) => updateField('heightFeet', e.target.value)}
                      className="input-field"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Inches</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="11"
                      value={formData.heightInches}
                      onChange={(e) => updateField('heightInches', e.target.value)}
                      className="input-field"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Weight (lbs)</label>
                    <input
                      type="number"
                      required
                      min="20"
                      max="1100"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => updateField('weight', e.target.value)}
                      className="input-field"
                      placeholder="165"
                    />
                  </div>
                </div>
              )}

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Daily activity level
                  <span className="text-xs font-normal text-gray-400 dark:text-gray-500 ml-1">— lifestyle only, not workouts</span>
                </label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => updateField('activityLevel', e.target.value)}
                  className="input-field"
                >
                  <option value="sedentary">Sedentary — desk job, little movement</option>
                  <option value="light">Light — teacher, salesperson, light tasks</option>
                  <option value="moderate">Moderate — nurse, on feet most of the day</option>
                  <option value="active">Active — construction, farm work, physical job</option>
                  <option value="veryActive">Very Active — professional athlete, extremely physical</option>
                </select>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Most people choose Sedentary or Light. Workouts are logged separately.</p>
              </div>

              {/* Live TDEE preview */}
              {(() => {
                const birthYear = parseInt(formData.birthYear);
                const age = birthYear ? new Date().getFullYear() - birthYear : null;
                if (!age || age < 13 || age > 120) return null;
                let weightKg, heightCm;
                if (formData.unit === 'metric') {
                  weightKg = parseFloat(formData.weight);
                  heightCm = parseFloat(formData.height);
                } else {
                  weightKg = parseFloat(formData.weight) * 0.453592;
                  const totalInches = (parseInt(formData.heightFeet) || 0) * 12 + (parseInt(formData.heightInches) || 0);
                  heightCm = totalInches * 2.54;
                }
                if (!weightKg || !heightCm || weightKg < 20 || heightCm < 50) return null;
                const bmr = calculateBMR({ weight: weightKg, height: heightCm, age, sex: formData.sex });
                const tdee = Math.round(calculateTDEE(bmr, formData.activityLevel));
                return (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wide mb-0.5">Estimated daily calories</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{tdee.toLocaleString()} cal</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">You'll choose your goal on the next step</p>
                  </div>
                );
              })()}
            </>
          )}

          {step === 2 && (
            <>
              {/* Custom Goals Toggle */}
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
                <input
                  type="checkbox"
                  id="useCustomGoals"
                  checked={useCustomGoals}
                  onChange={(e) => setUseCustomGoals(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded"
                />
                <label htmlFor="useCustomGoals" className="text-sm font-medium cursor-pointer">
                  Set custom calories & macros instead
                </label>
              </div>

              {useCustomGoals ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Protein (g)</label>
                      <input
                        type="number"
                        min="0"
                        value={customMacros.protein}
                        onChange={(e) => setCustomMacros({ ...customMacros, protein: parseInt(e.target.value) || 0 })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Carbs (g)</label>
                      <input
                        type="number"
                        min="0"
                        value={customMacros.carbs}
                        onChange={(e) => setCustomMacros({ ...customMacros, carbs: parseInt(e.target.value) || 0 })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fat (g)</label>
                      <input
                        type="number"
                        min="0"
                        value={customMacros.fat}
                        onChange={(e) => setCustomMacros({ ...customMacros, fat: parseInt(e.target.value) || 0 })}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total: {(customMacros.protein * 4) + (customMacros.carbs * 4) + (customMacros.fat * 9)} cal from macros
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.values(FITNESS_GOALS).map((goalKey) => {
                    const goal = GOAL_INFO[goalKey];
                    return (
                      <button
                        key={goalKey}
                        type="button"
                        onClick={() => updateField('fitnessGoal', goalKey)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          formData.fitnessGoal === goalKey
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                        }`}
                      >
                        <div className="font-semibold mb-0.5">{goal.label}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{goal.description}</div>
                        {formData.fitnessGoal === goalKey && (
                          <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-2">{goal.explanation}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="disclaimerAccepted"
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-emerald-500 rounded flex-shrink-0"
                />
                <label htmlFor="disclaimerAccepted" className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed cursor-pointer">
                  I understand that Free Calorie Track provides estimates for informational purposes only and is not a substitute for professional medical advice.
                </label>
              </div>

              <button type="button" onClick={() => { setStep(1); window.scrollTo(0, 0); }} className="btn-secondary w-full text-base py-2.5">
                ← Back
              </button>
            </>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={(step === 2 && !disclaimerAccepted) || !!isTooYoung}
          >
            {step === 1 ? 'Continue →' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}
