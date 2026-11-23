import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import './i18n';
import TopBlessingLines from './components/TopBlessingLines';
import CSSEnvelope from './components/fallback/CSSEnvelope';
import ScrollableInvitation from './components/invitation/ScrollableInvitation';
import Plain2DInvitation from './components/fallback/Plain2DInvitation';
import LanguageSelector from './components/ui/LanguageSelector';
import MusicButton from './components/ui/MusicButton';
import InAppBrowserBanner from './components/ui/InAppBrowserBanner';
import ErrorBoundary from './components/ErrorBoundary';
import { parseGuestName } from './utils/guestParser';
import soundEngine from './utils/proceduralAudio';
import { useTranslation } from 'react-i18next';

// Lazy-load the heavy 3D chunk for blazing-fast initial paint
const EnvelopeScene = lazy(() => import('./components/3d/EnvelopeScene'));

function LoadingInvitation() {
  const { t } = useTranslation();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#170E14] text-center px-4">
      <div className="w-12 h-12 rounded-full border-2 border-t-[#D8A85E] border-r-transparent border-b-[#D8A85E]/30 border-l-transparent animate-spin mb-3" />
      <p className="font-serif italic text-xs tracking-widest text-[#FFEDBA]">
        {t('opening.preparing')}
      </p>
    </div>
  );
}

export default function App() {
  const { t } = useTranslation();
  const [viewState, setViewState] = useState('intro'); // 'intro' | 'invitation' | 'plain'
  const [isOpening, setIsOpening] = useState(false);
  const [tier, setTier] = useState(1); // 1 = full 3D, 2 = lite 3D, 3 = CSS envelope
  const [guestName, setGuestName] = useState(null);

  // Check URL params on mount
  useEffect(() => {
    // Attempt autoplay immediately on page mount
    soundEngine.startAutoplayFlow();

    const parsedGuest = parseGuestName();
    if (parsedGuest) {
      setGuestName(parsedGuest);
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'plain' || params.get('mode') === 'simple') {
      setViewState('plain');
    }

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn('WebGL not supported, falling back to Tier 3 CSS Envelope');
        setTier(3);
      }
    } catch (e) {
      setTier(3);
    }
  }, []);

  // Performance watchdog: If FPS < 30 for 2s during idle intro, drop tier
  const lowFpsCountRef = useRef(0);
  useEffect(() => {
    // Never drop tier while opening animation is already in progress
    if (viewState !== 'intro' || isOpening || tier === 3) return;

    let lastTime = performance.now();
    let frameId;

    const checkFps = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      if (delta > 33.3) {
        // Less than 30 FPS
        lowFpsCountRef.current += 1;
        if (lowFpsCountRef.current > 60) {
          // Drop tier
          setTier((prev) => (prev === 1 ? 2 : 3));
          lowFpsCountRef.current = 0;
        }
      } else {
        lowFpsCountRef.current = Math.max(0, lowFpsCountRef.current - 1);
      }

      frameId = requestAnimationFrame(checkFps);
    };

    frameId = requestAnimationFrame(checkFps);
    return () => cancelAnimationFrame(frameId);
  }, [viewState, tier]);

  // Handle Envelope Opening Start (Tap on Seal or Ribbon)
  const handleOpeningStart = () => {
    console.log('[App Debug] handleOpeningStart called');
    setIsOpening(true);
    soundEngine.unlock();
    soundEngine.play();
  };

  // Handle Envelope Opening Complete (GSAP timeline finish ~6s)
  const handleOpeningComplete = () => {
    console.log('[App Debug] handleOpeningComplete called');
    setViewState('invitation');
    if (!soundEngine.isMuted) {
      soundEngine.play();
    }
  };

  // Handle Skip (Always works, instant transition)
  const handleSkip = () => {
    console.log('[App Debug] handleSkip called');
    soundEngine.unlock();
    soundEngine.play();
    setViewState('invitation');
  };

  // Handle Reopen Envelope
  const handleReopen = () => {
    setIsOpening(false);
    setViewState('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#170E14] text-[#FDF8F5] overflow-x-hidden">
      <Analytics />

      {/* In-app Browser Notice Banner */}
      <InAppBrowserBanner />

      {/* Floating Music Control */}
      <MusicButton />

      {/* View States with Smooth Crossfade */}
      <AnimatePresence mode="wait">
        {viewState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
            className="relative w-full h-[100dvh] overflow-hidden bg-[#C88C9C]"
          >
            {/* 1. Full-Bleed 3D WebGL Canvas / Fallback (100dvh x 100vw) */}
            <div className="absolute inset-0 w-full h-full z-0">
              {tier <= 2 ? (
                <ErrorBoundary
                  onError={() => setTier(3)}
                  fallback={
                    <CSSEnvelope
                      isOpening={isOpening}
                      onOpeningStart={handleOpeningStart}
                      onOpeningComplete={handleOpeningComplete}
                    />
                  }
                >
                  <Suspense fallback={<LoadingInvitation />}>
                    <EnvelopeScene
                      isOpening={isOpening}
                      onOpeningStart={handleOpeningStart}
                      onOpeningComplete={handleOpeningComplete}
                    />
                  </Suspense>
                </ErrorBoundary>
              ) : (
                <CSSEnvelope
                  isOpening={isOpening}
                  onOpeningStart={handleOpeningStart}
                  onOpeningComplete={handleOpeningComplete}
                />
              )}
            </div>

            {/* 2. Top UI Header Overlaid over Canvas (pointer-events-none except interactive buttons) */}
            <header className="absolute top-0 left-0 right-0 pt-safe px-3 sm:px-4 z-30 select-none pointer-events-none">
              {/* Soft subtle gradient fade behind blessing text so it stays ultra-readable on paper */}
              <div className="absolute inset-0 h-44 bg-gradient-to-b from-[#24141E]/50 via-[#24141E]/20 to-transparent pointer-events-none" />

              <div className="relative w-full max-w-md mx-auto pt-1">
                {/* Row 1: Language toggle on left, Skip intro on right */}
                <div className="flex items-center justify-between py-1 pointer-events-auto">
                  <LanguageSelector isFixed={false} />

                  <button
                    type="button"
                    onClick={handleSkip}
                    className="px-2.5 py-1 rounded-full bg-[#24141E]/90 hover:bg-[#2F1A28] backdrop-blur-md border border-[#D8A85E]/40 text-[11px] sm:text-xs font-serif tracking-wider text-[#DFBE95] hover:text-[#FFEDBA] transition-all shadow-md active:scale-95 cursor-pointer pointer-events-auto"
                  >
                    {t('opening.skip')} →
                  </button>
                </div>

                {/* Row 2: Three blessing lines and ornamental divider */}
                <div className="mt-2.5 sm:mt-3 pointer-events-none">
                  <TopBlessingLines isOpening={isOpening} />
                </div>
              </div>
            </header>
          </motion.div>
        )}

        {/* VIEW STATE 2: SCROLLABLE LUXURY INVITATION */}
        {viewState === 'invitation' && (
          <motion.div
            key="invitation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
          >
            <LanguageSelector isFixed={true} />
            <ScrollableInvitation
              guestName={guestName}
              onReopen={handleReopen}
            />
          </motion.div>
        )}

        {/* VIEW STATE 3: PLAIN 2D BACKUP INVITATION */}
        {viewState === 'plain' && (
          <motion.div
            key="plain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4 } }}
          >
            <LanguageSelector isFixed={true} />
            <Plain2DInvitation
              guestName={guestName}
              onSwitchTo3D={() => {
                setViewState('intro');
                setIsOpening(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
