import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getWeightLog, addWeightEntry, getProfile } from '../utils/storage';

export default function WeightTracker() {
  const [showInput, setShowInput] = useState(false);
  const [weightInput, setWeightInput] = useState('');

  const profile = getProfile();
  const weightLog = getWeightLog();

  const handleAddWeight = (e) => {
    e.preventDefault();
    if (!weightInput) return;

    let weight = parseFloat(weightInput);

    // Convert to kg if imperial
    if (profile.unit === 'imperial') {
      weight = weight * 0.453592;
    }

    addWeightEntry(weight);
    setWeightInput('');
    setShowInput(false);
    window.location.reload(); // Refresh to show new data
  };

  // Prepare chart data (convert back to user's unit for display)
  const chartData = weightLog.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: profile.unit === 'imperial' ? entry.weight / 0.453592 : entry.weight,
  }));

  const currentWeight = weightLog.length > 0
    ? (profile.unit === 'imperial'
        ? (weightLog[weightLog.length - 1].weight / 0.453592).toFixed(1)
        : weightLog[weightLog.length - 1].weight.toFixed(1))
    : null;

  const startWeight = weightLog.length > 0
    ? (profile.unit === 'imperial'
        ? (weightLog[0].weight / 0.453592).toFixed(1)
        : weightLog[0].weight.toFixed(1))
    : null;

  const weightChange = (weightLog.length > 1 && currentWeight && startWeight)
    ? (parseFloat(currentWeight) - parseFloat(startWeight)).toFixed(1)
    : null;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Weight Tracker</h2>
        <button
          onClick={() => setShowInput(!showInput)}
          className="btn-primary"
        >
          {showInput ? 'Cancel' : '+ Log Weight'}
        </button>
      </div>

      {showInput && (
        <form onSubmit={handleAddWeight} className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
          <label className="block text-lg font-semibold mb-3">
            Today's Weight ({profile.unit === 'metric' ? 'kg' : 'lbs'})
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              step="0.1"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder={profile.unit === 'metric' ? '70.0' : '154.0'}
              className="input-field flex-1"
              autoFocus
            />
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Weigh yourself at the same time each day for consistency (e.g., morning after waking)
          </p>
        </form>
      )}

      {weightLog.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-lg mb-2">No weight data yet</div>
          <div className="text-sm">Log your weight to track progress over time</div>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">Current</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {currentWeight}
              </div>
              <div className="text-xs text-gray-500">{profile.unit === 'metric' ? 'kg' : 'lbs'}</div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">Starting</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {startWeight}
              </div>
              <div className="text-xs text-gray-500">{profile.unit === 'metric' ? 'kg' : 'lbs'}</div>
            </div>

            <div className={`p-4 rounded-lg text-center ${
              weightChange && parseFloat(weightChange) < 0
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-orange-50 dark:bg-orange-900/20'
            }`}>
              <div className="text-sm text-gray-600 dark:text-gray-400">Change</div>
              <div className={`text-2xl font-bold ${
                weightChange && parseFloat(weightChange) < 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-orange-600 dark:text-orange-400'
              }`}>
                {weightChange > 0 ? '+' : ''}{weightChange || '0.0'}
              </div>
              <div className="text-xs text-gray-500">{profile.unit === 'metric' ? 'kg' : 'lbs'}</div>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 1 && (
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-3">Weight Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip formatter={(value) => `${value} ${profile.unit === 'metric' ? 'kg' : 'lbs'}`} />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#475569"
                    strokeWidth={2}
                    dot={{ fill: '#475569', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Weight Log Table */}
          <div>
            <h3 className="font-semibold text-lg mb-3">History</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[...weightLog].reverse().map((entry, index) => {
                const displayWeight = profile.unit === 'imperial'
                  ? (entry.weight / 0.453592).toFixed(1)
                  : entry.weight.toFixed(1);
                const displayDate = new Date(entry.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <span className="font-semibold">{displayDate}</span>
                    <span className="text-lg">
                      {displayWeight} {profile.unit === 'metric' ? 'kg' : 'lbs'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
