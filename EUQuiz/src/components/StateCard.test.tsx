import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { StateCard } from './StateCard';
import { OFFICIAL_EU_STATES } from '../utils/quizUtils';

describe('StateCard', () => {
  const france = OFFICIAL_EU_STATES.find((s) => s.id === 'FR')!;

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
    expect(html).toContain('Select Any Member State');
  });

  it('renders state information and capital when state is selected', () => {
    const html = renderToString(
      <StateCard
        state={france}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={false}
      />
    );
    expect(html).toContain('France');
    expect(html).toContain('Paris');
    expect(html).toContain('FR');
    expect(html).toContain('Western Europe');
  });

  it('renders a single pure flag panel for the selected member state without text', () => {
    const html = renderToString(
      <StateCard
        state={france}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={false}
      />
    );
    expect(html).toContain('/flags/fr.svg');
    expect(html).toContain('alt="Flag of France"');
    expect(html).toContain('flag-panel');
    expect(html).toContain('flag-panel-pure-img');

    // Exactly one flag image in the component and no extra text labels
    const imgMatches = html.match(/<img\s/g) || [];
    expect(imgMatches.length).toBe(1);
    expect(html).not.toContain('Tricolore');
    expect(html).not.toContain('National Flag');
    expect(html).not.toContain('EU Flag');
  });

  it('renders close button when onClose handler is passed', () => {
    const html = renderToString(
      <StateCard
        state={france}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={false}
        onClose={() => {}}
      />
    );
    expect(html).toContain('aria-label="Close Member State Details"');
    expect(html).toContain('lucide-x');
  });

  it('renders explored checkmark when isExplored is true', () => {
    const html = renderToString(
      <StateCard
        state={france}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={true}
      />
    );
    expect(html).toContain('title="Explored"');
  });
});
