import React from 'react';
import { useTranslation } from 'react-i18next';
import eventConfig from '../../../event.config.js';

export default function ScheduleCard() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const fontClass = currentLang === 'hi' 
    ? 'font-hindi' 
    : currentLang === 'gu' 
    ? 'font-gujarati' 
    : 'font-serif';

  return (
    <div className="relative w-full max-w-md mx-auto paper-card rounded-2xl p-6 shadow-xl border border-[#D8A85E]/30 mb-8 overflow-hidden">
      {/* Title */}
      <div className="text-center mb-6">
        <span className="text-xl">🪔</span>
        <h3 className={`${fontClass} text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#8E5164] mt-1`}>
          {t('schedule.title')}
        </h3>
        <p className="font-serif italic text-xs text-[#B38136] mt-0.5">
          {t('schedule.subtitle')}
        </p>
      </div>

      {/* Vertical Timeline with decorative borders */}
      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#D8A85E] before:via-[#E8B4B8] before:to-[#D8A85E]">
        {eventConfig.schedule.map((item, idx) => {
          const title = currentLang === 'hi' 
            ? item.titleHi 
            : currentLang === 'gu' 
            ? item.titleGu 
            : item.titleEn;

          const desc = currentLang === 'hi' 
            ? item.descHi 
            : currentLang === 'gu' 
            ? item.descGu 
            : item.descEn;

          return (
            <div key={idx} className="relative group">
              {/* Timeline marker node */}
              <div className="absolute -left-[1.85rem] top-1 w-5 h-5 rounded-full bg-[#FAF0E1] border-2 border-[#D8A85E] flex items-center justify-center shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#B38136]" />
              </div>

              {/* Event details card */}
              <div className="p-3.5 rounded-xl bg-[#FAF0E1]/70 border border-[#D8A85E]/20 transition-all group-hover:bg-[#FAF0E1]">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#B38136]/15 text-[#B38136] font-display text-[11px] font-semibold tracking-wider">
                  {item.time}
                </span>
                <h4 className={`${fontClass} text-sm sm:text-base font-bold text-[#4A1224] mt-1.5`}>
                  {title}
                </h4>
                <p className={`${fontClass} text-xs text-[#8E5164] mt-1 leading-relaxed`}>
                  {desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
