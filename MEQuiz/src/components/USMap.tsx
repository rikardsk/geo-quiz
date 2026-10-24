import React, { useState } from 'react';
import {
  US_STATES,
  BACKGROUND_PATHS,
  UAE_BACKGROUND_PATHS,
  UAE_EMIRATES,
  USState,
  UAEEmirate,
} from '../data/statesData';

export type MapViewType = 'middle-east' | 'uae-emirates';

interface USMapProps {
  mapView?: MapViewType;
  onToggleMapView?: () => void;
  selectedState: USState | null;
  onSelectState: (state: USState) => void;
  highlightedRegion?: string;
  exploredStates: Set<string>;
  exploredEmirates?: Set<string>;
  showAllCapitals?: boolean;
  showUnexploredOnly?: boolean;
  isQuizMode?: boolean;
  targetHighlightStateId?: string | null;
  disableMapSelection?: boolean;
  quizFeedback?: { stateId: string; status: 'correct' | 'incorrect' | 'revealed' } | null;
  hintRegion?: string | null;
  correctStateIds?: Set<string>;
  revealedStateIds?: Set<string>;
  selectedEmirate?: UAEEmirate | null;
  onSelectEmirate?: (emirate: UAEEmirate) => void;
}

export const USMap: React.FC<USMapProps> = ({
  mapView = 'middle-east',
  onToggleMapView,
  selectedState,
  onSelectState,
  highlightedRegion = 'All',
  exploredStates,
  exploredEmirates,
  showAllCapitals = false,
  showUnexploredOnly = false,
  isQuizMode = false,
  targetHighlightStateId = null,
  disableMapSelection = false,
  quizFeedback = null,
  hintRegion = null,
  correctStateIds,
  revealedStateIds,
  selectedEmirate,
  onSelectEmirate,
}) => {
  const [hoveredState, setHoveredState] = useState<USState | null>(null);
  const [hoveredEmirate, setHoveredEmirate] = useState<UAEEmirate | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const isUAEMap = mapView === 'uae-emirates';

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

  const getEmirateFill = (emirate: UAEEmirate) => {
    if (selectedEmirate?.id === emirate.id) return '#f43f5e';
    if (hoveredEmirate?.id === emirate.id) return '#fb7185';
    if (showUnexploredOnly && exploredEmirates?.has(emirate.id)) return '#e2e8f0';
    return emirate.color;
  };

  const getEmirateOpacity = (emirate: UAEEmirate) => {
    if (showUnexploredOnly && exploredEmirates?.has(emirate.id) && selectedEmirate?.id !== emirate.id) {
      return 0.35;
    }
    return 1;
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

  const renderCapitalBadge = (item: USState) => {
    const { x, y } = item.capitalCoordinates;
    if (!x || !y) return null;

    const labelText = `★ ${item.capital}`;
    const badgeWidth = Math.max(75, labelText.length * 6.8 + 16);
    const rectX = x > 780 ? x - badgeWidth - 10 : x + 10;
    const rectY = y < 35 ? y + 8 : y - 11;

    return (
      <g key={`capital-badge-${item.id}`} className="pointer-events-none select-none">
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
      {/* Single Map Toggle Button */}
      {!isQuizMode && onToggleMapView && (
        <div
          className={`absolute top-3 z-10 ${isUAEMap ? 'left-3' : 'right-3'}`}
          style={{ top: '12px', ...(isUAEMap ? { left: '12px' } : { right: '12px' }) }}
        >
          <button
            type="button"
            onClick={onToggleMapView}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white text-slate-800 text-xs font-bold rounded-lg shadow-md border border-slate-200 hover:border-slate-300 transition-all cursor-pointer backdrop-blur-sm"
            title={isUAEMap ? 'Switch to Middle East Map' : 'Switch to UAE Emirates Map'}
          >
            {isUAEMap ? (
              <>
                <span>←</span>
                <span>Back to Middle East Map</span>
              </>
            ) : (
              <>
                <span>🇦🇪 View UAE Emirates Map</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      )}

      <svg
        viewBox="0 0 959 593"
        className="w-full h-auto drop-shadow-md rounded-2xl bg-slate-50 border border-slate-200"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredState(null);
          setHoveredEmirate(null);
        }}
        role="img"
        aria-label={isUAEMap ? 'Interactive Map of the UAE Emirates' : 'Interactive Map of the Middle East'}
      >
        {/* ======================================================== */}
        {/* UAE EMIRATES FULL MAP VIEW                                */}
        {/* ======================================================== */}
        {isUAEMap ? (
          <>
            {/* Background neighboring countries */}
            <g id="uae-background-countries-layer" className="pointer-events-none select-none">
              {UAE_BACKGROUND_PATHS.map((bg) => (
                <path
                  key={`uae-bg-${bg.id}`}
                  d={bg.d}
                  fill="#f1f5f9"
                  stroke="#cbd5e1"
                  strokeWidth="0.75"
                />
              ))}
              {/* Geographic references in surrounding background */}
              <text x="440" y="90" fill="#94a3b8" fontSize="13" fontWeight="700" letterSpacing="0.1em" fontStyle="italic" textAnchor="middle">
                ARABIAN GULF
              </text>
              <text x="865" y="240" fill="#94a3b8" fontSize="11" fontWeight="700" letterSpacing="0.08em" fontStyle="italic" textAnchor="middle">
                Gulf of Oman
              </text>
              <text x="210" y="470" fill="#94a3b8" fontSize="13" fontWeight="700" letterSpacing="0.06em">
                SAUDI ARABIA
              </text>
              <text x="830" y="420" fill="#94a3b8" fontSize="13" fontWeight="700" letterSpacing="0.06em">
                OMAN
              </text>
              <text x="765" y="45" fill="#94a3b8" fontSize="9" fontWeight="600" textAnchor="middle">
                Musandam (OM)
              </text>
              <text x="85" y="160" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">
                QATAR
              </text>
            </g>

            {/* 7 Emirates Layer */}
            <g id="uae-emirates-layer">
              {UAE_EMIRATES.map((emirate) => (
                <path
                  key={emirate.id}
                  d={emirate.d}
                  fill={getEmirateFill(emirate)}
                  opacity={getEmirateOpacity(emirate)}
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                  className="cursor-pointer transition-colors duration-150 ease-out"
                  onClick={() => onSelectEmirate?.(emirate)}
                  onMouseEnter={() => setHoveredEmirate(emirate)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${emirate.name}, Capital: ${emirate.capital}`}
                >
                  <title>{`${emirate.name} (${emirate.id}) - Capital: ${emirate.capital}`}</title>
                </path>
              ))}
            </g>

            {/* Prominent Emirate Name Labels on Map */}
            <g id="emirates-labels-layer" className="pointer-events-none select-none">
              <text x="495" y="290" textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="800">
                Abu Dhabi
              </text>
              <text x="665" y="178" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">
                Dubai
              </text>
              <text x="725" y="165" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">
                Sharjah
              </text>
              <text x="660" y="130" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="700">
                Ajman
              </text>
              <text x="705" y="112" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="700">
                Umm Al Quwain
              </text>
              <text x="755" y="65" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">
                Ras Al Khaimah
              </text>
              <text x="815" y="195" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">
                Fujairah
              </text>
            </g>

            {/* Selected Emirate Capital Badge */}
            {selectedEmirate && renderCapitalBadge(selectedEmirate)}

            {/* Show All Capitals dots for Emirates */}
            {showAllCapitals &&
              UAE_EMIRATES.filter((em) => em.id !== selectedEmirate?.id).map((em) => (
                <circle
                  key={`dot-em-${em.id}`}
                  cx={em.capitalCoordinates.x}
                  cy={em.capitalCoordinates.y}
                  r="3.5"
                  fill="#0f172a"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  opacity="0.8"
                  className="cursor-pointer"
                  onClick={() => onSelectEmirate?.(em)}
                />
              ))}
          </>
        ) : (
          /* ======================================================== */
          /* MIDDLE EAST FULL MAP VIEW                                */
          /* ======================================================== */
          <>
            {/* Background countries layer */}
            <g id="background-countries-layer" className="pointer-events-none select-none">
              {BACKGROUND_PATHS.map((bg) => (
                <path
                  key={`bg-${bg.id}`}
                  d={bg.d}
                  fill="#f1f5f9"
                  stroke="#cbd5e1"
                  strokeWidth="0.75"
                />
              ))}
            </g>

            {/* Middle East countries layer */}
            <g id="countries-layer">
              {US_STATES.map((state) => (
                <path
                  key={state.id}
                  d={state.d}
                  fill={getStateFill(state)}
                  opacity={getStateOpacity(state)}
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
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

            {/* Small islands/territories prominent targets (e.g. Bahrain) */}
            {US_STATES.filter((s) => s.isSmallIsland).map((s) => (
              <circle
                key={`island-target-${s.id}`}
                cx={s.capitalCoordinates.x}
                cy={s.capitalCoordinates.y}
                r="6"
                fill={getStateFill(s)}
                opacity={getStateOpacity(s)}
                stroke="#ffffff"
                strokeWidth="1.5"
                className={`${disableMapSelection ? 'cursor-default' : 'cursor-pointer'} transition-colors duration-150 ease-out`}
                onClick={() => {
                  if (!disableMapSelection) onSelectState(s);
                }}
                onMouseEnter={() => {
                  if (!disableMapSelection) setHoveredState(s);
                }}
                tabIndex={disableMapSelection ? -1 : 0}
                role={disableMapSelection ? undefined : 'button'}
                aria-label={isQuizMode ? 'Country' : `${s.name}, Capital: ${s.capital}`}
              >
                {!isQuizMode && <title>{`${s.name} (${s.id}) - Capital: ${s.capital}`}</title>}
              </circle>
            ))}

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
          </>
        )}
      </svg>

      {/* Tooltip for Country or Emirate */}
      {!disableMapSelection && (hoveredEmirate || hoveredState) && (
        <div
          className="pointer-events-none absolute z-20 px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium text-white bg-slate-900/90 backdrop-blur-sm transform -translate-x-1/2 -translate-y-12 transition-all duration-75"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          {hoveredEmirate ? (
            <>
              <p className="font-bold text-amber-300">🇦🇪 {hoveredEmirate.name} (Emirate)</p>
              <p className="text-slate-300">Capital: {hoveredEmirate.capital}</p>
              <p className="text-[10px] text-slate-400 italic">{hoveredEmirate.nickname}</p>
              {exploredEmirates && exploredEmirates.has(hoveredEmirate.id) ? (
                <span className="text-[10px] text-emerald-300">✓ Explored</span>
              ) : (
                <span className="text-[10px] text-amber-300">★ Left to explore</span>
              )}
            </>
          ) : isQuizMode ? (
            <p className="font-semibold text-rose-300">Click to choose country</p>
          ) : (
            <>
              <p className="font-bold">{hoveredState?.name}</p>
              <p className="text-slate-300">Capital: {hoveredState?.capital}</p>
              {hoveredState && exploredStates.has(hoveredState.id) ? (
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
