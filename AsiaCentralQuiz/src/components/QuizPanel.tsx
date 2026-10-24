import React from 'react';
import { QuestionType } from '../utils/quizUtils';
import { Flame, Lightbulb, SkipForward, RotateCcw, Trophy, Eye, X } from 'lucide-react';

export interface QuizPanelProps {
  score: number;
  totalAnswered: number;
  streak: number;
  bestStreak: number;
  hintUsed: boolean;
  questionTypeMode: 'mixed' | QuestionType;
  currentQuestionType?: QuestionType;
  isComplete?: boolean;
  isRevealing?: boolean;
  onViewWinModal?: () => void;
  onOpenModeModal: () => void;
  onOpenTiersModal: () => void;
  onUseHint: () => void;
  onShowAnswer: () => void;
  onSkipQuestion: () => void;
  onRestartQuiz: () => void;
  onClose?: () => void;
}

const getModeLabel = (mode: 'mixed' | QuestionType): string => {
  if (mode === 'state-name') return 'Countries Only';
  if (mode === 'capital') return 'Capitals';
  if (mode === 'multiple-choice') return 'Identify Country';
  return 'Mixed Mode';
};

const QuizModeHeader: React.FC<{
  mode: 'mixed' | QuestionType;
  onOpen: () => void;
  onOpenTiers: () => void;
  onClose?: () => void;
}> = ({ mode, onOpen, onOpenTiers, onClose }) => {
  const label = getModeLabel(mode);
  return (
    <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quiz Mode</span>
        <button onClick={onOpenTiers} className="text-[10px] font-extrabold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-1.5 py-0.5 rounded transition-colors" title="View score ranking tiers">
          Tiers 🏆
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        <button onClick={onOpen} className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md transition-colors" title="Switch quiz mode">
          {label}
        </button>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" aria-label="Hide Scoring Panel" title="Hide scoring panel">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const QuizStatsBar: React.FC<{
  score: number;
  totalAnswered: number;
  streak: number;
  bestStreak: number;
  accuracy: number;
}> = ({ score, totalAnswered, streak, bestStreak, accuracy }) => (
  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5">
      <span className="text-[11px] font-medium text-slate-500">Score</span>
      <p className="text-lg font-bold text-slate-900">{`${score} / ${totalAnswered}`}</p>
    </div>
    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5">
      <span className="text-[11px] font-medium text-slate-500 flex items-center justify-center gap-0.5">
        <Flame className="w-3 h-3 text-amber-500" /> Streak
      </span>
      <p className="text-lg font-bold text-amber-600">{`${streak} `}<span className="text-xs text-slate-400">{`(${bestStreak})`}</span></p>
    </div>
    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5">
      <span className="text-[11px] font-medium text-slate-500">Accuracy</span>
      <p className="text-lg font-bold text-slate-900">{`${accuracy}%`}</p>
    </div>
  </div>
);

const QuizCompletionBanner: React.FC<{
  isComplete?: boolean;
  onViewWinModal?: () => void;
}> = ({ isComplete, onViewWinModal }) => {
  if (!isComplete) return null;

  return (
    <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 mb-4 flex items-center justify-between gap-2.5">
      <div className="flex items-center gap-2">
        <Trophy className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span className="font-bold">All 13 countries found!</span>
      </div>
      <button
        onClick={onViewWinModal}
        className="btn-primary text-xs py-1 px-2.5 bg-amber-600 hover:bg-amber-700 border-amber-600 cursor-pointer"
      >
        View Summary
      </button>
    </div>
  );
};

export const QuizPanel: React.FC<QuizPanelProps> = ({
  score,
  totalAnswered,
  streak,
  bestStreak,
  hintUsed,
  questionTypeMode,
  isComplete,
  isRevealing,
  onViewWinModal,
  onOpenModeModal,
  onOpenTiersModal,
  onUseHint,
  onShowAnswer,
  onSkipQuestion,
  onRestartQuiz,
  onClose,
}) => {
  const accuracy = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;

  return (
    <div className="quiz-panel h-full flex flex-col justify-between">
      <div>
        <QuizModeHeader
          mode={questionTypeMode}
          onOpen={onOpenModeModal}
          onOpenTiers={onOpenTiersModal}
          onClose={onClose}
        />

        <QuizStatsBar
          score={score}
          totalAnswered={totalAnswered}
          streak={streak}
          bestStreak={bestStreak}
          accuracy={accuracy}
        />

        <QuizCompletionBanner isComplete={isComplete} onViewWinModal={onViewWinModal} />

        <div className="space-y-2 pt-2 border-t border-slate-100">
          {!isComplete && (
            <>
              <button
                onClick={onUseHint}
                disabled={hintUsed || isRevealing}
                className="w-full btn-outline text-xs py-2 flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>{hintUsed ? 'Region Hint Shown' : 'Need a Hint? (Show Region)'}</span>
              </button>

              <button
                onClick={onShowAnswer}
                disabled={isRevealing}
                className="w-full btn-outline text-xs py-2 flex items-center justify-center gap-1.5 text-slate-700 hover:text-amber-700 hover:border-amber-300 disabled:opacity-40"
              >
                <Eye className="w-4 h-4 text-amber-500" />
                <span>{isRevealing ? 'Revealing Location...' : 'Show Answer / Give Up'}</span>
              </button>

              <button
                onClick={onSkipQuestion}
                disabled={isRevealing}
                className="w-full btn-outline text-xs py-2 flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-40"
              >
                <SkipForward className="w-4 h-4 text-slate-400" />
                <span>Skip Question</span>
              </button>
            </>
          )}

          <button
            onClick={onRestartQuiz}
            className="w-full btn-outline text-xs py-2 flex items-center justify-center gap-1.5 text-slate-500 hover:text-rose-600 hover:border-rose-300"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset Score & Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
