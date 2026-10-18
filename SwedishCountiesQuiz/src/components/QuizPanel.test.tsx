import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizPanel } from './QuizPanel';

describe('QuizPanel', () => {
  it('renders Ledtråd button when hint is available', () => {
    const html = renderToString(
      <QuizPanel
        score={0}
        totalAnswered={0}
        streak={0}
        bestStreak={0}
        hintUsed={false}
        questionTypeMode="team-name"
        onOpenModeModal={() => {}}
        onOpenTiersModal={() => {}}
        onUseHint={() => {}}
        onShowAnswer={() => {}}
        onSkipQuestion={() => {}}
        onRestartQuiz={() => {}}
      />
    );

    expect(html).toContain('Ledtråd');
    expect(html).toContain('bg-amber-50');
  });

  it('renders Ledtråd aktiv when hintUsed is true', () => {
    const html = renderToString(
      <QuizPanel
        score={0}
        totalAnswered={0}
        streak={0}
        bestStreak={0}
        hintUsed={true}
        questionTypeMode="team-name"
        onOpenModeModal={() => {}}
        onOpenTiersModal={() => {}}
        onUseHint={() => {}}
        onShowAnswer={() => {}}
        onSkipQuestion={() => {}}
        onRestartQuiz={() => {}}
      />
    );

    expect(html).toContain('Ledtråd aktiv');
    expect(html).toContain('disabled');
  });
});
