import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { USMap } from './USMap';

describe('USMap', () => {
  it('renders map with all countries', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['KE'])}
        showUnexploredOnly={false}
      />
    );
    expect(html).toContain('Kenya (KE)');
    expect(html).toContain('South Africa (ZA)');
    expect(html).toContain('Tanzania (TZ)');
  });

  it('dims explored countries when showUnexploredOnly is enabled', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['KE'])}
        showUnexploredOnly={true}
      />
    );
    expect(html).toContain('fill="#e2e8f0"');
    expect(html).toContain('opacity="0.35"');
  });

  it('highlights target country with rose fill when targetHighlightStateId is passed', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set()}
        isQuizMode={true}
        targetHighlightStateId="KE"
      />
    );
    expect(html).toContain('fill="#f43f5e"');
  });
});
