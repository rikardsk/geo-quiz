import fs from 'node:fs';
import * as d3 from 'd3-geo';

const COUNTRIES = [
  // Northern Europe (10)
  {
    id: 'DK',
    name: 'Denmark',
    capital: 'Copenhagen',
    region: 'Northern',
    nickname: 'Land of Hygge & Hans Christian Andersen',
    capCoords: [12.5683, 55.6761],
  },
  {
    id: 'EE',
    name: 'Estonia',
    capital: 'Tallinn',
    region: 'Northern',
    nickname: 'E-Estonia & Northern Digital Pioneer',
    capCoords: [24.7535, 59.4370],
  },
  {
    id: 'FI',
    name: 'Finland',
    capital: 'Helsinki',
    region: 'Northern',
    nickname: 'Land of a Thousand Lakes & Midnight Sun',
    capCoords: [24.9384, 60.1699],
  },
  {
    id: 'IS',
    name: 'Iceland',
    capital: 'Reykjavik',
    region: 'Northern',
    nickname: 'Land of Fire & Ice, Glaciers and Geysers',
    capCoords: [-21.9426, 64.1466],
  },
  {
    id: 'IE',
    name: 'Ireland',
    capital: 'Dublin',
    region: 'Northern',
    nickname: 'The Emerald Isle & Land of Saints and Scholars',
    capCoords: [-6.2603, 53.3498],
  },
  {
    id: 'LV',
    name: 'Latvia',
    capital: 'Riga',
    region: 'Northern',
    nickname: 'Jewel of the Baltic & Amber Coast',
    capCoords: [24.1052, 56.9496],
  },
  {
    id: 'LT',
    name: 'Lithuania',
    capital: 'Vilnius',
    region: 'Northern',
    nickname: 'Land of Amber & Historic Grand Duchy',
    capCoords: [25.2797, 54.6872],
  },
  {
    id: 'NO',
    name: 'Norway',
    capital: 'Oslo',
    region: 'Northern',
    nickname: 'Land of the Midnight Sun & Majestic Fjords',
    capCoords: [10.7522, 59.9139],
  },
  {
    id: 'SE',
    name: 'Sweden',
    capital: 'Stockholm',
    region: 'Northern',
    nickname: 'Kingdom of Innovation & Land of Northern Lights',
    capCoords: [18.0686, 59.3293],
  },
  {
    id: 'GB',
    name: 'United Kingdom',
    capital: 'London',
    region: 'Northern',
    nickname: 'Land of Shakespeare, Big Ben & Magna Carta',
    capCoords: [-0.1278, 51.5074],
  },

  // Western Europe (9)
  {
    id: 'AT',
    name: 'Austria',
    capital: 'Vienna',
    region: 'Western',
    nickname: 'Land of Music, Mozart & Alpine Splendor',
    capCoords: [16.3738, 48.2082],
  },
  {
    id: 'BE',
    name: 'Belgium',
    capital: 'Brussels',
    region: 'Western',
    nickname: 'Heart of Europe & Seat of the EU',
    capCoords: [4.3517, 50.8503],
  },
  {
    id: 'FR',
    name: 'France',
    capital: 'Paris',
    region: 'Western',
    nickname: "L'Hexagone & The City of Light",
    capCoords: [2.3522, 48.8566],
  },
  {
    id: 'DE',
    name: 'Germany',
    capital: 'Berlin',
    region: 'Western',
    nickname: 'Land of Poets, Thinkers & Engineering Innovation',
    capCoords: [13.4050, 52.5200],
  },
  {
    id: 'LI',
    name: 'Liechtenstein',
    capital: 'Vaduz',
    region: 'Western',
    nickname: 'Alpine Principality in the Rhine Valley',
    capCoords: [9.5215, 47.1410],
    isMicroState: true,
  },
  {
    id: 'LU',
    name: 'Luxembourg',
    capital: 'Luxembourg',
    region: 'Western',
    nickname: 'The Grand Duchy & Gibraltar of the North',
    capCoords: [6.1319, 49.6116],
  },
  {
    id: 'MC',
    name: 'Monaco',
    capital: 'Monaco',
    region: 'Western',
    nickname: 'Glamorous Riviera Principality of the Grimaldis',
    capCoords: [7.4246, 43.7384],
    isMicroState: true,
  },
  {
    id: 'NL',
    name: 'Netherlands',
    capital: 'Amsterdam',
    region: 'Western',
    nickname: 'Land of Windmills, Tulips & Historic Canals',
    capCoords: [4.9041, 52.3676],
  },
  {
    id: 'CH',
    name: 'Switzerland',
    capital: 'Bern',
    region: 'Western',
    nickname: 'Confoederatio Helvetica & Jewel of the Alps',
    capCoords: [7.4474, 46.9480],
  },

  // Southern Europe (17)
  {
    id: 'AL',
    name: 'Albania',
    capital: 'Tirana',
    region: 'Southern',
    nickname: 'Land of the Eagles & Ancient Illyria',
    capCoords: [19.8187, 41.3275],
  },
  {
    id: 'AD',
    name: 'Andorra',
    capital: 'Andorra la Vella',
    region: 'Southern',
    nickname: 'Pyrenean Principality & Highest Capital in Europe',
    capCoords: [1.5218, 42.5063],
    isMicroState: true,
  },
  {
    id: 'BA',
    name: 'Bosnia and Herzegovina',
    capital: 'Sarajevo',
    region: 'Southern',
    nickname: 'Heart-Shaped Land & Bridge Between East and West',
    capCoords: [18.4131, 43.8563],
  },
  {
    id: 'HR',
    name: 'Croatia',
    capital: 'Zagreb',
    region: 'Southern',
    nickname: 'Pearl of the Adriatic & 1,000 Islands',
    capCoords: [15.9819, 45.8150],
  },
  {
    id: 'CY',
    name: 'Cyprus',
    capital: 'Nicosia',
    region: 'Southern',
    nickname: 'Island of Aphrodite & Eastern Mediterranean Gem',
    capCoords: [33.3823, 35.1856],
  },
  {
    id: 'GR',
    name: 'Greece',
    capital: 'Athens',
    region: 'Southern',
    nickname: 'Cradle of Western Civilization & Philosophy',
    capCoords: [23.7275, 37.9838],
  },
  {
    id: 'IT',
    name: 'Italy',
    capital: 'Rome',
    region: 'Southern',
    nickname: 'Il Bel Paese & The Eternal City',
    capCoords: [12.4964, 41.9028],
  },
  {
    id: 'XK',
    name: 'Kosovo',
    capital: 'Pristina',
    region: 'Southern',
    nickname: "Europe's Youngest Nation & Historic Dardanian Plains",
    capCoords: [21.1655, 42.6629],
  },
  {
    id: 'MT',
    name: 'Malta',
    capital: 'Valletta',
    region: 'Southern',
    nickname: 'Fortress Isle & Realm of the Knights of St. John',
    capCoords: [14.5141, 35.8989],
    isMicroState: true,
  },
  {
    id: 'ME',
    name: 'Montenegro',
    capital: 'Podgorica',
    region: 'Southern',
    nickname: 'Black Mountain & Majestic Bay of Kotor',
    capCoords: [19.2629, 42.4304],
  },
  {
    id: 'MK',
    name: 'North Macedonia',
    capital: 'Skopje',
    region: 'Southern',
    nickname: 'Land of Sun, Ancient Crossroads & Lake Ohrid',
    capCoords: [21.4280, 41.9981],
  },
  {
    id: 'PT',
    name: 'Portugal',
    capital: 'Lisbon',
    region: 'Southern',
    nickname: 'Land of Discoveries, Fado & Port Wine',
    capCoords: [-9.1393, 38.7223],
  },
  {
    id: 'SM',
    name: 'San Marino',
    capital: 'San Marino',
    region: 'Southern',
    nickname: "World's Oldest Republic & Mount Titano",
    capCoords: [12.4578, 43.9424],
    isMicroState: true,
  },
  {
    id: 'RS',
    name: 'Serbia',
    capital: 'Belgrade',
    region: 'Southern',
    nickname: 'Heart of the Balkans & Confluence of the Danube',
    capCoords: [20.4489, 44.7866],
  },
  {
    id: 'SI',
    name: 'Slovenia',
    capital: 'Ljubljana',
    region: 'Southern',
    nickname: 'Green Heart of Europe, Lake Bled & Alpine Wonder',
    capCoords: [14.5058, 46.0569],
  },
  {
    id: 'ES',
    name: 'Spain',
    capital: 'Madrid',
    region: 'Southern',
    nickname: 'Land of Flamenco, Sun & Historic Kingdoms',
    capCoords: [-3.7038, 40.4168],
  },
  {
    id: 'VA',
    name: 'Vatican City',
    capital: 'Vatican City',
    region: 'Southern',
    nickname: 'Holy See & Smallest Independent State in the World',
    capCoords: [12.4534, 41.9029],
    isMicroState: true,
  },

  // Eastern Europe (9)
  {
    id: 'BY',
    name: 'Belarus',
    capital: 'Minsk',
    region: 'Eastern',
    nickname: 'Lungs of Europe & Primeval Forest Realm',
    capCoords: [27.5615, 53.9045],
  },
  {
    id: 'BG',
    name: 'Bulgaria',
    capital: 'Sofia',
    region: 'Eastern',
    nickname: 'Land of Roses, Balkan Peaks & Ancient Thracians',
    capCoords: [23.3219, 42.6977],
  },
  {
    id: 'CZ',
    name: 'Czech Republic',
    capital: 'Prague',
    region: 'Eastern',
    nickname: 'City of a Hundred Spires & Historic Heart of Bohemia',
    capCoords: [14.4378, 50.0755],
  },
  {
    id: 'HU',
    name: 'Hungary',
    capital: 'Budapest',
    region: 'Eastern',
    nickname: 'Pearl of the Danube & Land of Thermal Springs',
    capCoords: [19.0402, 47.4979],
  },
  {
    id: 'MD',
    name: 'Moldova',
    capital: 'Chisinau',
    region: 'Eastern',
    nickname: 'Land of Rolling Vineyards & Historic Cellars',
    capCoords: [28.8638, 47.0105],
  },
  {
    id: 'PL',
    name: 'Poland',
    capital: 'Warsaw',
    region: 'Eastern',
    nickname: 'Phoenix from the Ashes & Land of Amber and Mazurkas',
    capCoords: [21.0122, 52.2297],
  },
  {
    id: 'RO',
    name: 'Romania',
    capital: 'Bucharest',
    region: 'Eastern',
    nickname: 'Carpathian Garden & Land of Painted Monasteries',
    capCoords: [26.1025, 44.4268],
  },
  {
    id: 'SK',
    name: 'Slovakia',
    capital: 'Bratislava',
    region: 'Eastern',
    nickname: 'Heart of the High Tatras & Castle Realm of Central Europe',
    capCoords: [17.1077, 48.1486],
  },
  {
    id: 'UA',
    name: 'Ukraine',
    capital: 'Kyiv',
    region: 'Eastern',
    nickname: 'Breadbasket of Europe & Golden Domes of Kyiv',
    capCoords: [30.5234, 50.4501],
  },
];

export const REGION_COLORS = {
  Northern: { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
  Western: { bg: '#38bdf8', text: '#0369a1', badge: 'bg-sky-100 text-sky-800' },
  Southern: { bg: '#fbbf24', text: '#b45309', badge: 'bg-amber-100 text-amber-800' },
  Eastern: { bg: '#a78bfa', text: '#6d28d9', badge: 'bg-purple-100 text-purple-800' },
};

function roundPath(d, precision = 1) {
  if (!d) return '';
  return d.replace(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi, (num) => {
    const val = parseFloat(num);
    return isNaN(val) ? num : val.toFixed(precision);
  });
}

function filterGeoToEurope(geometry) {
  if (!geometry) return null;
  if (geometry.type === 'Polygon') {
    const coords = geometry.coordinates;
    const isEuro = coords[0].some(
      ([lon, lat]) => lon >= -26 && lon <= 45 && lat >= 34 && lat <= 72
    );
    return isEuro ? geometry : null;
  }
  if (geometry.type === 'MultiPolygon') {
    const filtered = geometry.coordinates.filter((poly) => {
      return poly[0].some(
        ([lon, lat]) => lon >= -26 && lon <= 45 && lat >= 34 && lat <= 72
      );
    });
    if (filtered.length === 0) return null;
    return {
      type: 'MultiPolygon',
      coordinates: filtered,
    };
  }
  return null;
}

async function main() {
  const geojsonPath = 'scripts/countries.geojson';
  const worldGeo = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

  const quizFeatures = [];
  for (const c of COUNTRIES) {
    const feat = worldGeo.features.find(
      (f) =>
        f.properties['ISO3166-1-Alpha-2'] === c.id ||
        (c.id === 'XK' && f.properties.name === 'Kosovo') ||
        (c.id === 'RS' && f.properties.name === 'Republic of Serbia') ||
        f.properties.name?.toLowerCase() === c.name.toLowerCase()
    );

    if (feat) {
      const euroGeom = filterGeoToEurope(feat.geometry);
      if (euroGeom) {
        quizFeatures.push({
          type: 'Feature',
          id: c.id,
          properties: { ...feat.properties, id: c.id, name: c.name },
          geometry: euroGeom,
        });
      } else {
        console.warn(`Feature ${c.id} geometry filtered out entirely!`);
      }
    } else {
      console.error(`Feature missing for ${c.id} (${c.name})`);
    }
  }

  const featureCollection = { type: 'FeatureCollection', features: quizFeatures };

  // Canvas size: 959 x 593 (consistent with StateQuiz and sibling GeoQuiz projects)
  const width = 959;
  const height = 593;
  const paddingX = 25;
  const paddingY = 20;

  const projection = d3
    .geoConicEqualArea()
    .parallels([35, 65])
    .rotate([-10, 0])
    .fitExtent(
      [
        [paddingX, paddingY],
        [width - paddingX, height - paddingY],
      ],
      featureCollection
    );

  const pathGenerator = d3.geoPath(projection);

  // Background features: surrounding North African, Middle Eastern, and Eurasian nations
  const bgCodes = [
    'MA', 'DZ', 'TN', 'EG', 'TR', 'SY', 'JO', 'LB', 'IL', 'IQ', 'IR', 'GE', 'AZ', 'AM', 'KZ', 'RU'
  ];

  const backgroundPaths = [];
  for (const code of bgCodes) {
    const feat = worldGeo.features.find((f) => f.properties['ISO3166-1-Alpha-2'] === code);
    if (feat) {
      const rawD = pathGenerator(feat);
      const d = roundPath(rawD);
      if (d && d.length > 0) {
        backgroundPaths.push({
          id: code,
          name: feat.properties.name,
          d,
        });
      }
    }
  }

  // Microstate border enhancements or divider lines if needed
  const borderPaths = [];

  // Build states array and capitals object
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
      isMicroState: meta.isMicroState || false,
    });
  }

  // Generate statesData.ts
  const statesDataTs = `// Generated Europe Countries & Capitals Dataset with SVG Path definitions
export interface USState {
  id: string;
  name: string;
  capital: string;
  region: 'Northern' | 'Western' | 'Southern' | 'Eastern';
  nickname: string;
  color: string;
  d: string;
  capitalCoordinates: { x: number; y: number };
  isMicroState?: boolean;
}

export type EuropeCountry = USState;

export interface BorderPath {
  id: string;
  name?: string;
  d: string;
}

export const REGION_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  Northern: { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
  Western: { bg: '#38bdf8', text: '#0369a1', badge: 'bg-sky-100 text-sky-800' },
  Southern: { bg: '#fbbf24', text: '#b45309', badge: 'bg-amber-100 text-amber-800' },
  Eastern: { bg: '#a78bfa', text: '#6d28d9', badge: 'bg-purple-100 text-purple-800' },
};

export const BACKGROUND_PATHS: BorderPath[] = ${JSON.stringify(backgroundPaths, null, 2)};

export const BORDER_PATHS: BorderPath[] = ${JSON.stringify(borderPaths, null, 2)};

export const SEPARATOR_PATH = '';

export const US_STATES: USState[] = ${JSON.stringify(states, null, 2)};

export const EUROPE_COUNTRIES = US_STATES;
`;

  fs.mkdirSync('src/data', { recursive: true });
  fs.writeFileSync('src/data/statesData.ts', statesDataTs);
  fs.writeFileSync('src/data/capitalCoordinates.json', JSON.stringify(capitalsJson, null, 2));

  console.log(
    `Successfully generated statesData.ts with ${states.length} countries and ${backgroundPaths.length} background paths.`
  );
}

main().catch(console.error);
