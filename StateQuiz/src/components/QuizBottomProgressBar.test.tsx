import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizBottomProgressBar } from './QuizBottomProgressBar';

describe('QuizBottomProgressBar', () => {
  it('renders initial state with 0 identified states', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={0} revealedCount={0} totalStates={50} />
    );
    expect(html).toContain('States Remaining to Identify');
    expect(html).toContain('50');
    expect(html).toContain('(0 / 50 • 0%)');
    expect(html).toContain('style="width:0%"');
  });

  it('renders partial progress with solved and revealed states', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={15} revealedCount={5} totalStates={50} />
    );
    expect(html).toContain('30');
    expect(html).toContain('(20 / 50 • 40%)');
    expect(html).toContain('style="width:40%"');
  });

  it('renders completed progress when all states identified', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={45} revealedCount={5} totalStates={50} />
    );
    expect(html).toContain('0');
    expect(html).toContain('(50 / 50 • 100%)');
    expect(html).toContain('style="width:100%"');
  });

  it('supports custom className and uses map-aligned default classes', () => {
    const defaultHtml = renderToString(
      <QuizBottomProgressBar solvedCount={10} revealedCount={0} totalStates={50} />
    );
    expect(defaultHtml).toContain('w-full max-w-5xl mx-auto');

    const customHtml = renderToString(
      <QuizBottomProgressBar
        solvedCount={10}
        revealedCount={0}
        totalStates={50}
        className="custom-test-bar"
      />
    );
    expect(customHtml).toContain('custom-test-bar');
  });
});
