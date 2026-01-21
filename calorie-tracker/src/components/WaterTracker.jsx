import { useState, useEffect } from 'react';
import {
  getWaterForDate,
  addWater,
  setWaterForDate,
  getWaterUnit,
  saveWaterUnit,
  ozToMl,
  mlToOz,
  getProfile,
} from '../utils/storage';

export default function WaterTracker({ onRefresh }) {
  const profile = getProfile();
  const defaultUnit = profile?.unit === 'imperial' ? 'oz' : 'mL';

  const [waterMl, setWaterMl] = useState(0);
  const [unit, setUnit] = useState(getWaterUnit() || defaultUnit);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  useEffect(() => {
    setWaterMl(getWaterForDate());
  }, []);

  const handleAddWater = (amountMl) => {
    const newTotal = addWater(amountMl);
    setWaterMl(newTotal);
    if (onRefresh) onRefresh();
  };

  const handleRemoveWater = (amountMl) => {
    const currentTotal = getWaterForDate();
    const newTotal = Math.max(0, currentTotal - amountMl);
    setWaterForDate(newTotal);
    setWaterMl(newTotal);
    if (onRefresh) onRefresh();
  };

  const handleToggleUnit = () => {
    const newUnit = unit === 'oz' ? 'mL' : 'oz';
    setUnit(newUnit);
    saveWaterUnit(newUnit);
  };

  const handleCustomAdd = () => {
    const amount = parseFloat(customAmount);
    if (amount > 0) {
      const amountMl = unit === 'oz' ? ozToMl(amount) : amount;
      handleAddWater(amountMl);
      setCustomAmount('');
      setShowCustomInput(false);
    }
  };

  // Quick add amounts based on unit
  const quickAmounts = unit === 'oz'
    ? [
        { label: '8 oz', ml: ozToMl(8) },
        { label: '16 oz', ml: ozToMl(16) },
        { label: '32 oz', ml: ozToMl(32) },
      ]
    : [
        { label: '250 mL', ml: 250 },
        { label: '500 mL', ml: 500 },
        { label: '1 L', ml: 1000 },
      ];

  // Display water in current unit
  const displayWater = unit === 'oz' ? mlToOz(waterMl) : waterMl;
  const displayUnit = unit === 'oz' ? 'oz' : 'mL';

  // Calculate progress (recommended 8 glasses = 64oz or ~1900mL)
  const dailyGoalMl = unit === 'oz' ? ozToMl(64) : 2000;
  const progressPercent = Math.min(100, (waterMl / dailyGoalMl) * 100);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span>Water Intake</span>
        </h3>
        <button
          onClick={handleToggleUnit}
          className="text-sm px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
        >
          {unit === 'oz' ? 'Switch to mL' : 'Switch to oz'}
        </button>
      </div>

      {/* Progress Display */}
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
          {unit === 'oz' ? displayWater.toFixed(1) : Math.round(displayWater)} {displayUnit}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Goal: {unit === 'oz' ? '64 oz' : '2,000 mL'} ({Math.round(progressPercent)}%)
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-3">
          <div
            className="bg-blue-500 dark:bg-blue-400 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {quickAmounts.map((item) => (
          <button
            key={item.label}
            onClick={() => handleAddWater(item.ml)}
            className="py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            + {item.label}
          </button>
        ))}
      </div>

      {/* Remove Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {quickAmounts.map((item) => (
          <button
            key={`remove-${item.label}`}
            onClick={() => handleRemoveWater(item.ml)}
            className="py-2 px-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors text-sm"
          >
            - {item.label}
          </button>
        ))}
      </div>

      {/* Custom Amount */}
      {!showCustomInput ? (
        <button
          onClick={() => setShowCustomInput(true)}
          className="w-full py-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
        >
          + Add custom amount
        </button>
      ) : (
        <div className="flex gap-2">
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder={`Amount in ${unit}`}
            className="input-field flex-1 text-sm py-2"
            autoFocus
          />
          <button
            onClick={handleCustomAdd}
            className="btn-primary text-sm py-2 px-4"
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowCustomInput(false);
              setCustomAmount('');
            }}
            className="btn-secondary text-sm py-2 px-4"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
