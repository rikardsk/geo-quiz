const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

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
  pathTags.push({ chunk, start });
  idx = tagEnd;
}

const g8178Start = svg.indexOf('id="g8178"');
const g8178End = svg.indexOf('</g>', g8178Start); // wait, let's find the closing </g> for g8178

const ruStart = svg.indexOf('id="ru"');

console.log('g8178Start:', g8178Start);
console.log('ruStart:', ruStart);

for (const { chunk, start } of pathTags) {
  const idM = chunk.match(/\bid="([a-zA-Z0-9_\-]+)"/);
  if (!idM) continue;
  const id = idM[1];
  let group = 'layer1-9';
  if (start > g8178Start && (ruStart === -1 || start < ruStart)) {
    group = 'g8178';
  } else if (ruStart !== -1 && start > ruStart) {
    group = 'ru';
  }
  console.log(`${id}: group=${group}`);
}
