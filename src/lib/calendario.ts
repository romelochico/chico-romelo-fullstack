import { Guitar, Mic2, Megaphone, LifeBuoy, type LucideIcon } from 'lucide-react'
import type { CalendarioEventoRow, CalendarioTipo } from '../types'

export const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export const WEEKDAYS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]

export const WEEKDAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
export const WEEKDAYS_MIN = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

export const TIPOS: Record<CalendarioTipo, { label: string; color: string; icon: LucideIcon }> = {
  ensaio: { label: 'Ensaio', color: '#8fbf6f', icon: Guitar },
  show: { label: 'Show', color: '#c8a96e', icon: Mic2 },
  publicidade: { label: 'Publicidade', color: '#6fb8c9', icon: Megaphone },
  suporte_eventos: { label: 'Suporte a Eventos', color: '#c191d6', icon: LifeBuoy },
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function toKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function parseKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export function addMonths(d: Date, n: number): Date {
  const r = new Date(d)
  r.setMonth(r.getMonth() + n)
  return r
}

export function startOfWeek(d: Date): Date {
  const r = new Date(d)
  r.setDate(r.getDate() - r.getDay())
  r.setHours(0, 0, 0, 0)
  return r
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function isToday(d: Date): boolean {
  return sameDay(d, new Date())
}

export function monthMatrix(monthRef: Date): Date[] {
  const gridStart = startOfWeek(startOfMonth(monthRef))
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
}

export function eventOccursOn(ev: CalendarioEventoRow, d: Date): boolean {
  const start = parseKey(ev.data_inicio)
  const end = ev.data_fim ? parseKey(ev.data_fim) : start
  const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  return dd >= start && dd <= end
}

export function eventsForDay(events: CalendarioEventoRow[], d: Date): CalendarioEventoRow[] {
  return events
    .filter(ev => eventOccursOn(ev, d))
    .sort((a, b) => a.data_inicio.localeCompare(b.data_inicio))
}

export function formatDatePt(d: Date): string {
  return `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`
}

export function formatShort(d: Date): string {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`
}

export function todayStr(): string {
  return toKey(new Date())
}
