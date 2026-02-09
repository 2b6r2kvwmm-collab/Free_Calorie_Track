import { useState } from 'react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

/**
 * Legal disclaimer modal for workout import feature
 * Requires explicit user acceptance before allowing import
 */
export default function ImportDisclaimerModal({ isOpen, onAccept, onDecline }) {
  const modalRef = useModalAccessibility(isOpen, onDecline);
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (accepted) {
      onAccept();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      ref={modalRef}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full my-8 p-6">
        {/* Header */}
        <div className="mb-6">
          <h2
            id="disclaimer-title"
            className="text-2xl font-bold dark:text-white mb-2"
          >
            ⚠️ Important: Workout Import Disclaimer
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Please read and accept these terms before importing workout data.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          {/* Accuracy Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
            <h3 className="font-bold mb-2 text-yellow-900 dark:text-yellow-200">
              📊 Data Accuracy
            </h3>
            <p className="text-sm text-yellow-900 dark:text-yellow-200">
              Imported workout data <strong>may be inaccurate</strong> due to format differences
              between fitness apps. Calories, duration, and other metrics should be reviewed and
              verified before use. We cannot guarantee the accuracy of imported data.
            </p>
          </div>

          {/* Storage Warning */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4">
            <h3 className="font-bold mb-2 text-blue-900 dark:text-blue-200">
              💾 Data Storage
            </h3>
            <p className="text-sm text-blue-900 dark:text-blue-200">
              Imported data is stored <strong>unencrypted</strong> on your device in browser
              localStorage. Anyone with physical access to your device can view this data.
              Only import data you're comfortable storing locally.
            </p>
          </div>

          {/* Third-Party Terms */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-lg p-4">
            <h3 className="font-bold mb-2 text-purple-900 dark:text-purple-200">
              📋 Third-Party Terms
            </h3>
            <p className="text-sm text-purple-900 dark:text-purple-200">
              You are responsible for ensuring your data export complies with the source app's
              terms of service (Strava, Apple Health, Garmin, etc.). Review their export policies
              before importing data.
            </p>
          </div>

          {/* Medical Disclaimer */}
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-4">
            <h3 className="font-bold mb-2 text-red-900 dark:text-red-200">
              ⚕️ Not Medical Advice
            </h3>
            <p className="text-sm text-red-900 dark:text-red-200">
              This app is for informational purposes only and is not a substitute for professional
              medical advice. Do not rely on imported workout data for medical decisions. Consult
              a healthcare provider before starting any fitness or diet program.
            </p>
          </div>

          {/* Privacy & Liability */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-sm">
            <h3 className="font-bold mb-2 dark:text-white">
              Your Responsibilities:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>Review all imported workouts for accuracy before using</li>
              <li>Understand that imported data is stored unencrypted locally</li>
              <li>Comply with export source's terms of service</li>
              <li>Do not rely on this data for medical decisions</li>
              <li>Back up important data separately</li>
            </ul>
          </div>

          {/* Limitation of Liability */}
          <div className="text-xs text-gray-500 dark:text-gray-500 border-t border-gray-300 dark:border-gray-600 pt-4">
            <p className="mb-2">
              <strong>Limitation of Liability:</strong> We provide this import feature "as is"
              without warranties of any kind. We are not liable for data loss, inaccuracies,
              or any damages resulting from use of imported data.
            </p>
            <p>
              By checking the box below, you acknowledge that you have read and understood these
              warnings and accept all risks associated with importing workout data.
            </p>
          </div>
        </div>

        {/* Acceptance Checkbox */}
        <div className="mt-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm font-semibold dark:text-white">
              I have read and understand the risks above. I accept responsibility for reviewing
              imported data for accuracy and understand that this app does not guarantee the
              accuracy of imported workout information.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onDecline}
            className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            disabled={!accepted}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
              accepted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
