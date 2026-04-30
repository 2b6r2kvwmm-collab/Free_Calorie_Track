import { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { getProfile, saveProfile, getDarkMode, saveDarkMode, addWeightEntry, getLandingPageShown, markLandingPageShown, getInstallPromptShown, markInstallPromptShown, getShareModalShown, markShareModalShown, calculateUserStats, saveDashboardFocus, installReminderPermanentlyDismissed, incrementInstallReminderDismissals } from './utils/storage';
import { getCurrentUserId, getAllUsers } from './utils/users';
import { LayoutDashboard, TrendingUp, History as HistoryIcon, Settings as SettingsIcon, Sun, Moon } from 'lucide-react';
import LandingPage from './components/LandingPage';
import InstallPrompt from './components/InstallPrompt';
import InstallReminderModal from './components/InstallReminderModal';
import ProfileSetup from './components/ProfileSetup';
import Dashboard from './components/Dashboard';
import UpdateNotification from './components/UpdateNotification';
import VersionUpdateModal from './components/VersionUpdateModal';

// Code split heavy components to reduce INP - load only when needed
const Trends = lazy(() => import('./components/Trends'));
const History = lazy(() => import('./components/History'));
const Settings = lazy(() => import('./components/Settings'));
const UserManager = lazy(() => import('./components/UserManager'));
const ShareModal = lazy(() => import('./components/ShareModal'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-gray-500 dark:text-gray-400">Loading...</div>
  </div>
);

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user came from a landing page (skip React landing page) - only check once
  const [fromLandingPage] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('from') === 'landing-page';
  });

  // Handle landing page detection once on mount
  useEffect(() => {
    if (fromLandingPage) {
      markLandingPageShown();
      markInstallPromptShown();
      // Set macro-focused dashboard as default for landing page users
      saveDashboardFocus('macros');
      // Clean up URL
      navigate('/', { replace: true });
    }
  }, [fromLandingPage, navigate]);

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
  const [landingPageShown, setLandingPageShown] = useState(fromLandingPage ? true : getLandingPageShown());
  const [installPromptShown, setInstallPromptShown] = useState(() => {
    if (fromLandingPage) return true;
    if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true) return true;
    return getInstallPromptShown();
  });
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
    addWeightEntry(newProfile.weight);
    setProfile(newProfile);
    if (!isAppInstalled() && !installReminderPermanentlyDismissed()) setTimeout(() => setShowInstallReminder(true), 800);
  };

  const handleUpdateProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    setRefreshKey(prev => prev + 1);
  };

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

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

  const isAppInstalled = () =>
    window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

  const [showInstallReminder, setShowInstallReminder] = useState(false);

  useEffect(() => {
    if (!profile || isAppInstalled() || installReminderPermanentlyDismissed()) return;
    const timer = setTimeout(() => setShowInstallReminder(true), 1500);
    return () => clearTimeout(timer);
  }, [profile]);

  const currentUserName = getAllUsers().find(u => u.id === currentUserId)?.name || 'User';
  const todayFormatted = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

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
              <p className="text-xs text-gray-500 dark:text-gray-400"
                 style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.03em', fontSize: '10px' }}>
                The ultimate calorie & macro tracker
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400 dark:text-gray-500">{todayFormatted}</span>
                <button
                  onClick={() => setShowUserManager(true)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500 }}
                >
                  {currentUserName}
                </button>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Suspense fallback={<LoadingFallback />}>
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
              path="/ai-logging-setup"
              element={<Dashboard key={refreshKey} onRefresh={handleRefresh} />}
            />
            <Route
              path="/ai-log"
              element={<Dashboard key={refreshKey} onRefresh={handleRefresh} />}
            />
            <Route
              path="/ai-food-logged"
              element={<Dashboard key={refreshKey} onRefresh={handleRefresh} />}
            />
            <Route
              path="/coach"
              element={<Trends key={refreshKey} />}
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
        </Suspense>
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
        <Suspense fallback={null}>
          <UserManager
            onUserSwitch={handleUserSwitch}
            onClose={() => setShowUserManager(false)}
          />
        </Suspense>
      )}

      {/* Share Modal - shown after 5 days of tracking */}
      {showShareModal && (
        <Suspense fallback={null}>
          <ShareModal onClose={handleShareModalClose} daysTracked={userDaysTracked} />
        </Suspense>
      )}

      {/* Install reminder — shown each session if not installed as PWA */}
      {showInstallReminder && (
        <InstallReminderModal onClose={() => { incrementInstallReminderDismissals(); setShowInstallReminder(false); }} />
      )}

      {/* Version Update Modal - shown once for existing users on version updates */}
      <VersionUpdateModal />

      {/* Update Notification */}
      <UpdateNotification />
    </div>
  );
}

export default App;
