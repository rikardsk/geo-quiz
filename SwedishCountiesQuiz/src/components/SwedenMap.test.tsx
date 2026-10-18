import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { SwedenMap } from './SwedenMap';

describe('SwedenMap', () => {
  it('renders Sweden vector map svg with counties and city pins', () => {
    const html = renderToString(
      <SwedenMap
        selectedTeam={null}
        onSelectTeam={() => {}}
        activeFilter="All"
        correctTeamIds={new Set()}
        revealedTeamIds={new Set()}
      />
    );

    expect(html).toContain('viewBox="0 0 500 900"');
    expect(html).toContain('id="counties"');
    expect(html).toContain('id="largest-city-pins"');
  });

  it('correctly colors counties in Götaland when filter is active', () => {
    const html = renderToString(
      <SwedenMap
        selectedTeam={null}
        onSelectTeam={() => {}}
        activeFilter="Götaland"
        correctTeamIds={new Set()}
        revealedTeamIds={new Set()}
      />
    );

    expect(html).toContain('fill="#dbeafe"');
  });

  it('renders hint overlay with yellow fill and red stroke when hintState is provided', () => {
    const html = renderToString(
      <SwedenMap
        selectedTeam={null}
        onSelectTeam={() => {}}
        activeFilter="All"
        isQuizMode={true}
        hintState="M"
        correctTeamIds={new Set()}
        revealedTeamIds={new Set()}
      />
    );

    expect(html).toContain('fill="#fef08a"');
    expect(html).toContain('stroke="#e11d48"');
  });

  it('renders green checkmark badge for solved counties', () => {
    const html = renderToString(
      <SwedenMap
        selectedTeam={null}
        onSelectTeam={() => {}}
        activeFilter="All"
        isQuizMode={true}
        correctTeamIds={new Set(['M'])}
        revealedTeamIds={new Set()}
      />
    );

    expect(html).toContain('fill="#10b981"');
  });

  it('renders TargetBeacon when targetHighlightTeamId is provided', () => {
    const html = renderToString(
      <SwedenMap
        selectedTeam={null}
        onSelectTeam={() => {}}
        activeFilter="All"
        isQuizMode={true}
        targetHighlightTeamId="M"
        correctTeamIds={new Set()}
        revealedTeamIds={new Set()}
      />
    );

    expect(html).toContain('r="20"');
    expect(html).toContain('stroke="#f43f5e"');
  });

  it('hides largest city pins when showCities is false', () => {
    const html = renderToString(
      <SwedenMap
        selectedTeam={null}
        onSelectTeam={() => {}}
        activeFilter="All"
        correctTeamIds={new Set()}
        revealedTeamIds={new Set()}
        showCities={false}
      />
    );

    expect(html).not.toContain('id="largest-city-pins"');
  });

  it('hides largest city pins and tooltips in quiz mode', () => {
    const html = renderToString(
      <SwedenMap
        selectedTeam={null}
        onSelectTeam={() => {}}
        activeFilter="All"
        isQuizMode={true}
        showCities={true}
        correctTeamIds={new Set()}
        revealedTeamIds={new Set()}
      />
    );

    expect(html).not.toContain('id="largest-city-pins"');
    expect(html).not.toContain('Största stad:');
  });

  it('renders paths with cursor-default when disableMapSelection is true', () => {
    const html = renderToString(
      <SwedenMap
        selectedTeam={null}
        onSelectTeam={() => {}}
        activeFilter="All"
        isQuizMode={true}
        disableMapSelection={true}
        correctTeamIds={new Set()}
        revealedTeamIds={new Set()}
      />
    );

    expect(html).toContain('cursor-default');
    expect(html).not.toContain('cursor-pointer');
  });
});
