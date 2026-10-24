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
        exploredStates={new Set(['MA'])}
      />
    );
    expect(html).toContain('Select a Capital');
    expect(html).toContain('Rabat');
    expect(html).toContain('Morocco');
    expect(html).toContain('Cairo');
    expect(html).toContain('Egypt');
    expect(html).toContain('North Africa');
    expect(html).toContain('West Africa');
    expect(html).toContain('Central Africa');
  });

  it('renders explored checkmark for explored capital state', () => {
    const html = renderToString(
      <CapitalsModal
        isOpen={true}
        onClose={() => {}}
        onSelectState={() => {}}
        exploredStates={new Set(['EG'])}
      />
    );
    expect(html).toContain('lucide-check-circle');
  });
});
