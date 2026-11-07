import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Shield, CalendarDays } from 'lucide-react';
import { Jornada, Team, TeamResultFilter } from '../types/football';

interface FilterBarProps {
  matchSubTab: 'all' | 'recent' | 'upcoming';
  onSubTabChange: (subTab: 'all' | 'recent' | 'upcoming') => void;
  selectedTeamId: string | null;
  onSelectTeam: (teamId: string | null) => void;
  teamResultFilter?: TeamResultFilter;
  onSelectTeamResultFilter?: (filter: TeamResultFilter) => void;
  teamMatchCounts?: {
    all: number;
    wins: number;
    draws: number;
    losses: number;
  };
  selectedJornadaNumber: number | null;
  onSelectJornada: (jornadaNumber: number | null) => void;
  teams: Team[];
  jornadas: Jornada[];
  currentJornadaNumber: number;
  totalMatchesCount: number;
  recentCount: number;
  upcomingCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  matchSubTab,
  onSubTabChange,
  selectedTeamId,
  onSelectTeam,
  teamResultFilter = null,
  onSelectTeamResultFilter,
  teamMatchCounts,
  selectedJornadaNumber,
  onSelectJornada,
  teams,
  jornadas,
  currentJornadaNumber,
  recentCount,
  upcomingCount,
  totalMatchesCount
}) => {
  const activePillRef = useRef<HTMLButtonElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll the active jornada pill into view
  useEffect(() => {
    if (activePillRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [selectedJornadaNumber]);

  const hasActiveFilters =
    selectedTeamId !== null ||
    teamResultFilter !== null ||
    (selectedJornadaNumber !== null && selectedJornadaNumber !== currentJornadaNumber);

  const selectedJornada = selectedJornadaNumber
    ? jornadas.find((j) => j.number === selectedJornadaNumber)
    : null;

  const handlePrevJornada = () => {
    if (selectedJornadaNumber === null) {
      onSelectJornada(currentJornadaNumber > 1 ? currentJornadaNumber - 1 : 1);
    } else if (selectedJornadaNumber > 1) {
      onSelectJornada(selectedJornadaNumber - 1);
    }
  };

  const handleNextJornada = () => {
    if (selectedJornadaNumber === null) {
      onSelectJornada(currentJornadaNumber < 38 ? currentJornadaNumber + 1 : 38);
    } else if (selectedJornadaNumber < 38) {
      onSelectJornada(selectedJornadaNumber + 1);
    }
  };

  return (
    <div className="space-y-3 mb-5">
      {/* Top Bar: Sub-Tabs & Filter Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Match State Sub-Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800/80">
          <button
            onClick={() => onSubTabChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              matchSubTab === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos ({totalMatchesCount})
          </button>

          <button
            onClick={() => onSubTabChange('recent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              matchSubTab === 'recent'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Recién Jugados</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
              {recentCount}
            </span>
          </button>

          <button
            onClick={() => onSubTabChange('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              matchSubTab === 'upcoming'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Próximos</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500/20 text-blue-400 font-bold">
              {upcomingCount}
            </span>
          </button>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              onSelectTeam(null);
              if (onSelectTeamResultFilter) onSelectTeamResultFilter(null);
              onSelectJornada(currentJornadaNumber);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-medium flex items-center gap-1 border border-rose-500/20 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Restablecer filtros</span>
          </button>
        )}
      </div>

      {/* Main Selectors Row: Team Dropdown + Jornada Stepper / Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Team Selector Dropdown */}
        <div className="relative min-w-[210px] sm:w-[240px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <select
            value={selectedTeamId || ''}
            onChange={(e) => onSelectTeam(e.target.value ? e.target.value : null)}
            aria-label="Filtrar por equipo"
            className="w-full appearance-none pl-9 pr-8 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
          >
            <option value="">Todos los equipos</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.displayName}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
            ▼
          </div>
        </div>

        {/* Jornada Stepper & Dropdown Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl flex-1 min-w-0">
          {/* Previous Jornada Button */}
          <button
            type="button"
            onClick={handlePrevJornada}
            disabled={selectedJornadaNumber === 1}
            title="Jornada anterior"
            aria-label="Jornada anterior"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-25 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Central Jornada Dropdown Picker */}
          <div className="relative flex-1 min-w-0">
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-rose-500 flex items-center">
              <CalendarDays className="w-3.5 h-3.5" />
            </div>
            <select
              value={selectedJornadaNumber === null ? 'all' : selectedJornadaNumber}
              onChange={(e) => {
                const val = e.target.value;
                onSelectJornada(val === 'all' ? null : Number(val));
              }}
              aria-label="Seleccionar jornada"
              className="w-full appearance-none pl-8 pr-7 py-1.5 bg-slate-800/70 hover:bg-slate-800 text-slate-100 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors cursor-pointer truncate"
            >
              <option value="all" className="bg-slate-900 text-slate-200">
                Todas las jornadas (Temporada completa)
              </option>
              {jornadas.map((j) => (
                <option key={j.number} value={j.number} className="bg-slate-900 text-slate-200">
                  {j.label} — {j.dateRange} {j.number === currentJornadaNumber ? '★ (Actual)' : ''}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Current Jornada Badge Indicator */}
          {selectedJornada?.number === currentJornadaNumber && (
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex-shrink-0">
              Actual
            </span>
          )}

          {/* Next Jornada Button */}
          <button
            type="button"
            onClick={handleNextJornada}
            disabled={selectedJornadaNumber === 38}
            title="Jornada siguiente"
            aria-label="Jornada siguiente"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-25 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Team Result Sub-Filter: Todos / Victorias (G) / Empates (E) / Derrotas (L) */}
      {selectedTeamId && onSelectTeamResultFilter && (
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs animate-fadeIn">
          <span className="text-[11px] text-slate-400 font-semibold px-1.5 flex-shrink-0">
            Filtrar partidos:
          </span>

          <button
            onClick={() => onSelectTeamResultFilter(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              teamResultFilter === null
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos {teamMatchCounts ? `(${teamMatchCounts.all})` : ''}
          </button>

          <button
            onClick={() => onSelectTeamResultFilter('win')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              teamResultFilter === 'win'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-black text-[9px] flex items-center justify-center">
              G
            </span>
            <span>Victorias {teamMatchCounts ? `(${teamMatchCounts.wins})` : ''}</span>
          </button>

          <button
            onClick={() => onSelectTeamResultFilter('draw')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              teamResultFilter === 'draw'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white font-black text-[9px] flex items-center justify-center">
              E
            </span>
            <span>Empates {teamMatchCounts ? `(${teamMatchCounts.draws})` : ''}</span>
          </button>

          <button
            onClick={() => onSelectTeamResultFilter('loss')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              teamResultFilter === 'loss'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center">
              L
            </span>
            <span>Derrotas {teamMatchCounts ? `(${teamMatchCounts.losses})` : ''}</span>
          </button>
        </div>
      )}

      {/* Horizontal Pills Strip for Quick Jornada Navigation */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-1.5 overflow-x-auto py-1.5 no-scrollbar scroll-smooth"
      >
        <button
          onClick={() => onSelectJornada(null)}
          ref={selectedJornadaNumber === null ? activePillRef : null}
          className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all font-medium ${
            selectedJornadaNumber === null
              ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30'
              : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800/90'
          }`}
        >
          Todas
        </button>

        {jornadas.map((j) => {
          const isSelected = selectedJornadaNumber === j.number;
          const isCurrent = j.number === currentJornadaNumber;

          return (
            <button
              key={j.number}
              ref={isSelected ? activePillRef : null}
              onClick={() => onSelectJornada(j.number)}
              title={`${j.label} (${j.dateRange})`}
              className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all flex items-center gap-1 font-medium ${
                isSelected
                  ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30'
                  : isCurrent
                  ? 'bg-slate-900/90 text-rose-300 border border-rose-500/50 hover:bg-slate-800'
                  : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800/90'
              }`}
            >
              <span>{j.shortLabel}</span>
              {isCurrent && !isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
