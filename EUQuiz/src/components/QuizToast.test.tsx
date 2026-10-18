import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizToast } from './QuizToast';
import { OFFICIAL_EU_STATES } from '../utils/quizUtils';

describe('QuizToast', () => {
  const germany = OFFICIAL_EU_STATES.find((s) => s.id === 'DE')!;

  it('renders nothing when status is idle', () => {
    const html = renderToString(
      <QuizToast status="idle" targetStateName="France" />
    );
    expect(html).toBe('');
  });

  it('renders nothing when status is incorrect but lastAnsweredState is null', () => {
    const html = renderToString(
      <QuizToast status="incorrect" targetStateName="France" lastAnsweredState={null} />
    );
    expect(html).toBe('');
  });

  it('renders correct toast with +1 pt message', () => {
    const html = renderToString(
      <QuizToast status="correct" targetStateName="France" />
    );
    expect(html).toContain('quiz-toast-correct');
    expect(html).toContain('Correct! That is France! (+1 pt)');
  });

  it('renders incorrect toast with the clicked state name', () => {
    const html = renderToString(
      <QuizToast status="incorrect" targetStateName="France" lastAnsweredState={germany} />
    );
    expect(html).toContain('quiz-toast-incorrect');
    expect(html).toContain('That was Germany! Try again!');
  });

  it('renders revealed toast with state name', () => {
    const html = renderToString(
      <QuizToast status="revealed" targetStateName="Spain" />
    );
    expect(html).toContain('quiz-toast-revealed');
    expect(html).toContain('Here is Spain!');
  });

  it('renders container with status role and polite live region', () => {
    const html = renderToString(
      <QuizToast status="correct" targetStateName="France" />
    );
    expect(html).toContain('class="quiz-toast-container"');
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
  });
});

