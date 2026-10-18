import React from 'react';
import { QuizQuestion } from '../utils/quizUtils';
import { SwedenCountyData } from '../data/countiesData';

export interface QuizQuestionBannerProps {
  currentQuestion: QuizQuestion | null;
  hintUsed: boolean;
  isComplete?: boolean;
}

export interface QuizMultipleChoicePanelProps {
  choices: SwedenCountyData[];
  targetTeamId?: string;
  isRevealing?: boolean;
  onSelectChoice: (choice: SwedenCountyData) => void;
  disabled?: boolean;
}

const BADGE_CLASSES = [
  'quiz-mc-badge quiz-mc-badge-a',
  'quiz-mc-badge quiz-mc-badge-b',
  'quiz-mc-badge quiz-mc-badge-c',
  'quiz-mc-badge quiz-mc-badge-d',
];

const ChoiceButton: React.FC<{
  choice: SwedenCountyData;
  index: number;
  onSelect: (choice: SwedenCountyData) => void;
  disabled?: boolean;
  isFlashing?: boolean;
}> = ({ choice, index, onSelect, disabled, isFlashing }) => {
  const badgeClass = BADGE_CLASSES[index] ?? 'quiz-mc-badge';
  const buttonClass = `quiz-mc-button ${isFlashing ? 'quiz-mc-button-flash' : ''}`;

  return (
    <button type="button" onClick={() => onSelect(choice)} disabled={disabled} className={buttonClass}>
      <div className="quiz-mc-left">
        <span className={badgeClass}>{['A', 'B', 'C', 'D'][index]}</span>
        <div className="text-left min-w-0 flex flex-col gap-1.5">
          <span className="quiz-mc-name block truncate">{choice.name}</span>
          <span className="text-xs text-sky-700 font-semibold block truncate">
            {choice.largestCity}
          </span>
        </div>
      </div>
    </button>
  );
};

const MultipleChoiceOptions: React.FC<{
  choices: SwedenCountyData[];
  targetTeamId?: string;
  isRevealing?: boolean;
  onSelect: (choice: SwedenCountyData) => void;
  disabled?: boolean;
}> = ({ choices, targetTeamId, isRevealing, onSelect, disabled }) => (
  <div className="quiz-mc-grid">
    {choices.map((choice, idx) => (
      <ChoiceButton
        key={choice.id}
        choice={choice}
        index={idx}
        onSelect={onSelect}
        disabled={disabled}
        isFlashing={Boolean(isRevealing && choice.id === targetTeamId)}
      />
    ))}
  </div>
);

export const QuizMultipleChoicePanel: React.FC<QuizMultipleChoicePanelProps> = ({
  choices,
  targetTeamId,
  isRevealing,
  onSelectChoice,
  disabled,
}) => {
  if (!choices || choices.length === 0) return null;

  return (
    <div className="quiz-mc-banner">
      <MultipleChoiceOptions
        choices={choices}
        targetTeamId={targetTeamId}
        isRevealing={isRevealing}
        onSelect={onSelectChoice}
        disabled={disabled}
      />
    </div>
  );
};

const CompletionBanner: React.FC = () => (
  <div className="quiz-question-banner">
    <h2 className="quiz-question-text text-emerald-600">
      🏆 Rikskartograf! Alla 21 svenska län och största städer identifierade!
    </h2>
    <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
      Du har bemästrat hela Sveriges länskarta och dess centralorter. Se ditt slutresultat!
    </p>
  </div>
);

export function getLocalizedPrompt(prompt: string): string {
  if (!prompt) return '';
  if (prompt.startsWith('Find ') && prompt.endsWith(' on the map')) {
    const county = prompt.slice('Find '.length, prompt.length - ' on the map'.length);
    return `Hitta ${county} på kartan`;
  }
  if (prompt === 'Which county is highlighted on the map?' || prompt === 'Which club is highlighted on the map?') {
    return 'Vilket län är markerat på kartan?';
  }
  return prompt;
}

export const QuizQuestionBanner: React.FC<QuizQuestionBannerProps> = ({
  currentQuestion,
  hintUsed,
  isComplete = false,
}) => {
  if (isComplete) return <CompletionBanner />;
  if (!currentQuestion) return null;

  return (
    <div className="quiz-question-banner">
      <h2 className="quiz-question-text">
        {getLocalizedPrompt(currentQuestion.prompt)}
      </h2>
      {hintUsed && (
        <p className="text-xs text-amber-600 font-medium mt-1">
          💡 Ledtråd: Landsdelen och residensstaden visas som hjälp!
        </p>
      )}
    </div>
  );
};
