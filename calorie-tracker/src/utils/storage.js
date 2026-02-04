// LocalStorage utility functions
import { getUserStorageKey } from './users';

const STORAGE_KEYS = {
  PROFILE: 'profile',
  FOOD_LOG: 'foodLog',
  EXERCISE_LOG: 'exerciseLog',
  FAVORITES: 'favorites',
  RECENT_FOODS: 'recentFoods',
  DAILY_GOAL: 'dailyGoal',
  WEIGHT_LOG: 'weightLog',
  DARK_MODE: 'darkMode',
  CUSTOM_FOODS: 'customFoods',
  CUSTOM_MACROS: 'customMacros',
  CUSTOM_CALORIE_GOAL: 'customCalorieGoal',
  WATER_LOG: 'waterLog',
  WATER_UNIT: 'waterUnit',
  WORKOUT_TEMPLATES: 'workoutTemplates',
  MILESTONES_SHOWN: 'milestonesShown',
};

// Get local date string (YYYY-MM-DD) in user's timezone, not UTC
// This ensures day boundaries happen at midnight local time, not UTC midnight
export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generic get/set functions
export function getData(key) {
  try {
    const userKey = getUserStorageKey(key);
    const data = localStorage.getItem(userKey);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

export function setData(key, value) {
  try {
    const userKey = getUserStorageKey(key);
    localStorage.setItem(userKey, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}

// Profile
export function getProfile() {
  return getData(STORAGE_KEYS.PROFILE);
}

export function saveProfile(profile) {
  setData(STORAGE_KEYS.PROFILE, profile);
}

// Food Log - array of { date, timestamp, name, calories, servingSize, barcode }
export function getFoodLog() {
  return getData(STORAGE_KEYS.FOOD_LOG) || [];
}

export function addFoodEntry(entry, customDate = null) {
  const log = getFoodLog();
  const newEntry = {
    ...entry,
    timestamp: Date.now(),
    date: customDate || getLocalDateString(),
  };
  log.push(newEntry);
  setData(STORAGE_KEYS.FOOD_LOG, log);

  // Update recent foods
  updateRecentFoods(entry);

  return newEntry;
}

export function deleteFoodEntry(timestamp) {
  const log = getFoodLog();
  const filtered = log.filter(entry => entry.timestamp !== timestamp);
  setData(STORAGE_KEYS.FOOD_LOG, filtered);
}

export function updateFoodEntry(timestamp, updatedFields) {
  const log = getFoodLog();
  const updatedLog = log.map(entry =>
    entry.timestamp === timestamp
      ? { ...entry, ...updatedFields }
      : entry
  );
  setData(STORAGE_KEYS.FOOD_LOG, updatedLog);
}

// Exercise Log - array of { date, timestamp, name, duration, caloriesBurned }
export function getExerciseLog() {
  return getData(STORAGE_KEYS.EXERCISE_LOG) || [];
}

export function addExerciseEntry(entry, customDate = null) {
  const log = getExerciseLog();
  const newEntry = {
    ...entry,
    timestamp: Date.now(),
    date: customDate || getLocalDateString(),
  };
  log.push(newEntry);
  setData(STORAGE_KEYS.EXERCISE_LOG, log);
  return newEntry;
}

export function deleteExerciseEntry(timestamp) {
  const log = getExerciseLog();
  const filtered = log.filter(entry => entry.timestamp !== timestamp);
  setData(STORAGE_KEYS.EXERCISE_LOG, filtered);
}

export function updateExerciseEntry(timestamp, updatedFields) {
  const log = getExerciseLog();
  const updatedLog = log.map(entry =>
    entry.timestamp === timestamp
      ? { ...entry, ...updatedFields }
      : entry
  );
  setData(STORAGE_KEYS.EXERCISE_LOG, updatedLog);
}

// Favorites
export function getFavorites() {
  return getData(STORAGE_KEYS.FAVORITES) || [];
}

export function addFavorite(food) {
  const favorites = getFavorites();
  // Avoid duplicates
  if (!favorites.find(f => f.name === food.name && f.calories === food.calories)) {
    favorites.push({ ...food, addedAt: Date.now() });
    setData(STORAGE_KEYS.FAVORITES, favorites);
  }
}

export function removeFavorite(food) {
  const favorites = getFavorites();
  const filtered = favorites.filter(f => !(f.name === food.name && f.calories === food.calories));
  setData(STORAGE_KEYS.FAVORITES, filtered);
}

// Recent Foods
export function getRecentFoods() {
  return getData(STORAGE_KEYS.RECENT_FOODS) || [];
}

function updateRecentFoods(food) {
  let recent = getRecentFoods();

  // Remove duplicate if exists
  recent = recent.filter(f => f.name !== food.name);

  // Add to beginning
  recent.unshift({ ...food, lastUsed: Date.now() });

  // Keep only last 20
  recent = recent.slice(0, 20);

  setData(STORAGE_KEYS.RECENT_FOODS, recent);
}

// Daily Goal (NET calories - 0 = maintenance, negative = weight loss, positive = weight gain)
export function getDailyGoal() {
  return getData(STORAGE_KEYS.DAILY_GOAL) ?? 0; // Default to 0 (maintenance)
}

export function saveDailyGoal(goal) {
  setData(STORAGE_KEYS.DAILY_GOAL, goal);
}

// Custom Macros - { protein, carbs, fat } in grams, or null if using auto-calculated
export function getCustomMacros() {
  return getData(STORAGE_KEYS.CUSTOM_MACROS);
}

export function saveCustomMacros(macros) {
  setData(STORAGE_KEYS.CUSTOM_MACROS, macros);
}

export function clearCustomMacros() {
  setData(STORAGE_KEYS.CUSTOM_MACROS, null);
}

// Custom Calorie Goal - number or null if using auto-calculated
export function getCustomCalorieGoal() {
  return getData(STORAGE_KEYS.CUSTOM_CALORIE_GOAL);
}

export function saveCustomCalorieGoal(goal) {
  setData(STORAGE_KEYS.CUSTOM_CALORIE_GOAL, goal);
}

export function clearCustomCalorieGoal() {
  setData(STORAGE_KEYS.CUSTOM_CALORIE_GOAL, null);
}

// Weight Log - array of { date, weight }
export function getWeightLog() {
  return getData(STORAGE_KEYS.WEIGHT_LOG) || [];
}

export function addWeightEntry(weight) {
  const log = getWeightLog();
  const date = getLocalDateString();

  // Update or add today's weight
  const existingIndex = log.findIndex(entry => entry.date === date);
  if (existingIndex >= 0) {
    log[existingIndex].weight = weight;
  } else {
    log.push({ date, weight });
  }

  // Sort by date
  log.sort((a, b) => new Date(a.date) - new Date(b.date));

  setData(STORAGE_KEYS.WEIGHT_LOG, log);
}

// Dark Mode
export function getDarkMode() {
  const stored = getData(STORAGE_KEYS.DARK_MODE);
  if (stored !== null) return stored;

  // Default to dark mode
  return true;
}

export function saveDarkMode(isDark) {
  setData(STORAGE_KEYS.DARK_MODE, isDark);
}

// Get entries for a specific date
export function getEntriesForDate(date) {
  const foodLog = getFoodLog();
  const exerciseLog = getExerciseLog();

  return {
    food: foodLog.filter(entry => entry.date === date),
    exercise: exerciseLog.filter(entry => entry.date === date),
  };
}

// Get today's entries
export function getTodayEntries() {
  const today = getLocalDateString();
  return getEntriesForDate(today);
}

// Custom Foods
export function getCustomFoods() {
  return getData(STORAGE_KEYS.CUSTOM_FOODS) || [];
}

export function addCustomFood(food) {
  const customFoods = getCustomFoods();
  const newFood = {
    ...food,
    id: Date.now(),
    isCustom: true,
  };
  customFoods.push(newFood);
  setData(STORAGE_KEYS.CUSTOM_FOODS, customFoods);
  return newFood;
}

export function deleteCustomFood(id) {
  const customFoods = getCustomFoods();
  const filtered = customFoods.filter(food => food.id !== id);
  setData(STORAGE_KEYS.CUSTOM_FOODS, filtered);
}

// Water Log - { date: amount in mL }
export function getWaterLog() {
  return getData(STORAGE_KEYS.WATER_LOG) || {};
}

export function getWaterForDate(date = null) {
  const log = getWaterLog();
  const dateStr = date || getLocalDateString();
  return log[dateStr] || 0;
}

export function addWater(amountMl, date = null) {
  const log = getWaterLog();
  const dateStr = date || getLocalDateString();
  log[dateStr] = (log[dateStr] || 0) + amountMl;
  setData(STORAGE_KEYS.WATER_LOG, log);
  return log[dateStr];
}

export function setWaterForDate(amountMl, date = null) {
  const log = getWaterLog();
  const dateStr = date || getLocalDateString();
  log[dateStr] = amountMl;
  setData(STORAGE_KEYS.WATER_LOG, log);
  return log[dateStr];
}

// Water Unit Preference - 'oz' or 'mL'
export function getWaterUnit() {
  return getData(STORAGE_KEYS.WATER_UNIT) || null; // null means use profile unit preference
}

export function saveWaterUnit(unit) {
  setData(STORAGE_KEYS.WATER_UNIT, unit);
}

// Water Tracker Enabled - boolean for showing water tracker on dashboard
export function getWaterTrackerEnabled() {
  const enabled = getData('waterTrackerEnabled');
  return enabled !== null ? enabled : false; // Default to false (opt-in)
}

export function saveWaterTrackerEnabled(enabled) {
  setData('waterTrackerEnabled', enabled);
}

// Meal Type Categorization - boolean for prompting meal type when logging food
export function getMealTypeEnabled() {
  const enabled = getData('mealTypeEnabled');
  return enabled !== null ? enabled : false; // Default to false (opt-in)
}

export function saveMealTypeEnabled(enabled) {
  setData('mealTypeEnabled', enabled);
}

// Convert between oz and mL
export function ozToMl(oz) {
  return Math.round(oz * 29.5735);
}

export function mlToOz(ml) {
  return Math.round(ml / 29.5735 * 10) / 10;
}

// Workout Templates - array of { id, name, exercises: [...] }
export function getWorkoutTemplates() {
  return getData(STORAGE_KEYS.WORKOUT_TEMPLATES) || [];
}

export function addWorkoutTemplate(template) {
  const templates = getWorkoutTemplates();
  const newTemplate = {
    ...template,
    id: Date.now(),
    createdAt: Date.now(),
  };
  templates.push(newTemplate);
  setData(STORAGE_KEYS.WORKOUT_TEMPLATES, templates);
  return newTemplate;
}

export function updateWorkoutTemplate(id, updatedFields) {
  const templates = getWorkoutTemplates();
  const updatedTemplates = templates.map(t =>
    t.id === id ? { ...t, ...updatedFields } : t
  );
  setData(STORAGE_KEYS.WORKOUT_TEMPLATES, updatedTemplates);
}

export function deleteWorkoutTemplate(id) {
  const templates = getWorkoutTemplates();
  const filtered = templates.filter(t => t.id !== id);
  setData(STORAGE_KEYS.WORKOUT_TEMPLATES, filtered);
}

// Copy yesterday's meals to today
export function copyYesterdaysMeals() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);
  const todayStr = getLocalDateString();

  const foodLog = getFoodLog();
  const yesterdayEntries = foodLog.filter(entry => entry.date === yesterdayStr);

  if (yesterdayEntries.length === 0) {
    return { success: false, count: 0, message: 'No meals found from yesterday' };
  }

  // Copy each entry with new timestamps and today's date
  let count = 0;
  yesterdayEntries.forEach(entry => {
    const newEntry = {
      ...entry,
      timestamp: Date.now() + count, // Ensure unique timestamps
      date: todayStr,
    };
    delete newEntry.id; // Remove any existing id
    const log = getFoodLog();
    log.push(newEntry);
    setData(STORAGE_KEYS.FOOD_LOG, log);
    count++;
  });

  return { success: true, count, message: `Copied ${count} meal(s) from yesterday` };
}

// Backup reminder tracking - { day10: true, day30: false }
export function getBackupReminderState() {
  return getData('backupReminderState') || { day10: false, day30: false };
}

export function markBackupReminderShown(stage) {
  const state = getBackupReminderState();
  state[stage] = true;
  setData('backupReminderState', state);
}

export function hasExported() {
  return getData('hasExported') === true;
}

// Milestone tracking - { days60: true, days180: false, days365: false }
export function getMilestonesShown() {
  return getData(STORAGE_KEYS.MILESTONES_SHOWN) || {
    days60: false,
    days180: false,
    days365: false,
  };
}

export function markMilestoneShown(milestone) {
  const milestones = getMilestonesShown();
  milestones[`days${milestone}`] = true;
  setData(STORAGE_KEYS.MILESTONES_SHOWN, milestones);
}

// Calculate user stats for milestone celebrations and settings
export function calculateUserStats() {
  const foodLog = getFoodLog();
  const exerciseLog = getExerciseLog();

  // Get unique days tracked
  const uniqueDays = new Set(foodLog.map(entry => entry.date));
  const daysTracked = uniqueDays.size;

  // Count meals and workouts
  const mealsLogged = foodLog.length;
  const workouts = exerciseLog.length;

  // Calculate savings vs MyFitnessPal Premium ($80/year)
  // Base calculation on days tracked
  const daysInYear = 365;
  const savedVsCompetitors = Math.round((daysTracked / daysInYear) * 80);

  return {
    daysTracked,
    mealsLogged,
    workouts,
    savedVsCompetitors,
  };
}
