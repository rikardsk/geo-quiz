const fs = require('fs');
const content = fs.readFileSync('south-america.svg', 'utf8');

const pathMatches = content.match(/<path[\s\S]*?<\/path>/g) || [];

let globalMinX = Infinity, globalMaxX = -Infinity, globalMinY = Infinity, globalMaxY = -Infinity;

for (const p of pathMatches) {
  const d = p.match(/\sd="([^"]+)"/)[1];
  const nums = d.match(/[-+]?[0-9]*\.?[0-9]+/g).map(Number);
  for (let i = 0; i < nums.length; i += 2) {
    if (nums[i] < globalMinX) globalMinX = nums[i];
    if (nums[i] > globalMaxX) globalMaxX = nums[i];
    if (nums[i+1] < globalMinY) globalMinY = nums[i+1];
    if (nums[i+1] > globalMaxY) globalMaxY = nums[i+1];
  }
}

console.log('Global bounds:', {
  minX: globalMinX,
  maxX: globalMaxX,
  minY: globalMinY,
  maxY: globalMaxY,
  width: globalMaxX - globalMinX,
  height: globalMaxY - globalMinY
});
