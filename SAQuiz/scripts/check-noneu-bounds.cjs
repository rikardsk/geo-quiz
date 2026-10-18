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
    } else if (currentCommand === 'c' || currentCommand === 'C') {
      if (i + 5 < tokens.length) {
        const dx = parseFloat(tokens[i + 4]);
        const dy = parseFloat(tokens[i + 5]);
        if (currentCommand === 'c') {
          currentX += dx;
          currentY += dy;
        } else {
          currentX = dx;
          currentY = dy;
        }
        points.push({ x: currentX, y: currentY });
        i += 6;
      } else {
        i++;
      }
    } else {
      i++;
    }
  }

  return points;
}

const scaleX = 7.992;
const scaleY = 7.996;

function checkCountry(id, isDirect) {
  const re = new RegExp(`<path[^>]*id="${id}"[^>]*d="([^"]+)"`, 'i');
  const m = svg.match(re);
  if (!m) {
    console.log(`${id}: not found`);
    return;
  }
  const pts = getSamplePoints(m[1]);
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
  console.log(`${id}: minX=${Math.round(minX)}, maxX=${Math.round(maxX)}, minY=${Math.round(minY)}, maxY=${Math.round(maxY)}, center=(${Math.round((minX+maxX)/2)}, ${Math.round((minY+maxY)/2)})`);
}

checkCountry('gb', false);
checkCountry('no', true);
checkCountry('ch', true);
checkCountry('is', true);
checkCountry('ua', true);
