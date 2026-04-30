import { useState } from 'react';
import { X } from 'lucide-react';
import { getTipSeen, markTipSeen } from '../utils/storage';

export default function FirstUseTip({ id, children }) {
  const [dismissed, setDismissed] = useState(() => getTipSeen(id));

  if (dismissed) return null;

  const dismiss = () => {
    markTipSeen(id);
    setDismissed(true);
  };

  return (
    <div className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3 mb-4">
      <p className="flex-1 text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">{children}</p>
      <button
        onClick={dismiss}
        className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 flex-shrink-0 mt-0.5"
        aria-label="Dismiss tip"
      >
        <X size={15} />
      </button>
    </div>
  );
}
