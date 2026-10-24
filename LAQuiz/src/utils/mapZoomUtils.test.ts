import { describe, it, expect } from 'vitest';
import {
  calculateZoomIn,
  calculateZoomOut,
  calculatePan,
  formatViewBox,
  INITIAL_ZOOM,
  BASE_MAP_WIDTH,
  BASE_MAP_HEIGHT,
} from './mapZoomUtils';

describe('mapZoomUtils', () => {
  it('formats initial viewBox correctly', () => {
    expect(formatViewBox(INITIAL_ZOOM)).toBe('0.0 0.0 959.0 593.0');
  });

  it('zooms in centered within bounds', () => {
    const zoomed = calculateZoomIn(INITIAL_ZOOM);
    expect(zoomed.scale).toBeGreaterThan(1);
    expect(zoomed.x).toBeGreaterThan(0);
    expect(zoomed.y).toBeGreaterThan(0);
    expect(zoomed.x + BASE_MAP_WIDTH / zoomed.scale).toBeLessThanOrEqual(BASE_MAP_WIDTH + 0.01);
    expect(zoomed.y + BASE_MAP_HEIGHT / zoomed.scale).toBeLessThanOrEqual(BASE_MAP_HEIGHT + 0.01);
  });

  it('zooms out and resets when near scale 1', () => {
    const zoomed = calculateZoomIn(INITIAL_ZOOM);
    const zoomedOut = calculateZoomOut(zoomed);
    expect(zoomedOut.scale).toBe(1);
    expect(zoomedOut.x).toBe(0);
    expect(zoomedOut.y).toBe(0);
  });

  it('does not pan when scale is 1', () => {
    const panned = calculatePan(INITIAL_ZOOM, 0, 0, 100, 50, 800, 500);
    expect(panned).toEqual(INITIAL_ZOOM);
  });

  it('pans correctly when zoomed in and respects bounds', () => {
    const zoomed = calculateZoomIn(calculateZoomIn(INITIAL_ZOOM));
    const panned = calculatePan(zoomed, zoomed.x, zoomed.y, 50, 30, 800, 500);
    expect(panned.scale).toBe(zoomed.scale);
    expect(panned.x).toBeLessThan(zoomed.x);
    expect(panned.y).toBeLessThan(zoomed.y);
  });
});
