import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import soundEngine from '../../utils/proceduralAudio';
import eventConfig from '../../../event.config.js';

export default function CSSEnvelope({
  isOpening,
  onOpeningStart,
  onOpeningComplete,
}) {
  const { t } = useTranslation();
  const [stage, setStage] = useState('idle'); // 'idle' | 'opening' | 'revealed'

  // If isOpening becomes true from parent, start opening sequence immediately
  React.useEffect(() => {
    if (isOpening && stage === 'idle') {
      handleOpen();
    }
  }, [isOpening, stage]);

  const handleOpen = () => {
    if (stage !== 'idle') return;
    console.log('[CSSEnvelope Debug] Open triggered');
    soundEngine.unlock();
    soundEngine.play();
    if (onOpeningStart) onOpeningStart();
    setStage('opening');

    setTimeout(() => {
      setStage('revealed');
      if (onOpeningComplete) onOpeningComplete();
    }, 5500);
  };

  return (
    <div
      onClick={handleOpen}
      className="relative w-full h-full flex items-center justify-center bg-[#C88C9C] overflow-hidden select-none px-4 cursor-pointer"
    >
      {/* CSS Envelope Container: Full bleed fill */}
      <div className="relative w-full h-full max-w-lg flex items-center justify-center">
        {/* Full Envelope Base Pocket */}
        <div className="absolute inset-0 bg-[#C88C9C] overflow-hidden">
          {/* Subtle paper leaf texture simulation */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#5A2637_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#9E5D70]/30 via-transparent to-[#FFE3EC]/40" />
        </div>

        {/* Inside Invitation Card */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={
            stage === 'opening'
              ? { y: -40, opacity: 1, scale: 1.0 }
              : stage === 'revealed'
              ? { y: 0, opacity: 1, scale: 1.05 }
              : { y: 50, opacity: 0, scale: 0.9 }
          }
          transition={{ duration: 1.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-4 top-[14%] h-[460px] bg-[#FAF6F0] rounded-xl border-2 border-[#D8A85E] p-4 flex flex-col items-center justify-center text-center shadow-2xl z-10"
        >
          <span className="text-[#875217] text-xs font-serif font-bold">卐 Shree Ganeshay Namah 卐</span>
          <h2 className="text-[#B38136] font-display text-xs font-bold tracking-widest my-1">{t('hero.heroPillText', eventConfig.heroPillText || 'SAGAI - DASTUR')}</h2>

          {/* Kuldevi Blessing line */}
          <p className="text-[#4A1224] font-serif font-semibold text-[9px] max-w-[88%] leading-tight my-0.5">
            {t('hero.heroBlessingLine', eventConfig.hero?.blessingLine || 'With the immense grace of Shri Kuldevi Khimaj Mataji, we have')}
          </p>

          {/* Grandparents line */}
          <p className="text-[#4A1224] font-serif font-semibold text-[9px] max-w-[90%] leading-tight my-1">
            {t('hero.groomGrandparentsFull') || eventConfig.groom?.grandparentsLine}
          </p>

          {/* Groom */}
          <h1 className="text-[#4A1224] font-script text-3xl mt-1 leading-tight">{eventConfig.groom.name}</h1>
          <p className="text-[#9E6D38] font-serif italic text-[10px]">{t('hero.groomParentsLabel') || 'Son of'}</p>
          <p className="text-[#4A1224] font-serif font-semibold text-xs">{t('hero.groomParents') || eventConfig.groom.parents}</p>

          <div className="w-16 h-[1px] bg-[#D8A85E]/50 my-1" />

          {/* Bride Grandparents */}
          <div className="my-0.5 text-center">
            <p className="text-[#9E6D38] font-serif italic text-[10px]">Granddaughter of</p>
            <p className="text-[#4A1224] font-serif font-semibold text-[9px] max-w-[90%] leading-tight mx-auto">
              {t('bride.grandparentsLine') || eventConfig.bride?.grandparentsLine}
            </p>
          </div>

          {/* Bride */}
          <h1 className="text-[#4A1224] font-script text-3xl leading-tight">{eventConfig.bride.name}</h1>
          <p className="text-[#9E6D38] font-serif italic text-[10px]">{t('hero.brideParentsLabel') || 'Daughter of'}</p>
          <p className="text-[#4A1224] font-serif font-semibold text-xs">{t('hero.brideParents') || eventConfig.bride.parents}</p>

          <div className="w-24 h-[1px] bg-[#D8A85E] my-2" />
          <p className="text-[#B38136] text-[10px] font-serif tracking-wider font-semibold">SUNDAY, 6 DECEMBER 2026</p>
          <p className="text-[#5A2637] text-[10px] font-serif">R.K. Royal Banquet &amp; Party Lawn, Science City</p>
        </motion.div>

        {/* Bottom Flap */}
        <motion.div
          animate={
            stage === 'opening' || stage === 'revealed'
              ? { rotateX: -110 }
              : { rotateX: 0 }
          }
          transition={{ duration: 1.0, delay: 0.4 }}
          style={{ transformOrigin: 'bottom center' }}
          className="absolute left-0 right-0 bottom-0 h-1/2 z-20 pointer-events-none"
        >
          <div
            className="w-full h-full bg-[#BF8192] shadow-inner"
            style={{ clipPath: 'polygon(0% 100%, 50% 15%, 100% 100%)' }}
          />
        </motion.div>

        {/* Left Flap */}
        <motion.div
          animate={
            stage === 'opening' || stage === 'revealed'
              ? { rotateY: -110 }
              : { rotateY: 0 }
          }
          transition={{ duration: 1.0, delay: 0.5 }}
          style={{ transformOrigin: 'left center' }}
          className="absolute left-0 top-0 bottom-0 w-1/2 z-20 pointer-events-none"
        >
          <div
            className="w-full h-full bg-[#B87A8C]"
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
          transition={{ duration: 1.0, delay: 0.55 }}
          style={{ transformOrigin: 'right center' }}
          className="absolute right-0 top-0 bottom-0 w-1/2 z-20 pointer-events-none"
        >
          <div
            className="w-full h-full bg-[#B27385]"
            style={{ clipPath: 'polygon(100% 0%, 0% 50%, 100% 100%)' }}
          />
        </motion.div>

        {/* Top V-Flap (Hinged at top, opens upwards ~170 deg, CARRYING SEAL ATTACHED!) */}
        <motion.div
          animate={
            stage === 'opening' || stage === 'revealed'
              ? { rotateX: 170 }
              : { rotateX: 0 }
          }
          transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ transformOrigin: 'top center' }}
          className="absolute left-0 right-0 top-0 h-[38%] z-30 pointer-events-none"
        >
          {/* Top Flap Mauve-Pink Paper */}
          <div
            className="w-full h-full bg-[#D195A5] shadow-lg border-t border-[#F5D5DF]"
            style={{ clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)' }}
          />

          {/* Wax Seal Attached to Top Flap Tip */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
            className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#731E35] via-[#4A1224] to-[#2B0A15] border-2 border-[#D8A85E] shadow-wax-seal flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-dashed border-[#D8A85E]/70 flex flex-col items-center justify-center">
              <span className="font-display font-bold text-sm sm:text-base text-[#FFEDBA] drop-shadow-sm">
                {eventConfig.monogram || eventConfig.couple?.monogram || 'V & P'}
              </span>
              <span className="text-[8px] text-[#DFBE95] font-serif">06.12.26</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tap hint prompt */}
      {stage === 'idle' && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className="absolute bottom-12 sm:bottom-16 left-0 right-0 flex flex-col items-center justify-center pointer-events-auto cursor-pointer z-40 px-4"
        >
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#24141E]/90 backdrop-blur-md border border-[#D8A85E]/50 animate-seal-pulse shadow-wax-seal">
            <span className="text-[#D8A85E] text-sm">✦</span>
            <span className="font-serif text-xs sm:text-sm tracking-[0.14em] text-[#FFEDBA] font-medium uppercase whitespace-nowrap">
              {t('opening.tapSeal')}
            </span>
            <span className="text-[#D8A85E] text-sm">✦</span>
          </div>
          <span className="text-[10px] sm:text-[11px] tracking-widest text-[#FFDFE7]/90 mt-1.5 font-serif uppercase drop-shadow">
            Touch anywhere or tap the seal
          </span>
        </div>
      )}
    </div>
  );
}
