import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function InAppBrowserBanner() {
  const { t } = useTranslation();
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    const isApp = /(FBAN|FBAV|Instagram|WhatsApp|Line|MicroMessenger|LinkedInApp|musical_ly)/i.test(ua);
    setIsInAppBrowser(isApp);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // Fallback
    }
  };

  if (!isInAppBrowser || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#351A29] text-[#FAF4EC] px-3 py-2 flex items-center justify-between text-xs border-b border-[#D8A85E]/40 shadow-lg">
      <div className="flex items-center gap-1.5 flex-1 pr-2">
        <span>🌐</span>
        <span className="font-serif text-[11px] sm:text-xs">
          {t('browserBanner.text')}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyLink}
          className="px-2.5 py-1 rounded bg-[#D8A85E] text-[#170E14] font-serif font-bold text-[11px] shadow-sm whitespace-nowrap"
        >
          {copied ? 'Copied! ✓' : t('browserBanner.copyLink')}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-[#E8B4B8] hover:text-white text-base px-1"
          aria-label="Dismiss banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
