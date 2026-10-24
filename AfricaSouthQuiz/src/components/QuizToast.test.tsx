import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizToast } from './QuizToast';

describe('QuizToast', () => {
  it('renders correct toast when status is correct', () => {
    const html = renderToString(
      <QuizToast status="correct" targetStateName="Morocco" />
    );
    expect(html).toContain('Correct! That is Morocco! (+1 pt)');
    expect(html).toContain('quiz-toast-correct');
  });

  it('renders revealed toast when status is revealed', () => {
    const html = renderToString(
      <QuizToast status="revealed" targetStateName="Egypt" />
    );
    expect(html).toContain('Here is Egypt!');
    expect(html).toContain('quiz-toast-revealed');
  });

  it('returns null when idle', () => {
    const html = renderToString(<QuizToast status="idle" />);
    expect(html).toBe('');
  });
});
