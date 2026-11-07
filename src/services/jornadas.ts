import { Jornada } from '../types/football';

/**
 * Calendario oficial de las 38 Jornadas de LaLiga para la temporada 2026-27.
 * Agrupa todos los 380 partidos en sus respectivas jornadas con fechas YYYYMMDD.
 */
export const LALIGA_JORNADAS: Jornada[] = [
  { number: 1, label: 'Jornada 1', shortLabel: 'J1', dateRange: '15 - 19 ago', dates: ['20260815', '20260816', '20260817', '20260819'] },
  { number: 2, label: 'Jornada 2', shortLabel: 'J2', dateRange: '20 - 27 ago', dates: ['20260820', '20260821', '20260822', '20260823', '20260824', '20260825', '20260826', '20260827'] },
  { number: 3, label: 'Jornada 3', shortLabel: 'J3', dateRange: '28 - 31 ago', dates: ['20260828', '20260829', '20260830', '20260831'] },
  { number: 4, label: 'Jornada 4', shortLabel: 'J4', dateRange: '3 - 7 sep', dates: ['20260903', '20260904', '20260905', '20260906', '20260907'] },
  { number: 5, label: 'Jornada 5', shortLabel: 'J5', dateRange: '11 - 14 sep', dates: ['20260911', '20260912', '20260913', '20260914'] },
  { number: 6, label: 'Jornada 6', shortLabel: 'J6', dateRange: '15 - 17 sep', dates: ['20260915', '20260916', '20260917'] },
  { number: 7, label: 'Jornada 7', shortLabel: 'J7', dateRange: '18 - 20 sep', dates: ['20260918', '20260919', '20260920'] },
  { number: 8, label: 'Jornada 8', shortLabel: 'J8', dateRange: '9 - 12 oct', dates: ['20261009', '20261010', '20261011', '20261012', '20261021'] },
  { number: 9, label: 'Jornada 9', shortLabel: 'J9', dateRange: '16 - 19 oct', dates: ['20261016', '20261017', '20261018', '20261019'] },
  { number: 10, label: 'Jornada 10', shortLabel: 'J10', dateRange: '23 - 26 oct', dates: ['20261023', '20261024', '20261025', '20261026'] },
  { number: 11, label: 'Jornada 11', shortLabel: 'J11', dateRange: '30 oct - 2 nov', dates: ['20261030', '20261031', '20261101', '20261102'] },
  { number: 12, label: 'Jornada 12', shortLabel: 'J12', dateRange: '6 - 8 nov', dates: ['20261106', '20261107', '20261108'] },
  { number: 13, label: 'Jornada 13', shortLabel: 'J13', dateRange: '20 - 23 nov', dates: ['20261120', '20261121', '20261122', '20261123'] },
  { number: 14, label: 'Jornada 14', shortLabel: 'J14', dateRange: '27 - 30 nov', dates: ['20261127', '20261128', '20261129', '20261130', '20261202', '20261209'] },
  { number: 15, label: 'Jornada 15', shortLabel: 'J15', dateRange: '6 dic', dates: ['20261206'] },
  { number: 16, label: 'Jornada 16', shortLabel: 'J16', dateRange: '13 dic', dates: ['20261213'] },
  { number: 17, label: 'Jornada 17', shortLabel: 'J17', dateRange: '20 dic', dates: ['20261220'] },
  { number: 18, label: 'Jornada 18', shortLabel: 'J18', dateRange: '3 ene', dates: ['20270103'] },
  { number: 19, label: 'Jornada 19', shortLabel: 'J19', dateRange: '10 ene', dates: ['20270110'] },
  { number: 20, label: 'Jornada 20', shortLabel: 'J20', dateRange: '17 ene', dates: ['20270117'] },
  { number: 21, label: 'Jornada 21', shortLabel: 'J21', dateRange: '24 ene', dates: ['20270124'] },
  { number: 22, label: 'Jornada 22', shortLabel: 'J22', dateRange: '31 ene', dates: ['20270131'] },
  { number: 23, label: 'Jornada 23', shortLabel: 'J23', dateRange: '7 feb', dates: ['20270207'] },
  { number: 24, label: 'Jornada 24', shortLabel: 'J24', dateRange: '14 feb', dates: ['20270214'] },
  { number: 25, label: 'Jornada 25', shortLabel: 'J25', dateRange: '21 feb', dates: ['20270221'] },
  { number: 26, label: 'Jornada 26', shortLabel: 'J26', dateRange: '28 feb', dates: ['20270228'] },
  { number: 27, label: 'Jornada 27', shortLabel: 'J27', dateRange: '7 mar', dates: ['20270307'] },
  { number: 28, label: 'Jornada 28', shortLabel: 'J28', dateRange: '14 mar', dates: ['20270314'] },
  { number: 29, label: 'Jornada 29', shortLabel: 'J29', dateRange: '21 mar', dates: ['20270321'] },
  { number: 30, label: 'Jornada 30', shortLabel: 'J30', dateRange: '4 abr', dates: ['20270404'] },
  { number: 31, label: 'Jornada 31', shortLabel: 'J31', dateRange: '11 abr', dates: ['20270411'] },
  { number: 32, label: 'Jornada 32', shortLabel: 'J32', dateRange: '18 abr', dates: ['20270418'] },
  { number: 33, label: 'Jornada 33', shortLabel: 'J33', dateRange: '21 abr', dates: ['20270421'] },
  { number: 34, label: 'Jornada 34', shortLabel: 'J34', dateRange: '2 may', dates: ['20270502'] },
  { number: 35, label: 'Jornada 35', shortLabel: 'J35', dateRange: '9 may', dates: ['20270509'] },
  { number: 36, label: 'Jornada 36', shortLabel: 'J36', dateRange: '16 may', dates: ['20270516'] },
  { number: 37, label: 'Jornada 37', shortLabel: 'J37', dateRange: '23 may', dates: ['20270523'] },
  { number: 38, label: 'Jornada 38', shortLabel: 'J38', dateRange: '30 may', dates: ['20270530'] }
];

/**
 * Convierte un objeto Date o string ISO a formato 'YYYYMMDD'.
 */
export function toYYYYMMDD(d: Date | string): string {
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

/**
 * Devuelve todas las jornadas marcando cuál es la actual.
 */
export function getAllJornadas(): Jornada[] {
  const current = getCurrentJornada();
  return LALIGA_JORNADAS.map(j => ({
    ...j,
    isCurrent: j.number === current.number
  }));
}

/**
 * Determina cuál es la jornada actual basada en la fecha del sistema.
 */
export function getCurrentJornada(refDate: Date = new Date()): Jornada {
  const yyyymmdd = toYYYYMMDD(refDate);

  // 1. Buscar si la fecha actual está explícitamente en alguna jornada
  const exact = LALIGA_JORNADAS.find(j => j.dates.includes(yyyymmdd));
  if (exact) {
    return { ...exact, isCurrent: true };
  }

  // 2. Si hoy es un día entre jornadas, buscar la primera jornada posterior más cercana
  const nextJornada = LALIGA_JORNADAS.find(j => j.dates[0] > yyyymmdd);
  if (nextJornada) {
    const prevJornadaIndex = LALIGA_JORNADAS.indexOf(nextJornada) - 1;
    if (prevJornadaIndex >= 0) {
      const prevJ = LALIGA_JORNADAS[prevJornadaIndex];
      const lastDatePrev = prevJ.dates[prevJ.dates.length - 1];
      const firstDateNext = nextJornada.dates[0];

      const diffPrev = Math.abs(Number(yyyymmdd) - Number(lastDatePrev));
      const diffNext = Math.abs(Number(firstDateNext) - Number(yyyymmdd));

      if (diffPrev <= diffNext) {
        return { ...prevJ, isCurrent: true };
      }
    }
    return { ...nextJornada, isCurrent: true };
  }

  // 3. Si ya ha pasado toda la temporada, devolver la última
  return { ...LALIGA_JORNADAS[LALIGA_JORNADAS.length - 1], isCurrent: true };
}

/**
 * Obtiene una jornada por su número (1 a 38).
 */
export function getJornadaByNumber(num: number): Jornada | undefined {
  const j = LALIGA_JORNADAS.find(item => item.number === num);
  if (!j) return undefined;
  const current = getCurrentJornada();
  return {
    ...j,
    isCurrent: j.number === current.number
  };
}

/**
 * Obtiene la jornada a la que pertenece una fecha dada ('YYYYMMDD' o ISO).
 */
export function getJornadaForDate(dateStrOrIso: string): Jornada | undefined {
  const yyyymmdd = dateStrOrIso.length === 8 && !dateStrOrIso.includes('-')
    ? dateStrOrIso
    : toYYYYMMDD(dateStrOrIso);

  return LALIGA_JORNADAS.find(j => j.dates.includes(yyyymmdd));
}
