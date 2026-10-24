import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { USMap } from './USMap';

describe('USMap', () => {
  it('renders map with Lesser Antilles when showLesserAntilles is true', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['MX'])}
        showUnexploredOnly={false}
        showLesserAntilles={true}
      />
    );
    expect(html).toContain('Mexico (MX)');
    expect(html).toContain('Cuba (CU)');
    expect(html).toContain('Barbados (BB)');
    expect(html).toContain('Panama (PA)');
  });

  it('always shows Greater Antilles but hides Lesser Antilles by default', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['MX'])}
        showUnexploredOnly={false}
      />
    );
    expect(html).toContain('Mexico (MX)');
    expect(html).toContain('Cuba (CU)');
    expect(html).not.toContain('Barbados (BB)');
    expect(html).toContain('Panama (PA)');
  });

  it('dims explored states when showUnexploredOnly is enabled', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['MX'])}
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
        exploredStates={new Set(['MX'])}
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
        targetHighlightStateId="MX"
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
  });

  it('renders accessible zoom in and zoom out buttons', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set()}
      />
    );
    expect(html).toContain('aria-label="Zoom in"');
    expect(html).toContain('aria-label="Zoom out"');
    expect(html).toContain('viewBox="0.0 0.0 959.0 593.0"');
  });
});
