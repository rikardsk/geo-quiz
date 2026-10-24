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
        exploredStates={new Set(['KE'])}
      />
    );
    expect(html).toContain('Select a Capital');
    expect(html).toContain('Nairobi');
    expect(html).toContain('Kenya');
    expect(html).toContain('Pretoria');
    expect(html).toContain('South Africa');
    expect(html).toContain('East Africa');
    expect(html).toContain('Southern Africa');
    expect(html).toContain('Central Africa');
  });

  it('renders explored checkmark for explored capital state', () => {
    const html = renderToString(
      <CapitalsModal
        isOpen={true}
        onClose={() => {}}
        onSelectState={() => {}}
        exploredStates={new Set(['KE'])}
      />
    );
    expect(html).toContain('lucide-check-circle');
  });
});
