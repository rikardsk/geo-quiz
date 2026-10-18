import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizStartModal } from './QuizStartModal';

describe('QuizStartModal', () => {
  it('renders modal with mode choices and Cancel button when open', () => {
    const html = renderToString(
      <QuizStartModal
        isOpen={true}
        onClose={() => {}}
        onStart={() => {}}
        initialMode="county-name"
      />
    );

    expect(html).toContain('Välj Sveriges Län Quizläge');
    expect(html).toContain('Länskartan');
    expect(html).toContain('Största Stad');
    expect(html).toContain('Flervalsquiz');
    expect(html).toContain('Blandat Pro-läge');
    expect(html).toContain('Avbryt');
    expect(html).toContain('Starta Quiz');
  });

  it('renders red background color and border for the selected quiz mode', () => {
    const html = renderToString(
      <QuizStartModal
        isOpen={true}
        onClose={() => {}}
        onStart={() => {}}
        initialMode="county-name"
      />
    );

    expect(html).toContain('bg-rose-500 text-white');
    expect(html).toContain('bg-rose-50');
    expect(html).toContain('border-rose-500');
  });

  it('does not render when isOpen is false', () => {
    const html = renderToString(
      <QuizStartModal
        isOpen={false}
        onClose={() => {}}
        onStart={() => {}}
      />
    );

    expect(html).toBe('');
  });
});
