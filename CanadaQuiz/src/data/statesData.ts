import { CANADA_MAP_PATHS } from './canadaMapPaths';

export interface USState {
  id: string;
  name: string;
  capital: string;
  region: 'West Coast' | 'Prairies' | 'Central' | 'Atlantic' | 'North';
  nickname: string;
  color: string;
  d: string;
  capitalCoordinates: { x: number; y: number };
}

export type CanadaProvince = USState;

export interface BorderPath {
  id: string;
  d: string;
}

export const REGION_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  'West Coast': { bg: '#38bdf8', text: '#0369a1', badge: 'bg-sky-100 text-sky-800' },
  'Prairies': { bg: '#34d399', text: '#047857', badge: 'bg-emerald-100 text-emerald-800' },
  'Central': { bg: '#10b981', text: '#065f46', badge: 'bg-teal-100 text-teal-800' },
  'Atlantic': { bg: '#fbbf24', text: '#b45309', badge: 'bg-amber-100 text-amber-800' },
  'North': { bg: '#a78bfa', text: '#6d28d9', badge: 'bg-purple-100 text-purple-800' },
};

interface ProvinceMetadata {
  id: string;
  name: string;
  capital: string;
  region: 'West Coast' | 'Prairies' | 'Central' | 'Atlantic' | 'North';
  nickname: string;
}

const PROVINCE_META: ProvinceMetadata[] = [
  {
    id: 'AB',
    name: 'Alberta',
    capital: 'Edmonton',
    region: 'Prairies',
    nickname: 'Wild Rose Country',
  },
  {
    id: 'BC',
    name: 'British Columbia',
    capital: 'Victoria',
    region: 'West Coast',
    nickname: 'Beautiful British Columbia',
  },
  {
    id: 'MB',
    name: 'Manitoba',
    capital: 'Winnipeg',
    region: 'Prairies',
    nickname: 'Keystone Province',
  },
  {
    id: 'NB',
    name: 'New Brunswick',
    capital: 'Fredericton',
    region: 'Atlantic',
    nickname: 'The Picture Province',
  },
  {
    id: 'NL',
    name: 'Newfoundland and Labrador',
    capital: "St. John's",
    region: 'Atlantic',
    nickname: 'The Rock',
  },
  {
    id: 'NS',
    name: 'Nova Scotia',
    capital: 'Halifax',
    region: 'Atlantic',
    nickname: "Canada's Ocean Playground",
  },
  {
    id: 'NT',
    name: 'Northwest Territories',
    capital: 'Yellowknife',
    region: 'North',
    nickname: 'Land of the Midnight Sun',
  },
  {
    id: 'NU',
    name: 'Nunavut',
    capital: 'Iqaluit',
    region: 'North',
    nickname: 'Our Land',
  },
  {
    id: 'ON',
    name: 'Ontario',
    capital: 'Toronto',
    region: 'Central',
    nickname: 'A Place to Grow',
  },
  {
    id: 'PE',
    name: 'Prince Edward Island',
    capital: 'Charlottetown',
    region: 'Atlantic',
    nickname: 'Birthplace of Confederation',
  },
  {
    id: 'QC',
    name: 'Quebec',
    capital: 'Quebec City',
    region: 'Central',
    nickname: 'La Belle Province',
  },
  {
    id: 'SK',
    name: 'Saskatchewan',
    capital: 'Regina',
    region: 'Prairies',
    nickname: 'Land of Living Skies',
  },
  {
    id: 'YT',
    name: 'Yukon',
    capital: 'Whitehorse',
    region: 'North',
    nickname: 'The Klondike',
  },
];

export const US_STATES: USState[] = PROVINCE_META.map((meta) => {
  const geo = CANADA_MAP_PATHS[meta.id];
  const color = REGION_COLORS[meta.region]?.bg ?? '#38bdf8';
  return {
    id: meta.id,
    name: meta.name,
    capital: meta.capital,
    region: meta.region,
    nickname: meta.nickname,
    color,
    d: geo ? geo.d : '',
    capitalCoordinates: {
      x: geo ? geo.labelX : 0,
      y: geo ? geo.labelY : 0,
    },
  };
});

export const CANADA_PROVINCES = US_STATES;

export const BORDER_PATHS: BorderPath[] = [];

export const SEPARATOR_PATH = '';
