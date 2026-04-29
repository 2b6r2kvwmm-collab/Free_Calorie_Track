import { useState, useEffect } from 'react';
import { getProfile, getFoodLog, getData, setData } from '../utils/storage';
import { APP_VERSION } from '../version';

export default function VersionUpdateModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (APP_VERSION !== '1.7.0') return;
    const seenKey = `seenVersionModal_${APP_VERSION}`;
    if (getData(seenKey)) return;
    const profile = getProfile();
    const foodLog = getFoodLog();
    if (profile || (foodLog && foodLog.length > 0)) {
      setShowModal(true);
    }
  }, []);

  const handleClose = () => {
    setData(`seenVersionModal_${APP_VERSION}`, true);
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">

        <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">Version 1.7.0</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">What's new</h2>
        </div>

        <div className="px-6 py-5 space-y-5">

          <div className="flex gap-3 items-start">
            <span className="text-2xl mt-0.5">🤖</span>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">AI Food Logging</p>
                <span className="text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">Beta</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Describe your meal, snap a photo of your plate, or photograph a recipe — AI fills in the calories and macros automatically. Free, optional, and up to 10 logs per day. Manual logging works exactly the same as always.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <span className="text-2xl mt-0.5">📊</span>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Nutrition Coach</p>
                <span className="text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">Beta</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Log at least 3 days and unlock a weekly AI coaching insight in the Trends tab — what you're nailing, where there's room to improve, and specific things to try. Based on your actual numbers, once per day, free.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <span className="text-2xl mt-0.5">💪</span>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-0.5">More accurate exercise calories</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Exercise burn estimates now account for the body's tendency to partially offset exercise expenditure elsewhere — a well-documented effect that causes most trackers to overstate burn. Numbers are lower but more realistic, especially if you exercise to lose weight. Tap the <span className="font-semibold">ⓘ</span> next to any exercise entry to learn more.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              <strong className="text-gray-700 dark:text-gray-300">AI features are entirely optional.</strong> Nothing is stored by us — you can see exactly what gets sent to Google before using any AI feature. The app is still completely free.
            </p>
          </div>

          <button onClick={handleClose} className="btn-primary w-full">
            Got it
          </button>

          <button onClick={handleClose} className="w-full text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 py-1">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
