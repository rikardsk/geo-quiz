import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { DivisionFilter } from './DivisionFilter';
import { REGION_COLORS } from '../data/countiesData';

describe('DivisionFilter', () => {
  it('renders all Swedish region filter buttons with their styles', () => {
    const html = renderToString(
      <DivisionFilter currentFilter="All" onSelectFilter={() => {}} />
    );

    expect(html).toContain('Götaland');
    expect(html).toContain('Svealand');
    expect(html).toContain('Norrland');
    expect(html).toContain('Alla');

    // Verify region colors are present
    expect(html).toContain(REGION_COLORS['Götaland'].bg);
    expect(html).toContain(REGION_COLORS['Svealand'].bg);
    expect(html).toContain(REGION_COLORS['Norrland'].bg);
  });

  it('applies active border styling to the selected region button', () => {
    const html = renderToString(
      <DivisionFilter currentFilter="Götaland" onSelectFilter={() => {}} />
    );

    expect(html).toContain('border-color:#0f172a');
    expect(html).toContain('box-shadow');
    expect(html).toContain('Götaland');
  });
});
