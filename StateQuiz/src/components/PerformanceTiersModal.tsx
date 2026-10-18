import React from 'react';
import { PERFORMANCE_TIERS, PerformanceTier } from '../utils/quizUtils';
import { Trophy, X } from 'lucide-react';

interface PerformanceTiersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGrade?: 'S' | 'A' | 'B' | 'C' | 'D';
}

const TiersHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
    <div>
      <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
        <Trophy className="w-3.5 h-3.5" /> Performance Ranking Guide
      </span>
      <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">Quiz Score Tiers</h2>
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

const TierRow: React.FC<{ tier: PerformanceTier; isCurrent: boolean }> = ({ tier, isCurrent }) => (
  <div
    className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
      isCurrent
        ? 'border-rose-400 bg-rose-50/70 shadow-sm ring-2 ring-rose-200'
        : 'border-slate-200 bg-white hover:border-slate-300'
    }`}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-sm"
      style={{ backgroundColor: tier.color }}
    >
      {tier.grade}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{tier.badgeEmoji}</span>
          <h3 className="text-sm font-bold text-slate-900">{tier.title}</h3>
        </div>
        <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
          {tier.thresholdLabel}
        </span>
      </div>
      <p className="text-xs text-slate-600 mt-0.5">{tier.description}</p>
      {isCurrent && (
        <span className="inline-block mt-1 text-[10px] font-bold text-rose-600 uppercase tracking-wide">
          ★ Your Current Rank
        </span>
      )}
    </div>
  </div>
);

export const PerformanceTiersModal: React.FC<PerformanceTiersModalProps> = ({
  isOpen,
  onClose,
  currentGrade,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop select-none" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container quiz-tiers-container" onClick={(e) => e.stopPropagation()}>
        <TiersHeader onClose={onClose} />
        <div className="py-3 space-y-2.5 flex-1 overflow-y-auto">
          {PERFORMANCE_TIERS.map((tier) => (
            <TierRow key={tier.grade} tier={tier} isCurrent={tier.grade === currentGrade} />
          ))}
        </div>
        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="btn-primary text-xs px-5 py-2">
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
