import fs from 'node:fs';
import * as d3 from 'd3-geo';

const COUNTRIES = [
  // East Asia (6)
  {
    id: 'CN',
    name: 'China',
    capital: 'Beijing',
    region: 'East Asia',
    nickname: 'Land of the Dragon & Ancient Middle Kingdom',
    capCoords: [116.4074, 39.9042],
  },
  {
    id: 'JP',
    name: 'Japan',
    capital: 'Tokyo',
    region: 'East Asia',
    nickname: 'Land of the Rising Sun & Realm of Cherry Blossoms',
    capCoords: [139.6917, 35.6895],
  },
  {
    id: 'KR',
    name: 'South Korea',
    capital: 'Seoul',
    region: 'East Asia',
    nickname: 'Land of the Morning Calm & Dynamic Han River Miracle',
    capCoords: [126.9780, 37.5665],
  },
  {
    id: 'KP',
    name: 'North Korea',
    capital: 'Pyongyang',
    region: 'East Asia',
    nickname: 'The Hermit Kingdom & Land of Morning Freshness',
    capCoords: [125.7625, 39.0392],
  },
  {
    id: 'MN',
    name: 'Mongolia',
    capital: 'Ulaanbaatar',
    region: 'East Asia',
    nickname: 'Land of the Eternal Blue Sky & Nomadic Steppes',
    capCoords: [106.9176, 47.9214],
  },
  {
    id: 'TW',
    geoId: 'CN-TW',
    name: 'Taiwan',
    capital: 'Taipei',
    region: 'East Asia',
    nickname: 'Ilha Formosa & The Beautiful Island',
    capCoords: [121.5654, 25.0330],
  },

  // Southeast Asia (11)
  {
    id: 'VN',
    name: 'Vietnam',
    capital: 'Hanoi',
    region: 'Southeast Asia',
    nickname: 'Land of the Ascending Dragon & Ha Long Marvel',
    capCoords: [105.8542, 21.0285],
  },
  {
    id: 'TH',
    name: 'Thailand',
    capital: 'Bangkok',
    region: 'Southeast Asia',
    nickname: 'Land of Smiles & The Golden Kingdom of Siam',
    capCoords: [100.5018, 13.7563],
  },
  {
    id: 'ID',
    name: 'Indonesia',
    capital: 'Jakarta',
    region: 'Southeast Asia',
    nickname: 'The Emerald of the Equator & Archipelago of 17,000 Islands',
    capCoords: [106.8456, -6.2088],
  },
  {
    id: 'PH',
    name: 'Philippines',
    capital: 'Manila',
    region: 'Southeast Asia',
    nickname: 'Pearl of the Orient Seas & Tropical Archipelago',
    capCoords: [120.9842, 14.5995],
  },
  {
    id: 'MY',
    name: 'Malaysia',
    capital: 'Kuala Lumpur',
    region: 'Southeast Asia',
    nickname: 'Truly Asia & Rainforest Kingdom of Hornbills',
    capCoords: [101.6869, 3.1390],
  },
  {
    id: 'SG',
    name: 'Singapore',
    capital: 'Singapore',
    region: 'Southeast Asia',
    nickname: 'The Lion City & Global Garden Metropolis',
    capCoords: [103.8198, 1.3521],
    isSmallIsland: true,
  },
  {
    id: 'MM',
    name: 'Myanmar',
    capital: 'Naypyidaw',
    region: 'Southeast Asia',
    nickname: 'The Golden Land & Realm of Shwedagon Pagodas',
    capCoords: [96.0785, 19.7633],
  },
  {
    id: 'KH',
    name: 'Cambodia',
    capital: 'Phnom Penh',
    region: 'Southeast Asia',
    nickname: 'Kingdom of Wonder & Empire of Angkor Wat',
    capCoords: [104.9282, 11.5564],
  },
  {
    id: 'LA',
    name: 'Laos',
    capital: 'Vientiane',
    region: 'Southeast Asia',
    nickname: 'Land of a Million Elephants & Mekong Tranquility',
    capCoords: [102.6331, 17.9757],
  },
  {
    id: 'BN',
    name: 'Brunei',
    capital: 'Bandar Seri Begawan',
    region: 'Southeast Asia',
    nickname: 'The Abode of Peace & Rainforest Treasure of Borneo',
    capCoords: [114.9481, 4.9031],
    isSmallIsland: true,
  },
  {
    id: 'TL',
    geoId: 'TL',
    name: 'Timor-Leste',
    capital: 'Dili',
    region: 'Southeast Asia',
    nickname: 'The Sleeping Crocodile & Land of the Rising Sun',
    capCoords: [125.5736, -8.5569],
    isSmallIsland: true,
  },
];

const REGION_COLORS = {
  'East Asia': { bg: '#60a5fa', text: '#1d4ed8', badge: 'bg-blue-100 text-blue-800' },
  'Southeast Asia': { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
};

function roundPath(d, precision = 1) {
  if (!d) return '';
  return d.replace(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi, (num) => {
    const val = parseFloat(num);
    return isNaN(val) ? num : val.toFixed(precision);
  });
}

async function main() {
  const geojsonPath = 'scripts/countries.geojson';
  const worldGeo = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

  // Merge HK and MO into China for a seamless coastline
  const cnFeat = worldGeo.features.find((f) => f.properties['ISO3166-1-Alpha-2'] === 'CN');
  const hkFeat = worldGeo.features.find((f) => f.properties['ISO3166-1-Alpha-2'] === 'HK');
  const moFeat = worldGeo.features.find((f) => f.properties['ISO3166-1-Alpha-2'] === 'MO');

  const cnCoords = [...cnFeat.geometry.coordinates];
  if (hkFeat) cnCoords.push(...hkFeat.geometry.coordinates);
  if (moFeat) cnCoords.push(...moFeat.geometry.coordinates);

  const quizFeatures = [];
  for (const c of COUNTRIES) {
    if (c.id === 'CN') {
      quizFeatures.push({
        type: 'Feature',
        id: 'CN',
        properties: cnFeat.properties,
        geometry: {
          type: 'MultiPolygon',
          coordinates: cnCoords,
        },
      });
    } else {
      const code = c.geoId || c.id;
      const feat = worldGeo.features.find((f) => f.properties['ISO3166-1-Alpha-2'] === code);
      if (feat) {
        // Deep clone so id override doesn't mutate original
        const cloned = JSON.parse(JSON.stringify(feat));
        cloned.id = c.id;
        quizFeatures.push(cloned);
      } else {
        console.error('Feature missing for:', c.id, code);
      }
    }
  }

  const featureCollection = { type: 'FeatureCollection', features: quizFeatures };

  // Canvas size: 959 x 593 (matching StateQuiz and AfricaSouthQuiz)
  const width = 959;
  const height = 593;
  const paddingX = 35;
  const paddingY = 25;

  const projection = d3
    .geoConicEqualArea()
    .parallels([-5, 40])
    .rotate([-112, 0])
    .fitExtent(
      [
        [paddingX, paddingY],
        [width - paddingX, height - paddingY],
      ],
      featureCollection
    );

  const pathGenerator = d3.geoPath(projection);

  // Background features: surrounding Russia, Central Asia, South Asia, Australasia
  const bgCodes = ['RU', 'IN', 'BD', 'NP', 'BT', 'KZ', 'KG', 'TJ', 'PK', 'AF', 'PG', 'AU', 'LK'];
  const bgFeatures = worldGeo.features.filter((f) =>
    bgCodes.includes(f.properties['ISO3166-1-Alpha-2'])
  );

  const backgroundPaths = bgFeatures
    .map((f) => {
      const code = f.properties['ISO3166-1-Alpha-2'];
      const d = roundPath(pathGenerator(f));
      return { id: code, name: f.properties.name, d };
    })
    .filter((p) => p.d && p.d.length > 0);

  // Build country items
  const states = [];
  const capitalsJson = {};

  for (const meta of COUNTRIES) {
    const feat = quizFeatures.find((f) => f.id === meta.id);
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

    const color = REGION_COLORS[meta.region]?.bg || '#60a5fa';

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
  const statesDataTs = `// Generated South & East Asia Countries & Capitals Dataset with SVG Path definitions
export interface USState {
  id: string;
  name: string;
  capital: string;
  region: 'East Asia' | 'Southeast Asia';
  nickname: string;
  color: string;
  d: string;
  capitalCoordinates: { x: number; y: number };
  isSmallIsland?: boolean;
}

export type AsiaCountry = USState;

export interface BorderPath {
  id: string;
  name?: string;
  d: string;
}

export const REGION_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  'East Asia': { bg: '#60a5fa', text: '#1d4ed8', badge: 'bg-blue-100 text-blue-800' },
  'Southeast Asia': { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
};

export const BACKGROUND_PATHS: BorderPath[] = ${JSON.stringify(backgroundPaths, null, 2)};

export const BORDER_PATHS: BorderPath[] = [];

export const SEPARATOR_PATH = '';

export const US_STATES: USState[] = ${JSON.stringify(states, null, 2)};

export const ASIA_COUNTRIES = US_STATES;
`;

  fs.mkdirSync('src/data', { recursive: true });
  fs.writeFileSync('src/data/statesData.ts', statesDataTs);
  fs.writeFileSync('src/data/capitalCoordinates.json', JSON.stringify(capitalsJson, null, 2));

  console.log(
    `Successfully generated statesData.ts with ${states.length} countries and ${backgroundPaths.length} background paths`
  );
}

main().catch(console.error);
