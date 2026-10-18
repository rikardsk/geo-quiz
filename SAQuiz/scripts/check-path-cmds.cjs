const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

const eu27 = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'];

for (const code of eu27) {
  const re = new RegExp(`<path[^>]*id="${code.toLowerCase()}"[^>]*d="([^"]+)"`, 'i');
  const m = svg.match(re);
  if (!m) {
    console.log(`Failed to match path for ${code}`);
  } else {
    const d = m[1];
    // check command letters
    const letters = new Set(d.match(/[a-zA-Z]/g));
    console.log(`${code}: length=${d.length}, commands=${Array.from(letters).join(',')}`);
  }
}
