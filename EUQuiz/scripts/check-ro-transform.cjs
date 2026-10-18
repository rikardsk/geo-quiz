const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

// Let's check where id="ro" is located
const roIdx = svg.indexOf('id="ro"');
console.log('ro context (previous 500 chars):');
console.log(svg.slice(Math.max(0, roIdx - 500), roIdx + 100));
