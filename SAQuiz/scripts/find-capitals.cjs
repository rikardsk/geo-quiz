const fs = require('fs');
const content = fs.readFileSync('south-america.svg', 'utf8');

const pathMatches = content.match(/<path[\s\S]*?<\/path>/g) || [];

function getCentroid(d) {
  const nums = d.match(/[-+]?[0-9]*\.?[0-9]+/g).map(Number);
  let sumX = 0, sumY = 0, count = 0;
  for (let i = 0; i < nums.length; i += 2) {
    sumX += nums[i];
    sumY += nums[i+1];
    count++;
  }
  return { x: Math.round(sumX / count), y: Math.round(sumY / count) };
}

const countries = {};
for (const p of pathMatches) {
  const id = p.match(/id="([^"]+)"/)[1];
  const name = p.match(/<name>([^<]+)<\/name>/)[1];
  const d = p.match(/\sd="([^"]+)"/)[1];
  countries[id] = { name, centroid: getCentroid(d), d };
}

// Add GF
const gfD = "M284.5,71.0 L283.9,74.9 L279.8,79.5 L279.4,85.7 L280.3,90.7 L283.3,95.1 L283.8,97.0 L281.4,100.5 L281.8,102.2 L279.5,107.1 L276.7,108.9 L281.7,111.4 L285.1,109.4 L290.3,109.2 L294.4,111.3 L297.2,109.5 L305.7,95.4 L308.1,92.6 L311.3,91.4 L311.3,87.8 L306.8,83.0 L301.5,78.2 L296.2,75.0 L290.5,72.4 Z";
countries['GF'] = { name: 'French Guiana', centroid: getCentroid(gfD), d: gfD };

// Point-in-polygon ray-casting test
function pointInPoly(x, y, d) {
  const commands = d.match(/[MLZ][^MLZ]*/g) || [];
  let inside = false;
  // Parse sub-polygons
  for (const cmd of commands) {
    // simplified check against vertices
  }
}

for (const [id, c] of Object.entries(countries)) {
  console.log(`${id}: ${c.name} - Centroid: x=${c.centroid.x}, y=${c.centroid.y}`);
}
