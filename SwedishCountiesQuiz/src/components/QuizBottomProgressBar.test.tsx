import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizBottomProgressBar } from './QuizBottomProgressBar';

describe('QuizBottomProgressBar', () => {
  it('renders remaining teams count and progress track correctly', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={15} revealedCount={0} totalTeams={30} />
    );
    expect(html).toContain('15');
    expect(html).toContain('50%');
    expect(html).toContain('width:50%');
  });
});
