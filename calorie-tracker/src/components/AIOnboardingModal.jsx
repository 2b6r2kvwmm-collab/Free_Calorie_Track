import { X } from 'lucide-react';
import { AI_DAILY_LIMIT } from '../utils/storage';

export default function AIOnboardingModal({ onAccept, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">

        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 dark:border-gray-700">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Before you snap that plate</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">

          <div className="flex gap-3 items-start">
            <span className="text-xl mt-0.5">🎟️</span>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{AI_DAILY_LIMIT} AI logs per day</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
                Keeping this app free means AI logging runs on a daily budget. You get {AI_DAILY_LIMIT} AI-powered analyses per day — plenty for real meals, not so much for photographing every individual grape. Resets at midnight.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <span className="text-xl mt-0.5">📸</span>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Photos are estimates, not X-rays</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
                AI can identify your food but it can't weigh it. Adding context in the notes — portion size, cooking method, brand, any sneaky sauces — makes a meaningful difference in accuracy.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <span className="text-xl mt-0.5">🔒</span>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Photos and descriptions go to Google</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
                Everything you submit is sent to Google's Gemini AI for analysis. We never store your photos or descriptions — but Google processes them under their own policies. By tapping "Got it" below, you agree to those terms.
              </p>
              <div className="flex gap-4 mt-2">
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-600 dark:text-emerald-400 underline"
                >
                  Google Privacy Policy
                </a>
                <a
                  href="https://ai.google.dev/gemini-api/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-600 dark:text-emerald-400 underline"
                >
                  Gemini Terms
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={onAccept}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Got it — let's log some food
          </button>

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
