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
    const australia = getStateById('au');
    expect(australia).toBeDefined();
    expect(australia?.name).toBe('Australia');
    expect(australia?.capital).toBe('Canberra');
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
    const oceania = filterStatesByRegion('Oceania');
    expect(oceania.length).toBe(14);
    expect(oceania.every((s) => s.region === 'Oceania')).toBe(true);

    const southeastAsia = filterStatesByRegion('Southeast Asia');
    expect(southeastAsia.length).toBe(11);
    expect(southeastAsia.every((s) => s.region === 'Southeast Asia')).toBe(true);

    const all = filterStatesByRegion('All');
    expect(all.length).toBe(25);
  });

  it('searches countries by name, capital, or id', () => {
    const matches = searchStates('canberra');
    expect(matches.length).toBe(1);
    expect(matches[0].name).toBe('Australia');

    const idMatches = searchStates('nz');
    expect(idMatches.some((s) => s.id === 'NZ')).toBe(true);
  });

  it('calculates exploration percentage accurately', () => {
    const emptySet = new Set<string>();
    expect(getExplorationPercentage(emptySet)).toBe(0);

    const fullSet = new Set<string>(['AU', 'NZ', 'FJ']);
    expect(getExplorationPercentage(fullSet)).toBeGreaterThan(0);
  });
});
