/**
 * Procedural 2D Canvas Texture Drawer for 3D Envelope Invitation Card
 * Single Source of Truth: Uses eventConfig + i18next translations
 * Supports English, Hindi, and Gujarati with proper fonts, auto-fitting,
 * and high-resolution rendering.
 */

// Helper: Word wrap for Canvas 2D
function getWrappedLines(ctx, text, maxWidth) {
  if (!text) return [];
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = ctx.measureText(testLine).width;
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

// Helper: Draw rounded pill
function drawPill(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x - width / 2 + radius, y - height / 2);
  ctx.lineTo(x + width / 2 - radius, y - height / 2);
  ctx.quadraticCurveTo(x + width / 2, y - height / 2, x + width / 2, y - height / 2 + radius);
  ctx.lineTo(x + width / 2, y + height / 2 - radius);
  ctx.quadraticCurveTo(x + width / 2, y + height / 2, x + width / 2 - radius, y + height / 2);
  ctx.lineTo(x - width / 2 + radius, y + height / 2);
  ctx.quadraticCurveTo(x - width / 2, y + height / 2, x - width / 2, y + height / 2 - radius);
  ctx.lineTo(x - width / 2, y - height / 2 + radius);
  ctx.quadraticCurveTo(x - width / 2, y - height / 2, x - width / 2 + radius, y - height / 2);
  ctx.closePath();
}

export function drawInvitationCardTexture(canvas, { t, currentLang = 'hi', eventConfig }) {
  if (!canvas || !eventConfig) return;

  const width = canvas.width || 1600;
  const height = canvas.height || 2640;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  // 1. Royal Ivory Background (100% opaque)
  ctx.fillStyle = '#FAF6F0';
  ctx.fillRect(0, 0, width, height);

  // Subtle paper texture / border shading
  ctx.fillStyle = '#F5ECE1';
  ctx.fillRect(35, 35, width - 70, height - 70);
  ctx.fillStyle = '#FAF6F0';
  ctx.fillRect(45, 45, width - 90, height - 90);

  // 2. Dual Gold Foil Borders
  ctx.strokeStyle = '#D8A85E';
  ctx.lineWidth = 8;
  ctx.strokeRect(65, 65, width - 130, height - 130);

  ctx.lineWidth = 2.5;
  ctx.strokeRect(85, 85, width - 170, height - 170);

  // Corner filigree ornaments
  const drawCorner = (cx, cy, flipX, flipY) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(flipX, flipY);
    ctx.strokeStyle = '#D8A85E';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(55, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 55);
    ctx.stroke();

    // Small diamond accent
    ctx.fillStyle = '#D8A85E';
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.lineTo(25, 15);
    ctx.lineTo(30, 20);
    ctx.lineTo(25, 25);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  drawCorner(110, 110, 1, 1);
  drawCorner(width - 110, 110, -1, 1);
  drawCorner(110, height - 110, 1, -1);
  drawCorner(width - 110, height - 110, -1, -1);

  // Fonts per language
  const isHindi = currentLang === 'hi';
  const isGujarati = currentLang === 'gu';
  const serifFont = isHindi
    ? '"Noto Serif Devanagari", serif'
    : isGujarati
    ? '"Noto Serif Gujarati", serif'
    : '"Cormorant Garamond", serif';
  const scriptFont = '"Great Vibes", cursive';
  const displayFont = isHindi
    ? '"Noto Serif Devanagari", serif'
    : isGujarati
    ? '"Noto Serif Gujarati", serif'
    : '"Cinzel", serif';

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const midX = width / 2;

  // 3. Top Sacred Motif: ✦ 卐 ✦
  ctx.font = `bold 36px ${serifFont}`;
  ctx.fillStyle = '#875217';
  ctx.fillText('✦ 卐 ✦', midX, 165);

  // 4. Three Auspicious Blessing Lines (Each on its own line)
  const blessings = eventConfig.blessings[currentLang] || eventConfig.blessings.hi || [
    'श्री गणेशाय नमः',
    'श्री खिमज माताय नमः',
    'श्री खेतेश्वराय नमः',
  ];

  ctx.font = `600 32px ${serifFont}`;
  ctx.fillStyle = '#875217';
  ctx.fillText(blessings[0].toUpperCase(), midX, 225);
  ctx.fillText(blessings[1].toUpperCase(), midX, 272);
  ctx.fillText(blessings[2].toUpperCase(), midX, 319);

  // Divider below blessings
  ctx.strokeStyle = '#D8A85E';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(midX - 120, 362);
  ctx.lineTo(midX - 18, 362);
  ctx.moveTo(midX + 18, 362);
  ctx.lineTo(midX + 120, 362);
  ctx.stroke();

  ctx.fillStyle = '#B38136';
  ctx.font = '16px serif';
  ctx.fillText('◆', midX, 362);

  // 5. Ceremony Pill: "SAGAI - DASTUR" (Bigger, Dark Wine with Gold Glow & Champagne Text)
  const pillText = t ? t('hero.heroPillText', eventConfig.heroPillText || 'SAGAI - DASTUR') : (eventConfig.heroPillText || 'SAGAI - DASTUR');
  ctx.font = `bold 38px ${displayFont}`;
  const pillTextWidth = ctx.measureText(pillText.toUpperCase()).width;
  const pillW = Math.max(400, pillTextWidth + 90);
  const pillH = 72;
  const pillY = 432;

  // Soft Gold Glow around pill
  ctx.save();
  ctx.shadowColor = 'rgba(201, 162, 74, 0.45)';
  ctx.shadowBlur = 22;

  // Dark Wine Background
  ctx.fillStyle = '#4A1224';
  drawPill(ctx, midX, pillY, pillW, pillH, 36);
  ctx.fill();

  // 1px Solid Gold Border
  ctx.strokeStyle = '#C9A24A';
  ctx.lineWidth = 3.5;
  drawPill(ctx, midX, pillY, pillW, pillH, 36);
  ctx.stroke();
  ctx.restore();

  // Champagne Gold Text
  ctx.fillStyle = '#E8CC85';
  ctx.font = `bold 38px ${displayFont}`;
  ctx.fillText(pillText.toUpperCase(), midX, pillY);

  // 6. Kuldevi Blessing Line: "With the Immense Grace of Shri Kuldevi Khimaj Mataji, We Have"
  const kuldeviLine = t
    ? t('hero.heroBlessingLine', eventConfig.hero?.blessingLine || eventConfig.heroBlessingLine || 'With the Immense Grace of Shri Kuldevi Khimaj Mataji, We Have')
    : (eventConfig.hero?.blessingLine || eventConfig.heroBlessingLine || 'With the Immense Grace of Shri Kuldevi Khimaj Mataji, We Have');

  ctx.font = `600 35px ${serifFont}`;
  ctx.fillStyle = '#4A1224';
  const kuldeviLines = getWrappedLines(ctx, kuldeviLine, 1200);
  let curY = 518;
  for (const line of kuldeviLines) {
    ctx.fillText(line, midX, curY);
    curY += 46;
  }

  // 7. Groom Grandparents Block
  const grandsonLabel = t ? t('hero.grandsonLabel', '') : 'Grandson of';
  const grandsonLabelPos = t ? t('hero.grandsonLabelPosition', 'before') : 'before';
  let gpText = t ? (t('hero.groomGrandparentsLine') || eventConfig.groom?.grandparentsLine || '') : (eventConfig.groom?.grandparentsLine || '');
  if (grandsonLabel && gpText.startsWith(grandsonLabel)) {
    gpText = gpText.slice(grandsonLabel.length).replace(/^[\s,:-]+/, '');
  }

  curY += 15;
  const drawGroomGpLabel = () => {
    if (grandsonLabel) {
      ctx.font = `italic 26px ${serifFont}`;
      ctx.fillStyle = '#9E6D38';
      ctx.fillText(grandsonLabel, midX, curY);
      curY += 38;
    }
  };

  const drawGroomGpDetails = () => {
    ctx.font = `600 33px ${serifFont}`;
    ctx.fillStyle = '#4A1224';
    const gpLines = getWrappedLines(ctx, gpText, 1220);
    for (const line of gpLines) {
      ctx.fillText(line, midX, curY);
      curY += 44;
    }
  };

  if (grandsonLabelPos === 'after') {
    drawGroomGpDetails();
    drawGroomGpLabel();
  } else {
    drawGroomGpLabel();
    drawGroomGpDetails();
  }

  // Thin gold divider before Groom Name
  curY += 10;
  ctx.strokeStyle = '#D8A85E';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(midX - 100, curY);
  ctx.lineTo(midX - 15, curY);
  ctx.moveTo(midX + 15, curY);
  ctx.lineTo(midX + 100, curY);
  ctx.stroke();
  ctx.fillStyle = '#B38136';
  ctx.font = '14px serif';
  ctx.fillText('◆', midX, curY);

  // 8. Groom Block: "Vraj", "Son of", "Rekha Kuwar & Prakashsinghji"
  curY += 65;
  ctx.font = `italic 115px ${scriptFont}`;
  ctx.fillStyle = '#4A1224';
  ctx.fillText(eventConfig.groom.name, midX, curY);

  curY += 68;
  ctx.font = `italic 26px ${serifFont}`;
  ctx.fillStyle = '#9E6D38';
  const groomParentsLabel = t ? (t('hero.groomParentsLabel') || 'Son of') : 'Son of';
  ctx.fillText(groomParentsLabel, midX, curY);

  curY += 40;
  ctx.font = `600 35px ${serifFont}`;
  ctx.fillStyle = '#4A1224';
  const groomParents = t ? (t('hero.groomParents') || eventConfig.groom.parents) : eventConfig.groom.parents;
  ctx.fillText(groomParents, midX, curY);

  // 9. Center "&" Divider
  curY += 56;
  ctx.strokeStyle = '#D8A85E';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(midX - 110, curY);
  ctx.lineTo(midX - 25, curY);
  ctx.moveTo(midX + 25, curY);
  ctx.lineTo(midX + 110, curY);
  ctx.stroke();

  ctx.font = `italic 36px ${serifFont}`;
  ctx.fillStyle = '#B38136';
  ctx.fillText('&', midX, curY - 2);

  // 10. Bride Grandparents Block
  const grandLabel = t ? t('bride.grandLabel', eventConfig.bride?.grandLabel || 'Granddaughter of') : 'Granddaughter of';
  const brideGpLine = t ? t('bride.grandparentsLine', eventConfig.bride?.grandparentsLine || '') : (eventConfig.bride?.grandparentsLine || '');
  const labelPosition = t ? t('bride.labelPosition', 'before') : 'before';

  curY += 46;
  const drawBrideGpLabel = () => {
    ctx.font = `italic 26px ${serifFont}`;
    ctx.fillStyle = '#9E6D38';
    ctx.fillText(grandLabel, midX, curY);
    curY += 38;
  };

  const drawBrideGpDetails = () => {
    ctx.font = `600 33px ${serifFont}`;
    ctx.fillStyle = '#4A1224';
    const lines = getWrappedLines(ctx, brideGpLine, 1220);
    for (const line of lines) {
      ctx.fillText(line, midX, curY);
      curY += 44;
    }
  };

  if (labelPosition === 'before') {
    drawBrideGpLabel();
    drawBrideGpDetails();
  } else {
    drawBrideGpDetails();
    drawBrideGpLabel();
  }

  // 11. Bride Block: "Pooja (Jiya)", "Daughter of", "Seema Kuwar & Parvatsinghji"
  curY += 40;
  ctx.font = `italic 115px ${scriptFont}`;
  ctx.fillStyle = '#4A1224';
  ctx.fillText(eventConfig.bride.name, midX, curY);

  curY += 68;
  ctx.font = `italic 26px ${serifFont}`;
  ctx.fillStyle = '#9E6D38';
  const brideParentsLabel = t ? (t('hero.brideParentsLabel') || 'Daughter of') : 'Daughter of';
  ctx.fillText(brideParentsLabel, midX, curY);

  curY += 40;
  ctx.font = `600 35px ${serifFont}`;
  ctx.fillStyle = '#4A1224';
  const brideParents = t ? (t('hero.brideParents') || eventConfig.bride.parents) : eventConfig.bride.parents;
  ctx.fillText(brideParents, midX, curY);

  // 12. Date, Time & Venue (Centered & Elegant, safely above ribbon)
  curY += 56;
  ctx.strokeStyle = '#D8A85E';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(midX - 250, curY);
  ctx.lineTo(midX + 250, curY);
  ctx.stroke();

  curY += 50;
  const dateText = `✦  ${eventConfig.dateTime?.dateFormatted?.toUpperCase() || 'SUNDAY, 6 DECEMBER 2026'}  ✦`;
  ctx.font = `bold 38px ${displayFont}`;
  ctx.fillStyle = '#B38136';
  ctx.fillText(dateText, midX, curY);

  curY += 46;
  const timeText = eventConfig.dateTime?.timeFormatted || '4:00 PM Onwards';
  ctx.font = `500 32px ${serifFont}`;
  ctx.fillStyle = '#5A2637';
  ctx.fillText(timeText, midX, curY);

  curY += 46;
  const venueText = `${eventConfig.venue?.name || 'R.K. Royal Banquet & Party Lawn'}, ${eventConfig.venue?.city || 'Science City'}`;
  ctx.font = `500 32px ${serifFont}`;
  ctx.fillStyle = '#5A2637';
  ctx.fillText(venueText, midX, curY);

  console.log(`[CardTexture] Card drawn cleanly up to Y = ${curY}px (out of ${height}px). Remaining clearance for ribbon: ${height - curY}px.`);
}
