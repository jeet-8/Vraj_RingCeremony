import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import soundEngine from '../../utils/proceduralAudio';

export default function CSSEnvelope({
  isOpening,
  onOpeningStart,
  onOpeningComplete,
  onSkip,
}) {
  const { t } = useTranslation();
  const [stage, setStage] = useState('idle'); // 'idle' | 'cracking' | 'opening' | 'revealed'

  const handleOpen = () => {
    if (stage !== 'idle') return;
    soundEngine.unlock();
    soundEngine.play();
    if (onOpeningStart) onOpeningStart();
    setStage('cracking');

    // Sequence timing matching GSAP
    setTimeout(() => {
      setStage('opening');
    }, 800);

    setTimeout(() => {
      setStage('revealed');
      if (onOpeningComplete) onOpeningComplete();
    }, 5500);
  };

  return (
    <div className="relative w-full h-[100dvh] flex items-center justify-center bg-gradient-to-b from-[#1A0E17] via-[#2A1524] to-[#150912] overflow-hidden select-none px-4">
      {/* Skip Button */}
      <button
        onClick={onSkip}
        className="absolute top-4 right-4 z-40 px-3 py-1.5 rounded-full bg-[#24141E]/70 hover:bg-[#24141E] backdrop-blur-md border border-[#D8A85E]/30 text-xs font-serif tracking-widest text-[#DFBE95] hover:text-[#FFEDBA] transition-all shadow-md active:scale-95"
      >
        {t('opening.skip')} →
      </button>

      {/* CSS Envelope Container */}
      <div className="relative w-[320px] sm:w-[360px] h-[220px] sm:h-[245px] max-w-[90vw]">
        {/* Envelope Base Pocket */}
        <div className="absolute inset-0 bg-[#D9AAB7] rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-[#E8C0CE] overflow-hidden">
          {/* Subtle floral paper pattern */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#5A2637_1px,transparent_1px)] [background-size:12px_12px]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#C28E9E]/30 via-transparent to-[#FFE3EC]/40" />
        </div>

        {/* Inside Invitation Card (glides up at stage 'opening') */}
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={
            stage === 'opening'
              ? { y: -160, opacity: 1, scale: 1.05 }
              : stage === 'revealed'
              ? { y: -220, opacity: 0, scale: 1.2 }
              : { y: 0, opacity: 0 }
          }
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-3 top-2 h-[220px] sm:h-[240px] bg-[#FAF6F0] rounded-sm border-2 border-[#D8A85E] p-4 flex flex-col items-center justify-center text-center shadow-xl z-10"
        >
          <span className="text-[#D8A85E] text-xs font-serif">卐 Shree Ganeshay Namah 卐</span>
          <span className="text-[#8E5164] text-xs font-serif italic mt-1">Cordially invite you to celebrate</span>
          <h2 className="text-[#B38136] font-display text-sm font-bold tracking-widest mt-1">RING CEREMONY</h2>
          <h1 className="text-[#4A1224] font-script text-3xl sm:text-4xl mt-1">Vraj &amp; Jiya</h1>
          <div className="w-16 h-[1px] bg-[#D8A85E] my-2" />
          <p className="text-[#B38136] text-xs font-serif tracking-wider font-semibold">6 DECEMBER 2026</p>
          <p className="text-[#5A2637] text-[11px] font-serif mt-0.5">R.K. Royal Banquet, Science City</p>
        </motion.div>

        {/* Left Flap */}
        <motion.div
          animate={
            stage === 'opening' || stage === 'revealed'
              ? { rotateY: -110 }
              : { rotateY: 0 }
          }
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{ transformOrigin: 'left center' }}
          className="absolute left-0 top-0 bottom-0 w-1/2 border-r border-[#B88796]/40 z-20 pointer-events-none"
        >
          <div
            className="w-full h-full bg-[#D4A3B1]"
            style={{ clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)' }}
          />
        </motion.div>

        {/* Right Flap */}
        <motion.div
          animate={
            stage === 'opening' || stage === 'revealed'
              ? { rotateY: 110 }
              : { rotateY: 0 }
          }
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ transformOrigin: 'right center' }}
          className="absolute right-0 top-0 bottom-0 w-1/2 border-l border-[#B88796]/40 z-20 pointer-events-none"
        >
          <div
            className="w-full h-full bg-[#CCA0AD]"
            style={{ clipPath: 'polygon(100% 0%, 0% 50%, 100% 100%)' }}
          />
        </motion.div>

        {/* Bottom Flap */}
        <motion.div
          animate={
            stage === 'opening' || stage === 'revealed'
              ? { rotateX: -110 }
              : { rotateX: 0 }
          }
          transition={{ duration: 0.8 }}
          style={{ transformOrigin: 'bottom center' }}
          className="absolute left-0 right-0 bottom-0 h-1/2 z-20 pointer-events-none"
        >
          <div
            className="w-full h-full bg-[#CE9BAA]"
            style={{ clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)' }}
          />
        </motion.div>

        {/* Top Flap (Hinged at top, opens upwards ~160 deg) */}
        <motion.div
          animate={
            stage === 'opening' || stage === 'revealed'
              ? { rotateX: 160 }
              : { rotateX: 0 }
          }
          transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          style={{ transformOrigin: 'top center' }}
          className="absolute left-0 right-0 top-0 h-[65%] z-30 pointer-events-none"
        >
          <div
            className="w-full h-full bg-[#E0B2BF] shadow-md border-t border-[#F8DCE5]"
            style={{ clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)' }}
          />
        </motion.div>

        {/* Satin Gold Ribbon */}
        <motion.div
          animate={
            stage !== 'idle'
              ? { x: 400, opacity: 0, rotate: 15 }
              : { x: 0, opacity: 1, rotate: 0 }
          }
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-r from-[#D8A85E] via-[#FFEDBA] to-[#B38136] shadow-sm z-35 pointer-events-none"
        />

        {/* Wax Seal at Center */}
        <AnimatePresence>
          {stage === 'idle' && (
            <motion.div
              onClick={handleOpen}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#731E35] via-[#4A1224] to-[#2B0A15] border-2 border-[#D8A85E] shadow-wax-seal flex flex-col items-center justify-center cursor-pointer z-40 animate-seal-pulse"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-dashed border-[#D8A85E]/70 flex flex-col items-center justify-center">
                <span className="font-display font-bold text-sm sm:text-base text-[#FFEDBA] drop-shadow-sm">
                  V &amp; J
                </span>
                <span className="text-[8px] text-[#DFBE95] font-serif">06.12.26</span>
              </div>
            </motion.div>
          )}

          {/* Shattered Wax Pieces Animation */}
          {stage === 'cracking' && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 pointer-events-none z-40">
              {[...Array(8)].map((_, i) => {
                const angle = (i * 360) / 8;
                return (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{
                      x: Math.cos((angle * Math.PI) / 180) * 80,
                      y: Math.sin((angle * Math.PI) / 180) * 80 + 40,
                      scale: 0.2,
                      opacity: 0,
                      rotate: 180,
                    }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute w-4 h-4 bg-[#581829] rounded-sm border border-[#D8A85E]"
                  />
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Tap hint prompt */}
      {stage === 'idle' && (
        <div
          onClick={handleOpen}
          className="absolute bottom-16 sm:bottom-20 left-0 right-0 flex flex-col items-center justify-center pointer-events-auto cursor-pointer z-20 px-4"
        >
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#24141E]/80 backdrop-blur-md border border-[#D8A85E]/40 animate-seal-pulse shadow-wax-seal">
            <span className="text-[#D8A85E] text-base">✦</span>
            <span className="font-serif text-sm tracking-[0.15em] text-[#FFEDBA] font-medium uppercase">
              {t('opening.tapSeal')}
            </span>
            <span className="text-[#D8A85E] text-base">✦</span>
          </div>
          <span className="text-[11px] tracking-widest text-[#E8B4B8]/70 mt-2 font-serif uppercase">
            Tap the seal to open
          </span>
        </div>
      )}
    </div>
  );
}
