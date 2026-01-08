import { useState } from 'react';
import { getMealTemplates, addMealTemplate, deleteMealTemplate, getTodayEntries } from '../utils/storage';

export default function MealTemplates({ onAddMeal, onClose }) {
  const [showCreate, setShowCreate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const templates = getMealTemplates();
  const todayEntries = getTodayEntries();

  const handleCreateTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    if (todayEntries.food.length === 0) {
      alert('No foods logged today. Log some foods first to create a template.');
      return;
    }

    const template = {
      name: templateName,
      foods: todayEntries.food.map(entry => ({
        name: entry.name,
        calories: entry.calories,
        protein: entry.protein || 0,
        carbs: entry.carbs || 0,
        fat: entry.fat || 0,
        servingSize: entry.servingSize,
      })),
    };

    // Calculate totals
    template.totalCalories = template.foods.reduce((sum, f) => sum + f.calories, 0);
    template.totalProtein = template.foods.reduce((sum, f) => sum + f.protein, 0);
    template.totalCarbs = template.foods.reduce((sum, f) => sum + f.carbs, 0);
    template.totalFat = template.foods.reduce((sum, f) => sum + f.fat, 0);

    addMealTemplate(template);
    setTemplateName('');
    setShowCreate(false);
  };

  const handleDeleteTemplate = (id) => {
    if (confirm('Delete this meal template?')) {
      deleteMealTemplate(id);
      window.location.reload(); // Refresh to show updated list
    }
  };

  const handleUseTemplate = (template) => {
    // Add all foods from template
    template.foods.forEach(food => {
      onAddMeal(food);
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="card max-w-2xl w-full my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Meal Templates</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm">
          <p className="font-semibold mb-2">How it works:</p>
          <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
            <li>Log all foods for a typical meal (breakfast, lunch, etc.)</li>
            <li>Create a template from today's foods</li>
            <li>Reuse the template to quickly log that meal again</li>
          </ol>
        </div>

        {!showCreate ? (
          <>
            <button
              onClick={() => setShowCreate(true)}
              className="btn-primary w-full mb-6"
            >
              + Create Template from Today's Foods
            </button>

            {templates.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-lg mb-2">No meal templates yet</div>
                <div className="text-sm">Create templates for meals you eat regularly</div>
              </div>
            ) : (
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl">{template.name}</h3>
                        <div className="text-gray-600 dark:text-gray-400 mt-1">
                          <span className="font-semibold">{template.totalCalories} cal</span>
                          <span className="text-sm ml-2">
                            P: {Math.round(template.totalProtein)}g •
                            C: {Math.round(template.totalCarbs)}g •
                            F: {Math.round(template.totalFat)}g
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUseTemplate(template)}
                          className="btn-primary"
                        >
                          Use Template
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="btn-secondary text-red-600 dark:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                      <div className="text-sm font-semibold mb-2">Includes:</div>
                      <ul className="text-sm space-y-1">
                        {template.foods.map((food, idx) => (
                          <li key={idx} className="text-gray-600 dark:text-gray-400">
                            • {food.name} ({food.calories} cal)
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold mb-3">Template Name</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Typical Breakfast, Post-Workout Meal"
                className="input-field"
                autoFocus
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="font-semibold mb-2">Today's Foods:</div>
              {todayEntries.food.length === 0 ? (
                <div className="text-sm text-gray-500">No foods logged today</div>
              ) : (
                <ul className="text-sm space-y-1">
                  {todayEntries.food.map((food, idx) => (
                    <li key={idx} className="text-gray-600 dark:text-gray-400">
                      • {food.name} ({food.calories} cal)
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                className="btn-primary flex-1"
              >
                Create Template
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
