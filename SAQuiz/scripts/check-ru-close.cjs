const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

const ruIdx = svg.indexOf('id="ru"');
const mtIdx = svg.indexOf('id="mt"');
const closeGAfterRu = svg.indexOf('</g>', ruIdx);
console.log('ruIdx:', ruIdx, 'closeGAfterRu:', closeGAfterRu, 'mtIdx:', mtIdx);
