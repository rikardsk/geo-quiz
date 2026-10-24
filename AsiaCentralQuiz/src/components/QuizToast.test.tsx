import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizToast } from './QuizToast';
import { US_STATES } from '../data/statesData';

describe('QuizToast', () => {
  it('renders nothing when status is idle', () => {
    const html = renderToString(<QuizToast status="idle" />);
    expect(html).toBe('');
  });

  it('renders correct toast when status is correct', () => {
    const html = renderToString(<QuizToast status="correct" targetStateName="Kazakhstan" />);
    expect(html).toContain('Correct! That is Kazakhstan!');
    expect(html).toContain('quiz-toast-correct');
  });

  it('renders incorrect toast when status is incorrect and state is provided', () => {
    const india = US_STATES.find((s) => s.id === 'IN')!;
    const html = renderToString(
      <QuizToast status="incorrect" targetStateName="Kazakhstan" lastAnsweredState={india} />
    );
    expect(html).toContain('That was India! Try again!');
    expect(html).toContain('quiz-toast-incorrect');
  });

  it('renders revealed toast when status is revealed', () => {
    const html = renderToString(<QuizToast status="revealed" targetStateName="Kazakhstan" />);
    expect(html).toContain('Here is Kazakhstan!');
    expect(html).toContain('quiz-toast-revealed');
  });
});
