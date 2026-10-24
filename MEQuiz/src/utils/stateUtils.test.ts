import { describe, it, expect } from 'vitest';
import {
  getStateById,
  getStateByName,
  filterStatesByRegion,
  searchStates,
  getExplorationPercentage,
} from './stateUtils';

describe('stateUtils', () => {
  it('finds a country by id case-insensitively', () => {
    const egypt = getStateById('eg');
    expect(egypt).toBeDefined();
    expect(egypt?.name).toBe('Egypt');
    expect(egypt?.capital).toBe('Cairo');
  });

  it('returns undefined for invalid id', () => {
    expect(getStateById('XX')).toBeUndefined();
    expect(getStateById('')).toBeUndefined();
  });

  it('finds a country by name case-insensitively', () => {
    const sa = getStateByName('saudi arabia');
    expect(sa).toBeDefined();
    expect(sa?.id).toBe('SA');
    expect(sa?.capital).toBe('Riyadh');
  });

  it('filters countries by region', () => {
    const arabianStates = filterStatesByRegion('Arabian Peninsula');
    expect(arabianStates.length).toBe(7);
    expect(arabianStates.every((s) => s.region === 'Arabian Peninsula')).toBe(true);

    const allStates = filterStatesByRegion('All');
    expect(allStates.length).toBe(17);
  });

  it('searches countries by name, capital, or id', () => {
    const matches = searchStates('cairo');
    expect(matches.length).toBe(1);
    expect(matches[0].name).toBe('Egypt');

    const trMatches = searchStates('tr');
    expect(trMatches.some((s) => s.id === 'TR')).toBe(true);
  });

  it('calculates exploration percentage accurately', () => {
    const emptySet = new Set<string>();
    expect(getExplorationPercentage(emptySet)).toBe(0);

    const partialSet = new Set<string>(['EG', 'SA', 'TR']);
    expect(getExplorationPercentage(partialSet)).toBe(18);
  });
});
