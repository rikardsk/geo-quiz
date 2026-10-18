const fs = require('fs');
const index = JSON.parse(fs.readFileSync('map-index.json', 'utf8'));

for (const [key, val] of Object.entries(index.maps)) {
  const k = key.toLowerCase();
  if (k.includes('latin') || (k.includes('america') && !k.includes('north') && !k.includes('united states'))) {
    console.log(key, val.svg);
  }
}
