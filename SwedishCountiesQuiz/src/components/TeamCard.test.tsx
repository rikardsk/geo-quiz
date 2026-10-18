import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { TeamCard } from './TeamCard';
import { SWEDISH_COUNTIES } from '../data/countiesData';

describe('TeamCard', () => {
  it('renders empty state when no county is selected', () => {
    const html = renderToString(
      <TeamCard team={null} onNextTeam={() => {}} onPrevTeam={() => {}} isExplored={false} />
    );
    expect(html).toContain('Välj ett län');
  });

  it('renders county name, largest city, and trivia when county is selected', () => {
    const skane = SWEDISH_COUNTIES.find((t) => t.id === 'M')!;
    const html = renderToString(
      <TeamCard team={skane} onNextTeam={() => {}} onPrevTeam={() => {}} isExplored={true} />
    );
    expect(html).toContain('Skåne län');
    expect(html).toContain('Största stad:');
    expect(html).toContain('Malmö');
    expect(html).toContain('Götaland');
  });

  it('renders close button when onClose handler is passed', () => {
    const skane = SWEDISH_COUNTIES.find((t) => t.id === 'M')!;
    const html = renderToString(
      <TeamCard
        team={skane}
        onNextTeam={() => {}}
        onPrevTeam={() => {}}
        isExplored={true}
        onClose={() => {}}
      />
    );
    expect(html).toContain('aria-label="Stäng länsdetaljer"');
  });
});
