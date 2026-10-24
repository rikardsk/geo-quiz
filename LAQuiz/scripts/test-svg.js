import fs from 'node:fs';
import * as d3 from 'd3-geo';

async function generateSample() {
  const r = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
  const worldGeo = await r.json();

  const codes = [
    'MX', 'GT', 'BZ', 'HN', 'SV', 'NI', 'CR', 'PA',
    'CU', 'JM', 'HT', 'DO', 'BS', 'TT', 'BB', 'LC', 'VC', 'GD', 'AG', 'DM', 'KN',
    'CO', 'VE', 'EC', 'PE', 'BO', 'BR', 'GY', 'SR', 'PY', 'UY', 'AR', 'CL'
  ];

  const lacFeatures = worldGeo.features.filter(f => codes.includes(f.properties['ISO3166-1-Alpha-2']));
  const coll = { type: 'FeatureCollection', features: lacFeatures };

  // Let's test Equirectangular, Mercator, and Conic Equidistant
  const width = 800;
  const height = 750;

  // 1. Mercator
  const mercator = d3.geoMercator().fitExtent([[30, 25], [width - 30, height - 25]], coll);
  const mercPath = d3.geoPath(mercator);

  // 2. Equirectangular (centered)
  const equir = d3.geoEquirectangular().fitExtent([[30, 25], [width - 30, height - 25]], coll);
  const equirPath = d3.geoPath(equir);

  console.log('Mercator bounds:', mercPath.bounds(coll));
  console.log('Equirectangular bounds:', equirPath.bounds(coll));

  // Let's check non-lac background features: US, PR, GF
  const bgCodes = ['US', 'PR'];
  const bgFeatures = worldGeo.features.filter(f => bgCodes.includes(f.properties['ISO3166-1-Alpha-2']));

  // Generate test SVG with Equirectangular
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n`;
  svg += `<rect width="100%" height="100%" fill="#f8fafc"/>\n`;
  svg += `<g fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.8">\n`;
  for (const f of bgFeatures) {
    const d = equirPath(f);
    if (d) svg += `  <path d="${d}" />\n`;
  }
  svg += `</g>\n`;
  svg += `<g stroke="#ffffff" stroke-width="1">\n`;
  for (const f of lacFeatures) {
    const d = equirPath(f);
    const code = f.properties['ISO3166-1-Alpha-2'];
    if (d) svg += `  <path id="${code}" d="${d}" fill="#38bdf8" />\n`;
  }
  svg += `</g>\n</svg>`;

  fs.writeFileSync('c:/Projects/LAQuiz/scripts/test-map.svg', svg);
  console.log('Wrote test-map.svg');
}

generateSample();
