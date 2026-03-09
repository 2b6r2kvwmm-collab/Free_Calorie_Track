import { useEffect } from 'react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

export default function ShareModal({ onClose }) {
  const modalRef = useModalAccessibility(true, onClose);

  // Lock body scroll when modal opens
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const shareUrl = 'https://freecalorietrack.com';
  const shareText = 'Found a free calorie tracker with no paywalls or ads';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      // Show brief success feedback
      const button = document.getElementById('copy-link-btn');
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = originalText;
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback: just close
      onClose();
    }
  };

  const handleShare = (platform) => {
    let url;
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'reddit':
        url = `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }
    window.open(url, '_blank', 'width=600,height=400');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      ref={modalRef}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
          aria-label="Close"
        >
          ×
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            5-day streak! You're crushing it.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            Know anyone tired of:
          </p>
          <ul className="text-left text-gray-600 dark:text-gray-400 mb-4 space-y-1 max-w-xs mx-auto">
            <li>• "$9.99/mo to scan a barcode"</li>
            <li>• "Upgrade to see your protein"</li>
            <li>• "Watch this ad to log dinner"</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 font-medium mb-6">
            Send them here. They'll thank you.
          </p>

          {/* Share buttons */}
          <div className="space-y-3">
            <button
              id="copy-link-btn"
              onClick={handleCopyLink}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Copy Link
            </button>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleShare('twitter')}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Twitter
              </button>
              <button
                onClick={() => handleShare('reddit')}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Reddit
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Facebook
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium py-2 transition-colors text-sm"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
