import fs from 'node:fs';

const svg = fs.readFileSync('us-map.svg', 'utf8');

// Map of 50 states + DC with their capitals, regions, and nicknames
const STATE_META = {
  AL: { name: 'Alabama', capital: 'Montgomery', region: 'South', nickname: 'The Yellowhammer State' },
  AK: { name: 'Alaska', capital: 'Juneau', region: 'West', nickname: 'The Last Frontier' },
  AZ: { name: 'Arizona', capital: 'Phoenix', region: 'West', nickname: 'The Grand Canyon State' },
  AR: { name: 'Arkansas', capital: 'Little Rock', region: 'South', nickname: 'The Natural State' },
  CA: { name: 'California', capital: 'Sacramento', region: 'West', nickname: 'The Golden State' },
  CO: { name: 'Colorado', capital: 'Denver', region: 'West', nickname: 'The Centennial State' },
  CT: { name: 'Connecticut', capital: 'Hartford', region: 'Northeast', nickname: 'The Constitution State' },
  DE: { name: 'Delaware', capital: 'Dover', region: 'South', nickname: 'The First State' },
  FL: { name: 'Florida', capital: 'Tallahassee', region: 'South', nickname: 'The Sunshine State' },
  GA: { name: 'Georgia', capital: 'Atlanta', region: 'South', nickname: 'The Peach State' },
  HI: { name: 'Hawaii', capital: 'Honolulu', region: 'West', nickname: 'The Aloha State' },
  ID: { name: 'Idaho', capital: 'Boise', region: 'West', nickname: 'The Gem State' },
  IL: { name: 'Illinois', capital: 'Springfield', region: 'Midwest', nickname: 'The Prairie State' },
  IN: { name: 'Indiana', capital: 'Indianapolis', region: 'Midwest', nickname: 'The Hoosier State' },
  IA: { name: 'Iowa', capital: 'Des Moines', region: 'Midwest', nickname: 'The Hawkeye State' },
  KS: { name: 'Kansas', capital: 'Topeka', region: 'Midwest', nickname: 'The Sunflower State' },
  KY: { name: 'Kentucky', capital: 'Frankfort', region: 'South', nickname: 'The Bluegrass State' },
  LA: { name: 'Louisiana', capital: 'Baton Rouge', region: 'South', nickname: 'The Pelican State' },
  ME: { name: 'Maine', capital: 'Augusta', region: 'Northeast', nickname: 'The Pine Tree State' },
  MD: { name: 'Maryland', capital: 'Annapolis', region: 'South', nickname: 'The Old Line State' },
  MA: { name: 'Massachusetts', capital: 'Boston', region: 'Northeast', nickname: 'The Bay State' },
  MI: { name: 'Michigan', capital: 'Lansing', region: 'Midwest', nickname: 'The Great Lakes State' },
  MN: { name: 'Minnesota', capital: 'Saint Paul', region: 'Midwest', nickname: 'The North Star State' },
  MS: { name: 'Mississippi', capital: 'Jackson', region: 'South', nickname: 'The Magnolia State' },
  MO: { name: 'Missouri', capital: 'Jefferson City', region: 'Midwest', nickname: 'The Show-Me State' },
  MT: { name: 'Montana', capital: 'Helena', region: 'West', nickname: 'The Treasure State' },
  NE: { name: 'Nebraska', capital: 'Lincoln', region: 'Midwest', nickname: 'The Cornhusker State' },
  NV: { name: 'Nevada', capital: 'Carson City', region: 'West', nickname: 'The Silver State' },
  NH: { name: 'New Hampshire', capital: 'Concord', region: 'Northeast', nickname: 'The Granite State' },
  NJ: { name: 'New Jersey', capital: 'Trenton', region: 'Northeast', nickname: 'The Garden State' },
  NM: { name: 'New Mexico', capital: 'Santa Fe', region: 'West', nickname: 'The Land of Enchantment' },
  NY: { name: 'New York', capital: 'Albany', region: 'Northeast', nickname: 'The Empire State' },
  NC: { name: 'North Carolina', capital: 'Raleigh', region: 'South', nickname: 'The Tar Heel State' },
  ND: { name: 'North Dakota', capital: 'Bismarck', region: 'Midwest', nickname: 'The Peace Garden State' },
  OH: { name: 'Ohio', capital: 'Columbus', region: 'Midwest', nickname: 'The Buckeye State' },
  OK: { name: 'Oklahoma', capital: 'Oklahoma City', region: 'South', nickname: 'The Sooner State' },
  OR: { name: 'Oregon', capital: 'Salem', region: 'West', nickname: 'The Beaver State' },
  PA: { name: 'Pennsylvania', capital: 'Harrisburg', region: 'Northeast', nickname: 'The Keystone State' },
  RI: { name: 'Rhode Island', capital: 'Providence', region: 'Northeast', nickname: 'The Ocean State' },
  SC: { name: 'South Carolina', capital: 'Columbia', region: 'South', nickname: 'The Palmetto State' },
  SD: { name: 'South Dakota', capital: 'Pierre', region: 'Midwest', nickname: 'The Mount Rushmore State' },
  TN: { name: 'Tennessee', capital: 'Nashville', region: 'South', nickname: 'The Volunteer State' },
  TX: { name: 'Texas', capital: 'Austin', region: 'South', nickname: 'The Lone Star State' },
  UT: { name: 'Utah', capital: 'Salt Lake City', region: 'West', nickname: 'The Beehive State' },
  VT: { name: 'Vermont', capital: 'Montpelier', region: 'Northeast', nickname: 'The Green Mountain State' },
  VA: { name: 'Virginia', capital: 'Richmond', region: 'South', nickname: 'The Old Dominion' },
  WA: { name: 'Washington', capital: 'Olympia', region: 'West', nickname: 'The Evergreen State' },
  WV: { name: 'West Virginia', capital: 'Charleston', region: 'South', nickname: 'The Mountain State' },
  WI: { name: 'Wisconsin', capital: 'Madison', region: 'Midwest', nickname: 'The Badger State' },
  WY: { name: 'Wyoming', capital: 'Cheyenne', region: 'West', nickname: 'The Equality State' },
  DC: { name: 'District of Columbia', capital: 'Washington, D.C.', region: 'South', nickname: 'Nation’s Capital' },
};

// Distinct, cohesive regional color palette
const REGION_COLORS = {
  West: '#38bdf8',      // Sky blue
  Midwest: '#34d399',   // Emerald / mint
  South: '#fbbf24',     // Warm amber
  Northeast: '#a78bfa', // Purple / iris
};

// Extract state paths
const stateSectionMatch = svg.match(/<g class="state">([\s\S]*?)<\/g>/);
if (!stateSectionMatch) {
  console.error('Could not find <g class="state">');
  process.exit(1);
}

const stateSection = stateSectionMatch[1];
const pathRegex = /<path\s+class="([a-z]{2})"\s+d="([^"]+)">\s*<title>([^<]+)<\/title><\/path>/g;

// Load capital coordinates
const capitalCoordsRaw = JSON.parse(fs.readFileSync('src/data/capitalCoordinates.json', 'utf8'));
if (capitalCoordsRaw.AK) {
  capitalCoordsRaw.AK = { x: 185.0, y: 565.0 };
}

const states = [];
let match;
while ((match = pathRegex.exec(stateSection)) !== null) {
  const code = match[1].toUpperCase();
  const d = match[2];
  const title = match[3];
  const meta = STATE_META[code] || { name: title, capital: '', region: 'Other', nickname: '' };
  const coords = capitalCoordsRaw[code] || { x: 0, y: 0 };
  
  states.push({
    id: code,
    name: meta.name,
    capital: meta.capital,
    region: meta.region,
    nickname: meta.nickname,
    color: REGION_COLORS[meta.region] || '#94a3b8',
    d,
    capitalCoordinates: coords,
  });
}

// Extract borders
const bordersMatch = svg.match(/<g class="borders"[^>]*>([\s\S]*?)<\/g>/);
const borderPaths = [];
if (bordersMatch) {
  const borderRegex = /<path\s+class="([^"]+)"\s+d="([^"]+)"\/>/g;
  let bMatch;
  while ((bMatch = borderRegex.exec(bordersMatch[1])) !== null) {
    borderPaths.push({
      id: bMatch[1],
      d: bMatch[2],
    });
  }
}

// Extract separator line for Alaska / Hawaii
const separatorMatch = svg.match(/<path class="separator1"[^>]*d="([^"]+)"/);
const separator = separatorMatch ? separatorMatch[1] : '';

fs.mkdirSync('src/data', { recursive: true });

const outputTs = `// Generated State and Capital Dataset with SVG Path definitions
export interface USState {
  id: string;
  name: string;
  capital: string;
  region: 'West' | 'Midwest' | 'South' | 'Northeast' | 'Other';
  nickname: string;
  color: string;
  d: string;
  capitalCoordinates: { x: number; y: number };
}

export interface BorderPath {
  id: string;
  d: string;
}

export const US_STATES: USState[] = ${JSON.stringify(states, null, 2)};

export const BORDER_PATHS: BorderPath[] = ${JSON.stringify(borderPaths, null, 2)};

export const SEPARATOR_PATH = ${JSON.stringify(separator)};

export const REGION_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  West: { bg: '#38bdf8', text: '#0369a1', badge: 'bg-sky-100 text-sky-800' },
  Midwest: { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
  South: { bg: '#fbbf24', text: '#b45309', badge: 'bg-amber-100 text-amber-800' },
  Northeast: { bg: '#a78bfa', text: '#6d28d9', badge: 'bg-purple-100 text-purple-800' },
};
`;

fs.writeFileSync('src/data/statesData.ts', outputTs, 'utf8');
console.log(`Successfully parsed ${states.length} states and ${borderPaths.length} borders!`);
