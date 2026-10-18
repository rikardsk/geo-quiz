const fs = require('fs');

const svgContent = fs.readFileSync('south-america.svg', 'utf8');

const pathMatches = svgContent.match(/<path[\s\S]*?<\/path>/g) || [];
const paths = {};
for (const p of pathMatches) {
  const id = p.match(/id="([^"]+)"/)[1];
  const d = p.match(/\sd="([^"]+)"/)[1];
  paths[id] = d;
}

// French Guiana path
paths['GF'] = "M284.5,71.0 L283.9,74.9 L279.8,79.5 L279.4,85.7 L280.3,90.7 L283.3,95.1 L283.8,97.0 L281.4,100.5 L281.8,102.2 L279.5,107.1 L276.7,108.9 L281.7,111.4 L285.1,109.4 L290.3,109.2 L294.4,111.3 L297.2,109.5 L305.7,95.4 L308.1,92.6 L311.3,91.4 L311.3,87.8 L306.8,83.0 L301.5,78.2 L296.2,75.0 L290.5,72.4 Z";

const REGION_COLORS = {
  Northern: '#38bdf8', // Caribbean / Guiana Sky Blue
  Western: '#fbbf24',  // Andean Gold
  Eastern: '#34d399',  // Amazonian Emerald
  Southern: '#a78bfa', // Southern Cone / Pampas Purple
};

const meta = [
  {
    id: 'AR',
    name: 'Argentina',
    capital: 'Buenos Aires',
    region: 'Southern',
    nickname: 'Land of Silver, Tango & The Pampas',
    color: REGION_COLORS.Southern,
    capitalCoordinates: { x: 228, y: 464 },
  },
  {
    id: 'BO',
    name: 'Bolivia',
    capital: 'Sucre',
    region: 'Western',
    nickname: 'Heart of South America & Salar de Uyuni',
    color: REGION_COLORS.Western,
    capitalCoordinates: { x: 178, y: 312 },
  },
  {
    id: 'BR',
    name: 'Brazil',
    capital: 'Brasília',
    region: 'Eastern',
    nickname: 'Land of the Palms, Samba & Amazonia',
    color: REGION_COLORS.Eastern,
    capitalCoordinates: { x: 312, y: 278 },
  },
  {
    id: 'CL',
    name: 'Chile',
    capital: 'Santiago',
    region: 'Southern',
    nickname: 'Land of Poets & The Long Thin Nation',
    color: REGION_COLORS.Southern,
    capitalCoordinates: { x: 135, y: 462 },
  },
  {
    id: 'CO',
    name: 'Colombia',
    capital: 'Bogotá',
    region: 'Northern',
    nickname: 'Gateway to South America & Coffee Axis',
    color: REGION_COLORS.Northern,
    capitalCoordinates: { x: 78, y: 82 },
  },
  {
    id: 'EC',
    name: 'Ecuador',
    capital: 'Quito',
    region: 'Western',
    nickname: 'Middle of the World & Galápagos Haven',
    color: REGION_COLORS.Western,
    capitalCoordinates: { x: 26, y: 147 },
  },
  {
    id: 'GF',
    name: 'French Guiana',
    capital: 'Cayenne',
    region: 'Northern',
    nickname: 'European Spaceport & Amazonian Rainforest',
    color: REGION_COLORS.Northern,
    capitalCoordinates: { x: 301, y: 78 },
  },
  {
    id: 'GY',
    name: 'Guyana',
    capital: 'Georgetown',
    region: 'Northern',
    nickname: 'Land of Many Waters & Kaieteur Falls',
    color: REGION_COLORS.Northern,
    capitalCoordinates: { x: 231, y: 54 },
  },
  {
    id: 'PY',
    name: 'Paraguay',
    capital: 'Asunción',
    region: 'Southern',
    nickname: 'Island Surrounded by Land & Guaraní Heart',
    color: REGION_COLORS.Southern,
    capitalCoordinates: { x: 220, y: 368 },
  },
  {
    id: 'PE',
    name: 'Peru',
    capital: 'Lima',
    region: 'Western',
    nickname: 'Cradle of the Incas & Machu Picchu',
    color: REGION_COLORS.Western,
    capitalCoordinates: { x: 42, y: 232 },
  },
  {
    id: 'SR',
    name: 'Suriname',
    capital: 'Paramaribo',
    region: 'Northern',
    nickname: 'Greenest Country on Earth & Wooden City',
    color: REGION_COLORS.Northern,
    capitalCoordinates: { x: 264, y: 72 },
  },
  {
    id: 'UY',
    name: 'Uruguay',
    capital: 'Montevideo',
    region: 'Southern',
    nickname: 'Switzerland of South America & Charrúa Land',
    color: REGION_COLORS.Southern,
    capitalCoordinates: { x: 251, y: 468 },
  },
  {
    id: 'VE',
    name: 'Venezuela',
    capital: 'Caracas',
    region: 'Northern',
    nickname: 'Land of Grace & Angel Falls',
    color: REGION_COLORS.Northern,
    capitalCoordinates: { x: 148, y: 22 },
  },
];

const countries = meta.map((m) => ({
  ...m,
  d: paths[m.id],
  isDirectTransform: false,
}));

// Falkland Islands (GB in Highcharts south-america.svg)
const backgroundPaths = [
  {
    id: 'gb',
    d: paths['GB'],
  },
];

const output = `// South American Countries and Capitals Dataset with SVG Path definitions
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

export type SouthAmericanCountry = USState;
export type EUMemberState = USState;

export interface BorderPath {
  id: string;
  d: string;
}

export const US_STATES: USState[] = ${JSON.stringify(countries, null, 2)};

export const SOUTH_AMERICAN_COUNTRIES: USState[] = US_STATES;
export const EU_STATES: USState[] = US_STATES;

export const NON_EU_PATHS: BorderPath[] = ${JSON.stringify(backgroundPaths, null, 2)};

export const BORDER_PATHS: BorderPath[] = NON_EU_PATHS;

export const SEPARATOR_PATH = '';

export const REGION_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  Northern: { bg: '#38bdf8', text: '#0369a1', badge: 'bg-sky-100 text-sky-800' },
  Western: { bg: '#fbbf24', text: '#b45309', badge: 'bg-amber-100 text-amber-800' },
  Southern: { bg: '#a78bfa', text: '#6d28d9', badge: 'bg-purple-100 text-purple-800' },
  Eastern: { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
};
`;

fs.writeFileSync('src/data/statesData.ts', output, 'utf8');
console.log('Successfully generated src/data/statesData.ts');
