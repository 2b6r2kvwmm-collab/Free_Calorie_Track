import { handleExport } from '../utils/backupExport';

export default function BackupReminderModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
          aria-label="Close backup reminder"
        >
          ×
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="text-6xl mb-4">💾</div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">
            Back Up Your Data
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your data stays on your device — no cloud, no account, no one else sees it. That's by design.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            However, if you clear your browser or switch devices, it's gone. A quick export keeps you covered.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
            >
              Maybe Later
            </button>
            <button
              onClick={() => {
                handleExport();
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
            >
              Export Backup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
