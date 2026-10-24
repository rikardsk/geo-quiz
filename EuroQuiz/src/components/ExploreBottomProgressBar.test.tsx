import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { ExploreBottomProgressBar } from './ExploreBottomProgressBar';

describe('ExploreBottomProgressBar', () => {
  it('renders initial state with 0 countries explored', () => {
    const html = renderToString(
      <ExploreBottomProgressBar exploredCount={0} totalStates={45} />
    );
    expect(html).toContain('Countries Explored');
    expect(html).toContain('0');
    expect(html).toContain('(45 left • 0%)');
    expect(html).toContain('style="width:0%"');
  });

  it('renders progress with partial countries explored', () => {
    const html = renderToString(
      <ExploreBottomProgressBar exploredCount={20} totalStates={40} />
    );
    expect(html).toContain('20');
    expect(html).toContain('(20 left • 50%)');
    expect(html).toContain('style="width:50%"');
  });

  it('renders completed progress when all countries explored', () => {
    const html = renderToString(
      <ExploreBottomProgressBar exploredCount={45} totalStates={45} />
    );
    expect(html).toContain('45');
    expect(html).toContain('(0 left • 100%)');
    expect(html).toContain('style="width:100%"');
  });

  it('supports custom className and uses map-aligned default classes', () => {
    const defaultHtml = renderToString(
      <ExploreBottomProgressBar exploredCount={5} totalStates={45} />
    );
    expect(defaultHtml).toContain('w-full max-w-5xl mx-auto');

    const customHtml = renderToString(
      <ExploreBottomProgressBar exploredCount={5} totalStates={45} className="custom-test-class" />
    );
    expect(customHtml).toContain('custom-test-class');
  });
});
