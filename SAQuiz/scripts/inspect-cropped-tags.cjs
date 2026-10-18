const fs = require('fs');
const svg = fs.readFileSync('europe-cropped.svg', 'utf8');

// Find all paths with id or class
const matches = [...svg.matchAll(/<(path|g)\s+[^>]*(id|class)="([^"]+)"[^>]*>/g)];
console.log('Total tags with id/class:', matches.length);
for (let i = 0; i < Math.min(30, matches.length); i++) {
  console.log(`${matches[i][1]} ${matches[i][2]}="${matches[i][3]}"`);
}
