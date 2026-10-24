import { US_STATES, USState } from '../data/statesData';

export function getStateById(id: string): USState | undefined {
  if (!id) return undefined;
  const upperId = id.toUpperCase();
  return US_STATES.find((s) => s.id === upperId);
}

export function getStateByName(name: string): USState | undefined {
  if (!name) return undefined;
  const lowerName = name.trim().toLowerCase();
  return US_STATES.find((s) => s.name.toLowerCase() === lowerName);
}

export function filterStatesByRegion(region: string): USState[] {
  if (!region || region === 'All') {
    return US_STATES;
  }
  return US_STATES.filter((s) => s.region === region);
}

export function searchStates(query: string): USState[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return US_STATES;
  }
  return US_STATES.filter(
    (s) =>
      s.name.toLowerCase().includes(trimmed) ||
      s.capital.toLowerCase().includes(trimmed) ||
      s.id.toLowerCase().includes(trimmed)
  );
}

export function getExplorationPercentage(exploredIds: Set<string>): number {
  const total = US_STATES.length;
  if (total === 0) return 0;
  return Math.min(100, Math.round((exploredIds.size / total) * 100));
}
