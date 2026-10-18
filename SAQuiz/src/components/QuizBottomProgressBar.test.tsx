import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizBottomProgressBar } from './QuizBottomProgressBar';

describe('QuizBottomProgressBar', () => {
  it('renders initial state with 0 countries identified', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={0} revealedCount={0} totalStates={27} />
    );
    expect(html).toContain('Countries Remaining to Identify');
    expect(html).toContain('27');
    expect(html).toContain('left');
    expect(html).toContain('style="width:0%"');
  });

  it('renders progress with solved and revealed countries', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={6} revealedCount={3} totalStates={27} />
    );
    expect(html).toContain('18');
    expect(html).toContain('left');
    expect(html).toContain('style="width:33%"');
  });

  it('renders completed progress when all countries identified', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={25} revealedCount={2} totalStates={27} />
    );
    expect(html).toContain('0');
    expect(html).toContain('left');
    expect(html).toContain('style="width:100%"');
  });
});
