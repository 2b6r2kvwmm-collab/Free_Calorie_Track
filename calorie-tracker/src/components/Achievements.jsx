import { useState } from 'react';
import { getGamificationData, ACHIEVEMENTS, getAchievementProgress } from '../utils/gamification';

export default function Achievements({ onClose }) {
  const [activeTab, setActiveTab] = useState('unlocked');
  const data = getGamificationData();
  const progressData = getAchievementProgress();

  const allAchievements = Object.values(ACHIEVEMENTS);
  const unlockedAchievements = allAchievements.filter(a =>
    data.unlockedAchievements.includes(a.id)
  );
  const lockedAchievements = allAchievements.filter(a =>
    !data.unlockedAchievements.includes(a.id)
  );

  // Group by category
  const categories = {
    streak: '🔥 Streaks',
    fitness: '💪 Fitness',
    tracking: '📊 Tracking',
    nutrition: '🥗 Nutrition',
    habits: '✨ Habits',
    milestone: '🎯 Milestones',
  };

  const groupedUnlocked = {};
  const groupedLocked = {};

  unlockedAchievements.forEach(achievement => {
    if (!groupedUnlocked[achievement.category]) {
      groupedUnlocked[achievement.category] = [];
    }
    groupedUnlocked[achievement.category].push(achievement);
  });

  lockedAchievements.forEach(achievement => {
    if (!groupedLocked[achievement.category]) {
      groupedLocked[achievement.category] = [];
    }
    groupedLocked[achievement.category].push(achievement);
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="card max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white dark:bg-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700 z-10">
          <div>
            <h2 className="text-2xl font-bold">Achievements</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {unlockedAchievements.length} of {allAchievements.length} unlocked
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold relative z-20"
          >
            ×
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {data.currentStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {data.longestStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Best Streak</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {unlockedAchievements.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Unlocked</div>
          </div>
        </div>

        {/* Progress Towards Next Achievements */}
        {progressData.some(p => !p.unlocked && p.progress > 0) && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">In Progress</h3>
            <div className="space-y-3">
              {progressData
                .filter(p => !p.unlocked && p.progress > 0)
                .map((p, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{p.achievement.icon}</span>
                        <span className="font-semibold text-sm">{p.achievement.title}</span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {p.progress} / {p.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((p.progress / p.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('unlocked')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'unlocked'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Unlocked ({unlockedAchievements.length})
          </button>
          <button
            onClick={() => setActiveTab('locked')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'locked'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Locked ({lockedAchievements.length})
          </button>
        </div>

        {/* Achievement List */}
        <div className="space-y-6">
          {activeTab === 'unlocked' ? (
            Object.entries(groupedUnlocked).map(([category, achievements]) => (
              <div key={category}>
                <h3 className="font-semibold text-lg mb-3">{categories[category]}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {achievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className="p-4 border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-4xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold">{achievement.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {achievement.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            Object.entries(groupedLocked).map(([category, achievements]) => (
              <div key={category}>
                <h3 className="font-semibold text-lg mb-3">{categories[category]}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {achievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg opacity-60"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-4xl grayscale">{achievement.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold">{achievement.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {achievement.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
