const https = require('https');
const fs = require('fs');
const path = require('path');

const codes = ['ar', 'bo', 'br', 'cl', 'co', 'ec', 'gf', 'gy', 'py', 'pe', 'sr', 'uy', 've'];

const flagsDir = path.join(__dirname, '..', 'public', 'flags');
if (!fs.existsSync(flagsDir)) {
  fs.mkdirSync(flagsDir, { recursive: true });
}

function download(code) {
  return new Promise((resolve, reject) => {
    const url = `https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/${code}.svg`;
    const dest = path.join(flagsDir, `${code}.svg`);
    const file = fs.createWriteStream(dest);

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${code}: status ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Downloaded ${code}.svg`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

(async () => {
  for (const c of codes) {
    try {
      await download(c);
    } catch (e) {
      console.error(e.message);
    }
  }
})();
