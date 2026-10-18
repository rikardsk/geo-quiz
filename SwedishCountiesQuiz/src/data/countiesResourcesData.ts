export type ResourceCategory = 'All' | 'Officiell' | 'Statistik' | 'Kartor' | 'Geografi';

export interface CountyResource {
  id: string;
  name: string;
  category: 'Officiell' | 'Statistik' | 'Kartor' | 'Geografi';
  url: string;
  description: string;
}

export type AllsvenskanResource = CountyResource;
export type MLSResource = CountyResource;
export type NBAResource = CountyResource;

export const COUNTIES_STANDINGS_URL = 'https://www.scb.se/hitta-statistik/statistik-efter-amne/befolkning/befolkningens-sammansattning/befolkningsstatistik/';
export const ALLSVENSKAN_STANDINGS_URL = COUNTIES_STANDINGS_URL;
export const MLS_STANDINGS_URL = COUNTIES_STANDINGS_URL;
export const NBA_STANDINGS_URL = COUNTIES_STANDINGS_URL;

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  'All',
  'Officiell',
  'Statistik',
  'Kartor',
  'Geografi',
];

export const CATEGORY_BADGES: Record<string, string> = {
  Officiell: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Statistik: 'bg-purple-100 text-purple-800 border-purple-200',
  Kartor: 'bg-sky-100 text-sky-800 border-sky-200',
  Geografi: 'bg-amber-100 text-amber-800 border-amber-200',
};

export const COUNTIES_RESOURCES: CountyResource[] = [
  {
    id: 'lansstyrelserna',
    name: 'Länsstyrelserna.se',
    category: 'Officiell',
    url: 'https://www.lansstyrelsen.se',
    description: 'Officiell portal för Sveriges 21 länsstyrelser med regional information och samhällsservice.',
  },
  {
    id: 'scb-befolkning',
    name: 'SCB - Befolkningsstatistik per län',
    category: 'Statistik',
    url: 'https://www.scb.se/hitta-statistik/statistik-efter-amne/befolkning/befolkningens-sammansattning/befolkningsstatistik/',
    description: 'Statistiska centralbyråns officiella befolkningssiffror, folkmängd och tätortsstatistik för Sveriges 21 län.',
  },
  {
    id: 'lantmateriet',
    name: 'Lantmäteriet - Sveriges Kartor',
    category: 'Kartor',
    url: 'https://www.lantmateriet.se',
    description: 'Sveriges nationella kartmyndighet för gränser, ortnamn, fastighetsdata och geografisk information.',
  },
  {
    id: 'skr-regioner',
    name: 'SKR - Sveriges Kommuner och Regioner',
    category: 'Officiell',
    url: 'https://skr.se',
    description: 'Arbetsgivar- och intresseorganisation för landets 290 kommuner och 21 regioner.',
  },
  {
    id: 'wiki-sveriges-lan',
    name: 'Wikipedia: Sveriges län',
    category: 'Geografi',
    url: 'https://sv.wikipedia.org/wiki/Sveriges_l%C3%A4n',
    description: 'Omfattande historik och översikt över Sveriges 21 län, länsbokstäver, vapen och residensstäder.',
  },
  {
    id: 'wiki-tatorter',
    name: 'Wikipedia: Sveriges största tätorter',
    category: 'Geografi',
    url: 'https://sv.wikipedia.org/wiki/Lista_%C3%B6ver_Sveriges_t%C3%A4torter',
    description: 'Komplett lista över alla tätorter i Sverige rangordnade efter folkmängd och länsindelning.',
  },
];

export const ALLSVENSKAN_RESOURCES = COUNTIES_RESOURCES;
export const MLS_RESOURCES = COUNTIES_RESOURCES;
export const NBA_RESOURCES = COUNTIES_RESOURCES;
