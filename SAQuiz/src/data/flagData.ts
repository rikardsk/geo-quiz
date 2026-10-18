export interface CountryFlagInfo {
  id: string;
  flagName: string;
  description: string;
  ratio: string;
  svgUrl: string;
}

export const SA_FLAG_INFO: CountryFlagInfo = {
  id: 'SA',
  flagName: 'Emblem of South America',
  description: 'Golden map silhouette and star ring representing South American unity',
  ratio: '2:3',
  svgUrl: '/flags/sa.svg',
};

export const EU_FLAG_INFO = SA_FLAG_INFO;

export const COUNTRY_FLAGS: Record<string, CountryFlagInfo> = {
  AR: {
    id: 'AR',
    flagName: 'Bandera Oficial de la Nación',
    description: 'Light blue and white horizontal triband with the golden Sun of May in the center',
    ratio: '9:14',
    svgUrl: '/flags/ar.svg',
  },
  BO: {
    id: 'BO',
    flagName: 'La Tricolor',
    description: 'Three horizontal stripes of red (fauna), yellow (minerals), and green (flora)',
    ratio: '15:22',
    svgUrl: '/flags/bo.svg',
  },
  BR: {
    id: 'BR',
    flagName: 'Auriverde',
    description: 'Green field with a yellow rhombus and blue celestial globe with 27 white stars and motto "Ordem e Progresso"',
    ratio: '7:10',
    svgUrl: '/flags/br.svg',
  },
  CL: {
    id: 'CL',
    flagName: 'La Estrella Solitaria',
    description: 'Two equal horizontal bands of white and red with a blue square canton bearing a white 5-pointed star',
    ratio: '2:3',
    svgUrl: '/flags/cl.svg',
  },
  CO: {
    id: 'CO',
    flagName: 'Tricolor Nacional',
    description: 'Three horizontal stripes of yellow (half width), blue (quarter), and red (quarter)',
    ratio: '2:3',
    svgUrl: '/flags/co.svg',
  },
  EC: {
    id: 'EC',
    flagName: 'La Tricolor',
    description: 'Three horizontal stripes of yellow (double width), blue, and red with the national coat of arms in the center',
    ratio: '2:3',
    svgUrl: '/flags/ec.svg',
  },
  GF: {
    id: 'GF',
    flagName: 'Drapeau de la Guyane',
    description: 'Diagonally divided green (forests) and yellow (gold), centered with a red five-pointed star',
    ratio: '2:3',
    svgUrl: '/flags/gf.svg',
  },
  GY: {
    id: 'GY',
    flagName: 'The Golden Arrowhead',
    description: 'Green field with a red triangle edged in black superimposed on a golden triangle edged in white',
    ratio: '3:5',
    svgUrl: '/flags/gy.svg',
  },
  PY: {
    id: 'PY',
    flagName: 'Bandera Paraguaya',
    description: 'Red, white, and blue horizontal triband with the national coat of arms centered on the white band',
    ratio: '11:20',
    svgUrl: '/flags/py.svg',
  },
  PE: {
    id: 'PE',
    flagName: 'La Blanquirroja',
    description: 'Three vertical stripes of red, white, and red',
    ratio: '2:3',
    svgUrl: '/flags/pe.svg',
  },
  SR: {
    id: 'SR',
    flagName: 'Vlag van Suriname',
    description: 'Five horizontal bands of green, white, red (double width), white, and green with a central gold five-pointed star',
    ratio: '2:3',
    svgUrl: '/flags/sr.svg',
  },
  UY: {
    id: 'UY',
    flagName: 'Pabellón Nacional',
    description: 'Nine alternating horizontal stripes of white and blue with a white canton containing the golden Sun of May',
    ratio: '2:3',
    svgUrl: '/flags/uy.svg',
  },
  VE: {
    id: 'VE',
    flagName: 'Bandera Nacional de Venezuela',
    description: 'Three horizontal stripes of yellow, blue, and red with an arc of eight white five-pointed stars centered in the blue band',
    ratio: '2:3',
    svgUrl: '/flags/ve.svg',
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
    description: 'National flag of country',
    ratio: '2:3',
    svgUrl: `/flags/${countryId.toLowerCase()}.svg`,
  };
}
