import React from 'react';
import { QuestionType, calculateQuizRank } from '../utils/quizUtils';
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
  if (mode === 'county-name' || mode === 'team-name') return 'Länskartan';
  if (mode === 'largest-city' || mode === 'city' || mode === 'stadium') return 'Största stad';
  if (mode === 'residence-city') return 'Residensstäder';
  if (mode === 'multiple-choice') return 'Flervalsquiz';
  return 'Blandat läge';
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
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quiz-läge</span>
        <button
          onClick={onOpenTiers}
          className="text-[10px] font-extrabold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-1.5 py-0.5 rounded transition-colors"
          title="Visa rankingnivåer"
        >
          Nivåer 🏆
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpen}
          className="text-xs font-bold text-slate-900 hover:text-black bg-sky-50 hover:bg-sky-100 border border-sky-200/80 px-2 py-0.5 rounded-md transition-colors"
          title="Byt spelläge"
        >
          {label}
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Dölj panel"
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
      <span className="text-[11px] font-medium text-slate-500">Poäng</span>
      <p className="text-lg font-bold text-slate-900">{`${score} / ${totalAnswered}`}</p>
    </div>
    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5">
      <span className="text-[11px] font-medium text-slate-500 flex items-center justify-center gap-0.5">
        <Flame className="w-3 h-3 text-amber-500" /> Svit
      </span>
      <p className="text-lg font-bold text-amber-600">
        {`${streak} `}
        <span className="text-xs text-slate-400">{`(${bestStreak})`}</span>
      </p>
    </div>
    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5">
      <span className="text-[11px] font-medium text-slate-500">Träffsäkerhet</span>
      <p className="text-lg font-bold text-slate-900">{`${accuracy}%`}</p>
    </div>
  </div>
);

const QuizRankPreview: React.FC<{
  score: number;
  totalAnswered: number;
  onOpenTiers: () => void;
}> = ({ score, totalAnswered, onOpenTiers }) => {
  const currentTier = calculateQuizRank(score, totalAnswered);

  return (
    <div
      onClick={onOpenTiers}
      className="p-3 mb-4 rounded-xl border border-slate-200/70 bg-gradient-to-r from-slate-50 to-white hover:from-amber-50/40 hover:to-white cursor-pointer transition-all flex items-center justify-between shadow-2xs overflow-hidden"
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
        <span className="text-2xl flex-shrink-0">{currentTier.badgeEmoji}</span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 shrink-0">
              Klass {currentTier.grade}
            </span>
            <span className="text-xs font-bold text-slate-900 truncate">{currentTier.title}</span>
          </div>
          <p className="text-[11px] text-slate-500 truncate mt-0.5">{currentTier.description}</p>
        </div>
      </div>
      <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0 ml-2" />
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
  isComplete = false,
  isRevealing = false,
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
    <div className="team-card h-full max-h-full flex flex-col justify-between">
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
        <QuizRankPreview
          score={score}
          totalAnswered={totalAnswered}
          onOpenTiers={onOpenTiersModal}
        />

        {isComplete && onViewWinModal && (
          <button
            onClick={onViewWinModal}
            className="w-full mb-3 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Visa Slutresultat</span>
          </button>
        )}
      </div>

      <div className="space-y-2 pt-3 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onUseHint}
            disabled={hintUsed || isRevealing || isComplete}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
              hintUsed || isRevealing || isComplete
                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{hintUsed ? 'Ledtråd aktiv' : 'Ledtråd'}</span>
          </button>

          <button
            onClick={onShowAnswer}
            disabled={isRevealing || isComplete}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
              isRevealing || isComplete
                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visa svaret</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onSkipQuestion}
            disabled={isRevealing || isComplete}
            className="py-2 px-3 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center gap-1.5 transition-all"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Hoppa över</span>
          </button>

          <button
            onClick={onRestartQuiz}
            className="py-2 px-3 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Börja om</span>
          </button>
        </div>
      </div>
    </div>
  );
};
