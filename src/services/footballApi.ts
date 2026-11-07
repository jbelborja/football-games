import { Match, StandingsTeamEntry, JornadaDate, MatchDetailEvent, HighlightVideo, Jornada, FormMatch } from '../types/football';
import { getJornadaForDate, getCurrentJornada, getJornadaByNumber, toYYYYMMDD, LALIGA_JORNADAS } from './jornadas';

const BASE_URL = 'https://site.api.espn.com';
const PROXY_URL = '/api/espn';

// Use direct ESPN API in production, fallback to Vite proxy in local dev if needed
async function fetchWithFallback(endpoint: string) {
  // 1. Try direct ESPN endpoint (no custom headers to prevent CORS preflight issues)
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // If direct failed (e.g. CORS on dev server), try Vite proxy
    try {
      const res = await fetch(`${PROXY_URL}${endpoint}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fall through to error
    }
  }
  throw new Error(`Failed to fetch ${endpoint}`);
}

// Robust score string parser (ESPN returns string in scoreboards and object in team schedules)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseScore(rawScore: any): string {
  if (rawScore === null || rawScore === undefined) return '0';
  if (typeof rawScore === 'string') return rawScore;
  if (typeof rawScore === 'number') return String(rawScore);
  if (typeof rawScore === 'object') {
    if (rawScore.displayValue !== undefined && rawScore.displayValue !== null) {
      return String(rawScore.displayValue);
    }
    if (rawScore.value !== undefined && rawScore.value !== null) {
      return String(rawScore.value);
    }
  }
  return '0';
}

// Parse an ESPN event into our Match model
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseEvent(ev: any): Match | null {
  try {
    const comp = ev.competitions?.[0];
    if (!comp || !comp.competitors || comp.competitors.length < 2) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const homeComp = comp.competitors.find((c: any) => c.homeAway === 'home') || comp.competitors[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const awayComp = comp.competitors.find((c: any) => c.homeAway === 'away') || comp.competitors[1];

    const homeLogo = homeComp.team?.logo || homeComp.team?.logos?.[0]?.href || 'https://a.espncdn.com/i/teamlogos/soccer/500/default-team-logo.png';
    const awayLogo = awayComp.team?.logo || awayComp.team?.logos?.[0]?.href || 'https://a.espncdn.com/i/teamlogos/soccer/500/default-team-logo.png';

    const homeTeam = {
      id: homeComp.team?.id || homeComp.id || '',
      name: homeComp.team?.name || 'Local',
      displayName: homeComp.team?.displayName || 'Local',
      shortDisplayName: homeComp.team?.shortDisplayName || homeComp.team?.name || 'Local',
      abbreviation: homeComp.team?.abbreviation || 'LOC',
      logo: homeLogo,
      color: homeComp.team?.color,
      alternateColor: homeComp.team?.alternateColor
    };

    const awayTeam = {
      id: awayComp.team?.id || awayComp.id || '',
      name: awayComp.team?.name || 'Visitante',
      displayName: awayComp.team?.displayName || 'Visitante',
      shortDisplayName: awayComp.team?.shortDisplayName || awayComp.team?.name || 'Visitante',
      abbreviation: awayComp.team?.abbreviation || 'VIS',
      logo: awayLogo,
      color: awayComp.team?.color,
      alternateColor: awayComp.team?.alternateColor
    };

    // Parse details / events (goals, cards)
    const details: MatchDetailEvent[] = [];
    if (Array.isArray(comp.details)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      comp.details.forEach((d: any) => {
        const athlete = d.athletesInvolved?.[0]?.displayName || d.athletesInvolved?.[0]?.shortName;
        details.push({
          id: d.id,
          type: {
            id: d.type?.id || '',
            text: d.type?.text || ''
          },
          clock: {
            value: d.clock?.value,
            displayValue: d.clock?.displayValue || ''
          },
          team: {
            id: d.team?.id || ''
          },
          scoringPlay: Boolean(d.scoringPlay),
          yellowCard: Boolean(d.yellowCard),
          redCard: Boolean(d.redCard),
          penaltyKick: Boolean(d.penaltyKick),
          ownGoal: Boolean(d.ownGoal),
          athleteName: athlete
        });
      });
    }

    // Parse Highlights Video
    let highlights: HighlightVideo | undefined;
    const headlineItem = comp.headlines?.[0];
    const videoItem = headlineItem?.video?.[0];
    if (videoItem) {
      highlights = {
        id: String(videoItem.id || ''),
        headline: videoItem.headline || headlineItem.shortLinkText || 'Resumen del partido',
        duration: videoItem.duration,
        thumbnail: videoItem.thumbnail || videoItem.images?.[0]?.url,
        mp4Url: videoItem.links?.source?.href || videoItem.links?.mobile?.source?.href,
        webUrl: videoItem.links?.web?.href,
        description: headlineItem.description
      };
    }

    // Also look for highlight links in ev.links
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const espnHighlightLink = ev.links?.find((l: any) => l.rel?.includes('highlights'))?.href;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const espnMatchLink = ev.links?.find((l: any) => l.rel?.includes('summary') || l.rel?.includes('desktop'))?.href || `https://www.espn.com/soccer/match/_/gameId/${ev.id}`;

    if (!highlights && espnHighlightLink) {
      highlights = {
        id: ev.id,
        headline: `${homeTeam.shortDisplayName} vs ${awayTeam.shortDisplayName} - Highlights`,
        webUrl: espnHighlightLink,
        description: headlineItem?.description
      };
    }

    // YouTube highlights search link as reliable fallback
    const ytQuery = encodeURIComponent(`LaLiga resumen ${homeTeam.displayName} ${awayTeam.displayName}`);
    const youtubeHighlightUrl = `https://www.youtube.com/results?search_query=${ytQuery}`;

    const matchStatus = {
      state: comp.status?.type?.state || 'pre',
      completed: Boolean(comp.status?.type?.completed),
      description: comp.status?.type?.description || 'Programado',
      detail: comp.status?.type?.detail || comp.status?.type?.shortDetail || 'Programado',
      shortDetail: comp.status?.type?.shortDetail || '',
      clock: comp.status?.clock,
      displayClock: comp.status?.displayClock,
      period: comp.status?.period
    };

    return {
      id: ev.id,
      name: ev.name || `${homeTeam.shortDisplayName} vs ${awayTeam.shortDisplayName}`,
      shortName: ev.shortName || `${homeTeam.abbreviation} vs ${awayTeam.abbreviation}`,
      date: ev.date,
      status: matchStatus,
      venue: {
        fullName: comp.venue?.fullName || comp.venue?.displayName,
        city: comp.venue?.address?.city
      },
      homeTeam: {
        id: homeComp.id,
        homeAway: 'home',
        score: parseScore(homeComp.score),
        winner: Boolean(homeComp.winner),
        team: homeTeam,
        form: homeComp.form,
        records: homeComp.records
      },
      awayTeam: {
        id: awayComp.id,
        homeAway: 'away',
        score: parseScore(awayComp.score),
        winner: Boolean(awayComp.winner),
        team: awayTeam,
        form: awayComp.form,
        records: awayComp.records
      },
      details,
      highlights,
      recapDescription: headlineItem?.description,
      youtubeHighlightUrl,
      espnMatchUrl: espnMatchLink,
      jornadaNumber: getJornadaForDate(ev.date)?.number
    };
  } catch (err) {
    console.error('Error parsing match event:', err);
    return null;
  }
}

export interface MatchesResponse {
  matches: Match[];
  calendar: JornadaDate[];
  lastUpdated: Date;
  fromCache?: boolean;
}

export async function fetchMatches(specificDate?: string): Promise<MatchesResponse> {
  const cacheKey = `laliga_matches_${specificDate || 'default'}`;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let allRawEvents: any[] = [];
    const calendar: JornadaDate[] = [];

    if (specificDate) {
      // 1. Fetch specific single date (ESPN accepts ?dates=YYYYMMDD)
      const data = await fetchWithFallback(`/apis/site/v2/sports/soccer/esp.1/scoreboard?dates=${specificDate}`);
      allRawEvents = data.events || [];

      if (Array.isArray(data.leagues?.[0]?.calendar)) {
        data.leagues[0].calendar.forEach((iso: string) => {
          const d = new Date(iso);
          const yyyymmdd = toYYYYMMDD(d);
          const label = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
          if (!calendar.some(c => c.dateStr === yyyymmdd)) {
            calendar.push({ dateStr: yyyymmdd, label });
          }
        });
      }
    } else {
      // 2. Default Main View:
      // ESPN soccer scoreboard returns HTTP 400 if arbitrary date ranges (YYYYMMDD-YYYYMMDD) are passed.
      // So we first fetch the base scoreboard (which returns today's games + the complete season calendar).
      const baseData = await fetchWithFallback('/apis/site/v2/sports/soccer/esp.1/scoreboard');
      if (Array.isArray(baseData.events)) {
        allRawEvents.push(...baseData.events);
      }

      // Parse all calendar matchday dates
      const rawCalendar: string[] = baseData.leagues?.[0]?.calendar || [];
      const calendarDatesSet: { dateStr: string; label: string; iso: string }[] = [];

      rawCalendar.forEach((iso: string) => {
        const d = new Date(iso);
        const yyyymmdd = toYYYYMMDD(d);
        const label = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        if (!calendarDatesSet.some(c => c.dateStr === yyyymmdd)) {
          calendarDatesSet.push({ dateStr: yyyymmdd, label, iso });
        }
      });

      calendar.push(...calendarDatesSet.map(({ dateStr, label }) => ({ dateStr, label })));

      // Load dates for the current jornada + adjacent jornadas (prev & next)
      const currentJornada = getCurrentJornada();
      const prevJornada = currentJornada.number > 1 ? getJornadaByNumber(currentJornada.number - 1) : null;
      const nextJornada = currentJornada.number < 38 ? getJornadaByNumber(currentJornada.number + 1) : null;

      const targetDates = Array.from(new Set([
        ...(prevJornada ? prevJornada.dates : []),
        ...currentJornada.dates,
        ...(nextJornada ? nextJornada.dates : [])
      ]));

      // Fetch nearby dates in parallel using reliable single-date endpoints
      if (targetDates.length > 0) {
        const dateResults = await Promise.allSettled(
          targetDates.map(d => fetchWithFallback(`/apis/site/v2/sports/soccer/esp.1/scoreboard?dates=${d}`))
        );

        dateResults.forEach(res => {
          if (res.status === 'fulfilled' && Array.isArray(res.value?.events)) {
            allRawEvents.push(...res.value.events);
          }
        });
      }
    }

    // Deduplicate raw events by ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seenEventIds = new Set<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniqueEvents: any[] = [];
    allRawEvents.forEach(ev => {
      if (ev && ev.id && !seenEventIds.has(ev.id)) {
        seenEventIds.add(ev.id);
        uniqueEvents.push(ev);
      }
    });

    const matches: Match[] = uniqueEvents
      .map(ev => parseEvent(ev))
      .filter((m: Match | null): m is Match => m !== null);

    // Sort matches chronologically
    matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const result: MatchesResponse = {
      matches,
      calendar,
      lastUpdated: new Date()
    };

    // Save to localStorage cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        ...result,
        lastUpdated: result.lastUpdated.toISOString()
      }));
    } catch {
      // ignore storage quota errors
    }

    return result;
  } catch (error) {
    console.warn('Network fetch failed, checking localStorage cache...', error);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return {
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated),
          fromCache: true
        };
      } catch {
        // ignore parse error
      }
    }
    throw error;
  }
}

/**
 * Descarga todos los partidos correspondientes a una Jornada completa.
 */
export async function fetchMatchesForJornada(jornada: Jornada): Promise<Match[]> {
  const cacheKey = `laliga_jornada_${jornada.number}`;

  try {
    // For single-day jornadas (J15–J38) the 10 games can be spread across Fri–Mon or Tue–Thu.
    // We expand to ±2 days around the main date so no match is missed.
    let fetchDates = jornada.dates;
    if (jornada.dates.length === 1) {
      const d0 = jornada.dates[0];
      const y = parseInt(d0.substring(0, 4));
      const mo = parseInt(d0.substring(4, 6)) - 1;
      const dy = parseInt(d0.substring(6, 8));
      fetchDates = [];
      for (let off = -2; off <= 2; off++) {
        const dt = new Date(Date.UTC(y, mo, dy + off));
        fetchDates.push(
          `${dt.getUTCFullYear()}${String(dt.getUTCMonth() + 1).padStart(2, '0')}${String(dt.getUTCDate()).padStart(2, '0')}`
        );
      }
    }

    const dateResults = await Promise.allSettled(
      fetchDates.map(d => fetchWithFallback(`/apis/site/v2/sports/soccer/esp.1/scoreboard?dates=${d}`))
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allEvents: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seenIds = new Set<string>();

    dateResults.forEach(res => {
      if (res.status === 'fulfilled' && Array.isArray(res.value?.events)) {
        res.value.events.forEach((ev: any) => {
          if (ev && ev.id && !seenIds.has(ev.id)) {
            seenIds.add(ev.id);
            allEvents.push(ev);
          }
        });
      }
    });

    const matches: Match[] = allEvents
      .map(ev => parseEvent(ev))
      .filter((m: Match | null): m is Match => m !== null);

    // Explicitly guarantee every match in this batch has the correct jornadaNumber
    matches.forEach(m => {
      m.jornadaNumber = jornada.number;
    });

    matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        matches,
        lastUpdated: new Date().toISOString()
      }));
    } catch {
      // ignore
    }

    return matches;
  } catch (error) {
    console.warn(`Failed to fetch matches for Jornada ${jornada.number}, checking cache...`, error);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return parsed.matches || [];
      } catch {
        // ignore
      }
    }
    throw error;
  }
}

/**
 * Descarga todos los partidos de la temporada para un equipo concreto (jugados y futuros fixtures).
 */
export async function fetchMatchesForTeam(teamId: string): Promise<Match[]> {
  const cacheKey = `laliga_team_matches_${teamId}`;

  try {
    // ESPN divide el calendario de un club en partidos jugados y fixtures futuros (?fixture=true).
    // Descargamos ambos en paralelo para abarcar las 38 jornadas completas del club.
    const [pastResult, futureResult] = await Promise.allSettled([
      fetchWithFallback(`/apis/site/v2/sports/soccer/esp.1/teams/${teamId}/schedule`),
      fetchWithFallback(`/apis/site/v2/sports/soccer/esp.1/teams/${teamId}/schedule?fixture=true`)
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allRawEvents: any[] = [];
    if (pastResult.status === 'fulfilled' && Array.isArray(pastResult.value?.events)) {
      allRawEvents.push(...pastResult.value.events);
    }
    if (futureResult.status === 'fulfilled' && Array.isArray(futureResult.value?.events)) {
      allRawEvents.push(...futureResult.value.events);
    }

    // Deduplicar eventos por ID
    const seenEventIds = new Set<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniqueEvents: any[] = [];
    allRawEvents.forEach(ev => {
      if (ev && ev.id && !seenEventIds.has(ev.id)) {
        seenEventIds.add(ev.id);
        uniqueEvents.push(ev);
      }
    });

    const matches: Match[] = uniqueEvents
      .map(ev => parseEvent(ev))
      .filter((m: Match | null): m is Match => m !== null);

    matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        matches,
        lastUpdated: new Date().toISOString()
      }));
    } catch {
      // ignore
    }

    return matches;
  } catch (error) {
    console.warn(`Failed to fetch matches for team ${teamId}, checking cache...`, error);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const cachedMatches: Match[] = (parsed.matches || []).map((m: any) => ({
          ...m,
          homeTeam: {
            ...m.homeTeam,
            score: parseScore(m.homeTeam?.score)
          },
          awayTeam: {
            ...m.awayTeam,
            score: parseScore(m.awayTeam?.score)
          }
        }));
        return cachedMatches;
      } catch {
        // ignore
      }
    }
    return [];
  }
}

/**
 * Calcula la racha y los últimos 5 partidos de cada equipo a partir de los resultados reales.
 */
async function calculateTeamForms(): Promise<Map<string, FormMatch[]>> {
  const todayYYYYMMDD = toYYYYMMDD(new Date());
  // Fechas pasadas de la temporada hasta el día actual
  const pastDates = LALIGA_JORNADAS
    .flatMap(j => j.dates)
    .filter(d => d <= todayYYYYMMDD);

  // Seleccionar hasta las últimas 25 fechas (cubre al menos 6-7 jornadas de juego)
  const recentDates = pastDates.slice(-25);

  const teamMatches = new Map<string, FormMatch[]>();
  const seenEventIds = new Set<string>();

  try {
    const results = await Promise.allSettled(
      recentDates.map(d => fetchWithFallback(`/apis/site/v2/sports/soccer/esp.1/scoreboard?dates=${d}`))
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allEvents: any[] = [];
    results.forEach(res => {
      if (res.status === 'fulfilled' && Array.isArray(res.value?.events)) {
        allEvents.push(...res.value.events);
      }
    });

    // Ordenar cronológicamente (más antiguo a más reciente)
    allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    allEvents.forEach(ev => {
      if (!ev || !ev.id || seenEventIds.has(ev.id)) return;
      seenEventIds.add(ev.id);

      const comp = ev.competitions?.[0];
      const isCompleted = Boolean(comp?.status?.type?.completed) || comp?.status?.type?.state === 'post';
      if (!isCompleted) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const home = comp.competitors?.find((c: any) => c.homeAway === 'home');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const away = comp.competitors?.find((c: any) => c.homeAway === 'away');
      if (!home?.team?.id || !away?.team?.id) return;

      const homeScore = Number(parseScore(home.score));
      const awayScore = Number(parseScore(away.score));

      // 'G' = Ganado, 'E' = Empatado, 'L' = Perdido (Lost)
      const homeResult: 'G' | 'E' | 'L' = homeScore > awayScore ? 'G' : homeScore < awayScore ? 'L' : 'E';
      const awayResult: 'G' | 'E' | 'L' = awayScore > homeScore ? 'G' : awayScore < homeScore ? 'L' : 'E';

      if (!teamMatches.has(home.team.id)) teamMatches.set(home.team.id, []);
      teamMatches.get(home.team.id)!.push({
        result: homeResult,
        score: `${homeScore}-${awayScore}`,
        opponent: away.team.shortDisplayName || away.team.displayName || away.team.name,
        date: ev.date
      });

      if (!teamMatches.has(away.team.id)) teamMatches.set(away.team.id, []);
      teamMatches.get(away.team.id)!.push({
        result: awayResult,
        score: `${awayScore}-${homeScore}`,
        opponent: home.team.shortDisplayName || home.team.displayName || home.team.name,
        date: ev.date
      });
    });
  } catch (err) {
    console.warn('Could not calculate team forms from scoreboard:', err);
  }

  // Conservar solo los últimos 5 partidos jugados por cada equipo
  const finalMap = new Map<string, FormMatch[]>();
  teamMatches.forEach((matchesList, teamId) => {
    finalMap.set(teamId, matchesList.slice(-5));
  });

  return finalMap;
}

export async function fetchStandings(): Promise<{ standings: StandingsTeamEntry[]; lastUpdated: Date; fromCache?: boolean }> {
  const cacheKey = 'laliga_standings';

  try {
    const [data, teamForms] = await Promise.all([
      fetchWithFallback('/apis/v2/sports/soccer/esp.1/standings'),
      calculateTeamForms().catch(() => new Map<string, FormMatch[]>())
    ]);

    const entries = data.children?.[0]?.standings?.entries || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const standings: StandingsTeamEntry[] = entries.map((entry: any) => {
      const stats = entry.stats || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getStat = (name: string) => stats.find((s: any) => s.name === name)?.value ?? 0;

      const teamId = entry.team?.id || '';
      const formMatches = teamForms.get(teamId) || [];
      const formString = formMatches.length > 0
        ? formMatches.map(m => m.result).join(' ')
        : '';

      return {
        rank: Number(getStat('rank')),
        rankChange: Number(getStat('rankChange')),
        team: {
          id: teamId,
          name: entry.team?.name || '',
          displayName: entry.team?.displayName || '',
          shortDisplayName: entry.team?.shortDisplayName || entry.team?.name || '',
          abbreviation: entry.team?.abbreviation || '',
          logo: entry.team?.logos?.[0]?.href || 'https://a.espncdn.com/i/teamlogos/soccer/500/default-team-logo.png'
        },
        played: Number(getStat('gamesPlayed')),
        won: Number(getStat('wins')),
        drawn: Number(getStat('ties')),
        lost: Number(getStat('losses')),
        goalsFor: Number(getStat('pointsFor')),
        goalsAgainst: Number(getStat('pointsAgainst')),
        goalDiff: Number(getStat('pointDifferential')),
        points: Number(getStat('points')),
        form: formString,
        formMatches: formMatches.length > 0 ? formMatches : undefined,
        noteColor: entry.note?.color,
        noteDescription: entry.note?.description
      };
    });

    standings.sort((a, b) => a.rank - b.rank);

    const result = {
      standings,
      lastUpdated: new Date()
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        ...result,
        lastUpdated: result.lastUpdated.toISOString()
      }));
    } catch {
      // ignore
    }

    return result;
  } catch (error) {
    console.warn('Network standings fetch failed, checking cache...', error);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return {
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated),
          fromCache: true
        };
      } catch {
        // ignore
      }
    }
    throw error;
  }
}
