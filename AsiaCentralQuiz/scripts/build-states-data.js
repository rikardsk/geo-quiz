import fs from 'node:fs';
import * as d3 from 'd3-geo';

const COUNTRIES = [
  // Central Asia (6)
  {
    id: 'KZ',
    name: 'Kazakhstan',
    capital: 'Astana',
    region: 'Central Asia',
    nickname: 'Land of the Great Steppe & Cradle of Nomads',
    capCoords: [71.4491, 51.1694],
  },
  {
    id: 'UZ',
    name: 'Uzbekistan',
    capital: 'Tashkent',
    region: 'Central Asia',
    nickname: 'Heart of the Silk Road & Jewel of Samarkand',
    capCoords: [69.2401, 41.2995],
  },
  {
    id: 'TM',
    name: 'Turkmenistan',
    capital: 'Ashgabat',
    region: 'Central Asia',
    nickname: 'City of White Marble & Land of the Karakum',
    capCoords: [58.3838, 37.9601],
  },
  {
    id: 'KG',
    name: 'Kyrgyzstan',
    capital: 'Bishkek',
    region: 'Central Asia',
    nickname: 'Land of the Celestial Mountains & Tian Shan',
    capCoords: [74.5698, 42.8746],
  },
  {
    id: 'TJ',
    name: 'Tajikistan',
    capital: 'Dushanbe',
    region: 'Central Asia',
    nickname: 'Roof of the World & Pamir Mountain Realm',
    capCoords: [68.7864, 38.5598],
  },
  {
    id: 'AF',
    name: 'Afghanistan',
    capital: 'Kabul',
    region: 'Central Asia',
    nickname: 'Graveyard of Empires & Crossroads of Central Asia',
    capCoords: [69.1723, 34.5553],
  },

  // South Asia (7)
  {
    id: 'IN',
    name: 'India',
    capital: 'New Delhi',
    region: 'South Asia',
    nickname: 'Land of Ahimsa & Vibrant Subcontinent',
    capCoords: [77.2090, 28.6139],
  },
  {
    id: 'PK',
    name: 'Pakistan',
    capital: 'Islamabad',
    region: 'South Asia',
    nickname: 'Land of the Pure & Indus Valley Civilization',
    capCoords: [73.0479, 33.6844],
  },
  {
    id: 'BD',
    name: 'Bangladesh',
    capital: 'Dhaka',
    region: 'South Asia',
    nickname: 'Land of the Bengal Tiger & Riverine Delta',
    capCoords: [90.4125, 23.8103],
  },
  {
    id: 'NP',
    name: 'Nepal',
    capital: 'Kathmandu',
    region: 'South Asia',
    nickname: 'Realm of Mount Everest & Abode of the Gods',
    capCoords: [85.3240, 27.7172],
  },
  {
    id: 'BT',
    name: 'Bhutan',
    capital: 'Thimphu',
    region: 'South Asia',
    nickname: 'Land of the Thunder Dragon & Kingdom of Happiness',
    capCoords: [89.6393, 27.4728],
  },
  {
    id: 'LK',
    name: 'Sri Lanka',
    capital: 'Sri Jayawardenepura Kotte',
    region: 'South Asia',
    nickname: 'Pearl of the Indian Ocean & Teardrop of India',
    capCoords: [79.9018, 6.9016],
  },
  {
    id: 'MV',
    name: 'Maldives',
    capital: 'Malé',
    region: 'South Asia',
    nickname: 'Sunny Side of Life & Coral Atoll Paradise',
    capCoords: [73.5093, 4.1755],
    isSmallIsland: true,
  },
];

const REGION_COLORS = {
  'Central Asia': { bg: '#60a5fa', text: '#1d4ed8', badge: 'bg-blue-100 text-blue-800' },
  'South Asia': { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
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

  // Merge Baykonur into Kazakhstan
  const kzFeat = worldGeo.features.find((f) => f.properties['ISO3166-1-Alpha-2'] === 'KZ');
  const bkFeat = worldGeo.features.find((f) => (f.properties.name || '').includes('Baykonur'));
  const kzCoords = [...kzFeat.geometry.coordinates];
  if (bkFeat) kzCoords.push(bkFeat.geometry.coordinates);

  // Merge Siachen into India
  const inFeat = worldGeo.features.find((f) => f.properties['ISO3166-1-Alpha-2'] === 'IN');
  const sgFeat = worldGeo.features.find((f) => (f.properties.name || '').includes('Siachen'));
  const inCoords = [...inFeat.geometry.coordinates];
  if (sgFeat) inCoords.push(sgFeat.geometry.coordinates);

  const quizFeatures = [];
  for (const c of COUNTRIES) {
    if (c.id === 'KZ') {
      quizFeatures.push({
        type: 'Feature',
        id: 'KZ',
        properties: kzFeat.properties,
        geometry: {
          type: 'MultiPolygon',
          coordinates: kzCoords,
        },
      });
    } else if (c.id === 'IN') {
      quizFeatures.push({
        type: 'Feature',
        id: 'IN',
        properties: inFeat.properties,
        geometry: {
          type: 'MultiPolygon',
          coordinates: inCoords,
        },
      });
    } else {
      const feat = worldGeo.features.find((f) => f.properties['ISO3166-1-Alpha-2'] === c.id);
      if (feat) {
        const cloned = JSON.parse(JSON.stringify(feat));
        cloned.id = c.id;
        quizFeatures.push(cloned);
      } else {
        console.error('Feature missing for:', c.id);
      }
    }
  }

  const featureCollection = { type: 'FeatureCollection', features: quizFeatures };

  // Canvas size: 959 x 593 (consistent with StateQuiz)
  const width = 959;
  const height = 593;
  const paddingX = 35;
  const paddingY = 25;

  const projection = d3
    .geoConicEqualArea()
    .parallels([10, 48])
    .rotate([-75, 0])
    .fitExtent(
      [
        [paddingX, paddingY],
        [width - paddingX, height - paddingY],
      ],
      featureCollection
    );

  const pathGenerator = d3.geoPath(projection);

  // Background features: surrounding nations
  const bgCodes = [
    'RU', 'CN', 'MN', 'IR', 'MM', 'TH', 'LA', 'VN', 'MY', 'ID',
    'OM', 'AE', 'SA', 'YE', 'IQ', 'SY', 'TR', 'GE', 'AM', 'AZ'
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
  const statesDataTs = `// Generated South & Central Asia Countries & Capitals Dataset with SVG Path definitions
export interface USState {
  id: string;
  name: string;
  capital: string;
  region: 'Central Asia' | 'South Asia';
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
  'Central Asia': { bg: '#60a5fa', text: '#1d4ed8', badge: 'bg-blue-100 text-blue-800' },
  'South Asia': { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
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
