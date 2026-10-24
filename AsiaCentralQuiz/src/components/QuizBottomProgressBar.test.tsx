import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizBottomProgressBar } from './QuizBottomProgressBar';

describe('QuizBottomProgressBar', () => {
  it('renders progress ratio and percentage', () => {
    const html = renderToString(
      <QuizBottomProgressBar
        solvedCount={7}
        revealedCount={3}
        totalStates={17}
      />
    );
    expect(html).toContain('Countries Remaining to Identify');
    expect(html).toContain('7');
    expect(html).toContain('left');
    expect(html).toContain('10 / 17');
    expect(html).toContain('59%');
    expect(html).toContain('width:59%');
  });
});
