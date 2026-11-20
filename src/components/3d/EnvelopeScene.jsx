import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTranslation } from 'react-i18next';
import EnvelopeMesh from './EnvelopeMesh';
import soundEngine from '../../utils/proceduralAudio';

// Sweeping Specular Sheen Light
function SweepingSheenLight({ isOpening }) {
  const lightRef = useRef();

  useFrame(({ clock }) => {
    if (lightRef.current && !isOpening) {
      const t = clock.getElapsedTime() * 0.8;
      lightRef.current.position.x = Math.sin(t) * 4.0;
      lightRef.current.position.y = Math.cos(t * 0.7) * 2.5;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 3.5]}
      intensity={0.65}
      distance={8}
      color="#FFE8C2"
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

  // Pointer Parallax Tilt (Desktop)
  const handlePointerMove = (e) => {
    if (isOpening) return;
    const { innerWidth, innerHeight } = window;
    const x = ((e.clientY / innerHeight) - 0.5) * 2;
    const y = ((e.clientX / innerWidth) - 0.5) * 2;
    setTilt({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
  };

  // Device Orientation Tilt (Mobile)
  useEffect(() => {
    const handleOrientation = (e) => {
      if (isOpening || !e.beta || !e.gamma) return;
      const x = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      const y = Math.max(-1, Math.min(1, e.gamma / 30));
      setTilt({ x, y });
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [isOpening]);

  // Request iOS Gyroscope Permission on First Tap
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

  const handleInteractionStart = (source = 'canvas-overlay') => {
    console.log(`[Scene Debug] Interaction detected from: ${source}`);
    requestGyroPermission();
    soundEngine.unlock();
    if (!isOpening && onOpeningStart) {
      onOpeningStart();
    }
  };

  return (
    <div
      onClick={(e) => {
        handleInteractionStart('container-click');
      }}
      className="relative w-full h-full overflow-hidden flex items-center justify-center select-none cursor-pointer"
      onPointerMove={handlePointerMove}
    >
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        className="w-full h-full cursor-pointer pointer-events-auto"
      >
        {/* Cinematic Royal Lighting */}
        <ambientLight intensity={0.7} color="#FFF2E6" />
        <directionalLight position={[3, 4, 5]} intensity={1.2} color="#FFF0D0" />
        <directionalLight position={[-4, -2, 3]} intensity={0.8} color="#E8B4B8" />
        <pointLight position={[0, -2, 2.5]} intensity={0.4} color="#D8A85E" />
        <SweepingSheenLight isOpening={isOpening} />

        {/* 3D Envelope Mesh */}
        <EnvelopeMesh
          isOpening={isOpening}
          onOpeningStart={() => handleInteractionStart('mesh-start')}
          onOpeningComplete={onOpeningComplete}
          tilt={tilt}
        />
      </Canvas>

      {/* Tap Seal Prompt Hint Button (Bug 2: Triggers open animation reliably) */}
      {!isOpening && (
        <div
          className="absolute bottom-12 sm:bottom-16 left-0 right-0 flex flex-col items-center justify-center pointer-events-auto z-20 px-4"
        >
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
          <span className="text-[10px] sm:text-[11px] tracking-widest text-[#E8B4B8]/75 mt-1.5 font-serif uppercase pointer-events-none">
            Touch anywhere or tap the seal
          </span>
        </div>
      )}
    </div>
  );
}
