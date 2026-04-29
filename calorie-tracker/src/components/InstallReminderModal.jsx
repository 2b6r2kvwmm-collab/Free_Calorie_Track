import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const STEPS = {
  'ios-safari': {
    label: 'iPhone — Safari',
    steps: [
      'Tap the three-dot menu (...) then tap the Share button (⬆︎).',
      'Tap "View More" and then "Add to Home Screen."',
      'If you don\'t see "Add to Home Screen", scroll to "Edit Actions" and add it.',
      'All set! Now you can find Free Calorie Track on your phone like any other app.',
    ],
  },
  'ios-chrome': {
    label: 'iPhone — Chrome',
    steps: [
      'Tap the three-dot menu (⋮) in the top right corner.',
      'Tap "Add to Home Screen."',
      'Tap "Add" to confirm.',
    ],
  },
  'ios-firefox': {
    label: 'iPhone — Firefox',
    steps: [
      'Tap the three-dot menu (...) at the bottom of the screen.',
      'Tap "More" then "Share."',
      'Tap "View More" if needed, then "Add to Home Screen."',
      'All set! Now you can find Free Calorie Track on your phone like any other app.',
    ],
  },
  'android-chrome': {
    label: 'Android — Chrome',
    steps: [
      'You may see an "Install" banner appear automatically at the top — tap it to install.',
      'If it doesn\'t appear, tap the three-dot menu (⋮) in the top right.',
      'Tap "Install app" or "Add to Home Screen."',
    ],
  },
  'android-other': {
    label: 'Android — Other browsers',
    steps: [
      'Tap the menu icon and look for "Add to Home Screen" or "Install."',
    ],
  },
  'desktop': {
    label: 'Desktop',
    steps: [
      'Look for the install icon (⊕) in the address bar, or open the browser menu and choose "Install Free Calorie Track."',
    ],
  },
};

function detectPlatform() {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) {
    if (/crios/.test(ua)) return 'ios-chrome';
    if (/fxios/.test(ua)) return 'ios-firefox';
    return 'ios-safari';
  }
  if (/android/.test(ua)) {
    return /chrome/.test(ua) && !/edg/.test(ua) ? 'android-chrome' : 'android-other';
  }
  return 'desktop';
}

export default function InstallReminderModal({ onClose }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const platform = detectPlatform();
  const instructions = STEPS[platform];

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Download size={18} className="text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-gray-900 dark:text-gray-100">Add to Home Screen</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 leading-relaxed">
            Takes 15 seconds and turns this into a fully-functional app you can open any time — even when you're offline.
          </p>

          {deferredPrompt ? (
            <button
              onClick={handleInstall}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Install Now
            </button>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                {instructions.label}
              </p>
              <ol className="space-y-1.5 list-decimal list-inside">
                {instructions.steps.map((step, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{step}</li>
                ))}
              </ol>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 py-1"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
