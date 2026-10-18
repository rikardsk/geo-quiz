const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

const eu27 = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'];

// Find all path ids
const pathTags = [];
let idx = 0;
while (true) {
  const start = svg.indexOf('<path', idx);
  if (start === -1) break;
  let end = svg.indexOf('/>', start);
  let closeTag = svg.indexOf('</path>', start);
  let tagEnd = -1;
  if (end !== -1 && (closeTag === -1 || end < closeTag)) {
    tagEnd = end + 2;
  } else if (closeTag !== -1) {
    tagEnd = closeTag + 7;
  } else {
    break;
  }
  const chunk = svg.slice(start, tagEnd);
  pathTags.push(chunk);
  idx = tagEnd;
}

const nonEU = [];
for (const tag of pathTags) {
  const idM = tag.match(/\bid="([a-zA-Z0-9_\-]+)"/);
  if (idM) {
    const id = idM[1].toUpperCase();
    if (!eu27.includes(id)) {
      const dM = tag.match(/\bd="([^"]+)"/);
      nonEU.push({ id, d: dM ? dM[1] : '' });
    }
  }
}
console.log('Non-EU paths count:', nonEU.length);
console.log('Non-EU path IDs:', nonEU.map(p => p.id).join(', '));
