import { describe, it, expect } from 'vitest';
import {
  getStateById,
  getStateByName,
  filterStatesByRegion,
  searchStates,
  getExplorationPercentage,
} from './stateUtils';

describe('stateUtils', () => {
  it('finds a state by id case-insensitively', () => {
    const france = getStateById('fr');
    expect(france).toBeDefined();
    expect(france?.name).toBe('France');
    expect(france?.capital).toBe('Paris');
  });

  it('returns undefined for invalid id', () => {
    expect(getStateById('XX')).toBeUndefined();
    expect(getStateById('')).toBeUndefined();
  });

  it('finds a state by name case-insensitively', () => {
    const germany = getStateByName('germany');
    expect(germany).toBeDefined();
    expect(germany?.id).toBe('DE');
    expect(germany?.capital).toBe('Berlin');
  });

  it('filters states by region', () => {
    const western = filterStatesByRegion('Western');
    expect(western.length).toBeGreaterThan(0);
    expect(western.every((s) => s.region === 'Western')).toBe(true);

    const allStates = filterStatesByRegion('All');
    expect(allStates.length).toBe(27);
  });

  it('searches states by name, capital, or id', () => {
    const matches = searchStates('paris');
    expect(matches.length).toBe(1);
    expect(matches[0].name).toBe('France');

    const itMatches = searchStates('it');
    expect(itMatches.some((s) => s.id === 'IT')).toBe(true);
  });

  it('calculates exploration percentage accurately', () => {
    const emptySet = new Set<string>();
    expect(getExplorationPercentage(emptySet)).toBe(0);

    const fullSet = new Set<string>(['FR', 'DE', 'IT']);
    expect(getExplorationPercentage(fullSet)).toBeGreaterThan(0);
  });
});
