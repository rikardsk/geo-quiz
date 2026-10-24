import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { ExploreBottomProgressBar } from './ExploreBottomProgressBar';

describe('ExploreBottomProgressBar', () => {
  it('renders initial state with 0 countries explored', () => {
    const html = renderToString(
      <ExploreBottomProgressBar exploredCount={0} totalStates={27} />
    );
    expect(html).toContain('Countries Explored');
    expect(html).toContain('0');
    expect(html).toContain('(27 left • 0%)');
    expect(html).toContain('style="width:0%"');
  });

  it('renders progress with partial countries explored', () => {
    const html = renderToString(
      <ExploreBottomProgressBar exploredCount={14} totalStates={27} />
    );
    expect(html).toContain('14');
    expect(html).toContain('(13 left • 52%)');
    expect(html).toContain('style="width:52%"');
  });

  it('renders completed progress when all countries explored', () => {
    const html = renderToString(
      <ExploreBottomProgressBar exploredCount={27} totalStates={27} />
    );
    expect(html).toContain('27');
    expect(html).toContain('(0 left • 100%)');
    expect(html).toContain('style="width:100%"');
  });
});
