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
    const morocco = getStateByName('morocco');
    expect(morocco).toBeDefined();
    expect(morocco?.id).toBe('MA');
    expect(morocco?.capital).toBe('Rabat');
  });

  it('filters countries by region', () => {
    const northAfrica = filterStatesByRegion('North Africa');
    expect(northAfrica.length).toBe(6);
    expect(northAfrica.every((s) => s.region === 'North Africa')).toBe(true);

    const westAfrica = filterStatesByRegion('West Africa');
    expect(westAfrica.length).toBe(16);

    const centralAfrica = filterStatesByRegion('Central Africa');
    expect(centralAfrica.length).toBe(5);

    const all = filterStatesByRegion('All');
    expect(all.length).toBe(27);
  });

  it('searches countries by name, capital, or id', () => {
    const matches = searchStates('cairo');
    expect(matches.length).toBe(1);
    expect(matches[0].name).toBe('Egypt');

    const maMatches = searchStates('ma');
    expect(maMatches.some((s) => s.id === 'MA')).toBe(true);
  });

  it('calculates exploration percentage accurately', () => {
    const emptySet = new Set<string>();
    expect(getExplorationPercentage(emptySet)).toBe(0);

    const fullSet = new Set<string>(['EG', 'MA', 'NG']);
    expect(getExplorationPercentage(fullSet)).toBeGreaterThan(0);
  });
});
