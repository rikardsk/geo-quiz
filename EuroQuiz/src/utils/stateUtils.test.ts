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
    const germany = getStateById('de');
    expect(germany).toBeDefined();
    expect(germany?.name).toBe('Germany');
    expect(germany?.capital).toBe('Berlin');
  });

  it('returns undefined for invalid id', () => {
    expect(getStateById('XX')).toBeUndefined();
    expect(getStateById('')).toBeUndefined();
  });

  it('finds a country by name case-insensitively', () => {
    const france = getStateByName('france');
    expect(france).toBeDefined();
    expect(france?.id).toBe('FR');
    expect(france?.capital).toBe('Paris');
  });

  it('filters countries by region', () => {
    const northernCountries = filterStatesByRegion('Northern');
    expect(northernCountries.length).toBe(10);
    expect(northernCountries.every((s) => s.region === 'Northern')).toBe(true);

    const allCountries = filterStatesByRegion('All');
    expect(allCountries.length).toBe(45);
  });

  it('searches countries by name, capital, or id', () => {
    const matches = searchStates('paris');
    expect(matches.length).toBe(1);
    expect(matches[0].name).toBe('France');

    const itMatches = searchStates('it');
    expect(itMatches.some((s) => s.id === 'IT')).toBe(true);
  });

  it('calculates exploration percentage accurately', () => {
    const emptySet = new Set<string>();
    expect(getExplorationPercentage(emptySet)).toBe(0);

    const fullSet = new Set<string>(['DE', 'FR', 'IT', 'ES', 'PL', 'SE', 'NO', 'FI', 'DK']);
    expect(getExplorationPercentage(fullSet)).toBe(20);
  });
});
