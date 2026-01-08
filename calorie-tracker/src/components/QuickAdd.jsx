import { useState } from 'react';

export default function QuickAdd({ onAddFood, onClose }) {
  const [calories, setCalories] = useState('');
  const [name, setName] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    onAddFood({
      name: name.trim() || 'Quick Add',
      calories: parseInt(calories),
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      servingSize: '1 serving',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Quick Add Calories</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold mb-3">
              Calories *
            </label>
            <input
              type="number"
              required
              min="1"
              max="10000"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="250"
              className="input-field"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-3">
              Food Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Quick Add"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-3">
              Macros (optional)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm mb-2">Protein (g)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="0"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Carbs (g)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="0"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Fat (g)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  placeholder="0"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
