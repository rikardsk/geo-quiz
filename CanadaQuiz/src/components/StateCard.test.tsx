import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { StateCard } from './StateCard';
import { OFFICIAL_50_STATES } from '../utils/quizUtils';

describe('StateCard', () => {
  const ontario = OFFICIAL_50_STATES.find((s) => s.id === 'ON')!;

  it('renders empty state placeholder when no province is selected', () => {
    const html = renderToString(
      <StateCard
        state={null}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={false}
      />
    );
    expect(html).toContain('state-card-empty');
    expect(html).toContain('Select Any Province');
  });

  it('renders province information and capital when province is selected', () => {
    const html = renderToString(
      <StateCard
        state={ontario}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={false}
      />
    );
    expect(html).toContain('Ontario');
    expect(html).toContain('Toronto');
    expect(html).toContain('ON');
    expect(html).toContain('Central Region');
  });

  it('renders close button when onClose handler is passed', () => {
    const html = renderToString(
      <StateCard
        state={ontario}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={false}
        onClose={() => {}}
      />
    );
    expect(html).toContain('aria-label="Close Province Details"');
    expect(html).toContain('lucide-x');
  });

  it('renders explored checkmark when isExplored is true', () => {
    const html = renderToString(
      <StateCard
        state={ontario}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={true}
      />
    );
    expect(html).toContain('title="Explored"');
  });
});
