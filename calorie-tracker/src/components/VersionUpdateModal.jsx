import { useState, useEffect } from 'react';
import { getProfile, getFoodLog, getData, setData } from '../utils/storage';
import { APP_VERSION } from '../version';

export default function VersionUpdateModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Only show for version 1.6.0
    if (APP_VERSION !== '1.6.0') return;

    // Check if user has already seen this version's modal
    const seenKey = `seenVersionModal_${APP_VERSION}`;
    const hasSeenModal = getData(seenKey);
    if (hasSeenModal) return;

    // Check if user is an existing user (has profile or food log data)
    const profile = getProfile();
    const foodLog = getFoodLog();
    const isExistingUser = profile || (foodLog && foodLog.length > 0);

    // Only show to existing users who haven't seen this version's modal
    if (isExistingUser) {
      setShowModal(true);
    }
  }, []);

  const handleClose = () => {
    // Mark this version's modal as seen
    const seenKey = `seenVersionModal_${APP_VERSION}`;
    setData(seenKey, true);
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
      <div className="card max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">New Feature: Pregnancy & Breastfeeding Support</h2>

        <div className="space-y-4 mb-6">
          <p className="text-gray-700 dark:text-gray-300">
            Added nutrition support for expecting and new mothers!
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            Head to Settings to enable trimester-based calorie and protein adjustments using evidence-based guidelines.
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            Want to request a feature or share feedback?{' '}
            <a
              href="https://tally.so/r/VLQOJv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Tap here
            </a>
            {' '}— we read every message!
          </p>
        </div>

        <button
          onClick={handleClose}
          className="btn-primary w-full"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
