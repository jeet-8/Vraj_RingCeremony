import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTranslation } from 'react-i18next';
import EnvelopeMesh from './EnvelopeMesh';
import soundEngine from '../../utils/proceduralAudio';

// Sweeping Specular Sheen Light (linear sweep across envelope paper, NOT orbiting in a circle around the seal)
function SweepingSheenLight({ isOpening }) {
  const lightRef = useRef();

  useFrame(({ clock }) => {
    if (lightRef.current && !isOpening) {
      const t = clock.getElapsedTime() * 0.45;
      lightRef.current.position.x = Math.sin(t) * 4.2;
      lightRef.current.position.y = 1.8;
      lightRef.current.position.z = 3.2;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 1.8, 3.2]}
      intensity={0.6}
      distance={8.0}
      color="#FFF4DC"
    />
  );
}

export default function EnvelopeScene({
  isOpening,
  onOpeningStart,
  onOpeningComplete,
}) {
  const { t } = useTranslation();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [showFlash, setShowFlash] = useState(false);

  // Soft light flash trigger before transition
  useEffect(() => {
    if (!isOpening) return;
    const flashTimer = setTimeout(() => {
      setShowFlash(true);
    }, 5600);

    return () => clearTimeout(flashTimer);
  }, [isOpening]);

  // Pointer Parallax Tilt (Desktop)
  const handlePointerMove = (e) => {
    if (isOpening) return;
    const { innerWidth, innerHeight } = window;
    const x = ((e.clientY / innerHeight) - 0.5) * 2;
    const y = ((e.clientX / innerWidth) - 0.5) * 2;
    setTilt({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
  };

  // Device Orientation Tilt (Mobile - max 8 degrees)
  useEffect(() => {
    const handleOrientation = (e) => {
      if (isOpening || !e.beta || !e.gamma) return;
      const x = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
      const y = Math.max(-1, Math.min(1, e.gamma / 25));
      setTilt({ x, y });
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [isOpening]);

  const requestGyroPermission = () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        DeviceOrientationEvent.requestPermission().catch(() => {});
      } catch (err) {}
    }
  };

  const handleInteractionStart = (source = 'canvas-click') => {
    console.log(`[Scene Debug] Interaction detected from: ${source}`);
    requestGyroPermission();
    soundEngine.unlock();
    if (!isOpening && onOpeningStart) {
      onOpeningStart();
    }
  };

  return (
    <div
      onClick={() => handleInteractionStart('container-click')}
      className="relative w-full h-full overflow-hidden flex items-center justify-center select-none cursor-pointer bg-[#C88C9C]"
      onPointerMove={handlePointerMove}
    >
      {/* 3D WebGL Canvas: Full Bleed 100vw x 100dvh */}
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 3)]}
        className="w-full h-full cursor-pointer pointer-events-auto"
      >
        {/* Paper-matched clear color */}
        <color attach="background" args={['#C88C9C']} />

        {/* Ambient warmth */}
        <ambientLight intensity={0.65} color="#FFF2E8" />

        {/* Key Light from top-left (creates crisp leaf relief shadows) */}
        <directionalLight
          position={[-3.5, 4.2, 4.5]}
          intensity={1.35}
          color="#FFF5E0"
        />

        {/* Rim Light from opposite bottom-right */}
        <directionalLight
          position={[3.8, -3.2, 3.2]}
          intensity={0.85}
          color="#E6B4BE"
        />

        {/* Fill Light for subtle contrast softening */}
        <pointLight position={[0, -1.5, 2.5]} intensity={0.4} color="#D8A85E" />

        {/* Slow sweeping specular sheen light */}
        <SweepingSheenLight isOpening={isOpening} />

        {/* Full-Bleed 3D Envelope */}
        <EnvelopeMesh
          isOpening={isOpening}
          onOpeningStart={() => handleInteractionStart('mesh-start')}
          onOpeningComplete={onOpeningComplete}
          tilt={tilt}
        />
      </Canvas>

      {/* Bottom: "Tap the seal to open" prompt hint button */}
      {!isOpening && (
        <div className="absolute bottom-12 sm:bottom-16 left-0 right-0 flex flex-col items-center justify-center pointer-events-auto z-20 px-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleInteractionStart('hint-button');
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#24141E]/90 hover:bg-[#2F1A28] backdrop-blur-md border border-[#D8A85E]/50 animate-seal-pulse shadow-wax-seal text-[#FFEDBA] active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-[#D8A85E] text-sm">✦</span>
            <span className="font-serif text-xs sm:text-sm tracking-[0.14em] font-medium uppercase whitespace-nowrap">
              {t('opening.tapSeal')}
            </span>
            <span className="text-[#D8A85E] text-sm">✦</span>
          </button>
          <span className="text-[10px] sm:text-[11px] tracking-widest text-[#FFDFE7]/90 mt-1.5 font-serif uppercase pointer-events-none drop-shadow">
            Touch anywhere or tap the seal
          </span>
        </div>
      )}

      {/* Soft light flash overlay right before transition at ~5.8s - 6.0s */}
      <div
        className={`absolute inset-0 bg-white/70 pointer-events-none transition-opacity duration-300 z-50 ${
          showFlash ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
