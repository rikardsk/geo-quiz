import fs from 'node:fs';
import * as d3 from 'd3-geo';

const COUNTRIES = [
  // Central Africa (4)
  {
    id: 'AO',
    name: 'Angola',
    capital: 'Luanda',
    region: 'Central Africa',
    nickname: 'Land of the Giant Sable & Historic Kingdom of Kongo',
    capCoords: [13.2344, -8.8390],
  },
  {
    id: 'CD',
    name: 'Democratic Republic of the Congo',
    capital: 'Kinshasa',
    region: 'Central Africa',
    nickname: 'Heart of the Congo Basin & Realm of the Okapi',
    capCoords: [15.4222, -4.5419],
  },
  {
    id: 'CG',
    name: 'Republic of the Congo',
    capital: 'Brazzaville',
    region: 'Central Africa',
    nickname: 'Land of Pristine Rainforests & River of Rapids',
    capCoords: [15.1832, -4.1634],
  },
  {
    id: 'ST',
    name: 'São Tomé and Príncipe',
    capital: 'São Tomé',
    region: 'Central Africa',
    nickname: 'The Chocolate Islands & Equatorial Garden of Eden',
    capCoords: [6.7273, 0.3302],
    isSmallIsland: true,
  },

  // East Africa (18)
  {
    id: 'BI',
    name: 'Burundi',
    capital: 'Gitega',
    region: 'East Africa',
    nickname: 'Heart of Africa & The Land of Royal Drummers',
    capCoords: [29.9246, -3.4273],
  },
  {
    id: 'KM',
    name: 'Comoros',
    capital: 'Moroni',
    region: 'East Africa',
    nickname: 'The Perfume Islands & Cloud Forest Archipelago',
    capCoords: [43.2551, -11.7172],
    isSmallIsland: true,
  },
  {
    id: 'DJ',
    name: 'Djibouti',
    capital: 'Djibouti',
    region: 'East Africa',
    nickname: 'Gateway to the Red Sea & Horn of Africa Crossroads',
    capCoords: [43.1456, 11.5721],
  },
  {
    id: 'ER',
    name: 'Eritrea',
    capital: 'Asmara',
    region: 'East Africa',
    nickname: 'Red Sea Jewel & UNESCO Modernist Pearl',
    capCoords: [38.9251, 15.3229],
  },
  {
    id: 'ET',
    name: 'Ethiopia',
    capital: 'Addis Ababa',
    region: 'East Africa',
    nickname: 'Cradle of Humankind & Roof of Africa',
    capCoords: [38.7578, 8.9806],
  },
  {
    id: 'KE',
    name: 'Kenya',
    capital: 'Nairobi',
    region: 'East Africa',
    nickname: 'Safari Capital of the World & Cradle of the Great Rift',
    capCoords: [36.8219, -1.2921],
  },
  {
    id: 'MG',
    name: 'Madagascar',
    capital: 'Antananarivo',
    region: 'East Africa',
    nickname: 'The Eighth Continent & Isle of Lemurs and Baobabs',
    capCoords: [47.5079, -18.8792],
  },
  {
    id: 'MW',
    name: 'Malawi',
    capital: 'Lilongwe',
    region: 'East Africa',
    nickname: 'The Warm Heart of Africa & Lake of Stars',
    capCoords: [33.7873, -13.9626],
  },
  {
    id: 'MU',
    name: 'Mauritius',
    capital: 'Port Louis',
    region: 'East Africa',
    nickname: 'Star and Key of the Indian Ocean & Coral Isle',
    capCoords: [57.5012, -20.1609],
    isSmallIsland: true,
  },
  {
    id: 'MZ',
    name: 'Mozambique',
    capital: 'Maputo',
    region: 'East Africa',
    nickname: 'Land of Turquoise Waters & The Swahili Coast',
    capCoords: [32.5732, -25.9692],
  },
  {
    id: 'RW',
    name: 'Rwanda',
    capital: 'Kigali',
    region: 'East Africa',
    nickname: 'Land of a Thousand Hills & Mountain Gorilla Haven',
    capCoords: [30.0619, -1.9441],
  },
  {
    id: 'SC',
    name: 'Seychelles',
    capital: 'Victoria',
    region: 'East Africa',
    nickname: 'Paradise Archipelago of Granite and Coral',
    capCoords: [55.4513, -4.6191],
    isSmallIsland: true,
  },
  {
    id: 'SO',
    name: 'Somalia',
    capital: 'Mogadishu',
    region: 'East Africa',
    nickname: 'Nation of Poets & Longest Coastline on Mainland Africa',
    capCoords: [45.3182, 2.0469],
  },
  {
    id: 'SS',
    name: 'South Sudan',
    capital: 'Juba',
    region: 'East Africa',
    nickname: "The World's Youngest Nation & The Sudd Wetlands",
    capCoords: [31.5825, 4.8594],
  },
  {
    id: 'TZ',
    name: 'Tanzania',
    capital: 'Dodoma',
    region: 'East Africa',
    nickname: 'Roof of Africa at Kilimanjaro & Serengeti Realm',
    capCoords: [35.7516, -6.1630],
  },
  {
    id: 'UG',
    name: 'Uganda',
    capital: 'Kampala',
    region: 'East Africa',
    nickname: 'The Pearl of Africa & Source of the Nile',
    capCoords: [32.5825, 0.3476],
  },
  {
    id: 'ZM',
    name: 'Zambia',
    capital: 'Lusaka',
    region: 'East Africa',
    nickname: 'Land of the Legendary Victoria Falls & Smoke That Thunders',
    capCoords: [28.3228, -15.3875],
  },
  {
    id: 'ZW',
    name: 'Zimbabwe',
    capital: 'Harare',
    region: 'East Africa',
    nickname: 'Realm of Great Stone Cities & Majestic Zambezi',
    capCoords: [31.0530, -17.8252],
  },

  // Southern Africa (5)
  {
    id: 'BW',
    name: 'Botswana',
    capital: 'Gaborone',
    region: 'Southern Africa',
    nickname: 'Jewel of the Kalahari & Realm of the Okavango Delta',
    capCoords: [25.9231, -24.6282],
  },
  {
    id: 'SZ',
    name: 'Eswatini',
    capital: 'Mbabane',
    region: 'Southern Africa',
    nickname: 'The Royal Kingdom of the Valley of Heaven',
    capCoords: [31.1333, -26.3167],
  },
  {
    id: 'LS',
    name: 'Lesotho',
    capital: 'Maseru',
    region: 'Southern Africa',
    nickname: 'Kingdom in the Sky & The Mountain Fortress',
    capCoords: [27.4833, -29.3167],
  },
  {
    id: 'NA',
    name: 'Namibia',
    capital: 'Windhoek',
    region: 'Southern Africa',
    nickname: 'Land of the Brave & The Ancient Namib Dunes',
    capCoords: [17.0658, -22.5609],
  },
  {
    id: 'ZA',
    name: 'South Africa',
    capital: 'Pretoria',
    region: 'Southern Africa',
    nickname: 'The Rainbow Nation & Tip of the Continent',
    capCoords: [28.2293, -25.7479],
  },
];

const REGION_COLORS = {
  'East Africa': { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
  'Southern Africa': { bg: '#fb923c', text: '#c2410c', badge: 'bg-orange-100 text-orange-800' },
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

  // Somalia and Somaliland merge for official international borders
  const somFeat = worldGeo.features.find((f) => f.properties['ISO3166-1-Alpha-2'] === 'SO');
  const slFeat = worldGeo.features.find((f) => f.properties.name === 'Somaliland');

  const quizFeatures = [];
  for (const c of COUNTRIES) {
    if (c.id === 'SO') {
      quizFeatures.push({
        type: 'Feature',
        id: 'SO',
        properties: somFeat.properties,
        geometry: {
          type: 'MultiPolygon',
          coordinates: [somFeat.geometry.coordinates, slFeat.geometry.coordinates],
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

  // Canvas size: 959 x 593 (matching StateQuiz and AfricaNorthQuiz exactly)
  const width = 959;
  const height = 593;
  const paddingX = 30;
  const paddingY = 20;

  const projection = d3
    .geoConicEqualArea()
    .parallels([-25, 10])
    .rotate([-32, 0])
    .fitExtent(
      [
        [paddingX, paddingY],
        [width - paddingX, height - paddingY],
      ],
      featureCollection
    );

  const pathGenerator = d3.geoPath(projection);

  // Background features: surrounding African, Red Sea, and Middle Eastern nations
  const bgCodes = [
    'GA', 'GQ', 'CM', 'CF', 'TD', 'SD', 'EG', 'YE', 'SA', 'OM'
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

  // Somaliland administrative boundary dashed line
  // From Djibouti/Ethiopia tripoint [43.25, 11.0] along border to Puntland [49.0, 8.5]
  const somalilandBorder = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [49.0, 8.0],
        [49.0, 11.2],
      ],
    },
  };
  const slBorderD = roundPath(pathGenerator(somalilandBorder));
  const borderPaths = [];
  if (slBorderD) {
    borderPaths.push({
      id: 'SL_BORDER',
      name: 'Somaliland Regional Line',
      d: slBorderD,
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
  const statesDataTs = `// Generated South & East Africa Countries & Capitals Dataset with SVG Path definitions
export interface USState {
  id: string;
  name: string;
  capital: string;
  region: 'East Africa' | 'Southern Africa' | 'Central Africa';
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
  'East Africa': { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
  'Southern Africa': { bg: '#fb923c', text: '#c2410c', badge: 'bg-orange-100 text-orange-800' },
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
