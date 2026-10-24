import fs from 'node:fs';
import * as d3 from 'd3-geo';

async function run() {
  const r = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
  const worldGeo = await r.json();
  const codes = ['MX','GT','BZ','HN','SV','NI','CR','PA','CU','JM','HT','DO','BS','TT','BB','LC','VC','GD','AG','DM','KN','CO','VE','EC','PE','BO','BR','GY','SR','PY','UY','AR','CL'];
  const feats = worldGeo.features.filter(f => codes.includes(f.properties['ISO3166-1-Alpha-2']));
  const coll = { type: 'FeatureCollection', features: feats };
  const bgFeats = worldGeo.features.filter(f => ['US', 'PR'].includes(f.properties['ISO3166-1-Alpha-2']));

  const w = 840, h = 760;
  for (const [name, proj] of [
    ['mercator', d3.geoMercator().fitExtent([[30, 25], [w - 30, h - 25]], coll)],
    ['equirect', d3.geoEquirectangular().fitExtent([[30, 25], [w - 30, h - 25]], coll)],
    ['albers', d3.geoConicEqualArea().parallels([15, -35]).rotate([70, 0]).fitExtent([[30, 25], [w - 30, h - 25]], coll)]
  ]) {
    const path = d3.geoPath(proj);
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">\n`;
    svg += `<rect width="100%" height="100%" fill="#f8fafc"/>\n`;
    svg += `<g fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.8">\n`;
    for (const f of bgFeats) {
      const d = path(f);
      if (d) svg += `  <path d="${d}" />\n`;
    }
    svg += `</g>\n<g fill="#38bdf8" stroke="#ffffff" stroke-width="1">\n`;
    for (const f of feats) {
      const d = path(f);
      if (d) svg += `  <path d="${d}" />\n`;
    }
    svg += `</g>\n</svg>`;
    fs.writeFileSync(`c:/Projects/LAQuiz/scripts/${name}.svg`, svg);
  }
  console.log('Saved all 3 svgs');
}

run();
