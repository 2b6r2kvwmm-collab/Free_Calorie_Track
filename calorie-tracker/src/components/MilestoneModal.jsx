import { useModalAccessibility } from '../hooks/useModalAccessibility';

function getMilestoneInfo(recentDaysTracked) {
  if (recentDaysTracked >= 25) {
    return {
      emoji: '🔥',
      title: 'Elite-level consistency!',
      message: `You tracked ${recentDaysTracked} out of the last 30 days. That's near-perfect dedication.`,
    };
  }
  if (recentDaysTracked >= 20) {
    return {
      emoji: '🎉',
      title: 'Great month!',
      message: `${recentDaysTracked} days tracked this month — you've got real momentum going.`,
    };
  }
  return {
    emoji: '👏',
    title: 'Staying consistent!',
    message: `${recentDaysTracked} out of 30 days tracked. Consistency like this adds up fast.`,
  };
}

export default function MilestoneModal({ stats, onClose, onDonate }) {
  const modalRef = useModalAccessibility(true, onClose);
  const { emoji, title, message } = getMilestoneInfo(stats.recentDaysTracked);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" ref={modalRef}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
          aria-label="Close milestone celebration"
        >
          ×
        </button>

        <div className="text-center">
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">{title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>

          {/* Stats grid — recent month + all-time */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">This month</p>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.recentDaysTracked}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Days tracked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.recentMealsLogged}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Meals logged</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">All time</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.daysTracked}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Days</div>
              </div>
              <div>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.workouts}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Workouts</div>
              </div>
              <div>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  ${stats.savedVsCompetitors}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Saved</div>
              </div>
            </div>
          </div>

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
