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
    const kazakhstan = getStateById('kz');
    expect(kazakhstan).toBeDefined();
    expect(kazakhstan?.name).toBe('Kazakhstan');
    expect(kazakhstan?.capital).toBe('Astana');
  });

  it('returns undefined for invalid id', () => {
    expect(getStateById('XX')).toBeUndefined();
    expect(getStateById('')).toBeUndefined();
  });

  it('finds a country by name case-insensitively', () => {
    const india = getStateByName('india');
    expect(india).toBeDefined();
    expect(india?.id).toBe('IN');
    expect(india?.capital).toBe('New Delhi');
  });

  it('filters countries by region', () => {
    const centralAsia = filterStatesByRegion('Central Asia');
    expect(centralAsia.length).toBe(6);
    expect(centralAsia.every((s) => s.region === 'Central Asia')).toBe(true);

    const southAsia = filterStatesByRegion('South Asia');
    expect(southAsia.length).toBe(7);
    expect(southAsia.every((s) => s.region === 'South Asia')).toBe(true);

    const all = filterStatesByRegion('All');
    expect(all.length).toBe(13);
  });

  it('searches countries by name, capital, or id', () => {
    const matches = searchStates('astana');
    expect(matches.length).toBe(1);
    expect(matches[0].name).toBe('Kazakhstan');

    const idMatches = searchStates('in');
    expect(idMatches.some((s) => s.id === 'IN')).toBe(true);
  });

  it('calculates exploration percentage accurately', () => {
    const emptySet = new Set<string>();
    expect(getExplorationPercentage(emptySet)).toBe(0);

    const fullSet = new Set<string>(['KZ', 'IN', 'PK']);
    expect(getExplorationPercentage(fullSet)).toBeGreaterThan(0);
  });
});
