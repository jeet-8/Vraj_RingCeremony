import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { createEmbossedFloralNormalTexture, createWaxSealMonogramTexture } from '../../utils/proceduralTextures';
import soundEngine from '../../utils/proceduralAudio';

export default function EnvelopeMesh({ 
  isOpening, 
  onOpeningStart, 
  onOpeningComplete,
  tilt,
}) {
  const { camera, viewport } = useThree();

  // References
  const envelopeGroupRef = useRef();
  const topFlapRef = useRef();
  const bottomFlapRef = useRef();
  const leftFlapRef = useRef();
  const rightFlapRef = useRef();
  const cardRef = useRef();
  const ribbonRef = useRef();
  const sealIntactRef = useRef();
  const sealFragmentsGroupRef = useRef();
  const fragmentsRef = useRef([]);

  const hasStartedAnimationRef = useRef(false);
  const onOpeningCompleteRef = useRef(onOpeningComplete);
  onOpeningCompleteRef.current = onOpeningComplete;

  // Responsive scaling to fit mobile screen with ~16px side margins (Bug 3)
  // Envelope width is 3.4. On mobile portrait, scale so envelope width is ~85% of viewport width.
  const responsiveScale = useMemo(() => {
    const targetWidthRatio = viewport.width < 3.2 ? 0.85 : 0.88;
    return Math.min(1.0, (viewport.width * targetWidthRatio) / 3.4);
  }, [viewport.width]);

  // Textures
  const normalMap = useMemo(() => createEmbossedFloralNormalTexture(512), []);
  const sealMonogramTex = useMemo(() => createWaxSealMonogramTexture(512), []);

  // Paper Material (Blush-mauve with physical sheen and clearcoat)
  const paperMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D9AAB7'),
      roughness: 0.55,
      metalness: 0.05,
      sheen: 1.0,
      sheenRoughness: 0.35,
      sheenColor: new THREE.Color('#FFF1E6'),
      clearcoat: 0.25,
      clearcoatRoughness: 0.3,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
      side: THREE.DoubleSide,
    });
  }, [normalMap]);

  // Inside Lining Material
  const liningMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#C792A1'),
      roughness: 0.5,
      metalness: 0.08,
      sheen: 0.8,
      sheenColor: new THREE.Color('#FFE2B8'),
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.3, 0.3),
      side: THREE.DoubleSide,
    });
  }, [normalMap]);

  // Wax Material (Glossy wine/rose-gold)
  const waxMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#581829'),
      roughness: 0.2,
      metalness: 0.15,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9,
    });
  }, []);

  // Satin Champagne-Gold Ribbon Material (Bug 2: realistic satin luster)
  const ribbonMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#F0C87E'),
      emissive: new THREE.Color('#38240A'),
      roughness: 0.25,
      metalness: 0.3,
      sheen: 1.0,
      sheenRoughness: 0.2,
      sheenColor: new THREE.Color('#FFF6DB'),
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
    });
  }, []);

  // Card Material
  const cardMaterial = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    // Royal Ivory background
    ctx.fillStyle = '#FAF6F0';
    ctx.fillRect(0, 0, 700, 1000);

    // Ornate gold border
    ctx.strokeStyle = '#D8A85E';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, 640, 940);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 40, 620, 920);

    // Content
    ctx.fillStyle = '#D8A85E';
    ctx.textAlign = 'center';
    ctx.font = '32px serif';
    ctx.fillText('卐 Shree Ganeshay Namah 卐', 350, 120);

    ctx.font = 'italic 28px "Cormorant Garamond", serif';
    ctx.fillStyle = '#8E5164';
    ctx.fillText('Cordially invite you to celebrate the', 350, 200);

    ctx.font = 'bold 36px "Cinzel", serif';
    ctx.fillStyle = '#B38136';
    ctx.fillText('RING CEREMONY', 350, 260);

    ctx.font = 'italic 75px "Great Vibes", cursive';
    ctx.fillStyle = '#4A1224';
    ctx.fillText('Vraj & Jiya', 350, 380);

    ctx.font = '24px "Cinzel", serif';
    ctx.fillStyle = '#B38136';
    ctx.fillText('SUNDAY, 6 DECEMBER 2026', 350, 460);

    ctx.font = '22px "Cormorant Garamond", serif';
    ctx.fillStyle = '#5A2637';
    ctx.fillText('R.K. Royal Banquet & Party Lawn, Science City', 350, 520);

    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.6,
      metalness: 0.05,
    });
  }, []);

  // Flap Geometries with generous overlap so NO gaps exist when closed!
  // Envelope body dimensions: width = 3.4, height = 2.2
  const flapGeometries = useMemo(() => {
    // Top Flap (Hinged at top y = 1.1, folds down reaching y = -0.4)
    const topShape = new THREE.Shape();
    topShape.moveTo(-1.7, 0);
    topShape.lineTo(1.7, 0);
    topShape.lineTo(0, -1.5);
    topShape.closePath();

    // Bottom Flap (Hinged at bottom y = -1.1, folds up reaching y = +0.35)
    const bottomShape = new THREE.Shape();
    bottomShape.moveTo(-1.7, 0);
    bottomShape.lineTo(1.7, 0);
    bottomShape.lineTo(0, 1.45);
    bottomShape.closePath();

    // Left Flap (Hinged at left x = -1.7, folds right reaching x = +0.25)
    const leftShape = new THREE.Shape();
    leftShape.moveTo(0, -1.1);
    leftShape.lineTo(0, 1.1);
    leftShape.lineTo(1.95, 0);
    leftShape.closePath();

    // Right Flap (Hinged at right x = 1.7, folds left reaching x = -0.25)
    const rightShape = new THREE.Shape();
    rightShape.moveTo(0, -1.1);
    rightShape.lineTo(0, 1.1);
    rightShape.lineTo(-1.95, 0);
    rightShape.closePath();

    return {
      top: new THREE.ShapeGeometry(topShape),
      bottom: new THREE.ShapeGeometry(bottomShape),
      left: new THREE.ShapeGeometry(leftShape),
      right: new THREE.ShapeGeometry(rightShape),
    };
  }, []);

  // Wax Fragments data (8 radial fragments)
  const fragmentsData = useMemo(() => {
    const frags = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count;
      frags.push({
        id: i,
        angle,
        initialX: Math.cos(angle) * 0.12,
        initialY: Math.sin(angle) * 0.12,
        initialRotZ: angle,
      });
    }
    return frags;
  }, []);

  // Trigger Open handler with temporary debug logging (Bug 2)
  const handleTriggerOpen = (source = 'unknown', e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    console.log(`[Envelope Debug] Interaction detected from: ${source}`);

    if (isOpening || hasStartedAnimationRef.current) {
      console.log('[Envelope Debug] Envelope already opening, ignoring trigger');
      return;
    }

    console.log('[Envelope Debug] Triggering envelope open animation');
    soundEngine.unlock();
    if (onOpeningStart) onOpeningStart();
  };

  // Idle floating and parallax tilt animation
  useFrame((state) => {
    if (!envelopeGroupRef.current) return;

    if (!isOpening && !hasStartedAnimationRef.current) {
      const time = state.clock.getElapsedTime();
      const floatY = Math.sin(time * 1.5) * 0.04;

      // Parallax tilt (smoothed, max 8 deg)
      const targetRotX = (tilt?.x || 0) * 0.14;
      const targetRotY = (tilt?.y || 0) * 0.14;

      envelopeGroupRef.current.position.y = THREE.MathUtils.lerp(
        envelopeGroupRef.current.position.y,
        0.1 + floatY,
        0.08
      );
      envelopeGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        envelopeGroupRef.current.rotation.x,
        targetRotX,
        0.08
      );
      envelopeGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        envelopeGroupRef.current.rotation.y,
        targetRotY,
        0.08
      );
    }
  });

  // GSAP 6-Second Orchestrated Opening Timeline with try/catch and fallback (Bug 2)
  useEffect(() => {
    if (!isOpening || hasStartedAnimationRef.current) return;
    hasStartedAnimationRef.current = true;
    console.log('[Envelope Debug] GSAP opening timeline starting...');

    let tl;
    let fallbackTimer;

    try {
      tl = gsap.timeline({
        onComplete: () => {
          console.log('[Envelope Debug] GSAP opening timeline completed successfully.');
          clearTimeout(fallbackTimer);
          if (onOpeningCompleteRef.current) onOpeningCompleteRef.current();
        },
      });

      // 0.0s: Satin Ribbon untwists and slides off first
      if (ribbonRef.current) {
        tl.to(
          ribbonRef.current.rotation,
          {
            z: 0.35,
            duration: 0.6,
            ease: 'power2.inOut',
          },
          0.0
        );
        tl.to(
          ribbonRef.current.position,
          {
            x: 5.0,
            duration: 0.8,
            ease: 'power2.in',
          },
          0.2
        );
      }

      // 0.8s: Wax seal pulses with gold spark, then shatters
      if (sealIntactRef.current) {
        tl.to(
          sealIntactRef.current.scale,
          {
            x: 1.25,
            y: 1.25,
            z: 1.25,
            duration: 0.3,
            ease: 'back.out(2)',
          },
          0.7
        )
        .set(sealIntactRef.current, { visible: false }, 1.0)
        .set(sealFragmentsGroupRef.current, { visible: true }, 1.0);
      }

      // 1.0s: Shatter 8 fragments radially away
      fragmentsRef.current.forEach((frag, idx) => {
        if (!frag) return;
        const angle = (idx * 2 * Math.PI) / 8;
        const distance = 1.3 + Math.random() * 0.5;
        tl.to(
          frag.position,
          {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance - 1.2,
            z: 0.8 + Math.random() * 0.5,
            duration: 1.0,
            ease: 'power2.out',
          },
          1.0
        );
        tl.to(
          frag.rotation,
          {
            x: Math.random() * 8,
            y: Math.random() * 8,
            z: Math.random() * 8,
            duration: 1.0,
            ease: 'power2.out',
          },
          1.0
        );
        tl.to(
          frag.scale,
          {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: 'power1.in',
          },
          1.5
        );
      });

      // 1.6s: Bottom and side flaps fold open in sequence (stagger 0.15s)
      if (bottomFlapRef.current) {
        tl.to(
          bottomFlapRef.current.rotation,
          {
            x: -Math.PI * 0.98,
            duration: 0.85,
            ease: 'power2.inOut',
          },
          1.6
        );
      }
      if (leftFlapRef.current) {
        tl.to(
          leftFlapRef.current.rotation,
          {
            y: -Math.PI * 0.95,
            duration: 0.85,
            ease: 'power2.inOut',
          },
          1.75
        );
      }
      if (rightFlapRef.current) {
        tl.to(
          rightFlapRef.current.rotation,
          {
            y: Math.PI * 0.95,
            duration: 0.85,
            ease: 'power2.inOut',
          },
          1.9
        );
      }

      // 2.6s: Top flap opens about 160 degrees with slight overshoot
      if (topFlapRef.current) {
        tl.to(
          topFlapRef.current.rotation,
          {
            x: Math.PI * 0.92,
            duration: 0.95,
            ease: 'back.out(1.4)',
          },
          2.6
        );
      }

      // 3.2s: Card slides up out of envelope, camera dollies in
      if (cardRef.current) {
        tl.to(
          cardRef.current.position,
          {
            y: 2.1,
            z: 0.1,
            duration: 1.4,
            ease: 'power3.out',
          },
          3.2
        );
        tl.to(
          camera.position,
          {
            z: 3.2,
            y: 0.4,
            duration: 1.6,
            ease: 'power2.inOut',
          },
          3.2
        );
      }

      // 4.5s: Card scales to fill screen, soft bloom transition
      if (envelopeGroupRef.current) {
        tl.to(
          envelopeGroupRef.current.position,
          {
            y: -0.4,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          4.5
        );
        tl.to(
          envelopeGroupRef.current.scale,
          {
            x: responsiveScale * 1.35,
            y: responsiveScale * 1.35,
            z: responsiveScale * 1.35,
            duration: 0.9,
            ease: 'power2.inOut',
          },
          4.5
        );
      }

      // Safety timeout: if timeline stalls, automatically fall back to crossfade open (Bug 2)
      fallbackTimer = setTimeout(() => {
        console.warn('[Envelope Debug] Fallback timer triggered, forcing completion');
        if (onOpeningCompleteRef.current) onOpeningCompleteRef.current();
      }, 5500);

    } catch (err) {
      console.error('[Envelope Debug] GSAP animation error, falling back to crossfade:', err);
      if (onOpeningCompleteRef.current) onOpeningCompleteRef.current();
    }

    return () => {
      if (tl) tl.kill();
      clearTimeout(fallbackTimer);
    };
  }, [isOpening]);

  return (
    <group
      ref={envelopeGroupRef}
      scale={[responsiveScale, responsiveScale, responsiveScale]}
      position={[0, 0.1, 0]}
    >
      {/* Generous Invisible Hit Area (160px / 1.8 unit circle around seal) (Bug 2) */}
      <mesh
        position={[0, 0, 0.05]}
        onPointerDown={(e) => handleTriggerOpen('invisible-hit-area', e)}
        onClick={(e) => handleTriggerOpen('invisible-hit-area', e)}
      >
        <circleGeometry args={[0.9, 32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 1. Envelope Back Plate */}
      <mesh
        position={[0, 0, -0.015]}
        material={paperMaterial}
        onPointerDown={(e) => handleTriggerOpen('envelope-backplate', e)}
        onClick={(e) => handleTriggerOpen('envelope-backplate', e)}
      >
        <planeGeometry args={[3.4, 2.2]} />
      </mesh>

      {/* Inside pocket lining */}
      <mesh position={[0, 0, -0.01]} material={liningMaterial}>
        <planeGeometry args={[3.38, 2.18]} />
      </mesh>

      {/* 2. Inside Invitation Card */}
      <mesh ref={cardRef} position={[0, -0.05, 0.005]} material={cardMaterial}>
        <planeGeometry args={[3.1, 2.1]} />
      </mesh>

      {/* 3. Bottom Flap (Hinged at bottom edge: y = -1.1) */}
      <group ref={bottomFlapRef} position={[0, -1.1, 0.015]}>
        <mesh
          geometry={flapGeometries.bottom}
          material={paperMaterial}
          onPointerDown={(e) => handleTriggerOpen('bottom-flap', e)}
          onClick={(e) => handleTriggerOpen('bottom-flap', e)}
        />
      </group>

      {/* 4. Left Flap (Hinged at left edge: x = -1.7) */}
      <group ref={leftFlapRef} position={[-1.7, 0, 0.018]}>
        <mesh
          geometry={flapGeometries.left}
          material={paperMaterial}
          onPointerDown={(e) => handleTriggerOpen('left-flap', e)}
          onClick={(e) => handleTriggerOpen('left-flap', e)}
        />
      </group>

      {/* 5. Right Flap (Hinged at right edge: x = 1.7) */}
      <group ref={rightFlapRef} position={[1.7, 0, 0.02]}>
        <mesh
          geometry={flapGeometries.right}
          material={paperMaterial}
          onPointerDown={(e) => handleTriggerOpen('right-flap', e)}
          onClick={(e) => handleTriggerOpen('right-flap', e)}
        />
      </group>

      {/* 6. Top Flap (Hinged at top edge: y = 1.1) */}
      <group ref={topFlapRef} position={[0, 1.1, 0.024]}>
        <mesh
          geometry={flapGeometries.top}
          material={paperMaterial}
          onPointerDown={(e) => handleTriggerOpen('top-flap', e)}
          onClick={(e) => handleTriggerOpen('top-flap', e)}
        />
      </group>

      {/* 7. Gold Satin Ribbon (Untwists and slides off) (Bug 2) */}
      <group ref={ribbonRef} position={[0, 0, 0.03]}>
        <mesh
          material={ribbonMaterial}
          onPointerDown={(e) => handleTriggerOpen('ribbon', e)}
          onClick={(e) => handleTriggerOpen('ribbon', e)}
        >
          <boxGeometry args={[3.44, 0.38, 0.015]} />
        </mesh>
      </group>

      {/* 8. Wax Seal (Lathe cylinder with embossed monogram) */}
      <group position={[0, 0, 0.038]}>
        {/* Intact Seal */}
        <group
          ref={sealIntactRef}
          onPointerDown={(e) => handleTriggerOpen('seal', e)}
          onClick={(e) => handleTriggerOpen('seal', e)}
        >
          {/* Outer beveled wax rim */}
          <mesh material={waxMaterial}>
            <cylinderGeometry args={[0.38, 0.42, 0.045, 32]} />
          </mesh>

          {/* Embossed Monogram Face */}
          <mesh position={[0, 0, 0.026]}>
            <circleGeometry args={[0.35, 32]} />
            <meshStandardMaterial
              map={sealMonogramTex}
              roughness={0.25}
              metalness={0.2}
            />
          </mesh>
        </group>

        {/* Shattered Wax Fragments (initially hidden) */}
        <group ref={sealFragmentsGroupRef} visible={false}>
          {fragmentsData.map((frag, idx) => (
            <mesh
              key={frag.id}
              ref={(el) => (fragmentsRef.current[idx] = el)}
              position={[frag.initialX, frag.initialY, 0.01]}
              rotation={[0, 0, frag.initialRotZ]}
              material={waxMaterial}
            >
              <coneGeometry args={[0.18, 0.05, 5]} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
