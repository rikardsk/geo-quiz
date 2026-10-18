const fs = require('fs');
const content = fs.readFileSync('gf.svg', 'utf8');

const paths = content.match(/<path[^>]*>/g) || [];
console.log('GF paths count:', paths.length);
for (const p of paths) {
  const dMatch = p.match(/\sd="([^"]+)"/);
  if (dMatch) {
    const nums = dMatch[1].match(/[-+]?[0-9]*\.?[0-9]+/g).map(Number);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < nums.length; i += 2) {
      if (nums[i] < minX) minX = nums[i];
      if (nums[i] > maxX) maxX = nums[i];
      if (nums[i+1] < minY) minY = nums[i+1];
      if (nums[i+1] > maxY) maxY = nums[i+1];
    }
    console.log(`Path bounds: X [${minX}, ${maxX}], Y [${minY}, ${maxY}]`);
  }
}
