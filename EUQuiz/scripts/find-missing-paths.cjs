const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

const missingCodes = ['HR', 'CY', 'MT', 'RO', 'SE'];
for (const code of missingCodes) {
  const re = new RegExp(`<path[^>]*id="${code.toLowerCase()}"[^>]*>`, 'i');
  const m = svg.match(re);
  if (m) {
    console.log(`Matched ${code}:`, m[0].slice(0, 150));
  } else {
    // try checking where the id appears
    const idx = svg.toLowerCase().indexOf(`"${code.toLowerCase()}"`);
    console.log(`${code} at idx:`, idx);
    if (idx !== -1) {
      console.log('Context:', svg.slice(idx - 50, idx + 100));
    }
  }
}
