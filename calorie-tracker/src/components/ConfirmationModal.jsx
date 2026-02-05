import { useModalAccessibility } from '../hooks/useModalAccessibility';

/**
 * Accessible confirmation modal with explicit confirmation
 * Replaces window.confirm() with better UX and accessibility
 */
export default function ConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
}) {
  const modalRef = useModalAccessibility(isOpen, onCancel);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      ref={modalRef}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
        {/* Title */}
        <h2
          id="confirm-title"
          className="text-xl font-bold mb-4 dark:text-white"
        >
          {title}
        </h2>

        {/* Message */}
        <p
          id="confirm-message"
          className="text-gray-700 dark:text-gray-300 mb-6"
        >
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
              danger
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
