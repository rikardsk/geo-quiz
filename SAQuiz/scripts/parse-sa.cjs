const fs = require('fs');
const content = fs.readFileSync('south-america.svg', 'utf8');

const pathMatches = content.match(/<path[\s\S]*?<\/path>/g) || [];

for (const p of pathMatches) {
  const name = p.match(/<name>([^<]+)<\/name>/)[1];
  const id = p.match(/id="([^"]+)"/)[1];
  const d = p.match(/\sd="([^"]+)"/)[1];
  const nums = d.match(/[-+]?[0-9]*\.?[0-9]+/g).map(Number);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length; i += 2) {
    if (nums[i] < minX) minX = nums[i];
    if (nums[i] > maxX) maxX = nums[i];
    if (nums[i+1] < minY) minY = nums[i+1];
    if (nums[i+1] > maxY) maxY = nums[i+1];
  }
  console.log(`${id} (${name}): X: [${Math.round(minX)}, ${Math.round(maxX)}], Y: [${Math.round(minY)}, ${Math.round(maxY)}], W: ${Math.round(maxX - minX)}, H: ${Math.round(maxY - minY)}`);
}
