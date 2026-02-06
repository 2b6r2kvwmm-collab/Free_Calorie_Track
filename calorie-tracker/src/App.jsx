import { useState, useEffect } from 'react';
import { getProfile, saveProfile, getDarkMode, saveDarkMode, addWeightEntry, getLandingPageShown, markLandingPageShown } from './utils/storage';
import { getCurrentUserId, getAllUsers } from './utils/users';
import LandingPage from './components/LandingPage';
import ProfileSetup from './components/ProfileSetup';
import Dashboard from './components/Dashboard';
import Trends from './components/Trends';
import History from './components/History';
import Settings from './components/Settings';
import UserManager from './components/UserManager';
import UpdateNotification from './components/UpdateNotification';

function App() {
  const [profile, setProfile] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(getDarkMode());
  const [refreshKey, setRefreshKey] = useState(0);
  const [showUserManager, setShowUserManager] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(getCurrentUserId());
  const [landingPageShown, setLandingPageShown] = useState(getLandingPageShown());

  useEffect(() => {
    const savedProfile = getProfile();
    setProfile(savedProfile);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveDarkMode(darkMode);
  }, [darkMode]);

  const handleProfileComplete = (newProfile) => {
    saveProfile(newProfile);
    // Add initial weight to weight tracker
    addWeightEntry(newProfile.weight);
    setProfile(newProfile);
  };

  const handleUpdateProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    setRefreshKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleUserSwitch = (newUserId) => {
    setCurrentUserId(newUserId);
    setProfile(getProfile());
    setRefreshKey(prev => prev + 1);
    setShowUserManager(false);
  };

  const currentUserName = getAllUsers().find(u => u.id === currentUserId)?.name || 'User';

  if (!landingPageShown && !profile) {
    return (
      <LandingPage onGetStarted={() => {
        markLandingPageShown();
        setLandingPageShown(true);
      }} />
    );
  }

  if (!profile) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                Free Calorie Track
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                The ultimate free calorie tracker
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowUserManager(true)}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {currentUserName}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-3xl"
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {currentView === 'dashboard' && (
          <Dashboard key={refreshKey} onRefresh={handleRefresh} />
        )}
        {currentView === 'trends' && <Trends key={refreshKey} />}
        {currentView === 'history' && (
          <History key={refreshKey} onRefresh={handleRefresh} />
        )}
        {currentView === 'settings' && (
          <Settings
            onUpdateProfile={handleUpdateProfile}
            onClose={() => setCurrentView('dashboard')}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 py-3">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`py-3 px-2 rounded-lg font-semibold text-sm transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setCurrentView('trends')}
              className={`py-3 px-2 rounded-lg font-semibold text-sm transition-colors ${
                currentView === 'trends'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              📈 Trends
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={`py-3 px-2 rounded-lg font-semibold text-sm transition-colors ${
                currentView === 'history'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              📜 History
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`py-3 px-2 rounded-lg font-semibold text-sm transition-colors ${
                currentView === 'settings'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      </div>

      {/* User Manager Modal */}
      {showUserManager && (
        <UserManager
          onUserSwitch={handleUserSwitch}
          onClose={() => setShowUserManager(false)}
        />
      )}

      {/* Update Notification */}
      <UpdateNotification />
    </div>
  );
}

export default App;
