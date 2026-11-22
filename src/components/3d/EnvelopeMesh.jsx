import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import {
  createEmbossedLeafNormalTexture,
  createSilkLiningNormalTexture,
  createWaxSealMonogramTexture,
  drawWaxSealFace,
} from '../../utils/proceduralTextures';
import soundEngine from '../../utils/proceduralAudio';
import eventConfig from '../../../event.config.js';
import { drawInvitationCardTexture } from '../../utils/cardTextureDrawer';

export default function EnvelopeMesh({
  isOpening,
  onOpeningStart,
  onOpeningComplete,
  tilt,
}) {
  const { camera, viewport, gl } = useThree();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'hi';

  // Root references
  const envelopeGroupRef = useRef();
  const topFlapRef = useRef();
  const lowerPocketRef = useRef();
  const cardGroupRef = useRef();
  const cardMeshRef = useRef();
  const cardCanvasRef = useRef(null);
  const cardTextureRef = useRef(null);
  const ribbonBandRef = useRef();
  const bowRef = useRef();
  const leftTailRef = useRef();
  const rightTailRef = useRef();
  const sealGroupRef = useRef();
  const sealPulseRef = useRef();

  const hasStartedAnimationRef = useRef(false);
  const onOpeningCompleteRef = useRef(onOpeningComplete);
  onOpeningCompleteRef.current = onOpeningComplete;

  // Viewport dimensions for full-bleed envelope (100vw x 100dvh)
  const envW = viewport.width;
  const envH = viewport.height;

  // Procedural Textures
  const leafNormalMap = useMemo(() => createEmbossedLeafNormalTexture(1024), []);
  const silkNormalMap = useMemo(() => createSilkLiningNormalTexture(512), []);
  const sealMonogramTex = useMemo(() => createWaxSealMonogramTexture(1024, eventConfig.monogram || 'V & P'), []);

  // Renderer maximum anisotropy for razor-sharp texture filtering
  useEffect(() => {
    if (gl && sealMonogramTex) {
      try {
        const maxAniso = gl.capabilities?.getMaxAnisotropy ? gl.capabilities.getMaxAnisotropy() : 16;
        sealMonogramTex.anisotropy = maxAniso;
        sealMonogramTex.needsUpdate = true;
      } catch (e) {}
    }
  }, [gl, sealMonogramTex]);

  // Redraw seal face texture once custom Google Fonts are fully loaded in memory
  useEffect(() => {
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (sealMonogramTex && sealMonogramTex.userData?.canvas) {
          drawWaxSealFace(
            sealMonogramTex.userData.canvas,
            sealMonogramTex.userData.monogram,
            sealMonogramTex.userData.dateText
          );
          sealMonogramTex.needsUpdate = true;
        }
      });
    }
  }, [sealMonogramTex]);

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

  // 4. Satin Champagne Gold Ribbon & Bow Material (subtle sheen, non-plastic)
  const ribbonMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#DFBE95'),
      emissive: new THREE.Color('#221406'),
      roughness: 0.18,
      metalness: 0.28,
      sheen: 1.0,
      sheenRoughness: 0.15,
      sheenColor: new THREE.Color('#FFF5E6'),
      clearcoat: 0.60,
      clearcoatRoughness: 0.15,
      side: THREE.DoubleSide,
    });
  }, []);

  // 5. Ultra-Sharp Opaque Royal Ivory Card Material (Single Source of Truth)
  const cardMaterial = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 2640;
    cardCanvasRef.current = canvas;

    drawInvitationCardTexture(canvas, { t, currentLang, eventConfig });

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    try {
      texture.anisotropy = gl?.capabilities?.getMaxAnisotropy() || 16;
    } catch (e) {
      texture.anisotropy = 4;
    }
    texture.needsUpdate = true;
    cardTextureRef.current = texture;

    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.45,
      metalness: 0.05,
      transparent: false,
      depthWrite: true,
      side: THREE.FrontSide,
    });
  }, [gl, currentLang, t]);

  // Redraw when language changes or when web fonts are fully loaded
  useEffect(() => {
    const redraw = () => {
      if (cardCanvasRef.current && cardTextureRef.current) {
        drawInvitationCardTexture(cardCanvasRef.current, { t, currentLang, eventConfig });
        cardTextureRef.current.needsUpdate = true;
      }
    };

    redraw();

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        redraw();
      });
    }
  }, [currentLang, t]);

  // 6. Wax Seal Radius (~38% of screen width on mobile, max 220px on desktop)
  const sealR = useMemo(() => Math.min(envW * 0.19, 0.44), [envW]);

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

      // 3.6s: Bow unties: ribbon tails loosen and slide off, ribbon band slides off
      if (bowRef.current) {
        tl.to(
          bowRef.current.scale,
          {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.45,
            ease: 'power2.in',
          },
          3.6
        );
      }
      if (leftTailRef.current) {
        tl.to(
          leftTailRef.current.position,
          {
            y: -0.8,
            z: -0.05,
            duration: 0.6,
            ease: 'power2.in',
          },
          3.6
        );
        tl.to(
          leftTailRef.current.scale,
          {
            x: 0,
            y: 0,
            duration: 0.6,
          },
          3.6
        );
        tl.to(
          leftTailRef.current.rotation,
          {
            z: -0.8,
            duration: 0.6,
          },
          3.6
        );
      }
      if (rightTailRef.current) {
        tl.to(
          rightTailRef.current.position,
          {
            y: -0.8,
            z: -0.05,
            duration: 0.6,
            ease: 'power2.in',
          },
          3.65
        );
        tl.to(
          rightTailRef.current.scale,
          {
            x: 0,
            y: 0,
            duration: 0.6,
          },
          3.65
        );
        tl.to(
          rightTailRef.current.rotation,
          {
            z: 0.8,
            duration: 0.6,
          },
          3.65
        );
      }
      if (ribbonBandRef.current) {
        tl.to(
          ribbonBandRef.current.position,
          {
            x: cardWidth * 1.6,
            duration: 0.75,
            ease: 'power2.in',
          },
          3.7
        );
        tl.to(
          ribbonBandRef.current.rotation,
          {
            z: 0.25,
            duration: 0.75,
          },
          3.7
        );
      }

      // Hide ribbon and bow completely before card scales up
      tl.call(() => {
        if (ribbonBandRef.current) ribbonBandRef.current.visible = false;
        if (bowRef.current) bowRef.current.visible = false;
        if (leftTailRef.current) leftTailRef.current.visible = false;
        if (rightTailRef.current) rightTailRef.current.visible = false;
      }, null, 4.5);

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

        {/* Satin Champagne Ribbon tied horizontally across lower third of card (safely below venue text) */}
        <group ref={ribbonBandRef} position={[0, -cardHeight * 0.22, 0.008]}>
          <mesh material={ribbonMaterial}>
            <planeGeometry args={[cardWidth * 1.02, cardHeight * 0.045]} />
          </mesh>
        </group>

        {/* 3D Knotted Bow across lower third (below venue text) */}
        <group position={[0, -cardHeight * 0.22, 0.018]}>
          <group ref={bowRef}>
            {/* Center Knot Sphere */}
            <mesh material={ribbonMaterial}>
              <sphereGeometry args={[0.045, 16, 16]} />
            </mesh>
            {/* Left Silk Loop */}
            <mesh
              position={[-0.08, 0.015, 0.008]}
              rotation={[0, 0.2, 0.3]}
              material={ribbonMaterial}
            >
              <torusGeometry args={[0.065, 0.018, 16, 24, Math.PI * 1.5]} />
            </mesh>
            {/* Right Silk Loop */}
            <mesh
              position={[0.08, 0.015, 0.008]}
              rotation={[0, -0.2, -0.3]}
              material={ribbonMaterial}
            >
              <torusGeometry args={[0.065, 0.018, 16, 24, Math.PI * 1.5]} />
            </mesh>
          </group>

          {/* Left Ribbon Tail */}
          <mesh
            ref={leftTailRef}
            position={[-0.045, -0.11, 0.008]}
            rotation={[0, 0, -0.2]}
            material={ribbonMaterial}
          >
            <planeGeometry args={[0.038, 0.20]} />
          </mesh>

          {/* Right Ribbon Tail */}
          <mesh
            ref={rightTailRef}
            position={[0.045, -0.11, 0.008]}
            rotation={[0, 0, 0.2]}
            material={ribbonMaterial}
          >
            <planeGeometry args={[0.038, 0.20]} />
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
          <mesh position={[0, -0.012, -0.003]}>
            <circleGeometry args={[sealR * 1.10, 48]} />
            <meshBasicMaterial color="#140208" transparent opacity={0.35} />
          </mesh>

          {/* Breathing Pulse Wax Seal Body */}
          <group ref={sealPulseRef}>
            {/* Outer melted wax cylinder base (openEnded with no top cap to prevent any internal triangles or z-fighting) */}
            <mesh
              material={waxMaterial}
              position={[0, 0, 0.012]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[sealR, sealR * 1.05, 0.024, 64, 1, true]} />
            </mesh>

            {/* Thick raised beveled wax rim */}
            <mesh
              material={waxMaterial}
              position={[0, 0, 0.028]}
            >
              <torusGeometry args={[sealR * 0.90, 0.028, 24, 64]} />
            </mesh>

            {/* Embossed Monogram Face ("V & P" Monogram - clean, razor-sharp, zero z-fighting) */}
            <mesh
              position={[0, 0, 0.038]}
            >
              <circleGeometry args={[sealR * 0.88, 64]} />
              <meshStandardMaterial
                map={sealMonogramTex}
                roughness={0.25}
                metalness={0.15}
                polygonOffset={true}
                polygonOffsetFactor={-2}
                polygonOffsetUnits={-2}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
