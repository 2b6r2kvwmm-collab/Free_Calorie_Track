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
  MEAL_TEMPLATES: 'mealTemplates',
  CUSTOM_MACROS: 'customMacros',
  CUSTOM_CALORIE_GOAL: 'customCalorieGoal',
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

  // Default to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
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

// Meal Templates
export function getMealTemplates() {
  return getData(STORAGE_KEYS.MEAL_TEMPLATES) || [];
}

export function addMealTemplate(template) {
  const templates = getMealTemplates();
  const newTemplate = {
    ...template,
    id: Date.now(),
  };
  templates.push(newTemplate);
  setData(STORAGE_KEYS.MEAL_TEMPLATES, templates);
  return newTemplate;
}

export function deleteMealTemplate(id) {
  const templates = getMealTemplates();
  const filtered = templates.filter(template => template.id !== id);
  setData(STORAGE_KEYS.MEAL_TEMPLATES, filtered);
}
