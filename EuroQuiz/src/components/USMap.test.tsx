import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { USMap } from './USMap';

describe('USMap', () => {
  it('renders map with European countries', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['DE'])}
        showUnexploredOnly={false}
      />
    );
    expect(html).toContain('Germany (DE)');
    expect(html).toContain('France (FR)');
  });

  it('dims explored states when showUnexploredOnly is enabled', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['DE'])}
        showUnexploredOnly={true}
      />
    );
    expect(html).toContain('fill="#e2e8f0" opacity="0.35"');
  });

  it('keeps unexplored states at full opacity when showUnexploredOnly is enabled', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['DE'])}
        showUnexploredOnly={true}
      />
    );
    expect(html).toContain('opacity="1"');
  });

  it('highlights target state with rose fill when targetHighlightStateId is passed', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set()}
        targetHighlightStateId="FR"
        isQuizMode={true}
      />
    );
    expect(html).toContain('fill="#f43f5e"');
  });

  it('renders default cursor and disables button role when disableMapSelection is true', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set()}
        disableMapSelection={true}
      />
    );
    expect(html).toContain('cursor-default');
    expect(html).not.toContain('role="button"');
  });
});
