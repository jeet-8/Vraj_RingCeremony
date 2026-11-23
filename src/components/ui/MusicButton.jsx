import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import soundEngine from '../../utils/proceduralAudio';

export default function MusicButton() {
  const { t, i18n } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(soundEngine.isPlaying && !soundEngine.isMuted);
  const [isBlocked, setIsBlocked] = useState(soundEngine.isBlocked);

  useEffect(() => {
    const unsubscribe = soundEngine.subscribe(({ isPlaying, isMuted, isBlocked }) => {
      setIsPlaying(isPlaying && !isMuted);
      setIsBlocked(isBlocked);
    });
    return unsubscribe;
  }, []);

  const handleToggle = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    soundEngine.toggle();
    setIsPlaying(soundEngine.isPlaying && !soundEngine.isMuted);
    setIsBlocked(soundEngine.isBlocked);
  };

  const label = isPlaying
    ? (t('music.musicOn') || 'Music on')
    : (t('music.muted') || 'Muted');

  const langFont =
    i18n.language === 'gu'
      ? 'font-gujarati'
      : i18n.language === 'hi'
      ? 'font-hindi'
      : 'font-serif';

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 flex flex-col items-end gap-1.5 pointer-events-none">
      {/* Subtle Hint Pill when unmuted playback was gated by browser */}
      <AnimatePresence>
        {isBlocked && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95, transition: { duration: 0.25 } }}
            className={`px-2.5 py-1 rounded-full bg-[#24141E]/95 border border-[#D8A85E]/50 text-[#FFEDBA] text-[10px] sm:text-[11px] shadow-lg backdrop-blur-md whitespace-nowrap select-none pointer-events-none flex items-center gap-1.5 ${langFont}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D8A85E] animate-ping" />
            <span>{t('music.tapHint') || 'Tap anywhere for music'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 min-h-[44px] min-w-[44px] rounded-full bg-[#24141E]/90 hover:bg-[#2F1A28] backdrop-blur-md border border-[#D8A85E]/50 text-[#FFEDBA] shadow-lg active:scale-95 transition-all pointer-events-auto cursor-pointer"
        aria-label={isPlaying ? (t('music.muteMusic') || 'Mute Music') : (t('music.playMusic') || 'Play Music')}
      >
        {/* Animated Soundwave Visualizer */}
        <div className="flex items-center gap-0.5 h-3">
          <span
            className={`w-[2px] bg-[#D8A85E] rounded-full transition-all duration-300 ${
              isPlaying ? 'h-3 animate-pulse' : 'h-1.5 opacity-50'
            }`}
          />
          <span
            className={`w-[2px] bg-[#D8A85E] rounded-full transition-all duration-300 ${
              isPlaying ? 'h-2 animate-bounce' : 'h-2 opacity-50'
            }`}
          />
          <span
            className={`w-[2px] bg-[#D8A85E] rounded-full transition-all duration-300 ${
              isPlaying ? 'h-3 animate-pulse' : 'h-1 opacity-50'
            }`}
          />
        </div>

        <span className="font-serif text-[10px] sm:text-[11px] tracking-wider uppercase text-[#DFBE95]">
          {label}
        </span>
      </button>
    </div>
  );
}
