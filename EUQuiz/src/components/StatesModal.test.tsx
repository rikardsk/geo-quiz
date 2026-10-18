import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { StatesModal } from './StatesModal';

describe('StatesModal', () => {
  it('renders nothing when isOpen is false', () => {
    const html = renderToString(
      <StatesModal
        isOpen={false}
        onClose={() => {}}
        onSelectState={() => {}}
        exploredStates={new Set()}
      />
    );
    expect(html).toBe('');
  });

  it('renders member states sorted alphabetically by name', () => {
    const html = renderToString(
      <StatesModal
        isOpen={true}
        onClose={() => {}}
        onSelectState={() => {}}
        exploredStates={new Set(['FR'])}
      />
    );
    expect(html).toContain('Select a Member State');

    // Check alphabetical order
    const austriaIdx = html.indexOf('Austria');
    const belgiumIdx = html.indexOf('Belgium');
    const bulgariaIdx = html.indexOf('Bulgaria');
    const croatiaIdx = html.indexOf('Croatia');
    const cyprusIdx = html.indexOf('Cyprus');
    const germanyIdx = html.indexOf('Germany');
    const greeceIdx = html.indexOf('Greece');
    const swedenIdx = html.indexOf('Sweden');

    expect(austriaIdx).toBeGreaterThan(-1);
    expect(belgiumIdx).toBeGreaterThan(austriaIdx);
    expect(bulgariaIdx).toBeGreaterThan(belgiumIdx);
    expect(croatiaIdx).toBeGreaterThan(bulgariaIdx);
    expect(cyprusIdx).toBeGreaterThan(croatiaIdx);
    expect(greeceIdx).toBeGreaterThan(germanyIdx);
    expect(swedenIdx).toBeGreaterThan(greeceIdx);
  });

  it('renders explored checkmark for explored member state', () => {
    const html = renderToString(
      <StatesModal
        isOpen={true}
        onClose={() => {}}
        onSelectState={() => {}}
        exploredStates={new Set(['FR'])}
      />
    );
    expect(html).toContain('lucide-check-circle');
  });
});
