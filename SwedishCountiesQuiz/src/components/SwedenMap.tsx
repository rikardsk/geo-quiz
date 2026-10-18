import React, { useState, useMemo } from 'react';
import { SWEDEN_COUNTIES, SwedenCounty } from '../data/swedenMapData';
import {
  SWEDISH_COUNTIES,
  SwedenCountyData,
} from '../data/countiesData';
import { FilterOption } from './DivisionFilter';

interface SwedenMapProps {
  selectedTeam: SwedenCountyData | null;
  onSelectTeam: (county: SwedenCountyData) => void;
  activeFilter?: FilterOption;
  exploredTeams?: Set<string>;
  showCities?: boolean;
  isQuizMode?: boolean;
  targetHighlightTeamId?: string | null;
  disableMapSelection?: boolean;
  quizFeedback?: { teamId: string; status: 'correct' | 'incorrect' | 'revealed' } | null;
  hintDivision?: string | null;
  hintState?: string | null;
  correctTeamIds?: Set<string>;
  revealedTeamIds?: Set<string>;
}

function getMarkerRingColor(
  county: SwedenCountyData,
  feedback: { teamId: string; status: 'correct' | 'incorrect' | 'revealed' } | null,
  isCorrect: boolean,
  isRevealed: boolean,
  isSelected: boolean,
  isTarget: boolean
): string {
  if (feedback?.teamId === county.id) {
    if (feedback.status === 'correct') return '#10b981';
    if (feedback.status === 'revealed') return '#f59e0b';
    return '#ef4444';
  }
  if (isCorrect) return '#10b981';
  if (isRevealed) return '#f59e0b';
  if (isTarget || isSelected) return '#f43f5e';
  return county.primaryColor || '#0284c7';
}

function getCountyFill(
  county: SwedenCounty,
  activeFilter: FilterOption,
  isQuizMode: boolean,
  selectedCounty: SwedenCountyData | null,
  hoveredCountyId: string | null,
  targetHighlightId: string | null,
  correctIds?: Set<string>,
  revealedIds?: Set<string>,
  feedback?: { teamId: string; status: 'correct' | 'incorrect' | 'revealed' } | null,
  hintRegion?: string | null,
  hintState?: string | null
): string {
  const cid = county.id;

  if (feedback?.teamId === cid) {
    if (feedback.status === 'correct') return '#a7f3d0';
    if (feedback.status === 'revealed') return '#fde68a';
    return '#fecaca';
  }

  if (isQuizMode) {
    if (targetHighlightId === cid) return '#fda4af';
    if (correctIds?.has(cid)) return '#bbf7d0';
    if (revealedIds?.has(cid)) return '#fef08a';
    if (hoveredCountyId === cid) return '#e0f2fe';

    if (hintState && (cid === hintState || county.name === hintState)) {
      return '#fef08a';
    }
    if (hintRegion && county.region !== hintRegion) {
      return '#f1f5f9';
    }
  } else {
    if (selectedCounty?.id === cid) return '#fed7aa';
    if (hoveredCountyId === cid) return '#e0f2fe';
  }

  // Regional coloring
  if (activeFilter === 'All') {
    if (county.region === 'Götaland') return '#f0f9ff';
    if (county.region === 'Svealand') return '#fffbeb';
    return '#f0fdf4';
  }
  if (activeFilter === county.region) {
    if (county.region === 'Götaland') return '#dbeafe';
    if (county.region === 'Svealand') return '#fef3c7';
    return '#dcfce7';
  }
  return '#f8fafc';
}

function getCountyBorder(
  county: SwedenCounty,
  activeFilter: FilterOption,
  selectedCounty: SwedenCountyData | null,
  hoveredCountyId: string | null,
  targetHighlightId: string | null,
  correctIds?: Set<string>,
  revealedIds?: Set<string>,
  hintState?: string | null
): string {
  const cid = county.id;
  if (targetHighlightId === cid || selectedCounty?.id === cid) return '#e11d48';
  if (correctIds?.has(cid)) return '#10b981';
  if (revealedIds?.has(cid)) return '#f59e0b';
  if (hoveredCountyId === cid) return '#0284c7';

  if (hintState && (cid === hintState || county.name === hintState)) {
    return '#e11d48';
  }
  if (activeFilter === county.region) {
    if (county.region === 'Götaland') return '#38bdf8';
    if (county.region === 'Svealand') return '#f59e0b';
    return '#4ade80';
  }
  return '#cbd5e1';
}

const PinBadge: React.FC<{ isCorrect: boolean; isRevealed: boolean }> = ({ isCorrect, isRevealed }) => {
  if (isCorrect) {
    return (
      <g transform="translate(10, -10)">
        <circle r={7} fill="#10b981" stroke="#ffffff" strokeWidth={1.5} />
        <path
          d="M-3 0 L-1 2 L3 -2"
          fill="none"
          stroke="#ffffff"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    );
  }
  if (isRevealed) {
    return (
      <g transform="translate(10, -10)">
        <circle r={7} fill="#f59e0b" stroke="#ffffff" strokeWidth={1.5} />
        <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">?</text>
      </g>
    );
  }
  return null;
};

const TargetBeacon: React.FC = () => (
  <circle r={20} fill="#f43f5e" fillOpacity={0.25} stroke="#f43f5e" strokeWidth={2.5} className="animate-ping" />
);

const CityPin: React.FC<{
  county: SwedenCountyData;
  isSelected: boolean;
  isHovered: boolean;
  isCorrect: boolean;
  isRevealed: boolean;
  isTarget: boolean;
  feedback: { teamId: string; status: 'correct' | 'incorrect' | 'revealed' } | null;
  onSelect: (c: SwedenCountyData) => void;
  onHover: (c: SwedenCountyData | null) => void;
}> = ({ county, isSelected, isHovered, isCorrect, isRevealed, isTarget, feedback, onSelect, onHover }) => {
  const ringColor = getMarkerRingColor(county, feedback, isCorrect, isRevealed, isSelected, isTarget);
  const scale = isHovered || isSelected || isTarget ? 1.4 : 1;

  return (
    <g
      transform={`translate(${county.coordinates.x}, ${county.coordinates.y}) scale(${scale})`}
      className="cursor-pointer transition-transform duration-150"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(county);
      }}
      onMouseEnter={() => onHover(county)}
      onMouseLeave={() => onHover(null)}
    >
      {isTarget && <TargetBeacon />}
      <circle
        r={14}
        fill="#ffffff"
        stroke={ringColor}
        strokeWidth={isSelected || isHovered || isCorrect || isTarget ? 3.5 : 2}
        className="filter drop-shadow-md"
      />
      <image
        href={county.coatOfArms}
        x="-9"
        y="-9"
        width="18"
        height="18"
        preserveAspectRatio="xMidYMid meet"
        pointerEvents="none"
      />
      <PinBadge isCorrect={isCorrect} isRevealed={isRevealed} />
      {/* City name text label for top clarity */}
      <text
        y="21"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="#1e293b"
        className="select-none pointer-events-none drop-shadow-sm font-sans"
      >
        {county.largestCity}
      </text>
    </g>
  );
};

const CountyHoverTooltip: React.FC<{ county: SwedenCountyData }> = ({ county }) => (
  <div
    className="absolute z-30 pointer-events-none rounded-lg flex items-center gap-2.5"
    style={{
      left: `${(county.coordinates.x / 500) * 100}%`,
      top: `${(county.coordinates.y / 900) * 100}%`,
      transform: 'translate(-50%, -125%)',
      padding: '6px 10px',
      maxWidth: '220px',
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
    }}
  >
    <img
      src={county.coatOfArms}
      alt=""
      style={{ width: '22px', height: '22px', objectFit: 'contain', flexShrink: 0 }}
    />
    <div className="min-w-0">
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }} className="truncate">
        {county.name} ({county.letter})
      </div>
      <div style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 600, lineHeight: 1.2 }} className="truncate">
        Största stad: {county.largestCity}
      </div>
      {county.residenceCity !== county.largestCity && (
        <div style={{ fontSize: '9px', color: '#cbd5e1', lineHeight: 1.1 }} className="truncate">
          Residensstad: {county.residenceCity}
        </div>
      )}
    </div>
  </div>
);

const QuizStatusMarkers: React.FC<{
  counties: SwedenCountyData[];
  correctTeamIds?: Set<string>;
  revealedTeamIds?: Set<string>;
  targetHighlightTeamId?: string | null;
}> = ({ counties, correctTeamIds, revealedTeamIds, targetHighlightTeamId }) => (
  <g id="quiz-status-markers" pointerEvents="none">
    {counties.map((county) => {
      const isCorrect = Boolean(correctTeamIds?.has(county.id));
      const isRevealed = Boolean(revealedTeamIds?.has(county.id));
      const isTarget = targetHighlightTeamId === county.id;
      if (!isCorrect && !isRevealed && !isTarget) return null;

      return (
        <g key={county.id} transform={`translate(${county.coordinates.x}, ${county.coordinates.y})`}>
          {isTarget && <TargetBeacon />}
          <PinBadge isCorrect={isCorrect} isRevealed={isRevealed} />
        </g>
      );
    })}
  </g>
);

export const SwedenMap: React.FC<SwedenMapProps> = ({
  selectedTeam,
  onSelectTeam,
  activeFilter = 'All',
  showCities = true,
  isQuizMode = false,
  targetHighlightTeamId = null,
  disableMapSelection = false,
  quizFeedback = null,
  hintDivision = null,
  hintState = null,
  correctTeamIds,
  revealedTeamIds,
}) => {
  const [hoveredCounty, setHoveredCounty] = useState<SwedenCountyData | null>(null);

  const countyMap = useMemo(() => {
    const map = new Map<string, SwedenCountyData>();
    SWEDISH_COUNTIES.forEach((c) => map.set(c.id, c));
    return map;
  }, []);

  const effectiveFilter: FilterOption = isQuizMode ? 'All' : activeFilter;
  const effectiveSelectedCounty = isQuizMode ? null : selectedTeam;

  const isCountyFilteredOut = (county: SwedenCountyData): boolean => {
    if (isQuizMode) {
      if (hintDivision && county.region !== hintDivision) return true;
      return false;
    }
    if (effectiveFilter === 'All') return false;
    return county.region !== effectiveFilter;
  };

  const orderedCounties = useMemo(() => {
    if (!targetHighlightTeamId) return SWEDISH_COUNTIES;
    return [...SWEDISH_COUNTIES].sort((a, b) => {
      if (a.id === targetHighlightTeamId) return 1;
      if (b.id === targetHighlightTeamId) return -1;
      return 0;
    });
  }, [targetHighlightTeamId]);

  return (
    <div className="relative w-full aspect-[500/900] max-h-[820px] mx-auto bg-sky-50/20 rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-2 flex items-center justify-center">
      <svg
        viewBox="0 0 500 900"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="counties">
          {SWEDEN_COUNTIES.map((geoCounty) => {
            const data = countyMap.get(geoCounty.id);
            const isHovered = hoveredCounty?.id === geoCounty.id;
            const isSelected = effectiveSelectedCounty?.id === geoCounty.id;
            const strokeWidth = isSelected || isHovered ? 2 : 0.9;

            return (
              <path
                key={geoCounty.id}
                d={geoCounty.d}
                fill={getCountyFill(
                  geoCounty,
                  effectiveFilter,
                  isQuizMode,
                  effectiveSelectedCounty,
                  hoveredCounty?.id || null,
                  targetHighlightTeamId,
                  correctTeamIds,
                  revealedTeamIds,
                  quizFeedback,
                  hintDivision,
                  hintState
                )}
                stroke={getCountyBorder(
                  geoCounty,
                  effectiveFilter,
                  effectiveSelectedCounty,
                  hoveredCounty?.id || null,
                  targetHighlightTeamId,
                  correctTeamIds,
                  revealedTeamIds,
                  hintState
                )}
                strokeWidth={strokeWidth}
                className={`transition-colors duration-150 ${disableMapSelection ? 'cursor-default' : 'cursor-pointer'}`}
                onClick={() => {
                  if (data && !disableMapSelection) {
                    onSelectTeam(data);
                  }
                }}
                onMouseEnter={() => {
                  if (data && !disableMapSelection) setHoveredCounty(data);
                }}
                onMouseLeave={() => {
                  setHoveredCounty(null);
                }}
              />
            );
          })}
        </g>

        {showCities && !isQuizMode && (
          <g id="largest-city-pins">
            {orderedCounties.map((county) => {
              if (isCountyFilteredOut(county)) return null;

              return (
                <CityPin
                  key={county.id}
                  county={county}
                  isSelected={selectedTeam?.id === county.id}
                  isHovered={hoveredCounty?.id === county.id}
                  isCorrect={Boolean(correctTeamIds?.has(county.id))}
                  isRevealed={Boolean(revealedTeamIds?.has(county.id))}
                  isTarget={targetHighlightTeamId === county.id}
                  feedback={quizFeedback}
                  onSelect={(c) => {
                    if (!disableMapSelection) onSelectTeam(c);
                  }}
                  onHover={(c) => {
                    setHoveredCounty(c);
                  }}
                />
              );
            })}
          </g>
        )}

        {isQuizMode && (
          <QuizStatusMarkers
            counties={orderedCounties}
            correctTeamIds={correctTeamIds}
            revealedTeamIds={revealedTeamIds}
            targetHighlightTeamId={targetHighlightTeamId}
          />
        )}
      </svg>

      {!isQuizMode && hoveredCounty && <CountyHoverTooltip county={hoveredCounty} />}
    </div>
  );
};

export const USMap = SwedenMap;
