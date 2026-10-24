import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizPanel } from './QuizPanel';

describe('QuizPanel', () => {
  const baseProps = {
    score: 10,
    totalAnswered: 15,
    streak: 4,
    bestStreak: 6,
    hintUsed: false,
    questionTypeMode: 'state-name' as const,
    onOpenModeModal: () => {},
    onOpenTiersModal: () => {},
    onUseHint: () => {},
    onShowAnswer: () => {},
    onSkipQuestion: () => {},
    onRestartQuiz: () => {},
  };

  it('renders scores, streak, and accuracy', () => {
    const html = renderToString(<QuizPanel {...baseProps} />);
    expect(html).toContain('10 / 15');
    expect(html).toContain('4');
    expect(html).toContain('67%');
    expect(html).toContain('Countries Only');
  });

  it('renders close button when onClose is provided', () => {
    const html = renderToString(<QuizPanel {...baseProps} onClose={() => {}} />);
    expect(html).toContain('aria-label="Hide Scoring Panel"');
  });

  it('does not render close button when onClose is not provided', () => {
    const html = renderToString(<QuizPanel {...baseProps} />);
    expect(html).not.toContain('aria-label="Hide Scoring Panel"');
  });

  it('renders control action buttons', () => {
    const html = renderToString(<QuizPanel {...baseProps} />);
    expect(html).toContain('Hint');
    expect(html).toContain('Show Answer');
    expect(html).toContain('Skip');
    expect(html).toContain('Reset Score');
  });
});
