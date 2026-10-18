const fs = require('fs');
const content = fs.readFileSync('south-america.svg', 'utf8');

// Use the same parsePolygons from before
function parsePolygons(d) {
  const subpaths = d.trim().split(/(?=[Mm])/);
  const polys = [];
  for (const sp of subpaths) {
    const coords = [];
    const cmds = sp.match(/[A-Za-z][^A-Za-z]*/g) || [];
    let curX = 0, curY = 0;
    for (const cmd of cmds) {
      const type = cmd[0];
      const nums = (cmd.slice(1).match(/[-+]?[0-9]*\.?[0-9]+/g) || []).map(Number);
      if (type === 'M' || type === 'L') {
        for (let i = 0; i < nums.length; i += 2) {
          curX = nums[i];
          curY = nums[i+1];
          coords.push({ x: curX, y: curY });
        }
      }
    }
    if (coords.length >= 3) polys.push(coords);
  }
  return polys;
}

function isPointInPoly(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect = ((yi > pt.y) !== (yj > pt.y)) &&
      (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

const arD = content.match(/<path[^>]*id="AR"[^>]*d="([^"]+)"/)[1];
const gyD = content.match(/<path[^>]*id="GY"[^>]*d="([^"]+)"/)[1];

const arPolys = parsePolygons(arD);
const gyPolys = parsePolygons(gyD);

console.log('Testing AR near Buenos Aires:');
for (let dx = -15; dx <= 5; dx += 2) {
  for (let dy = -10; dy <= 10; dy += 2) {
    const pt = { x: 232 + dx, y: 462 + dy };
    if (arPolys.some(p => isPointInPoly(pt, p))) {
      console.log(`AR inside at x=${pt.x}, y=${pt.y}`);
    }
  }
}

console.log('Testing GY near Georgetown:');
for (let dx = -15; dx <= 5; dx += 2) {
  for (let dy = -10; dy <= 20; dy += 2) {
    const pt = { x: 236 + dx, y: 50 + dy };
    if (gyPolys.some(p => isPointInPoly(pt, p))) {
      console.log(`GY inside at x=${pt.x}, y=${pt.y}`);
    }
  }
}
