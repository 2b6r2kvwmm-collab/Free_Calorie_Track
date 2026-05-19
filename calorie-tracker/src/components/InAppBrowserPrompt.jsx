import { useState } from 'react';
import { Copy, Check, ExternalLink, X } from 'lucide-react';

function detectContext() {
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);

  let platform = null;
  if (/FBAN|FBAV|FB_IAB/.test(ua)) platform = 'Facebook';
  else if (/Instagram/.test(ua)) platform = 'Instagram';
  else if (/musical_ly|TikTok/.test(ua)) platform = 'TikTok';
  else if (/Twitter/.test(ua)) platform = 'Twitter';

  return { platform, isIOS, isAndroid };
}

export function isInAppBrowser() {
  const { platform } = detectContext();
  return !!platform;
}

export default function InAppBrowserPrompt({ onContinueAnyway }) {
  const [copied, setCopied] = useState(false);
  const { platform, isIOS, isAndroid } = detectContext();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: select a temporary input
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOpenChrome = () => {
    const { host, pathname } = window.location;
    window.location.href = `intent://${host}${pathname}#Intent;scheme=https;package=com.android.chrome;end`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-6 sm:pb-0">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0 mr-3">
            <ExternalLink size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Open in your browser to install
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {platform}'s browser doesn't support installing apps.
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
          {isIOS
            ? 'Copy the link and paste it into Safari to install Free Calorie Track to your home screen.'
            : 'Open this page in Chrome to install Free Calorie Track to your home screen.'}
        </p>

        {isAndroid ? (
          <button
            onClick={handleOpenChrome}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-95 mb-3"
          >
            <ExternalLink size={18} />
            Open in Chrome
          </button>
        ) : (
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-95 mb-3"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Link copied! Paste in Safari' : 'Copy link'}
          </button>
        )}

        {isIOS && (
          <p className="text-xs text-center text-gray-400 dark:text-gray-500 mb-3">
            Then in Safari: tap the Share button → "Add to Home Screen"
          </p>
        )}

        <button
          onClick={onContinueAnyway}
          className="w-full text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 py-1 transition-colors"
        >
          Continue without installing
        </button>
      </div>
    </div>
  );
}
