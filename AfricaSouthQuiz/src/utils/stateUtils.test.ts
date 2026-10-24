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
    const kenya = getStateById('ke');
    expect(kenya).toBeDefined();
    expect(kenya?.name).toBe('Kenya');
    expect(kenya?.capital).toBe('Nairobi');
  });

  it('returns undefined for invalid id', () => {
    expect(getStateById('XX')).toBeUndefined();
    expect(getStateById('')).toBeUndefined();
  });

  it('finds a country by name case-insensitively', () => {
    const southAfrica = getStateByName('south africa');
    expect(southAfrica).toBeDefined();
    expect(southAfrica?.id).toBe('ZA');
    expect(southAfrica?.capital).toBe('Pretoria');
  });

  it('filters countries by region', () => {
    const eastAfrica = filterStatesByRegion('East Africa');
    expect(eastAfrica.length).toBe(18);
    expect(eastAfrica.every((s) => s.region === 'East Africa')).toBe(true);

    const southernAfrica = filterStatesByRegion('Southern Africa');
    expect(southernAfrica.length).toBe(5);

    const centralAfrica = filterStatesByRegion('Central Africa');
    expect(centralAfrica.length).toBe(4);

    const all = filterStatesByRegion('All');
    expect(all.length).toBe(27);
  });

  it('searches countries by name, capital, or id', () => {
    const matches = searchStates('nairobi');
    expect(matches.length).toBe(1);
    expect(matches[0].name).toBe('Kenya');

    const zaMatches = searchStates('za');
    expect(zaMatches.some((s) => s.id === 'ZA')).toBe(true);
  });

  it('calculates exploration percentage accurately', () => {
    const emptySet = new Set<string>();
    expect(getExplorationPercentage(emptySet)).toBe(0);

    const fullSet = new Set<string>(['KE', 'ZA', 'TZ']);
    expect(getExplorationPercentage(fullSet)).toBeGreaterThan(0);
  });
});
