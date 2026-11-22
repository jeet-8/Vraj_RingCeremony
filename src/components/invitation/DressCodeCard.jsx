import React from 'react';
import { useTranslation } from 'react-i18next';
import eventConfig from '../../../event.config.js';

export default function DressCodeCard() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'hi';

  const fontClass = currentLang === 'hi' 
    ? 'font-hindi' 
    : currentLang === 'gu' 
    ? 'font-gujarati' 
    : 'font-serif';

  const title = currentLang === 'hi' 
    ? eventConfig.dressCode.titleHi 
    : currentLang === 'gu' 
    ? eventConfig.dressCode.titleGu 
    : eventConfig.dressCode.titleEn;

  const desc = currentLang === 'hi' 
    ? eventConfig.dressCode.descHi 
    : currentLang === 'gu' 
    ? eventConfig.dressCode.descGu 
    : eventConfig.dressCode.descEn;

  return (
    <div className="relative w-full max-w-md mx-auto paper-card rounded-2xl p-6 shadow-xl border border-[#D8A85E]/30 mb-8 overflow-hidden text-center">
      <span className="text-2xl">✨</span>
      <h3 className={`${fontClass} text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#8E5164] mt-1`}>
        {t('dressCode.title')}
      </h3>
      <h4 className={`${fontClass} font-display text-base sm:text-lg font-bold text-[#4A1224] mt-1`}>
        {title}
      </h4>
      <p className={`${fontClass} text-xs sm:text-sm text-[#8E5164] mt-2 max-w-xs mx-auto leading-relaxed`}>
        {desc}
      </p>

      {/* Color Swatches */}
      <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
        {eventConfig.dressCode.palette.map((swatch, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className="w-10 h-10 rounded-full shadow-md border-2 border-white/80 transition-transform hover:scale-110"
              style={{ backgroundColor: swatch.hex }}
              title={swatch.name}
            />
            <span className="text-[10px] text-[#5A2637] font-serif mt-1 font-medium">
              {swatch.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
