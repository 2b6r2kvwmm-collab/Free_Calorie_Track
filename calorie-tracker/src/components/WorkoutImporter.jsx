import { useState } from 'react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { parseWorkoutFile } from '../utils/workoutParser';
import { addExerciseEntry } from '../utils/storage';

/**
 * Workout file importer component
 * Handles file upload, parsing, preview, and import
 */
export default function WorkoutImporter({ isOpen, onClose, onComplete }) {
  const modalRef = useModalAccessibility(isOpen, onClose);
  const [step, setStep] = useState('upload'); // 'upload', 'preview', 'importing', 'complete'
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkouts, setSelectedWorkouts] = useState(new Set());
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    try {
      const parsedWorkouts = await parseWorkoutFile(file);

      if (parsedWorkouts.length === 0) {
        setError('No workouts found in file. Please check the file format and try again.');
        return;
      }

      setWorkouts(parsedWorkouts);
      // Select all by default
      setSelectedWorkouts(new Set(parsedWorkouts.map((_, index) => index)));
      setStep('preview');
    } catch (err) {
      console.error('Error parsing workout file:', err);
      setError('Failed to parse file. Please make sure it\'s a supported format (CSV, JSON, GPX, XML, TCX).');
    }
  };

  const toggleWorkout = (index) => {
    const newSelected = new Set(selectedWorkouts);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedWorkouts(newSelected);
  };

  const toggleAll = () => {
    if (selectedWorkouts.size === workouts.length) {
      setSelectedWorkouts(new Set());
    } else {
      setSelectedWorkouts(new Set(workouts.map((_, index) => index)));
    }
  };

  const handleImport = () => {
    setStep('importing');

    try {
      let importedCount = 0;

      selectedWorkouts.forEach(index => {
        const workout = workouts[index];

        // Import as exercise entry
        addExerciseEntry({
          name: workout.name,
          duration: workout.duration,
          caloriesBurned: workout.calories,
        }, workout.date); // Pass custom date

        importedCount++;
      });

      setStep('complete');

      // Close after 2 seconds
      setTimeout(() => {
        if (onComplete) onComplete();
        handleClose();
      }, 2000);
    } catch (err) {
      console.error('Error importing workouts:', err);
      setError('Failed to import workouts. Please try again.');
      setStep('preview');
    }
  };

  const handleClose = () => {
    setStep('upload');
    setWorkouts([]);
    setSelectedWorkouts(new Set());
    setError(null);
    setFileName('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      ref={modalRef}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full my-8 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">
            {step === 'upload' && 'Import Workouts'}
            {step === 'preview' && 'Preview & Select Workouts'}
            {step === 'importing' && 'Importing...'}
            {step === 'complete' && 'Import Complete!'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
            aria-label="Close importer"
          >
            ×
          </button>
        </div>

        {/* Upload Step */}
        {step === 'upload' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📂</div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Select a workout file to import
              </p>

              <label className="inline-block">
                <input
                  type="file"
                  accept=".csv,.json,.gpx,.xml,.tcx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <span className="btn-primary cursor-pointer inline-block px-8 py-3">
                  📥 Choose File
                </span>
              </label>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Supported formats: CSV, JSON, GPX, XML (Apple Health), TCX
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Preview Step */}
        {step === 'preview' && (
          <div className="space-y-4">
            {/* Accuracy Warning */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg p-3">
              <p className="text-sm text-yellow-900 dark:text-yellow-200">
                <strong>⚠️ Review for Accuracy:</strong> Imported data may contain errors due to format differences.
                Verify calories, duration, and dates before confirming import.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>File:</strong> {fileName} • <strong>Found:</strong> {workouts.length} workout{workouts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Select All */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
              <button
                onClick={toggleAll}
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                {selectedWorkouts.size === workouts.length ? 'Deselect All' : 'Select All'}
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedWorkouts.size} selected
              </span>
            </div>

            {/* Workouts List */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {workouts.map((workout, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedWorkouts.has(index)
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                  }`}
                  onClick={() => toggleWorkout(index)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedWorkouts.has(index)}
                      onChange={() => toggleWorkout(index)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg dark:text-white">
                            {workout.name}
                          </h3>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span className="font-semibold">{workout.date}</span>
                            {workout.duration > 0 && (
                              <span> • {workout.duration} min</span>
                            )}
                            {workout.distance && (
                              <span> • {workout.distance} km</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                            {workout.calories} cal
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={selectedWorkouts.size === 0}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import {selectedWorkouts.size} Workout{selectedWorkouts.size !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}

        {/* Importing Step */}
        {step === 'importing' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Importing workouts...
            </p>
          </div>
        )}

        {/* Complete Step */}
        {step === 'complete' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Successfully imported {selectedWorkouts.size} workout{selectedWorkouts.size !== 1 ? 's' : ''}!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Closing...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
