import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { CapitalsModal } from './CapitalsModal';

describe('CapitalsModal', () => {
  it('renders nothing when isOpen is false', () => {
    const html = renderToString(
      <CapitalsModal
        isOpen={false}
        onClose={() => {}}
        onSelectState={() => {}}
        exploredStates={new Set()}
      />
    );
    expect(html).toBe('');
  });

  it('renders capitals modal header and region buttons when isOpen is true', () => {
    const html = renderToString(
      <CapitalsModal
        isOpen={true}
        onClose={() => {}}
        onSelectState={() => {}}
        exploredStates={new Set(['DE'])}
      />
    );
    expect(html).toContain('Select a Capital');
    expect(html).toContain('Berlin');
    expect(html).toContain('Germany');
    expect(html).toContain('Paris');
    expect(html).toContain('France');
    expect(html).toContain('Northern');
    expect(html).toContain('Western');
  });

  it('renders explored checkmark for explored capital state', () => {
    const html = renderToString(
      <CapitalsModal
        isOpen={true}
        onClose={() => {}}
        onSelectState={() => {}}
        exploredStates={new Set(['DE'])}
      />
    );
    expect(html).toContain('lucide-circle-check');
  });
});
