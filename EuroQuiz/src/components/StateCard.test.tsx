import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { StateCard } from './StateCard';
import { OFFICIAL_50_STATES } from '../utils/quizUtils';

describe('StateCard', () => {
  const germany = OFFICIAL_50_STATES.find((s) => s.id === 'DE')!;

  it('renders empty state placeholder when no country is selected', () => {
    const html = renderToString(
      <StateCard
        state={null}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={false}
      />
    );
    expect(html).toContain('state-card-empty');
    expect(html).toContain('Select Any Country');
  });

  it('renders country information and capital when country is selected', () => {
    const html = renderToString(
      <StateCard
        state={germany}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={false}
      />
    );
    expect(html).toContain('Germany');
    expect(html).toContain('Berlin');
    expect(html).toContain('DE');
    expect(html).toContain('Western Region');
  });

  it('renders close button when onClose handler is passed', () => {
    const html = renderToString(
      <StateCard
        state={germany}
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
        state={germany}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={true}
      />
    );
    expect(html).toContain('title="Explored"');
  });
});
