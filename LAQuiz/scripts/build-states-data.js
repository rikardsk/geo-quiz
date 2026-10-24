import fs from 'node:fs';
import * as d3 from 'd3-geo';

const COUNTRIES = [
  // Central America (8)
  {
    id: 'MX',
    name: 'Mexico',
    capital: 'Mexico City',
    region: 'Central America',
    nickname: 'Land of the Mayas, Aztecs & Mariachi',
    capCoords: [-99.1332, 19.4326],
  },
  {
    id: 'GT',
    name: 'Guatemala',
    capital: 'Guatemala City',
    region: 'Central America',
    nickname: 'Land of Eternal Spring',
    capCoords: [-90.5069, 14.6349],
  },
  {
    id: 'BZ',
    name: 'Belize',
    capital: 'Belmopan',
    region: 'Central America',
    nickname: 'Jewel of the Caribbean & Barrier Reef',
    capCoords: [-88.7590, 17.2510],
  },
  {
    id: 'HN',
    name: 'Honduras',
    capital: 'Tegucigalpa',
    region: 'Central America',
    nickname: 'Heart of Central America & Copán',
    capCoords: [-87.1921, 14.0723],
  },
  {
    id: 'SV',
    name: 'El Salvador',
    capital: 'San Salvador',
    region: 'Central America',
    nickname: 'The Land of Volcanoes',
    capCoords: [-89.2182, 13.6929],
  },
  {
    id: 'NI',
    name: 'Nicaragua',
    capital: 'Managua',
    region: 'Central America',
    nickname: 'Land of Lakes and Volcanoes',
    capCoords: [-86.2362, 12.1150],
  },
  {
    id: 'CR',
    name: 'Costa Rica',
    capital: 'San José',
    region: 'Central America',
    nickname: 'The Rich Coast & Pura Vida',
    capCoords: [-84.0907, 9.9281],
  },
  {
    id: 'PA',
    name: 'Panama',
    capital: 'Panama City',
    region: 'Central America',
    nickname: 'Bridge of the World & The Canal',
    capCoords: [-79.5199, 8.9824],
  },

  // Greater Antilles (5)
  {
    id: 'CU',
    name: 'Cuba',
    capital: 'Havana',
    region: 'Greater Antilles',
    nickname: 'Pearl of the Antilles',
    capCoords: [-82.3666, 23.1136],
  },
  {
    id: 'JM',
    name: 'Jamaica',
    capital: 'Kingston',
    region: 'Greater Antilles',
    nickname: 'Land of Wood and Water & Reggae',
    capCoords: [-76.7928, 17.9712],
  },
  {
    id: 'HT',
    name: 'Haiti',
    capital: 'Port-au-Prince',
    region: 'Greater Antilles',
    nickname: 'Pearl of the Caribbean',
    capCoords: [-72.3074, 18.5944],
  },
  {
    id: 'DO',
    name: 'Dominican Republic',
    capital: 'Santo Domingo',
    region: 'Greater Antilles',
    nickname: 'The Cradle of the Americas',
    capCoords: [-69.9312, 18.4861],
  },
  {
    id: 'BS',
    name: 'Bahamas',
    capital: 'Nassau',
    region: 'Greater Antilles',
    nickname: 'Islands of the Shallows & Clear Waters',
    capCoords: [-77.3504, 25.0443],
  },

  // Lesser Antilles (8)
  {
    id: 'KN',
    name: 'Saint Kitts and Nevis',
    capital: 'Basseterre',
    region: 'Lesser Antilles',
    nickname: 'Sugar City of the West Indies',
    capCoords: [-62.7177, 17.3026],
    isSmallIsland: true,
  },
  {
    id: 'AG',
    name: 'Antigua and Barbuda',
    capital: "St. John's",
    region: 'Lesser Antilles',
    nickname: 'Land of 365 Beaches',
    capCoords: [-61.8468, 17.1274],
    isSmallIsland: true,
  },
  {
    id: 'DM',
    name: 'Dominica',
    capital: 'Roseau',
    region: 'Lesser Antilles',
    nickname: 'Nature Isle of the Caribbean',
    capCoords: [-61.3794, 15.3092],
    isSmallIsland: true,
  },
  {
    id: 'LC',
    name: 'Saint Lucia',
    capital: 'Castries',
    region: 'Lesser Antilles',
    nickname: 'Helen of the West Indies & Pitons',
    capCoords: [-60.9875, 14.0101],
    isSmallIsland: true,
  },
  {
    id: 'VC',
    name: 'Saint Vincent and the Grenadines',
    capital: 'Kingstown',
    region: 'Lesser Antilles',
    nickname: 'The Jewels of the Caribbean',
    capCoords: [-61.2248, 13.1600],
    isSmallIsland: true,
  },
  {
    id: 'BB',
    name: 'Barbados',
    capital: 'Bridgetown',
    region: 'Lesser Antilles',
    nickname: 'Little England of the Caribbean',
    capCoords: [-59.5432, 13.1939],
    isSmallIsland: true,
  },
  {
    id: 'GD',
    name: 'Grenada',
    capital: "St. George's",
    region: 'Lesser Antilles',
    nickname: 'The Spice Isle of the Caribbean',
    capCoords: [-61.7488, 12.0561],
    isSmallIsland: true,
  },
  {
    id: 'TT',
    name: 'Trinidad and Tobago',
    capital: 'Port of Spain',
    region: 'Lesser Antilles',
    nickname: 'Land of the Hummingbird & Calypso',
    capCoords: [-61.5019, 10.6549],
  },
];

const REGION_COLORS = {
  'Central America': { bg: '#38bdf8', text: '#0369a1', badge: 'bg-sky-100 text-sky-800' },
  'Greater Antilles': { bg: '#fbbf24', text: '#b45309', badge: 'bg-amber-100 text-amber-800' },
  'Lesser Antilles': { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
};

function roundPath(d, precision = 1) {
  if (!d) return '';
  return d.replace(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi, (num) => {
    const val = parseFloat(num);
    return isNaN(val) ? num : val.toFixed(precision);
  });
}

async function main() {
  let worldGeo;
  if (fs.existsSync('scripts/countries.geojson')) {
    worldGeo = JSON.parse(fs.readFileSync('scripts/countries.geojson', 'utf8'));
  } else {
    const r = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
    worldGeo = await r.json();
  }

  const codeMap = new Map();
  for (const c of COUNTRIES) {
    codeMap.set(c.id, c);
  }

  const lacFeatures = [];
  for (const f of worldGeo.features) {
    const code = f.properties['ISO3166-1-Alpha-2'];
    if (codeMap.has(code)) {
      f.id = code;
      lacFeatures.push(f);
    }
  }

  const featureCollection = { type: 'FeatureCollection', features: lacFeatures };

  // Canvas size: 959 x 593 (matching StateQuiz exactly)
  const width = 959;
  const height = 593;
  const paddingX = 18;
  const paddingY = 18;

  const projection = d3.geoConicConformal()
    .parallels([12, 26])
    .rotate([85, 0])
    .fitExtent([[paddingX, paddingY], [width - paddingX, height - paddingY]], featureCollection);

  const pathGenerator = d3.geoPath(projection);

  // Background features: United States (US), Colombia (CO), Venezuela (VE), Puerto Rico (PR)
  const bgCodes = ['US', 'CO', 'VE', 'PR'];
  const bgFeatures = worldGeo.features.filter(f => bgCodes.includes(f.properties['ISO3166-1-Alpha-2']));

  const backgroundPaths = bgFeatures.map(f => {
    const code = f.properties['ISO3166-1-Alpha-2'];
    const d = roundPath(pathGenerator(f));
    return { id: code, name: f.properties.name, d };
  }).filter(p => p.d && p.d.length > 0);

  // Build country items
  const states = [];
  const capitalsJson = {};

  for (const meta of COUNTRIES) {
    const feat = lacFeatures.find(f => f.id === meta.id);
    if (!feat) {
      console.error('Feature not found for:', meta.id);
      continue;
    }

    const rawD = pathGenerator(feat);
    const d = roundPath(rawD);

    const [cx, cy] = projection(meta.capCoords);
    const capitalCoordinates = {
      x: parseFloat(cx.toFixed(1)),
      y: parseFloat(cy.toFixed(1)),
    };

    capitalsJson[meta.id] = capitalCoordinates;

    const color = REGION_COLORS[meta.region]?.bg || '#38bdf8';

    states.push({
      id: meta.id,
      name: meta.name,
      capital: meta.capital,
      region: meta.region,
      nickname: meta.nickname,
      color,
      d,
      capitalCoordinates,
      isSmallIsland: meta.isSmallIsland || false,
    });
  }

  // Generate statesData.ts
  const statesDataTs = `// Generated Central America & Caribbean Countries & Capitals Dataset with SVG Path definitions
export interface USState {
  id: string;
  name: string;
  capital: string;
  region: 'Central America' | 'Greater Antilles' | 'Lesser Antilles';
  nickname: string;
  color: string;
  d: string;
  capitalCoordinates: { x: number; y: number };
  isSmallIsland?: boolean;
}

export type LACCountry = USState;

export interface BorderPath {
  id: string;
  name?: string;
  d: string;
}

export const REGION_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  'Central America': { bg: '#38bdf8', text: '#0369a1', badge: 'bg-sky-100 text-sky-800' },
  'Greater Antilles': { bg: '#fbbf24', text: '#b45309', badge: 'bg-amber-100 text-amber-800' },
  'Lesser Antilles': { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
};

export const BACKGROUND_PATHS: BorderPath[] = ${JSON.stringify(backgroundPaths, null, 2)};

export const BORDER_PATHS: BorderPath[] = [];

export const SEPARATOR_PATH = '';

export const US_STATES: USState[] = ${JSON.stringify(states, null, 2)};

export const LAC_COUNTRIES = US_STATES;
`;

  fs.writeFileSync('c:/Projects/LAQuiz/src/data/statesData.ts', statesDataTs);
  fs.writeFileSync('c:/Projects/LAQuiz/src/data/capitalCoordinates.json', JSON.stringify(capitalsJson, null, 2));

  console.log(`Successfully generated statesData.ts with ${states.length} countries and ${backgroundPaths.length} background paths`);
}

main();
