import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizQuestionBanner } from './QuizQuestionBanner';
import { generateQuestion } from '../utils/quizUtils';

describe('QuizQuestionBanner', () => {
  it('renders standard state question banner', () => {
    const q = generateQuestion('state-name');
    const html = renderToString(
      <QuizQuestionBanner
        currentQuestion={q}
        hintUsed={false}
      />
    );
    expect(html).toContain('Find');
    expect(html).toContain(q.targetState.name);
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
    expect(html).not.toContain('Which state is highlighted on the map?');
    expect(html).toContain('>A<');
    expect(html).toContain('>B<');
    expect(html).toContain('>C<');
    expect(html).toContain('>D<');
    expect(html).toContain('quiz-mc-badge-a');
    expect(html).toContain('quiz-mc-badge-b');
    expect(html).toContain('quiz-mc-badge-c');
    expect(html).toContain('quiz-mc-badge-d');
    expect(html).toContain('quiz-mc-left');
    expect(html).toContain('quiz-mc-button');
    q.choices?.forEach((choice) => {
      expect(html).toContain(choice.name);
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

  it('renders with quiz-question-overlay class when overlay is true', () => {
    const q = generateQuestion('state-name');
    const html = renderToString(
      <QuizQuestionBanner
        currentQuestion={q}
        hintUsed={false}
        overlay={true}
      />
    );
    expect(html).toContain('quiz-question-overlay');
  });
});
