const fs = require('fs');
const content = fs.readFileSync('south-america.svg', 'utf8');

// Candidate capital coordinates
const capitals = {
  AR: { name: 'Buenos Aires', x: 228, y: 464 },
  BO: { name: 'Sucre', x: 178, y: 312 },
  BR: { name: 'Brasília', x: 312, y: 278 },
  CL: { name: 'Santiago', x: 135, y: 462 },
  CO: { name: 'Bogotá', x: 78, y: 82 },
  EC: { name: 'Quito', x: 26, y: 147 },
  GF: { name: 'Cayenne', x: 301, y: 78 },
  GY: { name: 'Georgetown', x: 231, y: 54 },
  PY: { name: 'Asunción', x: 220, y: 368 },
  PE: { name: 'Lima', x: 42, y: 232 },
  SR: { name: 'Paramaribo', x: 264, y: 72 },
  UY: { name: 'Montevideo', x: 251, y: 468 },
  VE: { name: 'Caracas', x: 148, y: 22 },
};

function parsePolygons(d) {
  // Split sub-paths by M or m
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
      } else if (type === 'm' || type === 'l') {
        for (let i = 0; i < nums.length; i += 2) {
          curX += nums[i];
          curY += nums[i+1];
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

function isPointInCountry(pt, polys) {
  let inside = false;
  for (const poly of polys) {
    if (isPointInPoly(pt, poly)) inside = !inside;
  }
  return inside;
}

const pathMatches = content.match(/<path[\s\S]*?<\/path>/g) || [];
const paths = {};
for (const p of pathMatches) {
  const id = p.match(/id="([^"]+)"/)[1];
  const d = p.match(/\sd="([^"]+)"/)[1];
  paths[id] = d;
}
paths['GF'] = "M284.5,71.0 L283.9,74.9 L279.8,79.5 L279.4,85.7 L280.3,90.7 L283.3,95.1 L283.8,97.0 L281.4,100.5 L281.8,102.2 L279.5,107.1 L276.7,108.9 L281.7,111.4 L285.1,109.4 L290.3,109.2 L294.4,111.3 L297.2,109.5 L305.7,95.4 L308.1,92.6 L311.3,91.4 L311.3,87.8 L306.8,83.0 L301.5,78.2 L296.2,75.0 L290.5,72.4 Z";

for (const [id, cap] of Object.entries(capitals)) {
  const d = paths[id];
  const polys = parsePolygons(d);
  const inside = isPointInCountry(cap, polys);
  console.log(`${id} (${cap.name}): [${cap.x}, ${cap.y}] -> ${inside ? 'INSIDE' : 'OUTSIDE!'}`);
}
