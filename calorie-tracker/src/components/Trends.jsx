import { useState } from 'react';
import {
  getFoodLog,
  getExerciseLog,
  getProfile,
} from '../utils/storage';
import {
  calculateBMR,
  getBaselineTDEE,
} from '../utils/calculations';
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


  return (
    <div className="space-y-6">
      {/* Weekly/Monthly Summary */}
      <WeeklySummary />

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
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold text-lg border-2 transition-colors ${
              period === 'month'
                ? 'bg-emerald-500 text-white border-emerald-500'
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
