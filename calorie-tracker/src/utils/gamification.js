// Gamification system for NetCal
import { getData, setData, getFoodLog, getExerciseLog, getDailyGoal } from './storage';

const GAMIFICATION_KEY = 'gamification';

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_DAY: {
    id: 'first_day',
    title: 'Getting Started',
    description: 'Log your first day of tracking',
    icon: '🌱',
    category: 'milestone',
  },
  STREAK_3: {
    id: 'streak_3',
    title: '3 Day Streak',
    description: 'Hit your NET calorie goal 3 days in a row',
    icon: '🔥',
    category: 'streak',
  },
  STREAK_7: {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Hit your NET calorie goal 7 days in a row',
    icon: '⚡',
    category: 'streak',
  },
  STREAK_30: {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Hit your NET calorie goal 30 days in a row',
    icon: '🏆',
    category: 'streak',
  },
  STREAK_100: {
    id: 'streak_100',
    title: 'Century Club',
    description: 'Hit your NET calorie goal 100 days in a row',
    icon: '👑',
    category: 'streak',
  },
  WORKOUTS_10: {
    id: 'workouts_10',
    title: 'Gym Regular',
    description: 'Log 10 workouts',
    icon: '💪',
    category: 'fitness',
  },
  WORKOUTS_50: {
    id: 'workouts_50',
    title: 'Fitness Enthusiast',
    description: 'Log 50 workouts',
    icon: '🏋️',
    category: 'fitness',
  },
  WORKOUTS_100: {
    id: 'workouts_100',
    title: 'Iron Warrior',
    description: 'Log 100 workouts',
    icon: '🦾',
    category: 'fitness',
  },
  FOODS_100: {
    id: 'foods_100',
    title: 'Nutrition Tracker',
    description: 'Log 100 food entries',
    icon: '📊',
    category: 'tracking',
  },
  FOODS_500: {
    id: 'foods_500',
    title: 'Tracking Pro',
    description: 'Log 500 food entries',
    icon: '📈',
    category: 'tracking',
  },
  PROTEIN_GOAL_10: {
    id: 'protein_goal_10',
    title: 'Protein Powered',
    description: 'Hit your protein goal 10 times',
    icon: '🥩',
    category: 'nutrition',
  },
  PERFECT_WEEK: {
    id: 'perfect_week',
    title: 'Perfect Week',
    description: 'Hit all macro goals for 7 days straight',
    icon: '⭐',
    category: 'nutrition',
  },
  EARLY_LOGGER: {
    id: 'early_logger',
    title: 'Early Bird',
    description: 'Log breakfast before 9am for 7 days',
    icon: '🌅',
    category: 'habits',
  },
  CONSISTENT_TRACKER: {
    id: 'consistent_tracker',
    title: 'Consistency King',
    description: 'Log food every day for 30 days',
    icon: '📅',
    category: 'habits',
  },
};

// Get gamification data
export function getGamificationData() {
  const defaultData = {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
    totalDaysTracked: 0,
    unlockedAchievements: [],
    stats: {
      totalWorkouts: 0,
      totalFoodEntries: 0,
      proteinGoalHits: 0,
      perfectMacroDays: 0,
      earlyBreakfasts: 0,
    },
    lastCheckDate: null,
  };

  return getData(GAMIFICATION_KEY) || defaultData;
}

// Save gamification data
export function saveGamificationData(data) {
  setData(GAMIFICATION_KEY, data);
}

// Check if an achievement is unlocked
export function isAchievementUnlocked(achievementId) {
  const data = getGamificationData();
  return data.unlockedAchievements.includes(achievementId);
}

// Unlock an achievement
export function unlockAchievement(achievementId) {
  const data = getGamificationData();
  if (!data.unlockedAchievements.includes(achievementId)) {
    data.unlockedAchievements.push(achievementId);
    saveGamificationData(data);
    return true; // Newly unlocked
  }
  return false; // Already unlocked
}

// Update daily streak
export function updateDailyStreak(netCalories, dailyGoal) {
  const data = getGamificationData();
  const today = new Date().toISOString().split('T')[0];

  // Don't update if already checked today
  if (data.lastCheckDate === today) {
    return data;
  }

  // Check if goal was hit (within 50 calorie tolerance)
  const goalHit = Math.abs(netCalories - dailyGoal) <= 50;

  if (goalHit) {
    // Check if this is consecutive
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (data.lastCompletedDate === yesterdayStr || data.currentStreak === 0) {
      data.currentStreak += 1;
      data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
    } else {
      // Streak broken
      data.currentStreak = 1;
    }

    data.lastCompletedDate = today;
  } else {
    // Check if we need to break the streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Only break streak if they had a streak and missed yesterday
    if (data.currentStreak > 0 && data.lastCompletedDate !== yesterdayStr && data.lastCompletedDate !== today) {
      data.currentStreak = 0;
    }
  }

  data.lastCheckDate = today;
  data.totalDaysTracked += 1;
  saveGamificationData(data);

  // Check for streak achievements
  checkStreakAchievements(data.currentStreak);

  return data;
}

// Check and unlock streak achievements
function checkStreakAchievements(streak) {
  if (streak >= 3 && !isAchievementUnlocked(ACHIEVEMENTS.STREAK_3.id)) {
    unlockAchievement(ACHIEVEMENTS.STREAK_3.id);
  }
  if (streak >= 7 && !isAchievementUnlocked(ACHIEVEMENTS.STREAK_7.id)) {
    unlockAchievement(ACHIEVEMENTS.STREAK_7.id);
  }
  if (streak >= 30 && !isAchievementUnlocked(ACHIEVEMENTS.STREAK_30.id)) {
    unlockAchievement(ACHIEVEMENTS.STREAK_30.id);
  }
  if (streak >= 100 && !isAchievementUnlocked(ACHIEVEMENTS.STREAK_100.id)) {
    unlockAchievement(ACHIEVEMENTS.STREAK_100.id);
  }
}

// Update workout count
export function updateWorkoutCount() {
  const data = getGamificationData();
  const exerciseLog = getExerciseLog();
  data.stats.totalWorkouts = exerciseLog.length;
  saveGamificationData(data);

  // Check workout achievements
  if (data.stats.totalWorkouts >= 10 && !isAchievementUnlocked(ACHIEVEMENTS.WORKOUTS_10.id)) {
    unlockAchievement(ACHIEVEMENTS.WORKOUTS_10.id);
  }
  if (data.stats.totalWorkouts >= 50 && !isAchievementUnlocked(ACHIEVEMENTS.WORKOUTS_50.id)) {
    unlockAchievement(ACHIEVEMENTS.WORKOUTS_50.id);
  }
  if (data.stats.totalWorkouts >= 100 && !isAchievementUnlocked(ACHIEVEMENTS.WORKOUTS_100.id)) {
    unlockAchievement(ACHIEVEMENTS.WORKOUTS_100.id);
  }
}

// Update food entry count
export function updateFoodCount() {
  const data = getGamificationData();
  const foodLog = getFoodLog();
  data.stats.totalFoodEntries = foodLog.length;
  saveGamificationData(data);

  // Check first day achievement
  if (foodLog.length >= 1 && !isAchievementUnlocked(ACHIEVEMENTS.FIRST_DAY.id)) {
    unlockAchievement(ACHIEVEMENTS.FIRST_DAY.id);
  }

  // Check food tracking achievements
  if (data.stats.totalFoodEntries >= 100 && !isAchievementUnlocked(ACHIEVEMENTS.FOODS_100.id)) {
    unlockAchievement(ACHIEVEMENTS.FOODS_100.id);
  }
  if (data.stats.totalFoodEntries >= 500 && !isAchievementUnlocked(ACHIEVEMENTS.FOODS_500.id)) {
    unlockAchievement(ACHIEVEMENTS.FOODS_500.id);
  }
}

// Get motivational nudge based on progress
export function getMotivationalNudge(netCalories, dailyGoal, totalProtein, proteinGoal) {
  const calorieProgress = dailyGoal !== 0 ? Math.abs(netCalories / dailyGoal) * 100 : 0;
  const proteinProgress = proteinGoal > 0 ? (totalProtein / proteinGoal) * 100 : 0;

  const data = getGamificationData();

  // Streak-based encouragement
  if (data.currentStreak > 0 && data.currentStreak % 7 === 0) {
    return {
      message: `Amazing! You're on a ${data.currentStreak} day streak! 🔥`,
      type: 'success',
    };
  }

  if (data.currentStreak >= 3) {
    return {
      message: `${data.currentStreak} day streak - keep it going! 💪`,
      type: 'info',
    };
  }

  // Protein progress nudges
  if (proteinGoal > 0 && proteinProgress >= 80 && proteinProgress < 100) {
    return {
      message: `You're ${Math.round(proteinProgress)}% to your protein goal! Almost there! 🥩`,
      type: 'info',
    };
  }

  // Calorie progress nudges
  if (dailyGoal !== 0) {
    const remaining = Math.abs(dailyGoal - netCalories);

    if (remaining <= 100 && remaining > 0) {
      return {
        message: `Only ${remaining} calories from your target - you're killing it! 🎯`,
        type: 'info',
      };
    }

    if (Math.abs(netCalories - dailyGoal) <= 50) {
      return {
        message: `Perfect! You hit your NET calorie goal! 🎉`,
        type: 'success',
      };
    }
  }

  // Time-based nudges
  const hour = new Date().getHours();
  if (hour < 12) {
    return {
      message: `Good morning! Track your meals today to build your streak 🌅`,
      type: 'neutral',
    };
  } else if (hour < 18) {
    return {
      message: `Keep up the great tracking! Every meal counts 📊`,
      type: 'neutral',
    };
  } else {
    return {
      message: `Evening check-in: How's your day looking? 🌙`,
      type: 'neutral',
    };
  }
}

// Get recently unlocked achievements (last 3)
export function getRecentAchievements() {
  const data = getGamificationData();
  return data.unlockedAchievements
    .slice(-3)
    .reverse()
    .map(id => Object.values(ACHIEVEMENTS).find(a => a.id === id))
    .filter(Boolean);
}

// Get achievement progress for display
export function getAchievementProgress() {
  const data = getGamificationData();

  return [
    {
      achievement: ACHIEVEMENTS.STREAK_7,
      progress: data.currentStreak,
      target: 7,
      unlocked: isAchievementUnlocked(ACHIEVEMENTS.STREAK_7.id),
    },
    {
      achievement: ACHIEVEMENTS.WORKOUTS_50,
      progress: data.stats.totalWorkouts,
      target: 50,
      unlocked: isAchievementUnlocked(ACHIEVEMENTS.WORKOUTS_50.id),
    },
    {
      achievement: ACHIEVEMENTS.FOODS_100,
      progress: data.stats.totalFoodEntries,
      target: 100,
      unlocked: isAchievementUnlocked(ACHIEVEMENTS.FOODS_100.id),
    },
  ];
}
