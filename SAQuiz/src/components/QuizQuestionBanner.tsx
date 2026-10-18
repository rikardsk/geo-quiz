import React from 'react';
import { QuizQuestion } from '../utils/quizUtils';
import { USState } from '../data/statesData';

export interface QuizQuestionBannerProps {
  currentQuestion: QuizQuestion | null;
  hintUsed: boolean;
  isComplete?: boolean;
  onSelectChoice?: (choice: USState) => void;
  disabled?: boolean;
  isRevealing?: boolean;
  showChoices?: boolean;
  className?: string;
  overlay?: boolean;
  isOverlay?: boolean;
}

const BADGE_CLASSES = [
  'quiz-mc-badge quiz-mc-badge-a',
  'quiz-mc-badge quiz-mc-badge-b',
  'quiz-mc-badge quiz-mc-badge-c',
  'quiz-mc-badge quiz-mc-badge-d',
];

export const ChoiceButton: React.FC<{
  choice: USState;
  index: number;
  onSelect: (choice: USState) => void;
  disabled?: boolean;
  isFlashing?: boolean;
}> = ({ choice, index, onSelect, disabled, isFlashing }) => {
  const badgeClass = BADGE_CLASSES[index] ?? 'quiz-mc-badge';
  const buttonClass = `quiz-mc-button ${isFlashing ? 'quiz-mc-button-flash' : ''}`;
  return (
    <button
      onClick={() => onSelect(choice)}
      disabled={disabled}
      className={buttonClass}
    >
      <div className="quiz-mc-left">
        <span className={badgeClass}>
          {['A', 'B', 'C', 'D'][index]}
        </span>
        <span className="quiz-mc-name">{choice.name}</span>
      </div>
      <span className="quiz-mc-region">{choice.region}</span>
    </button>
  );
};

export const MultipleChoiceOptions: React.FC<{
  choices: USState[];
  targetStateId?: string;
  isRevealing?: boolean;
  onSelect: (choice: USState) => void;
  disabled?: boolean;
  layout?: 'grid' | 'vertical';
}> = ({ choices, targetStateId, isRevealing, onSelect, disabled, layout = 'grid' }) => (
  <div className={layout === 'vertical' ? 'quiz-mc-vertical' : 'quiz-mc-grid'}>
    {choices.map((choice, idx) => (
      <ChoiceButton
        key={choice.id}
        choice={choice}
        index={idx}
        onSelect={onSelect}
        disabled={disabled}
        isFlashing={Boolean(isRevealing && choice.id === targetStateId)}
      />
    ))}
  </div>
);

const CompletionBanner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={className}>
    <h2 className="quiz-question-text text-emerald-600">
      🎉 Congratulations! All 13 South American Countries Found!
    </h2>
    <p className="text-xs font-medium mt-1 text-slate-600">
      You've successfully completed the quiz. Check your ranking!
    </p>
  </div>
);

export const QuizQuestionBanner: React.FC<QuizQuestionBannerProps> = ({
  currentQuestion,
  hintUsed,
  isComplete,
  onSelectChoice,
  disabled,
  isRevealing,
  showChoices = true,
  className = '',
  overlay = false,
  isOverlay = false,
}) => {
  const isOverlayMode = Boolean(overlay || isOverlay);
  const baseClass = isOverlayMode ? 'quiz-question-overlay' : 'quiz-question-banner';
  if (isComplete) return <CompletionBanner className={`${baseClass} ${className}`} />;
  if (!currentQuestion) return null;

  const isMultipleChoice = currentQuestion.questionType === 'multiple-choice';
  const shouldRenderChoices = showChoices && Boolean(currentQuestion.choices && onSelectChoice);

  return (
    <div className={`${baseClass} ${shouldRenderChoices ? 'quiz-mc-banner' : ''} ${className}`}>
      {(!isMultipleChoice || !shouldRenderChoices) && (
        <h2 className="quiz-question-text">{currentQuestion.prompt}</h2>
      )}
      {hintUsed && (
        <p
          className={
            overlay
              ? 'quiz-question-overlay-hint animate-fade-in'
              : 'text-xs text-rose-600 font-bold mt-1.5 animate-fade-in flex items-center justify-center gap-1.5'
          }
        >
          <span>💡</span> Look inside {currentQuestion.targetState.region} South America!
        </p>
      )}
      {shouldRenderChoices && currentQuestion.choices && onSelectChoice && (
        <MultipleChoiceOptions
          choices={currentQuestion.choices}
          targetStateId={currentQuestion.targetState.id}
          isRevealing={isRevealing}
          onSelect={onSelectChoice}
          disabled={disabled}
        />
      )}
    </div>
  );
};
