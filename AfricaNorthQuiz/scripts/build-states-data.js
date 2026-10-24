import fs from 'node:fs';
import * as d3 from 'd3-geo';

const COUNTRIES = [
  // North Africa (6)
  {
    id: 'DZ',
    name: 'Algeria',
    capital: 'Algiers',
    region: 'North Africa',
    nickname: 'Land of the Fennec Fox & the Atlas Mountains',
    capCoords: [3.0588, 36.7538],
  },
  {
    id: 'EG',
    name: 'Egypt',
    capital: 'Cairo',
    region: 'North Africa',
    nickname: 'The Gift of the Nile & Land of the Pharaohs',
    capCoords: [31.2357, 30.0444],
  },
  {
    id: 'LY',
    name: 'Libya',
    capital: 'Tripoli',
    region: 'North Africa',
    nickname: 'Bride of the Sea & Land of Sahara Dunes',
    capCoords: [13.1913, 32.8872],
  },
  {
    id: 'MA',
    name: 'Morocco',
    capital: 'Rabat',
    region: 'North Africa',
    nickname: 'Kingdom of Light & Gateway to the Sahara',
    capCoords: [-6.8498, 34.0209],
  },
  {
    id: 'SD',
    name: 'Sudan',
    capital: 'Khartoum',
    region: 'North Africa',
    nickname: 'Confluence of the Niles & Land of Nubian Pyramids',
    capCoords: [32.5599, 15.5007],
  },
  {
    id: 'TN',
    name: 'Tunisia',
    capital: 'Tunis',
    region: 'North Africa',
    nickname: 'Cradle of Carthage & Jasmine Coast',
    capCoords: [10.1815, 36.8065],
  },

  // West Africa (16)
  {
    id: 'BJ',
    name: 'Benin',
    capital: 'Porto-Novo',
    region: 'West Africa',
    nickname: 'Cradle of Vodun & Historic Kingdom of Dahomey',
    capCoords: [2.6323, 6.4969],
  },
  {
    id: 'BF',
    name: 'Burkina Faso',
    capital: 'Ouagadougou',
    region: 'West Africa',
    nickname: 'Land of Incorruptible People & Film Capital of Africa',
    capCoords: [-1.5197, 12.3714],
  },
  {
    id: 'CV',
    name: 'Cabo Verde',
    capital: 'Praia',
    region: 'West Africa',
    nickname: 'Islands of Morna, Sun & Atlantic Harmony',
    capCoords: [-23.5087, 14.9330],
    isSmallIsland: true,
  },
  {
    id: 'CI',
    name: "Côte d'Ivoire",
    capital: 'Yamoussoukro',
    region: 'West Africa',
    nickname: 'World Capital of Cocoa & The Elephant Coast',
    capCoords: [-5.2767, 6.8276],
  },
  {
    id: 'GM',
    name: 'The Gambia',
    capital: 'Banjul',
    region: 'West Africa',
    nickname: 'The Smiling Coast of Africa & River Republic',
    capCoords: [-16.5790, 13.4549],
  },
  {
    id: 'GH',
    name: 'Ghana',
    capital: 'Accra',
    region: 'West Africa',
    nickname: 'The Black Star of Africa & Land of Gold Coast',
    capCoords: [-0.1870, 5.6037],
  },
  {
    id: 'GN',
    name: 'Guinea',
    capital: 'Conakry',
    region: 'West Africa',
    nickname: 'Water Tower of West Africa & Fouta Djallon',
    capCoords: [-13.6773, 9.6412],
  },
  {
    id: 'GW',
    name: 'Guinea-Bissau',
    capital: 'Bissau',
    region: 'West Africa',
    nickname: 'Land of the Bijagós Archipelago & Mangroves',
    capCoords: [-15.5984, 11.8636],
  },
  {
    id: 'LR',
    name: 'Liberia',
    capital: 'Monrovia',
    region: 'West Africa',
    nickname: "Land of Freedom & Africa's First Republic",
    capCoords: [-10.7969, 6.3005],
  },
  {
    id: 'ML',
    name: 'Mali',
    capital: 'Bamako',
    region: 'West Africa',
    nickname: 'Crossroads of Caravans & Empire of Timbuktu',
    capCoords: [-8.0029, 12.6392],
  },
  {
    id: 'MR',
    name: 'Mauritania',
    capital: 'Nouakchott',
    region: 'West Africa',
    nickname: 'Land of a Million Poets & the Eye of the Sahara',
    capCoords: [-15.9785, 18.0735],
  },
  {
    id: 'NE',
    name: 'Niger',
    capital: 'Niamey',
    region: 'West Africa',
    nickname: 'Gateway to the Sahara & Realm of the Tenere',
    capCoords: [2.1254, 13.5116],
  },
  {
    id: 'NG',
    name: 'Nigeria',
    capital: 'Abuja',
    region: 'West Africa',
    nickname: 'Giant of Africa & Pulse of Nollywood',
    capCoords: [7.4951, 9.0579],
  },
  {
    id: 'SN',
    name: 'Senegal',
    capital: 'Dakar',
    region: 'West Africa',
    nickname: "Country of Teranga & Africa's Westernmost Point",
    capCoords: [-17.4441, 14.6928],
  },
  {
    id: 'SL',
    name: 'Sierra Leone',
    capital: 'Freetown',
    region: 'West Africa',
    nickname: 'Lion Mountains & Realm of Pristine Palm Beaches',
    capCoords: [-13.2343, 8.4840],
  },
  {
    id: 'TG',
    name: 'Togo',
    capital: 'Lomé',
    region: 'West Africa',
    nickname: 'The Pearl of West Africa & Gulf of Guinea Gem',
    capCoords: [1.2167, 6.1375],
  },

  // Central Africa (5)
  {
    id: 'CM',
    name: 'Cameroon',
    capital: 'Yaoundé',
    region: 'Central Africa',
    nickname: 'Africa in Miniature & Mount Cameroon Volcano',
    capCoords: [11.5167, 3.8667],
  },
  {
    id: 'CF',
    name: 'Central African Republic',
    capital: 'Bangui',
    region: 'Central Africa',
    nickname: 'Heart of the African Continent & Wilderness Realm',
    capCoords: [18.5582, 4.3947],
  },
  {
    id: 'TD',
    name: 'Chad',
    capital: "N'Djamena",
    region: 'Central Africa',
    nickname: 'The Sahelian Crossroads & Ennedi Plateau Wonder',
    capCoords: [15.0444, 12.1348],
  },
  {
    id: 'GQ',
    name: 'Equatorial Guinea',
    capital: 'Malabo',
    region: 'Central Africa',
    nickname: 'Only Spanish-Speaking African Nation & Bioko Island',
    capCoords: [8.7832, 3.7504],
  },
  {
    id: 'GA',
    name: 'Gabon',
    capital: 'Libreville',
    region: 'Central Africa',
    nickname: 'Last Eden of Rainforests & Atlantic Surf Hippos',
    capCoords: [9.4536, 0.4162],
  },
];

const REGION_COLORS = {
  'North Africa': { bg: '#fb923c', text: '#c2410c', badge: 'bg-orange-100 text-orange-800' },
  'West Africa': { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
  'Central Africa': { bg: '#38bdf8', text: '#0369a1', badge: 'bg-sky-100 text-sky-800' },
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

  const codeMap = new Map();
  for (const c of COUNTRIES) {
    codeMap.set(c.id, c);
  }

  const maFeat = worldGeo.features.find((f) => f.properties['ISO3166-1-Alpha-2'] === 'MA');
  const ehFeat = worldGeo.features.find((f) => f.properties['ISO3166-1-Alpha-2'] === 'EH');

  const quizFeatures = [];
  for (const c of COUNTRIES) {
    if (c.id === 'MA') {
      quizFeatures.push({
        type: 'Feature',
        id: 'MA',
        properties: maFeat.properties,
        geometry: {
          type: 'MultiPolygon',
          coordinates: [maFeat.geometry.coordinates, ehFeat.geometry.coordinates],
        },
      });
    } else {
      const feat = worldGeo.features.find((f) => f.properties['ISO3166-1-Alpha-2'] === c.id);
      if (feat) {
        feat.id = c.id;
        quizFeatures.push(feat);
      } else {
        console.error('Feature missing for:', c.id);
      }
    }
  }

  const featureCollection = { type: 'FeatureCollection', features: quizFeatures };

  // Canvas size: 959 x 593 (matching StateQuiz exactly)
  const width = 959;
  const height = 593;
  const paddingX = 24;
  const paddingY = 20;

  const projection = d3
    .geoConicEqualArea()
    .parallels([8, 28])
    .rotate([-10, 0])
    .fitExtent(
      [
        [paddingX, paddingY],
        [width - paddingX, height - paddingY],
      ],
      featureCollection
    );

  const pathGenerator = d3.geoPath(projection);

  // Background features: surrounding European, Middle Eastern, and African nations
  const bgCodes = [
    'ES', 'PT', 'IT', 'GR', 'SA', 'YE', 'IL', 'JO', 'SY', 'LB', 'CY',
    'ER', 'ET', 'SS', 'CD', 'CG'
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

  // Western Sahara dashed border line between Morocco and Western Sahara
  const wsBorderGeo = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [-13.17, 27.67],
        [-8.67, 27.67],
      ],
    },
  };
  const wsBorderD = roundPath(pathGenerator(wsBorderGeo));
  const borderPaths = [];
  if (wsBorderD) {
    borderPaths.push({
      id: 'WS_BORDER',
      name: 'Western Sahara Disputed Boundary',
      d: wsBorderD,
    });
  }

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

    const color = REGION_COLORS[meta.region]?.bg || '#34d399';

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
  const statesDataTs = `// Generated North & West Africa Countries & Capitals Dataset with SVG Path definitions
export interface USState {
  id: string;
  name: string;
  capital: string;
  region: 'North Africa' | 'West Africa' | 'Central Africa';
  nickname: string;
  color: string;
  d: string;
  capitalCoordinates: { x: number; y: number };
  isSmallIsland?: boolean;
}

export type AfricaCountry = USState;

export interface BorderPath {
  id: string;
  name?: string;
  d: string;
}

export const REGION_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  'North Africa': { bg: '#fb923c', text: '#c2410c', badge: 'bg-orange-100 text-orange-800' },
  'West Africa': { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
  'Central Africa': { bg: '#38bdf8', text: '#0369a1', badge: 'bg-sky-100 text-sky-800' },
};

export const BACKGROUND_PATHS: BorderPath[] = ${JSON.stringify(backgroundPaths, null, 2)};

export const BORDER_PATHS: BorderPath[] = ${JSON.stringify(borderPaths, null, 2)};

export const SEPARATOR_PATH = '';

export const US_STATES: USState[] = ${JSON.stringify(states, null, 2)};

export const AFRICA_COUNTRIES = US_STATES;
`;

  fs.mkdirSync('src/data', { recursive: true });
  fs.writeFileSync('src/data/statesData.ts', statesDataTs);
  fs.writeFileSync('src/data/capitalCoordinates.json', JSON.stringify(capitalsJson, null, 2));

  console.log(
    `Successfully generated statesData.ts with ${states.length} countries, ${backgroundPaths.length} background paths, and ${borderPaths.length} border paths`
  );
}

main().catch(console.error);
