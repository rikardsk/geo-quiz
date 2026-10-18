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
    const california = getStateById('ca');
    expect(california).toBeDefined();
    expect(california?.name).toBe('California');
    expect(california?.capital).toBe('Sacramento');
  });

  it('returns undefined for invalid id', () => {
    expect(getStateById('XX')).toBeUndefined();
    expect(getStateById('')).toBeUndefined();
  });

  it('finds a state by name case-insensitively', () => {
    const texas = getStateByName('texas');
    expect(texas).toBeDefined();
    expect(texas?.id).toBe('TX');
    expect(texas?.capital).toBe('Austin');
  });

  it('filters states by region', () => {
    const westStates = filterStatesByRegion('West');
    expect(westStates.length).toBeGreaterThan(0);
    expect(westStates.every((s) => s.region === 'West')).toBe(true);

    const allStates = filterStatesByRegion('All');
    expect(allStates.length).toBe(51);
  });

  it('searches states by name, capital, or id', () => {
    const matches = searchStates('denver');
    expect(matches.length).toBe(1);
    expect(matches[0].name).toBe('Colorado');

    const nyMatches = searchStates('ny');
    expect(nyMatches.some((s) => s.id === 'NY')).toBe(true);
  });

  it('calculates exploration percentage accurately', () => {
    const emptySet = new Set<string>();
    expect(getExplorationPercentage(emptySet)).toBe(0);

    const fullSet = new Set<string>(['CA', 'TX', 'NY']);
    expect(getExplorationPercentage(fullSet)).toBeGreaterThan(0);
  });
});
