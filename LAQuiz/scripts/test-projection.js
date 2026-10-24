import fs from 'node:fs';
import * as d3 from 'd3-geo';

const COUNTRY_META = [
  // Mexico & Central America (8)
  { id: 'MX', name: 'Mexico', capital: 'Mexico City', region: 'Central America', nickname: 'Land of the Mayas, Aztecs & Mariachi', capCoords: [-99.1332, 19.4326] },
  { id: 'GT', name: 'Guatemala', capital: 'Guatemala City', region: 'Central America', nickname: 'Land of Eternal Spring', capCoords: [-90.5069, 14.6349] },
  { id: 'BZ', name: 'Belize', capital: 'Belmopan', region: 'Central America', nickname: 'Jewel of the Caribbean & Barrier Reef', capCoords: [-88.7590, 17.2510] },
  { id: 'HN', name: 'Honduras', capital: 'Tegucigalpa', region: 'Central America', nickname: 'Heart of Central America & Copán', capCoords: [-87.1921, 14.0723] },
  { id: 'SV', name: 'El Salvador', capital: 'San Salvador', region: 'Central America', nickname: 'The Land of Volcanoes', capCoords: [-89.2182, 13.6929] },
  { id: 'NI', name: 'Nicaragua', capital: 'Managua', region: 'Central America', nickname: 'Land of Lakes and Volcanoes', capCoords: [-86.2362, 12.1150] },
  { id: 'CR', name: 'Costa Rica', capital: 'San José', region: 'Central America', nickname: 'The Rich Coast & Pura Vida', capCoords: [-84.0907, 9.9281] },
  { id: 'PA', name: 'Panama', capital: 'Panama City', region: 'Central America', nickname: 'Bridge of the World & The Canal', capCoords: [-79.5199, 8.9824] },

  // Caribbean (13)
  { id: 'CU', name: 'Cuba', capital: 'Havana', region: 'Caribbean', nickname: 'Pearl of the Antilles', capCoords: [-82.3666, 23.1136] },
  { id: 'JM', name: 'Jamaica', capital: 'Kingston', region: 'Caribbean', nickname: 'Land of Wood and Water & Reggae', capCoords: [-76.7928, 17.9712] },
  { id: 'HT', name: 'Haiti', capital: 'Port-au-Prince', region: 'Caribbean', nickname: 'Pearl of the Caribbean', capCoords: [-72.3074, 18.5944] },
  { id: 'DO', name: 'Dominican Republic', capital: 'Santo Domingo', region: 'Caribbean', nickname: 'The Cradle of the Americas', capCoords: [-69.9312, 18.4861] },
  { id: 'BS', name: 'Bahamas', capital: 'Nassau', region: 'Caribbean', nickname: 'Islands of the Shallows & Clear Waters', capCoords: [-77.3504, 25.0443] },
  { id: 'TT', name: 'Trinidad and Tobago', capital: 'Port of Spain', region: 'Caribbean', nickname: 'Land of the Hummingbird & Calypso', capCoords: [-61.5019, 10.6549] },
  { id: 'BB', name: 'Barbados', capital: 'Bridgetown', region: 'Caribbean', nickname: 'Little England of the Caribbean', capCoords: [-59.5432, 13.1939] },
  { id: 'LC', name: 'Saint Lucia', capital: 'Castries', region: 'Caribbean', nickname: 'Helen of the West Indies & Pitons', capCoords: [-60.9875, 14.0101] },
  { id: 'VC', name: 'Saint Vincent and the Grenadines', capital: 'Kingstown', region: 'Caribbean', nickname: 'The Jewels of the Caribbean', capCoords: [-61.2248, 13.1600] },
  { id: 'GD', name: 'Grenada', capital: 'St. George\'s', region: 'Caribbean', nickname: 'The Spice Isle of the Caribbean', capCoords: [-61.7488, 12.0561] },
  { id: 'AG', name: 'Antigua and Barbuda', capital: 'St. John\'s', region: 'Caribbean', nickname: 'Land of 365 Beaches', capCoords: [-61.8468, 17.1274] },
  { id: 'DM', name: 'Dominica', capital: 'Roseau', region: 'Caribbean', nickname: 'Nature Isle of the Caribbean', capCoords: [-61.3794, 15.3092] },
  { id: 'KN', name: 'Saint Kitts and Nevis', capital: 'Basseterre', region: 'Caribbean', nickname: 'Sugar City of the West Indies', capCoords: [-62.7177, 17.3026] },

  // Andean Region (5)
  { id: 'CO', name: 'Colombia', capital: 'Bogotá', region: 'Andean Region', nickname: 'Gateway to South America & Land of Coffee', capCoords: [-74.0721, 4.7110] },
  { id: 'VE', name: 'Venezuela', capital: 'Caracas', region: 'Andean Region', nickname: 'Land of Grace & Angel Falls', capCoords: [-66.9036, 10.4806] },
  { id: 'EC', name: 'Ecuador', capital: 'Quito', region: 'Andean Region', nickname: 'Middle of the World & Galápagos', capCoords: [-78.4678, -0.1807] },
  { id: 'PE', name: 'Peru', capital: 'Lima', region: 'Andean Region', nickname: 'Land of the Incas & Machu Picchu', capCoords: [-77.0428, -12.0464] },
  { id: 'BO', name: 'Bolivia', capital: 'Sucre', region: 'Andean Region', nickname: 'Heart of South America & Salar de Uyuni', capCoords: [-65.2619, -19.0196] },

  // Brazil & Guianas (3)
  { id: 'BR', name: 'Brazil', capital: 'Brasília', region: 'Brazil & Guianas', nickname: 'Land of the Palms, Samba & Amazonia', capCoords: [-47.8919, -15.7975] },
  { id: 'GY', name: 'Guyana', capital: 'Georgetown', region: 'Brazil & Guianas', nickname: 'Land of Many Waters & Kaieteur', capCoords: [-58.1551, 6.8013] },
  { id: 'SR', name: 'Suriname', capital: 'Paramaribo', region: 'Brazil & Guianas', nickname: 'Greenest Country on Earth', capCoords: [-55.2038, 5.8520] },

  // Southern Cone (4)
  { id: 'PY', name: 'Paraguay', capital: 'Asunción', region: 'Southern Cone', nickname: 'Heart of South America & Guarani', capCoords: [-57.5759, -25.2637] },
  { id: 'UY', name: 'Uruguay', capital: 'Montevideo', region: 'Southern Cone', nickname: 'The Switzerland of South America', capCoords: [-56.1645, -34.9011] },
  { id: 'AR', name: 'Argentina', capital: 'Buenos Aires', region: 'Southern Cone', nickname: 'Land of Silver, Tango & The Pampas', capCoords: [-58.3816, -34.6037] },
  { id: 'CL', name: 'Chile', capital: 'Santiago', region: 'Southern Cone', nickname: 'Land of Poets & The Long Thin Nation', capCoords: [-70.6693, -33.4489] },
];

async function run() {
  const r = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
  const worldGeo = await r.json();

  const lacFeatures = [];
  const metaMap = new Map();
  for (const m of COUNTRY_META) {
    metaMap.set(m.id, m);
  }

  for (const feat of worldGeo.features) {
    const code = feat.properties['ISO3166-1-Alpha-2'];
    if (metaMap.has(code)) {
      feat.id = code;
      lacFeatures.push(feat);
    }
  }

  console.log(`Found ${lacFeatures.length} features for ${COUNTRY_META.length} countries`);

  // Target canvas: width 960, height 720
  const width = 960;
  const height = 720;
  const padding = 25;

  // Let's create an Equirectangular or Mercator projection centered around -68° Lon, -14° Lat
  const featureCollection = { type: 'FeatureCollection', features: lacFeatures };
  
  // Test projections
  const projection = d3.geoMercator()
    .fitExtent([[padding, padding], [width - padding, height - padding]], featureCollection);

  const pathGenerator = d3.geoPath(projection);

  // Check bounds
  const [[x0, y0], [x1, y1]] = pathGenerator.bounds(featureCollection);
  console.log(`Bounds: [${x0.toFixed(1)}, ${y0.toFixed(1)}] to [${x1.toFixed(1)}, ${y1.toFixed(1)}]`);

  for (const meta of COUNTRY_META) {
    const [cx, cy] = projection(meta.capCoords);
    console.log(`${meta.id} (${meta.name}) capital ${meta.capital} -> [${cx.toFixed(1)}, ${cy.toFixed(1)}]`);
  }
}

run();
