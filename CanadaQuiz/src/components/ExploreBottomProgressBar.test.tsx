import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { ExploreBottomProgressBar } from './ExploreBottomProgressBar';

describe('ExploreBottomProgressBar', () => {
  it('renders initial state with 0 provinces explored', () => {
    const html = renderToString(
      <ExploreBottomProgressBar exploredCount={0} totalStates={13} />
    );
    expect(html).toContain('Provinces Explored');
    expect(html).toContain('0');
    expect(html).toContain('(13 left • 0%)');
    expect(html).toContain('style="width:0%"');
  });

  it('renders progress with partial provinces explored', () => {
    const html = renderToString(
      <ExploreBottomProgressBar exploredCount={6} totalStates={12} />
    );
    expect(html).toContain('6');
    expect(html).toContain('(6 left • 50%)');
    expect(html).toContain('style="width:50%"');
  });

  it('renders completed progress when all provinces explored', () => {
    const html = renderToString(
      <ExploreBottomProgressBar exploredCount={13} totalStates={13} />
    );
    expect(html).toContain('13');
    expect(html).toContain('(0 left • 100%)');
    expect(html).toContain('style="width:100%"');
  });

  it('supports custom className and uses map-aligned default classes', () => {
    const defaultHtml = renderToString(
      <ExploreBottomProgressBar exploredCount={5} totalStates={13} />
    );
    expect(defaultHtml).toContain('w-full max-w-5xl mx-auto');

    const customHtml = renderToString(
      <ExploreBottomProgressBar exploredCount={5} totalStates={13} className="custom-test-class" />
    );
    expect(customHtml).toContain('custom-test-class');
  });
});
