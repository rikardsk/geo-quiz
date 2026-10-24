import fs from 'node:fs';
import * as d3 from 'd3-geo';

const COUNTRIES = [
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
    name: 'Timor-Leste',
    capital: 'Dili',
    region: 'Southeast Asia',
    nickname: 'The Sleeping Crocodile & Land of the Rising Sun',
    capCoords: [125.5736, -8.5569],
    isSmallIsland: true,
  },

  // Oceania (14)
  {
    id: 'AU',
    name: 'Australia',
    capital: 'Canberra',
    region: 'Oceania',
    nickname: 'The Land Down Under & The Sunburnt Country',
    capCoords: [149.1300, -35.2809],
  },
  {
    id: 'NZ',
    name: 'New Zealand',
    capital: 'Wellington',
    region: 'Oceania',
    nickname: 'Land of the Long White Cloud & Aotearoa',
    capCoords: [174.7762, -41.2865],
  },
  {
    id: 'PG',
    name: 'Papua New Guinea',
    capital: 'Port Moresby',
    region: 'Oceania',
    nickname: 'Land of a Thousand Tribes & Birds of Paradise',
    capCoords: [147.1803, -9.4438],
  },
  {
    id: 'FJ',
    name: 'Fiji',
    capital: 'Suva',
    region: 'Oceania',
    nickname: 'The Soft Coral Capital & Pearl of the South Pacific',
    capCoords: [178.4419, -18.1416],
  },
  {
    id: 'SB',
    name: 'Solomon Islands',
    capital: 'Honiara',
    region: 'Oceania',
    nickname: 'The Hapi Isles & Archipelago of Iron Bottom Sound',
    capCoords: [159.9729, -9.4456],
  },
  {
    id: 'VU',
    name: 'Vanuatu',
    capital: 'Port Vila',
    region: 'Oceania',
    nickname: 'Land of Eternal Smiles & Realm of Mt. Yasur',
    capCoords: [168.3273, -17.7333],
  },
  {
    id: 'WS',
    name: 'Samoa',
    capital: 'Apia',
    region: 'Oceania',
    nickname: 'Cradle of Polynesia & The Sacred Center',
    capCoords: [-171.7667, -13.8333],
    isSmallIsland: true,
  },
  {
    id: 'KI',
    name: 'Kiribati',
    capital: 'South Tarawa',
    region: 'Oceania',
    nickname: 'Where the Day Begins & Realm of Three Time Zones',
    capCoords: [172.9750, 1.3300],
    isSmallIsland: true,
  },
  {
    id: 'TO',
    name: 'Tonga',
    capital: "Nuku'alofa",
    region: 'Oceania',
    nickname: "The Friendly Islands & Polynesia's Only Kingdom",
    capCoords: [-175.2018, -21.1393],
    isSmallIsland: true,
  },
  {
    id: 'FM',
    name: 'Micronesia',
    capital: 'Palikir',
    region: 'Oceania',
    nickname: 'Island Realm of Nan Madol & The Four Star Atolls',
    capCoords: [158.1611, 6.9178],
    isSmallIsland: true,
  },
  {
    id: 'MH',
    name: 'Marshall Islands',
    capital: 'Majuro',
    region: 'Oceania',
    nickname: 'Jewel of the Ralik and Ratak Chains',
    capCoords: [171.3800, 7.1000],
    isSmallIsland: true,
  },
  {
    id: 'PW',
    name: 'Palau',
    capital: 'Ngerulmud',
    region: 'Oceania',
    nickname: 'The Rock Islands Wonder & Pristine Underwater Paradise',
    capCoords: [134.6242, 7.5004],
    isSmallIsland: true,
  },
  {
    id: 'NR',
    name: 'Nauru',
    capital: 'Yaren',
    region: 'Oceania',
    nickname: 'Pleasant Island & Smallest Island Republic in the World',
    capCoords: [166.9211, -0.5477],
    isSmallIsland: true,
  },
  {
    id: 'TV',
    name: 'Tuvalu',
    capital: 'Funafuti',
    region: 'Oceania',
    nickname: 'Eight Standing Together & Pacific Coral Haven',
    capCoords: [179.1942, -8.5211],
    isSmallIsland: true,
  },
];

const REGION_COLORS = {
  'Southeast Asia': { bg: '#38bdf8', text: '#0369a1', badge: 'bg-sky-100 text-sky-800' },
  'Oceania': { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
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

  const quizFeatures = [];
  for (const c of COUNTRIES) {
    const feat = worldGeo.features.find((f) => f.properties['ISO3166-1-Alpha-2'] === c.id);
    if (feat) {
      const cloned = JSON.parse(JSON.stringify(feat));
      cloned.id = c.id;
      quizFeatures.push(cloned);
    } else {
      console.error('Feature missing for:', c.id);
    }
  }

  const featureCollection = { type: 'FeatureCollection', features: quizFeatures };

  // Canvas size: 959 x 593 (consistent with StateQuiz)
  const width = 959;
  const height = 593;
  const paddingX = 35;
  const paddingY = 25;

  const projection = d3
    .geoEquirectangular()
    .rotate([-145, 0])
    .fitExtent(
      [
        [paddingX, paddingY],
        [width - paddingX, height - paddingY],
      ],
      featureCollection
    );

  const pathGenerator = d3.geoPath(projection);

  // Background features: surrounding nations & territories
  const bgCodes = [
    'CN', 'IN', 'BD', 'TW', 'JP', 'NC', 'PF', 'GU', 'MP', 'AS', 'CK', 'NU', 'WF'
  ];
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
  const statesDataTs = `// Generated South East Asia & Oceania Countries & Capitals Dataset with SVG Path definitions
export interface USState {
  id: string;
  name: string;
  capital: string;
  region: 'Southeast Asia' | 'Oceania';
  nickname: string;
  color: string;
  d: string;
  capitalCoordinates: { x: number; y: number };
  isSmallIsland?: boolean;
}

export type OceaniaCountry = USState;
export type AsiaCountry = USState;

export interface BorderPath {
  id: string;
  name?: string;
  d: string;
}

export const REGION_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  'Southeast Asia': { bg: '#38bdf8', text: '#0369a1', badge: 'bg-sky-100 text-sky-800' },
  'Oceania': { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
};

export const BACKGROUND_PATHS: BorderPath[] = ${JSON.stringify(backgroundPaths, null, 2)};

export const BORDER_PATHS: BorderPath[] = [];

export const SEPARATOR_PATH = '';

export const US_STATES: USState[] = ${JSON.stringify(states, null, 2)};

export const OCEANIA_COUNTRIES = US_STATES;
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
