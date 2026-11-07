import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MainView } from './components/MainView';
import { StandingsTable } from './components/StandingsTable';
import { MatchModal } from './components/MatchModal';
import { InstallGuideModal } from './components/InstallGuideModal';
import { fetchMatches, fetchStandings, fetchMatchesForJornada, fetchMatchesForTeam } from './services/footballApi';
import { FALLBACK_MATCHES, FALLBACK_STANDINGS } from './services/fallbackData';
import { Match, StandingsTeamEntry, Team, TeamResultFilter } from './types/football';
import { getAllJornadas, getCurrentJornada, getJornadaByNumber } from './services/jornadas';

export const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<StandingsTeamEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);

  // Jornadas definition
  const currentJornada = useMemo(() => getCurrentJornada(), []);
  const allJornadas = useMemo(() => getAllJornadas(), []);

  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState<'matches' | 'standings'>('matches');
  const [matchSubTab, setMatchSubTab] = useState<'all' | 'recent' | 'upcoming'>('all');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [teamResultFilter, setTeamResultFilter] = useState<TeamResultFilter>(null);
  const [selectedJornadaNumber, setSelectedJornadaNumber] = useState<number | null>(currentJornada.number);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [modalMatch, setModalMatch] = useState<Match | null>(null);
  const [modalMode, setModalMode] = useState<'details' | 'highlights'>('details');
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState<boolean>(false);

  // Load data
  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    let loadedFromCache = false;

    // Fetch Matches
    try {
      const matchRes = await fetchMatches();
      setMatches(matchRes.matches);
      setLastUpdated(matchRes.lastUpdated);
      if (matchRes.fromCache) loadedFromCache = true;
    } catch (err) {
      console.warn('Matches fetch error, applying fallback data:', err);
      if (matches.length === 0) {
        setMatches(FALLBACK_MATCHES);
        setLastUpdated(new Date());
      }
    }

    // Fetch Standings
    try {
      const standingsRes = await fetchStandings();
      setStandings(standingsRes.standings);
      if (standingsRes.fromCache) loadedFromCache = true;
    } catch (err) {
      console.warn('Standings fetch error, applying fallback data:', err);
      if (standings.length === 0) {
        setStandings(FALLBACK_STANDINGS);
      }
    }

    setIsFromCache(loadedFromCache);
    setIsLoading(false);
  }, [matches.length, standings.length]);

  // Initial load
  useEffect(() => {
    loadData(true);
  }, [loadData]);

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(false);
    }, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Collect unique list of all teams from standings and matches
  const allTeams = useMemo<Team[]>(() => {
    const teamMap = new Map<string, Team>();
    standings.forEach(s => {
      if (s.team.id) teamMap.set(s.team.id, s.team);
    });
    matches.forEach(m => {
      if (m.homeTeam.team.id && !teamMap.has(m.homeTeam.team.id)) {
        teamMap.set(m.homeTeam.team.id, m.homeTeam.team);
      }
      if (m.awayTeam.team.id && !teamMap.has(m.awayTeam.team.id)) {
        teamMap.set(m.awayTeam.team.id, m.awayTeam.team);
      }
    });
    return Array.from(teamMap.values()).sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [standings, matches]);

  // Selected Jornada object
  const selectedJornada = useMemo(() => {
    if (selectedJornadaNumber === null) return null;
    return getJornadaByNumber(selectedJornadaNumber) || null;
  }, [selectedJornadaNumber]);

  // Helper to determine match outcome for a specific team
  const getMatchResultForTeam = useCallback((m: Match, teamId: string): 'win' | 'draw' | 'loss' | null => {
    const isCompleted = Boolean(m.status?.completed) || m.status?.state === 'post';
    if (!isCompleted) return null;
    const homeId = m.homeTeam?.team?.id || m.homeTeam?.id;
    const awayId = m.awayTeam?.team?.id || m.awayTeam?.id;
    const isHome = homeId === teamId;
    const isAway = awayId === teamId;
    if (!isHome && !isAway) return null;

    const parseNum = (score: any): number => {
      if (typeof score === 'number') return score;
      if (typeof score === 'string') return parseFloat(score);
      if (typeof score === 'object' && score !== null) {
        if (score.value !== undefined) return Number(score.value);
        if (score.displayValue !== undefined) return parseFloat(score.displayValue);
      }
      return NaN;
    };

    const homeScore = parseNum(m.homeTeam?.score);
    const awayScore = parseNum(m.awayTeam?.score);
    if (isNaN(homeScore) || isNaN(awayScore)) return null;

    if (isHome) {
      return homeScore > awayScore ? 'win' : homeScore < awayScore ? 'loss' : 'draw';
    } else {
      return awayScore > homeScore ? 'win' : awayScore < homeScore ? 'loss' : 'draw';
    }
  }, []);

  // Filtered matches
  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      if (!m || !m.homeTeam || !m.awayTeam) return false;

      // 1. Team filter
      if (selectedTeamId) {
        const homeId = m.homeTeam.team?.id || m.homeTeam.id;
        const awayId = m.awayTeam.team?.id || m.awayTeam.id;
        const matchesTeam = homeId === selectedTeamId || awayId === selectedTeamId;
        if (!matchesTeam) return false;

        // 1.1 Result filter (only wins / draws / losses for this team)
        if (teamResultFilter) {
          const outcome = getMatchResultForTeam(m, selectedTeamId);
          if (outcome !== teamResultFilter) return false;
        }
      }

      // 2. Jornada filter
      if (selectedJornada) {
        if (m.jornadaNumber) {
          if (m.jornadaNumber !== selectedJornada.number) return false;
        } else {
          const d = new Date(m.date);
          const yyyymmdd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
          if (!selectedJornada.dates.includes(yyyymmdd)) return false;
        }
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const homeMatch = m.homeTeam.team?.displayName?.toLowerCase().includes(q) || m.homeTeam.team?.abbreviation?.toLowerCase().includes(q);
        const awayMatch = m.awayTeam.team?.displayName?.toLowerCase().includes(q) || m.awayTeam.team?.abbreviation?.toLowerCase().includes(q);
        if (!homeMatch && !awayMatch) return false;
      }

      return true;
    });
  }, [matches, selectedTeamId, teamResultFilter, selectedJornada, searchQuery, getMatchResultForTeam]);

  // Counts for tabs
  const recentCount = useMemo(() => {
    return filteredMatches.filter(m => m.status?.completed || m.status?.state === 'post' || m.status?.state === 'in').length;
  }, [filteredMatches]);

  const upcomingCount = useMemo(() => {
    return filteredMatches.filter(m => m.status?.state === 'pre').length;
  }, [filteredMatches]);

  // Counts of results for the selected team
  const teamMatchCounts = useMemo(() => {
    if (!selectedTeamId) return undefined;
    const forTeam = matches.filter(m => {
      const homeId = m.homeTeam?.team?.id || m.homeTeam?.id;
      const awayId = m.awayTeam?.team?.id || m.awayTeam?.id;
      return homeId === selectedTeamId || awayId === selectedTeamId;
    });
    let wins = 0;
    let draws = 0;
    let losses = 0;
    forTeam.forEach(m => {
      const res = getMatchResultForTeam(m, selectedTeamId);
      if (res === 'win') wins++;
      else if (res === 'draw') draws++;
      else if (res === 'loss') losses++;
    });
    return {
      all: forTeam.length,
      wins,
      draws,
      losses
    };
  }, [matches, selectedTeamId, getMatchResultForTeam]);

  // Handle Jornada selection and fetch missing matches
  const handleSelectJornada = useCallback(async (jornadaNumber: number | null) => {
    setSelectedJornadaNumber(jornadaNumber);
    if (jornadaNumber === null) return;

    const targetJ = getJornadaByNumber(jornadaNumber);
    if (!targetJ) return;

    // Check if we already have matches loaded for this Jornada
    const hasMatchesForJornada = matches.some(m => {
      if (m.jornadaNumber === targetJ.number) return true;
      const d = new Date(m.date);
      const yyyymmdd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
      return targetJ.dates.includes(yyyymmdd);
    });

    if (!hasMatchesForJornada) {
      try {
        setIsLoading(true);
        const newMatches = await fetchMatchesForJornada(targetJ);
        if (newMatches.length > 0) {
          setMatches(prev => {
            const map = new Map<string, Match>();
            prev.forEach(m => map.set(m.id, m));
            newMatches.forEach(m => map.set(m.id, m));
            return Array.from(map.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          });
        }
      } catch (e) {
        console.warn(`Could not fetch matches for Jornada ${jornadaNumber}:`, e);
      } finally {
        setIsLoading(false);
      }
    }
  }, [matches]);

  // Handle team selection and load all matches for that team across the season
  const handleSelectTeam = useCallback(async (teamId: string | null, resultFilter: TeamResultFilter = null) => {
    setSelectedTeamId(teamId);
    setTeamResultFilter(resultFilter);

    if (teamId) {
      // When a team is selected, show all games for this team (not just current jornada)
      setSelectedJornadaNumber(null);

      try {
        setIsLoading(true);
        const teamMatches = await fetchMatchesForTeam(teamId);
        if (teamMatches.length > 0) {
          setMatches(prev => {
            const map = new Map<string, Match>();
            prev.forEach(m => map.set(m.id, m));
            teamMatches.forEach(m => map.set(m.id, m));
            return Array.from(map.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          });
        }
      } catch (e) {
        console.warn(`Could not load all matches for team ${teamId}:`, e);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  // Handler for selecting team and optional result filter from standings
  const handleSelectTeamFromStandings = (teamId: string, resultFilter?: TeamResultFilter) => {
    handleSelectTeam(teamId, resultFilter || null);
    setActiveTab('matches');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetails = (match: Match) => {
    setModalMatch(match);
    setModalMode('details');
  };

  const handleOpenHighlights = (match: Match) => {
    setModalMatch(match);
    setModalMode('highlights');
  };

  return (
    <div className="min-h-screen bg-[#0b0e17] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={() => loadData(true)}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
        onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Offline / Cached Notice */}
        {isFromCache && (
          <div className="mb-4 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between">
            <span>Visualizando datos en caché local. Se actualizarán automáticamente al reconectar.</span>
            <button onClick={() => loadData(true)} className="font-bold underline text-amber-200 ml-2">Reintentar</button>
          </div>
        )}

        {activeTab === 'matches' ? (
          <div>
            {/* Filter Controls */}
            <FilterBar
              matchSubTab={matchSubTab}
              onSubTabChange={setMatchSubTab}
              selectedTeamId={selectedTeamId}
              onSelectTeam={(teamId) => handleSelectTeam(teamId, null)}
              teamResultFilter={teamResultFilter}
              onSelectTeamResultFilter={setTeamResultFilter}
              teamMatchCounts={teamMatchCounts}
              selectedJornadaNumber={selectedJornadaNumber}
              onSelectJornada={handleSelectJornada}
              teams={allTeams}
              jornadas={allJornadas}
              currentJornadaNumber={currentJornada.number}
              totalMatchesCount={filteredMatches.length}
              recentCount={recentCount}
              upcomingCount={upcomingCount}
            />

            {/* Main Matches View */}
            <MainView
              matches={filteredMatches}
              matchSubTab={matchSubTab}
              selectedJornada={selectedJornada}
              selectedTeamName={selectedTeamId ? allTeams.find(t => t.id === selectedTeamId)?.displayName : undefined}
              teamResultFilter={teamResultFilter}
              onClearTeamResultFilter={() => setTeamResultFilter(null)}
              onOpenDetails={handleOpenDetails}
              onOpenHighlights={handleOpenHighlights}
            />
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-black text-white">Clasificación de LaLiga EA Sports</h2>
              <p className="text-xs text-slate-400">Temporada 2026/27 • Haz clic en cualquier equipo para ver sus partidos</p>
            </div>
            <StandingsTable
              standings={standings}
              onSelectTeam={handleSelectTeamFromStandings}
            />
          </div>
        )}
      </main>

      {/* Mobile Sticky Tab Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-20 bg-[#0b0e17]/95 backdrop-blur-lg border-t border-slate-800 safe-bottom">
        <div className="grid grid-cols-2 p-1.5">
          <button
            onClick={() => setActiveTab('matches')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'matches' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'text-slate-400'
            }`}
          >
            Partidos
          </button>
          <button
            onClick={() => setActiveTab('standings')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'standings' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'text-slate-400'
            }`}
          >
            Clasificación
          </button>
        </div>
      </nav>

      {/* Match Details & Highlights Modal */}
      <MatchModal
        match={modalMatch}
        mode={modalMode}
        onClose={() => setModalMatch(null)}
      />

      {/* App Install Guide Modal */}
      <InstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
      />
    </div>
  );
};

export default App;
