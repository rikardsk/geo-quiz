import React from 'react';
import { USState } from '../data/statesData';
import { CheckCircle2, AlertCircle, Eye } from 'lucide-react';

export interface QuizToastProps {
  status: 'idle' | 'correct' | 'incorrect' | 'revealed';
  targetStateName?: string;
  lastAnsweredState?: USState | null;
}

const renderToastBody = (
  status: 'correct' | 'incorrect' | 'revealed',
  targetStateName?: string,
  lastAnsweredState?: USState | null
) => {
  if (status === 'correct') {
    return (
      <div className="quiz-toast quiz-toast-correct">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <span>{`Correct! That is ${targetStateName}! (+1 pt)`}</span>
      </div>
    );
  }
  if (status === 'revealed') {
    return (
      <div className="quiz-toast quiz-toast-revealed">
        <Eye className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <span>{`Here is ${targetStateName}!`}</span>
      </div>
    );
  }
  return (
    <div className="quiz-toast quiz-toast-incorrect">
      <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
      <span>{`That was ${lastAnsweredState?.name ?? 'incorrect'}! Try again!`}</span>
    </div>
  );
};

export const QuizToast: React.FC<QuizToastProps> = ({
  status,
  targetStateName,
  lastAnsweredState,
}) => {
  if (status === 'idle') return null;
  if (status === 'incorrect' && !lastAnsweredState) return null;

  return (
    <div className="quiz-toast-container" role="status" aria-live="polite">
      {renderToastBody(status, targetStateName, lastAnsweredState)}
    </div>
  );
};
