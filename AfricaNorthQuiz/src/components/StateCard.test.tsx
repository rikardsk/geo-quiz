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
    const egypt = US_STATES.find((s) => s.id === 'EG')!;
    const html = renderToString(
      <StateCard
        state={egypt}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={true}
      />
    );
    expect(html).toContain('Egypt');
    expect(html).toContain('Cairo');
    expect(html).toContain('North Africa Region');
    expect(html).toContain('title="Explored"');
  });
});
