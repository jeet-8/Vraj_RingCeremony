import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import {
  createEmbossedLeafNormalTexture,
  createSilkLiningNormalTexture,
  createWaxSealMonogramTexture,
} from '../../utils/proceduralTextures';
import soundEngine from '../../utils/proceduralAudio';

export default function EnvelopeMesh({
  isOpening,
  onOpeningStart,
  onOpeningComplete,
  tilt,
}) {
  const { camera, viewport } = useThree();

  // Root references
  const envelopeGroupRef = useRef();
  const topFlapRef = useRef();
  const lowerPocketRef = useRef();
  const cardGroupRef = useRef();
  const cardMeshRef = useRef();
  const ribbonBandRef = useRef();
  const bowRef = useRef();
  const leftTailRef = useRef();
  const rightTailRef = useRef();
  const sealGroupRef = useRef();
  const sealPulseRef = useRef();
  const glowRingRef = useRef();

  const hasStartedAnimationRef = useRef(false);
  const onOpeningCompleteRef = useRef(onOpeningComplete);
  onOpeningCompleteRef.current = onOpeningComplete;

  // Viewport dimensions for full-bleed envelope (100vw x 100dvh)
  const envW = viewport.width;
  const envH = viewport.height;

  // Procedural Textures
  const leafNormalMap = useMemo(() => createEmbossedLeafNormalTexture(1024), []);
  const silkNormalMap = useMemo(() => createSilkLiningNormalTexture(512), []);
  const sealMonogramTex = useMemo(() => createWaxSealMonogramTexture(1024), []);

  // 1. Embossed Mauve-Pink Paper Material
  const paperMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#C88C9C'), // Satin dusty mauve-pink
      roughness: 0.48,
      metalness: 0.05,
      sheen: 1.0,
      sheenRoughness: 0.38,
      sheenColor: new THREE.Color('#FFF0F4'),
      clearcoat: 0.22,
      clearcoatRoughness: 0.30,
      normalMap: leafNormalMap,
      normalScale: new THREE.Vector2(0.8, 0.8),
      side: THREE.DoubleSide,
    });
  }, [leafNormalMap]);

  // 2. Shiny Champagne-Pink Satin Silk Lining Material
  const liningMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E6B8C4'),
      roughness: 0.32,
      metalness: 0.12,
      sheen: 1.0,
      sheenRoughness: 0.22,
      sheenColor: new THREE.Color('#FFF5EB'),
      clearcoat: 0.50,
      clearcoatRoughness: 0.18,
      normalMap: silkNormalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
      side: THREE.DoubleSide,
    });
  }, [silkNormalMap]);

  // 3. Glossy Rose-Gold / Wine Wax Material
  const waxMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#581426'),
      roughness: 0.18,
      metalness: 0.20,
      clearcoat: 0.90,
      clearcoatRoughness: 0.12,
      reflectivity: 0.95,
    });
  }, []);

  // 4. Satin Champagne Gold Ribbon & Bow Material
  const ribbonMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E8BA6B'),
      emissive: new THREE.Color('#38220A'),
      roughness: 0.22,
      metalness: 0.35,
      sheen: 1.0,
      sheenRoughness: 0.20,
      sheenColor: new THREE.Color('#FFF6DB'),
      clearcoat: 0.40,
      clearcoatRoughness: 0.20,
      side: THREE.DoubleSide,
    });
  }, []);

  // 5. High-Resolution Opaque Royal Ivory Card Material
  const cardMaterial = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 2000;
    const ctx = canvas.getContext('2d');

    // Royal Ivory background (100% opaque)
    ctx.fillStyle = '#FAF6F0';
    ctx.fillRect(0, 0, 1400, 2000);

    // Subtle paper border shading
    ctx.fillStyle = '#F5ECE1';
    ctx.fillRect(30, 30, 1340, 1940);
    ctx.fillStyle = '#FAF6F0';
    ctx.fillRect(40, 40, 1320, 1920);

    // Ornate gold foil dual borders
    ctx.strokeStyle = '#D8A85E';
    ctx.lineWidth = 8;
    ctx.strokeRect(60, 60, 1280, 1880);

    ctx.lineWidth = 2.5;
    ctx.strokeRect(80, 80, 1240, 1840);

    // Corner filigree ornaments
    const drawCorner = (x, y, flipX, flipY) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(flipX, flipY);
      ctx.strokeStyle = '#D8A85E';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(50, 0);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 50);
      ctx.stroke();
      ctx.restore();
    };
    drawCorner(100, 100, 1, 1);
    drawCorner(1300, 100, -1, 1);
    drawCorner(100, 1900, 1, -1);
    drawCorner(1300, 1900, -1, -1);

    // Sacred Ganesh motif
    ctx.fillStyle = '#B38136';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '64px serif';
    ctx.fillText('卐', 700, 190);

    // Top blessing lines
    ctx.font = '500 32px "Cormorant Garamond", serif';
    ctx.fillStyle = '#B38136';
    ctx.fillText('Shree Ganeshay Namah  •  Shree Khimaj Mata Namah  •  Shree Kheteshwaray Namah', 700, 280);

    ctx.font = 'italic 42px "Cormorant Garamond", serif';
    ctx.fillStyle = '#8E5164';
    ctx.fillText('Cordially invite you to celebrate the', 700, 400);

    ctx.font = 'bold 56px "Cinzel", serif';
    ctx.fillStyle = '#B38136';
    ctx.fillText('RING CEREMONY', 700, 500);

    ctx.font = 'italic 135px "Great Vibes", cursive';
    ctx.fillStyle = '#4A1224';
    ctx.fillText('Vraj & Jiya', 700, 720);

    ctx.font = '28px "Cinzel", serif';
    ctx.fillStyle = '#8E5164';
    ctx.fillText('WITH BLESSINGS FROM ELDERS & FAMILIES', 700, 880);

    ctx.font = 'bold 36px "Cormorant Garamond", serif';
    ctx.fillStyle = '#4A1224';
    ctx.fillText('Rekha Kanwer & Prakashsinghji', 700, 950);
    ctx.font = 'italic 30px "Cormorant Garamond", serif';
    ctx.fillStyle = '#D8A85E';
    ctx.fillText('&', 700, 995);
    ctx.font = 'bold 36px "Cormorant Garamond", serif';
    ctx.fillStyle = '#4A1224';
    ctx.fillText('Seema Kanwer & Parvatsinghji', 700, 1040);

    // Thin separator
    ctx.strokeStyle = '#D8A85E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 1120);
    ctx.lineTo(1050, 1120);
    ctx.stroke();

    ctx.font = 'bold 44px "Cinzel", serif';
    ctx.fillStyle = '#B38136';
    ctx.fillText('SUNDAY, 6 DECEMBER 2026', 700, 1200);

    ctx.font = '36px "Cormorant Garamond", serif';
    ctx.fillStyle = '#5A2637';
    ctx.fillText('4:00 PM Arrival & Welcome', 700, 1270);

    ctx.font = '36px "Cormorant Garamond", serif';
    ctx.fillStyle = '#5A2637';
    ctx.fillText('R.K. Royal Banquet & Party Lawn, Science City', 700, 1340);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.50,
      metalness: 0.05,
      transparent: false,
      depthWrite: true,
      side: THREE.FrontSide,
    });
  }, []);

  // 6. Wax Seal Radius
  const sealR = useMemo(() => Math.min(envW * 0.16, 0.36), [envW]);

  // 7. Flap Geometries: Flaps meet seamlessly to completely enclose card & bow!
  const flapGeometries = useMemo(() => {
    const w = envW * 1.08;
    const h = envH * 1.08;

    // Top V-Flap: Hinged at top (y = 0 in local space, world y = envH / 2).
    // Apex points down to 38% screen height: apexY = -h * 0.38 (world y = envH * 0.12).
    const topShape = new THREE.Shape();
    topShape.moveTo(-w / 2, 0);
    topShape.lineTo(w / 2, 0);
    topShape.lineTo(0, -h * 0.38);
    topShape.closePath();

    // Lower Front Pocket: Hinged at bottom (y = 0 in local space, world y = -envH / 2).
    // Covers the full width across the lower screen up to local y = h * 0.65 (world y = +envH * 0.15).
    const lowerShape = new THREE.Shape();
    lowerShape.moveTo(-w / 2, 0);
    lowerShape.lineTo(w / 2, 0);
    lowerShape.lineTo(w / 2, h * 0.65);
    lowerShape.lineTo(0, h * 0.58);
    lowerShape.lineTo(-w / 2, h * 0.65);
    lowerShape.closePath();

    return {
      top: new THREE.ShapeGeometry(topShape),
      lower: new THREE.ShapeGeometry(lowerShape),
      apexY: -h * 0.38,
      w,
      h,
    };
  }, [envW, envH]);

  // Card dimensions (tucked inside the pocket)
  const cardWidth = useMemo(() => envW * 0.86, [envW]);
  const cardHeight = useMemo(() => envH * 0.68, [envH]);

  // Trigger Open handler with haptic feedback
  const handleTriggerOpen = (source = 'canvas-click', e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    console.log(`[Envelope Debug] Interaction detected from: ${source}`);

    if (isOpening || hasStartedAnimationRef.current) return;

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (err) {}
    }

    soundEngine.unlock();
    if (onOpeningStart) onOpeningStart();
  };

  // Idle animations: breathing pulse of wax seal + parallax tilt (max 8 deg)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (!isOpening && !hasStartedAnimationRef.current) {
      if (sealPulseRef.current) {
        const pulse = 1.0 + Math.sin(time * 2.2) * 0.02;
        sealPulseRef.current.scale.set(pulse, pulse, pulse);
      }
      if (glowRingRef.current) {
        glowRingRef.current.material.opacity = 0.25 + Math.sin(time * 2.2) * 0.15;
      }

      // Parallax tilt (smoothed, max 8 deg ~ 0.14 rad)
      if (envelopeGroupRef.current) {
        const targetRotX = (tilt?.x || 0) * 0.12;
        const targetRotY = (tilt?.y || 0) * 0.12;

        envelopeGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          envelopeGroupRef.current.rotation.x,
          targetRotX,
          0.06
        );
        envelopeGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          envelopeGroupRef.current.rotation.y,
          targetRotY,
          0.06
        );
      }
    }
  });

  // 7-Second GSAP Timeline (ease power2.inOut)
  useEffect(() => {
    if (!isOpening || hasStartedAnimationRef.current) return;
    hasStartedAnimationRef.current = true;
    console.log('[Envelope Debug] Starting 7-second GSAP opening sequence...');

    let tl;
    let fallbackTimer;

    try {
      tl = gsap.timeline({
        onComplete: () => {
          console.log('[Envelope Debug] 7-second opening timeline finished.');
          clearTimeout(fallbackTimer);
          if (onOpeningCompleteRef.current) onOpeningCompleteRef.current();
        },
      });

      // 0.0s: User taps seal -> slight inward press
      if (sealGroupRef.current) {
        tl.to(
          sealGroupRef.current.position,
          {
            z: 0.015,
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
          },
          0.0
        );
      }

      // 0.4s: V-flap lifts from its tip and rotates back ~170° around top hinge,
      // CARRYING THE SEAL ATTACHED UP AND AWAY (DO NOT SHATTER IT!)
      if (topFlapRef.current) {
        tl.to(
          topFlapRef.current.rotation,
          {
            x: -Math.PI * 0.94,
            duration: 1.4,
            ease: 'power2.inOut',
          },
          0.4
        );
      }

      // 1.2s: Reveal card inside envelope pocket as top flap opens
      if (cardGroupRef.current) {
        tl.set(cardGroupRef.current, { visible: true }, 1.2);
      }

      // 1.4s: Shiny satin lining revealed, camera pushes slightly forward
      tl.to(
        camera.position,
        {
          z: 4.15,
          duration: 1.2,
          ease: 'power2.inOut',
        },
        1.4
      );

      // Lower pocket folds slightly open to reveal card
      if (lowerPocketRef.current) {
        tl.to(
          lowerPocketRef.current.rotation,
          {
            x: Math.PI * 0.45,
            duration: 1.2,
            ease: 'power2.inOut',
          },
          1.5
        );
      }

      // 2.4s: Card inside with tied silk ribbon and knotted bow is fully revealed.

      // 3.6s: Bow unties: ribbon tails loosen and slide off, ribbon falls away
      if (bowRef.current) {
        tl.to(
          bowRef.current.scale,
          {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: 'power2.in',
          },
          3.6
        );
      }
      if (leftTailRef.current) {
        tl.to(
          leftTailRef.current.position,
          {
            y: -1.2,
            z: -0.1,
            duration: 0.7,
            ease: 'power2.in',
          },
          3.6
        );
        tl.to(
          leftTailRef.current.rotation,
          {
            z: -0.8,
            duration: 0.7,
          },
          3.6
        );
      }
      if (rightTailRef.current) {
        tl.to(
          rightTailRef.current.position,
          {
            y: -1.2,
            z: -0.1,
            duration: 0.7,
            ease: 'power2.in',
          },
          3.65
        );
        tl.to(
          rightTailRef.current.rotation,
          {
            z: 0.8,
            duration: 0.7,
          },
          3.65
        );
      }
      if (ribbonBandRef.current) {
        tl.to(
          ribbonBandRef.current.position,
          {
            x: 3.5,
            duration: 0.8,
            ease: 'power2.in',
          },
          3.8
        );
        tl.to(
          ribbonBandRef.current.rotation,
          {
            z: 0.3,
            duration: 0.8,
          },
          3.8
        );
      }

      // 4.8s: Card rises out of envelope and scales up to fill screen (with 16px margins).
      // Envelope body fades and drops down out of view.
      if (cardGroupRef.current) {
        tl.to(
          cardGroupRef.current.position,
          {
            y: 0.05,
            z: 0.65,
            duration: 1.2,
            ease: 'power2.out',
          },
          4.8
        );
        tl.to(
          cardGroupRef.current.scale,
          {
            x: 1.14,
            y: 1.14,
            z: 1.14,
            duration: 1.2,
            ease: 'power2.out',
          },
          4.8
        );
      }

      if (envelopeGroupRef.current) {
        tl.to(
          envelopeGroupRef.current.position,
          {
            y: -2.8,
            duration: 1.2,
            ease: 'power2.in',
          },
          4.9
        );
      }

      // 6.0s: Soft light flash, then swap to crisp real DOM/HTML card.
      fallbackTimer = setTimeout(() => {
        console.warn('[Envelope Debug] Safety fallback timer triggered.');
        if (onOpeningCompleteRef.current) onOpeningCompleteRef.current();
      }, 7200);

    } catch (err) {
      console.error('[Envelope Debug] GSAP timeline error:', err);
      if (onOpeningCompleteRef.current) onOpeningCompleteRef.current();
    }

    return () => {
      if (tl) tl.kill();
      clearTimeout(fallbackTimer);
    };
  }, [isOpening, camera]);

  return (
    <group ref={envelopeGroupRef} position={[0, 0, 0]}>
      {/* Full-screen invisible interaction hit mesh */}
      <mesh
        position={[0, 0, 0.1]}
        onPointerDown={(e) => handleTriggerOpen('screen-hit', e)}
        onClick={(e) => handleTriggerOpen('screen-hit', e)}
      >
        <planeGeometry args={[envW * 1.5, envH * 1.5]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 1. Envelope Backplate: Fills entire screen 100vw x 100dvh */}
      <mesh
        position={[0, 0, -0.02]}
        material={paperMaterial}
        onPointerDown={(e) => handleTriggerOpen('backplate', e)}
        onClick={(e) => handleTriggerOpen('backplate', e)}
      >
        <planeGeometry args={[envW * 1.08, envH * 1.08]} />
      </mesh>

      {/* Inside Lining (Silky champagne-pink satin inside pocket) */}
      <mesh position={[0, 0, -0.015]} material={liningMaterial}>
        <planeGeometry args={[envW * 1.05, envH * 1.05]} />
      </mesh>

      {/* 2. Inside Invitation Card Group (Hidden initially until flap opens) */}
      <group
        ref={cardGroupRef}
        position={[0, -0.08, 0.005]}
        visible={false}
      >
        {/* Card Mesh: 100% Opaque Royal Ivory */}
        <mesh ref={cardMeshRef} material={cardMaterial}>
          <planeGeometry args={[cardWidth, cardHeight]} />
        </mesh>

        {/* Satin Champagne Ribbon tied horizontally across card center */}
        <group ref={ribbonBandRef} position={[0, 0, 0.005]}>
          <mesh material={ribbonMaterial}>
            <planeGeometry args={[cardWidth * 1.02, 0.22]} />
          </mesh>
        </group>

        {/* 3D Knotted Bow across card center */}
        <group position={[0, 0, 0.015]}>
          <group ref={bowRef}>
            {/* Center Knot Sphere */}
            <mesh material={ribbonMaterial}>
              <sphereGeometry args={[0.07, 16, 16]} />
            </mesh>
            {/* Left Loop */}
            <mesh
              position={[-0.14, 0.02, 0.01]}
              rotation={[0, 0.2, 0.3]}
              material={ribbonMaterial}
            >
              <torusGeometry args={[0.10, 0.032, 16, 24, Math.PI * 1.6]} />
            </mesh>
            {/* Right Loop */}
            <mesh
              position={[0.14, 0.02, 0.01]}
              rotation={[0, -0.2, -0.3]}
              material={ribbonMaterial}
            >
              <torusGeometry args={[0.10, 0.032, 16, 24, Math.PI * 1.6]} />
            </mesh>
          </group>

          {/* Left Ribbon Tail */}
          <mesh
            ref={leftTailRef}
            position={[-0.08, -0.22, 0.008]}
            rotation={[0, 0, -0.25]}
            material={ribbonMaterial}
          >
            <planeGeometry args={[0.07, 0.35]} />
          </mesh>

          {/* Right Ribbon Tail */}
          <mesh
            ref={rightTailRef}
            position={[0.08, -0.22, 0.008]}
            rotation={[0, 0, 0.25]}
            material={ribbonMaterial}
          >
            <planeGeometry args={[0.07, 0.35]} />
          </mesh>
        </group>
      </group>

      {/* 3. Lower Envelope Pocket: Full-width cover across lower screen */}
      <group ref={lowerPocketRef} position={[0, -envH / 2, 0.016]}>
        <mesh
          geometry={flapGeometries.lower}
          material={paperMaterial}
          onPointerDown={(e) => handleTriggerOpen('lower-pocket', e)}
          onClick={(e) => handleTriggerOpen('lower-pocket', e)}
        />
        {/* Inside pocket lining */}
        <mesh
          geometry={flapGeometries.lower}
          material={liningMaterial}
          position={[0, 0, -0.002]}
          rotation={[0, Math.PI, 0]}
        />
      </group>

      {/* 4. Top V-Flap: Hinged at top edge (y = envH / 2) */}
      {/* Apex points down to world y = envH * 0.12, overlapping the pocket and wax seal */}
      <group ref={topFlapRef} position={[0, envH / 2, 0.024]}>
        {/* Outside Embossed Mauve-Pink Paper */}
        <mesh
          geometry={flapGeometries.top}
          material={paperMaterial}
          onPointerDown={(e) => handleTriggerOpen('top-flap', e)}
          onClick={(e) => handleTriggerOpen('top-flap', e)}
        />

        {/* Subtle crease shadow tube along left V-edge */}
        <mesh
          position={[-flapGeometries.w * 0.25, flapGeometries.apexY * 0.5, 0.002]}
          rotation={[0, 0, Math.atan2(flapGeometries.apexY, flapGeometries.w * 0.5)]}
        >
          <planeGeometry args={[Math.hypot(flapGeometries.w * 0.5, Math.abs(flapGeometries.apexY)), 0.015]} />
          <meshBasicMaterial color="#3D1220" transparent opacity={0.35} />
        </mesh>

        {/* Subtle crease shadow tube along right V-edge */}
        <mesh
          position={[flapGeometries.w * 0.25, flapGeometries.apexY * 0.5, 0.002]}
          rotation={[0, 0, -Math.atan2(flapGeometries.apexY, flapGeometries.w * 0.5)]}
        >
          <planeGeometry args={[Math.hypot(flapGeometries.w * 0.5, Math.abs(flapGeometries.apexY)), 0.015]} />
          <meshBasicMaterial color="#3D1220" transparent opacity={0.35} />
        </mesh>

        {/* Underside Satin Silk Lining (Visible when top flap swings open 170 deg!) */}
        <mesh
          geometry={flapGeometries.top}
          material={liningMaterial}
          position={[0, 0, -0.002]}
          rotation={[Math.PI, 0, 0]}
        />

        {/* 5. Sculpted 3D Wax Seal: ATTACHED DIRECTLY AS A CHILD OF TOP FLAP! */}
        {/* Placed precisely at the tip of the V-flap: apexY = -envH * 0.38 */}
        <group
          ref={sealGroupRef}
          position={[0, flapGeometries.apexY, 0.03]}
          onPointerDown={(e) => handleTriggerOpen('seal', e)}
          onClick={(e) => handleTriggerOpen('seal', e)}
        >
          {/* Subtle contact shadow behind seal */}
          <mesh position={[0, -0.015, -0.005]}>
            <circleGeometry args={[sealR * 1.15, 36]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.35} />
          </mesh>

          {/* Idle Glow Ring */}
          <mesh ref={glowRingRef} position={[0, 0, 0.002]}>
            <ringGeometry args={[sealR * 1.02, sealR * 1.25, 36]} />
            <meshBasicMaterial
              color="#F4D086"
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Breathing Pulse Wax Seal Body */}
          <group ref={sealPulseRef}>
            {/* Outer melted wax cylinder base with bevel */}
            <mesh
              material={waxMaterial}
              position={[0, 0, 0.018]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[sealR, sealR * 1.05, 0.036, 48]} />
            </mesh>

            {/* Thick raised beveled wax rim */}
            <mesh
              material={waxMaterial}
              position={[0, 0, 0.032]}
            >
              <torusGeometry args={[sealR * 0.90, 0.032, 16, 48]} />
            </mesh>

            {/* Embossed Monogram Face ("V & J" Monogram) */}
            <mesh
              position={[0, 0, 0.036]}
            >
              <circleGeometry args={[sealR * 0.88, 48]} />
              <meshStandardMaterial
                map={sealMonogramTex}
                roughness={0.22}
                metalness={0.15}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
