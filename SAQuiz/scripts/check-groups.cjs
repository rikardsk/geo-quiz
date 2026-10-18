const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

const roIdx = svg.indexOf('id="ro"');
const beforeRo = svg.slice(0, roIdx);
const gMatches = [...beforeRo.matchAll(/<g\s+([^>]+)>/g)];
for (const g of gMatches) {
  console.log('Group:', g[1]);
}
