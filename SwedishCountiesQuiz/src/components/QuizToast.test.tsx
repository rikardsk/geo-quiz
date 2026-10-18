import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizToast } from './QuizToast';
import { SWEDISH_COUNTIES } from '../data/countiesData';

describe('QuizToast', () => {
  it('renders nothing when status is idle', () => {
    const html = renderToString(<QuizToast status="idle" />);
    expect(html).toBe('');
  });

  it('renders failure/incorrect toast with alert message and county name', () => {
    const skane = SWEDISH_COUNTIES.find((c) => c.id === 'M')!;
    const html = renderToString(
      <QuizToast
        status="incorrect"
        targetTeamName="Stockholms län"
        lastAnsweredTeam={skane}
      />
    );

    expect(html).toContain('quiz-toast-container');
    expect(html).toContain('quiz-toast-incorrect');
    expect(html).toContain('Inte riktigt! Det var Skåne län! Försök igen!');
  });

  it('renders correct toast when answer is right', () => {
    const html = renderToString(
      <QuizToast
        status="correct"
        targetTeamName="Skåne län"
      />
    );

    expect(html).toContain('quiz-toast-correct');
    expect(html).toContain('Rätt! Det är Skåne län! (+1 p)');
  });

  it('renders revealed toast when answer is revealed', () => {
    const html = renderToString(
      <QuizToast
        status="revealed"
        targetTeamName="Uppsala län"
      />
    );

    expect(html).toContain('quiz-toast-revealed');
    expect(html).toContain('Här ligger Uppsala län!');
  });
});
