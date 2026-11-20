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
  onSkip,
}) {
  const { t } = useTranslation();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [gyroPermitted, setGyroPermitted] = useState(false);

  // Pointer Parallax Tilt (Desktop)
  const handlePointerMove = (e) => {
    if (isOpening) return;
    const { innerWidth, innerHeight } = window;
    // Map to [-1, 1]
    const x = ((e.clientY / innerHeight) - 0.5) * 2;
    const y = ((e.clientX / innerWidth) - 0.5) * 2;
    setTilt({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
  };

  // Device Orientation Tilt (Mobile)
  useEffect(() => {
    const handleOrientation = (e) => {
      if (isOpening || !e.beta || !e.gamma) return;
      // beta is pitch in degrees [-180, 180], gamma is roll in degrees [-90, 90]
      // Assume phone held at ~45 deg pitch
      const x = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      const y = Math.max(-1, Math.min(1, e.gamma / 30));
      setTilt({ x, y });
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [isOpening]);

  // Request iOS Gyroscope Permission on First Tap
  const requestGyroPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          setGyroPermitted(true);
        }
      } catch (err) {
        console.warn('Device orientation permission declined or unavailable:', err);
      }
    }
  };

  const handleInteractionStart = () => {
    requestGyroPermission();
    soundEngine.unlock();
    if (!isOpening && onOpeningStart) {
      onOpeningStart();
    }
  };

  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden flex items-center justify-center select-none"
      onPointerMove={handlePointerMove}
      onClick={requestGyroPermission}
    >
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        className="w-full h-full"
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
          onOpeningStart={handleInteractionStart}
          onOpeningComplete={onOpeningComplete}
          tilt={tilt}
        />
      </Canvas>

      {/* Tap Seal Prompt Hint */}
      {!isOpening && (
        <div
          onClick={handleInteractionStart}
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
            Touch anywhere or tap the seal
          </span>
        </div>
      )}

      {/* Skip Button (Top Right) */}
      <button
        onClick={onSkip}
        className="absolute top-4 right-4 z-40 px-3 py-1.5 rounded-full bg-[#24141E]/70 hover:bg-[#24141E] backdrop-blur-md border border-[#D8A85E]/30 text-xs font-serif tracking-widest text-[#DFBE95] hover:text-[#FFEDBA] transition-all shadow-md active:scale-95"
      >
        {t('opening.skip')} →
      </button>
    </div>
  );
}
