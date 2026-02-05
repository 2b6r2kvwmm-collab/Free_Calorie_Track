import { useState, useEffect } from 'react';
import {
  getTodayEntries,
  deleteFoodEntry,
  deleteExerciseEntry,
  updateFoodEntry,
  updateExerciseEntry,
  getProfile,
  getDailyGoal,
  saveDailyGoal,
  getFoodLog,
  getExerciseLog,
  addFoodEntry,
  addExerciseEntry,
  getCustomMacros,
  getCustomCalorieGoal,
  getLocalDateString,
  getWaterTrackerEnabled,
  getMilestonesShown,
  markMilestoneShown,
  calculateUserStats,
  getBackupReminderState,
  markBackupReminderShown,
  hasExported,
} from '../utils/storage';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import {
  calculateBMR,
  calculateTDEE,
} from '../utils/calculations';
import {
  updateDailyStreak,
  trackWorkout,
  trackFoodEntry,
  getMotivationalNudge,
  getGamificationData,
  getRecentAchievements,
} from '../utils/gamification';
import { calculateMacroTargets } from '../utils/macros';
import FoodInput from './FoodInput';
import ExerciseLog from './ExerciseLog';
import MacroTracker from './MacroTracker';
import Achievements from './Achievements';
import WaterTracker from './WaterTracker';
import MilestoneModal from './MilestoneModal';
import BackupReminderModal from './BackupReminderModal';

export default function Dashboard({ onRefresh }) {
  const [entries, setEntries] = useState({ food: [], exercise: [] });
  const [showFoodInput, setShowFoodInput] = useState(false);
  const [showExerciseLog, setShowExerciseLog] = useState(false);
  const [showGoalEdit, setShowGoalEdit] = useState(false);
  const goalModalRef = useModalAccessibility(showGoalEdit, () => setShowGoalEdit(false));
  const [goalInput, setGoalInput] = useState('');
  const [showAchievements, setShowAchievements] = useState(false);
  const [showNewAchievement, setShowNewAchievement] = useState(null);
  const [editingFood, setEditingFood] = useState(null); // timestamp of food entry being edited
  const [editingExercise, setEditingExercise] = useState(null); // timestamp of exercise entry being edited
  const [editFormData, setEditFormData] = useState({});
  const [showMilestone, setShowMilestone] = useState(null);
  const [showBackupReminder, setShowBackupReminder] = useState(false);
  const waterTrackerEnabled = getWaterTrackerEnabled();

  const profile = getProfile();

  const loadEntries = () => {
    setEntries(getTodayEntries());
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel); // Lifestyle TDEE with activity level
  const restingBurned = tdee; // Full day's resting calories (end-of-day calculation)

  const caloriesEaten = entries.food.reduce((sum, entry) => sum + entry.calories, 0);
  const exerciseBurned = entries.exercise.reduce((sum, entry) => sum + entry.caloriesBurned, 0);
  const totalBurned = restingBurned + exerciseBurned;
  const netCalories = caloriesEaten - totalBurned;

  // Calculate total macros
  const totalProtein = entries.food.reduce((sum, entry) => sum + (entry.protein || 0), 0);
  const totalCarbs = entries.food.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
  const totalFat = entries.food.reduce((sum, entry) => sum + (entry.fat || 0), 0);

  // Gamification
  const gamificationData = getGamificationData();
  const customMacros = getCustomMacros();
  const customCalorieGoal = getCustomCalorieGoal();

  // Determine if using custom goals (both custom macros AND custom calorie goal must be set)
  const usingCustomGoals = !!(customMacros && customCalorieGoal !== null);

  const macroTargets = usingCustomGoals
    ? customMacros
    : (profile.fitnessGoal ? calculateMacroTargets(profile.weight, tdee, profile.fitnessGoal) : null);
  const proteinGoal = macroTargets?.protein || 0;
  const carbsGoal = macroTargets?.carbs || 0;
  const fatGoal = macroTargets?.fat || 0;

  // Use custom calorie goal if set, otherwise use calculated goal from fitness goal
  const dailyGoal = usingCustomGoals
    ? customCalorieGoal
    : (macroTargets?.calorieAdjustment ?? getDailyGoal());

  const motivationalNudge = getMotivationalNudge(netCalories, dailyGoal, totalProtein, proteinGoal);
  const recentAchievements = getRecentAchievements();

  // Update streak when component loads
  useEffect(() => {
    updateDailyStreak(netCalories, dailyGoal);
  }, [netCalories, dailyGoal]);

  // Check for milestone celebrations and backup reminders
  useEffect(() => {
    const stats = calculateUserStats();
    const milestonesShown = getMilestonesShown();
    const { daysTracked } = stats;

    // Check 365-day milestone first (highest priority)
    if (daysTracked >= 365 && !milestonesShown.days365) {
      setShowMilestone(365);
      return;
    }

    // Check 180-day milestone
    if (daysTracked >= 180 && !milestonesShown.days180) {
      setShowMilestone(180);
      return;
    }

    // Check 60-day milestone
    if (daysTracked >= 60 && !milestonesShown.days60) {
      setShowMilestone(60);
      return;
    }

    // Backup reminder: only if no milestone is showing and user hasn't exported
    if (!hasExported()) {
      const backupState = getBackupReminderState();

      if (daysTracked >= 30 && !backupState.day30) {
        setShowBackupReminder(true);
        markBackupReminderShown('day30');
        return;
      }

      if (daysTracked >= 10 && !backupState.day10) {
        setShowBackupReminder(true);
        markBackupReminderShown('day10');
        return;
      }
    }
  }, []); // Only run once on mount

  // Get previous 3 days net calories
  const foodLog = getFoodLog();
  const exerciseLog = getExerciseLog();
  const daysTracked = new Set(foodLog.map(e => e.date)).size;

  const today = new Date();
  const previousDays = [];

  for (let i = 1; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayFood = foodLog.filter(entry => entry.date === dateStr);
    const dayExercise = exerciseLog.filter(entry => entry.date === dateStr);

    const eaten = dayFood.reduce((sum, entry) => sum + entry.calories, 0);
    const burned = tdee + // Full day's resting calories (lifestyle TDEE)
                   dayExercise.reduce((sum, entry) => sum + entry.caloriesBurned, 0);

    // Only calculate net calories if there's data for the day (food or exercise logged)
    const hasData = dayFood.length > 0 || dayExercise.length > 0;

    previousDays.push({
      label: i === 1 ? 'Yesterday' : `${i} days ago`,
      netCal: hasData ? eaten - burned : null,
      hasData
    });
  }

  // Today's date formatting
  const todayFormatted = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Color coding based on NET calories vs NET goal
  let statusColor = 'text-emerald-600 dark:text-emerald-400';
  let statusBg = 'bg-emerald-50 dark:bg-emerald-900/20';

  if (netCalories > dailyGoal) {
    statusColor = 'text-red-600 dark:text-red-400';
    statusBg = 'bg-red-50 dark:bg-red-900/20';
  } else if (netCalories > dailyGoal * 0.9) {
    statusColor = 'text-yellow-600 dark:text-yellow-400';
    statusBg = 'bg-yellow-50 dark:bg-yellow-900/20';
  }

  const handleAddFood = (food) => {
    const entry = {
      name: food.name,
      calories: food.calories,
      servingSize: food.servingSize,
      barcode: food.barcode,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
      // Store base values for quantity-based editing
      baseCalories: food.calories,
      baseProtein: food.protein || 0,
      baseCarbs: food.carbs || 0,
      baseFat: food.fat || 0,
      quantity: 1, // Default multiplier
    };
    addFoodEntry(entry);
    trackFoodEntry();
    loadEntries();
    onRefresh();
  };

  const handleAddExercise = (exercise) => {
    addExerciseEntry(exercise);
    trackWorkout();
    loadEntries();
    onRefresh();
  };

  const handleDeleteFood = (timestamp) => {
    deleteFoodEntry(timestamp);
    loadEntries();
    onRefresh();
  };

  const handleDeleteExercise = (timestamp) => {
    deleteExerciseEntry(timestamp);
    loadEntries();
    onRefresh();
  };

  // Helper function to extract grams from serving size
  const extractGrams = (servingSize) => {
    if (!servingSize) return 100;
    // Match patterns like "100g", "(50g)", "100ml"
    const match = servingSize.match(/(\d+(?:\.\d+)?)\s*(g|ml)/i);
    return match ? parseFloat(match[1]) : 100;
  };

  const handleEditFood = (entry) => {
    setEditingFood(entry.timestamp);
    // Extract base grams from serving size
    const baseGrams = extractGrams(entry.servingSize);
    // Calculate current grams from quantity
    const currentQuantity = entry.quantity || 1;
    const currentGrams = baseGrams * currentQuantity;

    setEditFormData({
      grams: currentGrams,
      baseGrams: baseGrams,
      baseCalories: entry.baseCalories || entry.calories,
      baseProtein: entry.baseProtein || entry.protein || 0,
      baseCarbs: entry.baseCarbs || entry.carbs || 0,
      baseFat: entry.baseFat || entry.fat || 0,
    });
  };

  const handleSaveFood = (timestamp) => {
    const grams = parseFloat(editFormData.grams);
    const quantity = grams / editFormData.baseGrams;

    updateFoodEntry(timestamp, {
      quantity: quantity,
      grams: grams, // Store the actual grams consumed
      calories: Math.round(editFormData.baseCalories * quantity),
      protein: Math.round(editFormData.baseProtein * quantity * 10) / 10,
      carbs: Math.round(editFormData.baseCarbs * quantity * 10) / 10,
      fat: Math.round(editFormData.baseFat * quantity * 10) / 10,
      // Preserve base values
      baseCalories: editFormData.baseCalories,
      baseProtein: editFormData.baseProtein,
      baseCarbs: editFormData.baseCarbs,
      baseFat: editFormData.baseFat,
    });
    setEditingFood(null);
    setEditFormData({});
    loadEntries();
    onRefresh();
  };

  const handleCancelFoodEdit = () => {
    setEditingFood(null);
    setEditFormData({});
  };

  const handleEditExercise = (entry) => {
    setEditingExercise(entry.timestamp);
    if (entry.sets && entry.reps) {
      setEditFormData({
        sets: entry.sets,
        reps: entry.reps,
        weight: entry.weight || 0,
        caloriesBurned: entry.caloriesBurned,
      });
    } else {
      setEditFormData({
        duration: entry.duration,
        caloriesBurned: entry.caloriesBurned,
      });
    }
  };

  const handleSaveExercise = (timestamp) => {
    const entry = entries.exercise.find(e => e.timestamp === timestamp);
    if (entry.sets && entry.reps) {
      updateExerciseEntry(timestamp, {
        sets: parseInt(editFormData.sets),
        reps: parseInt(editFormData.reps),
        weight: parseFloat(editFormData.weight),
        caloriesBurned: parseInt(editFormData.caloriesBurned),
      });
    } else {
      updateExerciseEntry(timestamp, {
        duration: parseInt(editFormData.duration),
        caloriesBurned: parseInt(editFormData.caloriesBurned),
      });
    }
    setEditingExercise(null);
    setEditFormData({});
    loadEntries();
    onRefresh();
  };

  const handleCancelExerciseEdit = () => {
    setEditingExercise(null);
    setEditFormData({});
  };

  const handleSaveGoal = () => {
    const newGoal = parseInt(goalInput);
    if (newGoal > 0) {
      saveDailyGoal(newGoal);
      setShowGoalEdit(false);
      onRefresh();
    }
  };

  // Group foods by meal type
  const mealCategories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Unspecified'];
  const groupedFoods = entries.food.reduce((acc, entry) => {
    const mealType = entry.mealType || 'Unspecified';
    if (!acc[mealType]) acc[mealType] = [];
    acc[mealType].push(entry);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Today's Date */}
      <div className="text-center">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          {todayFormatted}
        </div>
      </div>

      {/* Motivational Nudge */}
      {motivationalNudge && (
        <div className={`p-4 rounded-lg border-2 ${
          motivationalNudge.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
            : motivationalNudge.type === 'info'
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
            : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {motivationalNudge.type === 'success' ? '🎉' : motivationalNudge.type === 'info' ? '💪' : '👋'}
            </span>
            <span className="font-semibold">{motivationalNudge.message}</span>
          </div>
        </div>
      )}

      {/* Calories to Goal Display */}
      <div className={`card ${statusBg}`}>
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            CALORIES TO GOAL
          </div>
          <div className={`text-6xl font-bold ${statusColor} mb-4`}>
            {dailyGoal - netCalories > 0 ? (
              dailyGoal - netCalories
            ) : dailyGoal - netCalories < 0 ? (
              <>-{Math.abs(dailyGoal - netCalories)}</>
            ) : (
              <>0</>
            )}
          </div>

          {/* Net Calories and Net Goal on same line */}
          <div className="flex items-center justify-center gap-4 mb-4 text-sm flex-wrap">
            <div className="text-gray-600 dark:text-gray-400">
              Net Calories Today: {netCalories >= 0 ? '+' : ''}{netCalories} cal
            </div>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Net Goal: {dailyGoal} cal</span>
              <button
                onClick={() => {
                  setGoalInput(dailyGoal.toString());
                  setShowGoalEdit(true);
                }}
                className="text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Subtle daily notice */}
          <div className="text-xs text-gray-500 dark:text-gray-500 text-center italic">
            Goals and totals reflect end-of-day targets
          </div>

          {/* Previous 3 Days */}
          <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              {previousDays.map((day, index) => (
                <div key={index}>
                  <div className="text-gray-600 dark:text-gray-400 mb-1">
                    {day.label}
                  </div>
                  {day.hasData ? (
                    <div className={`font-bold text-lg ${
                      day.netCal >= 0
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {day.netCal >= 0 ? '+' : ''}{day.netCal}
                    </div>
                  ) : (
                    <div className="font-bold text-lg text-gray-400 dark:text-gray-500">
                      N/A
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Goal Edit Modal */}
      {showGoalEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" ref={goalModalRef}>
          <div className="card max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Set Daily NET Calorie Goal</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This is your target NET calories (food eaten minus calories burned).
              Use 0 for maintenance, negative for weight loss, positive for weight gain.
            </p>
            <label htmlFor="goal-input" className="sr-only">Daily NET calorie goal</label>
            <input
              id="goal-input"
              type="number"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              className="input-field mb-4"
              placeholder="0"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setShowGoalEdit(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={handleSaveGoal} className="btn-primary flex-1">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calorie Breakdown */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Eaten</div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              +{caloriesEaten}
            </div>
          </div>

          <div className="card text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Resting</div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              -{restingBurned}
            </div>
          </div>

          <div className="card text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Exercise</div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              -{exerciseBurned}
            </div>
          </div>
        </div>

        {daysTracked < 5 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">💡 How NET works:</span> Resting calories ({tdee} cal/day) are based on your lifestyle activity level.
            NET = Food Eaten - (Resting + Exercise). Log your workouts separately to track full daily burn.
          </div>
        )}
      </div>

      {/* Macros Breakdown with Goals */}
      {(profile.fitnessGoal || usingCustomGoals) && (
        <MacroTracker
          profile={profile}
          currentProtein={totalProtein}
          currentCarbs={totalCarbs}
          currentFat={totalFat}
          proteinGoal={proteinGoal}
          carbsGoal={carbsGoal}
          fatGoal={fatGoal}
          isCustomGoals={usingCustomGoals}
        />
      )}

      {/* Achievements Bar */}
      <div
        className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg px-4 py-3 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
        onClick={() => setShowAchievements(true)}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Achievements</span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">View All →</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {recentAchievements.length > 0
            ? <>{recentAchievements[0].icon} {recentAchievements[0].title}</>
            : gamificationData.currentStreak > 0
              ? <span className="font-semibold text-emerald-700 dark:text-emerald-400">🔥 {gamificationData.currentStreak} Day Streak</span>
              : <>Start tracking to unlock achievements</>
          }
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setShowFoodInput(true)} className="btn-primary">
          Add Food
        </button>
        <button onClick={() => setShowExerciseLog(true)} className="btn-primary">
          Log Exercise
        </button>
      </div>

      {/* Water Tracker */}
      {waterTrackerEnabled && <WaterTracker onRefresh={onRefresh} />}

      {/* Food Log - Grouped by Meal Type */}
      {entries.food.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Food Log</h3>
          <div className="space-y-4">
            {mealCategories.map((mealType) => {
              const mealFoods = groupedFoods[mealType];
              if (!mealFoods || mealFoods.length === 0) return null;

              const mealCalories = mealFoods.reduce((sum, e) => sum + e.calories, 0);

              return (
                <div key={mealType} className="space-y-2">
                  {/* Meal Type Header */}
                  {mealType !== 'Unspecified' && (
                    <div className="flex justify-between items-center border-b-2 border-gray-200 dark:border-gray-700 pb-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {mealType}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {mealCalories} cal
                      </span>
                    </div>
                  )}

                  {/* Foods in this meal */}
                  <div className="space-y-3 pl-2">
                    {mealFoods.map((entry) => (
                      <div
                        key={entry.timestamp}
                        className="border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0"
                      >
                        {editingFood === entry.timestamp ? (
                          // Edit mode - grams-based
                          <div className="space-y-3">
                            <div className="font-semibold">{entry.name}</div>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-semibold mb-1">Amount (grams)</label>
                                <input
                                  type="number"
                                  value={editFormData.grams}
                                  onChange={(e) => setEditFormData({ ...editFormData, grams: e.target.value })}
                                  className="input-field text-sm py-1"
                                  min="1"
                                  step="1"
                                  placeholder={editFormData.baseGrams}
                                />
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Original serving: {entry.servingSize || '100g'} ({editFormData.baseGrams}g)
                                </div>
                              </div>

                              {/* Real-time preview of calculated values */}
                              <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                                <div className="text-xs font-semibold mb-2">Preview:</div>
                                <div className="text-sm space-y-1">
                                  <div>
                                    <span className="font-semibold">Calories:</span> {Math.round(editFormData.baseCalories * (parseFloat(editFormData.grams) || 0) / editFormData.baseGrams)}
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div>
                                      <span className="font-semibold">P:</span> {Math.round(editFormData.baseProtein * (parseFloat(editFormData.grams) || 0) / editFormData.baseGrams * 10) / 10}g
                                    </div>
                                    <div>
                                      <span className="font-semibold">C:</span> {Math.round(editFormData.baseCarbs * (parseFloat(editFormData.grams) || 0) / editFormData.baseGrams * 10) / 10}g
                                    </div>
                                    <div>
                                      <span className="font-semibold">F:</span> {Math.round(editFormData.baseFat * (parseFloat(editFormData.grams) || 0) / editFormData.baseGrams * 10) / 10}g
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveFood(entry.timestamp)}
                                className="btn-primary text-sm py-1 px-3"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelFoodEdit}
                                className="btn-secondary text-sm py-1 px-3"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View mode
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold">{entry.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {entry.calories} cal
                                {entry.grams ? ` - ${Math.round(entry.grams)}g` : (entry.servingSize && ` - ${entry.servingSize}`)}
                              </div>
                              {(entry.protein || entry.carbs || entry.fat) && (
                                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                  P: {Math.round(entry.protein || 0)}g - C: {Math.round(entry.carbs || 0)}g - F: {Math.round(entry.fat || 0)}g
                                </div>
                              )}
                              <div className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                                {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditFood(entry)}
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold text-xl"
                                title="Edit"
                                aria-label="Edit food entry"
                              >
                                E
                              </button>
                              <button
                                onClick={() => handleDeleteFood(entry.timestamp)}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 font-bold text-xl"
                                title="Delete"
                                aria-label="Delete food entry"
                              >
                                X
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Exercise Log */}
      {entries.exercise.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Exercise Log</h3>
          <div className="space-y-3">
            {entries.exercise.map((entry) => (
              <div
                key={entry.timestamp}
                className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0"
              >
                {editingExercise === entry.timestamp ? (
                  // Edit mode
                  <div className="space-y-3">
                    <div className="font-semibold">{entry.name}</div>
                    {entry.sets && entry.reps ? (
                      // Strength training exercise
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold mb-1">Sets</label>
                          <input
                            type="number"
                            value={editFormData.sets}
                            onChange={(e) => setEditFormData({ ...editFormData, sets: e.target.value })}
                            className="input-field text-sm py-1"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">Reps</label>
                          <input
                            type="number"
                            value={editFormData.reps}
                            onChange={(e) => setEditFormData({ ...editFormData, reps: e.target.value })}
                            className="input-field text-sm py-1"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">Weight ({profile.unit === 'metric' ? 'kg' : 'lbs'})</label>
                          <input
                            type="number"
                            value={editFormData.weight}
                            onChange={(e) => setEditFormData({ ...editFormData, weight: e.target.value })}
                            className="input-field text-sm py-1"
                            min="0"
                            step="0.5"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">Calories Burned</label>
                          <input
                            type="number"
                            value={editFormData.caloriesBurned}
                            onChange={(e) => setEditFormData({ ...editFormData, caloriesBurned: e.target.value })}
                            className="input-field text-sm py-1"
                            min="0"
                          />
                        </div>
                      </div>
                    ) : (
                      // Cardio exercise
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold mb-1">Duration (min)</label>
                          <input
                            type="number"
                            value={editFormData.duration}
                            onChange={(e) => setEditFormData({ ...editFormData, duration: e.target.value })}
                            className="input-field text-sm py-1"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">Calories Burned</label>
                          <input
                            type="number"
                            value={editFormData.caloriesBurned}
                            onChange={(e) => setEditFormData({ ...editFormData, caloriesBurned: e.target.value })}
                            className="input-field text-sm py-1"
                            min="0"
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveExercise(entry.timestamp)}
                        className="btn-primary text-sm py-1 px-3"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelExerciseEdit}
                        className="btn-secondary text-sm py-1 px-3"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{entry.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {entry.sets && entry.reps ? (
                          <>
                            {entry.sets} sets × {entry.reps} reps
                            {entry.weight > 0 && ` @ ${entry.weight}${profile.unit === 'metric' ? 'kg' : 'lbs'}`}
                            {' • '}{entry.caloriesBurned} cal burned
                          </>
                        ) : (
                          <>{entry.duration} min • {entry.caloriesBurned} cal burned</>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                        {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditExercise(entry)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold text-xl"
                        title="Edit"
                        aria-label="Edit exercise entry"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDeleteExercise(entry.timestamp)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 font-bold text-xl"
                        title="Delete"
                        aria-label="Delete exercise entry"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showFoodInput && (
        <FoodInput
          onAddFood={handleAddFood}
          onClose={() => setShowFoodInput(false)}
          onRefresh={onRefresh}
        />
      )}

      {showExerciseLog && (
        <ExerciseLog
          onAddExercise={handleAddExercise}
          onClose={() => setShowExerciseLog(false)}
          onRefresh={onRefresh}
        />
      )}

      {showAchievements && (
        <Achievements onClose={() => setShowAchievements(false)} />
      )}

      {showMilestone && (
        <MilestoneModal
          milestone={showMilestone}
          stats={calculateUserStats()}
          onClose={() => {
            markMilestoneShown(showMilestone);
            setShowMilestone(null);
          }}
          onDonate={() => {
            markMilestoneShown(showMilestone);
            setShowMilestone(null);
            window.open('https://buymeacoffee.com/griffs', '_blank');
          }}
        />
      )}

      {showBackupReminder && (
        <BackupReminderModal
          onClose={() => setShowBackupReminder(false)}
        />
      )}
    </div>
  );
}
