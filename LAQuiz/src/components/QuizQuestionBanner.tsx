import React from 'react';
import { QuizQuestion } from '../utils/quizUtils';
import { USState } from '../data/statesData';

export interface QuizQuestionBannerProps {
  currentQuestion: QuizQuestion | null;
  hintUsed: boolean;
  isComplete?: boolean;
  totalStates?: number;
  onSelectChoice?: (choice: USState) => void;
  disabled?: boolean;
  isRevealing?: boolean;
}

const BADGE_CLASSES = [
  'quiz-mc-badge quiz-mc-badge-a',
  'quiz-mc-badge quiz-mc-badge-b',
  'quiz-mc-badge quiz-mc-badge-c',
  'quiz-mc-badge quiz-mc-badge-d',
];

const ChoiceButton: React.FC<{
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

const MultipleChoiceOptions: React.FC<{
  choices: USState[];
  targetStateId?: string;
  isRevealing?: boolean;
  onSelect: (choice: USState) => void;
  disabled?: boolean;
}> = ({ choices, targetStateId, isRevealing, onSelect, disabled }) => (
  <div className="quiz-mc-grid">
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

const CompletionBanner: React.FC<{ totalStates?: number }> = ({ totalStates = 21 }) => (
  <div className="quiz-question-banner">
    <h2 className="quiz-question-text text-emerald-600">
      {`🎉 Congratulations! All ${totalStates} Countries Found!`}
    </h2>
    <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
      You've successfully completed the quiz. Check your ranking!
    </p>
  </div>
);

export const QuizQuestionOverlay: React.FC<{
  currentQuestion: QuizQuestion | null;
  hintUsed: boolean;
  isComplete?: boolean;
  totalStates?: number;
}> = ({ currentQuestion, hintUsed, isComplete, totalStates = 21 }) => {
  if (isComplete) return <CompletionBanner totalStates={totalStates} />;
  if (!currentQuestion) return null;

  return (
    <div className="quiz-question-banner">
      <h2 className="quiz-question-text">{currentQuestion.prompt}</h2>
      {hintUsed && (
        <p className="text-xs font-bold text-rose-600 mt-0.5 animate-fade-in flex items-center justify-center gap-1">
          <span>💡</span> Look inside the {currentQuestion.targetState.region} region!
        </p>
      )}
    </div>
  );
};

export const QuizQuestionBanner: React.FC<QuizQuestionBannerProps> = ({
  currentQuestion,
  hintUsed: _hintUsed,
  isComplete,
  totalStates = 21,
  onSelectChoice,
  disabled,
  isRevealing,
}) => {
  if (isComplete) {
    return <CompletionBanner totalStates={totalStates} />;
  }

  if (!currentQuestion) return null;

  const isMultipleChoice =
    currentQuestion.questionType === 'multiple-choice' &&
    Array.isArray(currentQuestion.choices) &&
    currentQuestion.choices.length > 0;

  if (!isMultipleChoice || !onSelectChoice) return null;

  return (
    <div className="mt-4">
      <MultipleChoiceOptions
        choices={currentQuestion.choices!}
        targetStateId={currentQuestion.targetState.id}
        isRevealing={isRevealing}
        onSelect={onSelectChoice}
        disabled={disabled}
      />
    </div>
  );
};
