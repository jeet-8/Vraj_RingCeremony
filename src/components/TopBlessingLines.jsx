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
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.6, ease: 'easeInOut' } }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`w-full text-center z-30 select-none ${
            isHero ? 'my-4' : 'fixed top-0 left-0 right-0 pt-safe px-4 pointer-events-none'
          }`}
          style={{
            paddingTop: isHero ? '0' : 'max(1rem, env(safe-area-inset-top, 16px))',
          }}
        >
          <div className="max-w-md mx-auto flex flex-col items-center justify-center">
            {/* 3 Blessing Lines with Staggered Fade-in */}
            <div className="flex flex-col items-center space-y-1">
              {lines.map((line, idx) => (
                <motion.p
                  key={`${currentLang}-${idx}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: isHero ? 0.2 + idx * 0.15 : 0.3 + idx * 0.4,
                    duration: 0.7,
                  }}
                  className={`${fontClass} text-xs sm:text-sm tracking-[0.16em] sm:tracking-[0.22em] font-medium uppercase gold-foil-text drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]`}
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {/* Ornamental Mandala / Paisley Gold Divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: isHero ? 0.6 : 1.5, duration: 0.8 }}
              className="flex items-center justify-center gap-2 mt-2 w-36 sm:w-48"
            >
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D8A85E] to-transparent opacity-80" />
              <span className="text-[#D8A85E] text-xs font-serif opacity-90 select-none">✦ 卐 ✦</span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D8A85E] to-transparent opacity-80" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
