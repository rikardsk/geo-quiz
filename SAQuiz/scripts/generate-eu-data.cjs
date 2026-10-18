const fs = require('fs');

const svg = fs.readFileSync('eu-map.svg', 'utf8');

const eu27Meta = {
  AT: { name: 'Austria', capital: 'Vienna', region: 'Western', nickname: 'Land of Music & Alpine Splendor', capCoords: { x: 475, y: 635 } },
  BE: { name: 'Belgium', capital: 'Brussels', region: 'Western', nickname: 'Heart of Europe & Seat of the EU', capCoords: { x: 305, y: 565 } },
  BG: { name: 'Bulgaria', capital: 'Sofia', region: 'Eastern', nickname: 'Land of Roses & Ancient Thracians', capCoords: { x: 645, y: 745 } },
  HR: { name: 'Croatia', capital: 'Zagreb', region: 'Southern', nickname: 'Pearl of the Adriatic & 1,000 Islands', capCoords: { x: 495, y: 700 } },
  CY: { name: 'Cyprus', capital: 'Nicosia', region: 'Southern', nickname: 'Island of Aphrodite', capCoords: { x: 870, y: 886 } },
  CZ: { name: 'Czech Republic', capital: 'Prague', region: 'Eastern', nickname: 'City of a Hundred Spires & Bohemia', capCoords: { x: 475, y: 575 } },
  DK: { name: 'Denmark', capital: 'Copenhagen', region: 'Northern', nickname: 'Home of Hans Christian Andersen & Hygge', capCoords: { x: 405, y: 410 } },
  EE: { name: 'Estonia', capital: 'Tallinn', region: 'Northern', nickname: 'E-Estonia & Northern Digital Pioneer', capCoords: { x: 585, y: 320 } },
  FI: { name: 'Finland', capital: 'Helsinki', region: 'Northern', nickname: 'Land of a Thousand Lakes & Midnight Sun', capCoords: { x: 560, y: 280 } },
  FR: { name: 'France', capital: 'Paris', region: 'Western', nickname: "L'Hexagone & City of Light", capCoords: { x: 264, y: 650 } },
  DE: { name: 'Germany', capital: 'Berlin', region: 'Western', nickname: 'Land of Ideas, Poets & Thinkers', capCoords: { x: 425, y: 525 } },
  GR: { name: 'Greece', capital: 'Athens', region: 'Southern', nickname: 'Cradle of Democracy & Philosophy', capCoords: { x: 665, y: 875 } },
  HU: { name: 'Hungary', capital: 'Budapest', region: 'Eastern', nickname: 'Pearl of the Danube & Thermal Springs', capCoords: { x: 550, y: 635 } },
  IE: { name: 'Ireland', capital: 'Dublin', region: 'Northern', nickname: 'The Emerald Isle', capCoords: { x: 135, y: 455 } },
  IT: { name: 'Italy', capital: 'Rome', region: 'Southern', nickname: 'Bel Paese & The Eternal City', capCoords: { x: 435, y: 785 } },
  LV: { name: 'Latvia', capital: 'Riga', region: 'Northern', nickname: 'Jewel of the Baltic & Art Nouveau Haven', capCoords: { x: 585, y: 375 } },
  LT: { name: 'Lithuania', capital: 'Vilnius', region: 'Northern', nickname: 'Land of Amber & Ancient Oaks', capCoords: { x: 605, y: 435 } },
  LU: { name: 'Luxembourg', capital: 'Luxembourg', region: 'Western', nickname: 'The Grand Duchy', capCoords: { x: 328, y: 586 } },
  MT: { name: 'Malta', capital: 'Valletta', region: 'Southern', nickname: 'Fortress Island & Knights of St. John', capCoords: { x: 489, y: 948 } },
  NL: { name: 'Netherlands', capital: 'Amsterdam', region: 'Western', nickname: 'Land of Windmills, Tulips & Canals', capCoords: { x: 315, y: 520 } },
  PL: { name: 'Poland', capital: 'Warsaw', region: 'Eastern', nickname: 'Phoenix Rising & Land of Mazurka', capCoords: { x: 545, y: 520 } },
  PT: { name: 'Portugal', capital: 'Lisbon', region: 'Southern', nickname: 'Land of Discoveries & Fado', capCoords: { x: 42, y: 830 } },
  RO: { name: 'Romania', capital: 'Bucharest', region: 'Eastern', nickname: 'Carpathian Garden & Painted Monasteries', capCoords: { x: 670, y: 685 } },
  SK: { name: 'Slovakia', capital: 'Bratislava', region: 'Eastern', nickname: 'Heart of the High Tatras & Castles', capCoords: { x: 520, y: 620 } },
  SI: { name: 'Slovenia', capital: 'Ljubljana', region: 'Southern', nickname: 'Green Heart of Europe & Alpine Lakes', capCoords: { x: 475, y: 680 } },
  ES: { name: 'Spain', capital: 'Madrid', region: 'Southern', nickname: 'Land of Flamenco, Sun & Fiesta', capCoords: { x: 159, y: 822 } },
  SE: { name: 'Sweden', capital: 'Stockholm', region: 'Northern', nickname: 'Land of Innovation & Midnight Sun', capCoords: { x: 485, y: 340 } },
};

const REGION_COLORS = {
  Northern: '#34d399', // Nordic Emerald
  Western: '#38bdf8',  // EU Sky Blue
  Southern: '#fbbf24', // Mediterranean Amber
  Eastern: '#a78bfa',  // Central & Eastern Purple
};

// Parse paths
const pathTags = [];
let idx = 0;
while (true) {
  const start = svg.indexOf('<path', idx);
  if (start === -1) break;
  let end = svg.indexOf('/>', start);
  let closeTag = svg.indexOf('</path>', start);
  let tagEnd = -1;
  if (end !== -1 && (closeTag === -1 || end < closeTag)) {
    tagEnd = end + 2;
  } else if (closeTag !== -1) {
    tagEnd = closeTag + 7;
  } else {
    break;
  }
  const chunk = svg.slice(start, tagEnd);
  pathTags.push(chunk);
  idx = tagEnd;
}

const eu27Keys = Object.keys(eu27Meta);
const memberStates = [];
const nonEUPaths = [];

for (const tag of pathTags) {
  const idM = tag.match(/\bid="([a-zA-Z0-9_\-]+)"/);
  if (!idM) continue;
  const rawId = idM[1];
  const upperId = rawId.toUpperCase();
  const dM = tag.match(/\bd="([^"]+)"/);
  if (!dM) continue;
  const d = dM[1];

  if (eu27Keys.includes(upperId)) {
    const meta = eu27Meta[upperId];
    memberStates.push({
      id: upperId,
      name: meta.name,
      capital: meta.capital,
      region: meta.region,
      nickname: meta.nickname,
      color: REGION_COLORS[meta.region],
      d,
      isDirectTransform: ['HR', 'CY', 'MT'].includes(upperId),
      capitalCoordinates: meta.capCoords,
    });
  } else {
    // Non-EU country outline
    nonEUPaths.push({
      id: rawId,
      d,
    });
  }
}

// Sort member states alphabetically by name
memberStates.sort((a, b) => a.name.localeCompare(b.name));

const outputTs = `// Generated EU Member States and Capitals Dataset with SVG Path definitions
export interface USState {
  id: string;
  name: string;
  capital: string;
  region: 'Northern' | 'Western' | 'Southern' | 'Eastern';
  nickname: string;
  color: string;
  d: string;
  isDirectTransform?: boolean;
  capitalCoordinates: { x: number; y: number };
}

export type EUMemberState = USState;

export interface BorderPath {
  id: string;
  d: string;
}

export const US_STATES: USState[] = ${JSON.stringify(memberStates, null, 2)};

export const EU_STATES: EUMemberState[] = US_STATES;

export const NON_EU_PATHS: BorderPath[] = ${JSON.stringify(nonEUPaths, null, 2)};

export const BORDER_PATHS: BorderPath[] = NON_EU_PATHS;

export const SEPARATOR_PATH = '';

export const REGION_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  Northern: { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
  Western: { bg: '#38bdf8', text: '#0369a1', badge: 'bg-sky-100 text-sky-800' },
  Southern: { bg: '#fbbf24', text: '#b45309', badge: 'bg-amber-100 text-amber-800' },
  Eastern: { bg: '#a78bfa', text: '#6d28d9', badge: 'bg-purple-100 text-purple-800' },
};
`;

fs.writeFileSync('src/data/statesData.ts', outputTs, 'utf8');
console.log(`Successfully generated ${memberStates.length} EU member states and ${nonEUPaths.length} background paths!`);
