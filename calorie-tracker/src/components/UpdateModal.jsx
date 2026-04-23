import { useModalAccessibility } from '../hooks/useModalAccessibility';

export default function UpdateModal({ onClose }) {
  const modalRef = useModalAccessibility(true, onClose);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-modal-title"
      ref={modalRef}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
          aria-label="Close update notes"
        >
          ×
        </button>

        <div className="mb-5">
          <h2 id="update-modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
            Free Calorie Track got an upgrade
          </h2>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">v1.6.0</span>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">More nutrients, less guesswork</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              Fiber, sodium, sugar, and saturated fat are now tracked. Turn them on in <span className="font-medium">Settings → Nutrition</span> and they'll appear in your food log and on a second page in the Macro card.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">A cleaner look</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              Tighter layouts, better use of space, and a more polished feel throughout.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Cleaner food search</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              Duplicate entries are gone. Serving sizes are realistic. Finding and logging food is faster.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full btn-primary"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
