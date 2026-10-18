const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

const eu27 = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'];

for (const code of eu27) {
  // match <path ... id="code" ... /> or <path ... id="code" ...></path>
  const re = new RegExp(`<path[\\s\\S]*?id="${code.toLowerCase()}"[\\s\\S]*?>`, 'i');
  const m = svg.match(re);
  if (m) {
    const dMatch = m[0].match(/d="([^"]+)"/);
    console.log(`${code}: d length = ${dMatch ? dMatch[1].length : 'none'}`);
  } else {
    // maybe id comes before?
    const re2 = new RegExp(`<path[^>]*id="${code.toLowerCase()}"[\\s\\S]*?>`, 'i');
    console.log(`${code}: not matched by re`);
  }
}
