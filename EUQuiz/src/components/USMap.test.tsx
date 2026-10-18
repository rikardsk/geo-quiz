import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { USMap } from './USMap';

describe('USMap', () => {
  it('renders map with all member states', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['FR'])}
        showUnexploredOnly={false}
      />
    );
    expect(html).toContain('France (FR)');
    expect(html).toContain('Germany (DE)');
  });

  it('dims explored states when showUnexploredOnly is enabled', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['FR'])}
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
        exploredStates={new Set(['FR'])}
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
        targetHighlightStateId="DE"
        isQuizMode={true}
      />
    );
    expect(html).toContain('fill="#f43f5e"');
  });

  it('renders non-EU background country outlines including the UK and Norway', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set()}
      />
    );
    expect(html).toContain('id="gb"');
    expect(html).toContain('id="no"');
  });

  it('renders clearly visible Malta path and helper ring in expanded viewBox', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set()}
      />
    );
    expect(html).toContain('viewBox="0 0 960 995"');
    expect(html).toContain('aria-label="Malta, Capital: Valletta"');
    expect(html).toContain('aria-label="Malta"');
    expect(html).toContain('id="mt"');
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

