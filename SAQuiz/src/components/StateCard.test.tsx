import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { StateCard } from './StateCard';
import { OFFICIAL_SA_STATES } from '../utils/quizUtils';

describe('StateCard', () => {
  const argentina = OFFICIAL_SA_STATES.find((s) => s.id === 'AR')!;

  it('renders empty state placeholder when no state is selected', () => {
    const html = renderToString(
      <StateCard
        state={null}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={false}
      />
    );
    expect(html).toContain('state-card-empty');
    expect(html).toContain('Select Any South American Country');
  });

  it('renders state information and capital when state is selected', () => {
    const html = renderToString(
      <StateCard
        state={argentina}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={false}
      />
    );
    expect(html).toContain('Argentina');
    expect(html).toContain('Buenos Aires');
    expect(html).toContain('AR');
    expect(html).toContain('Southern South America');
  });

  it('renders a single pure flag panel for the selected country without text', () => {
    const html = renderToString(
      <StateCard
        state={argentina}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={false}
      />
    );
    expect(html).toContain('/flags/ar.svg');
    expect(html).toContain('alt="Flag of Argentina"');
    expect(html).toContain('flag-panel');
    expect(html).toContain('flag-panel-pure-img');

    const imgMatches = html.match(/<img\s/g) || [];
    expect(imgMatches.length).toBe(1);
    expect(html).not.toContain('Bandera Oficial');
    expect(html).not.toContain('National Flag');
  });

  it('renders close button when onClose handler is passed', () => {
    const html = renderToString(
      <StateCard
        state={argentina}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={false}
        onClose={() => {}}
      />
    );
    expect(html).toContain('aria-label="Close Country Details"');
    expect(html).toContain('lucide-x');
  });

  it('renders explored checkmark when isExplored is true', () => {
    const html = renderToString(
      <StateCard
        state={argentina}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={true}
      />
    );
    expect(html).toContain('title="Explored"');
  });
});
