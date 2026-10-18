import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { USMap } from './USMap';

describe('USMap', () => {
  it('renders map with all states', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['CA'])}
        showUnexploredOnly={false}
      />
    );
    expect(html).toContain('California (CA)');
    expect(html).toContain('Texas (TX)');
  });

  it('dims explored states when showUnexploredOnly is enabled', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['CA'])}
        showUnexploredOnly={true}
      />
    );
    // Explored state CA gets gray fill #e2e8f0 and opacity 0.35
    expect(html).toContain('fill="#e2e8f0" opacity="0.35"');
  });

  it('keeps unexplored states at full opacity when showUnexploredOnly is enabled', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['CA'])}
        showUnexploredOnly={true}
      />
    );
    // Unexplored states have opacity 1
    expect(html).toContain('opacity="1"');
  });

  it('highlights target state with rose fill when targetHighlightStateId is passed', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set()}
        targetHighlightStateId="TX"
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
        isQuizMode={true}
      />
    );
    expect(html).toContain('cursor-default');
    expect(html).not.toContain('role="button"');
    expect(html).toContain('tabindex="-1"');
  });
});
