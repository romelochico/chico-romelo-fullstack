import type { CalendarioEventoRow } from '../types'

// Server-only client for nboxes' external rehearsal API. nboxes is the
// source of truth for rehearsals ("Ensaio") — never call this from the
// browser, and never forward NBOXES_API_KEY to a client component.

export interface NboxesRehearsal {
  id: string
  box_id: string
  band_id: string | null
  name: string
  type: string
  day: number
  month: number
  year: number
  date: string
  time: string
  end_time: string | null
  scope: string
  member_id: string | null
  guest_name: string | null
  created_at: string
}

export class NboxesApiError extends Error {
  status: number
  details?: unknown
  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.status = status
    this.details = details
  }
}

function config() {
  const base = process.env.NBOXES_API_URL
  const key = process.env.NBOXES_API_KEY
  const email = process.env.NBOXES_REHEARSAL_EMAIL
  if (!base || !key || !email) {
    throw new NboxesApiError(
      500,
      'NBOXES_API_URL / NBOXES_API_KEY / NBOXES_REHEARSAL_EMAIL não configurados.'
    )
  }
  return { base: base.replace(/\/$/, ''), key, email }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const { base, key } = config()
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: { 'x-api-key': key, 'Content-Type': 'application/json', ...(init?.headers || {}) },
  })

  if (res.status === 204) return undefined as T

  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new NboxesApiError(
      res.status,
      body?.error || `nboxes respondeu ${res.status}`,
      body?.details
    )
  }
  return body as T
}

function qs(params: Record<string, string | undefined>): string {
  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) if (v) usp.set(k, v)
  const s = usp.toString()
  return s ? `?${s}` : ''
}

export async function listRehearsals(from?: string, to?: string): Promise<NboxesRehearsal[]> {
  const { email } = config()
  const { rehearsals } = await request<{ rehearsals: NboxesRehearsal[] }>(
    `/api/external/rehearsals${qs({ email, from, to })}`
  )
  return rehearsals
}

export async function checkAvailability(date: string, time?: string, end_time?: string) {
  const { email } = config()
  return request<{
    date: string
    busy?: unknown[]
    available?: boolean
    conflicts?: NboxesRehearsal[]
  }>(`/api/external/rehearsals/availability${qs({ email, date, time, end_time })}`)
}

export interface RehearsalPayload {
  name: string
  day: number
  month: number
  year: number
  time: string
  end_time?: string | null
}

export async function createRehearsal(payload: RehearsalPayload): Promise<NboxesRehearsal> {
  const { email } = config()
  return request<NboxesRehearsal>('/api/external/rehearsals', {
    method: 'POST',
    body: JSON.stringify({ email, type: 'Ensaio', ...payload }),
  })
}

export async function updateRehearsal(
  id: string,
  payload: Partial<RehearsalPayload>
): Promise<NboxesRehearsal> {
  const { email } = config()
  return request<NboxesRehearsal>(`/api/external/rehearsals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ email, ...payload }),
  })
}

export async function deleteRehearsal(id: string): Promise<void> {
  const { email } = config()
  await request<void>(`/api/external/rehearsals/${id}${qs({ email })}`, { method: 'DELETE' })
}

export function toCalendarioEvento(
  r: NboxesRehearsal,
  enviarSms = true,
  smsHoursBefore = 5
): CalendarioEventoRow {
  return {
    id: r.id,
    nome: r.name,
    tipo: 'ensaio',
    data_inicio: r.date,
    data_fim: null,
    hora_inicio: r.time,
    hora_fim: r.end_time,
    descricao: null,
    enviar_sms: enviarSms,
    sms_hours_before: smsHoursBefore,
    created_by: null,
    created_at: r.created_at,
  }
}

export function calendarioFormToPayload(form: {
  nome: string
  data_inicio: string
  hora_inicio: string
  hora_fim: string
}): RehearsalPayload {
  const [year, month, day] = form.data_inicio.split('-').map(Number)
  return {
    name: form.nome,
    day,
    month: month - 1,
    year,
    time: form.hora_inicio,
    end_time: form.hora_fim || null,
  }
}
