import { Match, StandingsTeamEntry, JornadaDate, MatchDetailEvent, HighlightVideo } from '../types/football';

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

    const homeTeam = {
      id: homeComp.team?.id || '',
      name: homeComp.team?.name || 'Local',
      displayName: homeComp.team?.displayName || 'Local',
      shortDisplayName: homeComp.team?.shortDisplayName || homeComp.team?.name || 'Local',
      abbreviation: homeComp.team?.abbreviation || 'LOC',
      logo: homeComp.team?.logo || 'https://a.espncdn.com/i/teamlogos/soccer/500/default-team-logo.png',
      color: homeComp.team?.color,
      alternateColor: homeComp.team?.alternateColor
    };

    const awayTeam = {
      id: awayComp.team?.id || '',
      name: awayComp.team?.name || 'Visitante',
      displayName: awayComp.team?.displayName || 'Visitante',
      shortDisplayName: awayComp.team?.shortDisplayName || awayComp.team?.name || 'Visitante',
      abbreviation: awayComp.team?.abbreviation || 'VIS',
      logo: awayComp.team?.logo || 'https://a.espncdn.com/i/teamlogos/soccer/500/default-team-logo.png',
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
        score: homeComp.score ?? '0',
        winner: homeComp.winner,
        team: homeTeam,
        form: homeComp.form,
        records: homeComp.records
      },
      awayTeam: {
        id: awayComp.id,
        homeAway: 'away',
        score: awayComp.score ?? '0',
        winner: awayComp.winner,
        team: awayTeam,
        form: awayComp.form,
        records: awayComp.records
      },
      details,
      highlights,
      recapDescription: headlineItem?.description,
      youtubeHighlightUrl,
      espnMatchUrl: espnMatchLink
    };
  } catch (err) {
    console.error('Error parsing match event:', err);
    return null;
  }
}

// Format date to YYYYMMDD
function toYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
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

      // Find nearby match dates: 3 previous matchdays and 3 upcoming matchdays
      const todayYYYYMMDD = toYYYYMMDD(new Date());
      const pastDates = calendarDatesSet
        .filter(c => c.dateStr < todayYYYYMMDD)
        .slice(-3)
        .map(c => c.dateStr);

      const upcomingDates = calendarDatesSet
        .filter(c => c.dateStr >= todayYYYYMMDD)
        .slice(0, 3)
        .map(c => c.dateStr);

      const targetDates = Array.from(new Set([...pastDates, ...upcomingDates]));

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

export async function fetchStandings(): Promise<{ standings: StandingsTeamEntry[]; lastUpdated: Date; fromCache?: boolean }> {
  const cacheKey = 'laliga_standings';

  try {
    const data = await fetchWithFallback('/apis/v2/sports/soccer/esp.1/standings');
    const entries = data.children?.[0]?.standings?.entries || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const standings: StandingsTeamEntry[] = entries.map((entry: any) => {
      const stats = entry.stats || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getStat = (name: string) => stats.find((s: any) => s.name === name)?.value ?? 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getStatDisplay = (name: string) => stats.find((s: any) => s.name === name)?.displayValue ?? '';

      return {
        rank: Number(getStat('rank')),
        rankChange: Number(getStat('rankChange')),
        team: {
          id: entry.team?.id || '',
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
        form: getStatDisplay('overall'),
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
