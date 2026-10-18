const fs = require('fs');
const content = fs.readFileSync('south-america.svg', 'utf8');

// Find all points in Brazil where X is between 250 and 320 and Y is between 60 and 120
const brPath = content.match(/<path[^>]*id="BR"[^>]*d="([^"]+)"/)[1];
const coords = brPath.match(/[-+]?[0-9]*\.?[0-9]+/g).map(Number);
const nearby = [];
for (let i = 0; i < coords.length; i += 2) {
  const x = coords[i];
  const y = coords[i+1];
  if (x >= 270 && x <= 330 && y >= 60 && y <= 110) {
    nearby.push({ x, y });
  }
}
console.log('Brazil points near French Guiana:', nearby);
