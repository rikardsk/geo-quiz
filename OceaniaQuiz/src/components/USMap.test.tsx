import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { USMap } from './USMap';

describe('USMap', () => {
  it('renders map with all countries', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['AU'])}
        showUnexploredOnly={false}
      />
    );
    expect(html).toContain('Australia (AU)');
    expect(html).toContain('New Zealand (NZ)');
    expect(html).toContain('Indonesia (ID)');
  });

  it('dims explored countries when showUnexploredOnly is enabled', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['AU'])}
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
        targetHighlightStateId="AU"
      />
    );
    expect(html).toContain('fill="#f43f5e"');
  });
});
