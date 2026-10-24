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
    const html = renderToString(<QuizToast status="correct" targetStateName="Australia" />);
    expect(html).toContain('Correct! That is Australia!');
    expect(html).toContain('quiz-toast-correct');
  });

  it('renders incorrect toast when status is incorrect and state is provided', () => {
    const newZealand = US_STATES.find((s) => s.id === 'NZ')!;
    const html = renderToString(
      <QuizToast status="incorrect" targetStateName="Australia" lastAnsweredState={newZealand} />
    );
    expect(html).toContain('That was New Zealand! Try again!');
    expect(html).toContain('quiz-toast-incorrect');
  });

  it('renders revealed toast when status is revealed', () => {
    const html = renderToString(<QuizToast status="revealed" targetStateName="Australia" />);
    expect(html).toContain('Here is Australia!');
    expect(html).toContain('quiz-toast-revealed');
  });
});
