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
  const { camera } = useThree();

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

  const [hasStartedAnimation, setHasStartedAnimation] = useState(false);

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

  // Inside Lining Material (Slightly darker rich rose/gold tint)
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

  // Gold Ribbon Material
  const ribbonMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D8A85E'),
      roughness: 0.3,
      metalness: 0.7,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
    });
  }, []);

  // Card Texture and Material
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

  // Custom Flap Geometries
  // Envelope body dimensions: width = 3.4, height = 2.3
  const flapGeometries = useMemo(() => {
    // Top Flap Shape (Triangle pointing down from top hinge)
    const topShape = new THREE.Shape();
    topShape.moveTo(-1.7, 0);
    topShape.lineTo(1.7, 0);
    topShape.lineTo(0, -1.25);
    topShape.closePath();

    // Bottom Flap Shape (Triangle pointing up from bottom hinge)
    const bottomShape = new THREE.Shape();
    bottomShape.moveTo(-1.7, 0);
    bottomShape.lineTo(1.7, 0);
    bottomShape.lineTo(0, 1.05);
    bottomShape.closePath();

    // Left Flap Shape (Triangle pointing right from left hinge)
    const leftShape = new THREE.Shape();
    leftShape.moveTo(0, -1.15);
    leftShape.lineTo(0, 1.15);
    leftShape.lineTo(1.35, 0);
    leftShape.closePath();

    // Right Flap Shape (Triangle pointing left from right hinge)
    const rightShape = new THREE.Shape();
    rightShape.moveTo(0, -1.15);
    rightShape.lineTo(0, 1.15);
    rightShape.lineTo(-1.35, 0);
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

  // Idle floating and parallax tilt animation
  useFrame((state, delta) => {
    if (!envelopeGroupRef.current) return;

    if (!isOpening && !hasStartedAnimation) {
      // Gentle floating sine wave
      const time = state.clock.getElapsedTime();
      const floatY = Math.sin(time * 1.5) * 0.05;

      // Smooth interpolation for parallax tilt (max 8 degrees = ~0.14 rad)
      const targetRotX = (tilt?.x || 0) * 0.14;
      const targetRotY = (tilt?.y || 0) * 0.14;

      envelopeGroupRef.current.position.y = THREE.MathUtils.lerp(
        envelopeGroupRef.current.position.y,
        floatY,
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

  // GSAP 6-Second Orchestrated Opening Timeline
  useEffect(() => {
    if (!isOpening || hasStartedAnimation) return;
    setHasStartedAnimation(true);

    const tl = gsap.timeline({
      onComplete: () => {
        if (onOpeningComplete) onOpeningComplete();
      },
    });

    // 0.0s: Wax seal pulses with gold spark, then shatters
    tl.to(sealIntactRef.current.scale, {
      x: 1.25,
      y: 1.25,
      z: 1.25,
      duration: 0.35,
      ease: 'back.out(2)',
    })
    .set(sealIntactRef.current, { visible: false })
    .set(sealFragmentsGroupRef.current, { visible: true });

    // Shatter 8 fragments radially away with tumble and gravity
    fragmentsRef.current.forEach((frag, idx) => {
      if (!frag) return;
      const angle = (idx * 2 * Math.PI) / 8;
      const distance = 1.2 + Math.random() * 0.6;
      tl.to(
        frag.position,
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 1.2,
          z: 0.8 + Math.random() * 0.5,
          duration: 1.0,
          ease: 'power2.out',
        },
        0.35
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
        0.35
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
        0.85
      );
    });

    // 1.0s: Gold ribbon untwists and slides off
    if (ribbonRef.current) {
      tl.to(
        ribbonRef.current.rotation,
        {
          z: 0.4,
          duration: 0.6,
          ease: 'power2.inOut',
        },
        1.0
      );
      tl.to(
        ribbonRef.current.position,
        {
          x: 5.0,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.in',
        },
        1.2
      );
    }

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

    // 2.6s: Top flap opens about 160 degrees (~2.8 rad) with slight overshoot
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

    // 3.2s: Card slides up out of the envelope, camera dollies in
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
          y: 0.6,
          duration: 1.6,
          ease: 'power2.inOut',
        },
        3.2
      );
    }

    // 4.5s: Card scales to fill screen, envelope fades, soft transition flash
    tl.to(
      envelopeGroupRef.current.position,
      {
        y: -0.6,
        duration: 0.8,
        ease: 'power2.inOut',
      },
      4.5
    );
    tl.to(
      envelopeGroupRef.current.scale,
      {
        x: 1.35,
        y: 1.35,
        z: 1.35,
        duration: 0.9,
        ease: 'power2.inOut',
      },
      4.5
    );

    return () => {
      tl.kill();
    };
  }, [isOpening, hasStartedAnimation, camera, onOpeningComplete]);

  // Click handler on wax seal or envelope
  const handleSealClick = (e) => {
    e.stopPropagation();
    if (isOpening || hasStartedAnimation) return;

    // Unlock sound engine & trigger start
    soundEngine.unlock();
    if (onOpeningStart) onOpeningStart();
  };

  return (
    <group ref={envelopeGroupRef} position={[0, 0, 0]}>
      {/* 1. Envelope Back Plate */}
      <mesh position={[0, 0, -0.015]} material={paperMaterial}>
        <planeGeometry args={[3.4, 2.3]} />
      </mesh>

      {/* Inside pocket lining */}
      <mesh position={[0, 0, -0.01]} material={liningMaterial}>
        <planeGeometry args={[3.38, 2.28]} />
      </mesh>

      {/* 2. Inside Invitation Card */}
      <mesh ref={cardRef} position={[0, -0.05, 0.005]} material={cardMaterial}>
        <planeGeometry args={[3.1, 2.15]} />
      </mesh>

      {/* 3. Bottom Flap (Hinged at bottom edge: y = -1.15) */}
      <group ref={bottomFlapRef} position={[0, -1.15, 0.015]}>
        <mesh geometry={flapGeometries.bottom} material={paperMaterial} />
      </group>

      {/* 4. Left Flap (Hinged at left edge: x = -1.7) */}
      <group ref={leftFlapRef} position={[-1.7, 0, 0.018]}>
        <mesh geometry={flapGeometries.left} material={paperMaterial} />
      </group>

      {/* 5. Right Flap (Hinged at right edge: x = 1.7) */}
      <group ref={rightFlapRef} position={[1.7, 0, 0.02]}>
        <mesh geometry={flapGeometries.right} material={paperMaterial} />
      </group>

      {/* 6. Top Flap (Hinged at top edge: y = 1.15) */}
      <group ref={topFlapRef} position={[0, 1.15, 0.024]}>
        <mesh geometry={flapGeometries.top} material={paperMaterial} />
      </group>

      {/* 7. Gold Satin Ribbon */}
      <group ref={ribbonRef} position={[0, 0, 0.028]}>
        <mesh material={ribbonMaterial}>
          <boxGeometry args={[3.42, 0.35, 0.01]} />
        </mesh>
      </group>

      {/* 8. Wax Seal (Lathe cylinder with embossed monogram) */}
      <group position={[0, 0, 0.035]}>
        {/* Intact Seal */}
        <group
          ref={sealIntactRef}
          onClick={handleSealClick}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'default')}
        >
          {/* Outer beveled wax rim */}
          <mesh material={waxMaterial}>
            <cylinderGeometry args={[0.38, 0.42, 0.04, 32]} />
          </mesh>

          {/* Embossed Monogram Face */}
          <mesh position={[0, 0, 0.025]}>
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
