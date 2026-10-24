import fs from 'node:fs';
import * as d3 from 'd3-geo';

async function check() {
  const r = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
  const worldGeo = await r.json();
  const codes = [
    'MX', 'GT', 'BZ', 'HN', 'SV', 'NI', 'CR', 'PA',
    'CU', 'JM', 'HT', 'DO', 'BS', 'TT', 'BB', 'LC', 'VC', 'GD', 'AG', 'DM', 'KN'
  ];
  const feats = worldGeo.features.filter(f => codes.includes(f.properties['ISO3166-1-Alpha-2']));
  const coll = { type: 'FeatureCollection', features: feats };

  // Current viewBox is 960 x 520
  const proj = d3.geoMercator().fitExtent([[25, 20], [960 - 25, 520 - 20]], coll);
  const path = d3.geoPath(proj);
  const bounds = path.bounds(coll);
  console.log('Current bounds in 960x520:', bounds);
}
check();
