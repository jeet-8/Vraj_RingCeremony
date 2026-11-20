import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import eventConfig from '../../../event.config.js';
import TopBlessingLines from '../TopBlessingLines';

export default function HeroCard({ guestName }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const fontClass = currentLang === 'hi' 
    ? 'font-hindi' 
    : currentLang === 'gu' 
    ? 'font-gujarati' 
    : 'font-serif';

  return (
    <div className="relative w-full max-w-md mx-auto paper-card rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#D8A85E]/30 overflow-hidden mb-8">
      {/* Delicate Gold Corner Ornaments */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#D8A85E]/50 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#D8A85E]/50 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#D8A85E]/50 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#D8A85E]/50 rounded-br-lg pointer-events-none" />

      {/* Top 3 Blessing Lines repeated in Hero Card */}
      <TopBlessingLines isHero={true} />

      {/* Auspicious Ganesh Motif */}
      <div className="flex flex-col items-center justify-center my-3">
        <div className="w-12 h-12 rounded-full bg-[#FAF0E1] border border-[#D8A85E]/40 flex items-center justify-center shadow-inner">
          <span className="text-2xl text-[#B38136]">卐</span>
        </div>
      </div>

      {/* Personalized Greeting */}
      <div className="text-center my-3">
        {guestName ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-[#FAF0E1]/80 border border-[#D8A85E]/30"
          >
            <p className="font-serif italic text-sm sm:text-base text-[#5A2637] font-semibold">
              {t('hero.guestGreetingPrefix')} {guestName} {t('hero.guestGreetingSuffix')}
            </p>
          </motion.div>
        ) : (
          <p className="font-serif italic text-sm text-[#8E5164]">
            {t('hero.defaultGreeting')}
          </p>
        )}
      </div>

      {/* Elders' Blessings & Parents */}
      <div className="text-center space-y-2 my-4">
        <p className={`${fontClass} text-xs sm:text-sm tracking-wider uppercase text-[#8E5164] font-medium`}>
          {t('hero.elderBlessing')}
        </p>

        <div className="py-2 px-3 rounded-lg bg-[#FAF0E1]/50 border border-[#D8A85E]/20 my-2">
          <p className={`${fontClass} text-sm sm:text-base text-[#4A1224] font-semibold`}>
            {eventConfig.families.groomParents}
          </p>
          <p className="text-xs text-[#D8A85E] font-serif my-0.5">&amp;</p>
          <p className={`${fontClass} text-sm sm:text-base text-[#4A1224] font-semibold`}>
            {eventConfig.families.brideParents}
          </p>
        </div>

        <p className={`${fontClass} text-xs sm:text-sm text-[#8E5164] italic px-2`}>
          {t('hero.invite')}
        </p>
      </div>

      {/* Ceremony Monogram & Couple Names */}
      <div className="text-center my-6">
        <div className="inline-block px-3 py-1 rounded-full border border-[#D8A85E]/50 text-xs font-display tracking-[0.2em] text-[#B38136] uppercase bg-[#FFFBF5]">
          {eventConfig.couple.ceremony}
        </div>

        <h1 className="font-script text-4xl sm:text-5xl text-[#4A1224] mt-3 mb-1 drop-shadow-sm">
          {eventConfig.couple.groom}
        </h1>
        <div className="flex items-center justify-center gap-3 my-1">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D8A85E]" />
          <span className="font-serif italic text-lg text-[#B38136]">&amp;</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D8A85E]" />
        </div>
        <h1 className="font-script text-4xl sm:text-5xl text-[#4A1224] mb-3 drop-shadow-sm">
          {eventConfig.couple.bride}
        </h1>
      </div>

      {/* Date & Time Highlight */}
      <div className="mt-4 pt-4 border-t border-[#D8A85E]/30 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-[#B38136]">✦</span>
          <p className="font-display text-sm sm:text-base tracking-widest text-[#B38136] font-semibold">
            {eventConfig.dateTime.dateFormatted.toUpperCase()}
          </p>
          <span className="text-[#B38136]">✦</span>
        </div>
        <p className="font-serif text-xs sm:text-sm text-[#5A2637] mt-1 font-medium">
          {eventConfig.dateTime.timeFormatted}
        </p>
      </div>
    </div>
  );
}
