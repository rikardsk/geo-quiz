const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

const eu27 = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'];

// Let's check viewBox
const vbMatch = svg.match(/viewBox="([^"]+)"/);
console.log('viewBox:', vbMatch ? vbMatch[1] : 'none');

// For each EU country, check if it is a <path> or <g>
for (const code of eu27) {
  const pathRegex = new RegExp(`<path[^>]*id="${code.toLowerCase()}"[^>]*>`, 'i');
  const gRegex = new RegExp(`<g[^>]*id="${code.toLowerCase()}"[^>]*>`, 'i');
  const pM = svg.match(pathRegex);
  const gM = svg.match(gRegex);
  if (pM) {
    console.log(`${code}: <path>`);
  } else if (gM) {
    console.log(`${code}: <g>`);
  } else {
    console.log(`${code}: NOT MATCHED directly`);
  }
}
