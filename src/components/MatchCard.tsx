import React from 'react';
import { Play, Info, MapPin, Radio, Youtube } from 'lucide-react';
import { Match } from '../types/football';

interface MatchCardProps {
  match: Match;
  onOpenDetails: (match: Match) => void;
  onOpenHighlights: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onOpenDetails,
  onOpenHighlights
}) => {
  const isLive = match.status.state === 'in';
  const isFinished = match.status.completed || match.status.state === 'post';
  const isScheduled = match.status.state === 'pre';

  // Format kickoff time in user's local timezone
  const matchDate = new Date(match.date);
  const now = new Date();
  const isToday = matchDate.toDateString() === now.toDateString();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const isTomorrow = matchDate.toDateString() === tomorrow.toDateString();

  let datePrefix = matchDate.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  if (isToday) datePrefix = 'Hoy';
  else if (isTomorrow) datePrefix = 'Mañana';

  const kickoffTime = matchDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  // Extract goal scorers
  const goals = match.details.filter(d => d.scoringPlay || d.type?.text?.toLowerCase().includes('goal') || d.type?.text?.toLowerCase().includes('gol'));
  const homeGoals = goals.filter(g => g.team.id === match.homeTeam.team.id);
  const awayGoals = goals.filter(g => g.team.id === match.awayTeam.team.id);

  return (
    <div className={`relative rounded-2xl border transition-all duration-200 overflow-hidden ${
      isLive
        ? 'bg-gradient-to-b from-rose-950/20 via-slate-900/90 to-slate-900/90 border-rose-500/50 shadow-lg shadow-rose-950/30'
        : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800/80 hover:border-slate-700/80'
    }`}>
      {/* Top Bar: Status & Venue */}
      <div className="px-4 py-2.5 border-b border-slate-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white animate-pulse shadow-sm shadow-rose-500/50">
              <Radio className="w-3 h-3" />
              <span>EN VIVO {match.status.displayClock ? `• ${match.status.displayClock}` : ''}</span>
            </span>
          ) : isFinished ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/60">
              Finalizado
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {datePrefix} • {kickoffTime}
            </span>
          )}
        </div>

        {match.venue?.fullName && (
          <div className="flex items-center gap-1 text-[11px] text-slate-400 max-w-[180px] truncate" title={`${match.venue.fullName}, ${match.venue.city || ''}`}>
            <MapPin className="w-3 h-3 flex-shrink-0 text-slate-500" />
            <span className="truncate">{match.venue.fullName}</span>
          </div>
        )}
      </div>

      {/* Main Scoreboard Content */}
      <div className="p-4">
        <div className="grid grid-cols-7 items-center gap-2">
          {/* Home Team (3 cols) */}
          <div className="col-span-3 flex flex-col items-center text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 relative flex items-center justify-center p-1 rounded-xl bg-slate-800/40 border border-slate-700/40 mb-2">
              <img
                src={match.homeTeam.team.logo}
                alt={match.homeTeam.team.name}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://a.espncdn.com/i/teamlogos/soccer/500/default-team-logo.png';
                }}
                className="w-11 h-11 sm:w-12 sm:h-12 object-contain drop-shadow-md"
              />
            </div>
            <span className="font-bold text-xs sm:text-sm text-white line-clamp-1 leading-tight">
              {match.homeTeam.team.shortDisplayName}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Local</span>
          </div>

          {/* Score or Time (1 col) */}
          <div className="col-span-1 flex flex-col items-center justify-center text-center">
            {isScheduled ? (
              <div className="flex flex-col items-center">
                <span className="text-sm font-extrabold text-slate-200">{kickoffTime}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">VS</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/70 border border-slate-800 shadow-inner">
                <span className={`text-xl sm:text-2xl font-black ${
                  match.homeTeam.winner ? 'text-white' : 'text-slate-200'
                }`}>
                  {match.homeTeam.score}
                </span>
                <span className="text-slate-500 font-bold text-sm">:</span>
                <span className={`text-xl sm:text-2xl font-black ${
                  match.awayTeam.winner ? 'text-white' : 'text-slate-200'
                }`}>
                  {match.awayTeam.score}
                </span>
              </div>
            )}
          </div>

          {/* Away Team (3 cols) */}
          <div className="col-span-3 flex flex-col items-center text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 relative flex items-center justify-center p-1 rounded-xl bg-slate-800/40 border border-slate-700/40 mb-2">
              <img
                src={match.awayTeam.team.logo}
                alt={match.awayTeam.team.name}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://a.espncdn.com/i/teamlogos/soccer/500/default-team-logo.png';
                }}
                className="w-11 h-11 sm:w-12 sm:h-12 object-contain drop-shadow-md"
              />
            </div>
            <span className="font-bold text-xs sm:text-sm text-white line-clamp-1 leading-tight">
              {match.awayTeam.team.shortDisplayName}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Visitante</span>
          </div>
        </div>

        {/* Goal Scorers snippet if available */}
        {(homeGoals.length > 0 || awayGoals.length > 0) && (
          <div className="mt-3 pt-2.5 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div className="text-left space-y-0.5">
              {homeGoals.slice(0, 3).map((g, idx) => (
                <div key={idx} className="flex items-center gap-1 truncate text-slate-300">
                  <span className="text-[10px]">⚽</span>
                  <span className="truncate font-medium">{g.athleteName}</span>
                  <span className="text-slate-500 text-[10px]">{g.clock.displayValue}</span>
                </div>
              ))}
              {homeGoals.length > 3 && (
                <span className="text-[10px] text-slate-500">+{homeGoals.length - 3} más</span>
              )}
            </div>

            <div className="text-right space-y-0.5">
              {awayGoals.slice(0, 3).map((g, idx) => (
                <div key={idx} className="flex items-center justify-end gap-1 truncate text-slate-300">
                  <span className="text-slate-500 text-[10px]">{g.clock.displayValue}</span>
                  <span className="truncate font-medium">{g.athleteName}</span>
                  <span className="text-[10px]">⚽</span>
                </div>
              ))}
              {awayGoals.length > 3 && (
                <span className="text-[10px] text-slate-500">+{awayGoals.length - 3} más</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenDetails(match)}
          className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 flex items-center gap-1 transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Detalles</span>
        </button>

        <div className="flex items-center gap-1.5">
          {/* Highlights Action */}
          {(isFinished || isLive) ? (
            <button
              onClick={() => onOpenHighlights(match)}
              className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 rounded-lg shadow-sm shadow-rose-600/30 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Ver Resumen</span>
            </button>
          ) : (
            <a
              href={match.youtubeHighlightUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 flex items-center gap-1 transition-colors"
            >
              <Youtube className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Previa</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
