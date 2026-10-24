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
        exploredStates={new Set(['MX'])}
      />
    );
    expect(html).toContain('Select a Capital');
    expect(html).toContain('Mexico City');
    expect(html).toContain('Mexico');
    expect(html).toContain('Havana');
    expect(html).toContain('Cuba');
    expect(html).toContain('Central America');
    expect(html).toContain('Greater Antilles');
    expect(html).toContain('Lesser Antilles');
  });

  it('renders explored checkmark for explored capital state', () => {
    const html = renderToString(
      <CapitalsModal
        isOpen={true}
        onClose={() => {}}
        onSelectState={() => {}}
        exploredStates={new Set(['MX'])}
      />
    );
    expect(html).toContain('lucide-circle-check');
  });
});
