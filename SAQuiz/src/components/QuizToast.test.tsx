import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizToast } from './QuizToast';
import { OFFICIAL_SA_STATES } from '../utils/quizUtils';

describe('QuizToast', () => {
  const brazil = OFFICIAL_SA_STATES.find((s) => s.id === 'BR')!;

  it('renders nothing when status is idle', () => {
    const html = renderToString(
      <QuizToast status="idle" targetStateName="Argentina" />
    );
    expect(html).toBe('');
  });

  it('renders nothing when status is incorrect but lastAnsweredState is null', () => {
    const html = renderToString(
      <QuizToast status="incorrect" targetStateName="Argentina" lastAnsweredState={null} />
    );
    expect(html).toBe('');
  });

  it('renders correct toast with +1 pt message', () => {
    const html = renderToString(
      <QuizToast status="correct" targetStateName="Argentina" />
    );
    expect(html).toContain('quiz-toast-correct');
    expect(html).toContain('Correct! That is Argentina! (+1 pt)');
  });

  it('renders incorrect toast with the clicked state name', () => {
    const html = renderToString(
      <QuizToast status="incorrect" targetStateName="Argentina" lastAnsweredState={brazil} />
    );
    expect(html).toContain('quiz-toast-incorrect');
    expect(html).toContain('That was Brazil! Try again!');
  });

  it('renders revealed toast with state name', () => {
    const html = renderToString(
      <QuizToast status="revealed" targetStateName="Chile" />
    );
    expect(html).toContain('quiz-toast-revealed');
    expect(html).toContain('Here is Chile!');
  });

  it('renders container with status role and polite live region', () => {
    const html = renderToString(
      <QuizToast status="correct" targetStateName="Argentina" />
    );
    expect(html).toContain('class="quiz-toast-container"');
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
  });
});
