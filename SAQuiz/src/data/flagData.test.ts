import { describe, it, expect } from 'vitest';
import { SA_FLAG_INFO, getCountryFlag } from './flagData';
import { OFFICIAL_SA_STATES } from '../utils/quizUtils';

describe('flagData', () => {
  it('has a flag entry for every official South American country and territory', () => {
    OFFICIAL_SA_STATES.forEach((state) => {
      const flag = getCountryFlag(state.id);
      expect(flag).toBeDefined();
      expect(flag.id).toBe(state.id);
      expect(flag.svgUrl).toBe(`/flags/${state.id.toLowerCase()}.svg`);
      expect(flag.flagName.length).toBeGreaterThan(0);
      expect(flag.description.length).toBeGreaterThan(0);
      expect(flag.ratio.length).toBeGreaterThan(0);
    });
  });

  it('provides the official South America emblem/flag info', () => {
    expect(SA_FLAG_INFO.id).toBe('SA');
    expect(SA_FLAG_INFO.svgUrl).toBe('/flags/sa.svg');
    expect(SA_FLAG_INFO.flagName).toContain('South America');
  });

  it('handles lowercase and uppercase country ids', () => {
    const fromUpper = getCountryFlag('AR');
    const fromLower = getCountryFlag('ar');
    expect(fromUpper.flagName).toBe('Bandera Oficial de la Nación');
    expect(fromLower.flagName).toBe('Bandera Oficial de la Nación');
  });

  it('provides a graceful fallback for unknown ids', () => {
    const unknown = getCountryFlag('ZZ');
    expect(unknown.id).toBe('ZZ');
    expect(unknown.svgUrl).toBe('/flags/zz.svg');
  });
});
