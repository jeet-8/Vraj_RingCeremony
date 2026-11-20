import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import eventConfig from '../../../event.config.js';

export default function FooterCard({ onReopen }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  // Share handler
  const handleShare = async () => {
    const shareData = {
      title: eventConfig.seo.title,
      text: `💍 You are cordially invited to the Ring Ceremony of Vraj & Jiya (Pooja) on 6 December 2026 at R.K. Royal Banquet, Science City! Tap to open the digital invitation:`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Share cancelled or unavailable
      }
    }

    // Fallback: Copy link or open WhatsApp share
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + window.location.href)}`;
      window.open(waUrl, '_blank');
    }
  };

  return (
    <footer className="w-full max-w-md mx-auto text-center pt-4 pb-20 px-4">
      {/* Monogram Seal */}
      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#581829] to-[#3A0F1B] border-2 border-[#D8A85E] shadow-wax-seal flex flex-col items-center justify-center mb-4">
        <span className="font-display font-bold text-sm text-[#FFEDBA]">
          {eventConfig.couple.monogram}
        </span>
      </div>

      <h3 className="font-script text-3xl text-[#FFEDBA] mb-2">
        {eventConfig.couple.groom} &amp; {eventConfig.couple.bride}
      </h3>
      <p className="font-serif text-xs text-[#E8B4B8] tracking-widest uppercase mb-6">
        {eventConfig.dateTime.dateFormatted}
      </p>

      {/* Share Invitation Button */}
      <div className="mb-6">
        <button
          onClick={handleShare}
          className="w-full py-3 px-6 rounded-full bg-[#24141E] border border-[#D8A85E]/50 text-[#FFEDBA] font-serif font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#2F1A28] transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>🔗</span>
          <span>{copied ? t('footer.copied') : t('footer.share')}</span>
        </button>
      </div>

      {/* Navigation: Reopen Envelope */}
      {onReopen && (
        <div className="flex items-center justify-center text-xs font-serif text-[#DFBE95]/80 my-4">
          <button
            onClick={onReopen}
            className="hover:text-[#FFEDBA] underline underline-offset-4 decoration-[#D8A85E]/40 cursor-pointer"
          >
            ✉️ {t('footer.reopen')}
          </button>
        </div>
      )}

      <p className="text-[11px] text-[#8E5164] font-serif mt-4">
        {t('footer.madeWithLove')} • Vraj &amp; Jiya
      </p>
    </footer>
  );
}
