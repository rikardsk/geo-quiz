const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

const eu27 = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'];

// Let's find every country path and check its parents/transforms
for (const code of eu27) {
  const re = new RegExp(`<path[^>]*id="${code.toLowerCase()}"[^>]*>`, 'i');
  const m = svg.match(re);
  if (!m) {
    console.log(`${code}: NOT FOUND`);
    continue;
  }
  const idx = m.index;
  const before = svg.slice(0, idx);
  // find open <g> tags that are not closed
  const opens = [...before.matchAll(/<g\b([^>]*)>/g)];
  const closes = [...before.matchAll(/<\/g>/g)];
  console.log(`${code}: opens=${opens.length}, closes=${closes.length}`);
}
