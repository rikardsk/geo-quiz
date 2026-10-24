import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizBottomProgressBar } from './QuizBottomProgressBar';

describe('QuizBottomProgressBar', () => {
  it('renders initial state with 0 identified provinces', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={0} revealedCount={0} totalStates={13} />
    );
    expect(html).toContain('Provinces Remaining to Identify');
    expect(html).toContain('13');
    expect(html).toContain('(0 / 13 • 0%)');
    expect(html).toContain('style="width:0%"');
  });

  it('renders partial progress with solved and revealed provinces', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={3} revealedCount={2} totalStates={10} />
    );
    expect(html).toContain('5');
    expect(html).toContain('(5 / 10 • 50%)');
    expect(html).toContain('style="width:50%"');
  });

  it('renders completed progress when all provinces identified', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={10} revealedCount={3} totalStates={13} />
    );
    expect(html).toContain('0');
    expect(html).toContain('(13 / 13 • 100%)');
    expect(html).toContain('style="width:100%"');
  });

  it('supports custom className and uses map-aligned default classes', () => {
    const defaultHtml = renderToString(
      <QuizBottomProgressBar solvedCount={2} revealedCount={0} totalStates={13} />
    );
    expect(defaultHtml).toContain('w-full max-w-5xl mx-auto');

    const customHtml = renderToString(
      <QuizBottomProgressBar
        solvedCount={2}
        revealedCount={0}
        totalStates={13}
        className="custom-test-bar"
      />
    );
    expect(customHtml).toContain('custom-test-bar');
  });
});
