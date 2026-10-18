import { useState, useMemo, useEffect, useRef } from 'react';
import { SwedenCountyData, SWEDISH_COUNTIES } from './data/countiesData';
import { SwedenMap } from './components/SwedenMap';
import { TeamCard } from './components/TeamCard';
import { FilteredTeamsList } from './components/FilteredTeamsList';
import { Header } from './components/Header';
import { DivisionFilter, FilterOption } from './components/DivisionFilter';
import { TeamsModal } from './components/TeamsModal';
import { QuizPanel } from './components/QuizPanel';
import { QuizStartModal } from './components/QuizStartModal';
import { QuizHeader } from './components/QuizHeader';
import { QuizQuestionBanner, QuizMultipleChoicePanel } from './components/QuizQuestionBanner';
import { QuizToast } from './components/QuizToast';
import { QuizWinModal } from './components/QuizWinModal';
import { QuizBottomProgressBar } from './components/QuizBottomProgressBar';
import { ExploreBottomProgressBar } from './components/ExploreBottomProgressBar';
import { PerformanceTiersModal } from './components/PerformanceTiersModal';
import { ResourcesModal } from './components/ResourcesModal';
import { COUNTIES_STANDINGS_URL } from './data/countiesResourcesData';
import {
  generateQuestion,
  evaluateAnswer,
  calculateNewStreak,
  calculateQuizRank,
  QuizQuestion,
  QuestionType,
} from './utils/quizUtils';
import {
  searchCounties,
  getCountyByName,
  filterCountiesByRegion,
} from './utils/countiesUtils';
import { LayoutGrid, Compass, Target, Globe, BarChart2, ExternalLink, MapPin } from 'lucide-react';

function useSyncPanelHeight(
  ref: React.RefObject<HTMLDivElement | null>,
  deps: unknown[]
): number | undefined {
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const updateHeight = () => {
      if (window.innerWidth < 1024) {
        setHeight(undefined);
        return;
      }
      const h = el.offsetHeight;
      if (h > 0) setHeight(h);
    };

    updateHeight();
    const frameId = requestAnimationFrame(updateHeight);
    window.addEventListener('resize', updateHeight);

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', updateHeight);
      };
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, deps);

  return height;
}

export function App() {
  const [appMode, setAppMode] = useState<'explore' | 'quiz'>('explore');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [selectedTeam, setSelectedTeam] = useState<SwedenCountyData | null>(null);
  const [exploredTeams, setExploredTeams] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTeamsModalOpen, setIsTeamsModalOpen] = useState<boolean>(false);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState<boolean>(false);
  const [isQuizStartModalOpen, setIsQuizStartModalOpen] = useState<boolean>(false);
  const [isQuizWinModalOpen, setIsQuizWinModalOpen] = useState<boolean>(false);
  const [isTiersModalOpen, setIsTiersModalOpen] = useState<boolean>(false);
  const [showCities, setShowCities] = useState<boolean>(true);
  const leftColRef = useRef<HTMLDivElement>(null);

  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizBestStreak, setQuizBestStreak] = useState(0);
  const [lastStatus, setLastStatus] = useState<'idle' | 'correct' | 'incorrect' | 'revealed'>('idle');
  const [lastAnsweredTeam, setLastAnsweredTeam] = useState<SwedenCountyData | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{ teamId: string; status: 'correct' | 'incorrect' | 'revealed' } | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [questionTypeMode, setQuestionTypeMode] = useState<'mixed' | QuestionType>('county-name');
  const [quizSolvedTeams, setQuizSolvedTeams] = useState<Set<string>>(new Set());
  const [quizRevealedTeams, setQuizRevealedTeams] = useState<Set<string>>(new Set());
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const solvedTeamIdsRef = useRef<Set<string>>(new Set());
  const revealedTeamIdsRef = useRef<Set<string>>(new Set());
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visibleTeams = useMemo(() => {
    if (activeFilter === 'All') return SWEDISH_COUNTIES;
    return filterCountiesByRegion(activeFilter);
  }, [activeFilter]);

  const exploredInVisibleCount = useMemo(() => {
    return visibleTeams.filter((t) => exploredTeams.has(t.id)).length;
  }, [visibleTeams, exploredTeams]);

  const isQuizComplete = quizSolvedTeams.size + quizRevealedTeams.size >= SWEDISH_COUNTIES.length;
  const isMultipleChoice = Boolean(
    appMode === 'quiz' && currentQuestion?.choices && currentQuestion.choices.length > 0
  );
  const currentRank = useMemo(() => calculateQuizRank(quizScore, quizTotal), [quizScore, quizTotal]);
  const panelHeight = useSyncPanelHeight(leftColRef, [
    appMode,
    currentQuestion,
    selectedTeam,
    activeFilter,
    visibleTeams.length,
  ]);

  useEffect(() => {
    if (appMode === 'quiz' && !currentQuestion) {
      setCurrentQuestion(generateQuestion(questionTypeMode));
    }
  }, [appMode, currentQuestion, questionTypeMode]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchCounties(searchQuery);
  }, [searchQuery]);

  const handleSelectFilter = (filter: FilterOption) => {
    setActiveFilter(filter);
    setSelectedTeam(null);
  };

  const handleSelectTeam = (county: SwedenCountyData) => {
    if (appMode === 'explore') {
      setSelectedTeam(county);
      setExploredTeams((prev) => new Set([...prev, county.id]));
      return;
    }
    if (isMultipleChoice) return;
    handleQuizAnswer(county);
  };

  const advanceQuestion = (overrideSolvedIds?: string[], avoidId?: string) => {
    const solved = overrideSolvedIds ?? Array.from(new Set([...solvedTeamIdsRef.current, ...revealedTeamIdsRef.current]));
    if (solved.length >= SWEDISH_COUNTIES.length) {
      setIsQuizWinModalOpen(true);
      return;
    }
    setHintUsed(false);
    const exclude = avoidId ? Array.from(new Set([...solved, avoidId])) : solved;
    const nextQ = generateQuestion(questionTypeMode, exclude);
    setCurrentQuestion(nextQ.targetCounty ? nextQ : generateQuestion(questionTypeMode, solved));
  };

  const handleCorrectAnswer = (target: SwedenCountyData) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setIsRevealing(true);
    setQuizScore((prev) => prev + 1);
    setQuizTotal((prev) => prev + 1);
    setQuizStreak((prev) => {
      const next = calculateNewStreak(prev, true);
      setQuizBestStreak((b) => Math.max(b, next));
      return next;
    });
    setLastStatus('correct');
    solvedTeamIdsRef.current.add(target.id);
    setQuizSolvedTeams(new Set(solvedTeamIdsRef.current));
    setQuizFeedback({ teamId: target.id, status: 'correct' });

    const allSolved = Array.from(new Set([...solvedTeamIdsRef.current, ...revealedTeamIdsRef.current]));
    toastTimeoutRef.current = setTimeout(() => {
      setQuizFeedback(null);
      setLastStatus('idle');
      setIsRevealing(false);
      advanceQuestion(allSolved);
    }, 750);
  };

  const handleIncorrectAnswer = (chosen: SwedenCountyData) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setQuizTotal((prev) => prev + 1);
    setQuizStreak(0);
    setLastAnsweredTeam(chosen);
    setLastStatus('incorrect');
    setQuizFeedback({ teamId: chosen.id, status: 'incorrect' });

    toastTimeoutRef.current = setTimeout(() => {
      setQuizFeedback(null);
      setLastStatus('idle');
      setLastAnsweredTeam(null);
    }, 1600);
  };

  const handleQuizAnswer = (county: SwedenCountyData) => {
    if (isRevealing || !currentQuestion || isQuizComplete) return;

    const target = currentQuestion.targetCounty || currentQuestion.targetTeam;
    if (!target) return;

    const isCorrect = evaluateAnswer(county.id, target.id);
    if (isCorrect) {
      handleCorrectAnswer(target);
      return;
    }
    handleIncorrectAnswer(county);
  };

  const handleNextTeam = () => {
    const pool = visibleTeams.length > 0 ? visibleTeams : SWEDISH_COUNTIES;
    if (!selectedTeam) {
      setSelectedTeam(pool[0]);
      return;
    }
    const idx = pool.findIndex((t) => t.id === selectedTeam.id);
    const nextIdx = (idx + 1) % pool.length;
    setSelectedTeam(pool[nextIdx]);
  };

  const handlePrevTeam = () => {
    const pool = visibleTeams.length > 0 ? visibleTeams : SWEDISH_COUNTIES;
    if (!selectedTeam) {
      setSelectedTeam(pool[pool.length - 1]);
      return;
    }
    const idx = pool.findIndex((t) => t.id === selectedTeam.id);
    const prevIdx = (idx - 1 + pool.length) % pool.length;
    setSelectedTeam(pool[prevIdx]);
  };

  const handleStartMode = (mode: 'mixed' | QuestionType) => {
    setIsQuizWinModalOpen(false);
    setIsQuizStartModalOpen(false);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setAppMode('quiz');
    setQuestionTypeMode(mode);
    setQuizScore(0);
    setQuizTotal(0);
    setQuizStreak(0);
    setQuizBestStreak(0);
    solvedTeamIdsRef.current.clear();
    revealedTeamIdsRef.current.clear();
    setQuizSolvedTeams(new Set());
    setQuizRevealedTeams(new Set());
    setHintUsed(false);
    setLastStatus('idle');
    setQuizFeedback(null);
    setIsRevealing(false);
    setCurrentQuestion(generateQuestion(mode));
  };

  const handleRestartQuiz = () => {
    setIsQuizWinModalOpen(false);
    handleStartMode(questionTypeMode);
  };

  const handleUseHint = () => {
    if (hintUsed || isRevealing || !currentQuestion) return;
    setHintUsed(true);
  };

  const handleShowAnswer = () => {
    if (isRevealing || !currentQuestion || isQuizComplete) return;
    const target = currentQuestion.targetCounty || currentQuestion.targetTeam;
    if (!target) return;

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setIsRevealing(true);
    setLastStatus('revealed');
    revealedTeamIdsRef.current.add(target.id);
    setQuizRevealedTeams(new Set(revealedTeamIdsRef.current));
    setQuizFeedback({ teamId: target.id, status: 'revealed' });

    const allSolved = Array.from(new Set([...solvedTeamIdsRef.current, ...revealedTeamIdsRef.current]));
    toastTimeoutRef.current = setTimeout(() => {
      setQuizFeedback(null);
      setLastStatus('idle');
      setIsRevealing(false);
      advanceQuestion(allSolved);
    }, 1400);
  };

  const handleSkipQuestion = () => {
    if (isRevealing || isQuizComplete) return;
    setQuizStreak(0);
    setHintUsed(false);
    advanceQuestion(undefined, currentTarget?.id);
  };

  const currentTarget = currentQuestion?.targetCounty || currentQuestion?.targetTeam;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl">🇸🇪</span>
            <span className="font-black text-lg sm:text-xl text-slate-900 tracking-tight">
              Sveriges Län<span className="text-sky-500">Quiz</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={COUNTIES_STANDINGS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-pill-btn"
              title="SCB Befolkningsstatistik"
            >
              <BarChart2 className="w-4 h-4 text-sky-500" />
              <span className="nav-pill-text">Tabell</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <button
              type="button"
              onClick={() => setIsResourcesModalOpen(true)}
              className="nav-pill-btn cursor-pointer"
              title="Resurser & länkar"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="nav-pill-text">Resurser</span>
            </button>

            <button
              type="button"
              onClick={() => setAppMode('explore')}
              className={`cursor-pointer ${appMode === 'explore' ? 'nav-pill-btn-active' : 'nav-pill-btn'}`}
              title="Utforska"
            >
              <Compass className={`w-4 h-4 ${appMode === 'explore' ? 'text-white' : 'text-slate-600'}`} />
              <span className="nav-pill-text">Utforska</span>
            </button>

            <button
              type="button"
              onClick={() => setIsQuizStartModalOpen(true)}
              className={`cursor-pointer ${appMode === 'quiz' ? 'nav-pill-btn-active' : 'nav-pill-btn'}`}
              title="Quizläge"
            >
              <Target className={`w-4 h-4 ${appMode === 'quiz' ? 'text-white' : 'text-slate-700'}`} />
              <span className="nav-pill-text">Quizläge</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex flex-col min-h-0">
        {appMode === 'explore' ? (
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectTeamByName={(name) => {
              const county = getCountyByName(name);
              if (county) setSelectedTeam(county);
            }}
            searchResults={searchResults}
          />
        ) : (
          <QuizHeader
            mode={questionTypeMode}
            solvedCount={quizSolvedTeams.size}
            revealedCount={quizRevealedTeams.size}
            totalTeams={SWEDISH_COUNTIES.length}
          />
        )}

        {appMode === 'explore' && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <DivisionFilter
              currentFilter={activeFilter}
              onSelectFilter={handleSelectFilter}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCities((prev) => !prev)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 shadow-2xs whitespace-nowrap shrink-0 cursor-pointer ${
                  showCities
                    ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                title={showCities ? 'Dölj alla städer på kartan' : 'Visa alla städer på kartan'}
              >
                <MapPin className={`w-3.5 h-3.5 ${showCities ? 'text-sky-400' : 'text-slate-500'}`} />
                <span>{showCities ? 'Dölj alla städer' : 'Visa alla städer'}</span>
              </button>
              <button
                onClick={() => setIsTeamsModalOpen(true)}
                className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center gap-1.5 shadow-2xs whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
                <span>Alla 21 Län</span>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 items-start">
          <div ref={leftColRef} className="lg:col-span-2 flex flex-col gap-4">
            {appMode === 'explore' ? (
              <ExploreBottomProgressBar
                exploredCount={exploredInVisibleCount}
                totalTeams={visibleTeams.length}
              />
            ) : (
              <QuizBottomProgressBar
                solvedCount={quizSolvedTeams.size}
                revealedCount={quizRevealedTeams.size}
                totalTeams={SWEDISH_COUNTIES.length}
              />
            )}

            {appMode === 'quiz' && (
              <div className="quiz-question-sticky-wrapper">
                <QuizQuestionBanner
                  currentQuestion={currentQuestion}
                  hintUsed={hintUsed}
                  isComplete={isQuizComplete}
                />
              </div>
            )}

            <div className="relative">
              <SwedenMap
                selectedTeam={appMode === 'explore' ? selectedTeam : null}
                onSelectTeam={handleSelectTeam}
                activeFilter={activeFilter}
                exploredTeams={exploredTeams}
                showCities={showCities}
                isQuizMode={appMode === 'quiz'}
                disableMapSelection={isRevealing || isQuizComplete || isMultipleChoice}
                quizFeedback={quizFeedback}
                hintDivision={hintUsed && currentTarget ? currentTarget.region : null}
                hintState={
                  hintUsed && currentTarget
                    ? currentTarget.id
                    : currentQuestion && (currentQuestion.questionType === 'multiple-choice' || currentQuestion.prompt.includes('markerad'))
                      ? currentTarget?.id ?? null
                      : null
                }
                targetHighlightTeamId={
                  (isRevealing || Boolean(currentQuestion && (currentQuestion.questionType === 'multiple-choice' || currentQuestion.prompt.includes('markerad')))) && currentTarget
                    ? currentTarget.id
                    : null
                }
                correctTeamIds={quizSolvedTeams}
                revealedTeamIds={quizRevealedTeams}
              />
            </div>

            {appMode === 'quiz' && !isQuizComplete && currentQuestion?.choices && currentQuestion.choices.length > 0 && (
              <QuizMultipleChoicePanel
                choices={currentQuestion.choices}
                targetTeamId={currentTarget?.id}
                isRevealing={isRevealing}
                onSelectChoice={handleQuizAnswer}
                disabled={isRevealing}
              />
            )}
          </div>

          <div
            className="lg:col-span-1 flex flex-col min-h-0 overflow-hidden w-full"
            style={{
              height: panelHeight ? `${panelHeight}px` : '640px',
              maxHeight: panelHeight ? `${panelHeight}px` : '780px',
            }}
          >
            {appMode === 'explore' ? (
              selectedTeam ? (
                <TeamCard
                  team={selectedTeam}
                  onNextTeam={handleNextTeam}
                  onPrevTeam={handlePrevTeam}
                  isExplored={exploredTeams.has(selectedTeam.id)}
                  onClose={() => setSelectedTeam(null)}
                />
              ) : (
                <FilteredTeamsList
                  filter={activeFilter}
                  teams={visibleTeams}
                  exploredTeams={exploredTeams}
                  onSelectTeam={handleSelectTeam}
                />
              )
            ) : (
              <QuizPanel
                score={quizScore}
                totalAnswered={quizTotal}
                streak={quizStreak}
                bestStreak={quizBestStreak}
                hintUsed={hintUsed}
                questionTypeMode={questionTypeMode}
                currentQuestionType={currentQuestion?.questionType}
                isComplete={isQuizComplete}
                isRevealing={isRevealing}
                onViewWinModal={() => setIsQuizWinModalOpen(true)}
                onOpenModeModal={() => setIsQuizStartModalOpen(true)}
                onOpenTiersModal={() => setIsTiersModalOpen(true)}
                onUseHint={handleUseHint}
                onShowAnswer={handleShowAnswer}
                onSkipQuestion={handleSkipQuestion}
                onRestartQuiz={handleRestartQuiz}
              />
            )}
          </div>
        </div>
      </main>

      {appMode === 'quiz' && (
        <QuizToast
          status={lastStatus}
          targetTeamName={currentTarget?.name}
          lastAnsweredTeam={lastAnsweredTeam}
        />
      )}

      <TeamsModal
        isOpen={isTeamsModalOpen}
        onClose={() => setIsTeamsModalOpen(false)}
        onSelectTeam={handleSelectTeam}
        selectedTeamId={selectedTeam?.id}
        exploredTeams={exploredTeams}
      />

      <ResourcesModal
        isOpen={isResourcesModalOpen}
        onClose={() => setIsResourcesModalOpen(false)}
      />

      <QuizStartModal
        isOpen={isQuizStartModalOpen}
        onClose={() => setIsQuizStartModalOpen(false)}
        onStart={handleStartMode}
        initialMode={questionTypeMode}
      />

      <QuizWinModal
        isOpen={isQuizWinModalOpen}
        score={quizScore}
        totalAnswered={quizTotal}
        bestStreak={quizBestStreak}
        mode={questionTypeMode}
        onPlayAgain={handleRestartQuiz}
        onReviewMap={() => setIsQuizWinModalOpen(false)}
        onOpenTiersModal={() => setIsTiersModalOpen(true)}
      />

      <PerformanceTiersModal
        isOpen={isTiersModalOpen}
        onClose={() => setIsTiersModalOpen(false)}
        currentGrade={currentRank.grade}
      />
    </div>
  );
}

export default App;
