import { useState, useEffect } from 'react';

const HOMESCREEN_STEPS = [
  {
    platform: 'iPhone — Safari',
    steps: [
      'Tap the three-dot menu (...) then tap the Share button (⬆︎).',
      'Tap "View More" and then "Add to Home Screen."',
      'If you don\'t see "Add to Home Screen", scroll to "Edit Actions" and add it.',
      'All set! Free Calorie Track will appear on your home screen like any other app.',
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
      'All set! Free Calorie Track will appear on your home screen like any other app.',
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
  const [browserInstructions, setBrowserInstructions] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ua = navigator.userAgent.toLowerCase();
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile);

    let instructions = null;

    if (/iphone|ipad|ipod/.test(ua)) {
      if (/crios/.test(ua)) {
        instructions = HOMESCREEN_STEPS.find(s => s.platform === 'iPhone — Chrome');
      } else if (/fxios/.test(ua)) {
        instructions = HOMESCREEN_STEPS.find(s => s.platform === 'iPhone — Firefox');
      } else {
        instructions = HOMESCREEN_STEPS.find(s => s.platform === 'iPhone — Safari');
      }
    } else if (/android/.test(ua)) {
      if (/chrome/.test(ua) && !/edg/.test(ua)) {
        instructions = HOMESCREEN_STEPS.find(s => s.platform === 'Android — Chrome');
      } else {
        instructions = HOMESCREEN_STEPS.find(s => s.platform === 'Android — Other browsers');
      }
    }

    setBrowserInstructions(instructions);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanAutoInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleAutoInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
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
            No App Store Needed
          </p>
        </div>

        {!isMobile ? (
          /* Desktop */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-emerald-100 dark:border-emerald-900">
            <div className="text-5xl mb-4 text-center">📱</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              Installs like a native app — no App Store needed
            </h2>

            <div className="space-y-4 mb-6">
              <p className="text-gray-700 dark:text-gray-300"
                 style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                Open on your phone to install. It'll live on your home screen just like any other app — offline support, instant loading, no browser chrome.
              </p>

              <ul className="space-y-3">
                <li className="flex items-start text-gray-700 dark:text-gray-300">
                  <span className="text-emerald-600 dark:text-emerald-400 mr-3 text-xl">•</span>
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>Scan barcodes with your camera</span>
                </li>
                <li className="flex items-start text-gray-700 dark:text-gray-300">
                  <span className="text-emerald-600 dark:text-emerald-400 mr-3 text-xl">•</span>
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>Log food on-the-go when you're actually eating</span>
                </li>
                <li className="flex items-start text-gray-700 dark:text-gray-300">
                  <span className="text-emerald-600 dark:text-emerald-400 mr-3 text-xl">•</span>
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>Works offline — no signal needed to log a meal</span>
                </li>
              </ul>

              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 mt-6">
                <p className="text-gray-800 dark:text-gray-200 font-medium text-center"
                   style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                  Visit <strong className="text-emerald-600 dark:text-emerald-400">freecalorietrack.com</strong> on your phone — it takes about 15 seconds to install.
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
          /* Mobile */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-emerald-100 dark:border-emerald-900">
            <div className="text-5xl mb-4 text-center">📲</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              One last step — add to your home screen
            </h2>

            <p className="text-gray-700 dark:text-gray-300 mb-6 text-center"
               style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              Free Calorie Track installs like a native app — it'll live on your home screen, open instantly, and work offline. No App Store needed.
            </p>

            {canAutoInstall ? (
              <div className="mb-8">
                <button
                  onClick={handleAutoInstall}
                  className="btn-primary w-full flex items-center justify-center gap-2 mb-2"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  📱 Add to Home Screen
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center"
                   style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                  One tap — opens like a native app, works offline
                </p>
              </div>
            ) : browserInstructions ? (
              <div className="mb-8">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-3"
                     style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    {browserInstructions.platform}
                  </p>
                  <ol className="list-decimal list-inside space-y-2">
                    {browserInstructions.steps.map((step, sIdx) => (
                      <li key={sIdx} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : (
              <div className="mb-8 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <p className="text-sm text-gray-700 dark:text-gray-300 text-center"
                   style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                  Tap your browser menu and look for "Add to Home Screen" or "Install" — it'll open like a native app once added.
                </p>
              </div>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center"
               style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              Prefer to use it in your browser for now? No problem — you can install anytime from your browser menu.
            </p>

            <button
              onClick={onContinue}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Continue in Browser
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InstallPrompt;
