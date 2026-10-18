import { describe, it, expect } from 'vitest';
import { EU_FLAG_INFO, getCountryFlag } from './flagData';
import { OFFICIAL_EU_STATES } from '../utils/quizUtils';

describe('flagData', () => {
  it('has a flag entry for every official EU member state', () => {
    OFFICIAL_EU_STATES.forEach((state) => {
      const flag = getCountryFlag(state.id);
      expect(flag).toBeDefined();
      expect(flag.id).toBe(state.id);
      expect(flag.svgUrl).toBe(`/flags/${state.id.toLowerCase()}.svg`);
      expect(flag.flagName.length).toBeGreaterThan(0);
      expect(flag.description.length).toBeGreaterThan(0);
      expect(flag.ratio.length).toBeGreaterThan(0);
    });
  });

  it('provides the official EU flag info', () => {
    expect(EU_FLAG_INFO.id).toBe('EU');
    expect(EU_FLAG_INFO.svgUrl).toBe('/flags/eu.svg');
    expect(EU_FLAG_INFO.flagName).toContain('Europe');
  });

  it('handles lowercase and uppercase country ids', () => {
    const fromUpper = getCountryFlag('FR');
    const fromLower = getCountryFlag('fr');
    expect(fromUpper.flagName).toBe('Tricolore');
    expect(fromLower.flagName).toBe('Tricolore');
  });

  it('provides a graceful fallback for unknown ids', () => {
    const unknown = getCountryFlag('ZZ');
    expect(unknown.id).toBe('ZZ');
    expect(unknown.svgUrl).toBe('/flags/zz.svg');
  });
});
