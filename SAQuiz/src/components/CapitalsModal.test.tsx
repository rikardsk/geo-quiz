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
        exploredStates={new Set(['AR'])}
      />
    );
    expect(html).toContain('Select a Capital');
    expect(html).toContain('Buenos Aires');
    expect(html).toContain('Argentina');
    expect(html).toContain('Brasília');
    expect(html).toContain('Brazil');
    expect(html).toContain('Western');
    expect(html).toContain('Eastern');
  });

  it('renders explored checkmark for explored capital country', () => {
    const html = renderToString(
      <CapitalsModal
        isOpen={true}
        onClose={() => {}}
        onSelectState={() => {}}
        exploredStates={new Set(['AR'])}
      />
    );
    expect(html).toContain('lucide-check-circle');
  });
});
