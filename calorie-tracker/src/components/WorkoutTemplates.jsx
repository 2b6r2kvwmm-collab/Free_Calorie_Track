import { useState, useEffect, useRef } from 'react';
import {
  getWorkoutTemplates,
  addWorkoutTemplate,
  deleteWorkoutTemplate,
  getProfile,
} from '../utils/storage';
import { exercises, calculateExerciseCalories } from '../utils/calculations';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

export default function WorkoutTemplates({ onAddExercises, onClose }) {
  const modalRef = useModalAccessibility(true, onClose);
  const [templates, setTemplates] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const scrollRef = useRef(null);
  const profile = getProfile();

  useEffect(() => {
    setTemplates(getWorkoutTemplates());
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [showCreateForm, showExerciseSearch]);

  const filteredExercises = searchQuery
    ? exercises.filter(ex =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : exercises;

  const handleAddExerciseToTemplate = (exercise) => {
    const newExercise = {
      ...exercise,
      id: Date.now(),
      duration: 30, // default duration
      sets: exercise.category === 'Weightlifting' || exercise.category === 'Bodyweight' ? 3 : null,
      reps: exercise.category === 'Weightlifting' || exercise.category === 'Bodyweight' ? 10 : null,
      weight: 0,
    };
    setSelectedExercises([...selectedExercises, newExercise]);
    setShowExerciseSearch(false);
    setSearchQuery('');
  };

  const handleRemoveExercise = (id) => {
    setSelectedExercises(selectedExercises.filter(e => e.id !== id));
  };

  const handleUpdateExercise = (id, field, value) => {
    setSelectedExercises(selectedExercises.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim() || selectedExercises.length === 0) return;

    const template = {
      name: templateName.trim(),
      exercises: selectedExercises.map(e => ({
        name: e.name,
        category: e.category,
        met: e.met,
        duration: e.duration,
        sets: e.sets,
        reps: e.reps,
        weight: e.weight,
      })),
    };

    addWorkoutTemplate(template);
    setTemplates(getWorkoutTemplates());
    setShowCreateForm(false);
    setTemplateName('');
    setSelectedExercises([]);
  };

  const handleDeleteTemplate = (id) => {
    if (confirm('Delete this workout template?')) {
      deleteWorkoutTemplate(id);
      setTemplates(getWorkoutTemplates());
    }
  };

  const handleUseTemplate = (template) => {
    // Add all exercises from template
    const exercisesToAdd = template.exercises.map(ex => {
      const caloriesBurned = calculateExerciseCalories(
        profile.weight,
        ex.met,
        ex.sets ? Math.max(ex.sets * 2, 5) : ex.duration
      );

      return {
        name: ex.name,
        duration: ex.sets ? Math.max(ex.sets * 2, 5) : ex.duration,
        caloriesBurned,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
      };
    });

    onAddExercises(exercisesToAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto" role="dialog" aria-modal="true" ref={modalRef}>
      <div className="card max-w-2xl w-full my-8 max-h-[calc(100vh-4rem)] overflow-y-auto" ref={scrollRef}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Workout Templates</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
          >
            x
          </button>
        </div>

        {!showCreateForm ? (
          <>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary w-full mb-6"
            >
              + Create New Template
            </button>

            {templates.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-lg mb-2">No workout templates yet</div>
                <div className="text-sm">Create templates for your favorite workout routines</div>
              </div>
            ) : (
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {template.exercises.length} exercise{template.exercises.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUseTemplate(template)}
                          className="btn-primary text-sm"
                        >
                          Use Template
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 font-bold text-xl"
                        >
                          x
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {template.exercises.map((ex, idx) => (
                        <span key={idx}>
                          {ex.name}
                          {ex.sets && ex.reps ? ` (${ex.sets}x${ex.reps})` : ` (${ex.duration} min)`}
                          {idx < template.exercises.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-3">Template Name *</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Leg Day, Push Day, Full Body"
                className="input-field"
                autoFocus
              />
            </div>

            {/* Selected Exercises */}
            <div>
              <label className="block text-lg font-semibold mb-3">
                Exercises ({selectedExercises.length})
              </label>

              {selectedExercises.length > 0 && (
                <div className="space-y-3 mb-4">
                  {selectedExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold">{exercise.name}</div>
                        <button
                          onClick={() => handleRemoveExercise(exercise.id)}
                          className="text-red-600 dark:text-red-400 font-bold"
                        >
                          x
                        </button>
                      </div>

                      {exercise.sets !== null ? (
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs font-semibold mb-1">Sets</label>
                            <input
                              type="number"
                              value={exercise.sets}
                              onChange={(e) => handleUpdateExercise(exercise.id, 'sets', parseInt(e.target.value) || 0)}
                              className="input-field text-sm py-1"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">Reps</label>
                            <input
                              type="number"
                              value={exercise.reps}
                              onChange={(e) => handleUpdateExercise(exercise.id, 'reps', parseInt(e.target.value) || 0)}
                              className="input-field text-sm py-1"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">Weight</label>
                            <input
                              type="number"
                              value={exercise.weight}
                              onChange={(e) => handleUpdateExercise(exercise.id, 'weight', parseFloat(e.target.value) || 0)}
                              className="input-field text-sm py-1"
                              min="0"
                              step="0.5"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-semibold mb-1">Duration (min)</label>
                          <input
                            type="number"
                            value={exercise.duration}
                            onChange={(e) => handleUpdateExercise(exercise.id, 'duration', parseInt(e.target.value) || 0)}
                            className="input-field text-sm py-1 w-32"
                            min="1"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!showExerciseSearch ? (
                <button
                  onClick={() => setShowExerciseSearch(true)}
                  className="btn-secondary w-full"
                >
                  + Add Exercise
                </button>
              ) : (
                <div className="border-2 border-emerald-500 rounded-lg p-4">
                  <label htmlFor="template-exercise-search" className="sr-only">Search exercises to add to template</label>
                  <input
                    id="template-exercise-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search exercises..."
                    className="input-field mb-4"
                    autoFocus
                  />

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredExercises.slice(0, 20).map((exercise, index) => (
                      <button
                        key={index}
                        onClick={() => handleAddExerciseToTemplate(exercise)}
                        className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-emerald-500 transition-colors"
                      >
                        <div className="font-semibold">{exercise.name}</div>
                        <div className="text-xs text-gray-500">{exercise.category}</div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setShowExerciseSearch(false);
                      setSearchQuery('');
                    }}
                    className="mt-3 text-gray-600 dark:text-gray-400 hover:underline text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setTemplateName('');
                  setSelectedExercises([]);
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                disabled={!templateName.trim() || selectedExercises.length === 0}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Template
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
