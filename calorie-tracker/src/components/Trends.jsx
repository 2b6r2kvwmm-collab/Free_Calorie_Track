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

    // Calculate daily macros
    const protein = dayFood.reduce((sum, entry) => sum + (entry.protein || 0), 0);
    const carbs = dayFood.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
    const fat = dayFood.reduce((sum, entry) => sum + (entry.fat || 0), 0);

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
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
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

  // Calculate protein goal achievement (last 7 days)
  const proteinAchievement = (() => {
    if (!macroTargets) return null;

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      weekDates.push(d.toISOString().split('T')[0]);
    }

    let daysMetGoal = 0;
    let daysWithData = 0;

    weekDates.forEach(date => {
      const dayFood = foodLog.filter(entry => entry.date === date);
      if (dayFood.length > 0) {
        const dayProtein = dayFood.reduce((sum, e) => sum + (e.protein || 0), 0);
        daysWithData++;
        if (dayProtein >= macroTargets.protein * 0.9) { // Within 90% of target counts as "met"
          daysMetGoal++;
        }
      }
    });

    if (daysWithData === 0) return null;

    return {
      daysMetGoal,
      daysWithData,
      percentage: Math.round((daysMetGoal / daysWithData) * 100),
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
                    <span className="text-violet-600 dark:text-violet-400 font-semibold">Protein</span>
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
                    <span className="text-orange-600 dark:text-orange-400 font-semibold">Carbs</span>
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
                    <span className="text-teal-600 dark:text-teal-400 font-semibold">Fat</span>
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
                    <span className="text-violet-600 dark:text-violet-400 font-semibold">Protein</span>
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
                    <span className="text-orange-600 dark:text-orange-400 font-semibold">Carbs</span>
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
                    <span className="text-teal-600 dark:text-teal-400 font-semibold">Fat</span>
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

      {/* Daily Macro Trends Chart */}
      {(macroTargets || usingCustomGoals) && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Daily Macro Trends</h2>

          {/* Period toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                period === 'week'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                period === 'month'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              30 Days
            </button>
          </div>

          {/* Macro Line Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" />
              <YAxis label={{ value: 'Grams', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />

              {/* Target lines */}
              {macroTargets && (
                <>
                  <Line
                    type="monotone"
                    dataKey={() => macroTargets.protein}
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                    name="Protein Target"
                    legendType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey={() => macroTargets.carbs}
                    stroke="#3b82f6"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                    name="Carbs Target"
                    legendType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey={() => macroTargets.fat}
                    stroke="#f59e0b"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                    name="Fat Target"
                    legendType="line"
                  />
                </>
              )}

              {/* Actual macro lines */}
              <Line
                type="monotone"
                dataKey="protein"
                stroke="#dc2626"
                strokeWidth={3}
                name="Protein"
              />
              <Line
                type="monotone"
                dataKey="carbs"
                stroke="#2563eb"
                strokeWidth={3}
                name="Carbs"
              />
              <Line
                type="monotone"
                dataKey="fat"
                stroke="#d97706"
                strokeWidth={3}
                name="Fat"
              />
            </LineChart>
          </ResponsiveContainer>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Solid lines show your actual intake. Dashed lines show your daily targets.
          </p>
        </div>
      )}

      {/* Protein Goal Achievement Tracker */}
      {proteinAchievement && macroTargets && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Protein Goal Achievement</h2>
          <div className="border-2 border-violet-200 dark:border-violet-700 rounded-lg p-6 bg-violet-50 dark:bg-violet-900/10">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                {proteinAchievement.daysMetGoal}/{proteinAchievement.daysWithData}
              </div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                days you hit your protein goal this week
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Target: {macroTargets.protein}g protein per day
              </div>
            </div>

            {/* Visual 7-day calendar */}
            <div className="grid grid-cols-7 gap-2 mt-4">
              {(() => {
                const weekStart = new Date();
                weekStart.setDate(weekStart.getDate() - 6);
                const weekDates = [];
                for (let i = 0; i < 7; i++) {
                  const d = new Date(weekStart);
                  d.setDate(d.getDate() + i);
                  weekDates.push(d);
                }

                return weekDates.map((date, index) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const dayFood = foodLog.filter(entry => entry.date === dateStr);
                  const dayProtein = dayFood.reduce((sum, e) => sum + (e.protein || 0), 0);
                  const metGoal = dayProtein >= macroTargets.protein * 0.9;
                  const hasData = dayFood.length > 0;
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{dayName}</div>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                          hasData
                            ? metGoal
                              ? 'bg-emerald-500 text-white'
                              : 'bg-orange-300 dark:bg-orange-700 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                        }`}
                      >
                        {hasData ? (metGoal ? '✓' : Math.round(dayProtein)) : '-'}
                      </div>
                      {hasData && !metGoal && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {Math.round(dayProtein)}g
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Performance message */}
            <div className="mt-4 text-center">
              {proteinAchievement.percentage >= 85 && (
                <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  🎉 Excellent consistency!
                </div>
              )}
              {proteinAchievement.percentage >= 60 && proteinAchievement.percentage < 85 && (
                <div className="text-blue-600 dark:text-blue-400 font-semibold">
                  👍 Good progress - keep it up!
                </div>
              )}
              {proteinAchievement.percentage < 60 && (
                <div className="text-gray-600 dark:text-gray-400 font-semibold">
                  💪 Focus on hitting that protein target!
                </div>
              )}
            </div>
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
          {/* Reserve space to prevent CLS */}
          <div className="min-h-[300px]">
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
        </div>

        {/* Calories In vs Out */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Calories In vs Out</h3>
          {/* Reserve space to prevent CLS */}
          <div className="min-h-[300px]">
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

    </div>
  );
}
