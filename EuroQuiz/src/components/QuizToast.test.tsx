import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizToast } from './QuizToast';
import { OFFICIAL_50_STATES } from '../utils/quizUtils';

describe('QuizToast', () => {
  const france = OFFICIAL_50_STATES.find((s) => s.id === 'FR')!;

  it('renders nothing when status is idle', () => {
    const html = renderToString(
      <QuizToast status="idle" targetStateName="Germany" />
    );
    expect(html).toBe('');
  });

  it('renders nothing when status is incorrect but lastAnsweredState is null', () => {
    const html = renderToString(
      <QuizToast status="incorrect" targetStateName="Germany" lastAnsweredState={null} />
    );
    expect(html).toBe('');
  });

  it('renders correct toast with +1 pt message', () => {
    const html = renderToString(
      <QuizToast status="correct" targetStateName="Germany" />
    );
    expect(html).toContain('quiz-toast-correct');
    expect(html).toContain('Correct! That is Germany! (+1 pt)');
  });

  it('renders incorrect toast with the clicked state name', () => {
    const html = renderToString(
      <QuizToast status="incorrect" targetStateName="Germany" lastAnsweredState={france} />
    );
    expect(html).toContain('quiz-toast-incorrect');
    expect(html).toContain('That was France! Try again!');
  });

  it('renders revealed toast with state name', () => {
    const html = renderToString(
      <QuizToast status="revealed" targetStateName="Norway" />
    );
    expect(html).toContain('quiz-toast-revealed');
    expect(html).toContain('Here is Norway!');
  });
});
