import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import eventConfig from '../../event.config.js';

export default function TopBlessingLines({ isOpening = false, isHero = false }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  // Get blessing lines for current language or fallback to English
  const lines = eventConfig.blessings[currentLang] || eventConfig.blessings.en;

  // Font class based on language
  const fontClass = currentLang === 'hi' 
    ? 'font-hindi' 
    : currentLang === 'gu' 
    ? 'font-gujarati' 
    : 'font-serif';

  return (
    <AnimatePresence>
      {!isOpening && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.5, ease: 'easeInOut' } }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`w-full text-center select-none ${
            isHero ? 'my-3' : 'px-2 pointer-events-none'
          }`}
        >
          <div className="max-w-md mx-auto flex flex-col items-center justify-center">
            {/* 3 Blessing Lines with responsive clamp sizing so each fits on a single line */}
            <div className="flex flex-col items-center space-y-1 sm:space-y-1.5 w-full">
              {lines.map((line, idx) => (
                <motion.p
                  key={`${currentLang}-${idx}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: isHero ? 0.15 + idx * 0.12 : 0.2 + idx * 0.3,
                    duration: 0.6,
                  }}
                  className={`${fontClass} font-medium uppercase gold-foil-text drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] text-center leading-snug whitespace-nowrap`}
                  style={{
                    fontSize: 'clamp(0.72rem, 3.4vw, 0.95rem)',
                    letterSpacing: 'clamp(0.06em, 1.4vw, 0.18em)',
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {/* Ornamental Mandala / Paisley Gold Divider (Row 3) */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: isHero ? 0.5 : 1.1, duration: 0.7 }}
              className="flex items-center justify-center gap-2 mt-2 w-32 sm:w-44"
            >
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D8A85E] to-transparent opacity-80" />
              <span className="text-[#D8A85E] text-[11px] sm:text-xs font-serif opacity-90 select-none">✦ 卐 ✦</span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D8A85E] to-transparent opacity-80" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
