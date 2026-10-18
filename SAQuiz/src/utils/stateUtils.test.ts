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
    const brazil = getStateById('br');
    expect(brazil).toBeDefined();
    expect(brazil?.name).toBe('Brazil');
    expect(brazil?.capital).toBe('Brasília');
  });

  it('returns undefined for invalid id', () => {
    expect(getStateById('XX')).toBeUndefined();
    expect(getStateById('')).toBeUndefined();
  });

  it('finds a state by name case-insensitively', () => {
    const argentina = getStateByName('argentina');
    expect(argentina).toBeDefined();
    expect(argentina?.id).toBe('AR');
    expect(argentina?.capital).toBe('Buenos Aires');
  });

  it('filters states by region', () => {
    const southern = filterStatesByRegion('Southern');
    expect(southern.length).toBeGreaterThan(0);
    expect(southern.every((s) => s.region === 'Southern')).toBe(true);

    const allStates = filterStatesByRegion('All');
    expect(allStates.length).toBe(13);
  });

  it('searches states by name, capital, or id', () => {
    const matches = searchStates('buenos aires');
    expect(matches.length).toBe(1);
    expect(matches[0].name).toBe('Argentina');

    const arMatches = searchStates('ar');
    expect(arMatches.some((s) => s.id === 'AR')).toBe(true);
  });

  it('calculates exploration percentage accurately', () => {
    const emptySet = new Set<string>();
    expect(getExplorationPercentage(emptySet)).toBe(0);

    const fullSet = new Set<string>(['AR', 'BR', 'CL']);
    expect(getExplorationPercentage(fullSet)).toBeGreaterThan(0);
  });
});
