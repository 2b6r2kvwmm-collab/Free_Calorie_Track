import { useModalAccessibility } from '../hooks/useModalAccessibility';

/**
 * Accessible alert/notification modal for displaying messages
 * Replaces window.alert() with better UX and accessibility
 */
export default function AlertModal({
  isOpen,
  onClose,
  title = 'Alert',
  message,
  buttonText = 'OK',
  type = 'info', // 'info', 'error', 'warning', 'success'
}) {
  const modalRef = useModalAccessibility(isOpen, onClose);

  if (!isOpen) return null;

  const typeStyles = {
    info: 'bg-blue-600 hover:bg-blue-700',
    error: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    success: 'bg-emerald-600 hover:bg-emerald-700',
  };

  const iconMap = {
    info: 'ℹ️',
    error: '❌',
    warning: '⚠️',
    success: '✅',
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-title"
      aria-describedby="alert-message"
      ref={modalRef}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{iconMap[type]}</span>
          <h2
            id="alert-title"
            className="text-xl font-bold dark:text-white"
          >
            {title}
          </h2>
        </div>

        {/* Message */}
        <p
          id="alert-message"
          className="text-gray-700 dark:text-gray-300 mb-6"
        >
          {message}
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors text-white ${typeStyles[type]}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
