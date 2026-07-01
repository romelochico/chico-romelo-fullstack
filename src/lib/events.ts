import type { EventRow, ShowCardProps, ShowLink } from '../types'

const PT_MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

export function splitEvents(events: EventRow[]): { upcoming: EventRow[]; past: EventRow[] } {
  const today = new Date().toISOString().split('T')[0]
  const upcoming = events
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
  const past = events
    .filter(e => e.date < today)
    .sort((a, b) => b.date.localeCompare(a.date))
  return { upcoming, past }
}

// Maps a DB event row to ShowCard component props
export function toShowCardProps(event: EventRow): ShowCardProps {
  const [year, month, day] = event.date.split('-')
  const isPast = event.date < new Date().toISOString().split('T')[0]
  const monthIndex = parseInt(month, 10) - 1

  let link: ShowLink | null = null
  if (event.link_url) {
    link = {
      href: event.link_url,
      label: event.link_label || 'Ver mais →',
      external: event.link_url.startsWith('http'),
    }
  }

  return {
    day: event.show_day === false ? null : day,
    month: PT_MONTHS[monthIndex] ?? month,
    year,
    name: event.title,
    venue: event.city ? `${event.venue} · ${event.city}` : event.venue,
    tags: event.tags ?? [],
    badge: event.badge ?? null,
    link,
    past: isPast,
  }
}
