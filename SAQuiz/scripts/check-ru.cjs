const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

const ruIdx = svg.indexOf('id="ru"');
console.log('ru context:');
console.log(svg.slice(ruIdx - 100, ruIdx + 300));
