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
    expect(html).toContain('States Only');
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
    expect(html).toContain('Show');
    expect(html).toContain('Skip');
    expect(html).toContain('Restart');
  });

  it('disables Hint button in identify the state mode', () => {
    const html = renderToString(
      <QuizPanel {...baseProps} questionTypeMode="multiple-choice" />
    );
    expect(html).toContain('Hints are not needed in Identify the State mode');
  });
});
