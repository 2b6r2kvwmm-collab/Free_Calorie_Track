import { useState } from 'react';
import { calculateMacroTargets } from '../utils/macros';
import { calculateBMR, calculateTDEE } from '../utils/calculations';

export default function MacroTracker({
  profile,
  currentProtein,
  currentCarbs,
  currentFat,
  proteinGoal,
  carbsGoal,
  fatGoal,
  isCustomGoals = false,
  exerciseBurned = 0
}) {
  // Use provided goals if available (passed from Dashboard after recalculation)
  let baseMacroTargets;
  if (proteinGoal && carbsGoal && fatGoal) {
    // Goals already calculated in Dashboard (handles custom goals AND manual adjustments)
    const totalCals = (proteinGoal * 4) + (carbsGoal * 4) + (fatGoal * 9);
    const goalLabel = isCustomGoals ? 'Custom Goals' : 'Adjusted Goals';
    baseMacroTargets = {
      protein: proteinGoal,
      carbs: carbsGoal,
      fat: fatGoal,
      goalLabel: goalLabel,
      explanation: isCustomGoals
        ? 'Using your custom calorie and macro targets.'
        : 'Macro targets adjusted for your manual calorie goal.',
      breakdown: {
        proteinPercent: Math.round((proteinGoal * 4 / totalCals) * 100),
        carbPercent: Math.round((carbsGoal * 4 / totalCals) * 100),
        fatPercent: Math.round((fatGoal * 9 / totalCals) * 100),
      }
    };
  } else {
    // Fallback: Calculate based on fitness goal
    const bmr = calculateBMR(profile);
    const tdee = calculateTDEE(bmr, profile.activityLevel);
    baseMacroTargets = calculateMacroTargets(profile.weight, tdee, profile.fitnessGoal);
  }

  // Adjust macro targets based on exercise
  let macroTargets = { ...baseMacroTargets };
  if (exerciseBurned > 0) {
    // Calculate additional macros proportionally based on the macro split
    const baseTotalCals = (baseMacroTargets.protein * 4) + (baseMacroTargets.carbs * 4) + (baseMacroTargets.fat * 9);
    const proteinPercent = (baseMacroTargets.protein * 4) / baseTotalCals;
    const carbPercent = (baseMacroTargets.carbs * 4) / baseTotalCals;
    const fatPercent = (baseMacroTargets.fat * 9) / baseTotalCals;

    // Calculate additional grams for each macro
    const additionalProtein = Math.round((exerciseBurned * proteinPercent) / 4);
    const additionalCarbs = Math.round((exerciseBurned * carbPercent) / 4);
    const additionalFat = Math.round((exerciseBurned * fatPercent) / 9);

    macroTargets = {
      ...baseMacroTargets,
      protein: baseMacroTargets.protein + additionalProtein,
      carbs: baseMacroTargets.carbs + additionalCarbs,
      fat: baseMacroTargets.fat + additionalFat,
      explanation: `${baseMacroTargets.explanation} Adjusted for ${exerciseBurned} calories burned from exercise today (+${additionalProtein}g protein, +${additionalCarbs}g carbs, +${additionalFat}g fat).`,
    };
  }

  const [showGoalDetails, setShowGoalDetails] = useState(false);
  const totalCurrentCal = (currentProtein * 4) + (currentCarbs * 4) + (currentFat * 9);

  // Calculate progress percentages
  const proteinProgress = Math.min((currentProtein / macroTargets.protein) * 100, 100);
  const carbProgress = Math.min((currentCarbs / macroTargets.carbs) * 100, 100);
  const fatProgress = Math.min((currentFat / macroTargets.fat) * 100, 100);

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">Macro Nutrition</h2>

      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Goal: {macroTargets.goalLabel}</div>
          <button
            onClick={() => setShowGoalDetails(prev => !prev)}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {showGoalDetails ? 'Less ▴' : 'More ▾'}
          </button>
        </div>
        {showGoalDetails && (
          <>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              {macroTargets.explanation}
            </div>
            {totalCurrentCal > 0 && (
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Today's total: {Math.round(totalCurrentCal)} calories
              </div>
            )}
          </>
        )}
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        {/* Protein */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-violet-600 dark:text-violet-400">Protein</span>
            <span className="text-sm">
              {Math.round(currentProtein)}g / {macroTargets.protein}g
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-violet-500 h-3 rounded-full transition-all"
              style={{ width: `${proteinProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Carbs */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-orange-600 dark:text-orange-400">Carbs</span>
            <span className="text-sm">
              {Math.round(currentCarbs)}g / {macroTargets.carbs}g
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-orange-500 h-3 rounded-full transition-all"
              style={{ width: `${carbProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Fat */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-teal-600 dark:text-teal-400">Fat</span>
            <span className="text-sm">
              {Math.round(currentFat)}g / {macroTargets.fat}g
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-teal-500 h-3 rounded-full transition-all"
              style={{ width: `${fatProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Target Breakdown */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-sm font-semibold mb-2">Daily Targets</div>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-violet-600 dark:text-violet-400 font-bold text-lg">
              {macroTargets.breakdown.proteinPercent}%
            </div>
            <div className="text-gray-600 dark:text-gray-400">Protein</div>
          </div>
          <div>
            <div className="text-orange-600 dark:text-orange-400 font-bold text-lg">
              {macroTargets.breakdown.carbPercent}%
            </div>
            <div className="text-gray-600 dark:text-gray-400">Carbs</div>
          </div>
          <div>
            <div className="text-teal-600 dark:text-teal-400 font-bold text-lg">
              {macroTargets.breakdown.fatPercent}%
            </div>
            <div className="text-gray-600 dark:text-gray-400">Fat</div>
          </div>
        </div>
      </div>
    </div>
  );
}
