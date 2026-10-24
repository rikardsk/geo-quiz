import fs from 'node:fs';

const svg = fs.readFileSync('us-map.svg', 'utf8');
const stateSectionMatch = svg.match(/<g class="state">([\s\S]*?)<\/g>/);
const stateSection = stateSectionMatch[1];
const pathRegex = /<path\s+class="([a-z]{2})"\s+d="([^"]+)">\s*<title>([^<]+)<\/title><\/path>/g;

function parsePathPoints(d) {
  // Tokenize commands and numbers
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

    // Number tokens
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
    } else if (currentCommand === 'z' || currentCommand === 'Z') {
      i += 1;
    } else {
      i += 1;
    }
  }

  return points;
}

let match;
const centers = {};
while ((match = pathRegex.exec(stateSection)) !== null) {
  const code = match[1].toUpperCase();
  const d = match[2];
  const pts = parsePathPoints(d);
  if (pts.length > 0) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    let sumX = 0, sumY = 0;
    for (const p of pts) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
      sumX += p.x;
      sumY += p.y;
    }
    centers[code] = {
      bboxCenter: { x: Number(((minX + maxX) / 2).toFixed(1)), y: Number(((minY + maxY) / 2).toFixed(1)) },
      avgCenter: { x: Number((sumX / pts.length).toFixed(1)), y: Number((sumY / pts.length).toFixed(1)) },
      bbox: { minX, maxX, minY, maxY }
    };
  }
}

centers['DC'] = {
  bboxCenter: { x: 801.6, y: 252.1 },
  avgCenter: { x: 801.6, y: 252.1 },
  bbox: { minX: 799, maxX: 804, minY: 250, maxY: 254 }
};

console.log(JSON.stringify(centers, null, 2));
