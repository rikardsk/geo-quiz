import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { ExploreBottomProgressBar } from './ExploreBottomProgressBar';

describe('ExploreBottomProgressBar', () => {
  it('renders initial state with 0 states explored', () => {
    const html = renderToString(
      <ExploreBottomProgressBar exploredCount={0} totalStates={50} />
    );
    expect(html).toContain('States Explored');
    expect(html).toContain('0');
    expect(html).toContain('(50 left • 0%)');
    expect(html).toContain('style="width:0%"');
  });

  it('renders progress with partial states explored', () => {
    const html = renderToString(
      <ExploreBottomProgressBar exploredCount={25} totalStates={50} />
    );
    expect(html).toContain('25');
    expect(html).toContain('(25 left • 50%)');
    expect(html).toContain('style="width:50%"');
  });

  it('renders completed progress when all states explored', () => {
    const html = renderToString(
      <ExploreBottomProgressBar exploredCount={50} totalStates={50} />
    );
    expect(html).toContain('50');
    expect(html).toContain('(0 left • 100%)');
    expect(html).toContain('style="width:100%"');
  });

  it('supports custom className and uses map-aligned default classes', () => {
    const defaultHtml = renderToString(
      <ExploreBottomProgressBar exploredCount={10} totalStates={50} />
    );
    expect(defaultHtml).toContain('w-full max-w-5xl mx-auto');

    const customHtml = renderToString(
      <ExploreBottomProgressBar exploredCount={10} totalStates={50} className="custom-test-class" />
    );
    expect(customHtml).toContain('custom-test-class');
  });
});
