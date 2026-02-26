import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, saveProfile, saveDailyGoal, getData, setData, getCustomMacros, saveCustomMacros, clearCustomMacros, getCustomCalorieGoal, saveCustomCalorieGoal, clearCustomCalorieGoal, getWaterTrackerEnabled, saveWaterTrackerEnabled, getMealTypeEnabled, saveMealTypeEnabled, calculateUserStats } from '../utils/storage';
import { calculateBMR, calculateTDEE, getBaselineTDEE } from '../utils/calculations';
import { FITNESS_GOALS, GOAL_INFO, calculateMacroTargets } from '../utils/macros';
import { APP_VERSION, VERSION_DATE } from '../version';
import { handleExport } from '../utils/backupExport';
import { sanitizeObject } from '../utils/sanitize';
import ConfirmationModal from './ConfirmationModal';

export default function Settings({ onUpdateProfile, onClose }) {
  const currentProfile = getProfile();
  const fileInputRef = useRef(null);
  const [importMessage, setImportMessage] = useState('');
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [pendingImportData, setPendingImportData] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [useCustomGoals, setUseCustomGoals] = useState(!!(getCustomMacros() || getCustomCalorieGoal()));
  const currentCustomMacros = getCustomMacros() || { protein: 150, carbs: 200, fat: 65 };
  const [customMacros, setCustomMacros] = useState(currentCustomMacros);
  const [waterTrackerEnabled, setWaterTrackerEnabled] = useState(getWaterTrackerEnabled());
  const [mealTypeEnabled, setMealTypeEnabled] = useState(getMealTypeEnabled());

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

    // Save or clear custom goals
    if (useCustomGoals) {
      saveCustomMacros(customMacros);
      // Calculate net goal: Total Calories from Macros - Lifestyle TDEE
      const totalCaloriesFromMacros = (customMacros.protein * 4) + (customMacros.carbs * 4) + (customMacros.fat * 9);
      const bmrForGoal = calculateBMR(profile);
      const tdeeForGoal = calculateTDEE(bmrForGoal, formData.activityLevel);
      const netCalorieGoal = totalCaloriesFromMacros - tdeeForGoal;
      saveCustomCalorieGoal(netCalorieGoal);
      saveDailyGoal(netCalorieGoal);
    } else {
      clearCustomMacros();
      clearCustomCalorieGoal();
      // Auto-set net calorie goal based on fitness goal
      const bmrForGoal = calculateBMR(profile);
      const tdeeForGoal = calculateTDEE(bmrForGoal, formData.activityLevel);
      const macroTargets = calculateMacroTargets(weight, tdeeForGoal, formData.fitnessGoal);
      saveDailyGoal(macroTargets.calorieAdjustment);
    }

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

  // Export all data as JSON
  const onExport = () => {
    handleExport();
    setImportMessage('Data exported successfully!');
    setTimeout(() => setImportMessage(''), 3000);
  };

  // Perform the actual import after confirmation
  const handleDeleteAllData = () => {
    // Clear all localStorage
    localStorage.clear();

    // Reload the page to reset to profile setup
    window.location.reload();
  };

  const performImport = () => {
    if (!pendingImportData) return;

    const importData = pendingImportData;

    // Sanitize all imported data to prevent XSS attacks
    if (importData.profile) setData('profile', sanitizeObject(importData.profile));
    if (importData.foodLog) setData('foodLog', sanitizeObject(importData.foodLog));
    if (importData.exerciseLog) setData('exerciseLog', sanitizeObject(importData.exerciseLog));
    if (importData.favorites) setData('favorites', sanitizeObject(importData.favorites));
    if (importData.recentFoods) setData('recentFoods', sanitizeObject(importData.recentFoods));
    if (importData.dailyGoal !== undefined) setData('dailyGoal', importData.dailyGoal);
    if (importData.weightLog) setData('weightLog', sanitizeObject(importData.weightLog));
    if (importData.darkMode !== undefined) setData('darkMode', importData.darkMode);
    if (importData.customFoods) setData('customFoods', sanitizeObject(importData.customFoods));
    if (importData.customMacros) setData('customMacros', importData.customMacros);
    if (importData.waterLog) setData('waterLog', importData.waterLog);
    if (importData.waterUnit) setData('waterUnit', importData.waterUnit);
    if (importData.workoutTemplates) setData('workoutTemplates', sanitizeObject(importData.workoutTemplates));

    setShowImportConfirm(false);
    setPendingImportData(null);
    setImportMessage('Data imported successfully! Refreshing...');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  // Import data from JSON file
  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result);

        // Validate the data structure
        if (!importData.profile || !importData.version) {
          setImportMessage('Error: Invalid backup file format');
          setTimeout(() => setImportMessage(''), 5000);
          return;
        }

        // Validate profile structure
        if (typeof importData.profile !== 'object' ||
            !importData.profile.age ||
            !importData.profile.sex ||
            !importData.profile.height ||
            !importData.profile.weight) {
          setImportMessage('Error: Invalid profile data in backup file');
          setTimeout(() => setImportMessage(''), 5000);
          return;
        }

        // Validate arrays are actually arrays
        if (importData.foodLog && !Array.isArray(importData.foodLog)) {
          setImportMessage('Error: Invalid food log data');
          setTimeout(() => setImportMessage(''), 5000);
          return;
        }
        if (importData.exerciseLog && !Array.isArray(importData.exerciseLog)) {
          setImportMessage('Error: Invalid exercise log data');
          setTimeout(() => setImportMessage(''), 5000);
          return;
        }
        if (importData.weightLog && !Array.isArray(importData.weightLog)) {
          setImportMessage('Error: Invalid weight log data');
          setTimeout(() => setImportMessage(''), 5000);
          return;
        }

        // Show confirmation modal before importing
        setPendingImportData(importData);
        setShowImportConfirm(true);
      } catch (error) {
        setImportMessage('Error: Failed to parse backup file');
        setTimeout(() => setImportMessage(''), 5000);
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      {/* Dashboard Customization */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Dashboard Customization</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="waterTrackerEnabled"
              checked={waterTrackerEnabled}
              onChange={(e) => {
                setWaterTrackerEnabled(e.target.checked);
                saveWaterTrackerEnabled(e.target.checked);
              }}
              className="w-5 h-5 text-emerald-500 rounded mt-1"
            />
            <div>
              <label htmlFor="waterTrackerEnabled" className="text-lg font-semibold cursor-pointer">
                Show Water Intake Tracker
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Display the water intake tracker on your dashboard to track daily hydration.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="mealTypeEnabled"
              checked={mealTypeEnabled}
              onChange={(e) => {
                setMealTypeEnabled(e.target.checked);
                saveMealTypeEnabled(e.target.checked);
              }}
              className="w-5 h-5 text-emerald-500 rounded mt-1"
            />
            <div>
              <label htmlFor="mealTypeEnabled" className="text-lg font-semibold cursor-pointer">
                Categorize meals by type
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Prompt to assign each food to Breakfast, Lunch, Dinner, or Snacks when logging.
              </p>
            </div>
          </div>
        </div>
      </div>

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
                    ? 'bg-emerald-600 text-white border-emerald-500'
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
                    ? 'bg-emerald-600 text-white border-emerald-500'
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
            </select>

            <div className="mt-4 text-sm">
              <p className="mt-3 text-xs italic text-gray-600 dark:text-gray-400">
                Most people choose Sedentary or Light. Log your workouts separately in the Exercise section!
              </p>
            </div>
          </div>

          {/* Custom Goals Toggle */}
          <div>
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
                : "Using preset fitness goals with automatic calorie and macro calculations."}
            </p>
          </div>

          {/* Fitness Goal - Only shown when NOT using custom goals */}
          {!useCustomGoals && (
            <div>
              <label className="block text-lg font-semibold mb-3">Fitness Goal</label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Automatically sets your net calorie goal and research-based macro targets
              </p>
            <div className="space-y-3">
              {Object.values(FITNESS_GOALS).map((goalKey) => {
                const goal = GOAL_INFO[goalKey];
                // Calculate net goal based on current weight (preview)
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
                        net: {netCalorieGoal >= 0 ? '+' : ''}{netCalorieGoal} cal
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
                <p className="font-semibold mb-1">💡 Based on standard nutrition formulas:</p>
                <p className="text-xs">
                  Your net calorie goal will be automatically set based on your fitness goal.
                  You can still adjust it manually from the Dashboard if needed.
                </p>
              </div>
            </div>
          )}

          {/* Custom Goals Inputs - Only shown when using custom goals */}
          {useCustomGoals && (() => {
            const totalCaloriesFromMacros = (customMacros.protein * 4) + (customMacros.carbs * 4) + (customMacros.fat * 9);
            const netCalorieGoal = totalCaloriesFromMacros - tdee;

            return (
              <div className="space-y-4 p-4 border-2 border-emerald-500 rounded-lg bg-emerald-50 dark:bg-emerald-900/10">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Set your daily macro targets. Your net calorie goal is calculated automatically.
                </p>

                {/* Custom Macros */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Daily Macro Targets (grams)
                  </label>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-red-600 dark:text-red-400">
                        Protein (g)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={customMacros.protein}
                        onChange={(e) => setCustomMacros({ ...customMacros, protein: parseInt(e.target.value) || 0 })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-blue-600 dark:text-blue-400">
                        Carbs (g)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={customMacros.carbs}
                        onChange={(e) => setCustomMacros({ ...customMacros, carbs: parseInt(e.target.value) || 0 })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-amber-600 dark:text-amber-400">
                        Fat (g)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={customMacros.fat}
                        onChange={(e) => setCustomMacros({ ...customMacros, fat: parseInt(e.target.value) || 0 })}
                        className="input-field"
                      />
                    </div>
                  </div>

                  {/* Calculation Display */}
                  <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600">
                    <p className="font-semibold text-sm mb-3">Calorie Calculation:</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-violet-600 dark:text-violet-400">Protein: {customMacros.protein}g × 4</span>
                        <span className="font-semibold">{customMacros.protein * 4} cal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-orange-600 dark:text-orange-400">Carbs: {customMacros.carbs}g × 4</span>
                        <span className="font-semibold">{customMacros.carbs * 4} cal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-teal-600 dark:text-teal-400">Fat: {customMacros.fat}g × 9</span>
                        <span className="font-semibold">{customMacros.fat * 9} cal</span>
                      </div>
                      <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total Goal Calories:</span>
                          <span className="text-emerald-600 dark:text-emerald-400">{totalCaloriesFromMacros} cal</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>- Lifestyle TDEE:</span>
                        <span className="font-semibold">-{tdee} cal</span>
                      </div>
                      <div className="border-t-2 border-emerald-500 dark:border-emerald-600 pt-2 mt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span>net Calorie Goal:</span>
                          <span className={netCalorieGoal < 0 ? 'text-orange-600 dark:text-orange-400' : netCalorieGoal > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}>
                            {netCalorieGoal >= 0 ? '+' : ''}{netCalorieGoal} cal
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                          {netCalorieGoal < 0 ? 'Deficit (lose weight)' : netCalorieGoal > 0 ? 'Surplus (gain weight)' : 'Maintenance'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          <button type="submit" className="btn-primary w-full">
            Save Changes
          </button>
        </form>
      </div>

      {/* Support Free Calorie Track */}
      <div className="card bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border-2 border-emerald-200 dark:border-emerald-800">
        <h2 className="text-2xl font-bold mb-4">Support Free Calorie Track</h2>

        {(() => {
          const stats = calculateUserStats();
          return (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.monthsUsing}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Months Using</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.mealsLogged}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Meals Logged</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.workouts}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Workouts</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    ${stats.savedVsCompetitors}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Saved</div>
                </div>
              </div>

              {/* Message */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                {stats.foodLogs > 0 || stats.workouts > 0 ? (
                  <>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      You've saved about ${stats.savedVsCompetitors} compared to other subscription-based trackers!
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Free Calorie Track has no ads, no paywalls, and no premium tiers.
                      If it's helping you hit your goals, consider chipping in to keep it free for everyone.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Free Calorie Track has no ads, no paywalls, and no premium tiers.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      If you find this useful, consider supporting it with a small donation to keep it free for everyone.
                    </p>
                  </>
                )}
              </div>
            </>
          );
        })()}

        {/* Donation Button */}
        <a
          href="https://buymeacoffee.com/griffs"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 px-6 rounded-lg font-semibold text-center bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
        >
          Chip in $5
        </a>

        {/* Subtle link to gear reviews */}
        <p className="text-center mt-3">
          <Link
            to="/blog?category=Gear+Reviews"
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            Gear recommendations →
          </Link>
        </p>
      </div>

      {/* Share Section */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Share Free Calorie Track</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Help others discover a truly free calorie tracker with no paywalls!
        </p>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Free Calorie Track',
                text: 'Check out this completely free calorie and macro tracker - no paywalls, no ads, just simple tracking!',
                url: 'https://freecalorietrack.com'
              }).catch(() => {
                // User cancelled share, do nothing
              });
            } else {
              // Fallback: copy link to clipboard
              navigator.clipboard.writeText('https://freecalorietrack.com').then(() => {
                setImportMessage('Link copied to clipboard!');
                setTimeout(() => setImportMessage(''), 3000);
              });
            }
          }}
          className="btn-primary w-full"
        >
          📤 Share This App
        </button>
      </div>

      {/* Data Management Section */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Data Management</h2>

        {/* Warning Banner */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-500 p-4 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                Important: Your Data is Stored Locally
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                All your data is stored in your browser's local storage. If you clear your browser cache or data,
                <strong> all your tracking data will be permanently deleted</strong>.
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Recommendation:</strong> Export your data regularly to create backups. You can import it later
                if you need to restore or transfer your data.
              </p>
            </div>
          </div>
        </div>

        {/* Export/Import Buttons */}
        <div className="space-y-4">
          <div>
            <button
              onClick={onExport}
              className="w-full py-3 px-6 rounded-lg font-semibold border-2 border-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              📥 Export Data (Download Backup)
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Download all your data as a JSON file. Keep this file safe as a backup.
            </p>
          </div>

          <div>
            <label htmlFor="import-file-input" className="sr-only">Import backup file</label>
            <input
              id="import-file-input"
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary w-full"
            >
              📤 Import Data (Restore from Backup)
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Upload a previously exported backup file. This will replace all current data.
            </p>
          </div>

          {/* Import/Export Message */}
          {importMessage && (
            <div className={`p-3 rounded-lg text-center font-semibold ${
              importMessage.includes('Error')
                ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                : 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
            }`}>
              {importMessage}
            </div>
          )}

          {/* Storage Usage Indicator */}
          <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6 mt-6">
            {(() => {
              // Calculate localStorage usage
              let totalSize = 0;
              for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                  totalSize += localStorage[key].length + key.length;
                }
              }
              const sizeInKB = (totalSize / 1024).toFixed(2);
              const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
              const maxSizeMB = 5; // Typical localStorage limit
              const percentUsed = ((totalSize / (maxSizeMB * 1024 * 1024)) * 100).toFixed(1);

              const isWarning = percentUsed >= 90 && percentUsed < 95;
              const isDanger = percentUsed >= 95;

              return (
                <div className={`p-4 rounded-lg mb-6 border-2 ${
                  isDanger
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                    : isWarning
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                }`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{isDanger ? '⚠️' : isWarning ? '📊' : '💾'}</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-2">Storage Usage</p>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              isDanger
                                ? 'bg-red-600'
                                : isWarning
                                  ? 'bg-yellow-500'
                                  : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(percentUsed, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold min-w-[60px] text-right">
                          {percentUsed}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Using {sizeInMB} MB of ~{maxSizeMB} MB available ({sizeInKB} KB)
                      </p>
                      {isWarning && (
                        <p className="text-sm mt-2 text-yellow-800 dark:text-yellow-200">
                          {isDanger
                            ? '⚠️ Storage almost full! Consider exporting and deleting old data.'
                            : '💡 Tip: Export your data periodically to free up space.'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Delete All Data Section */}
          <div>
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 p-4 rounded-lg mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🗑️</span>
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-100 mb-2">
                    Delete All Data
                  </p>
                  <p className="text-sm text-red-800 dark:text-red-200">
                    This will permanently delete all your data including food logs, exercise logs, weight history, custom foods, recipes, and profile information. This action cannot be undone and there is no way to recover your data after deletion.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 px-6 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              🗑️ Delete All Data Permanently
            </button>
          </div>
        </div>
      </div>

      {/* Trademark Disclaimer */}
      <div className="card bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-sm mb-2 text-gray-900 dark:text-gray-100">Trademarks</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          Product names, logos, and brands are property of their respective owners. All company, product and service names used in this app are for identification purposes only. Use of these names, logos, and brands does not imply endorsement.
        </p>
      </div>

      {/* Version Info */}
      <div className="card bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Free Calorie Track
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Version {APP_VERSION} • {VERSION_DATE}
          </p>
        </div>
      </div>

      {/* Import Confirmation Modal */}
      <ConfirmationModal
        isOpen={showImportConfirm}
        onConfirm={performImport}
        onCancel={() => {
          setShowImportConfirm(false);
          setPendingImportData(null);
        }}
        title="Replace All Data?"
        message="This will permanently replace all your current data with the imported backup. This action cannot be undone. Are you sure?"
        confirmText="Yes, Import Data"
        cancelText="Cancel"
        danger={true}
      />

      {/* Delete All Data Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onConfirm={handleDeleteAllData}
        onCancel={() => setShowDeleteConfirm(false)}
        title="Delete All Data?"
        message="This will PERMANENTLY DELETE all your data including food logs, exercise logs, weight history, custom foods, recipes, and profile. This action CANNOT be undone. Are you absolutely sure you want to delete everything?"
        confirmText="Yes, Delete Everything"
        cancelText="Cancel"
        danger={true}
      />
    </div>
  );
}
