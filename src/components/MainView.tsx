import React from 'react';
import { Radio, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { MatchCard } from './MatchCard';
import { Match } from '../types/football';

interface MainViewProps {
  matches: Match[];
  matchSubTab: 'all' | 'recent' | 'upcoming';
  onOpenDetails: (match: Match) => void;
  onOpenHighlights: (match: Match) => void;
}

export const MainView: React.FC<MainViewProps> = ({
  matches,
  matchSubTab,
  onOpenDetails,
  onOpenHighlights
}) => {
  const liveMatches = matches.filter(m => m.status.state === 'in');
  const finishedMatches = matches
    .filter(m => m.status.completed || m.status.state === 'post')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const upcomingMatches = matches
    .filter(m => m.status.state === 'pre')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (matches.length === 0) {
    return (
      <div className="py-16 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80 p-8">
        <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-200">No se encontraron partidos</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Prueba a cambiar o limpiar los filtros de equipo y fecha para ver más jornadas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. LIVE MATCHES (always top priority if any) */}
      {liveMatches.length > 0 && (matchSubTab === 'all' || matchSubTab === 'recent') && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <h2 className="text-sm font-extrabold tracking-wide uppercase text-rose-400 flex items-center gap-1.5">
              <Radio className="w-4 h-4" />
              <span>Partidos en directo</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {liveMatches.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveMatches.map(m => (
              <MatchCard
                key={m.id}
                match={m}
                onOpenDetails={onOpenDetails}
                onOpenHighlights={onOpenHighlights}
              />
            ))}
          </div>
        </section>
      )}

      {/* 2. JUST PLAYED / RECENT RESULTS */}
      {(matchSubTab === 'all' || matchSubTab === 'recent') && finishedMatches.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-extrabold tracking-wide uppercase text-slate-200">
                Recién Jugados
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700/60">
                {finishedMatches.length}
              </span>
            </div>
            <span className="text-[11px] text-slate-500">Últimos resultados y resúmenes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {finishedMatches.map(m => (
              <MatchCard
                key={m.id}
                match={m}
                onOpenDetails={onOpenDetails}
                onOpenHighlights={onOpenHighlights}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. UPCOMING MATCHES */}
      {(matchSubTab === 'all' || matchSubTab === 'upcoming') && upcomingMatches.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-extrabold tracking-wide uppercase text-slate-200">
                Próximos Partidos
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700/60">
                {upcomingMatches.length}
              </span>
            </div>
            <span className="text-[11px] text-slate-500">Horarios y previas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingMatches.map(m => (
              <MatchCard
                key={m.id}
                match={m}
                onOpenDetails={onOpenDetails}
                onOpenHighlights={onOpenHighlights}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
