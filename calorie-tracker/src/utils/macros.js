// Research-based macro calculations for different fitness goals

/**
 * Calculate macro targets based on user profile and fitness goals
 * Based on current sports nutrition research:
 * - Protein: 1.6-2.2g/kg for muscle building, 1.2-1.6g/kg for maintenance
 * - Fat: 20-35% of total calories
 * - Carbs: Remainder of calories
 */

export const FITNESS_GOALS = {
  MUSCLE_GAIN: 'muscle_gain',
  FAT_LOSS: 'fat_loss',
  MAINTENANCE: 'maintenance',
  ATHLETIC_PERFORMANCE: 'athletic_performance',
};

export const GOAL_INFO = {
  [FITNESS_GOALS.MUSCLE_GAIN]: {
    label: 'Build Lean Muscle',
    description: 'Optimize protein intake and caloric surplus for muscle growth',
    calorieAdjustmentPercent: 0.15, // +15% surplus (scales with body size)
    minAdjustment: 200,
    maxAdjustment: 500,
    proteinPerKg: 2.0, // 2.0g per kg bodyweight
    fatPercent: 25, // 25% of total calories
    explanation: 'Higher protein (2.0g/kg) supports muscle protein synthesis. Moderate caloric surplus promotes muscle growth while minimizing fat gain.',
  },
  [FITNESS_GOALS.FAT_LOSS]: {
    label: 'Lose Fat',
    description: 'Preserve muscle while creating caloric deficit',
    calorieAdjustmentPercent: -0.15, // -15% deficit (scales with body size)
    minAdjustment: -700, // Conservative max deficit
    maxAdjustment: -300, // Recommended lower limit
    proteinPerKg: 2.2, // 2.2g per kg bodyweight (higher during deficit)
    fatPercent: 25, // 25% of total calories
    explanation: 'Higher protein (2.2g/kg) during deficit helps preserve lean mass. Conservative deficit allows sustainable fat loss while preserving muscle, especially for leaner individuals.',
  },
  [FITNESS_GOALS.MAINTENANCE]: {
    label: 'Maintain Weight',
    description: 'Balanced nutrition for weight maintenance',
    calorieAdjustmentPercent: 0, // No adjustment
    minAdjustment: 0,
    maxAdjustment: 0,
    proteinPerKg: 1.6, // 1.6g per kg bodyweight
    fatPercent: 30, // 30% of total calories
    explanation: 'Moderate protein (1.6g/kg) maintains muscle mass. Balanced macros support general health and performance.',
  },
  [FITNESS_GOALS.ATHLETIC_PERFORMANCE]: {
    label: 'Athletic Performance',
    description: 'Fuel training and optimize recovery',
    calorieAdjustmentPercent: 0.10, // +10% for training demands (scales with body size)
    minAdjustment: 200,
    maxAdjustment: 400,
    proteinPerKg: 1.8, // 1.8g per kg bodyweight
    fatPercent: 25, // 25% of total calories
    explanation: 'Moderate-high protein (1.8g/kg) for recovery. Higher carbs fuel intense training. Slight surplus supports performance.',
  },
};

/**
 * Calculate daily macro targets
 * @param {number} weight - Body weight in kg
 * @param {number} tdee - Total Daily Energy Expenditure
 * @param {string} goal - Fitness goal from FITNESS_GOALS
 * @returns {object} - { calories, protein, carbs, fat, explanation, calorieAdjustment }
 */
export function calculateMacroTargets(weight, tdee, goal) {
  const goalInfo = GOAL_INFO[goal] || GOAL_INFO[FITNESS_GOALS.MAINTENANCE];

  // Calculate calorie adjustment based on TDEE percentage (scales with body size)
  let calorieAdjustment = Math.round(tdee * goalInfo.calorieAdjustmentPercent);

  // Apply min/max caps for safety
  if (calorieAdjustment < 0) {
    // For deficits: cap between maxAdjustment (less aggressive) and minAdjustment (more aggressive)
    calorieAdjustment = Math.max(goalInfo.minAdjustment, Math.min(goalInfo.maxAdjustment, calorieAdjustment));
  } else if (calorieAdjustment > 0) {
    // For surpluses: cap between minAdjustment and maxAdjustment
    calorieAdjustment = Math.min(goalInfo.maxAdjustment, Math.max(goalInfo.minAdjustment, calorieAdjustment));
  }

  // Calculate target calories
  const targetCalories = tdee + calorieAdjustment;

  // Calculate protein (g)
  const proteinGrams = Math.round(weight * goalInfo.proteinPerKg);
  const proteinCalories = proteinGrams * 4; // 4 cal/g

  // Calculate fat (g)
  const fatCalories = Math.round(targetCalories * (goalInfo.fatPercent / 100));
  const fatGrams = Math.round(fatCalories / 9); // 9 cal/g

  // Calculate carbs (g) - remainder of calories
  const carbCalories = targetCalories - proteinCalories - fatCalories;
  const carbGrams = Math.round(carbCalories / 4); // 4 cal/g

  return {
    goal,
    goalLabel: goalInfo.label,
    calories: targetCalories,
    protein: proteinGrams,
    carbs: Math.max(0, carbGrams), // Ensure non-negative
    fat: fatGrams,
    explanation: goalInfo.explanation,
    calorieAdjustment, // Return the calculated adjustment
    breakdown: {
      proteinPercent: Math.round((proteinCalories / targetCalories) * 100),
      carbPercent: Math.round((carbCalories / targetCalories) * 100),
      fatPercent: Math.round((fatCalories / targetCalories) * 100),
    },
  };
}

/**
 * Get current macro totals from food entries
 * @param {array} foodEntries - Array of food entries
 * @returns {object} - { calories, protein, carbs, fat }
 */
export function getCurrentMacros(foodEntries) {
  return foodEntries.reduce(
    (totals, entry) => ({
      calories: totals.calories + (entry.calories || 0),
      protein: totals.protein + (entry.protein || 0),
      carbs: totals.carbs + (entry.carbs || 0),
      fat: totals.fat + (entry.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

/**
 * Calculate macro percentages for pie chart
 * @param {number} protein - Protein in grams
 * @param {number} carbs - Carbs in grams
 * @param {number} fat - Fat in grams
 * @returns {array} - Array for pie chart with percentages
 */
export function getMacroPercentages(protein, carbs, fat) {
  const proteinCal = protein * 4;
  const carbCal = carbs * 4;
  const fatCal = fat * 9;
  const total = proteinCal + carbCal + fatCal;

  if (total === 0) {
    return [
      { name: 'Protein', value: 33, grams: 0, color: '#ef4444' },
      { name: 'Carbs', value: 33, grams: 0, color: '#3b82f6' },
      { name: 'Fat', value: 34, grams: 0, color: '#f59e0b' },
    ];
  }

  return [
    {
      name: 'Protein',
      value: Math.round((proteinCal / total) * 100),
      grams: Math.round(protein),
      color: '#ef4444',
    },
    {
      name: 'Carbs',
      value: Math.round((carbCal / total) * 100),
      grams: Math.round(carbs),
      color: '#3b82f6',
    },
    {
      name: 'Fat',
      value: Math.round((fatCal / total) * 100),
      grams: Math.round(fat),
      color: '#f59e0b',
    },
  ];
}
