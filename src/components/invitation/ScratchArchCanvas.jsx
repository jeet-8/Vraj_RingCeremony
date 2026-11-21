import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Procedurally draws a rich, champagne / silver-gold metallic foil onto the canvas.
 * Includes diagonal gradient, soft sheen streaks, fine noise grain,
 * delicate inner arch border, and centered hint text.
 */
function renderFoilTexture(canvas, width, height, dpr, hintText = "Scratch to reveal") {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = width * dpr;
  const h = height * dpr;

  canvas.width = w;
  canvas.height = h;

  // 1. Rich Champagne / Silver-Gold Metallic Foil Diagonal Gradient
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0.00, '#C9A35E'); // Deep warm champagne gold
  grad.addColorStop(0.15, '#E8CD96'); // Bright champagne highlight
  grad.addColorStop(0.30, '#F5E4BE'); // Silver-gold sheen
  grad.addColorStop(0.45, '#D1AA68'); // Golden bronze
  grad.addColorStop(0.60, '#FDF2D9'); // Pure satin highlight streak
  grad.addColorStop(0.75, '#C49B55'); // Rich gold body
  grad.addColorStop(0.90, '#EAD19E'); // Soft warm gold
  grad.addColorStop(1.00, '#BA8F47'); // Deep edge gold

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // 2. Soft Diagonal Sheen Streaks (Foil Reflections)
  ctx.save();
  ctx.rotate(-Math.PI / 6);
  const step = 110 * dpr;
  for (let x = -w * 1.5; x < w * 2.5; x += step) {
    const sheenGrad = ctx.createLinearGradient(x, 0, x + 50 * dpr, 0);
    sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    sheenGrad.addColorStop(0.5, 'rgba(255, 250, 235, 0.28)');
    sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sheenGrad;
    ctx.fillRect(x, -h * 2, 50 * dpr, h * 4);
  }
  ctx.restore();

  // 3. Fine Procedural Metallic Grain / Texture (128x128 tiled noise)
  try {
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 128;
    noiseCanvas.height = 128;
    const nCtx = noiseCanvas.getContext('2d');
    if (nCtx) {
      const nData = nCtx.createImageData(128, 128);
      for (let i = 0; i < nData.data.length; i += 4) {
        const v = Math.random() * 38;
        nData.data[i] = 255;
        nData.data[i + 1] = 240;
        nData.data[i + 2] = 210;
        nData.data[i + 3] = v; // subtle metallic grain
      }
      nCtx.putImageData(nData, 0, 0);
      const pattern = ctx.createPattern(noiseCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, w, h);
      }
    }
  } catch (err) {}

  // 4. Delicate Arch Inner Border
  ctx.save();
  ctx.strokeStyle = 'rgba(110, 65, 18, 0.45)';
  ctx.lineWidth = 2.5 * dpr;
  const pad = 16 * dpr;
  const archR = (w - pad * 2) / 2;
  ctx.beginPath();
  ctx.moveTo(pad, h - pad);
  ctx.lineTo(pad, pad + archR);
  ctx.arc(w / 2, pad + archR, archR, Math.PI, 0, false);
  ctx.lineTo(w - pad, h - pad);
  ctx.closePath();
  ctx.stroke();

  // Dotted Inner Filigree Line
  ctx.strokeStyle = 'rgba(255, 248, 225, 0.7)';
  ctx.lineWidth = 1.2 * dpr;
  ctx.setLineDash([5 * dpr, 5 * dpr]);
  const pad2 = 22 * dpr;
  const archR2 = (w - pad2 * 2) / 2;
  ctx.beginPath();
  ctx.moveTo(pad2, h - pad2);
  ctx.lineTo(pad2, pad2 + archR2);
  ctx.arc(w / 2, pad2 + archR2, archR2, Math.PI, 0, false);
  ctx.lineTo(w - pad2, h - pad2);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  // 5. Centered Sparkle Ornament & Hint Text
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const cy = h * 0.48;

  // Sparkle Icon
  ctx.font = `${Math.round(26 * dpr)}px serif`;
  ctx.fillStyle = '#6E4513';
  ctx.fillText('✨', w / 2, cy - 36 * dpr);

  // Soft text shadow for contrast on foil
  ctx.shadowColor = 'rgba(255, 255, 255, 0.85)';
  ctx.shadowOffsetY = 1 * dpr;
  ctx.shadowBlur = 3 * dpr;

  // "Scratch to reveal" hint
  ctx.font = `700 ${Math.round(18 * dpr)}px "Cinzel", "Cormorant Garamond", Georgia, serif`;
  ctx.fillStyle = '#3E1D06';
  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = `${2 * dpr}px`;
  }
  ctx.fillText(hintText.toUpperCase(), w / 2, cy + 8 * dpr);

  // Sub-hint
  ctx.font = `italic 600 ${Math.round(12 * dpr)}px "Cormorant Garamond", Georgia, serif`;
  ctx.fillStyle = '#5C330F';
  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = 'normal';
  }
  ctx.fillText('✦  Swipe finger or coin to reveal  ✦', w / 2, cy + 36 * dpr);

  ctx.restore();
}

/**
 * Erases a smooth stroke with feathered edges between p0 and p1 using destination-out
 */
function eraseStroke(ctx, p0, p1, brushRadius, dpr) {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';

  const r = brushRadius * dpr;
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const dist = Math.hypot(dx, dy);
  const steps = Math.max(1, Math.ceil(dist / (4 * dpr)));

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = p0.x + dx * t;
    const y = p0.y + dy * t;

    const grad = ctx.createRadialGradient(x, y, r * 0.35, x, y, r);
    grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    grad.addColorStop(0.75, 'rgba(0, 0, 0, 0.95)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export default function ScratchArchCanvas({
  isRevealed,
  onReveal,
  hintText = "Scratch to reveal",
  className = "",
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const isScratchingRef = useRef(false);
  const lastPointRef = useRef(null);
  const animationFrameRef = useRef(null);
  const pendingPointsRef = useRef([]);
  const lastSampleTimeRef = useRef(0);
  const sampleCanvasRef = useRef(null);
  const sampleCtxRef = useRef(null);
  const isOffscreenRef = useRef(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasStartedScratching, setHasStartedScratching] = useState(false);

  // Initialize offscreen 64x64 canvas for lightweight progress sampling
  useEffect(() => {
    const sc = document.createElement('canvas');
    sc.width = 64;
    sc.height = 64;
    sampleCanvasRef.current = sc;
    sampleCtxRef.current = sc.getContext('2d', { willReadFrequently: true });
  }, []);

  // Performance watchdog: IntersectionObserver to disable listeners when off-screen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isOffscreenRef.current = !entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Check scratch progress on downsampled 64x64 grid
  const sampleScratchProgress = useCallback(() => {
    const canvas = canvasRef.current;
    const sc = sampleCanvasRef.current;
    const sctx = sampleCtxRef.current;
    if (!canvas || !sc || !sctx) return 0;

    sctx.clearRect(0, 0, 64, 64);
    sctx.drawImage(canvas, 0, 0, 64, 64);

    try {
      const imgData = sctx.getImageData(0, 0, 64, 64).data;
      let cleared = 0;
      const total = 64 * 64;

      for (let i = 3; i < imgData.length; i += 4) {
        if (imgData[i] < 128) {
          cleared++;
        }
      }

      return cleared / total;
    } catch (e) {
      return 0;
    }
  }, []);

  // Trigger celebration and complete reveal
  const triggerAutoReveal = useCallback(() => {
    if (fadingOut || isRevealed) return;
    setFadingOut(true);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2400);
    }

    setTimeout(() => {
      onReveal();
    }, 600);
  }, [fadingOut, isRevealed, onReveal]);

  // Redraw foil texture onto canvas
  const redrawFoil = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    renderFoilTexture(canvas, rect.width, rect.height, dpr, hintText);
  }, [isRevealed, hintText]);

  // Initial draw & Font-ready redraw
  useEffect(() => {
    if (isRevealed) return;

    redrawFoil();

    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!hasStartedScratching && !isRevealed) {
          redrawFoil();
        }
      });
    }
  }, [isRevealed, redrawFoil, hasStartedScratching]);

  // Handle Resize and Orientation Change (Preserve scratched state if partially scratched)
  useEffect(() => {
    if (isRevealed) return;

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const canvas = canvasRef.current;
        if (!canvas || isRevealed) return;

        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        const oldW = canvas.width;
        const oldH = canvas.height;

        // If not scratched yet, re-render fresh foil
        if (!hasStartedScratching) {
          renderFoilTexture(canvas, rect.width, rect.height, dpr, hintText);
          return;
        }

        // If partially scratched, preserve the scratched mask
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = oldW;
        tempCanvas.height = oldH;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, 0);

          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
          }
        }
      }, 120);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isRevealed, hasStartedScratching, hintText]);

  // Process batched scratch stroke in requestAnimationFrame
  const processScratchQueue = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const points = pendingPointsRef.current;
    pendingPointsRef.current = [];

    if (points.length >= 2) {
      for (let i = 0; i < points.length - 1; i++) {
        eraseStroke(ctx, points[i], points[i + 1], 32, dpr);
      }
    } else if (points.length === 1) {
      eraseStroke(ctx, points[0], points[0], 32, dpr);
    }

    // Sample progress throttled to at most once per 150ms
    const now = performance.now();
    if (now - lastSampleTimeRef.current > 150) {
      lastSampleTimeRef.current = now;
      const progress = sampleScratchProgress();
      if (progress >= 0.45) {
        triggerAutoReveal();
      }
    }
  }, [sampleScratchProgress, triggerAutoReveal]);

  // Pointer Events for Scratching
  const handlePointerDown = (e) => {
    if (isRevealed || fadingOut || isOffscreenRef.current) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return; // Left click only for mouse

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}

    isScratchingRef.current = true;
    setHasStartedScratching(true);

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const pt = {
      x: (e.clientX - rect.left) * dpr,
      y: (e.clientY - rect.top) * dpr,
    };

    lastPointRef.current = pt;
    pendingPointsRef.current.push(pt);

    // Light mobile haptic vibration
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(5);
      } catch (err) {}
    }

    processScratchQueue();
  };

  const handlePointerMove = (e) => {
    if (!isScratchingRef.current || isRevealed || fadingOut || isOffscreenRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const pt = {
      x: (e.clientX - rect.left) * dpr,
      y: (e.clientY - rect.top) * dpr,
    };

    if (lastPointRef.current) {
      pendingPointsRef.current.push(lastPointRef.current, pt);
    }
    lastPointRef.current = pt;

    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(() => {
        processScratchQueue();
        animationFrameRef.current = null;
      });
    }
  };

  const handlePointerUpOrCancel = (e) => {
    if (!isScratchingRef.current) return;
    isScratchingRef.current = false;
    lastPointRef.current = null;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (err) {}

    processScratchQueue();

    // Check progress immediately on pointer release
    const progress = sampleScratchProgress();
    if (progress >= 0.45) {
      triggerAutoReveal();
    }
  };

  // Keyboard accessibility: Enter or Space on frame auto-reveals
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerAutoReveal();
    }
  };

  // If already revealed and fade completed, unmount canvas
  if (isRevealed && !fadingOut) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="button"
      aria-label="Interactive scratch card. Drag or press Enter to reveal photo."
      onKeyDown={handleKeyDown}
      className={`absolute inset-0 z-20 overflow-hidden outline-none cursor-crosshair select-none ${className}`}
      style={{
        clipPath: 'inherit',
        borderRadius: 'inherit',
      }}
    >
      {/* Scratch Canvas with touch-action: none */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpOrCancel}
        onPointerCancel={handlePointerUpOrCancel}
        style={{
          touchAction: 'none',
          transition: fadingOut ? 'opacity 600ms ease-out, transform 600ms ease-out' : 'none',
          opacity: fadingOut ? 0 : 1,
          transform: fadingOut ? 'scale(1.03)' : 'scale(1)',
        }}
        className="w-full h-full block"
      />

      {/* Shimmering Gold Hint Overlay (fades out as soon as user begins scratching) */}
      {!hasStartedScratching && !fadingOut && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
          <div className="relative overflow-hidden rounded-full px-5 py-2.5 bg-[#2B1408]/60 backdrop-blur-md border border-[#F3E5AB]/60 shadow-xl flex items-center gap-2">
            <span className="text-sm animate-bounce">✨</span>
            <span className="font-serif font-bold text-xs sm:text-sm tracking-wider text-[#FFF5D6] uppercase drop-shadow">
              {hintText}
            </span>
            {/* Shimmer sweep animation across hint pill */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
          </div>
        </div>
      )}

      {/* Confetti & Golden Sparkle Celebration Burst */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden">
          {Array.from({ length: 28 }).map((_, i) => {
            const angle = (i / 28) * Math.PI * 2;
            const distance = 80 + Math.random() * 120;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const rot = Math.random() * 360;
            const delay = Math.random() * 0.15;
            const size = 6 + Math.random() * 8;
            const isStar = i % 3 === 0;

            return (
              <div
                key={i}
                className="absolute text-xs"
                style={{
                  transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
                  transition: `transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s, opacity 1.2s ease-out ${delay}s`,
                  opacity: 1,
                }}
              >
                {isStar ? (
                  <span className="text-[#FFEDBA] drop-shadow-md">✦</span>
                ) : (
                  <div
                    style={{
                      width: `${size}px`,
                      height: `${size * 0.6}px`,
                      backgroundColor: i % 2 === 0 ? '#E8CD96' : '#FAF0E1',
                    }}
                    className="rounded-sm shadow-sm"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
