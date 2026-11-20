import * as THREE from 'three';

/**
 * Creates a procedural embossed leaf normal map (Ginkgo & Lotus style relief)
 * on an offscreen HTML5 canvas.
 * Deep relief of large overlapping leaves with radiating veins and subtle paper grain.
 */
export function createEmbossedLeafNormalTexture(size = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Neutral normal background (R=128, G=128, B=255)
  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, size, size);

  // Heightmap canvas
  const hCanvas = document.createElement('canvas');
  hCanvas.width = size;
  hCanvas.height = size;
  const hCtx = hCanvas.getContext('2d');

  // Base mid-grey height (128)
  hCtx.fillStyle = '#808080';
  hCtx.fillRect(0, 0, size, size);

  // Array of leaf positions and types to create lush overlapping composition
  const leaves = [
    // Top-left cluster
    { type: 'ginkgo', x: size * 0.15, y: size * 0.15, r: size * 0.22, rot: 0.3 },
    { type: 'lotus',  x: size * 0.38, y: size * 0.10, r: size * 0.18, rot: -0.4 },
    { type: 'ginkgo', x: size * 0.05, y: size * 0.35, r: size * 0.20, rot: 1.1 },

    // Top-right cluster
    { type: 'lotus',  x: size * 0.85, y: size * 0.18, r: size * 0.24, rot: 0.8 },
    { type: 'ginkgo', x: size * 0.68, y: size * 0.12, r: size * 0.19, rot: -0.6 },
    { type: 'ginkgo', x: size * 0.92, y: size * 0.40, r: size * 0.21, rot: 1.8 },

    // Center & mid accents
    { type: 'ginkgo', x: size * 0.22, y: size * 0.52, r: size * 0.23, rot: -0.8 },
    { type: 'lotus',  x: size * 0.80, y: size * 0.55, r: size * 0.22, rot: 0.5 },
    { type: 'lotus',  x: size * 0.48, y: size * 0.38, r: size * 0.16, rot: 0.2 },

    // Bottom-left cluster
    { type: 'lotus',  x: size * 0.18, y: size * 0.82, r: size * 0.25, rot: -0.5 },
    { type: 'ginkgo', x: size * 0.36, y: size * 0.90, r: size * 0.20, rot: 0.7 },
    { type: 'ginkgo', x: size * 0.08, y: size * 0.68, r: size * 0.18, rot: -1.2 },

    // Bottom-right cluster
    { type: 'ginkgo', x: size * 0.82, y: size * 0.85, r: size * 0.24, rot: -0.9 },
    { type: 'lotus',  x: size * 0.62, y: size * 0.78, r: size * 0.22, rot: 0.4 },
    { type: 'ginkgo', x: size * 0.95, y: size * 0.72, r: size * 0.17, rot: 1.5 },
  ];

  leaves.forEach((l) => {
    if (l.type === 'ginkgo') {
      drawGinkgoLeafHeight(hCtx, l.x, l.y, l.r, l.rot);
    } else {
      drawLotusLeafHeight(hCtx, l.x, l.y, l.r, l.rot);
    }
  });

  // Paper grain noise
  const imgData = hCtx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 10;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = data[i];
    data[i + 2] = data[i];
  }
  hCtx.putImageData(imgData, 0, 0);

  // Compute Sobel normal map
  const normalData = ctx.getImageData(0, 0, size, size);
  const nData = normalData.data;
  const hData = data;
  const strength = 3.0; // Deep pronounced embossed relief

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      const xL = (x - 1 + size) % size;
      const xR = (x + 1) % size;
      const yU = (y - 1 + size) % size;
      const yD = (y + 1) % size;

      const hL = hData[(y * size + xL) * 4] / 255.0;
      const hR = hData[(y * size + xR) * 4] / 255.0;
      const hU = hData[(yU * size + x) * 4] / 255.0;
      const hD = hData[(yD * size + x) * 4] / 255.0;

      const dx = (hR - hL) * strength;
      const dy = (hD - hU) * strength;
      const dz = 1.0;

      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const nx = dx / len;
      const ny = dy / len;
      const nz = dz / len;

      nData[idx] = Math.floor((nx * 0.5 + 0.5) * 255);
      nData[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
      nData[idx + 2] = Math.floor((nz * 0.5 + 0.5) * 255);
      nData[idx + 3] = 255;
    }
  }
  ctx.putImageData(normalData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 1.5);
  texture.needsUpdate = true;
  return texture;
}

function drawGinkgoLeafHeight(ctx, cx, cy, radius, rot) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);

  // Leaf blade: broad fan with central notch
  ctx.beginPath();
  ctx.moveTo(0, 0); // Petiole base
  ctx.bezierCurveTo(-radius * 0.6, -radius * 0.4, -radius * 0.9, -radius * 0.8, -radius * 0.5, -radius * 1.1);
  ctx.quadraticCurveTo(-radius * 0.2, -radius * 0.95, 0, -radius * 0.8);
  ctx.quadraticCurveTo(radius * 0.2, -radius * 0.95, radius * 0.5, -radius * 1.1);
  ctx.bezierCurveTo(radius * 0.9, -radius * 0.8, radius * 0.6, -radius * 0.4, 0, 0);
  ctx.closePath();

  const grad = ctx.createRadialGradient(0, -radius * 0.6, 0, 0, -radius * 0.6, radius);
  grad.addColorStop(0, '#d8d8d8');
  grad.addColorStop(0.85, '#bfbfbf');
  grad.addColorStop(1, '#989898');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#e6e6e6';
  ctx.stroke();

  // Radiating fine veins
  const veinCount = 14;
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#f2f2f2';
  for (let i = 0; i < veinCount; i++) {
    const t = (i / (veinCount - 1)) * 2 - 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const endX = t * radius * 0.7;
    const endY = -radius * (1.05 - Math.abs(t) * 0.15);
    const ctrlX = endX * 0.6;
    const ctrlY = endY * 0.5;
    ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
    ctx.stroke();
  }

  // Stem
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(radius * 0.1, radius * 0.25, radius * 0.05, radius * 0.45);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#cccccc';
  ctx.stroke();

  ctx.restore();
}

function drawLotusLeafHeight(ctx, cx, cy, radius, rot) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);

  ctx.beginPath();
  const segments = 48;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const r = radius * (1.0 + 0.08 * Math.sin(angle * 7) + 0.04 * Math.cos(angle * 11));
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  const grad = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius);
  grad.addColorStop(0, '#a8a8a8');
  grad.addColorStop(0.3, '#d4d4d4');
  grad.addColorStop(0.9, '#c4c4c4');
  grad.addColorStop(1, '#929292');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#e0e0e0';
  ctx.stroke();

  // Center button
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = '#e8e8e8';
  ctx.fill();

  // Radial veins
  const primaryVeins = 10;
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#f0f0f0';
  for (let i = 0; i < primaryVeins; i++) {
    const angle = (i * 2 * Math.PI) / primaryVeins;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * radius * 0.1, Math.sin(angle) * radius * 0.1);
    const endX = Math.cos(angle) * radius * 0.95;
    const endY = Math.sin(angle) * radius * 0.95;
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Creates procedural silk / satin lining normal texture
 */
export function createSilkLiningNormalTexture(size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      const u = x / size;
      const v = y / size;

      const wave1 = Math.sin((u * 4 + v * 3) * Math.PI * 2);
      const wave2 = Math.cos((u * 8 - v * 4) * Math.PI * 2) * 0.4;
      const totalWave = wave1 + wave2;

      const dx = Math.cos((u * 4 + v * 3) * Math.PI * 2) * 0.4;
      const dy = Math.sin((u * 4 + v * 3) * Math.PI * 2) * 0.3;
      const dz = 1.0;

      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const nx = dx / len;
      const ny = dy / len;
      const nz = dz / len;

      const weave = (Math.sin(x * 1.5) * Math.cos(y * 1.5)) * 0.05;

      data[idx] = Math.floor(((nx + weave) * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.floor((nz * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates high-resolution procedural wax seal stamp face texture with monogram "V & J"
 */
export function createWaxSealMonogramTexture(size = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Background deep royal burgundy / wine wax
  ctx.fillStyle = '#5A1428';
  ctx.fillRect(0, 0, size, size);

  // Subtle radial gradient for wax dome depth
  const domeGrad = ctx.createRadialGradient(
    size * 0.48, size * 0.45, size * 0.05,
    size * 0.50, size * 0.50, size * 0.48
  );
  domeGrad.addColorStop(0, '#751E36');
  domeGrad.addColorStop(0.7, '#521425');
  domeGrad.addColorStop(1, '#330814');
  ctx.fillStyle = domeGrad;
  ctx.fillRect(0, 0, size, size);

  // Outer beveled gold ring
  ctx.strokeStyle = '#F2C169';
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2);
  ctx.stroke();

  // Dotted inner gold ring
  const beadCount = 36;
  const beadRadius = size * 0.37;
  ctx.fillStyle = '#FFEDBA';
  for (let i = 0; i < beadCount; i++) {
    const angle = (i * 2 * Math.PI) / beadCount;
    const bx = size / 2 + Math.cos(angle) * beadRadius;
    const by = size / 2 + Math.sin(angle) * beadRadius;
    ctx.beginPath();
    ctx.arc(bx, by, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Inner thin gold ring
  ctx.strokeStyle = '#D8A85E';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.33, 0, Math.PI * 2);
  ctx.stroke();

  // Top Auspicious Symbol "卐"
  ctx.font = 'bold 44px "Cinzel", Georgia, serif';
  ctx.fillStyle = '#FFEDBA';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('卐', size / 2, size * 0.25);

  // Monogram "V & J" in large bold serif with champagne-gold foil luster
  ctx.font = 'bold 155px "Cinzel", "Cormorant Garamond", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Gold foil gradient
  const goldGrad = ctx.createLinearGradient(0, size * 0.32, 0, size * 0.65);
  goldGrad.addColorStop(0, '#FFFFFF');
  goldGrad.addColorStop(0.2, '#FFF1CC');
  goldGrad.addColorStop(0.5, '#F5C26B');
  goldGrad.addColorStop(0.8, '#D89E3E');
  goldGrad.addColorStop(1, '#94621A');

  ctx.fillStyle = goldGrad;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;
  ctx.shadowBlur = 8;
  ctx.fillText('V & J', size / 2, size * 0.49);

  // Date banner underneath
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.font = '600 36px "Cinzel", Georgia, serif';
  ctx.fillStyle = '#FFEDBA';
  ctx.fillText('✦ 06.12.2026 ✦', size / 2, size * 0.68);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
