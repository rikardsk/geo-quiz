import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizToast } from './QuizToast';
import { OFFICIAL_50_STATES } from '../utils/quizUtils';

describe('QuizToast', () => {
  const egypt = OFFICIAL_50_STATES.find((s) => s.id === 'EG')!;

  it('renders nothing when status is idle', () => {
    const html = renderToString(
      <QuizToast status="idle" targetStateName="Saudi Arabia" />
    );
    expect(html).toBe('');
  });

  it('renders nothing when status is incorrect but lastAnsweredState is null', () => {
    const html = renderToString(
      <QuizToast status="incorrect" targetStateName="Saudi Arabia" lastAnsweredState={null} />
    );
    expect(html).toBe('');
  });

  it('renders correct toast with +1 pt message', () => {
    const html = renderToString(
      <QuizToast status="correct" targetStateName="Saudi Arabia" />
    );
    expect(html).toContain('quiz-toast-correct');
    expect(html).toContain('Correct! That is Saudi Arabia! (+1 pt)');
  });

  it('renders incorrect toast with the clicked state name', () => {
    const html = renderToString(
      <QuizToast status="incorrect" targetStateName="Saudi Arabia" lastAnsweredState={egypt} />
    );
    expect(html).toContain('quiz-toast-incorrect');
    expect(html).toContain('That was Egypt! Try again!');
  });

  it('renders revealed toast with state name', () => {
    const html = renderToString(
      <QuizToast status="revealed" targetStateName="Oman" />
    );
    expect(html).toContain('quiz-toast-revealed');
    expect(html).toContain('Here is Oman!');
  });
});
