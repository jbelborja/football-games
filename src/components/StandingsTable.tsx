import React from 'react';
import { StandingsTeamEntry } from '../types/football';

interface StandingsTableProps {
  standings: StandingsTeamEntry[];
  onSelectTeam: (teamId: string) => void;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({
  standings,
  onSelectTeam
}) => {
  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <th className="py-3 pl-4 pr-1 text-center w-10">Pos</th>
                <th className="py-3 px-3">Equipo</th>
                <th className="py-3 px-2 text-center" title="Partidos Jugados">PJ</th>
                <th className="py-3 px-2 text-center" title="Partidos Ganados">G</th>
                <th className="py-3 px-2 text-center" title="Partidos Empatados">E</th>
                <th className="py-3 px-2 text-center" title="Partidos Perdidos">P</th>
                <th className="py-3 px-2 text-center hidden sm:table-cell" title="Goles a Favor">GF</th>
                <th className="py-3 px-2 text-center hidden sm:table-cell" title="Goles en Contra">GC</th>
                <th className="py-3 px-2 text-center font-semibold" title="Diferencia de Goles">DG</th>
                <th className="py-3 px-3 text-center font-extrabold text-white">PTS</th>
                <th className="py-3 pr-4 pl-2 text-center hidden md:table-cell">Forma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {standings.map((entry) => {
                // Zone coloring based on rank
                const isChampions = entry.rank >= 1 && entry.rank <= 4;
                const isEuropa = entry.rank === 5;
                const isConference = entry.rank === 6;
                const isRelegation = entry.rank >= 18;

                let borderIndicator = 'border-l-2 border-transparent';
                if (isChampions) borderIndicator = 'border-l-4 border-blue-500';
                else if (isEuropa) borderIndicator = 'border-l-4 border-amber-500';
                else if (isConference) borderIndicator = 'border-l-4 border-emerald-500';
                else if (isRelegation) borderIndicator = 'border-l-4 border-rose-500';

                return (
                  <tr
                    key={entry.team.id}
                    onClick={() => onSelectTeam(entry.team.id)}
                    className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${borderIndicator}`}
                  >
                    {/* Rank */}
                    <td className="py-3 pl-3 pr-1 text-center font-bold text-slate-300">
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[11px] ${
                        entry.rank === 1
                          ? 'bg-amber-400/20 text-amber-300 font-extrabold border border-amber-400/30'
                          : isChampions
                          ? 'text-blue-400'
                          : isRelegation
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}>
                        {entry.rank}
                      </span>
                    </td>

                    {/* Team Name + Crest */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={entry.team.logo}
                          alt={entry.team.displayName}
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://a.espncdn.com/i/teamlogos/soccer/500/default-team-logo.png';
                          }}
                          className="w-6 h-6 object-contain flex-shrink-0"
                        />
                        <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-[200px]">
                          {entry.team.displayName}
                        </span>
                      </div>
                    </td>

                    {/* Stats */}
                    <td className="py-3 px-2 text-center text-slate-300 font-medium">{entry.played}</td>
                    <td className="py-3 px-2 text-center text-slate-300">{entry.won}</td>
                    <td className="py-3 px-2 text-center text-slate-400">{entry.drawn}</td>
                    <td className="py-3 px-2 text-center text-slate-400">{entry.lost}</td>
                    <td className="py-3 px-2 text-center text-slate-400 hidden sm:table-cell">{entry.goalsFor}</td>
                    <td className="py-3 px-2 text-center text-slate-400 hidden sm:table-cell">{entry.goalsAgainst}</td>
                    <td className={`py-3 px-2 text-center font-medium ${
                      entry.goalDiff > 0 ? 'text-emerald-400' : entry.goalDiff < 0 ? 'text-rose-400' : 'text-slate-400'
                    }`}>
                      {entry.goalDiff > 0 ? `+${entry.goalDiff}` : entry.goalDiff}
                    </td>

                    {/* Points */}
                    <td className="py-3 px-3 text-center font-black text-sm text-white bg-slate-950/30">
                      {entry.points}
                    </td>

                    {/* Form badges (last matches) */}
                    <td className="py-3 pr-4 pl-2 text-center hidden md:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {entry.form ? (
                          <span className="text-[11px] text-slate-400 font-mono tracking-wider">
                            {entry.form}
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
          <span>Champions League (1-4)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
          <span>Europa League (5)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
          <span>Conference League (6)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
          <span>Descenso (18-20)</span>
        </div>
      </div>
    </div>
  );
};
