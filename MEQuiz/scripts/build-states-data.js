import fs from 'node:fs';
import * as d3 from 'd3-geo';

const COUNTRIES = [
  // Arabian Peninsula (7)
  {
    id: 'SA',
    name: 'Saudi Arabia',
    capital: 'Riyadh',
    region: 'Arabian Peninsula',
    nickname: 'Heart of the Arabian Peninsula & Land of the Two Holy Mosques',
    capCoords: [46.7219, 24.7136],
  },
  {
    id: 'AE',
    name: 'United Arab Emirates',
    capital: 'Abu Dhabi',
    region: 'Arabian Peninsula',
    nickname: 'Land of Falcons, Innovation & Architectural Marvels',
    capCoords: [54.3773, 24.4539],
  },
  {
    id: 'OM',
    name: 'Oman',
    capital: 'Muscat',
    region: 'Arabian Peninsula',
    nickname: 'Jewel of Arabia & Land of Frankincense and Fjords',
    capCoords: [58.4059, 23.5880],
  },
  {
    id: 'YE',
    name: 'Yemen',
    capital: "Sana'a",
    region: 'Arabian Peninsula',
    nickname: 'Land of Arabia Felix & Ancient Queen of Sheba',
    capCoords: [44.2074, 15.3694],
  },
  {
    id: 'KW',
    name: 'Kuwait',
    capital: 'Kuwait City',
    region: 'Arabian Peninsula',
    nickname: 'Maritime Gem of the Arabian Gulf & Historic Pearl Merchant Port',
    capCoords: [47.9774, 29.3759],
  },
  {
    id: 'QA',
    name: 'Qatar',
    capital: 'Doha',
    region: 'Arabian Peninsula',
    nickname: 'Pearl of the Gulf & Modern Oasis of Culture and Falconry',
    capCoords: [51.5310, 25.2854],
  },
  {
    id: 'BH',
    name: 'Bahrain',
    capital: 'Manama',
    region: 'Arabian Peninsula',
    nickname: 'Kingdom of Two Seas & Ancient Heart of the Dilmun Civilization',
    capCoords: [50.5860, 26.2285],
    isSmallIsland: true,
  },

  // Levant (6)
  {
    id: 'JO',
    name: 'Jordan',
    capital: 'Amman',
    region: 'Levant',
    nickname: 'Hashemite Kingdom & Home to the Rose-Red City of Petra',
    capCoords: [35.9284, 31.9454],
  },
  {
    id: 'LB',
    name: 'Lebanon',
    capital: 'Beirut',
    region: 'Levant',
    nickname: 'Paris of the Middle East & Ancient Land of the Cedars',
    capCoords: [35.5018, 33.8938],
  },
  {
    id: 'SY',
    name: 'Syria',
    capital: 'Damascus',
    region: 'Levant',
    nickname: 'Cradle of Ancient Civilizations & Home to Palmyra and the Silk Road',
    capCoords: [36.2765, 33.5138],
  },
  {
    id: 'IL',
    name: 'Israel',
    capital: 'Jerusalem',
    region: 'Levant',
    nickname: 'The Start-Up Nation & Ancient Crossroads of History and Faith',
    capCoords: [35.2137, 31.7683],
  },
  {
    id: 'PS',
    name: 'Palestine',
    capital: 'Ramallah',
    region: 'Levant',
    nickname: 'Land of Ancient Olive Groves, Jericho & Sacred Heritage',
    capCoords: [35.2042, 31.9038],
  },
  {
    id: 'CY',
    name: 'Cyprus',
    capital: 'Nicosia',
    region: 'Levant',
    nickname: 'Jewel of the Eastern Mediterranean & Island of Aphrodite',
    capCoords: [33.3823, 35.1856],
  },

  // Northern Middle East (4)
  {
    id: 'TR',
    name: 'Turkey',
    capital: 'Ankara',
    region: 'Northern Middle East',
    nickname: 'Bridge Between Continents, Land of Anatolia, Troy & Cappadocia',
    capCoords: [32.8597, 39.9334],
  },
  {
    id: 'IR',
    name: 'Iran',
    capital: 'Tehran',
    region: 'Northern Middle East',
    nickname: 'Land of Ancient Persia, Persepolis & Majestic Mount Damavand',
    capCoords: [51.3890, 35.6892],
  },
  {
    id: 'IQ',
    name: 'Iraq',
    capital: 'Baghdad',
    region: 'Northern Middle East',
    nickname: 'Cradle of Civilization, Land of the Two Rivers Tigris and Euphrates',
    capCoords: [44.3661, 33.3152],
  },
  {
    id: 'EG',
    name: 'Egypt',
    capital: 'Cairo',
    region: 'Northern Middle East',
    nickname: 'Gift of the Nile, Mother of the World & Home of the Great Pyramids',
    capCoords: [31.2357, 30.0444],
  },
];

const EMIRATES_META = [
  {
    shapeName: 'Abu Dhabi',
    id: 'AE-AZ',
    name: 'Abu Dhabi',
    capital: 'Abu Dhabi',
    region: 'UAE Emirate',
    nickname: 'Largest Emirate (~86% of UAE) & Federal Capital with the Sheikh Zayed Grand Mosque',
    color: '#f59e0b',
    capCoords: [54.3773, 24.4539],
  },
  {
    shapeName: 'Dubai',
    id: 'AE-DU',
    name: 'Dubai',
    capital: 'Dubai',
    region: 'UAE Emirate',
    nickname: 'Global Commercial Hub, Home of Burj Khalifa, Palm Jumeirah & Innovation',
    color: '#3b82f6',
    capCoords: [55.2708, 25.2048],
  },
  {
    shapeName: 'Sharjah',
    id: 'AE-SH',
    name: 'Sharjah',
    capital: 'Sharjah',
    region: 'UAE Emirate',
    nickname: 'Cultural Capital of the Arab World, Historic Souqs & UNESCO Heritage Hub',
    color: '#10b981',
    capCoords: [55.4033, 25.3573],
  },
  {
    shapeName: 'Ajman',
    id: 'AE-AJ',
    name: 'Ajman',
    capital: 'Ajman',
    region: 'UAE Emirate',
    nickname: 'Smallest Emirate, Famous for Traditional Dhow Shipyards & Coastal Beaches',
    color: '#ec4899',
    capCoords: [55.4764, 25.4111],
  },
  {
    shapeName: 'Umm al-Quwain',
    id: 'AE-UQ',
    name: 'Umm Al Quwain',
    capital: 'Umm Al Quwain',
    region: 'UAE Emirate',
    nickname: 'Peaceful Coastal Oasis, Al Sinniyah Mangrove Island & Ancient Ed-Dur',
    color: '#8b5cf6',
    capCoords: [55.5552, 25.5647],
  },
  {
    shapeName: 'Ras al-Khaimah',
    id: 'AE-RK',
    name: 'Ras Al Khaimah',
    capital: 'Ras Al Khaimah',
    region: 'UAE Emirate',
    nickname: 'Mountainous Emirate with Jebel Jais Peak, Dhayah Fort & 7,000 Years of History',
    color: '#06b6d4',
    capCoords: [55.9432, 25.7895],
  },
  {
    shapeName: 'Fujairah',
    id: 'AE-FU',
    name: 'Fujairah',
    capital: 'Fujairah',
    region: 'UAE Emirate',
    nickname: 'Sole Emirate on the Gulf of Oman, Hajar Mountains & Ancient Al Badiyah Mosque',
    color: '#f97316',
    capCoords: [56.3265, 25.1288],
  },
];

const REGION_COLORS = {
  'Arabian Peninsula': { bg: '#f59e0b', text: '#b45309', badge: 'bg-amber-100 text-amber-800' },
  'Levant': { bg: '#06b6d4', text: '#0e7490', badge: 'bg-cyan-100 text-cyan-800' },
  'Northern Middle East': { bg: '#10b981', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
  'UAE Emirate': { bg: '#f59e0b', text: '#b45309', badge: 'bg-amber-100 text-amber-800' },
};

function roundPath(d, precision = 1) {
  if (!d) return '';
  return d.replace(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi, (num) => {
    const val = parseFloat(num);
    return isNaN(val) ? num : val.toFixed(precision);
  });
}

function simplifyRing(ring, tolerance = 0.003) {
  if (ring.length <= 4) return ring;
  const result = [ring[0]];
  let prev = ring[0];
  for (let i = 1; i < ring.length - 1; i++) {
    const pt = ring[i];
    const dx = pt[0] - prev[0];
    const dy = pt[1] - prev[1];
    if (Math.hypot(dx, dy) >= tolerance) {
      result.push(pt);
      prev = pt;
    }
  }
  result.push(ring[ring.length - 1]);
  return result;
}

async function main() {
  const worldGeo = JSON.parse(fs.readFileSync('scripts/countries.geojson', 'utf8'));

  const codeMap = new Map();
  for (const c of COUNTRIES) {
    codeMap.set(c.id, c);
  }

  const meFeatures = [];
  for (const f of worldGeo.features) {
    const code = f.properties['ISO3166-1-Alpha-2'];
    if (codeMap.has(code)) {
      f.id = code;
      meFeatures.push(f);
    }
  }

  const featureCollection = { type: 'FeatureCollection', features: meFeatures };

  // Canvas size: 959 x 593 (matching StateQuiz exactly)
  const width = 959;
  const height = 593;
  const paddingX = 24;
  const paddingY = 24;

  const projection = d3.geoConicConformal()
    .parallels([18, 36])
    .rotate([-43, 0])
    .fitExtent([[paddingX, paddingY], [width - paddingX, height - paddingY]], featureCollection);

  const pathGenerator = d3.geoPath(projection);

  // Background features: surrounding countries
  const bgCodes = [
    'LY', 'SD', 'SS', 'ER', 'DJ', 'ET', 'SO',
    'AF', 'PK', 'TM', 'UZ', 'GR', 'BG', 'GE', 'AM', 'AZ'
  ];
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
    const feat = meFeatures.find(f => f.id === meta.id);
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

    const color = REGION_COLORS[meta.region]?.bg || '#f59e0b';

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

  // --- FULL SIZE UAE EMIRATES MAP (959 x 593) ---
  const uaeGeo = JSON.parse(fs.readFileSync('scripts/uae-emirates.geojson', 'utf8'));

  // Fix winding order if needed
  for (const f of uaeGeo.features) {
    if (d3.geoArea(f) > 2 * Math.PI) {
      f.geometry.coordinates.forEach(poly => poly.forEach(ring => ring.reverse()));
    }
    // Simplify for fast and crisp SVG rendering
    f.geometry.coordinates = f.geometry.coordinates.map(poly => {
      return poly.map(ring => simplifyRing(ring, 0.002));
    }).filter(poly => poly[0].length >= 4);
  }

  // Full map projection for UAE Emirates: fitted to 959 x 593 with 45px padding
  const uaeProjection = d3.geoConicConformal()
    .parallels([23, 26])
    .rotate([-54, 0])
    .fitExtent([[45, 45], [width - 45, height - 45]], uaeGeo);

  const uaePathGenerator = d3.geoPath(uaeProjection);

  // Background surrounding countries for UAE map: Saudi Arabia, Oman, Qatar, Iran
  const uaeBgCodes = ['SA', 'OM', 'QA', 'IR'];
  const uaeBgFeatures = worldGeo.features.filter(f => uaeBgCodes.includes(f.properties['ISO3166-1-Alpha-2']));

  const uaeBackgroundPaths = uaeBgFeatures.map(f => {
    const code = f.properties['ISO3166-1-Alpha-2'];
    const d = roundPath(uaePathGenerator(f), 1);
    return { id: code, name: f.properties.name, d };
  }).filter(p => p.d && p.d.length > 0);

  const uaeEmirates = [];
  for (const meta of EMIRATES_META) {
    const feat = uaeGeo.features.find(f => f.properties.shapeName === meta.shapeName);
    if (!feat) {
      console.warn('Emirate feature not found:', meta.shapeName);
      continue;
    }

    const d = roundPath(uaePathGenerator(feat), 1);
    const [cx, cy] = uaeProjection(meta.capCoords);

    uaeEmirates.push({
      id: meta.id,
      name: meta.name,
      capital: meta.capital,
      region: meta.region,
      nickname: meta.nickname,
      color: meta.color,
      d,
      capitalCoordinates: {
        x: parseFloat(cx.toFixed(1)),
        y: parseFloat(cy.toFixed(1)),
      },
    });
  }

  // Generate statesData.ts
  const statesDataTs = `// Generated Middle East Countries & UAE Emirates Dataset with SVG Path definitions
export interface USState {
  id: string;
  name: string;
  capital: string;
  region: 'Arabian Peninsula' | 'Levant' | 'Northern Middle East' | 'UAE Emirate';
  nickname: string;
  color: string;
  d: string;
  capitalCoordinates: { x: number; y: number };
  isSmallIsland?: boolean;
}

export type MECountry = USState;
export type UAEEmirate = USState;

export interface BorderPath {
  id: string;
  name?: string;
  d: string;
}

export const REGION_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  'Arabian Peninsula': { bg: '#f59e0b', text: '#b45309', badge: 'bg-amber-100 text-amber-800' },
  'Levant': { bg: '#06b6d4', text: '#0e7490', badge: 'bg-cyan-100 text-cyan-800' },
  'Northern Middle East': { bg: '#10b981', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
  'UAE Emirate': { bg: '#f59e0b', text: '#b45309', badge: 'bg-amber-100 text-amber-800' },
};

export const BACKGROUND_PATHS: BorderPath[] = ${JSON.stringify(backgroundPaths, null, 2)};

export const UAE_BACKGROUND_PATHS: BorderPath[] = ${JSON.stringify(uaeBackgroundPaths, null, 2)};

export const BORDER_PATHS: BorderPath[] = [];

export const SEPARATOR_PATH = '';

export const US_STATES: USState[] = ${JSON.stringify(states, null, 2)};

export const ME_COUNTRIES = US_STATES;

export const UAE_EMIRATES: USState[] = ${JSON.stringify(uaeEmirates, null, 2)};
`;

  fs.writeFileSync('src/data/statesData.ts', statesDataTs);
  fs.writeFileSync('src/data/capitalCoordinates.json', JSON.stringify(capitalsJson, null, 2));

  console.log(`Successfully generated statesData.ts with ${states.length} countries, ${backgroundPaths.length} ME background paths, 7 full-size UAE emirates, and ${uaeBackgroundPaths.length} UAE background paths`);
}

main();
