import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizStartModal } from './QuizStartModal';

describe('QuizStartModal', () => {
  it('renders nothing when isOpen is false', () => {
    const html = renderToString(
      <QuizStartModal
        isOpen={false}
        onClose={() => {}}
        onStart={() => {}}
      />
    );
    expect(html).toBe('');
  });

  it('renders quiz modes when isOpen is true', () => {
    const html = renderToString(
      <QuizStartModal
        isOpen={true}
        onClose={() => {}}
        onStart={() => {}}
      />
    );
    expect(html).toContain('Choose Quiz Mode');
    expect(html).toContain('Countries Only');
    expect(html).toContain('Identify the Country');
    expect(html).toContain('Capitals Challenge');
    expect(html).toContain('Mixed Mode');
  });
});
