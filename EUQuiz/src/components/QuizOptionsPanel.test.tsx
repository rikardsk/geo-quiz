import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { QuizOptionsPanel } from './QuizOptionsPanel';
import { OFFICIAL_EU_STATES } from '../utils/quizUtils';

describe('QuizOptionsPanel', () => {
  const choices = OFFICIAL_EU_STATES.slice(0, 4);

  it('renders options header and vertical layout buttons', () => {
    const onSelect = vi.fn();
    const html = renderToString(
      <QuizOptionsPanel
        choices={choices}
        targetStateId={choices[0].id}
        onSelect={onSelect}
      />
    );

    expect(html).toContain('Options');
    expect(html).toContain('Select country');
    expect(html).toContain('quiz-mc-vertical');
    expect(html).toContain('>A<');
    expect(html).toContain('>B<');
    expect(html).toContain('>C<');
    expect(html).toContain('>D<');
    choices.forEach((choice) => {
      expect(html).toContain(choice.name);
    });
  });

  it('flashes the target choice button when isRevealing is true', () => {
    const html = renderToString(
      <QuizOptionsPanel
        choices={choices}
        targetStateId={choices[1].id}
        isRevealing={true}
        onSelect={() => {}}
      />
    );

    expect(html).toContain('quiz-mc-button-flash');
  });
});
