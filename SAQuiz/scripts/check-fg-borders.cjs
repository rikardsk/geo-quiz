const fs = require('fs');
const content = fs.readFileSync('south-america.svg', 'utf8');

const srPath = content.match(/<path[^>]*id="SR"[^>]*d="([^"]+)"/)[1];
const brPath = content.match(/<path[^>]*id="BR"[^>]*d="([^"]+)"/)[1];

console.log('--- SR PATH ---');
console.log(srPath);

const brCommands = brPath.match(/[A-Z][^A-Z]*/g);
console.log('--- BR SEGMENTS near FG ---');
for (const cmd of brCommands) {
  const nums = cmd.match(/[-+]?[0-9]*\.?[0-9]+/g);
  if (nums) {
    const x = parseFloat(nums[nums.length - 2]);
    const y = parseFloat(nums[nums.length - 1]);
    if (x >= 270 && x <= 325 && y >= 70 && y <= 115) {
      console.log(cmd.trim());
    }
  }
}
