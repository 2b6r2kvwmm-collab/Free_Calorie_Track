// Dark mode initialization script - must run before page renders to prevent flash
(function() {
  try {
    const userId = localStorage.getItem('calorieTracker_currentUser') || 'default';
    const darkModeKey = 'calorieTracker_' + userId + '_darkMode';
    const darkMode = localStorage.getItem(darkModeKey);
    // Default to dark mode if not set (darkMode === null)
    if (darkMode === null || darkMode === 'true') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    // If localStorage fails, default to dark mode
    document.documentElement.classList.add('dark');
  }
})();
