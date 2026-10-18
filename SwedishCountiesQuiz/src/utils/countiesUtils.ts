import { SWEDISH_COUNTIES, SwedenCountyData, SwedenRegion } from '../data/countiesData';
import { FilterOption } from '../components/DivisionFilter';

export function searchCounties(query: string, counties: SwedenCountyData[] = SWEDISH_COUNTIES): SwedenCountyData[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  return counties.filter((c) => {
    return (
      c.name.toLowerCase().includes(clean) ||
      c.shortName.toLowerCase().includes(clean) ||
      c.largestCity.toLowerCase().includes(clean) ||
      c.residenceCity.toLowerCase().includes(clean) ||
      c.id.toLowerCase() === clean ||
      c.region.toLowerCase().includes(clean)
    );
  });
}

export function getCountyByName(name: string, counties: SwedenCountyData[] = SWEDISH_COUNTIES): SwedenCountyData | undefined {
  const clean = name.trim().toLowerCase();
  return counties.find(
    (c) =>
      c.name.toLowerCase() === clean ||
      c.shortName.toLowerCase() === clean ||
      c.largestCity.toLowerCase() === clean
  );
}

export function getCountyById(id: string, counties: SwedenCountyData[] = SWEDISH_COUNTIES): SwedenCountyData | undefined {
  const clean = id.trim().toUpperCase();
  return counties.find((c) => c.id.toUpperCase() === clean);
}

export function filterCountiesByRegion(region: FilterOption, counties: SwedenCountyData[] = SWEDISH_COUNTIES): SwedenCountyData[] {
  if (region === 'All') return counties;
  return counties.filter((c) => c.region === region);
}

export function formatPopulation(num: number): string {
  return num.toLocaleString('sv-SE');
}

export function formatArea(km2: number): string {
  return `${km2.toLocaleString('sv-SE')} km²`;
}

export function getRegionCountyCount(region: SwedenRegion, counties: SwedenCountyData[] = SWEDISH_COUNTIES): number {
  return counties.filter((c) => c.region === region).length;
}

// Backward compatibility aliases
export const formatCapacity = (n: number) => n === 0 ? 'N/A' : formatPopulation(n);
export const searchClubs = searchCounties;
export const getClubByName = getCountyByName;
export const getClubById = getCountyById;
export const filterClubsByRegion = filterCountiesByRegion;
export const getRegionClubCount = getRegionCountyCount;
