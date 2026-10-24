import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizQuestionBanner, QuizQuestionOverlay } from './QuizQuestionBanner';
import { generateQuestion } from '../utils/quizUtils';

describe('QuizQuestionBanner and Overlay', () => {
  it('renders standard country question overlay', () => {
    const q = generateQuestion('state-name');
    const html = renderToString(
      <QuizQuestionOverlay
        currentQuestion={q}
        hintUsed={false}
      />
    );
    expect(html).toContain('Find');
    const escapedName = q.targetState.name.replace(/'/g, '&#x27;');
    expect(html).toContain(escapedName);
  });

  it('renders multiple choice options when questionType is multiple-choice', () => {
    const q = generateQuestion('multiple-choice');
    const html = renderToString(
      <QuizQuestionBanner
        currentQuestion={q}
        hintUsed={false}
        onSelectChoice={() => {}}
      />
    );
    expect(html).toContain('>A<');
    expect(html).toContain('>B<');
    expect(html).toContain('>C<');
    expect(html).toContain('>D<');
    expect(html).toContain('quiz-mc-badge-a');
    expect(html).toContain('quiz-mc-button');
    q.choices?.forEach((choice) => {
      const escapedName = choice.name.replace(/'/g, '&#x27;');
      expect(html).toContain(escapedName);
    });
  });

  it('flashes the correct choice button when isRevealing is true', () => {
    const q = generateQuestion('multiple-choice');
    const html = renderToString(
      <QuizQuestionBanner
        currentQuestion={q}
        hintUsed={false}
        isRevealing={true}
        onSelectChoice={() => {}}
      />
    );
    expect(html).toContain('quiz-mc-button-flash');
  });

  it('renders completion banner when isComplete is true', () => {
    const html = renderToString(
      <QuizQuestionOverlay
        currentQuestion={null}
        hintUsed={false}
        isComplete={true}
      />
    );
    expect(html).toContain('All 13 Countries Found');
  });
});
