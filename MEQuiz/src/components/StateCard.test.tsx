import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { StateCard } from './StateCard';
import { OFFICIAL_50_STATES } from '../utils/quizUtils';

describe('StateCard', () => {
  const egypt = OFFICIAL_50_STATES.find((s) => s.id === 'EG')!;

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
        state={egypt}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={false}
      />
    );
    expect(html).toContain('Egypt');
    expect(html).toContain('Cairo');
    expect(html).toContain('EG');
    expect(html).toContain('Northern Middle East Region');
  });

  it('renders close button when onClose handler is passed', () => {
    const html = renderToString(
      <StateCard
        state={egypt}
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
        state={egypt}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={true}
      />
    );
    expect(html).toContain('title="Explored"');
  });

  it('renders emirate details when selectedEmirate is passed', () => {
    const dubai = {
      id: 'AE-DU',
      name: 'Dubai',
      capital: 'Dubai',
      region: 'UAE Emirate' as const,
      nickname: 'Global Hub of Modern Architecture & Innovation',
      color: '#f97316',
      d: 'M0,0Z',
      capitalCoordinates: { x: 100, y: 100 },
    };
    const html = renderToString(
      <StateCard
        state={null}
        selectedEmirate={dubai}
        onNextState={() => {}}
        onPrevState={() => {}}
        isExplored={false}
      />
    );
    expect(html).toContain('Dubai');
    expect(html).toContain('UAE Emirate');
    expect(html).toContain('Emirate Capital');
  });
});
