import React from 'react';
import { USState } from '../data/statesData';
import { MultipleChoiceOptions } from './QuizQuestionBanner';

export interface QuizOptionsPanelProps {
  choices: USState[];
  targetStateId?: string;
  isRevealing?: boolean;
  onSelect: (choice: USState) => void;
  disabled?: boolean;
}

export const QuizOptionsPanel: React.FC<QuizOptionsPanelProps> = ({
  choices,
  targetStateId,
  isRevealing,
  onSelect,
  disabled,
}) => {
  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
      data-testid="quiz-options-panel"
    >
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
        <span>Options</span>
        <span className="text-[11px] font-semibold text-rose-500">Select country</span>
      </div>
      <MultipleChoiceOptions
        choices={choices}
        targetStateId={targetStateId}
        isRevealing={isRevealing}
        onSelect={onSelect}
        disabled={disabled}
        layout="vertical"
      />
    </div>
  );
};

export default QuizOptionsPanel;
