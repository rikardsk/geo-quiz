import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizBottomProgressBar } from './QuizBottomProgressBar';

describe('QuizBottomProgressBar', () => {
  it('renders initial state with 0 identified countries', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={0} revealedCount={0} totalStates={17} />
    );
    expect(html).toContain('Countries Remaining to Identify');
    expect(html).toContain('17');
    expect(html).toContain('(0 / 17 • 0%)');
    expect(html).toContain('style="width:0%"');
  });

  it('renders partial progress with solved and revealed countries', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={5} revealedCount={3} totalStates={16} />
    );
    expect(html).toContain('8');
    expect(html).toContain('(8 / 16 • 50%)');
    expect(html).toContain('style="width:50%"');
  });

  it('renders completed progress when all countries identified', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={14} revealedCount={3} totalStates={17} />
    );
    expect(html).toContain('0');
    expect(html).toContain('(17 / 17 • 100%)');
    expect(html).toContain('style="width:100%"');
  });

  it('supports custom className and uses map-aligned default classes', () => {
    const defaultHtml = renderToString(
      <QuizBottomProgressBar solvedCount={2} revealedCount={0} totalStates={17} />
    );
    expect(defaultHtml).toContain('w-full max-w-5xl mx-auto');

    const customHtml = renderToString(
      <QuizBottomProgressBar
        solvedCount={2}
        revealedCount={0}
        totalStates={17}
        className="custom-test-bar"
      />
    );
    expect(customHtml).toContain('custom-test-bar');
  });
});
