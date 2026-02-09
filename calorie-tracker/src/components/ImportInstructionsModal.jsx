import { useState } from 'react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { saveImportInstructionsDismissed } from '../utils/storage';

/**
 * Modal showing instructions for exporting workout data from popular fitness apps
 */
export default function ImportInstructionsModal({ isOpen, onClose }) {
  const modalRef = useModalAccessibility(isOpen, onClose);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (dontShowAgain) {
      saveImportInstructionsDismissed(true);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="instructions-title"
      ref={modalRef}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full my-8 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2
            id="instructions-title"
            className="text-2xl font-bold dark:text-white"
          >
            Import Workouts
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
            aria-label="Close instructions"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          {/* Supported Formats */}
          <div>
            <h3 className="font-bold text-lg mb-2 dark:text-white">Supported File Formats</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>CSV (Comma-separated values)</li>
              <li>JSON (JavaScript Object Notation)</li>
              <li>GPX (GPS Exchange Format)</li>
              <li>TCX (Training Center XML)</li>
              <li>XML (Apple Health export)</li>
            </ul>
          </div>

          {/* Export Instructions by App */}
          <div>
            <h3 className="font-bold text-lg mb-3 dark:text-white">How to Export from Popular Apps</h3>

            <div className="space-y-4">
              {/* Apple Health */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <span className="text-2xl mr-2">🍎</span>
                  Apple Health (iPhone)
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm ml-6">
                  <li>Open the <strong>Health</strong> app</li>
                  <li>Tap your profile picture (top right)</li>
                  <li>Scroll down and tap <strong>"Export All Health Data"</strong></li>
                  <li>Wait for export to complete</li>
                  <li>Share the <strong>export.zip</strong> file to this app</li>
                  <li>Extract and select <strong>export.xml</strong></li>
                </ol>
              </div>

              {/* Strava */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <span className="text-2xl mr-2">🏃</span>
                  Strava
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm ml-6">
                  <li>Go to <strong>strava.com</strong> and log in</li>
                  <li>Click Settings → <strong>My Account</strong></li>
                  <li>Click <strong>"Get Started"</strong> under "Download or Delete Your Account"</li>
                  <li>Select <strong>"Request Your Archive"</strong></li>
                  <li>Download the archive when ready (sent via email)</li>
                  <li>Extract and select <strong>activities.csv</strong></li>
                </ol>
              </div>

              {/* Google Fit */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <span className="text-2xl mr-2">📊</span>
                  Google Fit
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm ml-6">
                  <li>Go to <strong>takeout.google.com</strong></li>
                  <li>Click <strong>"Deselect all"</strong>, then scroll to find <strong>"Fit"</strong></li>
                  <li>Check only <strong>"Fit"</strong></li>
                  <li>Click <strong>"Next step"</strong> and choose export options</li>
                  <li>Download the archive when ready</li>
                  <li>Extract and select the <strong>JSON files</strong> in the Fit folder</li>
                </ol>
              </div>

              {/* Garmin */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <span className="text-2xl mr-2">⌚</span>
                  Garmin Connect
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm ml-6">
                  <li>Go to <strong>connect.garmin.com</strong> and log in</li>
                  <li>Click <strong>Activities</strong> → <strong>All Activities</strong></li>
                  <li>Select the activities you want to export (or use filters)</li>
                  <li>Click the <strong>gear icon</strong> → <strong>Export CSV</strong></li>
                  <li>Select the downloaded <strong>.csv file</strong></li>
                </ol>
              </div>
            </div>
          </div>

          {/* What Gets Imported */}
          <div>
            <h3 className="font-bold text-lg mb-2 dark:text-white">What Information Gets Imported?</h3>
            <p className="text-sm mb-2">The importer extracts the following data when available:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Exercise type</strong> (Walking, Running, Cycling, etc.)</li>
              <li><strong>Duration</strong> (minutes)</li>
              <li><strong>Calories burned</strong></li>
              <li><strong>Date/time</strong> of workout</li>
              <li><strong>Distance</strong> (if available)</li>
            </ul>
          </div>

          {/* Important Reminder */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
            <p className="text-sm text-yellow-900 dark:text-yellow-200">
              <strong>⚠️ Important:</strong> Always review imported workouts for accuracy before use.
              Imported data may contain errors due to format differences between apps.
            </p>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm">
              <strong>🔒 Privacy:</strong> All file parsing happens locally in your browser.
              Your workout data never leaves your device.
            </p>
          </div>
        </div>

        {/* Don't Show Again Checkbox */}
        <div className="mt-6 flex items-center">
          <input
            type="checkbox"
            id="dont-show-again"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label
            htmlFor="dont-show-again"
            className="ml-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
          >
            Don't show this again
          </label>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={handleClose}
            className="w-full btn-primary"
          >
            Got It - Let's Import
          </button>
        </div>
      </div>
    </div>
  );
}
