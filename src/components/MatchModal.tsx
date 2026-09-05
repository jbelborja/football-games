import React, { useEffect } from 'react';
import { X, Play, Youtube, ExternalLink, Calendar, MapPin, Trophy } from 'lucide-react';
import { Match } from '../types/football';

interface MatchModalProps {
  match: Match | null;
  mode: 'details' | 'highlights';
  onClose: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  match,
  mode,
  onClose
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!match) return null;

  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const kickoffTime = matchDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  const goals = match.details.filter(
    d => d.scoringPlay || d.type?.text?.toLowerCase().includes('goal') || d.type?.text?.toLowerCase().includes('gol')
  );
  const cards = match.details.filter(d => d.yellowCard || d.redCard);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {mode === 'highlights' ? 'Resumen & Vídeo' : 'Ficha del Partido'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Match Score Banner */}
          <div className="bg-gradient-to-b from-slate-800/60 to-slate-950/60 rounded-2xl p-4 sm:p-5 border border-slate-700/50">
            <div className="grid grid-cols-7 items-center gap-2">
              {/* Home */}
              <div className="col-span-3 flex flex-col items-center text-center">
                <img
                  src={match.homeTeam.team.logo}
                  alt={match.homeTeam.team.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain mb-2 drop-shadow"
                />
                <span className="font-extrabold text-sm sm:text-base text-white">
                  {match.homeTeam.team.displayName}
                </span>
                <span className="text-xs text-slate-400 font-medium">Local</span>
              </div>

              {/* Score / Status */}
              <div className="col-span-1 flex flex-col items-center justify-center">
                {match.status.state === 'pre' ? (
                  <div className="text-center">
                    <span className="text-lg font-black text-slate-200">{kickoffTime}</span>
                    <span className="text-[10px] text-slate-500 font-bold block mt-0.5">VS</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-slate-700 shadow-inner">
                    <span className="text-2xl sm:text-3xl font-black text-white">{match.homeTeam.score}</span>
                    <span className="text-slate-500 font-bold">:</span>
                    <span className="text-2xl sm:text-3xl font-black text-white">{match.awayTeam.score}</span>
                  </div>
                )}
                <span className="text-[11px] font-semibold text-rose-400 mt-2 text-center">
                  {match.status.description} {match.status.displayClock ? `(${match.status.displayClock})` : ''}
                </span>
              </div>

              {/* Away */}
              <div className="col-span-3 flex flex-col items-center text-center">
                <img
                  src={match.awayTeam.team.logo}
                  alt={match.awayTeam.team.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain mb-2 drop-shadow"
                />
                <span className="font-extrabold text-sm sm:text-base text-white">
                  {match.awayTeam.team.displayName}
                </span>
                <span className="text-xs text-slate-400 font-medium">Visitante</span>
              </div>
            </div>

            {/* Date & Venue meta */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span className="capitalize">{formattedDate}</span>
              </div>
              {match.venue?.fullName && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{match.venue.fullName}{match.venue.city ? `, ${match.venue.city}` : ''}</span>
                </div>
              )}
            </div>
          </div>

          {/* HIGHLIGHT VIDEO SECTION */}
          {match.highlights && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>{match.highlights.headline}</span>
              </h4>

              {match.highlights.mp4Url ? (
                <div className="rounded-xl overflow-hidden bg-black aspect-video border border-slate-800 shadow-xl relative">
                  <video
                    controls
                    autoPlay
                    playsInline
                    poster={match.highlights.thumbnail}
                    className="w-full h-full object-contain"
                    src={match.highlights.mp4Url}
                  >
                    Tu navegador no soporta el reproductor de vídeo HTML5.
                  </video>
                </div>
              ) : match.highlights.thumbnail ? (
                <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-800 group">
                  <img
                    src={match.highlights.thumbnail}
                    alt={match.highlights.headline}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    {match.highlights.webUrl && (
                      <a
                        href={match.highlights.webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Reproducir en ESPN</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : null}

              {match.highlights.description && (
                <p className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                  {match.highlights.description}
                </p>
              )}
            </div>
          )}

          {/* GOALS & CARDS TIMELINE */}
          {goals.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Goles del Partido</span>
              </h4>

              <div className="divide-y divide-slate-800/70 bg-slate-950/50 rounded-xl border border-slate-800/80 p-3 space-y-2">
                {goals.map((g, idx) => {
                  const isHome = g.team.id === match.homeTeam.team.id;
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-400 font-mono w-10">{g.clock.displayValue}</span>
                        <span className="text-sm">⚽</span>
                        <span className="font-semibold text-white">{g.athleteName || 'Gol'}</span>
                        <span className="text-[10px] text-slate-500">({g.type.text})</span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400">
                        {isHome ? match.homeTeam.team.shortDisplayName : match.awayTeam.team.shortDisplayName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cards */}
          {cards.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tarjetas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cards.map((c, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800 text-xs">
                    <span className={`w-3 h-4 rounded-sm ${c.redCard ? 'bg-rose-600' : 'bg-amber-400'}`}></span>
                    <span className="font-mono text-slate-400 text-[11px]">{c.clock.displayValue}</span>
                    <span className="text-slate-200 truncate">{c.athleteName || 'Jugador'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct Highlight Links Buttons */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Enlaces Directos
            </h4>
            <div className="flex flex-wrap gap-2">
              <a
                href={match.youtubeHighlightUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[200px] px-3.5 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Youtube className="w-4 h-4" />
                <span>Resumen Oficial en YouTube</span>
                <ExternalLink className="w-3 h-3 text-red-400/60" />
              </a>

              <a
                href={match.espnMatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[200px] px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Ficha Completa ESPN</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
