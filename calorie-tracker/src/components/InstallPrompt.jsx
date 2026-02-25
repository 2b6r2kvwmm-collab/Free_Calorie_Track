import { useState, useEffect } from 'react';

const HOMESCREEN_STEPS = [
  {
    platform: 'iPhone — Safari',
    steps: [
      'Tap the three-dot menu (...) then tap the Share button (⬆︎).',
      'Tap "View More" and then "Add to Home Screen."',
      'If you don\'t see "Add to Home Screen", scroll to "Edit Actions" and add it.',
      'All set! Now you can find Free Calorie Track on your phone like any other app.',
    ],
  },
  {
    platform: 'iPhone — Chrome',
    steps: [
      'Tap the three-dot menu (⋮) in the top right corner.',
      'Tap "Add to Home Screen."',
      'Tap "Add" to confirm.',
    ],
  },
  {
    platform: 'iPhone — Firefox',
    steps: [
      'Tap the three-dot menu (...) at the bottom of the screen.',
      'Tap "More" then "Share."',
      'Tap "View More" if needed, then "Add to Home Screen."',
      'All set! Now you can find Free Calorie Track on your phone like any other app.',
    ],
  },
  {
    platform: 'Android — Chrome',
    steps: [
      'You may see an "Install" banner appear automatically at the top — tap it to install.',
      'If it doesn\'t appear, tap the three-dot menu (⋮) in the top right.',
      'Tap "Install app" or "Add to Home Screen."',
    ],
  },
  {
    platform: 'Android — Other browsers',
    steps: [
      'Tap the menu icon and look for "Add to Home Screen" or "Install."',
    ],
  },
];

function InstallPrompt({ onContinue }) {
  const [isMobile, setIsMobile] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canAutoInstall, setCanAutoInstall] = useState(false);

  useEffect(() => {
    // Detect if user is on mobile device
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile);

    // Listen for beforeinstallprompt event (Chrome/Edge on Android/Desktop)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanAutoInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleAutoInstall = async () => {
    if (!deferredPrompt) return;

    // Show the native install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setCanAutoInstall(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            Free Calorie Track
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide"
             style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            One Quick Step
          </p>
        </div>

        {!isMobile ? (
          /* Desktop Message */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-emerald-100 dark:border-emerald-900">
            <div className="text-5xl mb-4 text-center">📱</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              You're on Desktop — Switch to Mobile for the Best Experience
            </h2>

            <div className="space-y-4 mb-6">
              <p className="text-gray-700 dark:text-gray-300"
                 style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                Free Calorie Track works best on your phone where you can:
              </p>

              <ul className="space-y-3">
                <li className="flex items-start text-gray-700 dark:text-gray-300">
                  <span className="text-emerald-600 dark:text-emerald-400 mr-3 text-xl">•</span>
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    Scan barcodes with your camera
                  </span>
                </li>
                <li className="flex items-start text-gray-700 dark:text-gray-300">
                  <span className="text-emerald-600 dark:text-emerald-400 mr-3 text-xl">•</span>
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    Log food on-the-go when you're actually eating
                  </span>
                </li>
                <li className="flex items-start text-gray-700 dark:text-gray-300">
                  <span className="text-emerald-600 dark:text-emerald-400 mr-3 text-xl">•</span>
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    Track meals instantly at restaurants, stores, or your kitchen
                  </span>
                </li>
              </ul>

              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 mt-6">
                <p className="text-gray-800 dark:text-gray-200 font-medium text-center"
                   style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                  Visit <strong className="text-emerald-600 dark:text-emerald-400">freecalorietrack.com</strong> on your phone and follow the install instructions.
                  <br />
                  You'll have the app on your home screen in 15 seconds.
                </p>
              </div>
            </div>

            <button
              onClick={onContinue}
              className="w-full mt-4 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Continue on Desktop Anyway
            </button>
          </div>
        ) : (
          /* Mobile Instructions */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-emerald-100 dark:border-emerald-900">
            <div className="text-5xl mb-4 text-center">🏠</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              Install Free Calorie Track
            </h2>

            <p className="text-gray-700 dark:text-gray-300 mb-6 text-center"
               style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              Add Free Calorie Track to your home screen for the best experience—works offline, faster loading, and easy access.
            </p>

            {canAutoInstall ? (
              /* Show automatic install button for Chrome/Edge */
              <div className="mb-8">
                <button
                  onClick={handleAutoInstall}
                  className="w-full bg-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg text-lg"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  📱 Install Now
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center"
                   style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                  One-click install available on your browser
                </p>
              </div>
            ) : (
              /* Show manual instructions for Safari/Firefox */
              <div className="space-y-6 mb-8">
                {HOMESCREEN_STEPS.map((group, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-3"
                       style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                      {group.platform}
                    </p>
                    <ol className="list-decimal list-inside space-y-2">
                      {group.steps.map((step, sIdx) => (
                        <li key={sIdx} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center"
               style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              Don't want to install right now? No problem. You can use the app in your browser and install it anytime by following the above instructions.
            </p>

            <button
              onClick={onContinue}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InstallPrompt;
