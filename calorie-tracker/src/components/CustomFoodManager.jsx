import { useState } from 'react';
import { getCustomFoods, addCustomFood, deleteCustomFood } from '../utils/storage';

export default function CustomFoodManager({ onAddFood, onClose }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    servingSize: '',
  });

  const customFoods = getCustomFoods();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newFood = {
      name: formData.name,
      calories: parseInt(formData.calories),
      protein: parseFloat(formData.protein) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      fat: parseFloat(formData.fat) || 0,
      servingSize: formData.servingSize,
    };

    addCustomFood(newFood);

    // Reset form
    setFormData({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      servingSize: '',
    });

    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this custom food?')) {
      deleteCustomFood(id);
      window.location.reload(); // Refresh to show updated list
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="card max-w-2xl w-full my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Custom Foods</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {!showForm ? (
          <>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary w-full mb-6"
            >
              + Create Custom Food
            </button>

            {customFoods.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-lg mb-2">No custom foods yet</div>
                <div className="text-sm">Create custom foods for items not in the database</div>
              </div>
            ) : (
              <div className="space-y-3">
                {customFoods.map((food) => (
                  <div
                    key={food.id}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{food.name}</h3>
                        <div className="text-gray-600 dark:text-gray-400 mt-1">
                          <span className="font-semibold text-lg">{food.calories} cal</span>
                          {food.servingSize && (
                            <span className="text-sm"> • {food.servingSize}</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            onAddFood(food);
                            onClose();
                          }}
                          className="btn-primary"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => handleDelete(food.id)}
                          className="btn-secondary text-red-600 dark:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-lg font-semibold mb-3">Food Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., Homemade Protein Shake"
                className="input-field"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-3">Serving Size *</label>
              <input
                type="text"
                required
                value={formData.servingSize}
                onChange={(e) => updateField('servingSize', e.target.value)}
                placeholder="e.g., 1 cup, 100g, 1 serving"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-semibold mb-3">Calories *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.calories}
                  onChange={(e) => updateField('calories', e.target.value)}
                  placeholder="250"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold mb-3">Protein (g) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  value={formData.protein}
                  onChange={(e) => updateField('protein', e.target.value)}
                  placeholder="20"
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-semibold mb-3">Carbs (g) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  value={formData.carbs}
                  onChange={(e) => updateField('carbs', e.target.value)}
                  placeholder="30"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold mb-3">Fat (g) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  value={formData.fat}
                  onChange={(e) => updateField('fat', e.target.value)}
                  placeholder="5"
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Save Custom Food
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
