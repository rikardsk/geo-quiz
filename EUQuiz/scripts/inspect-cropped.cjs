const fs = require('fs');
const svg = fs.readFileSync('europe-cropped.svg', 'utf8');

const vbMatch = svg.match(/viewBox="([^"]+)"/);
console.log('viewBox:', vbMatch ? vbMatch[1] : 'none');

const eu27 = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'];
const found = [];
const missing = [];

for (const code of eu27) {
  // check id="code" or class="... code ..."
  const idRe = new RegExp(`id=["']${code.toLowerCase()}["']`, 'i');
  const classRe = new RegExp(`class=["'][^"']*\\b${code.toLowerCase()}\\b[^"']*["']`, 'i');
  if (idRe.test(svg) || classRe.test(svg)) {
    found.push(code);
  } else {
    missing.push(code);
  }
}

console.log(`Found ${found.length} of 27:`, found.join(', '));
if (missing.length) console.log('Missing:', missing.join(', '));

// Print first 50 lines / structure
console.log('--- Top of SVG ---');
console.log(svg.slice(0, 1000));
