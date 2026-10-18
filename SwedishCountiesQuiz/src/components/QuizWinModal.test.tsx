import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizWinModal } from './QuizWinModal';

describe('QuizWinModal', () => {
  it('renders Spela igen button and completed score when open', () => {
    const html = renderToString(
      <QuizWinModal
        isOpen={true}
        score={21}
        totalAnswered={21}
        bestStreak={21}
        mode="county-name"
        onPlayAgain={() => {}}
        onReviewMap={() => {}}
        onOpenTiersModal={() => {}}
      />
    );

    expect(html).toContain('Spela igen');
    expect(html).toContain('21/21');
    expect(html).toContain('Rikskartograf');
  });

  it('does not render when isOpen is false', () => {
    const html = renderToString(
      <QuizWinModal
        isOpen={false}
        score={21}
        totalAnswered={21}
        bestStreak={21}
        mode="county-name"
        onPlayAgain={() => {}}
        onReviewMap={() => {}}
        onOpenTiersModal={() => {}}
      />
    );

    expect(html).toBe('');
  });
});
