const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

const gbIdx = svg.indexOf('id="gb"');
const beforeGb = svg.slice(0, gbIdx);
const g8178Idx = beforeGb.lastIndexOf('id="g8178"');
const afterG8178 = beforeGb.slice(g8178Idx);
const closes = (afterG8178.match(/<\/g>/g) || []).length;
console.log('g8178 index:', g8178Idx, 'Closes after g8178:', closes);

const gbTagMatch = svg.slice(gbIdx - 50, gbIdx + 250);
console.log('GB tag context:');
console.log(gbTagMatch);

const dM = svg.slice(gbIdx - 50, gbIdx + 500).match(/d="([^"]+)"/) || svg.slice(gbIdx, gbIdx + 2000).match(/d="([^"]+)"/);
if (dM) {
  console.log('d starts with:', dM[1].slice(0, 100));
}
