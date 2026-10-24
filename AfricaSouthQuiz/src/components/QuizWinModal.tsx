import React, { useState } from 'react';
import { QuizRank, QuestionType, calculateQuizRank, formatQuizSummary } from '../utils/quizUtils';
import { Trophy, Flame, RotateCcw, Map, Share2, Check, X, ChevronRight } from 'lucide-react';

interface QuizWinModalProps {
  isOpen: boolean;
  score: number;
  totalAnswered: number;
  bestStreak: number;
  mode: 'mixed' | QuestionType;
  onPlayAgain: () => void;
  onReviewMap: () => void;
  onOpenTiersModal: () => void;
}

const WinHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
    <div className="flex items-center gap-1.5">
      <Trophy className="w-4 h-4 text-amber-500" />
      <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
        Quiz Completed (27/27)
      </span>
    </div>
    <button
      onClick={onClose}
      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
      aria-label="Close"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

const RankBadge: React.FC<{ rank: QuizRank; onOpenTiers: () => void }> = ({ rank, onOpenTiers }) => (
  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center my-3 relative overflow-hidden">
    <div className="flex items-center justify-center gap-2 mb-1">
      <span className="text-3xl" role="img" aria-label={rank.title}>
        {rank.badgeEmoji}
      </span>
      <span
        className="text-2xl font-black px-2.5 py-0.5 rounded-lg text-white"
        style={{ backgroundColor: rank.color }}
      >
        Rank {rank.grade}
      </span>
    </div>
    <h3 className="text-lg font-extrabold text-slate-900 mt-1">{rank.title}</h3>
    <p className="text-xs text-slate-600 mt-1">{rank.description}</p>
    <button
      onClick={onOpenTiers}
      className="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 hover:underline cursor-pointer"
    >
      <span>View all ranking tiers</span>
      <ChevronRight className="w-3.5 h-3.5" />
    </button>
  </div>
);

interface WinStatsProps {
  accuracy: number;
  score: number;
  totalAnswered: number;
  bestStreak: number;
  modeLabel: string;
}

const WinStatsGrid: React.FC<WinStatsProps> = ({
  accuracy,
  score,
  totalAnswered,
  bestStreak,
  modeLabel,
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-center">
    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5">
      <span className="text-[11px] font-medium text-slate-500">Accuracy</span>
      <p className="text-lg font-bold text-slate-900">{accuracy}%</p>
    </div>
    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5">
      <span className="text-[11px] font-medium text-slate-500">Score</span>
      <p className="text-lg font-bold text-slate-900">{score}/{totalAnswered}</p>
    </div>
    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5">
      <span className="text-[11px] font-medium text-slate-500 flex items-center justify-center gap-0.5">
        <Flame className="w-3 h-3 text-amber-500" /> Streak
      </span>
      <p className="text-lg font-bold text-amber-600">{bestStreak}</p>
    </div>
    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5">
      <span className="text-[11px] font-medium text-slate-500">Mode</span>
      <p className="text-xs font-bold text-slate-800 mt-1 truncate">{modeLabel}</p>
    </div>
  </div>
);

interface WinActionsProps {
  copied: boolean;
  onCopy: () => void;
  onReviewMap: () => void;
  onPlayAgain: () => void;
}

const WinActions: React.FC<WinActionsProps> = ({
  copied,
  onCopy,
  onReviewMap,
  onPlayAgain,
}) => (
  <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-200">
    <button
      onClick={onCopy}
      className="w-full sm:w-auto btn-outline text-xs px-3 py-2 flex items-center justify-center gap-1.5"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
      <span>{copied ? 'Copied Results!' : 'Share Results'}</span>
    </button>
    <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
      <button
        onClick={onReviewMap}
        className="flex-1 sm:flex-initial btn-secondary text-xs px-3 py-2 flex items-center justify-center gap-1.5"
      >
        <Map className="w-4 h-4" />
        <span>Review Map</span>
      </button>
      <button
        onClick={onPlayAgain}
        className="flex-1 sm:flex-initial btn-primary text-xs px-4 py-2 flex items-center justify-center gap-1.5 shadow-sm"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Play Again</span>
      </button>
    </div>
  </div>
);

export const QuizWinModal: React.FC<QuizWinModalProps> = ({
  isOpen,
  score,
  totalAnswered,
  bestStreak,
  mode,
  onPlayAgain,
  onReviewMap,
  onOpenTiersModal,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rank = calculateQuizRank(score, totalAnswered);
  const accuracy = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
  const modeLabel =
    mode === 'state-name'
      ? 'Countries Only'
      : mode === 'capital'
      ? 'Capitals Challenge'
      : mode === 'multiple-choice'
      ? 'Multiple Choice'
      : 'Mixed Mode';

  const handleCopySummary = async () => {
    const summary = formatQuizSummary(score, totalAnswered, bestStreak, rank, mode);
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="modal-backdrop select-none" onClick={onReviewMap} role="dialog" aria-modal="true">
      <div className="modal-container quiz-win-container" onClick={(e) => e.stopPropagation()}>
        <WinHeader onClose={onReviewMap} />
        <RankBadge rank={rank} onOpenTiers={onOpenTiersModal} />
        <WinStatsGrid
          accuracy={accuracy}
          score={score}
          totalAnswered={totalAnswered}
          bestStreak={bestStreak}
          modeLabel={modeLabel}
        />
        <WinActions
          copied={copied}
          onCopy={handleCopySummary}
          onReviewMap={onReviewMap}
          onPlayAgain={onPlayAgain}
        />
      </div>
    </div>
  );
};
