import { calculateMacroTargets } from '../utils/macros';
import { calculateBMR, calculateTDEE } from '../utils/calculations';

export default function MacroTracker({ profile, currentProtein, currentCarbs, currentFat }) {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const macroTargets = calculateMacroTargets(profile.weight, tdee, profile.fitnessGoal);

  const totalCurrentCal = (currentProtein * 4) + (currentCarbs * 4) + (currentFat * 9);

  // Calculate progress percentages
  const proteinProgress = Math.min((currentProtein / macroTargets.protein) * 100, 100);
  const carbProgress = Math.min((currentCarbs / macroTargets.carbs) * 100, 100);
  const fatProgress = Math.min((currentFat / macroTargets.fat) * 100, 100);

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">Macro Nutrition</h2>

      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="font-semibold mb-2">Goal: {macroTargets.goalLabel}</div>
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          {macroTargets.explanation}
        </div>
        {totalCurrentCal > 0 && (
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Today's total: {Math.round(totalCurrentCal)} calories
          </div>
        )}
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        {/* Protein */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-red-600 dark:text-red-400">Protein</span>
            <span className="text-sm">
              {Math.round(currentProtein)}g / {macroTargets.protein}g
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-red-500 h-3 rounded-full transition-all"
              style={{ width: `${proteinProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Carbs */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-blue-600 dark:text-blue-400">Carbs</span>
            <span className="text-sm">
              {Math.round(currentCarbs)}g / {macroTargets.carbs}g
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all"
              style={{ width: `${carbProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Fat */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-amber-600 dark:text-amber-400">Fat</span>
            <span className="text-sm">
              {Math.round(currentFat)}g / {macroTargets.fat}g
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-amber-500 h-3 rounded-full transition-all"
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
            <div className="text-red-600 dark:text-red-400 font-bold text-lg">
              {macroTargets.breakdown.proteinPercent}%
            </div>
            <div className="text-gray-600 dark:text-gray-400">Protein</div>
          </div>
          <div>
            <div className="text-blue-600 dark:text-blue-400 font-bold text-lg">
              {macroTargets.breakdown.carbPercent}%
            </div>
            <div className="text-gray-600 dark:text-gray-400">Carbs</div>
          </div>
          <div>
            <div className="text-amber-600 dark:text-amber-400 font-bold text-lg">
              {macroTargets.breakdown.fatPercent}%
            </div>
            <div className="text-gray-600 dark:text-gray-400">Fat</div>
          </div>
        </div>
      </div>
    </div>
  );
}
