const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

// A reliable tag matcher:
// Find all <path ... /> or <path ... >...</path>
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

console.log('Total path tags found:', pathTags.length);

const eu27 = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'];
const foundMap = {};

for (const tag of pathTags) {
  const idM = tag.match(/\bid="([a-zA-Z0-9_\-]+)"/);
  if (idM) {
    const id = idM[1].toUpperCase();
    if (eu27.includes(id)) {
      const dM = tag.match(/\bd="([^"]+)"/);
      foundMap[id] = {
        dLength: dM ? dM[1].length : 0,
        dPreview: dM ? dM[1].slice(0, 50) : '',
        d: dM ? dM[1] : ''
      };
    }
  }
}

console.log('Found EU countries:', Object.keys(foundMap).length);
for (const code of eu27) {
  if (foundMap[code]) {
    console.log(`${code}: d length = ${foundMap[code].dLength}, preview = ${foundMap[code].dPreview}`);
  } else {
    console.log(`${code}: NOT FOUND`);
  }
}
