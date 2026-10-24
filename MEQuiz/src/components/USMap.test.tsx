import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { USMap } from './USMap';

describe('USMap', () => {
  it('renders map with all countries', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['EG'])}
        showUnexploredOnly={false}
      />
    );
    expect(html).toContain('Egypt (EG)');
    expect(html).toContain('Saudi Arabia (SA)');
  });

  it('dims explored states when showUnexploredOnly is enabled', () => {
    const html = renderToString(
      <USMap
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set(['EG'])}
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
        exploredStates={new Set(['EG'])}
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
        targetHighlightStateId="SA"
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

  it('renders full-size regular UAE 7 emirates map when mapView is uae-emirates', () => {
    const html = renderToString(
      <USMap
        mapView="uae-emirates"
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set()}
      />
    );
    expect(html).toContain('Interactive Map of the UAE Emirates');
    expect(html).toContain('Abu Dhabi');
    expect(html).toContain('Dubai');
    expect(html).toContain('Sharjah');
    expect(html).toContain('Ajman');
    expect(html).toContain('Umm Al Quwain');
    expect(html).toContain('Ras Al Khaimah');
    expect(html).toContain('Fujairah');
  });

  it('renders toggle button to switch maps when onToggleMapView is passed', () => {
    const html = renderToString(
      <USMap
        mapView="middle-east"
        onToggleMapView={() => {}}
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set()}
      />
    );
    expect(html).toContain('View UAE Emirates Map');
  });

  it('renders single back button when in uae-emirates mode without duplicate badges', () => {
    const html = renderToString(
      <USMap
        mapView="uae-emirates"
        onToggleMapView={() => {}}
        selectedState={null}
        onSelectState={() => {}}
        exploredStates={new Set()}
      />
    );
    expect(html).toContain('Back to Middle East Map');
    // Ensure no overlapping duplicate badge
    expect(html).not.toContain('🇦🇪 United Arab Emirates (7 Emirates)');
  });
});
