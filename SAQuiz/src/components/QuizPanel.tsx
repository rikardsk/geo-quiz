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
        <button
          onClick={onOpenTiers}
          className="text-[10px] font-extrabold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-1.5 py-0.5 rounded transition-colors"
          title="View score ranking tiers"
        >
          Tiers 🏆
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpen}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md transition-colors"
          title="Switch quiz mode"
        >
          {label}
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Hide Scoring Panel"
            title="Hide scoring panel"
          >
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
      <p className="text-lg font-bold text-amber-600">
        {`${streak} `}
        <span className="text-xs text-slate-400">{`(${bestStreak})`}</span>
      </p>
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
        <span className="font-bold">All 13 South American countries found!</span>
      </div>
      <button
        onClick={onViewWinModal}
        className="btn-primary text-xs py-1 px-2.5 bg-amber-600 hover:bg-amber-700 border-amber-600 cursor-pointer"
      >
        View Ranking
      </button>
    </div>
  );
};

const RestartQuizButton: React.FC<{ onRestart: () => void }> = ({ onRestart }) => (
  <button
    onClick={onRestart}
    className="w-full btn-secondary text-xs justify-center text-slate-600 hover:text-slate-900 mt-2 py-2"
    title="Restart"
  >
    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
    <span>Restart</span>
  </button>
);

interface ControlsProps {
  hintUsed: boolean;
  isHintDisabled?: boolean;
  isComplete?: boolean;
  isRevealing?: boolean;
  onUseHint: () => void;
  onShowAnswer: () => void;
  onSkipQuestion: () => void;
  onRestartQuiz: () => void;
}

const HintButton: React.FC<{
  disabled: boolean;
  hintUsed: boolean;
  isHintDisabled?: boolean;
  onUseHint: () => void;
}> = ({ disabled, hintUsed, isHintDisabled, onUseHint }) => (
  <button
    onClick={onUseHint}
    disabled={disabled}
    className={`btn-secondary text-xs justify-center ${
      disabled ? 'btn-hint-disabled opacity-50 cursor-not-allowed' : ''
    }`}
    title={isHintDisabled ? 'Hints are not needed in Identify the Country mode' : undefined}
  >
    <Lightbulb className={`w-3.5 h-3.5 ${disabled ? 'text-slate-400' : 'text-amber-500'}`} />
    <span>{hintUsed ? 'Active' : 'Hint'}</span>
  </button>
);

const QuizActionButtons: React.FC<ControlsProps> = ({
  hintUsed,
  isHintDisabled,
  isComplete,
  isRevealing,
  onUseHint,
  onShowAnswer,
  onSkipQuestion,
}) => {
  const disableHint = Boolean(hintUsed || isComplete || isRevealing || isHintDisabled);
  const disableActions = Boolean(isComplete || isRevealing);

  return (
    <div className="grid grid-cols-3 gap-2">
      <HintButton
        disabled={disableHint}
        hintUsed={hintUsed}
        isHintDisabled={isHintDisabled}
        onUseHint={onUseHint}
      />
      <button
        onClick={onShowAnswer}
        disabled={disableActions}
        className={`btn-secondary text-xs justify-center text-amber-700 hover:text-amber-800 hover:bg-amber-50 border-amber-300 ${
          disableActions ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title="Give up and reveal the location"
      >
        <Eye className="w-3.5 h-3.5 text-amber-600" />
        <span>Show</span>
      </button>
      <button
        onClick={onSkipQuestion}
        disabled={disableActions}
        className={`btn-secondary text-xs justify-center ${
          disableActions ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <SkipForward className="w-3.5 h-3.5" />
        <span>Skip</span>
      </button>
    </div>
  );
};

const QuizControls: React.FC<ControlsProps> = (props) => (
  <div className="pt-3 border-t border-slate-100">
    <QuizActionButtons {...props} />
    <RestartQuizButton onRestart={props.onRestartQuiz} />
  </div>
);

export const QuizPanel: React.FC<QuizPanelProps> = ({
  score,
  totalAnswered,
  streak,
  bestStreak,
  hintUsed,
  questionTypeMode,
  currentQuestionType,
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
  const isHintDisabled =
    questionTypeMode === 'multiple-choice' || currentQuestionType === 'multiple-choice';

  return (
    <div className="state-card">
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
      <QuizControls
        hintUsed={hintUsed}
        isHintDisabled={isHintDisabled}
        isComplete={isComplete}
        isRevealing={isRevealing}
        onUseHint={onUseHint}
        onShowAnswer={onShowAnswer}
        onSkipQuestion={onSkipQuestion}
        onRestartQuiz={onRestartQuiz}
      />
    </div>
  );
};
