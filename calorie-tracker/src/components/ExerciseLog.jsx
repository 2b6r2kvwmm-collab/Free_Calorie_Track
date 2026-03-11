import { useState, useEffect, useRef } from 'react';
import { exercises, calculateExerciseCalories, calculateWeightedVestMET, getRunningMET, getCyclingMET, calculatePace } from '../utils/calculations';
import { getProfile, addExerciseEntry } from '../utils/storage';
import WorkoutTemplates from './WorkoutTemplates';
import { trackWorkout } from '../utils/gamification';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { lockScroll, unlockScroll } from '../utils/scrollLock';

// Helper function to calculate weighted vest calorie multiplier
function getVestCalorieMultiplier(vestWeight) {
  const weightMap = {
    '10-15': 1.15,  // 15% increase
    '20': 1.25,     // 25% increase
    '30': 1.35,     // 35% increase
    '40+': 1.50,    // 50% increase
  };
  return weightMap[vestWeight] || 1.0;
}

export default function ExerciseLog({ onAddExercise, onClose, onRefresh }) {
  const modalRef = useModalAccessibility(true, onClose);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [duration, setDuration] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingMode, setTrackingMode] = useState('duration'); // 'duration' or 'reps'
  const [walkingTrackingMode, setWalkingTrackingMode] = useState('duration'); // 'duration', 'steps', or 'distance'
  const [cardioTrackingMode, setCardioTrackingMode] = useState('distanceDuration'); // 'distanceDuration', 'paceDistance', or 'paceDuration'
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [useWeightedVest, setUseWeightedVest] = useState(false);
  const [vestWeight, setVestWeight] = useState('10-15');
  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState('miles');
  const [pace, setPace] = useState(''); // For pace-based cardio tracking
  const [steps, setSteps] = useState('');
  const [walkingDistance, setWalkingDistance] = useState('');
  const [walkingDistanceUnit, setWalkingDistanceUnit] = useState('miles');
  const [showWorkoutTemplates, setShowWorkoutTemplates] = useState(false);
  const scrollRef = useRef(null);

  const profile = getProfile();

  // Lock body scroll when modal opens
  useEffect(() => {
    lockScroll();
    return () => {
      unlockScroll();
    };
  }, []);

  // Scroll to top when exercise is selected/deselected
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
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
      let caloriesBurned = Math.round(numSteps * 0.04 * profile.weight);
      // Estimate duration: ~2,000 steps per 20 minutes = 100 steps/min
      const estimatedDuration = Math.round(numSteps / 100);

      // Apply weighted vest bonus if enabled
      if (useWeightedVest) {
        const vestBonus = getVestCalorieMultiplier(vestWeight);
        caloriesBurned = Math.round(caloriesBurned * vestBonus);
      }

      const exerciseName = useWeightedVest
        ? `${selectedExercise.name} (${numSteps.toLocaleString()} steps, ${miles.toFixed(1)} mi, ${vestWeight} lb vest)`
        : `${selectedExercise.name} (${numSteps.toLocaleString()} steps, ${miles.toFixed(1)} mi)`;

      onAddExercise({
        name: exerciseName,
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
      let caloriesBurned = Math.round(distanceMiles * 100 * (profile.weight / 70)); // Adjusted for weight
      // Estimate duration: average walking speed of 3.5 mph
      const estimatedDuration = Math.round((distanceMiles / 3.5) * 60);

      // Apply weighted vest bonus if enabled
      if (useWeightedVest) {
        const vestBonus = getVestCalorieMultiplier(vestWeight);
        caloriesBurned = Math.round(caloriesBurned * vestBonus);
      }

      const exerciseName = useWeightedVest
        ? `${selectedExercise.name} (${distanceMiles.toFixed(1)} mi, ${vestWeight} lb vest)`
        : `${selectedExercise.name} (${distanceMiles.toFixed(1)} mi)`;

      onAddExercise({
        name: exerciseName,
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
      if (requiresDistance) {
        let calculatedPace, calculatedDistance, calculatedDuration;

        if (cardioTrackingMode === 'distanceDuration') {
          // Mode 1: Distance + Duration → Calculate Pace
          calculatedPace = calculatePace(parseFloat(distance), parseInt(duration), distanceUnit);
          calculatedDistance = parseFloat(distance);
          calculatedDuration = parseInt(duration);
        } else if (cardioTrackingMode === 'paceDistance') {
          // Mode 2: Pace + Distance → Calculate Duration
          const paceValue = parseFloat(pace);
          calculatedDistance = parseFloat(distance);

          if (selectedExercise.category === 'Running') {
            // Pace is in min/mile, convert to mph
            calculatedPace = 60 / paceValue;
          } else {
            // Cycling: pace is already in mph
            calculatedPace = paceValue;
          }

          // Calculate duration in minutes
          const distanceInMiles = distanceUnit === 'km' ? calculatedDistance * 0.621371 : calculatedDistance;
          calculatedDuration = Math.round((distanceInMiles / calculatedPace) * 60);
        } else if (cardioTrackingMode === 'paceDuration') {
          // Mode 3: Pace + Duration → Calculate Distance
          const paceValue = parseFloat(pace);
          calculatedDuration = parseInt(duration);

          if (selectedExercise.category === 'Running') {
            // Pace is in min/mile, convert to mph
            calculatedPace = 60 / paceValue;
          } else {
            // Cycling: pace is already in mph
            calculatedPace = paceValue;
          }

          // Calculate distance in miles
          const hours = calculatedDuration / 60;
          const distanceInMiles = calculatedPace * hours;
          calculatedDistance = distanceUnit === 'km' ? distanceInMiles / 0.621371 : distanceInMiles;
        }

        // Get MET value based on calculated pace
        if (selectedExercise.category === 'Running') {
          metValue = getRunningMET(calculatedPace);
          const pacePerMile = 60 / calculatedPace;
          exerciseName = `Running (${calculatedDistance.toFixed(1)} ${distanceUnit}, ${pacePerMile.toFixed(1)} min/mile)`;
        } else if (selectedExercise.category === 'Cycling') {
          metValue = getCyclingMET(calculatedPace);
          exerciseName = `Cycling (${calculatedDistance.toFixed(1)} ${distanceUnit}, ${calculatedPace.toFixed(1)} mph)`;
        }

        // Calculate calories and log exercise
        const caloriesBurned = calculateExerciseCalories(
          profile.weight,
          metValue,
          calculatedDuration
        );

        onAddExercise({
          name: exerciseName,
          duration: calculatedDuration,
          caloriesBurned,
        });
        onClose();
        return;
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto" role="dialog" aria-modal="true" ref={modalRef}>
      <div className="card max-w-2xl w-full my-8 max-h-[calc(100vh-4rem)] overflow-y-auto" ref={scrollRef}>
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
                        ? 'bg-emerald-600 text-white border-emerald-500'
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
                        ? 'bg-emerald-600 text-white border-emerald-500'
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
                        ? 'bg-emerald-600 text-white border-emerald-500'
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
                        ? 'bg-emerald-600 text-white border-emerald-500'
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
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    Distance
                  </button>
                </div>
              </div>
            )}

            {/* Cardio Tracking Mode (Running/Cycling) */}
            {requiresDistance && (
              <div>
                <label className="block text-lg font-semibold mb-3">
                  Track By
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setCardioTrackingMode('distanceDuration')}
                    className={`py-2 px-2 rounded-lg font-semibold text-sm border-2 transition-colors ${
                      cardioTrackingMode === 'distanceDuration'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    Distance + Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardioTrackingMode('paceDistance')}
                    className={`py-2 px-2 rounded-lg font-semibold text-sm border-2 transition-colors ${
                      cardioTrackingMode === 'paceDistance'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    Pace + Distance
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardioTrackingMode('paceDuration')}
                    className={`py-2 px-2 rounded-lg font-semibold text-sm border-2 transition-colors ${
                      cardioTrackingMode === 'paceDuration'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    Pace + Time
                  </button>
                </div>
              </div>
            )}

            {/* Weighted Vest Options (for all walking tracking modes) */}
            {isWalkingExercise && (
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

            {/* Pace Input for Running/Cycling (when using pace-based modes) */}
            {requiresDistance && (cardioTrackingMode === 'paceDistance' || cardioTrackingMode === 'paceDuration') && (
              <div>
                <label className="block text-lg font-semibold mb-3">
                  {selectedExercise.category === 'Running' ? 'Pace (min/mile) *' : 'Speed (mph) *'}
                </label>
                <input
                  type="number"
                  required
                  min="0.1"
                  step="0.1"
                  value={pace}
                  onChange={(e) => setPace(e.target.value)}
                  placeholder={selectedExercise.category === 'Running' ? '8.5' : '15.0'}
                  className="input-field"
                  autoFocus
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {selectedExercise.category === 'Running'
                    ? 'Example: 8.5 min/mile = ~7 mph pace'
                    : 'Example: 15 mph = moderate cycling speed'}
                </p>
              </div>
            )}

            {/* Distance Input for Running/Cycling */}
            {requiresDistance && (cardioTrackingMode === 'distanceDuration' || cardioTrackingMode === 'paceDistance') && (
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
                    autoFocus={cardioTrackingMode === 'distanceDuration'}
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

                {/* Calorie preview for paceDistance mode */}
                {cardioTrackingMode === 'paceDistance' && pace && distance && (
                  <div className="mt-4 text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Estimated calories burned
                    </div>
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {(() => {
                        const paceValue = parseFloat(pace);
                        const calculatedPace = selectedExercise.category === 'Running' ? 60 / paceValue : paceValue;
                        const distanceInMiles = distanceUnit === 'km' ? parseFloat(distance) * 0.621371 : parseFloat(distance);
                        const calculatedDuration = Math.round((distanceInMiles / calculatedPace) * 60);
                        const met = selectedExercise.category === 'Running' ? getRunningMET(calculatedPace) : getCyclingMET(calculatedPace);
                        return calculateExerciseCalories(profile.weight, met, calculatedDuration);
                      })()}{' '}
                      cal
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {(() => {
                        const paceValue = parseFloat(pace);
                        const calculatedPace = selectedExercise.category === 'Running' ? 60 / paceValue : paceValue;
                        const distanceInMiles = distanceUnit === 'km' ? parseFloat(distance) * 0.621371 : parseFloat(distance);
                        const calculatedDuration = Math.round((distanceInMiles / calculatedPace) * 60);
                        return `Duration: ${calculatedDuration} minutes`;
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Duration Input - for duration mode AND not walking with steps/distance AND not cardio with paceDistance */}
            {trackingMode === 'duration' &&
             !(isWalkingExercise && (walkingTrackingMode === 'steps' || walkingTrackingMode === 'distance')) &&
             !(requiresDistance && cardioTrackingMode === 'paceDistance') && (
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

                {((requiresDistance && cardioTrackingMode === 'distanceDuration' && duration && distance) ||
                  (requiresDistance && cardioTrackingMode === 'paceDuration' && duration && pace) ||
                  (!requiresDistance && duration)) && (
                  <div className="mt-4 text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Estimated calories burned
                    </div>
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {(() => {
                        let met = selectedExercise.met;
                        let estimatedDuration = parseInt(duration) || 0;

                        if (requiresDistance && cardioTrackingMode === 'distanceDuration' && distance && duration) {
                          const calculatedPace = calculatePace(parseFloat(distance), parseInt(duration), distanceUnit);
                          if (selectedExercise.category === 'Running') {
                            met = getRunningMET(calculatedPace);
                          } else if (selectedExercise.category === 'Cycling') {
                            met = getCyclingMET(calculatedPace);
                          }
                        } else if (requiresDistance && cardioTrackingMode === 'paceDuration' && pace && duration) {
                          const paceValue = parseFloat(pace);
                          const calculatedPace = selectedExercise.category === 'Running' ? 60 / paceValue : paceValue;
                          if (selectedExercise.category === 'Running') {
                            met = getRunningMET(calculatedPace);
                          } else if (selectedExercise.category === 'Cycling') {
                            met = getCyclingMET(calculatedPace);
                          }
                        } else if (isWalkingExercise && useWeightedVest) {
                          met = calculateWeightedVestMET(selectedExercise.met, selectedExercise.speed, vestWeight);
                        }
                        return calculateExerciseCalories(profile.weight, met, estimatedDuration);
                      })()}{' '}
                      cal
                    </div>
                    {requiresDistance && cardioTrackingMode === 'distanceDuration' && distance && duration && (
                      <div className="text-xs text-gray-500 mt-2">
                        {(() => {
                          const calculatedPace = calculatePace(parseFloat(distance), parseInt(duration), distanceUnit);
                          if (selectedExercise.category === 'Running') {
                            const pacePerMile = 60 / calculatedPace;
                            return `Pace: ${pacePerMile.toFixed(1)} min/mile (${calculatedPace.toFixed(1)} mph)`;
                          } else if (selectedExercise.category === 'Cycling') {
                            return `Speed: ${calculatedPace.toFixed(1)} mph`;
                          }
                        })()}
                      </div>
                    )}
                    {requiresDistance && cardioTrackingMode === 'paceDuration' && pace && duration && (
                      <div className="text-xs text-gray-500 mt-2">
                        {(() => {
                          const paceValue = parseFloat(pace);
                          const calculatedPace = selectedExercise.category === 'Running' ? 60 / paceValue : paceValue;
                          const hours = parseInt(duration) / 60;
                          const distanceInMiles = calculatedPace * hours;
                          const calculatedDistance = distanceUnit === 'km' ? distanceInMiles / 0.621371 : distanceInMiles;
                          return `Distance: ${calculatedDistance.toFixed(2)} ${distanceUnit}`;
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
