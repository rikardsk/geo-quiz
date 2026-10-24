import { describe, it, expect } from 'vitest';
import {
  getStateById,
  getStateByName,
  filterStatesByRegion,
  searchStates,
  getExplorationPercentage,
} from './stateUtils';

describe('stateUtils', () => {
  it('finds a province by id case-insensitively', () => {
    const ontario = getStateById('on');
    expect(ontario).toBeDefined();
    expect(ontario?.name).toBe('Ontario');
    expect(ontario?.capital).toBe('Toronto');
  });

  it('returns undefined for invalid id', () => {
    expect(getStateById('XX')).toBeUndefined();
    expect(getStateById('')).toBeUndefined();
  });

  it('finds a province by name case-insensitively', () => {
    const bc = getStateByName('british columbia');
    expect(bc).toBeDefined();
    expect(bc?.id).toBe('BC');
    expect(bc?.capital).toBe('Victoria');
  });

  it('filters provinces by region', () => {
    const prairieStates = filterStatesByRegion('Prairies');
    expect(prairieStates.length).toBe(3);
    expect(prairieStates.every((s) => s.region === 'Prairies')).toBe(true);

    const allStates = filterStatesByRegion('All');
    expect(allStates.length).toBe(13);
  });

  it('searches provinces by name, capital, or id', () => {
    const matches = searchStates('toronto');
    expect(matches.length).toBe(1);
    expect(matches[0].name).toBe('Ontario');

    const qcMatches = searchStates('qc');
    expect(qcMatches.some((s) => s.id === 'QC')).toBe(true);
  });

  it('calculates exploration percentage accurately', () => {
    const emptySet = new Set<string>();
    expect(getExplorationPercentage(emptySet)).toBe(0);

    const fullSet = new Set<string>(['ON', 'QC', 'BC']);
    expect(getExplorationPercentage(fullSet)).toBe(23);
  });
});
