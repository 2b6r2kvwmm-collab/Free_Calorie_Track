import { useState, useEffect, useRef } from 'react';
import { exercises, calculateExerciseCalories, calculateWeightedVestMET, getRunningMET, getCyclingMET, calculatePace } from '../utils/calculations';
import { getProfile, addExerciseEntry } from '../utils/storage';
import WorkoutTemplates from './WorkoutTemplates';
import { trackWorkout } from '../utils/gamification';

export default function ExerciseLog({ onAddExercise, onClose, onRefresh }) {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [duration, setDuration] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingMode, setTrackingMode] = useState('duration'); // 'duration' or 'reps'
  const [walkingTrackingMode, setWalkingTrackingMode] = useState('duration'); // 'duration', 'steps', or 'distance'
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [useWeightedVest, setUseWeightedVest] = useState(false);
  const [vestWeight, setVestWeight] = useState('10-15');
  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState('miles');
  const [steps, setSteps] = useState('');
  const [walkingDistance, setWalkingDistance] = useState('');
  const [walkingDistanceUnit, setWalkingDistanceUnit] = useState('miles');
  const [showWorkoutTemplates, setShowWorkoutTemplates] = useState(false);
  const modalRef = useRef(null);

  const profile = getProfile();

  // Lock body scroll when modal opens
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Scroll to top when exercise is selected/deselected
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [selectedExercise]);

  const filteredExercises = searchQuery
    ? exercises.filter(ex =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : exercises;

  // Check if exercise is strength-based (Weightlifting or Bodyweight)
  const isStrengthExercise = selectedExercise &&
    (selectedExercise.category === 'Weightlifting' || selectedExercise.category === 'Bodyweight');

  // Check if exercise is walking
  const isWalkingExercise = selectedExercise && selectedExercise.category === 'Walking';

  // Check if exercise requires distance input (Running/Cycling)
  const requiresDistance = selectedExercise && selectedExercise.requiresDistance;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Handle walking with steps or distance
    if (isWalkingExercise && walkingTrackingMode === 'steps') {
      const numSteps = parseInt(steps);
      // Convert steps to miles (avg 2,000 steps per mile)
      const miles = numSteps / 2000;
      // Estimate calories: ~0.57 calories per step per kg of body weight
      const caloriesBurned = Math.round(numSteps * 0.04 * profile.weight);
      // Estimate duration: ~2,000 steps per 20 minutes = 100 steps/min
      const estimatedDuration = Math.round(numSteps / 100);

      onAddExercise({
        name: `${selectedExercise.name} (${numSteps.toLocaleString()} steps, ${miles.toFixed(1)} mi)`,
        duration: estimatedDuration,
        caloriesBurned,
      });
      return;
    }

    if (isWalkingExercise && walkingTrackingMode === 'distance') {
      let distanceMiles = parseFloat(walkingDistance);
      if (walkingDistanceUnit === 'km') {
        distanceMiles = distanceMiles * 0.621371; // Convert km to miles
      }
      // Estimate calories: ~100 calories per mile (varies by weight, using body weight factor)
      const caloriesBurned = Math.round(distanceMiles * 100 * (profile.weight / 70)); // Adjusted for weight
      // Estimate duration: average walking speed of 3.5 mph
      const estimatedDuration = Math.round((distanceMiles / 3.5) * 60);

      onAddExercise({
        name: `${selectedExercise.name} (${distanceMiles.toFixed(1)} mi)`,
        duration: estimatedDuration,
        caloriesBurned,
      });
      return;
    }

    if (trackingMode === 'duration') {
      // Calculate MET value (adjust for weighted vest if applicable)
      let metValue = selectedExercise.met;
      let exerciseName = selectedExercise.name;

      // Handle distance-based exercises (Running/Cycling)
      if (requiresDistance && distance && duration) {
        const pace = calculatePace(parseFloat(distance), parseInt(duration), distanceUnit);
        if (selectedExercise.category === 'Running') {
          metValue = getRunningMET(pace);
          const pacePerMile = 60 / pace;
          exerciseName = `Running (${parseFloat(distance).toFixed(1)} ${distanceUnit}, ${pacePerMile.toFixed(1)} min/mile)`;
        } else if (selectedExercise.category === 'Cycling') {
          metValue = getCyclingMET(pace);
          exerciseName = `Cycling (${parseFloat(distance).toFixed(1)} ${distanceUnit}, ${pace.toFixed(1)} mph)`;
        }
      } else if (isWalkingExercise && useWeightedVest) {
        metValue = calculateWeightedVestMET(
          selectedExercise.met,
          selectedExercise.speed,
          vestWeight
        );
        exerciseName = `${selectedExercise.name} (${vestWeight} lb vest)`;
      }

      const caloriesBurned = calculateExerciseCalories(
        profile.weight,
        metValue,
        parseInt(duration)
      );

      onAddExercise({
        name: exerciseName,
        duration: parseInt(duration),
        caloriesBurned,
      });
    } else {
      // Reps/sets mode - estimate duration based on sets and reps
      const estimatedDuration = Math.max(parseInt(sets) * 2, 5); // ~2 min per set, minimum 5 min
      const caloriesBurned = calculateExerciseCalories(
        profile.weight,
        selectedExercise.met,
        estimatedDuration
      );

      onAddExercise({
        name: selectedExercise.name,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: parseFloat(weight) || 0,
        duration: estimatedDuration,
        caloriesBurned,
      });
    }

    onClose();
  };

  const handleAddExercises = (exercisesList) => {
    exercisesList.forEach(exercise => {
      addExerciseEntry(exercise);
      trackWorkout();
    });
    if (onRefresh) {
      onRefresh();
    }
    onClose();
  };

  // Show workout templates modal
  if (showWorkoutTemplates) {
    return (
      <WorkoutTemplates
        onAddExercises={handleAddExercises}
        onClose={() => setShowWorkoutTemplates(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto" ref={modalRef}>
      <div className="card max-w-2xl w-full my-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Log Exercise</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
            aria-label="Close exercise log"
          >
            ×
          </button>
        </div>

        {!selectedExercise ? (
          <div>
            <button
              onClick={() => setShowWorkoutTemplates(true)}
              className="btn-secondary w-full mb-4 text-left"
            >
              📋 Workout Templates
            </button>

            <label htmlFor="exercise-search-input" className="sr-only">Search for exercises</label>
            <input
              id="exercise-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises..."
              className="input-field mb-6"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
            />

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredExercises.map((exercise, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedExercise(exercise)}
                  className="w-full text-left p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-emerald-500 transition-colors"
                >
                  <div className="font-semibold text-lg">{exercise.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {exercise.category} • MET {exercise.met}
                  </div>
                </button>
              ))}
            </div>

            {filteredExercises.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No exercises found
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{selectedExercise.name}</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedExercise.category} • MET {selectedExercise.met}
              </div>
            </div>

            {/* Tracking Mode Toggle (only for strength exercises) */}
            {isStrengthExercise && (
              <div>
                <label className="block text-lg font-semibold mb-3">
                  Tracking Mode
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTrackingMode('duration')}
                    className={`py-3 px-6 rounded-lg font-semibold text-lg border-2 transition-colors ${
                      trackingMode === 'duration'
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    Duration
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrackingMode('reps')}
                    className={`py-3 px-6 rounded-lg font-semibold text-lg border-2 transition-colors ${
                      trackingMode === 'reps'
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    Reps & Sets
                  </button>
                </div>
              </div>
            )}

            {/* Walking Tracking Mode */}
            {isWalkingExercise && (
              <div>
                <label className="block text-lg font-semibold mb-3">
                  Track By
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setWalkingTrackingMode('duration')}
                    className={`py-2 px-4 rounded-lg font-semibold border-2 transition-colors ${
                      walkingTrackingMode === 'duration'
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    Duration
                  </button>
                  <button
                    type="button"
                    onClick={() => setWalkingTrackingMode('steps')}
                    className={`py-2 px-4 rounded-lg font-semibold border-2 transition-colors ${
                      walkingTrackingMode === 'steps'
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    Steps
                  </button>
                  <button
                    type="button"
                    onClick={() => setWalkingTrackingMode('distance')}
                    className={`py-2 px-4 rounded-lg font-semibold border-2 transition-colors ${
                      walkingTrackingMode === 'distance'
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    Distance
                  </button>
                </div>
              </div>
            )}

            {/* Weighted Vest Options (only for walking exercises with duration mode) */}
            {isWalkingExercise && walkingTrackingMode === 'duration' && (
              <div>
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="weighted-vest"
                    checked={useWeightedVest}
                    onChange={(e) => setUseWeightedVest(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="weighted-vest" className="ml-3 text-lg font-semibold">
                    Add Weighted Vest
                  </label>
                </div>

                {useWeightedVest && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Vest Weight
                    </label>
                    <select
                      value={vestWeight}
                      onChange={(e) => setVestWeight(e.target.value)}
                      className="input-field"
                    >
                      <option value="10-15">10-15 lbs</option>
                      <option value="20">20 lbs</option>
                      <option value="30">30 lbs</option>
                      <option value="40+">40+ lbs</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Walking Steps Input */}
            {isWalkingExercise && walkingTrackingMode === 'steps' && (
              <div>
                <label className="block text-lg font-semibold mb-3">
                  Number of Steps *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  placeholder="10000"
                  className="input-field"
                  autoFocus
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Average: 2,000 steps = 1 mile, ~100 cal/mile
                </p>
              </div>
            )}

            {/* Walking Distance Input */}
            {isWalkingExercise && walkingTrackingMode === 'distance' && (
              <div>
                <label className="block text-lg font-semibold mb-3">
                  Distance *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={walkingDistance}
                    onChange={(e) => setWalkingDistance(e.target.value)}
                    placeholder="3.0"
                    className="input-field"
                    autoFocus
                  />
                  <select
                    value={walkingDistanceUnit}
                    onChange={(e) => setWalkingDistanceUnit(e.target.value)}
                    className="input-field"
                  >
                    <option value="miles">Miles</option>
                    <option value="km">Kilometers</option>
                  </select>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Average walking speed: 3-4 mph (~100 cal/mile)
                </p>
              </div>
            )}

            {/* Distance Input for Running/Cycling */}
            {requiresDistance && (
              <div>
                <label className="block text-lg font-semibold mb-3">
                  Distance *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="3.75"
                    className="input-field"
                    autoFocus
                  />
                  <select
                    value={distanceUnit}
                    onChange={(e) => setDistanceUnit(e.target.value)}
                    className="input-field"
                  >
                    <option value="miles">Miles</option>
                    <option value="km">Kilometers</option>
                  </select>
                </div>
              </div>
            )}

            {/* Duration Input - for duration mode AND not walking with steps/distance */}
            {trackingMode === 'duration' && !(isWalkingExercise && (walkingTrackingMode === 'steps' || walkingTrackingMode === 'distance')) && (
              <div>
                <label className="block text-lg font-semibold mb-3">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="480"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="30"
                  className="input-field"
                  autoFocus={!requiresDistance}
                />

                {duration && (
                  <div className="mt-4 text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Estimated calories burned
                    </div>
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {(() => {
                        let met = selectedExercise.met;
                        if (requiresDistance && distance && duration) {
                          const pace = calculatePace(parseFloat(distance), parseInt(duration), distanceUnit);
                          if (selectedExercise.category === 'Running') {
                            met = getRunningMET(pace);
                          } else if (selectedExercise.category === 'Cycling') {
                            met = getCyclingMET(pace);
                          }
                        } else if (isWalkingExercise && useWeightedVest) {
                          met = calculateWeightedVestMET(selectedExercise.met, selectedExercise.speed, vestWeight);
                        }
                        return calculateExerciseCalories(profile.weight, met, parseInt(duration) || 0);
                      })()}{' '}
                      cal
                    </div>
                    {requiresDistance && distance && duration && (
                      <div className="text-xs text-gray-500 mt-2">
                        {(() => {
                          const pace = calculatePace(parseFloat(distance), parseInt(duration), distanceUnit);
                          if (selectedExercise.category === 'Running') {
                            const pacePerMile = 60 / pace;
                            return `Pace: ${pacePerMile.toFixed(1)} min/mile (${pace.toFixed(1)} mph)`;
                          } else if (selectedExercise.category === 'Cycling') {
                            return `Speed: ${pace.toFixed(1)} mph`;
                          }
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Sets & Reps Input - ONLY for strength exercises in reps mode */}
            {trackingMode === 'reps' && isStrengthExercise && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg font-semibold mb-3">
                      Sets *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="50"
                      value={sets}
                      onChange={(e) => setSets(e.target.value)}
                      placeholder="3"
                      className="input-field"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold mb-3">
                      Reps *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      placeholder="10"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3">
                    Weight (optional, {profile.unit === 'metric' ? 'kg' : 'lbs'})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="50"
                    className="input-field"
                  />
                </div>

                {sets && reps && (
                  <div className="mt-4 text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Estimated calories burned
                    </div>
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {calculateExerciseCalories(
                        profile.weight,
                        selectedExercise.met,
                        Math.max(parseInt(sets) * 2, 5)
                      )}{' '}
                      cal
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      (Based on ~{Math.max(parseInt(sets) * 2, 5)} minutes estimated duration)
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedExercise(null);
                  setUseWeightedVest(false);
                  setVestWeight('10-15');
                }}
                className="btn-secondary flex-1"
              >
                Back
              </button>
              <button type="submit" className="btn-primary flex-1">
                Log Exercise
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
