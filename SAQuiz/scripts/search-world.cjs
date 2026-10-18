const fs = require('fs');
const index = JSON.parse(fs.readFileSync('map-index.json', 'utf8'));

for (const [key, val] of Object.entries(index.maps)) {
  if (key.toLowerCase().includes('world')) {
    console.log(key, val.svg);
  }
}
