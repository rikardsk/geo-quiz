const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

function showElement(id) {
  const re = new RegExp(`<path[^>]*id="${id}"[^>]*>`, 'i');
  const m = svg.match(re);
  if (m) {
    console.log(`=== ${id} ===`);
    console.log(m[0].slice(0, 200));
  } else {
    console.log(`=== ${id} NOT MATCHED ===`);
  }
}

['hr', 'cy', 'mt', 'de', 'fr', 'at', 'it'].forEach(showElement);
