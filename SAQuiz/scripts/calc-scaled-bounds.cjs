const fs = require('fs');

const svg = fs.readFileSync('eu-map.svg', 'utf8');

function getSamplePoints(d) {
  const tokens = d.match(/([a-zA-Z]|[-+]?[0-9]*\.?[0-9]+(?:e[-+]?[0-9]+)?)/gi);
  if (!tokens) return [];

  let currentX = 0;
  let currentY = 0;
  let currentCommand = 'm';
  const points = [];

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (/^[a-zA-Z]$/.test(token)) {
      currentCommand = token;
      i++;
      continue;
    }

    if (currentCommand === 'm' || currentCommand === 'l') {
      const dx = parseFloat(tokens[i]);
      const dy = parseFloat(tokens[i + 1]);
      if (currentCommand === 'm' && points.length === 0) {
        currentX = dx;
        currentY = dy;
      } else {
        currentX += dx;
        currentY += dy;
      }
      points.push({ x: currentX, y: currentY });
      i += 2;
    } else if (currentCommand === 'M' || currentCommand === 'L') {
      currentX = parseFloat(tokens[i]);
      currentY = parseFloat(tokens[i + 1]);
      points.push({ x: currentX, y: currentY });
      i += 2;
    } else if (currentCommand === 'c') {
      if (i + 5 < tokens.length) {
        const dx = parseFloat(tokens[i + 4]);
        const dy = parseFloat(tokens[i + 5]);
        currentX += dx;
        currentY += dy;
        points.push({ x: currentX, y: currentY });
        i += 6;
      } else {
        i++;
      }
    } else if (currentCommand === 'C') {
      if (i + 5 < tokens.length) {
        currentX = parseFloat(tokens[i + 4]);
        currentY = parseFloat(tokens[i + 5]);
        points.push({ x: currentX, y: currentY });
        i += 6;
      } else {
        i++;
      }
    } else if (currentCommand === 'h') {
      currentX += parseFloat(tokens[i]);
      points.push({ x: currentX, y: currentY });
      i += 1;
    } else if (currentCommand === 'H') {
      currentX = parseFloat(tokens[i]);
      points.push({ x: currentX, y: currentY });
      i += 1;
    } else if (currentCommand === 'v') {
      currentY += parseFloat(tokens[i]);
      points.push({ x: currentX, y: currentY });
      i += 1;
    } else if (currentCommand === 'V') {
      currentY = parseFloat(tokens[i]);
      points.push({ x: currentX, y: currentY });
      i += 1;
    } else {
      i++;
    }
  }

  return points;
}

const pathTags = [];
let idx = 0;
while (true) {
  const start = svg.indexOf('<path', idx);
  if (start === -1) break;
  let end = svg.indexOf('/>', start);
  let closeTag = svg.indexOf('</path>', start);
  let tagEnd = -1;
  if (end !== -1 && (closeTag === -1 || end < closeTag)) {
    tagEnd = end + 2;
  } else if (closeTag !== -1) {
    tagEnd = closeTag + 7;
  } else {
    break;
  }
  const chunk = svg.slice(start, tagEnd);
  pathTags.push(chunk);
  idx = tagEnd;
}

const eu27 = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'];
const scaleX = 7.992;
const scaleY = 7.996;

const countryBounds = {};

for (const tag of pathTags) {
  const idM = tag.match(/\bid="([a-zA-Z0-9_\-]+)"/);
  if (!idM) continue;
  const id = idM[1].toUpperCase();
  if (!eu27.includes(id)) continue;

  const dM = tag.match(/\bd="([^"]+)"/);
  if (!dM) continue;

  const pts = getSamplePoints(dM[1]);
  if (pts.length === 0) continue;

  const isDirect = ['HR', 'CY', 'MT'].includes(id);

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let sumX = 0, sumY = 0;

  for (const p of pts) {
    let lx, ly;
    if (isDirect) {
      lx = p.x;
      ly = p.y;
    } else {
      lx = p.x * 0.0653143 - 328.15544;
      ly = p.y * 0.0653143 + 99.49576;
    }
    const rx = (lx * 0.26458333 + 31.61218) * scaleX;
    const ry = (ly * 0.26458333 - 47.417074) * scaleY;

    if (rx < minX) minX = rx;
    if (rx > maxX) maxX = rx;
    if (ry < minY) minY = ry;
    if (ry > maxY) maxY = ry;
    sumX += rx;
    sumY += ry;
  }

  countryBounds[id] = {
    minX: Math.round(minX),
    maxX: Math.round(maxX),
    minY: Math.round(minY),
    maxY: Math.round(maxY),
    center: {
      x: Math.round((minX + maxX) / 2),
      y: Math.round((minY + maxY) / 2)
    },
    avgCenter: {
      x: Math.round(sumX / pts.length),
      y: Math.round(sumY / pts.length)
    }
  };
}

console.log(JSON.stringify(countryBounds, null, 2));
