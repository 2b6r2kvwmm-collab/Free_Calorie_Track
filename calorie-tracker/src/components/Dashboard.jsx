import { useState, useEffect } from 'react';
import {
  getTodayEntries,
  deleteFoodEntry,
  deleteExerciseEntry,
  getProfile,
  getDailyGoal,
  saveDailyGoal,
  getFoodLog,
  getExerciseLog,
  addFoodEntry,
  addExerciseEntry,
} from '../utils/storage';
import {
  calculateBMR,
  getBaselineTDEE,
  calculateTDEE,
} from '../utils/calculations';
import {
  updateDailyStreak,
  updateWorkoutCount,
  updateFoodCount,
  getMotivationalNudge,
  getGamificationData,
  getRecentAchievements,
} from '../utils/gamification';
import { calculateMacroTargets } from '../utils/macros';
import FoodInput from './FoodInput';
import ExerciseLog from './ExerciseLog';
import MacroTracker from './MacroTracker';
import Achievements from './Achievements';

export default function Dashboard({ onRefresh }) {
  const [entries, setEntries] = useState({ food: [], exercise: [] });
  const [showFoodInput, setShowFoodInput] = useState(false);
  const [showExerciseLog, setShowExerciseLog] = useState(false);
  const [showGoalEdit, setShowGoalEdit] = useState(false);
  const [goalInput, setGoalInput] = useState('');
  const [showAchievements, setShowAchievements] = useState(false);
  const [showNewAchievement, setShowNewAchievement] = useState(null);

  const profile = getProfile();
  const dailyGoal = getDailyGoal();

  const loadEntries = () => {
    setEntries(getTodayEntries());
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const bmr = calculateBMR(profile);
  const baselineTDEE = getBaselineTDEE(bmr); // Use sedentary baseline to avoid overestimating
  const restingBurned = baselineTDEE; // Full day's resting calories (end-of-day calculation)

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
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const macroTargets = profile.fitnessGoal ? calculateMacroTargets(profile.weight, tdee, profile.fitnessGoal) : null;
  const proteinGoal = macroTargets?.protein || 0;

  const motivationalNudge = getMotivationalNudge(netCalories, dailyGoal, totalProtein, proteinGoal);
  const recentAchievements = getRecentAchievements();

  // Update streak when component loads
  useEffect(() => {
    updateDailyStreak(netCalories, dailyGoal);
  }, [netCalories, dailyGoal]);

  // Get previous 3 days net calories
  const foodLog = getFoodLog();
  const exerciseLog = getExerciseLog();

  const today = new Date();
  const previousDays = [];

  for (let i = 1; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayFood = foodLog.filter(entry => entry.date === dateStr);
    const dayExercise = exerciseLog.filter(entry => entry.date === dateStr);

    const eaten = dayFood.reduce((sum, entry) => sum + entry.calories, 0);
    const burned = baselineTDEE + // Full day's resting calories
                   dayExercise.reduce((sum, entry) => sum + entry.caloriesBurned, 0);

    previousDays.push({
      label: i === 1 ? 'Yesterday' : `${i} days ago`,
      netCal: eaten - burned
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
    };
    addFoodEntry(entry);
    updateFoodCount();
    loadEntries();
    onRefresh();
  };

  const handleAddExercise = (exercise) => {
    addExerciseEntry(exercise);
    updateWorkoutCount();
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

  const handleSaveGoal = () => {
    const newGoal = parseInt(goalInput);
    if (newGoal > 0) {
      saveDailyGoal(newGoal);
      setShowGoalEdit(false);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Today's Date */}
      <div className="text-center">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          {todayFormatted}
        </div>
      </div>

      {/* Streak & Achievements Banner */}
      {(gamificationData.currentStreak > 0 || recentAchievements.length > 0) && (
        <div className="card bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border-2 border-emerald-300 dark:border-emerald-700">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              {gamificationData.currentStreak > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">🔥</span>
                  <div>
                    <div className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                      {gamificationData.currentStreak} Day Streak!
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Best: {gamificationData.longestStreak} days
                    </div>
                  </div>
                </div>
              )}
              {recentAchievements.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <span>Recent:</span>
                  {recentAchievements.slice(0, 2).map((achievement, idx) => (
                    <span key={idx} className="bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                      {achievement.icon} {achievement.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowAchievements(true)}
              className="btn-secondary text-sm whitespace-nowrap"
            >
              View All
            </button>
          </div>
        </div>
      )}

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

      {/* Net Calories Display */}
      <div className={`card ${statusBg}`}>
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            NET CALORIES TODAY
          </div>
          <div className={`text-6xl font-bold ${statusColor} mb-4`}>
            {netCalories >= 0 ? '+' : ''}{netCalories}
          </div>
          <div className="flex justify-center items-center gap-2 text-sm mb-4">
            <span>Net Goal: {dailyGoal} cal</span>
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

          {/* Previous 3 Days */}
          <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              {previousDays.map((day, index) => (
                <div key={index}>
                  <div className="text-gray-600 dark:text-gray-400 mb-1">
                    {day.label}
                  </div>
                  <div className={`font-bold text-lg ${
                    day.netCal >= 0
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {day.netCal >= 0 ? '+' : ''}{day.netCal}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Goal Edit Modal */}
      {showGoalEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Set Daily NET Calorie Goal</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This is your target NET calories (food eaten minus calories burned).
              Use 0 for maintenance, negative for weight loss, positive for weight gain.
            </p>
            <input
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

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">💡 How NET works:</span> Resting calories ({baselineTDEE} cal/day) use sedentary baseline.
          NET = Food Eaten - (Resting + Exercise). Log your workouts separately to track full daily burn.
        </div>
      </div>

      {/* Macros Breakdown with Goals */}
      {profile.fitnessGoal && (
        <MacroTracker
          profile={profile}
          currentProtein={totalProtein}
          currentCarbs={totalCarbs}
          currentFat={totalFat}
        />
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setShowFoodInput(true)} className="btn-primary">
          🍎 Add Food
        </button>
        <button onClick={() => setShowExerciseLog(true)} className="btn-primary">
          💪 Log Exercise
        </button>
      </div>

      {/* Food Log */}
      {entries.food.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Food Log</h3>
          <div className="space-y-3">
            {entries.food.map((entry) => (
              <div
                key={entry.timestamp}
                className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <div className="font-semibold">{entry.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {entry.calories} cal
                    {entry.servingSize && ` • ${entry.servingSize}`}
                  </div>
                  {(entry.protein || entry.carbs || entry.fat) && (
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      P: {Math.round(entry.protein || 0)}g • C: {Math.round(entry.carbs || 0)}g • F: {Math.round(entry.fat || 0)}g
                    </div>
                  )}
                  <div className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                    {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteFood(entry.timestamp)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 font-bold text-xl"
                >
                  ×
                </button>
              </div>
            ))}
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
                className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0"
              >
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
                <button
                  onClick={() => handleDeleteExercise(entry.timestamp)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 font-bold text-xl"
                >
                  ×
                </button>
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
        />
      )}

      {showExerciseLog && (
        <ExerciseLog
          onAddExercise={handleAddExercise}
          onClose={() => setShowExerciseLog(false)}
        />
      )}

      {showAchievements && (
        <Achievements onClose={() => setShowAchievements(false)} />
      )}
    </div>
  );
}
