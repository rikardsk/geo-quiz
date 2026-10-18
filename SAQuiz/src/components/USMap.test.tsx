import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { USMap } from './USMap';

describe('USMap', () => {
  it('renders map with all countries', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['BR'])}
        showUnexploredOnly={false}
      />
    );
    expect(html).toContain('Brazil (BR)');
    expect(html).toContain('Argentina (AR)');
  });

  it('dims explored states when showUnexploredOnly is enabled', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['BR'])}
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
        exploredStates={new Set(['BR'])}
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
        targetHighlightStateId="AR"
        isQuizMode={true}
      />
    );
    expect(html).toContain('fill="#f43f5e"');
  });

  it('renders background territory outlines including Falkland Islands', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set()}
      />
    );
    expect(html).toContain('id="gb"');
  });

  it('renders clearly visible map paths and viewBox', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set()}
      />
    );
    expect(html).toContain('viewBox="-25 -20 520 745"');
    expect(html).toContain('aria-label="Interactive Map of South America"');
    expect(html).toContain('aria-label="Brazil, Capital: Brasília"');
    expect(html).toContain('id="br"');
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
