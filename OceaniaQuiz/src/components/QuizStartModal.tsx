import React, { useState } from 'react';
import { QuestionType } from '../utils/quizUtils';
import { MapPin, Landmark, Sparkles, Play, X, Compass, CheckSquare } from 'lucide-react';

export interface QuizStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (mode: 'mixed' | QuestionType) => void;
  initialMode?: 'mixed' | QuestionType;
}

interface ModeOption {
  id: 'state-name' | 'capital' | 'multiple-choice' | 'mixed';
  title: string;
  badge?: string;
  description: string;
  example: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MODES: ModeOption[] = [
  {
    id: 'state-name',
    title: 'Countries Only',
    badge: 'Classic',
    description: 'We give you the country name, you click its location on the map.',
    example: 'e.g. "Find Australia on the map"',
    icon: MapPin,
  },
  {
    id: 'multiple-choice',
    title: 'Identify the Country',
    badge: 'Multiple Choice',
    description: 'A country is highlighted on the map — pick the correct country from 4 choices.',
    example: 'e.g. Which country is highlighted on the map?',
    icon: CheckSquare,
  },
  {
    id: 'capital',
    title: 'Capitals Challenge',
    description: 'Test your knowledge of capitals by finding their corresponding country.',
    example: 'e.g. "Which country has the capital Canberra?"',
    icon: Landmark,
  },
  {
    id: 'mixed',
    title: 'Mixed Mode',
    description: 'A dynamic combination testing country names, capitals, and multiple choice.',
    example: 'Alternates between country names, capitals, and choices',
    icon: Sparkles,
  },
];

const QuizStartHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
    <div>
      <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5 mb-1">
        <Compass className="w-3.5 h-3.5" /> Ready to play?
      </span>
      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Choose Quiz Mode</h2>
      <p className="text-xs text-slate-500 mt-1">Select how you want to challenge your geography knowledge</p>
    </div>
    <button
      onClick={onClose}
      className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
      aria-label="Close"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

const QuizStartModeCard: React.FC<{
  mode: ModeOption;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ mode, isSelected, onSelect }) => {
  const Icon = mode.icon;
  return (
    <div
      onClick={onSelect}
      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
        isSelected
          ? 'border-rose-500 bg-rose-50/70 shadow-sm'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div
        className={`p-3 rounded-xl flex-shrink-0 transition-colors ${
          isSelected ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-slate-900">{mode.title}</h3>
          {mode.badge && (
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 uppercase tracking-wider">
              {mode.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{mode.description}</p>
        <p className="text-[11px] text-slate-400 italic mt-1.5 font-medium">{mode.example}</p>
      </div>
    </div>
  );
};

const QuizStartFooter: React.FC<{
  onCancel: () => void;
  onStart: () => void;
}> = ({ onCancel, onStart }) => (
  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-shrink-0">
    <button onClick={onCancel} className="btn-secondary text-xs px-4 py-2.5">
      Cancel
    </button>
    <button
      onClick={onStart}
      className="btn-primary text-xs px-6 py-2.5"
      autoFocus
    >
      <Play className="w-4 h-4 fill-current" /> Start Challenge
    </button>
  </div>
);

export const QuizStartModal: React.FC<QuizStartModalProps> = ({
  isOpen,
  onClose,
  onStart,
  initialMode = 'state-name',
}) => {
  const [selectedMode, setSelectedMode] = useState<'mixed' | QuestionType>(initialMode);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop select-none" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container quiz-start-container flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <QuizStartHeader onClose={onClose} />
        <div className="py-4 space-y-3 flex-1 overflow-y-auto min-h-0 pr-1">
          {MODES.map((mode) => (
            <QuizStartModeCard
              key={mode.id}
              mode={mode}
              isSelected={selectedMode === mode.id}
              onSelect={() => setSelectedMode(mode.id)}
            />
          ))}
        </div>
        <QuizStartFooter onCancel={onClose} onStart={() => onStart(selectedMode)} />
      </div>
    </div>
  );
};
