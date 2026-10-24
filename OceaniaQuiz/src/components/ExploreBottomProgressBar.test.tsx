import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { ExploreBottomProgressBar } from './ExploreBottomProgressBar';

describe('ExploreBottomProgressBar', () => {
  it('renders explored count and percentage', () => {
    const html = renderToString(
      <ExploreBottomProgressBar
        exploredCount={5}
        totalStates={17}
      />
    );
    expect(html).toContain('Countries Explored');
    expect(html).toContain('5');
    expect(html).toContain('explored');
    expect(html).toContain('12 left');
    expect(html).toContain('29%');
    expect(html).toContain('width:29%');
  });
});
