import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizBottomProgressBar } from './QuizBottomProgressBar';

describe('QuizBottomProgressBar', () => {
  it('renders initial state with 0 identified countries', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={0} revealedCount={0} totalStates={45} />
    );
    expect(html).toContain('Countries Remaining to Identify');
    expect(html).toContain('45');
    expect(html).toContain('(0 / 45 • 0%)');
    expect(html).toContain('style="width:0%"');
  });

  it('renders partial progress with solved and revealed countries', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={15} revealedCount={5} totalStates={40} />
    );
    expect(html).toContain('20');
    expect(html).toContain('(20 / 40 • 50%)');
    expect(html).toContain('style="width:50%"');
  });

  it('renders completed progress when all countries identified', () => {
    const html = renderToString(
      <QuizBottomProgressBar solvedCount={40} revealedCount={5} totalStates={45} />
    );
    expect(html).toContain('0');
    expect(html).toContain('(45 / 45 • 100%)');
    expect(html).toContain('style="width:100%"');
  });

  it('supports custom className and uses map-aligned default classes', () => {
    const defaultHtml = renderToString(
      <QuizBottomProgressBar solvedCount={2} revealedCount={0} totalStates={45} />
    );
    expect(defaultHtml).toContain('w-full max-w-5xl mx-auto');

    const customHtml = renderToString(
      <QuizBottomProgressBar
        solvedCount={2}
        revealedCount={0}
        totalStates={45}
        className="custom-test-bar"
      />
    );
    expect(customHtml).toContain('custom-test-bar');
  });
});
