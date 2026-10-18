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

  it('renders countries sorted alphabetically by name', () => {
    const html = renderToString(
      <StatesModal
        isOpen={true}
        onClose={() => {}}
        onSelectState={() => {}}
        exploredStates={new Set(['BR'])}
      />
    );
    expect(html).toContain('Select a Country');

    const argentinaIdx = html.indexOf('Argentina');
    const boliviaIdx = html.indexOf('Bolivia');
    const brazilIdx = html.indexOf('Brazil');
    const chileIdx = html.indexOf('Chile');
    const colombiaIdx = html.indexOf('Colombia');
    const peruIdx = html.indexOf('Peru');
    const venezuelaIdx = html.indexOf('Venezuela');

    expect(argentinaIdx).toBeGreaterThan(-1);
    expect(boliviaIdx).toBeGreaterThan(argentinaIdx);
    expect(brazilIdx).toBeGreaterThan(boliviaIdx);
    expect(chileIdx).toBeGreaterThan(brazilIdx);
    expect(colombiaIdx).toBeGreaterThan(chileIdx);
    expect(peruIdx).toBeGreaterThan(colombiaIdx);
    expect(venezuelaIdx).toBeGreaterThan(peruIdx);
  });

  it('renders explored checkmark for explored country', () => {
    const html = renderToString(
      <StatesModal
        isOpen={true}
        onClose={() => {}}
        onSelectState={() => {}}
        exploredStates={new Set(['BR'])}
      />
    );
    expect(html).toContain('lucide-check-circle');
  });
});
