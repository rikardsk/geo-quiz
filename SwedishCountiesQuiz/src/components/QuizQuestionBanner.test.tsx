import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizQuestionBanner, QuizMultipleChoicePanel, getLocalizedPrompt } from './QuizQuestionBanner';
import { SWEDISH_COUNTIES } from '../data/countiesData';
import { QuizQuestion } from '../utils/quizUtils';

describe('QuizQuestionBanner', () => {
  it('renders question prompt banner in Swedish', () => {
    const question: QuizQuestion = {
      questionType: 'county-name',
      prompt: 'Hitta Stockholms län på kartan',
      targetCounty: SWEDISH_COUNTIES[0],
      targetTeam: SWEDISH_COUNTIES[0],
    };

    const html = renderToString(
      <QuizQuestionBanner currentQuestion={question} hintUsed={false} />
    );

    expect(html).toContain('Hitta Stockholms län på kartan');
    expect(html).toContain('quiz-question-banner');
  });

  it('translates legacy English prompts like Find Stockholm County on the map to Swedish', () => {
    expect(getLocalizedPrompt('Find Skåne län on the map')).toBe('Hitta Skåne län på kartan');

    const question: QuizQuestion = {
      questionType: 'largest-city',
      prompt: 'Vilket län har Malmö som största stad?',
      targetCounty: SWEDISH_COUNTIES.find((t) => t.id === 'M')!,
      targetTeam: SWEDISH_COUNTIES.find((t) => t.id === 'M')!,
    };

    const html = renderToString(
      <QuizQuestionBanner currentQuestion={question} hintUsed={false} />
    );

    expect(html).toContain('Vilket län har Malmö som största stad?');
  });

  it('renders completion banner when quiz is complete', () => {
    const html = renderToString(
      <QuizQuestionBanner currentQuestion={null} hintUsed={false} isComplete={true} />
    );

    expect(html).toContain('Rikskartograf! Alla 21 svenska län');
  });
});

describe('QuizMultipleChoicePanel', () => {
  it('renders 4 choice buttons with letters A, B, C, D', () => {
    const choices = SWEDISH_COUNTIES.slice(0, 4);
    const html = renderToString(
      <QuizMultipleChoicePanel
        choices={choices}
        targetTeamId={choices[0].id}
        onSelectChoice={() => {}}
      />
    );

    expect(html).toContain('quiz-mc-banner');
    expect(html).toContain('quiz-mc-badge-a');
    expect(html).toContain('quiz-mc-badge-b');
    expect(html).toContain('quiz-mc-badge-c');
    expect(html).toContain('quiz-mc-badge-d');
    expect(html).toContain(choices[0].name);
    expect(html).toContain(choices[0].largestCity);
    expect(html).not.toContain('quiz-mc-region');
    expect(html).toContain('gap-1.5');
  });
});
