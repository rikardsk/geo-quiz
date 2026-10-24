import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizBottomProgressBar } from './QuizBottomProgressBar';

describe('QuizBottomProgressBar', () => {
  it('renders initial state with 27 countries remaining', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={0} revealedCount={0} totalStates={27} />
    );
    expect(html).toContain('Countries Remaining to Identify');
    expect(html).toContain('27');
    expect(html).toContain('(0 / 27 • 0%)');
    expect(html).toContain('style="width:0%"');
  });

  it('renders intermediate progress', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={10} revealedCount={4} totalStates={27} />
    );
    expect(html).toContain('13');
    expect(html).toContain('(14 / 27 • 52%)');
    expect(html).toContain('style="width:52%"');
  });
});
