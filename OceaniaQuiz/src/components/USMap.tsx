import React, { useState } from 'react';
import { US_STATES, BACKGROUND_PATHS, BORDER_PATHS, SEPARATOR_PATH, USState } from '../data/statesData';

interface USMapProps {
  selectedState: USState | null;
  onSelectState: (state: USState) => void;
  highlightedRegion?: string;
  exploredStates: Set<string>;
  showAllCapitals?: boolean;
  showUnexploredOnly?: boolean;
  isQuizMode?: boolean;
  targetHighlightStateId?: string | null;
  disableMapSelection?: boolean;
  quizFeedback?: { stateId: string; status: 'correct' | 'incorrect' | 'revealed' } | null;
  hintRegion?: string | null;
  correctStateIds?: Set<string>;
  revealedStateIds?: Set<string>;
}

export const USMap: React.FC<USMapProps> = ({
  selectedState,
  onSelectState,
  highlightedRegion = 'All',
  exploredStates,
  showAllCapitals = false,
  showUnexploredOnly = false,
  isQuizMode = false,
  targetHighlightStateId = null,
  disableMapSelection = false,
  quizFeedback = null,
  hintRegion = null,
  correctStateIds,
  revealedStateIds,
}) => {
  const [hoveredState, setHoveredState] = useState<USState | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const getStateFill = (state: USState) => {
    if (quizFeedback?.stateId === state.id) {
      if (quizFeedback.status === 'correct') return '#10b981';
      if (quizFeedback.status === 'revealed') return '#f59e0b';
      return '#ef4444';
    }
    if (isQuizMode && targetHighlightStateId === state.id) return '#f43f5e';
    if (isQuizMode && correctStateIds?.has(state.id)) return '#a7f3d0';
    if (isQuizMode && revealedStateIds?.has(state.id)) return '#fde68a';
    if (!isQuizMode && selectedState?.id === state.id) return '#f43f5e';
    if (!disableMapSelection && hoveredState?.id === state.id) return isQuizMode ? '#fda4af' : '#fb7185';
    if (!isQuizMode && showUnexploredOnly && exploredStates.has(state.id)) return '#e2e8f0';

    const targetRegion = hintRegion || (highlightedRegion !== 'All' ? highlightedRegion : null);
    if (targetRegion && state.region !== targetRegion) return '#e2e8f0';

    return state.color;
  };

  const getStateOpacity = (state: USState) => {
    if (!isQuizMode && showUnexploredOnly && exploredStates.has(state.id) && selectedState?.id !== state.id) {
      return 0.35;
    }
    const targetRegion = hintRegion || (highlightedRegion !== 'All' ? highlightedRegion : null);
    if (!targetRegion || state.region === targetRegion) return 1;
    return 0.35;
  };

  const renderCorrectBadge = (state: USState) => {
    const { x, y } = state.capitalCoordinates;
    if (!x || !y) return null;

    return (
      <g key={`solved-badge-${state.id}`} className="pointer-events-none select-none">
        <circle cx={x} cy={y} r="6.5" fill="#ffffff" opacity="0.9" />
        <circle cx={x} cy={y} r="5.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.2" />
        <path
          d={`M ${x - 2.5} ${y - 0.2} L ${x - 0.7} ${y + 1.8} L ${x + 2.5} ${y - 1.8}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    );
  };

  const renderRevealedBadge = (state: USState) => {
    const { x, y } = state.capitalCoordinates;
    if (!x || !y) return null;

    return (
      <g key={`revealed-badge-${state.id}`} className="pointer-events-none select-none">
        <circle cx={x} cy={y} r="6.5" fill="#ffffff" opacity="0.9" />
        <circle cx={x} cy={y} r="5.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.2" />
        <text x={x} y={y + 3} textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
          ?
        </text>
      </g>
    );
  };

  const renderTargetBeacon = (state: USState) => {
    const { x, y } = state.capitalCoordinates;
    if (!x || !y) return null;

    return (
      <g key={`target-beacon-${state.id}`} className="pointer-events-none select-none">
        <circle cx={x} cy={y} r="16" fill="#f43f5e" opacity="0.4" className="animate-ping" />
        <circle cx={x} cy={y} r="7" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
        <circle cx={x} cy={y} r="2.5" fill="#ffffff" />
      </g>
    );
  };

  const renderRevealedBeacon = (state: USState) => {
    const { x, y } = state.capitalCoordinates;
    if (!x || !y) return null;

    return (
      <g key={`revealed-beacon-${state.id}`} className="pointer-events-none select-none">
        <circle cx={x} cy={y} r="18" fill="#f59e0b" opacity="0.4" className="animate-ping" />
        <circle cx={x} cy={y} r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
        <rect
          x={x - state.name.length * 4.2}
          y={y - 24}
          width={state.name.length * 8.4}
          height="18"
          rx="5"
          fill="#0f172a"
          opacity="0.92"
        />
        <text x={x} y={y - 12} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
          {state.name}
        </text>
      </g>
    );
  };

  const renderCapitalBadge = (state: USState) => {
    const { x, y } = state.capitalCoordinates;
    if (!x || !y) return null;

    const labelText = `★ ${state.capital}`;
    const badgeWidth = Math.max(75, labelText.length * 6.8 + 16);
    const rectX = x > 780 ? x - badgeWidth - 10 : x + 10;
    const rectY = y < 35 ? y + 8 : y - 11;

    return (
      <g key={`capital-badge-${state.id}`} className="pointer-events-none select-none">
        <circle cx={x} cy={y} r="11" fill="none" stroke="#f43f5e" strokeWidth="1.5" className="animate-ping" opacity="0.7" />
        <circle cx={x} cy={y} r="5.5" fill="#0f172a" stroke="#ffffff" strokeWidth="1.8" />
        <circle cx={x} cy={y} r="2" fill="#f43f5e" />
        <rect x={rectX} y={rectY} width={badgeWidth} height="20" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="1" opacity="0.95" />
        <text x={rectX + 8} y={rectY + 14} fill="#ffffff" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">
          {labelText}
        </text>
      </g>
    );
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto select-none">
      <svg
        viewBox="0 0 959 593"
        className="w-full h-auto drop-shadow-md rounded-2xl bg-slate-50 border border-slate-200"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredState(null)}
        role="img"
        aria-label="Interactive Map of South East Asia & Oceania"
      >
        {/* Background landmasses (surrounding China, India, Japan, Pacific territories) */}
        <g id="background-layer" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8" strokeLinejoin="round" pointerEvents="none">
          {BACKGROUND_PATHS.map((bg) => (
            <path key={bg.id} d={bg.d} />
          ))}
        </g>

        {/* Countries Layer */}
        <g id="states-layer">
          {US_STATES.map((state) => (
            <path
              key={state.id}
              d={state.d}
              fill={getStateFill(state)}
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeLinejoin="round"
              opacity={getStateOpacity(state)}
              className={`${disableMapSelection ? 'cursor-default' : 'cursor-pointer'} transition-colors duration-150 ease-out`}
              onClick={() => {
                if (!disableMapSelection) onSelectState(state);
              }}
              onMouseEnter={() => {
                if (!disableMapSelection) setHoveredState(state);
              }}
              tabIndex={disableMapSelection ? -1 : 0}
              role={disableMapSelection ? undefined : 'button'}
              aria-label={isQuizMode ? 'Country' : `${state.name}, Capital: ${state.capital}`}
            >
              {!isQuizMode && <title>{`${state.name} (${state.id}) - Capital: ${state.capital}`}</title>}
            </path>
          ))}
        </g>

        {/* Borders layer */}
        <g id="borders-layer" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 3" strokeLinejoin="round" pointerEvents="none">
          {BORDER_PATHS.map((border) => (
            <path key={border.id} d={border.d} />
          ))}
        </g>

        {SEPARATOR_PATH && (
          <path d={SEPARATOR_PATH} fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
        )}

        {/* Island markers for small island/city nations (Singapore, Brunei, Pacific island states) */}
        {US_STATES.filter((s) => s.isSmallIsland).map((island) => {
          const isSelected = selectedState?.id === island.id;
          const isTarget = isQuizMode && targetHighlightStateId === island.id;
          const isHovered = hoveredState?.id === island.id;
          const isSolved = isQuizMode && correctStateIds?.has(island.id);
          const isRevealed = isQuizMode && revealedStateIds?.has(island.id);
          const fillColor = isSolved
            ? '#a7f3d0'
            : isRevealed
            ? '#fde68a'
            : isTarget || isSelected
            ? '#f43f5e'
            : isHovered
            ? '#fb7185'
            : island.color;

          return (
            <g
              key={`island-marker-${island.id}`}
              className={`${disableMapSelection ? 'cursor-default' : 'cursor-pointer'} transition-transform`}
              onClick={() => {
                if (!disableMapSelection) onSelectState(island);
              }}
              onMouseEnter={() => {
                if (!disableMapSelection) setHoveredState(island);
              }}
            >
              <circle
                cx={island.capitalCoordinates.x}
                cy={island.capitalCoordinates.y}
                r="8"
                fill={fillColor}
                stroke="#ffffff"
                strokeWidth="2"
                className="shadow-sm"
              />
              <circle
                cx={island.capitalCoordinates.x}
                cy={island.capitalCoordinates.y}
                r="3"
                fill="#ffffff"
              />
              {!isQuizMode && <title>{`${island.name} - Capital: ${island.capital}`}</title>}
            </g>
          );
        })}

        {!isQuizMode && selectedState && renderCapitalBadge(selectedState)}

        {/* Badges for countries in Quiz Mode */}
        {isQuizMode && (
          <g id="solved-badges-layer">
            {correctStateIds && US_STATES.filter((s) => correctStateIds.has(s.id)).map(renderCorrectBadge)}
            {revealedStateIds && US_STATES.filter((s) => revealedStateIds.has(s.id)).map(renderRevealedBadge)}
          </g>
        )}

        {isQuizMode && targetHighlightStateId && !quizFeedback && (() => {
          const state = US_STATES.find((s) => s.id === targetHighlightStateId);
          return state ? renderTargetBeacon(state) : null;
        })()}

        {isQuizMode && quizFeedback?.status === 'revealed' && (() => {
          const state = US_STATES.find((s) => s.id === quizFeedback.stateId);
          return state ? renderRevealedBeacon(state) : null;
        })()}

        {showAllCapitals &&
          US_STATES.filter((s) => s.id !== selectedState?.id).map((s) => (
            <circle
              key={`dot-${s.id}`}
              cx={s.capitalCoordinates.x}
              cy={s.capitalCoordinates.y}
              r="2.5"
              fill="#0f172a"
              stroke="#ffffff"
              strokeWidth="1"
              opacity="0.75"
              className={`${disableMapSelection ? 'pointer-events-none' : 'cursor-pointer'}`}
              onClick={() => !disableMapSelection && onSelectState(s)}
            />
          ))}
      </svg>

      {!disableMapSelection && hoveredState && (
        <div
          className="pointer-events-none absolute z-20 px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium text-white bg-slate-900/90 backdrop-blur-sm transform -translate-x-1/2 -translate-y-12 transition-all duration-75"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          {isQuizMode ? (
            <p className="font-semibold text-rose-300">Click to choose country</p>
          ) : (
            <>
              <p className="font-bold">{hoveredState.name}</p>
              <p className="text-slate-300">Capital: {hoveredState.capital}</p>
              {exploredStates.has(hoveredState.id) ? (
                <span className="text-[10px] text-emerald-300">✓ Explored</span>
              ) : (
                <span className="text-[10px] text-amber-300">★ Left to explore</span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
