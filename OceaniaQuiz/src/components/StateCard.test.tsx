import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { StateCard } from './StateCard';
import { US_STATES } from '../data/statesData';

describe('StateCard', () => {
  it('renders empty state placeholder when no country is selected', () => {
    const html = renderToString(
      <StateCard
        state={null}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={false}
      />
    );
    expect(html).toContain('Select Any Country');
    expect(html).toContain('state-card-empty');
  });

  it('renders country details when country is provided', () => {
    const australia = US_STATES.find((s) => s.id === 'AU')!;
    const html = renderToString(
      <StateCard
        state={australia}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={true}
      />
    );
    expect(html).toContain('Australia');
    expect(html).toContain('Canberra');
    expect(html).toContain('Oceania Region');
    expect(html).toContain('title="Explored"');
  });
});
