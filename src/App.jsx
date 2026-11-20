import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
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
    <div className="w-full h-[100dvh] flex flex-col items-center justify-center bg-[#170E14] text-center px-4">
      <div className="w-16 h-16 rounded-full border-2 border-t-[#D8A85E] border-r-transparent border-b-[#D8A85E]/30 border-l-transparent animate-spin mb-4" />
      <p className="font-serif italic text-sm tracking-widest text-[#FFEDBA]">
        {t('opening.preparing')}
      </p>
    </div>
  );
}

export default function App() {
  const [viewState, setViewState] = useState('intro'); // 'intro' | 'invitation' | 'plain'
  const [isOpening, setIsOpening] = useState(false);
  const [tier, setTier] = useState(1); // 1 = full 3D, 2 = lite 3D, 3 = CSS envelope
  const [guestName, setGuestName] = useState(null);

  // Check URL params on mount
  useEffect(() => {
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

  // Performance watchdog: If FPS < 30 for 2s during intro, drop tier
  const lowFpsCountRef = useRef(0);
  useEffect(() => {
    if (viewState !== 'intro' || tier === 3) return;

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

  // Handle Envelope Opening Start (Tap on Seal)
  const handleOpeningStart = () => {
    setIsOpening(true);
    soundEngine.unlock();
  };

  // Handle Envelope Opening Complete (GSAP timeline finish ~6s)
  const handleOpeningComplete = () => {
    setViewState('invitation');
    soundEngine.play();
  };

  // Handle Skip
  const handleSkip = () => {
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
      {/* In-app Browser Notice Banner */}
      <InAppBrowserBanner />

      {/* Global Language Toggle */}
      <LanguageSelector />

      {/* Floating Music Control */}
      <MusicButton />

      {/* VIEW STATE 1: INTRO (3D or CSS Envelope with Top Blessing Lines) */}
      {viewState === 'intro' && (
        <div className="relative w-full h-[100dvh]">
          {/* Top 3 Blessing Lines (fades out when opening starts) */}
          <TopBlessingLines isOpening={isOpening} />

          {/* 3D Envelope with ErrorBoundary auto-falling back to Tier 3 */}
          {tier <= 2 ? (
            <ErrorBoundary
              onError={() => setTier(3)}
              fallback={
                <CSSEnvelope
                  isOpening={isOpening}
                  onOpeningStart={handleOpeningStart}
                  onOpeningComplete={handleOpeningComplete}
                  onSkip={handleSkip}
                />
              }
            >
              <Suspense fallback={<LoadingInvitation />}>
                <EnvelopeScene
                  isOpening={isOpening}
                  onOpeningStart={handleOpeningStart}
                  onOpeningComplete={handleOpeningComplete}
                  onSkip={handleSkip}
                />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <CSSEnvelope
              isOpening={isOpening}
              onOpeningStart={handleOpeningStart}
              onOpeningComplete={handleOpeningComplete}
              onSkip={handleSkip}
            />
          )}
        </div>
      )}

      {/* VIEW STATE 2: SCROLLABLE LUXURY INVITATION */}
      {viewState === 'invitation' && (
        <ScrollableInvitation
          guestName={guestName}
          onReopen={handleReopen}
          onSwitchToSimple={() => setViewState('plain')}
        />
      )}

      {/* VIEW STATE 3: PLAIN 2D BACKUP INVITATION */}
      {viewState === 'plain' && (
        <Plain2DInvitation
          guestName={guestName}
          onSwitchTo3D={() => {
            setViewState('intro');
            setIsOpening(false);
          }}
        />
      )}
    </div>
  );
}
