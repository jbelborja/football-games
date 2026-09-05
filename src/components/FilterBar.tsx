import React from 'react';
import { Calendar, X, Shield } from 'lucide-react';
import { JornadaDate, Team } from '../types/football';

interface FilterBarProps {
  matchSubTab: 'all' | 'recent' | 'upcoming';
  onSubTabChange: (subTab: 'all' | 'recent' | 'upcoming') => void;
  selectedTeamId: string | null;
  onSelectTeam: (teamId: string | null) => void;
  selectedDateStr: string | null;
  onSelectDate: (dateStr: string | null) => void;
  teams: Team[];
  calendarDates: JornadaDate[];
  totalMatchesCount: number;
  recentCount: number;
  upcomingCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  matchSubTab,
  onSubTabChange,
  selectedTeamId,
  onSelectTeam,
  selectedDateStr,
  onSelectDate,
  teams,
  calendarDates,
  recentCount,
  upcomingCount,
  totalMatchesCount
}) => {
  const hasActiveFilters = selectedTeamId !== null || selectedDateStr !== null;

  return (
    <div className="space-y-2.5 mb-5">
      {/* Sub-Tabs: All / Just Played / Upcoming */}
      <div className="flex flex-wrap items-center justify-between gap-2">
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
              onSelectDate(null);
            }}
            className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-medium flex items-center gap-1 border border-rose-500/20 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {/* Selectors Bar: Team Dropdown + Date Scroller */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Team Dropdown */}
        <div className="relative min-w-[200px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <select
            value={selectedTeamId || ''}
            onChange={(e) => onSelectTeam(e.target.value ? e.target.value : null)}
            aria-label="Filtrar por equipo"
            className="w-full appearance-none pl-9 pr-8 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
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

        {/* Date / Jornada Horizontal Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar flex-1">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mr-1 flex-shrink-0">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span className="hidden sm:inline">Fecha:</span>
          </div>

          <button
            onClick={() => onSelectDate(null)}
            className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
              selectedDateStr === null
                ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40'
                : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Todas
          </button>

          {calendarDates.map((cd) => (
            <button
              key={cd.dateStr}
              onClick={() => onSelectDate(cd.dateStr)}
              className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
                selectedDateStr === cd.dateStr
                  ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30'
                  : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cd.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
