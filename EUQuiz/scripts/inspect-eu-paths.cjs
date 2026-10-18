const fs = require('fs');
const svg = fs.readFileSync('eu-map.svg', 'utf8');

const pathRegex = /<path\s+([^>]+)>/g;
let m;
const paths = [];
while ((m = pathRegex.exec(svg)) !== null) {
  const attrs = m[1];
  const idM = attrs.match(/id="([^"]+)"/);
  const classM = attrs.match(/class="([^"]+)"/);
  const fillM = attrs.match(/fill="([^"]+)"/);
  const styleM = attrs.match(/style="([^"]+)"/);
  paths.push({
    id: idM ? idM[1] : 'none',
    class: classM ? classM[1] : 'none',
    fill: fillM ? fillM[1] : (styleM ? styleM[1] : 'none'),
  });
}
console.log('Total paths:', paths.length);
console.log('Path IDs:', paths.map(p => p.id).join(', '));
