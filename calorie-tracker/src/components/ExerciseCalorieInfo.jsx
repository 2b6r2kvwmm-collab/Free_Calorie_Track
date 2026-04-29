import { useState } from 'react';
import { Info, X } from 'lucide-react';

export default function ExerciseCalorieInfo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className="inline-flex items-center align-middle ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        aria-label="Why is this estimate lower than expected?"
      >
        <Info size={13} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="font-bold text-gray-900 dark:text-gray-100">Why is this lower than expected?</span>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Most calorie trackers overstate exercise burn in two ways:
              </p>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-3 border-l-2 border-gray-200 dark:border-gray-600">
                  <strong className="text-gray-800 dark:text-gray-200">BMR double-counting.</strong> Standard formulas include your resting metabolic rate during exercise — but this app already accounts for that in your daily calorie budget. We subtract it to avoid counting it twice.
                </li>
                <li className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-3 border-l-2 border-gray-200 dark:border-gray-600">
                  <strong className="text-gray-800 dark:text-gray-200">Metabolic compensation.</strong> Research by Herman Pontzer (2016) found that when people exercise, the body quietly dials down other energy expenditures — fidgeting, immune activity, stress hormones — offsetting about 28% of the calories burned. This is why "eat back your exercise calories 1:1" often stalls weight loss.
                </li>
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                These estimates are still approximate — individual responses vary widely. Use them as a directional guide, not a precise number.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
