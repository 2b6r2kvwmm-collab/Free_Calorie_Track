import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getFoodLog, getExerciseLog, getProfile } from '../utils/storage';
import { calculateBMR, getBaselineTDEE } from '../utils/calculations';
import { getCurrentMacros } from '../utils/macros';

export default function WeeklySummary() {
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'

  const profile = getProfile();
  const bmr = calculateBMR(profile);
  const baselineTDEE = getBaselineTDEE(bmr);

  const foodLog = getFoodLog();
  const exerciseLog = getExerciseLog();

  const today = new Date();
  const daysToShow = viewMode === 'week' ? 7 : 30;

  // Generate data for the chart
  const chartData = [];
  let totalNetCal = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalExerciseCalories = 0;
  let daysWithData = 0;

  for (let i = daysToShow - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayFood = foodLog.filter(entry => entry.date === dateStr);
    const dayExercise = exerciseLog.filter(entry => entry.date === dateStr);

    const eaten = dayFood.reduce((sum, entry) => sum + entry.calories, 0);
    const burned = baselineTDEE + // Full day's resting calories
                   dayExercise.reduce((sum, entry) => sum + entry.caloriesBurned, 0);
    const netCal = eaten - burned;

    const dayMacros = getCurrentMacros(dayFood);
    const exerciseCalories = dayExercise.reduce((sum, entry) => sum + entry.caloriesBurned, 0);

    if (dayFood.length > 0 || dayExercise.length > 0) {
      daysWithData++;
      totalNetCal += netCal;
      totalProtein += dayMacros.protein;
      totalCarbs += dayMacros.carbs;
      totalFat += dayMacros.fat;
      totalExerciseCalories += exerciseCalories;
    }

    chartData.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      netCalories: netCal,
      eaten: eaten,
      burned: burned,
      protein: Math.round(dayMacros.protein),
      carbs: Math.round(dayMacros.carbs),
      fat: Math.round(dayMacros.fat),
    });
  }

  const avgNetCal = daysWithData > 0 ? Math.round(totalNetCal / daysWithData) : 0;
  const avgProtein = daysWithData > 0 ? Math.round(totalProtein / daysWithData) : 0;
  const avgCarbs = daysWithData > 0 ? Math.round(totalCarbs / daysWithData) : 0;
  const avgFat = daysWithData > 0 ? Math.round(totalFat / daysWithData) : 0;
  const avgExerciseCalories = daysWithData > 0 ? Math.round(totalExerciseCalories / daysWithData) : 0;

  // Calculate expected weight change (3500 cal = 1 lb = 0.45 kg)
  const totalDeficit = totalNetCal;
  const expectedWeightChange = (totalDeficit / 3500) * (profile.unit === 'metric' ? 0.45 : 1);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {viewMode === 'week' ? 'Weekly' : 'Monthly'} Summary
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              viewMode === 'week'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              viewMode === 'month'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg NET Cal</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {avgNetCal}
          </div>
          <div className="text-xs text-gray-500">per day</div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Exercise</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {avgExerciseCalories}
          </div>
          <div className="text-xs text-gray-500">cal/day</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Period</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {totalNetCal > 0 ? '+' : ''}{Math.round(totalNetCal)}
          </div>
          <div className="text-xs text-gray-500">NET calories</div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Weight Change</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {expectedWeightChange > 0 ? '+' : ''}{expectedWeightChange.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500">
            {profile.unit === 'metric' ? 'kg' : 'lbs'} (est.)
          </div>
        </div>
      </div>

      {/* Macro Averages */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Protein</div>
          <div className="text-xl font-bold text-red-600 dark:text-red-400">
            {avgProtein}g
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Carbs</div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {avgCarbs}g
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Fat</div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {avgFat}g
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-3">NET Calories Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="netCalories"
              stroke="#10b981"
              strokeWidth={2}
              name="NET Calories"
            />
            <Line
              type="monotone"
              dataKey="eaten"
              stroke="#3b82f6"
              strokeWidth={1}
              strokeDasharray="5 5"
              name="Eaten"
            />
            <Line
              type="monotone"
              dataKey="burned"
              stroke="#ef4444"
              strokeWidth={1}
              strokeDasharray="5 5"
              name="Burned"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {daysWithData === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data for this period. Start logging food and exercise!
        </div>
      )}
    </div>
  );
}
