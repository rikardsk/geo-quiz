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
    const japan = getStateById('jp');
    expect(japan).toBeDefined();
    expect(japan?.name).toBe('Japan');
    expect(japan?.capital).toBe('Tokyo');
  });

  it('returns undefined for invalid id', () => {
    expect(getStateById('XX')).toBeUndefined();
    expect(getStateById('')).toBeUndefined();
  });

  it('finds a country by name case-insensitively', () => {
    const indonesia = getStateByName('indonesia');
    expect(indonesia).toBeDefined();
    expect(indonesia?.id).toBe('ID');
    expect(indonesia?.capital).toBe('Jakarta');
  });

  it('filters countries by region', () => {
    const eastAsia = filterStatesByRegion('East Asia');
    expect(eastAsia.length).toBe(6);
    expect(eastAsia.every((s) => s.region === 'East Asia')).toBe(true);

    const southeastAsia = filterStatesByRegion('Southeast Asia');
    expect(southeastAsia.length).toBe(11);
    expect(southeastAsia.every((s) => s.region === 'Southeast Asia')).toBe(true);

    const all = filterStatesByRegion('All');
    expect(all.length).toBe(17);
  });

  it('searches countries by name, capital, or id', () => {
    const matches = searchStates('tokyo');
    expect(matches.length).toBe(1);
    expect(matches[0].name).toBe('Japan');

    const idMatches = searchStates('tw');
    expect(idMatches.some((s) => s.id === 'TW')).toBe(true);
  });

  it('calculates exploration percentage accurately', () => {
    const emptySet = new Set<string>();
    expect(getExplorationPercentage(emptySet)).toBe(0);

    const fullSet = new Set<string>(['JP', 'CN', 'KR']);
    expect(getExplorationPercentage(fullSet)).toBeGreaterThan(0);
  });
});
