import { useEffect, useState, useRef } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { APP_VERSION } from '../version';

export default function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const updateCheckRef = useRef(false); // Prevent multiple simultaneous update checks
  const intervalIdRef = useRef(null); // Track interval for cleanup

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);

      // Prevent duplicate registrations from setting up multiple timers
      if (updateCheckRef.current || !r) return;
      updateCheckRef.current = true;

      // Check immediately after 1 second
      setTimeout(() => {
        console.log('Initial update check...');
        r.update();
      }, 1000);

      // Only set up interval if one doesn't already exist
      if (!intervalIdRef.current) {
        // Check every 30 minutes for better update detection
        intervalIdRef.current = setInterval(() => {
          console.log('Periodic update check...');
          r.update();
        }, 30 * 60 * 1000); // Check every 30 minutes
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
    onNeedRefresh() {
      console.log('SW needs refresh - update available!');
    },
  });

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (needRefresh) {
      setShowUpdate(true);
    }
  }, [needRefresh]);

  const handleUpdate = () => {
    // Skip waiting and activate new service worker immediately
    updateServiceWorker(true).then(() => {
      // Modern way to force a hard reload
      // Works better on Safari/iOS than the deprecated reload(true)
      window.location.href = window.location.href;
    }).catch((err) => {
      console.error('Update failed:', err);
      // Fallback: just reload normally
      window.location.reload();
    });
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    setNeedRefresh(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-4 pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-emerald-600 text-white rounded-lg shadow-2xl p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-bold">New Update Available!</p>
                <p className="text-sm text-emerald-100">
                  Version {APP_VERSION} is ready to install
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-sm bg-emerald-700 hover:bg-emerald-800 rounded-lg font-semibold transition-colors"
              >
                Later
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm bg-white text-emerald-600 hover:bg-emerald-50 rounded-lg font-semibold transition-colors"
              >
                Update Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
