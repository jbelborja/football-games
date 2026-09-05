export interface Team {
  id: string;
  name: string;
  displayName: string;
  shortDisplayName: string;
  abbreviation: string;
  logo: string;
  color?: string;
  alternateColor?: string;
}

export interface Competitor {
  id: string;
  homeAway: 'home' | 'away';
  score: string;
  winner?: boolean;
  team: Team;
  form?: string;
  records?: Array<{ summary: string }>;
}

export interface MatchStatus {
  state: 'pre' | 'in' | 'post';
  completed: boolean;
  description: string;
  detail: string;
  shortDetail: string;
  clock?: number;
  displayClock?: string;
  period?: number;
}

export interface MatchDetailEvent {
  id?: string;
  type: {
    id: string;
    text: string;
  };
  clock: {
    value?: number;
    displayValue: string;
  };
  team: {
    id: string;
  };
  scoringPlay: boolean;
  yellowCard: boolean;
  redCard: boolean;
  penaltyKick: boolean;
  ownGoal: boolean;
  athleteName?: string;
}

export interface HighlightVideo {
  id: string;
  headline: string;
  duration?: number;
  thumbnail?: string;
  mp4Url?: string;
  webUrl?: string;
  description?: string;
}

export interface Match {
  id: string;
  name: string;
  shortName: string;
  date: string;
  status: MatchStatus;
  venue?: {
    fullName?: string;
    city?: string;
  };
  homeTeam: Competitor;
  awayTeam: Competitor;
  details: MatchDetailEvent[];
  highlights?: HighlightVideo;
  recapDescription?: string;
  youtubeHighlightUrl: string;
  espnMatchUrl: string;
}

export interface StandingsTeamEntry {
  rank: number;
  rankChange: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form?: string;
  noteColor?: string;
  noteDescription?: string;
}

export interface JornadaDate {
  dateStr: string; // YYYY-MM-DD
  label: string;   // e.g. "5 Sep", "Jornada 4"
  matchCount?: number;
}

export interface FilterState {
  teamId: string | null;
  dateStr: string | null;
  searchQuery: string;
  tab: 'matches' | 'standings';
  matchSubTab: 'all' | 'recent' | 'upcoming';
}
