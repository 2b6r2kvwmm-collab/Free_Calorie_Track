import { useState, useEffect } from 'react';
import { getFoodLog, getExerciseLog, getProfile, deleteFoodEntry, deleteExerciseEntry } from '../utils/storage';
import { calculateBMR, getBaselineTDEE } from '../utils/calculations';

export default function History({ onRefresh }) {
  const [expandedDate, setExpandedDate] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  const profile = getProfile();
  const bmr = calculateBMR(profile);
  const baselineTDEE = getBaselineTDEE(bmr);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const foodLog = getFoodLog();
    const exerciseLog = getExerciseLog();

    // Get unique dates from both logs
    const allDates = new Set([
      ...foodLog.map(entry => entry.date),
      ...exerciseLog.map(entry => entry.date)
    ]);

    // Sort dates in descending order (most recent first)
    const sortedDates = Array.from(allDates).sort((a, b) => b.localeCompare(a));

    // Build history data for each date
    const history = sortedDates.map(date => {
      const dayFood = foodLog.filter(entry => entry.date === date);
      const dayExercise = exerciseLog.filter(entry => entry.date === date);

      const caloriesEaten = dayFood.reduce((sum, entry) => sum + entry.calories, 0);
      const exerciseBurned = dayExercise.reduce((sum, entry) => sum + entry.caloriesBurned, 0);
      const restingBurned = baselineTDEE; // Full day's resting calories
      const totalBurned = restingBurned + exerciseBurned;
      const netCalories = caloriesEaten - totalBurned;

      // Calculate macros
      const totalProtein = dayFood.reduce((sum, entry) => sum + (entry.protein || 0), 0);
      const totalCarbs = dayFood.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
      const totalFat = dayFood.reduce((sum, entry) => sum + (entry.fat || 0), 0);

      return {
        date,
        dateFormatted: new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        caloriesEaten,
        restingBurned,
        exerciseBurned,
        totalBurned,
        netCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        foodEntries: dayFood,
        exerciseEntries: dayExercise,
      };
    });

    setHistoryData(history);
  };

  const handleDeleteFood = (timestamp) => {
    deleteFoodEntry(timestamp);
    loadHistory();
    onRefresh();
  };

  const handleDeleteExercise = (timestamp) => {
    deleteExerciseEntry(timestamp);
    loadHistory();
    onRefresh();
  };

  const toggleDate = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  // Check if date is today
  const isToday = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">History</h2>

      {historyData.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            No history yet. Start logging food and exercise!
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {historyData.map((day) => (
            <div key={day.date} className="card">
              {/* Date Header */}
              <button
                onClick={() => toggleDate(day.date)}
                className="w-full text-left"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-lg">
                      {isToday(day.date) ? 'Today' : day.dateFormatted}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {day.foodEntries.length} food{day.foodEntries.length !== 1 ? 's' : ''} • {day.exerciseEntries.length} exercise{day.exerciseEntries.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      day.netCalories >= 0
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {day.netCalories >= 0 ? '+' : ''}{day.netCalories}
                    </div>
                    <div className="text-xs text-gray-500">NET cal</div>
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedDate === day.date && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
                  {/* Calorie Breakdown */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Eaten</div>
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        +{day.caloriesEaten}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Resting</div>
                      <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                        -{day.restingBurned}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Exercise</div>
                      <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        -{day.exerciseBurned}
                      </div>
                    </div>
                  </div>

                  {/* Macros */}
                  {(day.totalProtein > 0 || day.totalCarbs > 0 || day.totalFat > 0) && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Macros</h4>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Protein</div>
                          <div className="text-lg font-bold text-red-600 dark:text-red-400">
                            {Math.round(day.totalProtein)}g
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Carbs</div>
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {Math.round(day.totalCarbs)}g
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Fat</div>
                          <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                            {Math.round(day.totalFat)}g
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Food Log */}
                  {day.foodEntries.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Food Log</h4>
                      <div className="space-y-3">
                        {day.foodEntries.map((entry) => (
                          <div
                            key={entry.timestamp}
                            className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0"
                          >
                            <div>
                              <div className="font-medium text-sm">{entry.name}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {entry.calories} cal
                                {entry.servingSize && ` • ${entry.servingSize}`}
                              </div>
                              {(entry.protein || entry.carbs || entry.fat) && (
                                <div className="text-xs text-gray-500 mt-1">
                                  P: {Math.round(entry.protein || 0)}g • C: {Math.round(entry.carbs || 0)}g • F: {Math.round(entry.fat || 0)}g
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteFood(entry.timestamp)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400 font-bold text-lg"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Exercise Log */}
                  {day.exerciseEntries.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Exercise Log</h4>
                      <div className="space-y-3">
                        {day.exerciseEntries.map((entry) => (
                          <div
                            key={entry.timestamp}
                            className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0"
                          >
                            <div>
                              <div className="font-medium text-sm">{entry.name}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
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
                            </div>
                            <button
                              onClick={() => handleDeleteExercise(entry.timestamp)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400 font-bold text-lg"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
