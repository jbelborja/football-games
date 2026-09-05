import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MainView } from './components/MainView';
import { StandingsTable } from './components/StandingsTable';
import { MatchModal } from './components/MatchModal';
import { InstallGuideModal } from './components/InstallGuideModal';
import { fetchMatches, fetchStandings } from './services/footballApi';
import { FALLBACK_MATCHES, FALLBACK_STANDINGS } from './services/fallbackData';
import { Match, StandingsTeamEntry, JornadaDate, Team } from './types/football';

export const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<StandingsTeamEntry[]>([]);
  const [calendarDates, setCalendarDates] = useState<JornadaDate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);

  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState<'matches' | 'standings'>('matches');
  const [matchSubTab, setMatchSubTab] = useState<'all' | 'recent' | 'upcoming'>('all');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
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
      if (matchRes.calendar.length > 0) {
        setCalendarDates(matchRes.calendar);
      }
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

  // If calendarDates was not provided by API, infer from available matches
  const effectiveCalendarDates = useMemo<JornadaDate[]>(() => {
    if (calendarDates.length > 0) return calendarDates;
    const map = new Map<string, JornadaDate>();
    matches.forEach(m => {
      const d = new Date(m.date);
      const yyyymmdd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
      if (!map.has(yyyymmdd)) {
        map.set(yyyymmdd, {
          dateStr: yyyymmdd,
          label: d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.dateStr.localeCompare(b.dateStr));
  }, [calendarDates, matches]);

  // Filtered matches
  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      // 1. Team filter
      if (selectedTeamId) {
        const matchesTeam = m.homeTeam.team.id === selectedTeamId || m.awayTeam.team.id === selectedTeamId;
        if (!matchesTeam) return false;
      }

      // 2. Date filter
      if (selectedDateStr) {
        const d = new Date(m.date);
        const yyyymmdd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
        if (yyyymmdd !== selectedDateStr) return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const homeMatch = m.homeTeam.team.displayName.toLowerCase().includes(q) || m.homeTeam.team.abbreviation.toLowerCase().includes(q);
        const awayMatch = m.awayTeam.team.displayName.toLowerCase().includes(q) || m.awayTeam.team.abbreviation.toLowerCase().includes(q);
        if (!homeMatch && !awayMatch) return false;
      }

      return true;
    });
  }, [matches, selectedTeamId, selectedDateStr, searchQuery]);

  // Counts for tabs
  const recentCount = useMemo(() => {
    return filteredMatches.filter(m => m.status.completed || m.status.state === 'post' || m.status.state === 'in').length;
  }, [filteredMatches]);

  const upcomingCount = useMemo(() => {
    return filteredMatches.filter(m => m.status.state === 'pre').length;
  }, [filteredMatches]);

  // Handler for selecting team from standings
  const handleSelectTeamFromStandings = (teamId: string) => {
    setSelectedTeamId(teamId);
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
              onSelectTeam={setSelectedTeamId}
              selectedDateStr={selectedDateStr}
              onSelectDate={setSelectedDateStr}
              teams={allTeams}
              calendarDates={effectiveCalendarDates}
              totalMatchesCount={filteredMatches.length}
              recentCount={recentCount}
              upcomingCount={upcomingCount}
            />

            {/* Main Matches View */}
            <MainView
              matches={filteredMatches}
              matchSubTab={matchSubTab}
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
