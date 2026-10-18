export interface CountryFlagInfo {
  id: string;
  flagName: string;
  description: string;
  ratio: string;
  svgUrl: string;
}

export const EU_FLAG_INFO: CountryFlagInfo = {
  id: 'EU',
  flagName: 'Flag of Europe',
  description: 'Circle of 12 golden stars on blue field, symbolizing unity, solidarity, and harmony',
  ratio: '2:3',
  svgUrl: '/flags/eu.svg',
};

export const COUNTRY_FLAGS: Record<string, CountryFlagInfo> = {
  AT: {
    id: 'AT',
    flagName: 'Bindenschild',
    description: 'Three horizontal stripes of red, white, and red',
    ratio: '2:3',
    svgUrl: '/flags/at.svg',
  },
  BE: {
    id: 'BE',
    flagName: 'Drapeau de la Belgique',
    description: 'Three vertical stripes of black, yellow, and red',
    ratio: '13:15',
    svgUrl: '/flags/be.svg',
  },
  BG: {
    id: 'BG',
    flagName: 'Tricolor',
    description: 'Three horizontal stripes of white, green, and red',
    ratio: '3:5',
    svgUrl: '/flags/bg.svg',
  },
  HR: {
    id: 'HR',
    flagName: 'Trobojnica',
    description: 'Three horizontal stripes of red, white, and blue with the coat of arms',
    ratio: '1:2',
    svgUrl: '/flags/hr.svg',
  },
  CY: {
    id: 'CY',
    flagName: 'Flag of Cyprus',
    description: 'Copper island silhouette above twin olive branches on a white field',
    ratio: '3:5',
    svgUrl: '/flags/cy.svg',
  },
  CZ: {
    id: 'CZ',
    flagName: 'Czech Tricolour',
    description: 'White over red horizontal bands with a blue hoist triangle',
    ratio: '2:3',
    svgUrl: '/flags/cz.svg',
  },
  DK: {
    id: 'DK',
    flagName: 'Dannebrog',
    description: 'White Scandinavian cross on a red field (oldest continuous national flag)',
    ratio: '28:37',
    svgUrl: '/flags/dk.svg',
  },
  EE: {
    id: 'EE',
    flagName: 'Sinimustvalge',
    description: 'Three horizontal stripes of blue, black, and white',
    ratio: '7:11',
    svgUrl: '/flags/ee.svg',
  },
  FI: {
    id: 'FI',
    flagName: 'Siniristilippu',
    description: 'Blue Nordic cross on a crisp white field',
    ratio: '11:18',
    svgUrl: '/flags/fi.svg',
  },
  FR: {
    id: 'FR',
    flagName: 'Tricolore',
    description: 'Three vertical stripes of blue, white, and red',
    ratio: '2:3',
    svgUrl: '/flags/fr.svg',
  },
  DE: {
    id: 'DE',
    flagName: 'Bundesflagge',
    description: 'Three horizontal stripes of black, red, and gold',
    ratio: '3:5',
    svgUrl: '/flags/de.svg',
  },
  GR: {
    id: 'GR',
    flagName: 'Galanolefki',
    description: 'Nine horizontal blue and white stripes with a white cross canton',
    ratio: '2:3',
    svgUrl: '/flags/gr.svg',
  },
  HU: {
    id: 'HU',
    flagName: 'Magyar trikolór',
    description: 'Three horizontal stripes of red, white, and green',
    ratio: '1:2',
    svgUrl: '/flags/hu.svg',
  },
  IE: {
    id: 'IE',
    flagName: 'Irish Tricolour',
    description: 'Three vertical stripes of green, white, and orange',
    ratio: '1:2',
    svgUrl: '/flags/ie.svg',
  },
  IT: {
    id: 'IT',
    flagName: 'Il Tricolore',
    description: 'Three vertical stripes of green, white, and red',
    ratio: '2:3',
    svgUrl: '/flags/it.svg',
  },
  LV: {
    id: 'LV',
    flagName: 'Sarkanbaltsarkanais',
    description: 'Carmine red field divided by a narrow horizontal white stripe',
    ratio: '1:2',
    svgUrl: '/flags/lv.svg',
  },
  LT: {
    id: 'LT',
    flagName: 'Trispalvė',
    description: 'Three horizontal stripes of yellow, green, and red',
    ratio: '3:5',
    svgUrl: '/flags/lt.svg',
  },
  LU: {
    id: 'LU',
    flagName: 'Rout-Wäiss-Blo',
    description: 'Three horizontal stripes of red, white, and sky blue',
    ratio: '3:5',
    svgUrl: '/flags/lu.svg',
  },
  MT: {
    id: 'MT',
    flagName: 'Flag of Malta',
    description: 'Two vertical stripes of white and red with George Cross on upper hoist',
    ratio: '2:3',
    svgUrl: '/flags/mt.svg',
  },
  NL: {
    id: 'NL',
    flagName: 'Driekleur',
    description: 'Three horizontal stripes of bright vermilion red, white, and cobalt blue',
    ratio: '2:3',
    svgUrl: '/flags/nl.svg',
  },
  PL: {
    id: 'PL',
    flagName: 'Biało-czerwona',
    description: 'Two horizontal stripes of white above red',
    ratio: '5:8',
    svgUrl: '/flags/pl.svg',
  },
  PT: {
    id: 'PT',
    flagName: 'Bandeira de Portugal',
    description: 'Green and red vertical division with the armillary sphere and shield',
    ratio: '2:3',
    svgUrl: '/flags/pt.svg',
  },
  RO: {
    id: 'RO',
    flagName: 'Tricolorul',
    description: 'Three vertical stripes of blue, yellow, and red',
    ratio: '2:3',
    svgUrl: '/flags/ro.svg',
  },
  SK: {
    id: 'SK',
    flagName: 'Slovenská vlajka',
    description: 'White, blue, and red horizontal stripes with the Slovak coat of arms',
    ratio: '2:3',
    svgUrl: '/flags/sk.svg',
  },
  SI: {
    id: 'SI',
    flagName: 'Slovenska zastava',
    description: 'White, blue, and red horizontal stripes with the Triglav coat of arms',
    ratio: '1:2',
    svgUrl: '/flags/si.svg',
  },
  ES: {
    id: 'ES',
    flagName: 'La Rojigualda',
    description: 'Red, yellow (double width), and red stripes with the Spanish coat of arms',
    ratio: '2:3',
    svgUrl: '/flags/es.svg',
  },
  SE: {
    id: 'SE',
    flagName: 'Sveriges flagga',
    description: 'Yellow Scandinavian cross on a medium blue field',
    ratio: '5:8',
    svgUrl: '/flags/se.svg',
  },
};

export function getCountryFlag(countryId: string): CountryFlagInfo {
  const upper = countryId.toUpperCase();
  if (COUNTRY_FLAGS[upper]) {
    return COUNTRY_FLAGS[upper];
  }
  return {
    id: upper,
    flagName: `Flag of ${countryId}`,
    description: 'National flag of member state',
    ratio: '2:3',
    svgUrl: `/flags/${countryId.toLowerCase()}.svg`,
  };
}
