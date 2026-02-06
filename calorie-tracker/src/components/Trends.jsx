import { useState } from 'react';
import {
  getFoodLog,
  getExerciseLog,
  getProfile,
  getCustomMacros,
  getCustomCalorieGoal,
} from '../utils/storage';
import {
  calculateBMR,
  getBaselineTDEE,
  calculateTDEE,
} from '../utils/calculations';
import { calculateMacroTargets } from '../utils/macros';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import WeeklySummary from './WeeklySummary';
import WeightTracker from './WeightTracker';

export default function Trends() {
  const [period, setPeriod] = useState('week'); // week or month

  const profile = getProfile();
  const foodLog = getFoodLog();
  const exerciseLog = getExerciseLog();

  const bmr = calculateBMR(profile);
  const baselineTDEE = getBaselineTDEE(bmr); // Use sedentary baseline

  // Calculate date range
  const today = new Date();
  const daysToShow = period === 'week' ? 7 : 30;
  const dates = [];

  for (let i = daysToShow - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  // Aggregate data by date
  const chartData = dates.map((date) => {
    const dayFood = foodLog.filter((entry) => entry.date === date);
    const dayExercise = exerciseLog.filter((entry) => entry.date === date);

    const caloriesEaten = dayFood.reduce((sum, entry) => sum + entry.calories, 0);
    const exerciseBurned = dayExercise.reduce((sum, entry) => sum + entry.caloriesBurned, 0);
    const totalBurned = baselineTDEE + exerciseBurned; // Full day's resting calories
    const netCalories = caloriesEaten - totalBurned;

    // Format date for display
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
      date,
      displayDate: period === 'week' ? dayName : monthDay,
      eaten: caloriesEaten,
      burned: totalBurned,
      net: netCalories,
    };
  });

  // Calculate 7-day rolling average
  const dataWithAverage = chartData.map((day, index) => {
    if (index < 6) {
      return { ...day, average: null };
    }

    const last7Days = chartData.slice(index - 6, index + 1);
    const average = Math.round(
      last7Days.reduce((sum, d) => sum + d.net, 0) / 7
    );

    return { ...day, average };
  });

  // Calculate macro targets
  const customMacros = getCustomMacros();
  const customCalorieGoal = getCustomCalorieGoal();
  const usingCustomGoals = !!(customMacros && customCalorieGoal !== null);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const macroTargets = usingCustomGoals
    ? customMacros
    : (profile.fitnessGoal ? calculateMacroTargets(profile.weight, tdee, profile.fitnessGoal) : null);

  // Calculate weekly macro averages (last 7 days)
  const weeklyMacros = (() => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      weekDates.push(d.toISOString().split('T')[0]);
    }

    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let daysWithData = 0;

    weekDates.forEach(date => {
      const dayFood = foodLog.filter(entry => entry.date === date);
      if (dayFood.length > 0) {
        totalProtein += dayFood.reduce((sum, e) => sum + (e.protein || 0), 0);
        totalCarbs += dayFood.reduce((sum, e) => sum + (e.carbs || 0), 0);
        totalFat += dayFood.reduce((sum, e) => sum + (e.fat || 0), 0);
        daysWithData++;
      }
    });

    if (daysWithData === 0) return null;

    return {
      avgProtein: Math.round(totalProtein / daysWithData),
      avgCarbs: Math.round(totalCarbs / daysWithData),
      avgFat: Math.round(totalFat / daysWithData),
      daysWithData,
    };
  })();

  // Calculate monthly macro averages (last 30 days)
  const monthlyMacros = (() => {
    const monthStart = new Date();
    monthStart.setDate(monthStart.getDate() - 29);
    const monthDates = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(monthStart);
      d.setDate(d.getDate() + i);
      monthDates.push(d.toISOString().split('T')[0]);
    }

    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let daysWithData = 0;

    monthDates.forEach(date => {
      const dayFood = foodLog.filter(entry => entry.date === date);
      if (dayFood.length > 0) {
        totalProtein += dayFood.reduce((sum, e) => sum + (e.protein || 0), 0);
        totalCarbs += dayFood.reduce((sum, e) => sum + (e.carbs || 0), 0);
        totalFat += dayFood.reduce((sum, e) => sum + (e.fat || 0), 0);
        daysWithData++;
      }
    });

    if (daysWithData === 0) return null;

    return {
      avgProtein: Math.round(totalProtein / daysWithData),
      avgCarbs: Math.round(totalCarbs / daysWithData),
      avgFat: Math.round(totalFat / daysWithData),
      daysWithData,
    };
  })();


  return (
    <div className="space-y-6">
      {/* Weekly/Monthly Summary */}
      <WeeklySummary />

      {/* Macro Averages Section */}
      {(weeklyMacros || monthlyMacros) && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Macro Averages</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weekly Averages */}
            {weeklyMacros && (
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-emerald-600 dark:text-emerald-400">
                  Weekly Average (Last 7 Days)
                </h3>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Based on {weeklyMacros.daysWithData} day{weeklyMacros.daysWithData !== 1 ? 's' : ''} with data
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 dark:text-red-400 font-semibold">Protein</span>
                    <span>
                      {weeklyMacros.avgProtein}g/day
                      {macroTargets && (
                        <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                          (target: {macroTargets.protein}g)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">Carbs</span>
                    <span>
                      {weeklyMacros.avgCarbs}g/day
                      {macroTargets && (
                        <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                          (target: {macroTargets.carbs}g)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">Fat</span>
                    <span>
                      {weeklyMacros.avgFat}g/day
                      {macroTargets && (
                        <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                          (target: {macroTargets.fat}g)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Monthly Averages */}
            {monthlyMacros && (
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-blue-600 dark:text-blue-400">
                  Monthly Average (Last 30 Days)
                </h3>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Based on {monthlyMacros.daysWithData} day{monthlyMacros.daysWithData !== 1 ? 's' : ''} with data
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 dark:text-red-400 font-semibold">Protein</span>
                    <span>
                      {monthlyMacros.avgProtein}g/day
                      {macroTargets && (
                        <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                          (target: {macroTargets.protein}g)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">Carbs</span>
                    <span>
                      {monthlyMacros.avgCarbs}g/day
                      {macroTargets && (
                        <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                          (target: {macroTargets.carbs}g)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">Fat</span>
                    <span>
                      {monthlyMacros.avgFat}g/day
                      {macroTargets && (
                        <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                          (target: {macroTargets.fat}g)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Weight Tracker */}
      <WeightTracker />

      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Trends</h2>

        {/* Period Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setPeriod('week')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold text-lg border-2 transition-colors ${
              period === 'week'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold text-lg border-2 transition-colors ${
              period === 'month'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
            }`}
          >
            30 Days
          </button>
        </div>

        {/* Net Calories Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Net Calories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataWithAverage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#10b981"
                strokeWidth={2}
                name="Net Calories"
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="7-Day Average"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Calories In vs Out */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Calories In vs Out</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="eaten" fill="#3b82f6" name="Eaten" />
              <Bar dataKey="burned" fill="#f97316" name="Burned" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
