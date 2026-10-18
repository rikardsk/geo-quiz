const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

const opens = [...svg.matchAll(/<g\b([^>]*)>/g)];
opens.forEach((o, i) => {
  console.log(`Group ${i}:`, o[1].replace(/\s+/g, ' ').trim());
});
