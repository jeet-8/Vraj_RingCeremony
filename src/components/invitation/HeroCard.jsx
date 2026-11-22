import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import eventConfig from '../../../event.config.js';
import TopBlessingLines from '../TopBlessingLines';

export default function HeroCard({ guestName }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'hi';

  const fontClass = currentLang === 'hi' 
    ? 'font-hindi' 
    : currentLang === 'gu' 
    ? 'font-gujarati' 
    : 'font-serif';

  return (
    <div className="relative w-full max-w-md mx-auto paper-card rounded-2xl px-4 py-6 sm:p-8 shadow-2xl border border-[#D8A85E]/30 overflow-hidden mb-8">
      {/* Delicate Gold Corner Ornaments */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#D8A85E]/50 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#D8A85E]/50 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#D8A85E]/50 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#D8A85E]/50 rounded-br-lg pointer-events-none" />

      {/* Top 3 Blessing Lines repeated in Hero Card */}
      <TopBlessingLines isHero={true} />

      {/* Ceremony Monogram Pill: Bigger, Dark Wine, Gold Highlighted */}
      <div className="text-center my-4 sm:my-5">
        <div
          className={`inline-flex items-center justify-center px-6 py-2.5 sm:px-8 sm:py-3 rounded-full border border-[#C9A24A] bg-[#4A1224] shadow-[0_0_14px_rgba(201,162,74,0.35)] whitespace-nowrap transition-transform duration-300 hover:scale-[1.02] select-none ${
            currentLang === 'en'
              ? 'font-display uppercase tracking-[0.1em]'
              : `${fontClass} tracking-wide font-bold`
          }`}
          style={{
            fontSize: 'clamp(18px, 4.8vw, 24px)',
            color: '#E8CC85',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.4), 0 0 8px rgba(232, 204, 133, 0.3)',
          }}
        >
          <span className="font-bold drop-shadow-sm">
            {t('hero.heroPillText', eventConfig.heroPillText || 'SAGAI - DASTUR')}
          </span>
        </div>
      </div>

      {/* Kuldevi Blessing Line */}
      {(() => {
        const blessingLine = t('hero.heroBlessingLine', eventConfig.hero?.blessingLine || eventConfig.heroBlessingLine || 'With the Immense Grace of Shri Kuldevi Khimaj Mataji, We Have');
        if (!blessingLine) return null;

        return (
          <div className="mt-3.5 sm:mt-4 mb-2.5 sm:mb-3 px-2 text-center">
            <p
              className={`${fontClass} text-[13px] sm:text-[15px] text-[#4A1224] font-semibold tracking-wide leading-relaxed max-w-[88%] mx-auto [text-wrap:balance]`}
            >
              {blessingLine}
            </p>
          </div>
        );
      })()}

      {/* Grandparents Section (centered between Blessing Line and Groom name) */}
      {(() => {
        const grandsonLabel = t('hero.grandsonLabel', '');
        const labelPosition = t('hero.grandsonLabelPosition', 'before');
        let grandparentsText = t('hero.groomGrandparentsLine') || eventConfig.groom?.grandparentsLine || '';
        if (grandsonLabel && grandparentsText.startsWith(grandsonLabel)) {
          grandparentsText = grandparentsText.slice(grandsonLabel.length).replace(/^[\s,:-]+/, '');
        }

        const labelElement = grandsonLabel ? (
          <p className="font-serif italic text-xs text-[#9E6D38] my-1 tracking-wider">
            {grandsonLabel}
          </p>
        ) : null;

        const detailsElement = (
          <p
            className={`${fontClass} text-[13px] sm:text-[15px] text-[#4A1224] font-semibold tracking-wide leading-relaxed max-w-[92%] sm:max-w-[85%] mx-auto [text-wrap:balance]`}
          >
            {grandparentsText}
          </p>
        );

        return (
          <div className="mt-0 mb-3.5 sm:mb-4 px-2 text-center">
            {labelPosition === 'after' ? (
              <>
                {detailsElement}
                {labelElement}
              </>
            ) : (
              <>
                {labelElement}
                {detailsElement}
              </>
            )}

            {/* Thin gold ornamental divider below text to separate from Vraj */}
            <div className="flex items-center justify-center gap-2 mt-3.5 mb-1 opacity-80">
              <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#D8A85E]" />
              <span className="text-[9px] text-[#B38136]">◆</span>
              <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#D8A85E]" />
            </div>
          </div>
        );
      })()}

      {/* Couple and Respective Parents Section */}
      <div className="text-center my-4 space-y-4">
        {/* Groom Block */}
        <div className="flex flex-col items-center">
          <h1 
            className="font-script text-[#4A1224] leading-tight drop-shadow-sm whitespace-nowrap"
            style={{ fontSize: 'clamp(2.2rem, 7.5vw, 3.2rem)' }}
          >
            {eventConfig.groom.name}
          </h1>
          <p className="font-serif italic text-xs text-[#9E6D38] mt-1.5 mb-1 tracking-wider">
            {t('hero.groomParentsLabel')}
          </p>
          <p
            className={`${fontClass} text-[#4A1224] font-semibold tracking-wide px-2 leading-snug whitespace-nowrap`}
            style={{ fontSize: 'clamp(13.5px, 3.8vw, 16px)' }}
          >
            {t('hero.groomParents') || eventConfig.groom.parents}
          </p>
        </div>

        {/* Center Ornamental "&" Divider */}
        <div className="flex items-center justify-center gap-3 my-1">
          <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#D8A85E]" />
          <span className="font-serif italic text-lg sm:text-xl text-[#B38136]">&amp;</span>
          <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#D8A85E]" />
        </div>

        {/* Bride Grandparents Block (between & divider and Pooja (Jiya)) */}
        {(() => {
          const labelPosition = t('bride.labelPosition', 'before');
          const grandLabel = t('bride.grandLabel', eventConfig.bride?.grandLabel || 'Granddaughter of');
          const grandparentsLine = t('bride.grandparentsLine', eventConfig.bride?.grandparentsLine || '');

          const labelElement = (
            <p className="font-serif italic text-xs text-[#9E6D38] tracking-wider">
              {grandLabel}
            </p>
          );

          const detailsElement = (
            <p
              className={`${fontClass} text-[13px] sm:text-[15px] text-[#4A1224] font-semibold tracking-wide leading-relaxed max-w-[88%] mx-auto [text-wrap:balance]`}
            >
              {grandparentsLine}
            </p>
          );

          return (
            <div className="mt-3.5 sm:mt-4 mb-2.5 sm:mb-3 px-2 text-center flex flex-col items-center justify-center gap-2">
              {labelPosition === 'before' ? (
                <>
                  {labelElement}
                  {detailsElement}
                </>
              ) : (
                <>
                  {detailsElement}
                  {labelElement}
                </>
              )}
            </div>
          );
        })()}

        {/* Bride Block */}
        <div className="flex flex-col items-center">
          <h1 
            className="font-script text-[#4A1224] leading-tight drop-shadow-sm whitespace-nowrap"
            style={{ fontSize: 'clamp(2.2rem, 7.5vw, 3.2rem)' }}
          >
            {eventConfig.bride.name}
          </h1>
          <p className="font-serif italic text-xs text-[#9E6D38] mt-1.5 mb-1 tracking-wider">
            {t('hero.brideParentsLabel')}
          </p>
          <p
            className={`${fontClass} text-[#4A1224] font-semibold tracking-wide px-2 leading-snug whitespace-nowrap`}
            style={{ fontSize: 'clamp(13.5px, 3.8vw, 16px)' }}
          >
            {t('hero.brideParents') || eventConfig.bride.parents}
          </p>
        </div>
      </div>

      {/* Date & Time Highlight */}
      <div className="mt-5 pt-5 border-t border-[#D8A85E]/30 text-center pb-5 sm:pb-6">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <span
            className="text-[#B38136] select-none flex-shrink-0"
            style={{ fontSize: 'clamp(15px, 4.6vw, 24px)' }}
          >
            ✦
          </span>
          <p
            className="font-display tracking-wider sm:tracking-widest text-[#B38136] font-semibold uppercase whitespace-nowrap"
            style={{ fontSize: 'clamp(18px, 5.8vw, 30px)' }}
          >
            {eventConfig.dateTime.dateFormatted.toUpperCase()}
          </p>
          <span
            className="text-[#B38136] select-none flex-shrink-0"
            style={{ fontSize: 'clamp(15px, 4.6vw, 24px)' }}
          >
            ✦
          </span>
        </div>
        <p
          className={`${fontClass} text-[#4A1224] font-medium sm:font-semibold mt-2.5 whitespace-nowrap tracking-wide`}
          style={{ fontSize: 'clamp(16.5px, 5.1vw, 24px)' }}
        >
          {eventConfig.dateTime.timeFormatted}
        </p>
      </div>
    </div>
  );
}
