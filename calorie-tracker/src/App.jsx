import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { getProfile, saveProfile, getDarkMode, saveDarkMode, addWeightEntry, getLandingPageShown, markLandingPageShown, getInstallPromptShown, markInstallPromptShown, getShareModalShown, markShareModalShown, calculateUserStats } from './utils/storage';
import { getCurrentUserId, getAllUsers } from './utils/users';
import { LayoutDashboard, TrendingUp, History as HistoryIcon, Settings as SettingsIcon } from 'lucide-react';
import LandingPage from './components/LandingPage';
import InstallPrompt from './components/InstallPrompt';
import ProfileSetup from './components/ProfileSetup';
import Dashboard from './components/Dashboard';
import Trends from './components/Trends';
import History from './components/History';
import Settings from './components/Settings';
import UserManager from './components/UserManager';
import UpdateNotification from './components/UpdateNotification';
import ShareModal from './components/ShareModal';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to blog if user navigates to /blog/* while SPA is loaded
  useEffect(() => {
    if (location.pathname.startsWith('/blog')) {
      window.location.href = location.pathname;
    }
  }, [location.pathname]);

  const [profile, setProfile] = useState(getProfile());
  const [darkMode, setDarkMode] = useState(getDarkMode());
  const [refreshKey, setRefreshKey] = useState(0);
  const [showUserManager, setShowUserManager] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(getCurrentUserId());
  const [landingPageShown, setLandingPageShown] = useState(getLandingPageShown());
  const [installPromptShown, setInstallPromptShown] = useState(getInstallPromptShown());
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveDarkMode(darkMode);
  }, [darkMode]);

  // Check if we should show the share modal (after 5 days of tracking)
  const [userDaysTracked, setUserDaysTracked] = useState(0);

  useEffect(() => {
    if (!profile) return; // Only check for logged-in users

    const shareModalShown = getShareModalShown();
    if (shareModalShown) return; // Already shown

    const stats = calculateUserStats();
    if (stats.daysTracked >= 5) {
      setUserDaysTracked(stats.daysTracked);
      // Wait 2 seconds after page load to show modal (less jarring)
      const timer = setTimeout(() => {
        setShowShareModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [profile, refreshKey]);

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

  const handleShareModalClose = () => {
    markShareModalShown();
    setShowShareModal(false);
  };

  const currentUserName = getAllUsers().find(u => u.id === currentUserId)?.name || 'User';

  // App routes
  if (!landingPageShown && !profile) {
    return (
      <LandingPage onGetStarted={() => {
        markLandingPageShown();
        setLandingPageShown(true);
      }} />
    );
  }

  if (!installPromptShown && !profile) {
    return (
      <InstallPrompt onContinue={() => {
        markInstallPromptShown();
        setInstallPromptShown(true);
      }} />
    );
  }

  if (!profile) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  return (
    <div className="min-h-screen pb-20" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 700, letterSpacing: '-0.02em' }}>
                Free Calorie Track
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase"
                 style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.03em', fontSize: '10px' }}>
                The ultimate free calorie tracker
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowUserManager(true)}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500 }}
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
        <Routes>
          <Route
            path="/"
            element={<Dashboard key={refreshKey} onRefresh={handleRefresh} />}
          />
          <Route
            path="/add-food"
            element={<Dashboard key={refreshKey} onRefresh={handleRefresh} />}
          />
          <Route
            path="/log-exercise"
            element={<Dashboard key={refreshKey} onRefresh={handleRefresh} />}
          />
          <Route
            path="/trends"
            element={<Trends key={refreshKey} />}
          />
          <Route
            path="/history"
            element={<History key={refreshKey} onRefresh={handleRefresh} />}
          />
          <Route
            path="/settings"
            element={
              <Settings
                onUpdateProfile={handleUpdateProfile}
                onClose={() => navigate('/')}
              />
            }
          />
        </Routes>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="max-w-4xl mx-auto px-2">
          <div className="grid grid-cols-4 gap-1 py-2" style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}>
            <button
              onClick={() => navigate('/')}
              className={`py-2.5 px-2 rounded-xl font-medium text-xs flex flex-col items-center gap-1 transition-all ${
                location.pathname === '/' || location.pathname === '/add-food' || location.pathname === '/log-exercise'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
              style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500 }}
              aria-label="Dashboard"
              aria-current={location.pathname === '/' || location.pathname === '/add-food' || location.pathname === '/log-exercise' ? 'page' : undefined}
            >
              <LayoutDashboard size={20} strokeWidth={2} />
              <span style={{ letterSpacing: '0.02em' }}>Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/trends')}
              className={`py-2.5 px-2 rounded-xl font-medium text-xs flex flex-col items-center gap-1 transition-all ${
                location.pathname === '/trends'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
              style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500 }}
              aria-label="Trends"
              aria-current={location.pathname === '/trends' ? 'page' : undefined}
            >
              <TrendingUp size={20} strokeWidth={2} />
              <span style={{ letterSpacing: '0.02em' }}>Trends</span>
            </button>
            <button
              onClick={() => navigate('/history')}
              className={`py-2.5 px-2 rounded-xl font-medium text-xs flex flex-col items-center gap-1 transition-all ${
                location.pathname === '/history'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
              style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500 }}
              aria-label="History"
              aria-current={location.pathname === '/history' ? 'page' : undefined}
            >
              <HistoryIcon size={20} strokeWidth={2} />
              <span style={{ letterSpacing: '0.02em' }}>History</span>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className={`py-2.5 px-2 rounded-xl font-medium text-xs flex flex-col items-center gap-1 transition-all ${
                location.pathname === '/settings'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
              style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500 }}
              aria-label="Settings"
              aria-current={location.pathname === '/settings' ? 'page' : undefined}
            >
              <SettingsIcon size={20} strokeWidth={2} />
              <span style={{ letterSpacing: '0.02em' }}>Settings</span>
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

      {/* Share Modal - shown after 5 days of tracking */}
      {showShareModal && (
        <ShareModal onClose={handleShareModalClose} daysTracked={userDaysTracked} />
      )}

      {/* Update Notification */}
      <UpdateNotification />
    </div>
  );
}

export default App;
