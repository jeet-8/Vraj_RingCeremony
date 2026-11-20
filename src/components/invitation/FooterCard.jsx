import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import eventConfig from '../../../event.config.js';
import { downloadIcsCalendar, getGoogleCalendarUrl } from '../../utils/calendar';

export default function FooterCard({ onReopen, onSwitchToSimple }) {
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);

  const currentLang = i18n.language || 'en';
  const fontClass = currentLang === 'hi' 
    ? 'font-hindi' 
    : currentLang === 'gu' 
    ? 'font-gujarati' 
    : 'font-serif';

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

      {/* Action Buttons: Add to Calendar & Share */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Google Calendar Link */}
        <a
          href={getGoogleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#24141E] border border-[#D8A85E]/40 text-[#DFBE95] hover:text-[#FFEDBA] text-xs font-serif font-semibold tracking-wider transition-all active:scale-95 shadow-md"
        >
          <span>📅</span>
          <span>{t('footer.googleCalendar')}</span>
        </a>

        {/* Download .ics */}
        <button
          onClick={downloadIcsCalendar}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#24141E] border border-[#D8A85E]/40 text-[#DFBE95] hover:text-[#FFEDBA] text-xs font-serif font-semibold tracking-wider transition-all active:scale-95 shadow-md"
        >
          <span>📥</span>
          <span>{t('footer.downloadIcs')}</span>
        </button>
      </div>

      {/* Share Invitation Button */}
      <div className="mb-6">
        <button
          onClick={handleShare}
          className="w-full py-3 px-6 rounded-full bg-[#24141E] border border-[#D8A85E]/50 text-[#FFEDBA] font-serif font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#2F1A28] transition-all shadow-md active:scale-95"
        >
          <span>🔗</span>
          <span>{copied ? t('footer.copied') : t('footer.share')}</span>
        </button>
      </div>

      {/* Navigation: Reopen Envelope & Plain 2D Toggle */}
      <div className="flex items-center justify-center gap-4 text-xs font-serif text-[#DFBE95]/80 my-4">
        {onReopen && (
          <button
            onClick={onReopen}
            className="hover:text-[#FFEDBA] underline underline-offset-4 decoration-[#D8A85E]/40"
          >
            ✉️ {t('footer.reopen')}
          </button>
        )}

        <span>•</span>

        <button
          onClick={onSwitchToSimple}
          className="hover:text-[#FFEDBA] underline underline-offset-4 decoration-[#D8A85E]/40"
        >
          {t('footer.viewSimple')}
        </button>
      </div>

      <p className="text-[11px] text-[#8E5164] font-serif mt-4">
        {t('footer.madeWithLove')} • Vraj &amp; Jiya
      </p>
    </footer>
  );
}
