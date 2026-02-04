import { getData, setData } from './storage';

/**
 * Export all user data as a JSON backup file.
 * Shared utility used by both Settings and BackupReminderModal.
 */
export function handleExport() {
  const exportData = {
    profile: getData('profile'),
    foodLog: getData('foodLog'),
    exerciseLog: getData('exerciseLog'),
    favorites: getData('favorites'),
    recentFoods: getData('recentFoods'),
    dailyGoal: getData('dailyGoal'),
    weightLog: getData('weightLog'),
    darkMode: getData('darkMode'),
    customFoods: getData('customFoods'),
    customMacros: getData('customMacros'),
    waterLog: getData('waterLog'),
    waterUnit: getData('waterUnit'),
    workoutTemplates: getData('workoutTemplates'),
    exportDate: new Date().toISOString(),
    version: '1.1',
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `calorie-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Mark that user has exported at least once
  setData('hasExported', true);
}
