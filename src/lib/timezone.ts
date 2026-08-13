const BAND_TIMEZONE = 'Europe/Lisbon'

/** Offset (minutes) of `timeZone` from UTC at the instant `date` represents. */
function tzOffsetMinutes(timeZone: string, date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date)

  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '0'
  const asUtc = Date.UTC(
    Number(get('year')),
    Number(get('month')) - 1,
    Number(get('day')),
    Number(get('hour')) % 24,
    Number(get('minute')),
    Number(get('second'))
  )
  return (asUtc - date.getTime()) / 60000
}

/**
 * Converts a "YYYY-MM-DD" + "HH:MM" (or "HH:MM:SS") pair representing wall-
 * clock time in Lisbon into the real UTC instant it corresponds to —
 * correctly accounting for WET/WEST (Portugal's DST) without a timezone
 * library, using the offset the built-in Intl API already knows.
 */
export function lisbonDateTimeToUtc(dateStr: string, timeStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  const [hh, mm] = timeStr.split(':').map(Number)
  const guess = new Date(Date.UTC(y, m - 1, d, hh, mm))
  const offset = tzOffsetMinutes(BAND_TIMEZONE, guess)
  return new Date(guess.getTime() - offset * 60000)
}
