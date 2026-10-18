const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

// List all countries in the map
const eu27 = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'];

const countryData = {};
for (const code of eu27) {
  const re = new RegExp(`<path[^>]*id="${code.toLowerCase()}"[^>]*>`, 'i');
  const m = svg.match(re);
  if (m) {
    const dMatch = m[0].match(/d="([^"]+)"/);
    countryData[code] = {
      tag: m[0].slice(0, 80),
      dLength: dMatch ? dMatch[1].length : 0,
      hasD: !!dMatch
    };
  }
}
console.log('Country data summary:', JSON.stringify(countryData, null, 2));
