const fs = require('fs');
const content = fs.readFileSync('south-america.svg', 'utf8');

// Let's check all paths in south-america.svg
const paths = content.match(/<path[\s\S]*?<\/path>/g);
console.log('Number of paths:', paths.length);
for (const p of paths) {
  const idMatch = p.match(/id="([^"]+)"/);
  const nameMatch = p.match(/<name>([^<]+)<\/name>/);
  console.log(idMatch[1], nameMatch ? nameMatch[1] : 'No name');
}
