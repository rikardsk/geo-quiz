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
    const mexico = getStateById('mx');
    expect(mexico).toBeDefined();
    expect(mexico?.name).toBe('Mexico');
    expect(mexico?.capital).toBe('Mexico City');
  });

  it('returns undefined for invalid id', () => {
    expect(getStateById('XX')).toBeUndefined();
    expect(getStateById('')).toBeUndefined();
  });

  it('finds a country by name case-insensitively', () => {
    const panama = getStateByName('panama');
    expect(panama).toBeDefined();
    expect(panama?.id).toBe('PA');
    expect(panama?.capital).toBe('Panama City');
  });

  it('filters countries by region', () => {
    const central = filterStatesByRegion('Central America');
    expect(central.length).toBe(8);
    expect(central.every((s) => s.region === 'Central America')).toBe(true);

    const greater = filterStatesByRegion('Greater Antilles');
    expect(greater.length).toBe(5);

    const lesser = filterStatesByRegion('Lesser Antilles');
    expect(lesser.length).toBe(8);

    const allCountries = filterStatesByRegion('All');
    expect(allCountries.length).toBe(21);
  });

  it('searches countries by name, capital, or id', () => {
    const matches = searchStates('havana');
    expect(matches.length).toBe(1);
    expect(matches[0].name).toBe('Cuba');

    const mxMatches = searchStates('mx');
    expect(mxMatches.some((s) => s.id === 'MX')).toBe(true);
  });

  it('calculates exploration percentage accurately', () => {
    const emptySet = new Set<string>();
    expect(getExplorationPercentage(emptySet)).toBe(0);

    const fullSet = new Set<string>(['MX', 'CU', 'PA']);
    expect(getExplorationPercentage(fullSet)).toBe(14);
  });
});
