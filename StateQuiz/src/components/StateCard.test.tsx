import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { StateCard } from './StateCard';
import { OFFICIAL_50_STATES } from '../utils/quizUtils';

describe('StateCard', () => {
  const california = OFFICIAL_50_STATES.find((s) => s.id === 'CA')!;

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
    expect(html).toContain('Select Any State');
  });

  it('renders state information and capital when state is selected', () => {
    const html = renderToString(
      <StateCard
        state={california}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={false}
      />
    );
    expect(html).toContain('California');
    expect(html).toContain('Sacramento');
    expect(html).toContain('CA');
    expect(html).toContain('West Region');
  });

  it('renders close button when onClose handler is passed', () => {
    const html = renderToString(
      <StateCard
        state={california}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={false}
        onClose={() => {}}
      />
    );
    expect(html).toContain('aria-label="Close State Details"');
    expect(html).toContain('lucide-x');
  });

  it('renders explored checkmark when isExplored is true', () => {
    const html = renderToString(
      <StateCard
        state={california}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={true}
      />
    );
    expect(html).toContain('title="Explored"');
  });
});
