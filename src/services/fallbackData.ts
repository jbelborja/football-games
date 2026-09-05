import { Match, StandingsTeamEntry } from '../types/football';

export const FALLBACK_MATCHES: Match[] = [
  {
    id: '401882895',
    name: 'Atlético Madrid at Athletic Club',
    shortName: 'ATM @ ATH',
    date: '2026-09-05T14:15Z',
    status: {
      state: 'post',
      completed: true,
      description: 'Finalizado',
      detail: 'FT',
      shortDetail: 'FT'
    },
    venue: {
      fullName: 'San Mamés',
      city: 'Bilbao'
    },
    homeTeam: {
      id: '93',
      homeAway: 'home',
      score: '3',
      winner: true,
      team: {
        id: '93',
        name: 'Athletic Club',
        displayName: 'Athletic Club',
        shortDisplayName: 'Athletic',
        abbreviation: 'ATH',
        logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/93.png'
      }
    },
    awayTeam: {
      id: '1068',
      homeAway: 'away',
      score: '0',
      winner: false,
      team: {
        id: '1068',
        name: 'Atlético Madrid',
        displayName: 'Atlético Madrid',
        shortDisplayName: 'Atlético',
        abbreviation: 'ATM',
        logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/1068.png'
      }
    },
    details: [
      {
        type: { id: '137', text: 'Gol - Cabezazo' },
        clock: { displayValue: "46'" },
        team: { id: '93' },
        scoringPlay: true,
        yellowCard: false,
        redCard: false,
        penaltyKick: false,
        ownGoal: false,
        athleteName: 'Nico Williams'
      },
      {
        type: { id: '70', text: 'Gol' },
        clock: { displayValue: "48'" },
        team: { id: '93' },
        scoringPlay: true,
        yellowCard: false,
        redCard: false,
        penaltyKick: false,
        ownGoal: false,
        athleteName: 'Robert Navarro'
      },
      {
        type: { id: '70', text: 'Gol' },
        clock: { displayValue: "90'" },
        team: { id: '93' },
        scoringPlay: true,
        yellowCard: false,
        redCard: false,
        penaltyKick: false,
        ownGoal: false,
        athleteName: 'Oihan Sancet'
      }
    ],
    highlights: {
      id: '49836682',
      headline: 'Athletic Club vs. Atlético Madrid - Resumen',
      thumbnail: 'https://espnmedia-cdn.akamaized.net/espn/media/common/wsc/2026/0905/861638e7-b02a-4f5c-a542-372d6172e6d1/861638e7-b02a-4f5c-a542-372d6172e6d1.jpg',
      mp4Url: 'https://espnmedia-cdn.akamaized.net/espn/media/16x9/wsc/2026/0905/861638e7-b02a-4f5c-a542-372d6172e6d1/861638e7-b02a-4f5c-a542-372d6172e6d1.mp4',
      webUrl: 'https://www.espn.com/soccer/video/_/gameId/401882895',
      description: 'Nico Williams lidera la victoria contundente del Athletic Club sobre el Atlético de Madrid por 3-0 en San Mamés.'
    },
    recapDescription: 'Nico Williams marcó y sentenció un gran triunfo de Athletic Club 3-0 ante Atlético de Madrid.',
    youtubeHighlightUrl: 'https://www.youtube.com/results?search_query=LaLiga+resumen+Athletic+Club+Atletico+Madrid',
    espnMatchUrl: 'https://www.espn.com/soccer/match/_/gameId/401882895'
  },
  {
    id: '401882889',
    name: 'Racing Santander at Rayo Vallecano',
    shortName: 'RAC @ RAY',
    date: '2026-09-05T16:30Z',
    status: {
      state: 'in',
      completed: false,
      description: 'En Juego',
      detail: "70'",
      shortDetail: "70'",
      displayClock: "70'"
    },
    venue: {
      fullName: 'Estadio de Vallecas',
      city: 'Madrid'
    },
    homeTeam: {
      id: '101',
      homeAway: 'home',
      score: '3',
      team: {
        id: '101',
        name: 'Rayo Vallecano',
        displayName: 'Rayo Vallecano',
        shortDisplayName: 'Rayo',
        abbreviation: 'RAY',
        logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/101.png'
      }
    },
    awayTeam: {
      id: '87',
      homeAway: 'away',
      score: '2',
      team: {
        id: '87',
        name: 'Racing Santander',
        displayName: 'Racing Santander',
        shortDisplayName: 'Racing',
        abbreviation: 'RAC',
        logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/87.png'
      }
    },
    details: [
      {
        type: { id: '138', text: 'Gol de Falta' },
        clock: { displayValue: "4'" },
        team: { id: '87' },
        scoringPlay: true,
        yellowCard: false,
        redCard: false,
        penaltyKick: false,
        ownGoal: false,
        athleteName: 'Sergio Canales'
      },
      {
        type: { id: '70', text: 'Gol' },
        clock: { displayValue: "17'" },
        team: { id: '101' },
        scoringPlay: true,
        yellowCard: false,
        redCard: false,
        penaltyKick: false,
        ownGoal: false,
        athleteName: 'Andrei Ratiu'
      },
      {
        type: { id: '70', text: 'Gol' },
        clock: { displayValue: "43'" },
        team: { id: '101' },
        scoringPlay: true,
        yellowCard: false,
        redCard: false,
        penaltyKick: false,
        ownGoal: false,
        athleteName: 'Sergio Camello'
      }
    ],
    youtubeHighlightUrl: 'https://www.youtube.com/results?search_query=LaLiga+resumen+Rayo+Vallecano+Racing+Santander',
    espnMatchUrl: 'https://www.espn.com/soccer/match/_/gameId/401882889'
  },
  {
    id: '401882887',
    name: 'Deportivo at Villarreal',
    shortName: 'DEP @ VIL',
    date: '2026-09-05T19:00Z',
    status: {
      state: 'pre',
      completed: false,
      description: 'Programado',
      detail: 'Hoy, 21:00 CEST',
      shortDetail: '21:00'
    },
    venue: {
      fullName: 'Estadio de la Cerámica',
      city: 'Villarreal'
    },
    homeTeam: {
      id: '102',
      homeAway: 'home',
      score: '0',
      team: {
        id: '102',
        name: 'Villarreal',
        displayName: 'Villarreal',
        shortDisplayName: 'Villarreal',
        abbreviation: 'VIL',
        logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/102.png'
      }
    },
    awayTeam: {
      id: '90',
      homeAway: 'away',
      score: '0',
      team: {
        id: '90',
        name: 'Deportivo',
        displayName: 'Deportivo',
        shortDisplayName: 'Deportivo',
        abbreviation: 'DEP',
        logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/90.png'
      }
    },
    details: [],
    youtubeHighlightUrl: 'https://www.youtube.com/results?search_query=LaLiga+resumen+Villarreal+Deportivo',
    espnMatchUrl: 'https://www.espn.com/soccer/match/_/gameId/401882887'
  },
  {
    id: '401882899',
    name: 'Real Madrid vs Barcelona - El Clásico',
    shortName: 'FCB @ RMA',
    date: '2026-09-12T19:00Z',
    status: {
      state: 'pre',
      completed: false,
      description: 'Programado',
      detail: 'Sáb, 12 Sep',
      shortDetail: '21:00'
    },
    venue: {
      fullName: 'Santiago Bernabéu',
      city: 'Madrid'
    },
    homeTeam: {
      id: '86',
      homeAway: 'home',
      score: '0',
      team: {
        id: '86',
        name: 'Real Madrid',
        displayName: 'Real Madrid',
        shortDisplayName: 'Real Madrid',
        abbreviation: 'RMA',
        logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/86.png'
      }
    },
    awayTeam: {
      id: '83',
      homeAway: 'away',
      score: '0',
      team: {
        id: '83',
        name: 'Barcelona',
        displayName: 'Barcelona',
        shortDisplayName: 'Barcelona',
        abbreviation: 'BAR',
        logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png'
      }
    },
    details: [],
    youtubeHighlightUrl: 'https://www.youtube.com/results?search_query=LaLiga+resumen+Real+Madrid+Barcelona',
    espnMatchUrl: 'https://www.espn.com/soccer/match/_/gameId/401882899'
  }
];

export const FALLBACK_STANDINGS: StandingsTeamEntry[] = [
  {
    rank: 1,
    rankChange: 0,
    team: { id: '83', name: 'Barcelona', displayName: 'Barcelona', shortDisplayName: 'Barcelona', abbreviation: 'BAR', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png' },
    played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 12, goalsAgainst: 2, goalDiff: 10, points: 9, form: '3-0-0', noteColor: '#81D6AC', noteDescription: 'Champions League'
  },
  {
    rank: 2,
    rankChange: 0,
    team: { id: '86', name: 'Real Madrid', displayName: 'Real Madrid', shortDisplayName: 'Real Madrid', abbreviation: 'RMA', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/86.png' },
    played: 4, won: 3, drawn: 0, lost: 1, goalsFor: 10, goalsAgainst: 3, goalDiff: 7, points: 9, form: '3-0-1', noteColor: '#81D6AC', noteDescription: 'Champions League'
  },
  {
    rank: 3,
    rankChange: 0,
    team: { id: '244', name: 'Real Betis', displayName: 'Real Betis', shortDisplayName: 'Betis', abbreviation: 'BET', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/244.png' },
    played: 4, won: 3, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 5, goalDiff: 0, points: 9, form: '3-0-1', noteColor: '#81D6AC', noteDescription: 'Champions League'
  },
  {
    rank: 4,
    rankChange: 0,
    team: { id: '96', name: 'Alavés', displayName: 'Alavés', shortDisplayName: 'Alavés', abbreviation: 'ALA', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/96.png' },
    played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 5, goalsAgainst: 1, goalDiff: 4, points: 7, form: '2-1-0', noteColor: '#81D6AC', noteDescription: 'Champions League'
  },
  {
    rank: 5,
    rankChange: 0,
    team: { id: '1068', name: 'Atlético Madrid', displayName: 'Atlético Madrid', shortDisplayName: 'Atlético', abbreviation: 'ATM', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/1068.png' },
    played: 4, won: 2, drawn: 1, lost: 1, goalsFor: 7, goalsAgainst: 6, goalDiff: 1, points: 7, form: '2-1-1', noteColor: '#c6d1e0', noteDescription: 'Europa League'
  },
  {
    rank: 6,
    rankChange: 0,
    team: { id: '93', name: 'Athletic Club', displayName: 'Athletic Club', shortDisplayName: 'Athletic', abbreviation: 'ATH', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/93.png' },
    played: 4, won: 2, drawn: 0, lost: 2, goalsFor: 6, goalsAgainst: 5, goalDiff: 1, points: 6, form: '2-0-2', noteColor: '#B2BFD0', noteDescription: 'Conference League'
  },
  {
    rank: 7,
    rankChange: 0,
    team: { id: '243', name: 'Sevilla', displayName: 'Sevilla', shortDisplayName: 'Sevilla', abbreviation: 'SEV', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/243.png' },
    played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 6, goalsAgainst: 5, goalDiff: 1, points: 6, form: '2-0-1'
  },
  {
    rank: 8,
    rankChange: 0,
    team: { id: '102', name: 'Villarreal', displayName: 'Villarreal', shortDisplayName: 'Villarreal', abbreviation: 'VIL', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/102.png' },
    played: 3, won: 0, drawn: 2, lost: 1, goalsFor: 4, goalsAgainst: 5, goalDiff: -1, points: 2, form: '0-2-1'
  }
];
