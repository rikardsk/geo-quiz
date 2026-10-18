import React from 'react';
import { SwedenCountyData, REGION_THEMES } from '../data/countiesData';
import { formatPopulation, formatArea } from '../utils/countiesUtils';
import { MapPin, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, X, Shield, Building2, Users } from 'lucide-react';

export interface TeamCardProps {
  team: SwedenCountyData | null;
  onNextTeam: () => void;
  onPrevTeam: () => void;
  isExplored: boolean;
  onClose?: () => void;
}

const TeamCardEmpty: React.FC = () => (
  <div className="state-card-empty team-card">
    <Shield className="w-12 h-12 text-slate-300 mb-3 animate-bounce" />
    <h3 className="text-lg font-semibold text-slate-700">Välj ett län</h3>
    <p className="text-sm text-slate-500 max-w-xs text-center mt-2 leading-relaxed">
      Klicka på ett län eller en stad på Sverigekartan för att utforska länsfakta, största stad, residensstad och geografi.
    </p>
  </div>
);

const TeamCardHeader: React.FC<{ team: SwedenCountyData; onClose?: () => void }> = ({ team, onClose }) => {
  const theme = REGION_THEMES[team.region] || REGION_THEMES['Svealand'];

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span
          className="w-3.5 h-3.5 rounded-full inline-block shadow-sm"
          style={{ backgroundColor: team.primaryColor }}
        />
        <span className={`text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border ${theme.badge}`}>
          {`${team.region}`}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
          Länsbokstav: {team.letter}
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Stäng länsdetaljer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const TeamTitleSection: React.FC<{ team: SwedenCountyData; isExplored: boolean }> = ({ team, isExplored }) => {
  const isDifferentSeat = team.residenceCity !== team.largestCity;

  return (
    <div className="mb-4">
      <div className="flex items-start gap-3">
        <img
          src={team.coatOfArms}
          alt={team.name}
          className="w-12 h-14 object-contain filter drop-shadow-md flex-shrink-0 mt-0.5"
          style={{ width: '48px', height: '56px', objectFit: 'contain' }}
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{team.name}</span>
            {isExplored && (
              <span title="Utforskad">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              </span>
            )}
          </h2>

          {/* Största stad feature banner */}
          <div className="mt-2 bg-sky-50 border border-sky-200/80 rounded-xl p-2.5">
            <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
              Största stad: <span className="text-slate-900 font-extrabold text-xs">{team.largestCity}</span>
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>{formatPopulation(team.largestCityPopulation)} inv.</span>
              {isDifferentSeat && (
                <span className="text-amber-700 font-medium">
                  (Residensstad: {team.residenceCity})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamStatsGrid: React.FC<{ team: SwedenCountyData }> = ({ team }) => (
  <div className="grid grid-cols-2 gap-2.5 mb-4">
    <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3">
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
        Länsbefolkning
      </span>
      <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
        <Users className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
        {formatPopulation(team.population)} inv.
      </span>
      <span className="text-[10px] text-slate-400 mt-0.5 block">{team.municipalities} kommuner</span>
    </div>
    <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3">
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
        Yta & Residensstad
      </span>
      <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 truncate">
        <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
        {team.residenceCity}
      </span>
      <span className="text-[10px] text-slate-400 mt-0.5 block">{formatArea(team.area)}</span>
    </div>
  </div>
);

const TeamTriviaBox: React.FC<{ team: SwedenCountyData }> = ({ team }) => (
  <div className="mb-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5">
    <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-1.5">
      <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
      Länsfakta & Geografi
    </span>
    <p className="text-xs text-slate-700 leading-relaxed">{team.trivia}</p>
  </div>
);

const TeamCardNav: React.FC<{
  onPrev: () => void;
  onNext: () => void;
}> = ({ onPrev, onNext }) => (
  <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100 shrink-0">
    <button
      onClick={onPrev}
      className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-xl transition-all select-none"
    >
      <ChevronLeft className="w-4 h-4 shrink-0" />
      <span className="leading-none pt-[1px]">Föregående län</span>
    </button>
    <button
      onClick={onNext}
      className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-xl transition-all select-none"
    >
      <span className="leading-none pt-[1px]">Nästa län</span>
      <ChevronRight className="w-4 h-4 shrink-0" />
    </button>
  </div>
);

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  onNextTeam,
  onPrevTeam,
  isExplored,
  onClose,
}) => {
  if (!team) return <TeamCardEmpty />;

  return (
    <div className="team-card h-full max-h-full">
      <div className="flex-1 overflow-y-auto pr-0.5 custom-scrollbar min-h-0 mb-2">
        <TeamCardHeader team={team} onClose={onClose} />
        <TeamTitleSection team={team} isExplored={isExplored} />
        <TeamStatsGrid team={team} />
        <TeamTriviaBox team={team} />
      </div>
      <TeamCardNav onPrev={onPrevTeam} onNext={onNextTeam} />
    </div>
  );
};

export const CountyCard = TeamCard;
