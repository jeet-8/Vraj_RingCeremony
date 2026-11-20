/**
 * Generates beautiful royal portrait placeholders for Vraj & Jiya (Pooja)
 * with intricate gold filigree borders, floral silhouettes, and royal typography.
 */

export function generateCouplePhotoPlaceholder(title = "Vraj & Jiya", subtitle = "Ring Ceremony 2026", colorTheme = "rose") {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 1000);
  if (colorTheme === "gold") {
    grad.addColorStop(0, '#2D1B28');
    grad.addColorStop(0.5, '#402135');
    grad.addColorStop(1, '#1A0C16');
  } else if (colorTheme === "wine") {
    grad.addColorStop(0, '#381424');
    grad.addColorStop(0.5, '#561E37');
    grad.addColorStop(1, '#240A17');
  } else {
    grad.addColorStop(0, '#2A1725');
    grad.addColorStop(0.5, '#3D1C30');
    grad.addColorStop(1, '#190A15');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 1000);

  // Outer Ornate Arch
  ctx.strokeStyle = '#D8A85E';
  ctx.lineWidth = 4;
  ctx.beginPath();
  // Draw arched top
  ctx.moveTo(60, 940);
  ctx.lineTo(60, 360);
  ctx.bezierCurveTo(60, 100, 740, 100, 740, 360);
  ctx.lineTo(740, 940);
  ctx.closePath();
  ctx.stroke();

  // Inner Dotted Arch
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(80, 920);
  ctx.lineTo(80, 370);
  ctx.bezierCurveTo(80, 130, 720, 130, 720, 370);
  ctx.lineTo(720, 920);
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);

  // Monogram & Couple Silhouette Icon
  ctx.fillStyle = '#FFEDBA';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Ring Icon
  ctx.font = '80px "Cinzel", serif';
  ctx.fillText('💍', 400, 320);

  // Monogram
  ctx.font = 'bold 72px "Cinzel", serif';
  ctx.fillText('V & J', 400, 430);

  // Subtitle
  ctx.font = 'italic 34px "Cormorant Garamond", serif';
  ctx.fillStyle = '#E8B4B8';
  ctx.fillText(title, 400, 520);

  ctx.font = '22px "Cormorant Garamond", serif';
  ctx.fillStyle = '#DFBE95';
  ctx.letterSpacing = '4px';
  ctx.fillText(subtitle.toUpperCase(), 400, 580);

  // Decorative floral divider
  ctx.strokeStyle = '#D8A85E';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(250, 640);
  ctx.lineTo(550, 640);
  ctx.stroke();

  ctx.font = '24px serif';
  ctx.fillStyle = '#FFEDBA';
  ctx.fillText('✦ 06 . 12 . 2026 ✦', 400, 680);

  // Soft romantic message
  ctx.font = 'italic 26px "Cormorant Garamond", serif';
  ctx.fillStyle = '#FAF4EC';
  ctx.fillText('"Two hearts joined in love and sacred promise"', 400, 760);

  return canvas.toDataURL('image/jpeg', 0.9);
}
