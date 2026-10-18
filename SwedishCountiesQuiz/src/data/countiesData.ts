export type SwedenRegion = 'Götaland' | 'Svealand' | 'Norrland';

export interface SwedenCountyData {
  id: string; // Länsbokstav (AB, C, D, etc.)
  name: string; // e.g. 'Stockholms län'
  shortName: string; // e.g. 'Stockholm'
  largestCity: string; // e.g. 'Stockholm'
  largestCityPopulation: number;
  residenceCity: string; // Residensstad
  region: SwedenRegion;
  population: number;
  area: number; // km²
  municipalities: number; // Antal kommuner
  letter: string;
  coordinates: { x: number; y: number };
  primaryColor: string;
  secondaryColor: string;
  coatOfArms: string;
  trivia: string;
  // Backward compatibility fields
  city: string;
  county: string;
  stadium: string;
  founded: number;
  capacity: number;
  titles: number;
  logo: string;
  conference: SwedenRegion;
  division: SwedenRegion;
  state: string;
}

// Aliases for compatibility
export type AllsvenskanClub = SwedenCountyData;
export type MLSTeam = SwedenCountyData;
export type NBATeam = SwedenCountyData;
export type Conference = SwedenRegion;
export type FullDivision = SwedenRegion;

export const REGION_THEMES: Record<
  SwedenRegion,
  { primary: string; light: string; border: string; badge: string; text: string }
> = {
  Götaland: {
    primary: '#0284c7',
    light: '#f0f9ff',
    border: '#7dd3fc',
    badge: 'bg-sky-100 text-sky-800 border-sky-300',
    text: 'text-sky-700',
  },
  Svealand: {
    primary: '#d97706',
    light: '#fffbeb',
    border: '#fcd34d',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    text: 'text-amber-700',
  },
  Norrland: {
    primary: '#16a34a',
    light: '#f0fdf4',
    border: '#86efac',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    text: 'text-emerald-700',
  },
};

export const REGION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Götaland: { bg: '#e0f2fe', text: '#0284c7', border: '#7dd3fc' },
  Svealand: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
  Norrland: { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
  All: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
};

export const DIVISION_COLORS = REGION_COLORS;

// Helper to create clean vector SVG coat of arms data URIs
function makeShieldSvg(bg: string, content: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"><path d="M10 10 H90 V70 C90 95 50 115 50 115 C50 115 10 95 10 70 Z" fill="${bg}" stroke="#1e293b" stroke-width="3" stroke-linejoin="round"/>${content}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SWEDISH_COUNTIES: SwedenCountyData[] = [
  {
    id: 'AB',
    name: 'Stockholms län',
    shortName: 'Stockholm',
    largestCity: 'Stockholm',
    largestCityPopulation: 984745,
    residenceCity: 'Stockholm',
    region: 'Svealand',
    population: 2454821,
    area: 6519,
    municipalities: 26,
    letter: 'AB',
    coordinates: { x: 270, y: 665 },
    primaryColor: '#005293',
    secondaryColor: '#FFD200',
    coatOfArms: makeShieldSvg(
      '#005293',
      '<circle cx="50" cy="55" r="24" fill="#ffd200" stroke="#b45309" stroke-width="2"/><path d="M38 52 C38 42 62 42 62 52 C62 60 38 60 38 52 Z" fill="#ffffff"/><path d="M35 44 L40 32 L50 40 L60 32 L65 44 Z" fill="#ffd200" stroke="#b45309" stroke-width="1.5"/><circle cx="44" cy="54" r="2.5" fill="#0f172a"/><circle cx="56" cy="54" r="2.5" fill="#0f172a"/><path d="M46 64 Q50 68 54 64" stroke="#0f172a" stroke-width="2" fill="none"/>'
    ),
    trivia: 'Sveriges folkrikaste län med över 2,4 miljoner invånare. Stockholm är Sveriges huvudstad och Nordens största tätort.',
    city: 'Stockholm',
    county: 'Stockholm',
    stadium: 'Största stad: Stockholm',
    founded: 1634,
    capacity: 2454821,
    titles: 26,
    logo: makeShieldSvg(
      '#005293',
      '<circle cx="50" cy="55" r="24" fill="#ffd200" stroke="#b45309" stroke-width="2"/><path d="M35 44 L40 32 L50 40 L60 32 L65 44 Z" fill="#ffd200" stroke="#b45309" stroke-width="1.5"/>'
    ),
    conference: 'Svealand',
    division: 'Svealand',
    state: 'AB',
  },
  {
    id: 'C',
    name: 'Uppsala län',
    shortName: 'Uppsala',
    largestCity: 'Uppsala',
    largestCityPopulation: 168760,
    residenceCity: 'Uppsala',
    region: 'Svealand',
    population: 404589,
    area: 8207,
    municipalities: 8,
    letter: 'C',
    coordinates: { x: 253, y: 636 },
    primaryColor: '#C41230',
    secondaryColor: '#FFD700',
    coatOfArms: makeShieldSvg(
      '#c41230',
      '<circle cx="50" cy="65" r="22" fill="#ffd700" stroke="#78350f" stroke-width="2"/><circle cx="50" cy="65" r="22" fill="none" stroke="#78350f" stroke-width="2"/><path d="M50 43 V32 M44 37 H56" stroke="#ffd700" stroke-width="4" stroke-linecap="round"/><path d="M28 65 H72 M50 43 V87" stroke="#78350f" stroke-width="2"/>'
    ),
    trivia: 'Uppsala är Sveriges fjärde största stad och hem till Nordens äldsta universitet grundat 1477 samt Uppsala domkyrka.',
    city: 'Uppsala',
    county: 'Uppsala',
    stadium: 'Största stad: Uppsala',
    founded: 1634,
    capacity: 404589,
    titles: 8,
    logo: makeShieldSvg(
      '#c41230',
      '<circle cx="50" cy="65" r="20" fill="#ffd700"/><path d="M50 45 V32 M43 38 H57" stroke="#ffd700" stroke-width="4"/>'
    ),
    conference: 'Svealand',
    division: 'Svealand',
    state: 'C',
  },
  {
    id: 'D',
    name: 'Södermanlands län',
    shortName: 'Södermanland',
    largestCity: 'Eskilstuna',
    largestCityPopulation: 70342,
    residenceCity: 'Nyköping',
    region: 'Svealand',
    population: 302565,
    area: 6102,
    municipalities: 9,
    letter: 'D',
    coordinates: { x: 210, y: 667 },
    primaryColor: '#FFD700',
    secondaryColor: '#000000',
    coatOfArms: makeShieldSvg(
      '#ffd700',
      '<path d="M50 30 C35 30 32 45 35 55 C25 60 22 75 35 85 C42 85 45 80 50 82 C55 80 58 85 65 85 C78 75 75 60 65 55 C68 45 65 30 50 30 Z" fill="#0f172a"/><path d="M50 35 L58 48 H42 Z" fill="#c41230"/><circle cx="45" cy="42" r="2" fill="#ffd700"/><circle cx="55" cy="42" r="2" fill="#ffd700"/>'
    ),
    trivia: 'I Södermanland är Eskilstuna den största staden (känd som "Smedstan"), medan Nyköping är länets historiska residensstad.',
    city: 'Eskilstuna',
    county: 'Södermanland',
    stadium: 'Största stad: Eskilstuna (Residensstad: Nyköping)',
    founded: 1634,
    capacity: 302565,
    titles: 9,
    logo: makeShieldSvg(
      '#ffd700',
      '<path d="M35 40 Q50 25 65 40 Q75 65 50 85 Q25 65 35 40 Z" fill="#0f172a"/>'
    ),
    conference: 'Svealand',
    division: 'Svealand',
    state: 'D',
  },
  {
    id: 'E',
    name: 'Östergötlands län',
    shortName: 'Östergötland',
    largestCity: 'Linköping',
    largestCityPopulation: 115682,
    residenceCity: 'Linköping',
    region: 'Götaland',
    population: 472298,
    area: 10602,
    municipalities: 13,
    letter: 'E',
    coordinates: { x: 185, y: 715 },
    primaryColor: '#C41230',
    secondaryColor: '#FFD700',
    coatOfArms: makeShieldSvg(
      '#c41230',
      '<path d="M50 25 L75 55 H25 Z" fill="#ffd700"/><path d="M50 55 L70 95 L50 85 L30 95 Z" fill="#ffd700"/><circle cx="50" cy="45" r="6" fill="#c41230"/>'
    ),
    trivia: 'Östergötland rymmer två stora städer: residensstaden Linköping (flyg- och universitetsstad) och Norrköping (den klassiska textil- och industristaden).',
    city: 'Linköping',
    county: 'Östergötland',
    stadium: 'Största stad: Linköping',
    founded: 1634,
    capacity: 472298,
    titles: 13,
    logo: makeShieldSvg(
      '#c41230',
      '<path d="M50 25 L75 55 H25 Z" fill="#ffd700"/>'
    ),
    conference: 'Götaland',
    division: 'Götaland',
    state: 'E',
  },
  {
    id: 'F',
    name: 'Jönköpings län',
    shortName: 'Jönköping',
    largestCity: 'Jönköping',
    largestCityPopulation: 100579,
    residenceCity: 'Jönköping',
    region: 'Götaland',
    population: 369133,
    area: 10495,
    municipalities: 13,
    letter: 'F',
    coordinates: { x: 134, y: 738 },
    primaryColor: '#003399',
    secondaryColor: '#C41230',
    coatOfArms: makeShieldSvg(
      '#c41230',
      '<rect x="25" y="55" width="50" height="35" fill="#003399" stroke="#ffffff" stroke-width="2"/><rect x="20" y="45" width="16" height="20" fill="#003399" stroke="#ffffff" stroke-width="2"/><rect x="64" y="45" width="16" height="20" fill="#003399" stroke="#ffffff" stroke-width="2"/><rect x="42" y="35" width="16" height="30" fill="#003399" stroke="#ffffff" stroke-width="2"/><path d="M46 72 H54 V90 H46 Z" fill="#ffd700"/>'
    ),
    trivia: 'Jönköping är vackert beläget vid Vätterns södra strand. Länet är känt för sitt blomstrande entreprenörskap och "Gnosjöandan".',
    city: 'Jönköping',
    county: 'Jönköping',
    stadium: 'Största stad: Jönköping',
    founded: 1639,
    capacity: 369133,
    titles: 13,
    logo: makeShieldSvg(
      '#c41230',
      '<rect x="30" y="45" width="40" height="40" fill="#003399"/>'
    ),
    conference: 'Götaland',
    division: 'Götaland',
    state: 'F',
  },
  {
    id: 'G',
    name: 'Kronobergs län',
    shortName: 'Kronoberg',
    largestCity: 'Växjö',
    largestCityPopulation: 71282,
    residenceCity: 'Växjö',
    region: 'Götaland',
    population: 203686,
    area: 8466,
    municipalities: 8,
    letter: 'G',
    coordinates: { x: 148, y: 796 },
    primaryColor: '#FFD700',
    secondaryColor: '#C41230',
    coatOfArms: makeShieldSvg(
      '#ffd700',
      '<path d="M20 90 Q35 70 50 90 Q65 70 80 90 Z" fill="#15803d"/><path d="M50 35 C60 35 68 45 65 60 C65 75 45 78 45 85" stroke="#c41230" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M35 50 L65 50" stroke="#0f172a" stroke-width="3"/>'
    ),
    trivia: 'Kronobergs län ligger mitt i Smålands skogsbygder med residensstaden Växjö, ofta kallad "Europas grönaste stad".',
    city: 'Växjö',
    county: 'Kronoberg',
    stadium: 'Största stad: Växjö',
    founded: 1674,
    capacity: 203686,
    titles: 8,
    logo: makeShieldSvg(
      '#ffd700',
      '<path d="M45 40 Q55 30 60 50 Q60 70 45 80" stroke="#c41230" stroke-width="6" fill="none"/>'
    ),
    conference: 'Götaland',
    division: 'Götaland',
    state: 'G',
  },
  {
    id: 'H',
    name: 'Kalmar län',
    shortName: 'Kalmar',
    largestCity: 'Kalmar',
    largestCityPopulation: 41852,
    residenceCity: 'Kalmar',
    region: 'Götaland',
    population: 247175,
    area: 11218,
    municipalities: 12,
    letter: 'H',
    coordinates: { x: 210, y: 807 },
    primaryColor: '#C41230',
    secondaryColor: '#FFD700',
    coatOfArms: makeShieldSvg(
      '#ffd700',
      '<path d="M45 45 C45 35 55 35 55 45 L55 80 L62 92 M55 80 L48 92" stroke="#c41230" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M45 35 L38 25 M55 35 L62 25 M38 28 L32 26 M62 28 L68 26" stroke="#c41230" stroke-width="2.5" stroke-linecap="round"/>'
    ),
    trivia: 'Kalmar är en av Sveriges äldsta städer med anrika Kalmar slott där Kalmarunionen undertecknades 1397. Länet omfattar även hela Öland.',
    city: 'Kalmar',
    county: 'Kalmar',
    stadium: 'Största stad: Kalmar',
    founded: 1634,
    capacity: 247175,
    titles: 12,
    logo: makeShieldSvg(
      '#ffd700',
      '<path d="M50 45 V80 M42 32 L50 45 L58 32" stroke="#c41230" stroke-width="4"/>'
    ),
    conference: 'Götaland',
    division: 'Götaland',
    state: 'H',
  },
  {
    id: 'I',
    name: 'Gotlands län',
    shortName: 'Gotland',
    largestCity: 'Visby',
    largestCityPopulation: 24951,
    residenceCity: 'Visby',
    region: 'Götaland',
    population: 61001,
    area: 3151,
    municipalities: 1,
    letter: 'I',
    coordinates: { x: 276, y: 765 },
    primaryColor: '#005293',
    secondaryColor: '#C41230',
    coatOfArms: makeShieldSvg(
      '#005293',
      '<path d="M30 65 Q35 45 50 45 Q65 45 70 65 Q65 80 50 80 Q35 80 30 65 Z" fill="#ffffff"/><path d="M45 45 L45 22 L65 22 L55 30 L65 38 L45 38" fill="#c41230"/><path d="M45 22 V45" stroke="#ffd700" stroke-width="3"/>'
    ),
    trivia: 'Sveriges enda län med bara en enda kommun (Region Gotland). Hansestaden Visby är upptagen på UNESCO:s världsarvslista.',
    city: 'Visby',
    county: 'Gotland',
    stadium: 'Största stad: Visby',
    founded: 1678,
    capacity: 61001,
    titles: 1,
    logo: makeShieldSvg(
      '#005293',
      '<path d="M35 60 Q50 45 65 60 Q50 75 35 60 Z" fill="#ffffff"/><path d="M50 25 V45 M50 25 H65 L57 32 L65 40 H50" stroke="#c41230" stroke-width="2" fill="#c41230"/>'
    ),
    conference: 'Götaland',
    division: 'Götaland',
    state: 'I',
  },
  {
    id: 'K',
    name: 'Blekinge län',
    shortName: 'Blekinge',
    largestCity: 'Karlskrona',
    largestCityPopulation: 36904,
    residenceCity: 'Karlskrona',
    region: 'Götaland',
    population: 158506,
    area: 2947,
    municipalities: 5,
    letter: 'K',
    coordinates: { x: 180, y: 828 },
    primaryColor: '#003399',
    secondaryColor: '#FFD700',
    coatOfArms: makeShieldSvg(
      '#003399',
      '<path d="M47 85 V60 C40 55 35 40 50 35 C65 40 60 55 53 60 V85 Z" fill="#15803d"/><path d="M45 85 H55" stroke="#78350f" stroke-width="6"/><circle cx="50" cy="48" r="8" fill="#ffd700"/><circle cx="36" cy="62" r="6" fill="#ffd700"/><circle cx="64" cy="62" r="6" fill="#ffd700"/>'
    ),
    trivia: 'Sveriges till ytan minsta län på fastlandet, ofta kallat "Sveriges trädgård". Residensstaden Karlskrona är Sveriges marinbas och ett världsarv.',
    city: 'Karlskrona',
    county: 'Blekinge',
    stadium: 'Största stad: Karlskrona',
    founded: 1683,
    capacity: 158506,
    titles: 5,
    logo: makeShieldSvg(
      '#003399',
      '<path d="M50 35 Q65 45 50 65 Q35 45 50 35 Z" fill="#15803d"/><circle cx="50" cy="50" r="5" fill="#ffd700"/>'
    ),
    conference: 'Götaland',
    division: 'Götaland',
    state: 'K',
  },
  {
    id: 'M',
    name: 'Skåne län',
    shortName: 'Skåne',
    largestCity: 'Malmö',
    largestCityPopulation: 324956,
    residenceCity: 'Malmö',
    region: 'Götaland',
    population: 1414324,
    area: 11035,
    municipalities: 33,
    letter: 'M',
    coordinates: { x: 95, y: 860 },
    primaryColor: '#C41230',
    secondaryColor: '#FFD700',
    coatOfArms: makeShieldSvg(
      '#ffd700',
      '<path d="M35 75 Q40 40 65 40 Q75 55 70 75 Q50 85 35 75 Z" fill="#c41230"/><path d="M65 40 L78 45 L68 52 Z" fill="#c41230"/><circle cx="58" cy="48" r="3" fill="#ffd700"/><path d="M55 35 L60 25 L65 32 L70 25 L75 35 Z" fill="#ffd700" stroke="#78350f" stroke-width="1"/>'
    ),
    trivia: 'Sveriges sydligaste län med Malmö som landets tredje största stad och knutpunkt till Köpenhamn via Öresundsbron.',
    city: 'Malmö',
    county: 'Skåne',
    stadium: 'Största stad: Malmö',
    founded: 1997,
    capacity: 1414324,
    titles: 33,
    logo: makeShieldSvg(
      '#ffd700',
      '<path d="M40 70 Q45 45 65 45 Q70 60 65 70 Z" fill="#c41230"/><path d="M58 40 L65 30 L72 40 Z" fill="#ffd700"/>'
    ),
    conference: 'Götaland',
    division: 'Götaland',
    state: 'M',
  },
  {
    id: 'N',
    name: 'Hallands län',
    shortName: 'Halland',
    largestCity: 'Halmstad',
    largestCityPopulation: 71316,
    residenceCity: 'Halmstad',
    region: 'Götaland',
    population: 343646,
    area: 5461,
    municipalities: 6,
    letter: 'N',
    coordinates: { x: 90, y: 806 },
    primaryColor: '#003399',
    secondaryColor: '#FFD700',
    coatOfArms: makeShieldSvg(
      '#ffffff',
      '<path d="M50 35 C65 35 70 50 68 65 C65 78 45 82 40 88" stroke="#003399" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="60" cy="42" r="3" fill="#c41230"/><path d="M55 55 L75 50" stroke="#003399" stroke-width="4" stroke-linecap="round"/>'
    ),
    trivia: 'Halland sträcker sig längs Kattegattkusten med berömda sandstränder som Tylösand i residensstaden Halmstad samt de fyra åarna Viskan, Ätran, Nissan och Lagan.',
    city: 'Halmstad',
    county: 'Halland',
    stadium: 'Största stad: Halmstad',
    founded: 1658,
    capacity: 343646,
    titles: 6,
    logo: makeShieldSvg(
      '#ffffff',
      '<path d="M45 40 Q60 30 65 50 Q65 70 45 80" stroke="#003399" stroke-width="6" fill="none"/>'
    ),
    conference: 'Götaland',
    division: 'Götaland',
    state: 'N',
  },
  {
    id: 'O',
    name: 'Västra Götalands län',
    shortName: 'Västra Götaland',
    largestCity: 'Göteborg',
    largestCityPopulation: 607874,
    residenceCity: 'Göteborg',
    region: 'Götaland',
    population: 1758656,
    area: 23949,
    municipalities: 49,
    letter: 'O',
    coordinates: { x: 55, y: 750 },
    primaryColor: '#005293',
    secondaryColor: '#FFD700',
    coatOfArms: makeShieldSvg(
      '#005293',
      '<path d="M25 60 H75 M50 25 V95" stroke="#ffd700" stroke-width="3"/><path d="M35 45 Q45 35 40 50 Q35 55 42 60" stroke="#ffd700" stroke-width="3" fill="none"/><path d="M65 45 Q55 35 60 50 Q65 55 58 60" stroke="#c41230" stroke-width="3" fill="none"/>'
    ),
    trivia: 'Sveriges näst folkrikaste län med Göteborg som Sveriges näst största stad och Nordens största exporthamn. Länet har flest kommuner i landet (49 st).',
    city: 'Göteborg',
    county: 'Västra Götaland',
    stadium: 'Största stad: Göteborg',
    founded: 1998,
    capacity: 1758656,
    titles: 49,
    logo: makeShieldSvg(
      '#005293',
      '<rect x="25" y="30" width="50" height="60" fill="none" stroke="#ffd700" stroke-width="3"/><path d="M38 45 L50 35 L62 45" stroke="#ffd700" stroke-width="3" fill="none"/>'
    ),
    conference: 'Götaland',
    division: 'Götaland',
    state: 'O',
  },
  {
    id: 'S',
    name: 'Värmlands län',
    shortName: 'Värmland',
    largestCity: 'Karlstad',
    largestCityPopulation: 65856,
    residenceCity: 'Karlstad',
    region: 'Svealand',
    population: 283976,
    area: 17591,
    municipalities: 16,
    letter: 'S',
    coordinates: { x: 104, y: 665 },
    primaryColor: '#005293',
    secondaryColor: '#FFD700',
    coatOfArms: makeShieldSvg(
      '#ffffff',
      '<path d="M50 35 Q40 50 30 65 Q50 60 50 85 Q50 60 70 65 Q60 50 50 35 Z" fill="#005293"/><circle cx="48" cy="42" r="2" fill="#ffd700"/><circle cx="52" cy="42" r="2" fill="#ffd700"/><path d="M50 35 L47 42 H53 Z" fill="#c41230"/>'
    ),
    trivia: 'Residensstaden Karlstad kallas "Solstaden" och ligger vid Vänerns norra strand där Klarälven mynnar i ett vackert delta.',
    city: 'Karlstad',
    county: 'Värmland',
    stadium: 'Största stad: Karlstad',
    founded: 1779,
    capacity: 283976,
    titles: 16,
    logo: makeShieldSvg(
      '#ffffff',
      '<path d="M50 35 L35 60 H65 Z" fill="#005293"/>'
    ),
    conference: 'Svealand',
    division: 'Svealand',
    state: 'S',
  },
  {
    id: 'T',
    name: 'Örebro län',
    shortName: 'Örebro',
    largestCity: 'Örebro',
    largestCityPopulation: 126604,
    residenceCity: 'Örebro',
    region: 'Svealand',
    population: 307772,
    area: 8546,
    municipalities: 12,
    letter: 'T',
    coordinates: { x: 164, y: 660 },
    primaryColor: '#FFD700',
    secondaryColor: '#003399',
    coatOfArms: makeShieldSvg(
      '#ffd700',
      '<path d="M30 30 L70 90 M70 30 L30 90" stroke="#003399" stroke-width="4"/><path d="M50 35 V85 M40 50 H60" stroke="#c41230" stroke-width="4"/>'
    ),
    trivia: 'Örebro är Sveriges sjunde största tätort, känt för det pampiga Örebro slott beläget på en holme i Svartån samt vattentornet Svampen.',
    city: 'Örebro',
    county: 'Örebro',
    stadium: 'Största stad: Örebro',
    founded: 1634,
    capacity: 307772,
    titles: 12,
    logo: makeShieldSvg(
      '#ffd700',
      '<path d="M35 35 L65 85 M65 35 L35 85" stroke="#003399" stroke-width="4"/>'
    ),
    conference: 'Svealand',
    division: 'Svealand',
    state: 'T',
  },
  {
    id: 'U',
    name: 'Västmanlands län',
    shortName: 'Västmanland',
    largestCity: 'Västerås',
    largestCityPopulation: 128660,
    residenceCity: 'Västerås',
    region: 'Svealand',
    population: 280713,
    area: 5145,
    municipalities: 10,
    letter: 'U',
    coordinates: { x: 216, y: 646 },
    primaryColor: '#006837',
    secondaryColor: '#FFD700',
    coatOfArms: makeShieldSvg(
      '#ffffff',
      '<path d="M20 90 Q35 60 50 90 Q65 60 80 90 Z" fill="#1e293b"/><path d="M35 60 Q30 40 38 45 Q42 55 35 60 Z" fill="#c41230"/><path d="M50 55 Q45 30 52 38 Q58 50 50 55 Z" fill="#c41230"/><path d="M65 60 Q60 40 68 45 Q72 55 65 60 Z" fill="#c41230"/>'
    ),
    trivia: 'Residensstaden Västerås är Sveriges sjätte största tätort och en historisk industristad vid Mälaren, känd för ABB, gurkor och domkyrkan.',
    city: 'Västerås',
    county: 'Västmanland',
    stadium: 'Största stad: Västerås',
    founded: 1634,
    capacity: 280713,
    titles: 10,
    logo: makeShieldSvg(
      '#ffffff',
      '<path d="M30 85 Q50 60 70 85 Z" fill="#1e293b"/><circle cx="50" cy="50" r="10" fill="#c41230"/>'
    ),
    conference: 'Svealand',
    division: 'Svealand',
    state: 'U',
  },
  {
    id: 'W',
    name: 'Dalarnas län',
    shortName: 'Dalarna',
    largestCity: 'Borlänge',
    largestCityPopulation: 44898,
    residenceCity: 'Falun',
    region: 'Svealand',
    population: 288310,
    area: 28189,
    municipalities: 15,
    letter: 'W',
    coordinates: { x: 165, y: 595 },
    primaryColor: '#003399',
    secondaryColor: '#FFD700',
    coatOfArms: makeShieldSvg(
      '#003399',
      '<path d="M30 35 L70 85 M70 35 L30 85" stroke="#ffd700" stroke-width="4"/><path d="M42 32 L50 25 L58 32 H42 Z" fill="#ffd700" stroke="#78350f" stroke-width="1.5"/>'
    ),
    trivia: 'I Dalarna är industristaden Borlänge den största tätorten, medan den historiska kopparstaden Falun (med Falu gruva) är residensstad.',
    city: 'Borlänge',
    county: 'Dalarna',
    stadium: 'Största stad: Borlänge (Residensstad: Falun)',
    founded: 1647,
    capacity: 288310,
    titles: 15,
    logo: makeShieldSvg(
      '#003399',
      '<path d="M35 35 L65 85 M65 35 L35 85" stroke="#ffd700" stroke-width="4"/><circle cx="50" cy="30" r="6" fill="#ffd700"/>'
    ),
    conference: 'Svealand',
    division: 'Svealand',
    state: 'W',
  },
  {
    id: 'X',
    name: 'Gävleborgs län',
    shortName: 'Gävleborg',
    largestCity: 'Gävle',
    largestCityPopulation: 77586,
    residenceCity: 'Gävle',
    region: 'Norrland',
    population: 287334,
    area: 18198,
    municipalities: 10,
    letter: 'X',
    coordinates: { x: 235, y: 590 },
    primaryColor: '#003399',
    secondaryColor: '#FFD700',
    coatOfArms: makeShieldSvg(
      '#003399',
      '<path d="M45 45 C45 35 55 35 55 45 L55 80 L62 92 M55 80 L48 92" stroke="#ffd700" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M45 35 Q40 20 50 18 Q55 22 48 35 M55 35 Q60 20 50 18" stroke="#ffd700" stroke-width="2.5" fill="none"/>'
    ),
    trivia: 'Gävleborg knyter samman Gästrikland och Hälsingland. Residensstaden Gävle är världskänd för den traditionsenliga Gävlebocken vid jul.',
    city: 'Gävle',
    county: 'Gävleborg',
    stadium: 'Största stad: Gävle',
    founded: 1762,
    capacity: 287334,
    titles: 10,
    logo: makeShieldSvg(
      '#003399',
      '<path d="M50 40 V80 M42 30 Q50 20 58 30" stroke="#ffd700" stroke-width="4"/>'
    ),
    conference: 'Norrland',
    division: 'Norrland',
    state: 'X',
  },
  {
    id: 'Y',
    name: 'Västernorrlands län',
    shortName: 'Västernorrland',
    largestCity: 'Sundsvall',
    largestCityPopulation: 58813,
    residenceCity: 'Härnösand',
    region: 'Norrland',
    population: 242625,
    area: 21684,
    municipalities: 7,
    letter: 'Y',
    coordinates: { x: 255, y: 480 },
    primaryColor: '#003399',
    secondaryColor: '#C41230',
    coatOfArms: makeShieldSvg(
      '#003399',
      '<path d="M30 45 Q50 35 70 45 Q50 55 30 45 Z" fill="#ffffff"/><path d="M30 65 Q50 55 70 65 Q50 75 30 65 Z" fill="#ffffff"/><path d="M30 85 Q50 75 70 85 Q50 95 30 85 Z" fill="#ffffff"/><circle cx="65" cy="45" r="1.5" fill="#c41230"/><circle cx="65" cy="65" r="1.5" fill="#c41230"/><circle cx="65" cy="85" r="1.5" fill="#c41230"/>'
    ),
    trivia: 'I Västernorrland är "Stenstan" Sundsvall den största staden, medan kuststaden Härnösand är residensstad. Länet rymmer även Höga Kusten.',
    city: 'Sundsvall',
    county: 'Västernorrland',
    stadium: 'Största stad: Sundsvall (Residensstad: Härnösand)',
    founded: 1654,
    capacity: 242625,
    titles: 7,
    logo: makeShieldSvg(
      '#003399',
      '<path d="M35 45 Q50 35 65 45 Q50 55 35 45 Z" fill="#ffffff"/><path d="M35 65 Q50 55 65 65 Q50 75 35 65 Z" fill="#ffffff"/>'
    ),
    conference: 'Norrland',
    division: 'Norrland',
    state: 'Y',
  },
  {
    id: 'Z',
    name: 'Jämtlands län',
    shortName: 'Jämtland',
    largestCity: 'Östersund',
    largestCityPopulation: 52719,
    residenceCity: 'Östersund',
    region: 'Norrland',
    population: 132649,
    area: 49343,
    municipalities: 8,
    letter: 'Z',
    coordinates: { x: 152, y: 440 },
    primaryColor: '#003399',
    secondaryColor: '#006837',
    coatOfArms: makeShieldSvg(
      '#003399',
      '<path d="M35 55 Q50 45 65 55 Q55 75 45 75 Z" fill="#ffffff"/><path d="M35 55 L25 40 M25 40 L20 42 M25 40 L28 35" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/><circle cx="60" cy="40" r="4" fill="#ffd700"/>'
    ),
    trivia: 'Jämtlands län omfattar storslagna fjällområden som Åre och sjön Storsjön vid residensstaden Östersund, känd för myten om Storsjöodjuret.',
    city: 'Östersund',
    county: 'Jämtland',
    stadium: 'Största stad: Östersund',
    founded: 1810,
    capacity: 132649,
    titles: 8,
    logo: makeShieldSvg(
      '#003399',
      '<path d="M35 55 Q50 45 65 55 Q50 70 35 55 Z" fill="#ffffff"/>'
    ),
    conference: 'Norrland',
    division: 'Norrland',
    state: 'Z',
  },
  {
    id: 'AC',
    name: 'Västerbottens län',
    shortName: 'Västerbotten',
    largestCity: 'Umeå',
    largestCityPopulation: 91916,
    residenceCity: 'Umeå',
    region: 'Norrland',
    population: 276295,
    area: 55186,
    municipalities: 15,
    letter: 'AC',
    coordinates: { x: 345, y: 385 },
    primaryColor: '#003399',
    secondaryColor: '#FFD700',
    coatOfArms: makeShieldSvg(
      '#003399',
      '<path d="M35 65 Q50 50 65 65 Q60 85 45 80 Z" fill="#ffffff"/><path d="M60 55 L68 40 M68 40 L74 38 M68 40 L64 34" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/><circle cx="35" cy="35" r="2" fill="#ffd700"/><circle cx="50" cy="25" r="2" fill="#ffd700"/><circle cx="70" cy="30" r="2" fill="#ffd700"/>'
    ),
    trivia: 'Residensstaden Umeå kallas "Björkarnas stad" och är Norrlands största tätort med ett stort universitet och dynamiskt kulturliv.',
    city: 'Umeå',
    county: 'Västerbotten',
    stadium: 'Största stad: Umeå',
    founded: 1638,
    capacity: 276295,
    titles: 15,
    logo: makeShieldSvg(
      '#003399',
      '<path d="M40 60 Q55 50 70 60 Q55 75 40 60 Z" fill="#ffffff"/>'
    ),
    conference: 'Norrland',
    division: 'Norrland',
    state: 'AC',
  },
  {
    id: 'BD',
    name: 'Norrbottens län',
    shortName: 'Norrbotten',
    largestCity: 'Luleå',
    largestCityPopulation: 49123,
    residenceCity: 'Luleå',
    region: 'Norrland',
    population: 249693,
    area: 98245,
    municipalities: 14,
    letter: 'BD',
    coordinates: { x: 435, y: 235 },
    primaryColor: '#003399',
    secondaryColor: '#FFD700',
    coatOfArms: makeShieldSvg(
      '#003399',
      '<rect x="20" y="25" width="30" height="35" fill="#ffffff"/><rect x="50" y="25" width="30" height="35" fill="#003399"/><rect x="20" y="60" width="30" height="35" fill="#003399"/><rect x="50" y="60" width="30" height="35" fill="#ffffff"/><path d="M35 40 Q40 35 45 45" stroke="#c41230" stroke-width="3" fill="none"/><path d="M60 75 Q65 70 70 80" stroke="#ffd700" stroke-width="3" fill="none"/>'
    ),
    trivia: 'Sveriges till ytan överlägset största län, täckande en fjärdedel av landets yta. Här finns Sveriges högsta berg Kebnekaise och residensstaden Luleå.',
    city: 'Luleå',
    county: 'Norrbotten',
    stadium: 'Största stad: Luleå',
    founded: 1810,
    capacity: 249693,
    titles: 14,
    logo: makeShieldSvg(
      '#003399',
      '<rect x="25" y="35" width="50" height="50" fill="#003399" stroke="#ffd700" stroke-width="2"/>'
    ),
    conference: 'Norrland',
    division: 'Norrland',
    state: 'BD',
  },
];

export const ALLSVENSKAN_CLUBS = SWEDISH_COUNTIES;
export const ALLSVENSKAN_TEAMS = SWEDISH_COUNTIES;
export const MLS_TEAMS = SWEDISH_COUNTIES;
export const NBA_TEAMS = SWEDISH_COUNTIES;

export const STATE_CONFERENCE_MAP: Record<string, SwedenRegion | 'Both' | 'None'> = {
  AB: 'Svealand',
  C: 'Svealand',
  D: 'Svealand',
  E: 'Götaland',
  F: 'Götaland',
  G: 'Götaland',
  H: 'Götaland',
  I: 'Götaland',
  K: 'Götaland',
  M: 'Götaland',
  N: 'Götaland',
  O: 'Götaland',
  S: 'Svealand',
  T: 'Svealand',
  U: 'Svealand',
  W: 'Svealand',
  X: 'Norrland',
  Y: 'Norrland',
  Z: 'Norrland',
  AC: 'Norrland',
  BD: 'Norrland',
};

export const STATE_DIVISION_MAP: Record<string, FullDivision[]> = {
  AB: ['Svealand'],
  C: ['Svealand'],
  D: ['Svealand'],
  E: ['Götaland'],
  F: ['Götaland'],
  G: ['Götaland'],
  H: ['Götaland'],
  I: ['Götaland'],
  K: ['Götaland'],
  M: ['Götaland'],
  N: ['Götaland'],
  O: ['Götaland'],
  S: ['Svealand'],
  T: ['Svealand'],
  U: ['Svealand'],
  W: ['Svealand'],
  X: ['Norrland'],
  Y: ['Norrland'],
  Z: ['Norrland'],
  AC: ['Norrland'],
  BD: ['Norrland'],
};
