import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { FilteredTeamsList } from './FilteredTeamsList';
import { SWEDISH_COUNTIES } from '../data/countiesData';

describe('FilteredTeamsList', () => {
  it('renders Götaland region header and counties with largest cities', () => {
    const gotaland = SWEDISH_COUNTIES.filter((t) => t.region === 'Götaland');
    const html = renderToString(
      <FilteredTeamsList
        filter="Götaland"
        teams={gotaland}
        exploredTeams={new Set(['M'])}
        onSelectTeam={() => {}}
      />
    );
    expect(html).toContain('Götaland Län');
    expect(html).toContain('9 län');
    expect(html).toContain('Skåne län');
    expect(html).toContain('Malmö');
    expect(html).toContain('Göteborg');
  });

  it('renders Svealand counties in list with scrollbar', () => {
    const svealand = SWEDISH_COUNTIES.filter((t) => t.region === 'Svealand');
    const html = renderToString(
      <FilteredTeamsList
        filter="Svealand"
        teams={svealand}
        exploredTeams={new Set()}
        onSelectTeam={() => {}}
      />
    );
    expect(html).toContain('Svealand Län');
    expect(html).toContain('7 län');
    expect(html).toContain('custom-scrollbar');
    expect(html).toContain('Stockholms län');
    expect(html).toContain('Uppsala län');
  });
});
