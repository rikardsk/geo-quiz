import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { ExploreBottomProgressBar } from './ExploreBottomProgressBar';

describe('ExploreBottomProgressBar', () => {
  it('renders initial state with 0 states explored', () => {
    const html = renderToString(
      <ExploreBottomProgressBar exploredCount={0} totalStates={27} />
    );
    expect(html).toContain('Member States Explored');
    expect(html).toContain('0');
    expect(html).toContain('(27 left • 0%)');
    expect(html).toContain('style="width:0%"');
  });

  it('renders progress with partial states explored', () => {
    const html = renderToString(
      <ExploreBottomProgressBar exploredCount={9} totalStates={27} />
    );
    expect(html).toContain('9');
    expect(html).toContain('(18 left • 33%)');
    expect(html).toContain('style="width:33%"');
  });

  it('renders completed progress when all states explored', () => {
    const html = renderToString(
      <ExploreBottomProgressBar exploredCount={27} totalStates={27} />
    );
    expect(html).toContain('27');
    expect(html).toContain('(0 left • 100%)');
    expect(html).toContain('style="width:100%"');
  });
});
