import { useState } from 'react';
import { calculateMacroTargets, GOAL_INFO } from '../utils/macros';
import { calculateBMR, calculateTDEE, getReproductiveStatusCalorieAdjustment, calculateNutritionTargets } from '../utils/calculations';
import { getCustomNutrition } from '../utils/storage';

export default function MacroTracker({
  profile,
  currentProtein,
  currentCarbs,
  currentFat,
  proteinGoal,
  carbsGoal,
  fatGoal,
  isCustomGoals = false,
  fitnessGoal = null,
  exerciseBurned = 0,
  // Additional nutrition (optional — only passed when setting is enabled)
  showAdditional = false,
  fiber = 0,
  sodium = 0,
  sugar = 0,
  saturatedFat = 0,
  calorieGoal = 2000,
}) {
  // Use provided goals if available (passed from Dashboard after recalculation)
  let baseMacroTargets;
  if (proteinGoal && carbsGoal && fatGoal) {
    const totalCals = (proteinGoal * 4) + (carbsGoal * 4) + (fatGoal * 9);
    let goalLabel, explanation;
    if (isCustomGoals) {
      goalLabel = 'Custom Goals';
      explanation = 'Using your custom calorie and macro targets.';
    } else if (fitnessGoal && GOAL_INFO[fitnessGoal]) {
      goalLabel = GOAL_INFO[fitnessGoal].label;
      explanation = GOAL_INFO[fitnessGoal].explanation;
    } else {
      goalLabel = 'Custom Goal';
      explanation = 'Macro targets based on your calorie goal.';
    }
    baseMacroTargets = {
      protein: proteinGoal,
      carbs: carbsGoal,
      fat: fatGoal,
      goalLabel,
      explanation,
      breakdown: {
        proteinPercent: Math.round((proteinGoal * 4 / totalCals) * 100),
        carbPercent: Math.round((carbsGoal * 4 / totalCals) * 100),
        fatPercent: Math.round((fatGoal * 9 / totalCals) * 100),
      }
    };
  } else {
    const bmr = calculateBMR(profile);
    const baseTdee = calculateTDEE(bmr, profile.activityLevel);
    const reproductiveAdjustment = getReproductiveStatusCalorieAdjustment(profile);
    const tdee = baseTdee + reproductiveAdjustment;
    baseMacroTargets = calculateMacroTargets(profile.weight, tdee, profile.fitnessGoal, profile);
  }

  // Adjust macro targets based on exercise
  let macroTargets = { ...baseMacroTargets };
  if (exerciseBurned > 0) {
    const baseTotalCals = (baseMacroTargets.protein * 4) + (baseMacroTargets.carbs * 4) + (baseMacroTargets.fat * 9);
    const proteinPercent = (baseMacroTargets.protein * 4) / baseTotalCals;
    const carbPercent = (baseMacroTargets.carbs * 4) / baseTotalCals;
    const fatPercent = (baseMacroTargets.fat * 9) / baseTotalCals;
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
  const [activePage, setActivePage] = useState(0);
  const totalPages = showAdditional ? 2 : 1;

  const proteinProgress = Math.min((currentProtein / macroTargets.protein) * 100, 100);
  const carbProgress = Math.min((currentCarbs / macroTargets.carbs) * 100, 100);
  const fatProgress = Math.min((currentFat / macroTargets.fat) * 100, 100);

  // Donut chart geometry
  const r = 16;
  const circ = 2 * Math.PI * r;
  const { proteinPercent, carbPercent, fatPercent } = macroTargets.breakdown;
  const pLen = (proteinPercent / 100) * circ;
  const cLen = (carbPercent  / 100) * circ;
  const fLen = (fatPercent   / 100) * circ;

  // Additional nutrition targets
  const customNutrition = getCustomNutrition();
  const autoTargets = calculateNutritionTargets(calorieGoal);
  const nutTargets = customNutrition || autoTargets;

  // Intentional color system:
  //   Fiber    → emerald  (health goal, brand color)
  //   Sodium   → sky      (mineral/medical, calm blue)
  //   Sugar    → amber    (carbs-adjacent warmth)
  //   Sat. Fat → rose     (fat quality, distinct from macro teal)
  //
  // Bar uses identity color in normal range → amber as warning → red if over limit.
  // Number value is neutral gray until over limit → red.
  const nutCards = [
    {
      label: 'Fiber',
      current: fiber,
      target: nutTargets.fiber,
      unit: 'g',
      isGoal: true,
      description: 'goal',
      labelColor: 'text-emerald-600 dark:text-emerald-400',
      barColor: (p) => p >= 100 ? 'bg-emerald-500' : p >= 60 ? 'bg-emerald-400' : 'bg-emerald-300 dark:bg-emerald-700',
      valueColor: (p) => p >= 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-200',
    },
    {
      label: 'Sodium',
      current: sodium,
      target: nutTargets.sodium,
      unit: 'mg',
      isGoal: false,
      description: 'limit',
      labelColor: 'text-sky-600 dark:text-sky-400',
      barColor: (p) => p > 100 ? 'bg-red-500' : p > 80 ? 'bg-amber-400' : 'bg-sky-400',
      valueColor: (p) => p > 100 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-200',
    },
    {
      label: 'Sugar',
      current: sugar,
      target: nutTargets.sugar,
      unit: 'g',
      isGoal: false,
      description: 'limit',
      labelColor: 'text-amber-600 dark:text-amber-400',
      barColor: (p) => p > 100 ? 'bg-red-500' : p > 80 ? 'bg-amber-500' : 'bg-amber-400',
      valueColor: (p) => p > 100 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-200',
    },
    {
      label: 'Sat. Fat',
      current: saturatedFat,
      target: nutTargets.saturatedFat,
      unit: 'g',
      isGoal: false,
      description: 'limit',
      labelColor: 'text-rose-600 dark:text-rose-400',
      barColor: (p) => p > 100 ? 'bg-red-500' : p > 80 ? 'bg-amber-400' : 'bg-rose-400',
      valueColor: (p) => p > 100 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-200',
    },
  ];

  // Touch swipe handling
  const handleTouchStart = (e) => {
    e.currentTarget.dataset.startX = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const diff = parseFloat(e.currentTarget.dataset.startX) - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activePage < totalPages - 1) setActivePage(p => p + 1);
      else if (diff < 0 && activePage > 0) setActivePage(p => p - 1);
    }
  };

  return (
    <div
      className="card overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header with page dots */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          {activePage === 0 ? 'Macro Nutrition' : 'Additional Nutrition'}
        </h2>
        {showAdditional && (
          <div className="flex items-center gap-2">
            {[0, 1].map(i => (
              <button
                key={i}
                onClick={() => setActivePage(i)}
                className={`rounded-full transition-all duration-200 ${
                  activePage === i
                    ? 'bg-emerald-500 w-4 h-2'
                    : 'bg-gray-300 dark:bg-gray-600 w-2 h-2'
                }`}
                aria-label={i === 0 ? 'Macro nutrition' : 'Additional nutrition'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sliding pages wrapper */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            width: `${totalPages * 100}%`,
            transform: `translateX(-${(activePage / totalPages) * 100}%)`,
          }}
        >
          {/* ── Page 0: Macros ── */}
          <div style={{ width: `${100 / totalPages}%` }}>
            <div className="space-y-4">
              {[
                { label: 'Protein', current: currentProtein, goal: macroTargets.protein, progress: proteinProgress, color: 'violet' },
                { label: 'Carbs',   current: currentCarbs,   goal: macroTargets.carbs,   progress: carbProgress,    color: 'orange' },
                { label: 'Fat',     current: currentFat,     goal: macroTargets.fat,     progress: fatProgress,     color: 'teal'   },
              ].map(({ label, current, goal, progress, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1.5">
                    <span className={`font-semibold text-sm text-${color}-600 dark:text-${color}-400`}>{label}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(current)}g / {goal}g</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`bg-${color}-500 h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Goal info + donut split — side by side */}
            <div className="mt-5 flex gap-3 items-stretch">
              {/* Goal box — stretches to match donut height */}
              <div className="flex-1 min-w-0 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/40 flex flex-col justify-center gap-1.5">
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Goal</div>
                <div className="font-bold text-base text-gray-800 dark:text-gray-200 leading-tight">
                  {macroTargets.goalLabel}
                </div>
                <button
                  onClick={() => setShowGoalDetails(prev => !prev)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline self-start"
                >
                  {showGoalDetails ? 'Less ▴' : 'Details ▾'}
                </button>
                {showGoalDetails && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {macroTargets.explanation}
                  </div>
                )}
              </div>

              {/* Donut chart */}
              <div className="flex flex-col items-center gap-1.5 bg-gray-50 dark:bg-gray-700/40 p-3 rounded-lg shrink-0">
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide self-start">Targets</div>
                <div className="flex items-center gap-2">
                {/*
                  dashoffset formula: circ - cumulativeStart
                  Each segment's fill starts at (cumulativeStart) along the path.
                  strokeDashoffset shifts the pattern so the fill lands at that position.
                  -rotate-90 CSS moves the path start from 3 o'clock to 12 o'clock.
                */}
                <svg viewBox="0 0 40 40" className="w-14 h-14 -rotate-90">
                  <circle cx="20" cy="20" r={r} fill="none" strokeWidth="8"
                    className="stroke-gray-200 dark:stroke-gray-600" />
                  <circle cx="20" cy="20" r={r} fill="none" stroke="#8b5cf6" strokeWidth="8"
                    strokeDasharray={`${pLen} ${circ - pLen}`}
                    strokeDashoffset={circ} />
                  <circle cx="20" cy="20" r={r} fill="none" stroke="#f97316" strokeWidth="8"
                    strokeDasharray={`${cLen} ${circ - cLen}`}
                    strokeDashoffset={circ - pLen} />
                  <circle cx="20" cy="20" r={r} fill="none" stroke="#14b8a6" strokeWidth="8"
                    strokeDasharray={`${fLen} ${circ - fLen}`}
                    strokeDashoffset={circ - pLen - cLen} />
                </svg>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                    <span className="font-semibold text-violet-600 dark:text-violet-400">{proteinPercent}%</span>
                    <span className="text-gray-400 dark:text-gray-500">P</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                    <span className="font-semibold text-orange-600 dark:text-orange-400">{carbPercent}%</span>
                    <span className="text-gray-400 dark:text-gray-500">C</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                    <span className="font-semibold text-teal-600 dark:text-teal-400">{fatPercent}%</span>
                    <span className="text-gray-400 dark:text-gray-500">F</span>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {showAdditional && (
              <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
                Swipe for fiber, sodium, sugar & sat. fat →
              </p>
            )}
          </div>

          {/* ── Page 1: Additional Nutrition ── */}
          {showAdditional && (
            <div style={{ width: `${100 / totalPages}%` }}>
              <div className="grid grid-cols-2 gap-3">
                {nutCards.map((card) => {
                  const pct = Math.min((card.current / card.target) * 100, 150);
                  const displayVal = card.unit === 'mg'
                    ? Math.round(card.current)
                    : Math.round(card.current * 10) / 10;
                  return (
                    <div key={card.label} className="p-3.5 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-semibold ${card.labelColor}`}>{card.label}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{card.description}</span>
                      </div>
                      <div className="flex items-baseline gap-1 mb-2.5">
                        <span className={`text-xl font-bold ${card.valueColor(pct)}`}>
                          {displayVal}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          / {card.target}{card.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${card.barColor(pct)}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
                ← Swipe back for macros
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
