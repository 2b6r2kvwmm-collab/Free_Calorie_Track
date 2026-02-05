import { useModalAccessibility } from '../hooks/useModalAccessibility';

export default function MilestoneModal({ milestone, stats, onClose, onDonate }) {
  const modalRef = useModalAccessibility(true, onClose);
  const milestoneInfo = {
    60: {
      emoji: '🎉',
      title: '60-Day Milestone!',
      message: 'Two months of consistent tracking—that\'s serious dedication!',
    },
    180: {
      emoji: '🔥',
      title: '180-Day Milestone!',
      message: 'Six months strong! You\'re crushing it!',
    },
    365: {
      emoji: '🏆',
      title: 'One Year Anniversary!',
      message: 'A full year of tracking! You\'re an absolute legend!',
    },
  };

  const info = milestoneInfo[milestone];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" ref={modalRef}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
          aria-label="Close milestone celebration"
        >
          ×
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="text-6xl mb-4">{info.emoji}</div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">{info.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{info.message}</p>

          {/* Stats */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.daysTracked}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Days Tracked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.mealsLogged}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Meals Logged</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.workouts}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Workouts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ${stats.savedVsCompetitors}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Saved vs. subscriptions</div>
              </div>
            </div>
          </div>

          {/* Donation CTA */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Enjoying Free Calorie Track? Help keep it free for everyone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
              >
                Maybe Later
              </button>
              <button
                onClick={onDonate}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
              >
                Chip in $5
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
