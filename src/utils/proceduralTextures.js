import * as THREE from 'three';

/**
 * Creates a procedural floral/mandala normal map on an offscreen HTML5 canvas.
 * This delivers a deeply embossed paper relief effect for the blush-mauve envelope.
 */
export function createEmbossedFloralNormalTexture(size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Background neutral flat normal (R=128, G=128, B=255)
  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, size, size);

  // Helper to draw heightmap patterns first to an intermediate canvas
  const hCanvas = document.createElement('canvas');
  hCanvas.width = size;
  hCanvas.height = size;
  const hCtx = hCanvas.getContext('2d');

  // Neutral mid-grey height
  hCtx.fillStyle = '#808080';
  hCtx.fillRect(0, 0, size, size);

  // Draw fine repeating floral vine / paisley motifs
  const step = size / 4;
  for (let x = 0; x <= size; x += step) {
    for (let y = 0; y <= size; y += step) {
      drawFloralMotif(hCtx, x, y, step * 0.4);
    }
  }

  // Add subtle paper grain noise
  const imgData = hCtx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 16;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = data[i];
    data[i + 2] = data[i];
  }
  hCtx.putImageData(imgData, 0, 0);

  // Compute Sobel normal map from heightmap
  const normalData = ctx.getImageData(0, 0, size, size);
  const nData = normalData.data;
  const hData = data;
  const strength = 2.5;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      // Sample neighbors with wrap-around
      const xLeft = ((x - 1 + size) % size);
      const xRight = ((x + 1) % size);
      const yUp = ((y - 1 + size) % size);
      const yDown = ((y + 1) % size);

      const hL = hData[(y * size + xLeft) * 4] / 255.0;
      const hR = hData[(y * size + xRight) * 4] / 255.0;
      const hU = hData[(yUp * size + x) * 4] / 255.0;
      const hD = hData[(yDown * size + x) * 4] / 255.0;

      // Gradients (dx, dy)
      const dx = (hR - hL) * strength;
      const dy = (hD - hU) * strength;
      const dz = 1.0;

      // Normalize normal vector
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const nx = dx / len;
      const ny = dy / len;
      const nz = dz / len;

      // Map from [-1, 1] to [0, 255]
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
  texture.repeat.set(2, 2);
  texture.needsUpdate = true;
  return texture;
}

function drawFloralMotif(ctx, cx, cy, radius) {
  ctx.save();
  ctx.translate(cx, cy);

  // Outer petal rings (embossed raised heights ~200-240)
  const petals = 8;
  for (let i = 0; i < petals; i++) {
    const angle = (i * 2 * Math.PI) / petals;
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.ellipse(radius * 0.6, 0, radius * 0.4, radius * 0.18, 0, 0, 2 * Math.PI);
    ctx.fillStyle = '#b8b8b8';
    ctx.fill();

    // Petal inner vein
    ctx.beginPath();
    ctx.moveTo(radius * 0.3, 0);
    ctx.lineTo(radius * 0.9, 0);
    ctx.strokeStyle = '#dcdcdc';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.rotate(-angle);
  }

  // Center raised dome
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.25, 0, 2 * Math.PI);
  ctx.fillStyle = '#e5e5e5';
  ctx.fill();

  ctx.restore();
}

/**
 * Creates a procedural wax seal stamp texture with the monogram "V & J"
 */
export function createWaxSealMonogramTexture(size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Background deep royal burgundy / wine
  ctx.fillStyle = '#4A1224';
  ctx.fillRect(0, 0, size, size);

  // Concentric decorative ring
  ctx.strokeStyle = '#D8A85E';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2);
  ctx.stroke();

  // Dotted inner filigree
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.38, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Center Monogram text "V & J"
  ctx.fillStyle = '#FFEDBA';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 90px "Cinzel", "Cormorant Garamond", serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 6;
  ctx.fillText('V & J', size / 2, size / 2 - 10);

  // Small auspicious motif underneath
  ctx.font = '26px "Cormorant Garamond", serif';
  ctx.fillText('✦ 06.12.2026 ✦', size / 2, size / 2 + 50);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
