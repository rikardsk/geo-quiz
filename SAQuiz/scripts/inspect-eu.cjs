const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

const eu27 = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'];
const found = [];
const missing = [];
for (const code of eu27) {
  const re = new RegExp(`id=["']${code.toLowerCase()}["']`, 'i');
  if (re.test(svg)) {
    found.push(code);
  } else {
    missing.push(code);
  }
}
console.log(`Found ${found.length} of 27 EU member states.`);
if (missing.length > 0) {
  console.log('Missing:', missing.join(', '));
}

// Let's also check all top-level or country groups/paths
const idRegex = /<(path|g)\s+[^>]*id="([a-zA-Z0-9_\-]+)"/g;
let m;
const allIds = [];
while ((m = idRegex.exec(svg)) !== null) {
  allIds.push(`${m[1]}:${m[2]}`);
}
console.log('Total identified tags:', allIds.length);
console.log('Sample IDs:', allIds.slice(0, 40).join(', '));
