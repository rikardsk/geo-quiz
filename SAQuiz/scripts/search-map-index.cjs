const fs = require('fs');
const index = JSON.parse(fs.readFileSync('map-index.json', 'utf8'));

for (const [key, val] of Object.entries(index.maps)) {
  const s = JSON.stringify({ key, val }).toLowerCase();
  if (s.includes('south america') || s.includes('guiana') || s.includes('french guiana')) {
    console.log(key, val);
  }
}
