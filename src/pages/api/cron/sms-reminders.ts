// Triggered every ~15 minutes by an external scheduler (cron-job.org,
// GitHub Actions, etc — NOT Vercel Cron, which is once/day on the Hobby
// plan and too coarse for a per-event hours-before reminder). Point the
// scheduler at this URL with `?secret=<CRON_SECRET>` or an
// `x-cron-secret: <CRON_SECRET>` header.
//
// Finds events (local calendario_eventos + nboxes ensaios) whose
// per-event "N hours before start" reminder moment has just passed, texts
// everyone with a phone number in team_members, and logs each event in
// sms_log so it's never sent twice even if the scheduler overlaps runs.

import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { listRehearsals, toCalendarioEvento } from '../../../lib/nboxes'
import { sendSms } from '../../../lib/sms'
import { lisbonDateTimeToUtc } from '../../../lib/timezone'
import { toKey, addDays, TIPOS } from '../../../lib/calendario'
import type { CalendarioEventoRow } from '../../../types'

const WINDOW_MINUTES = 20

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false },
    }
  )
}

function eventKey(ev: CalendarioEventoRow): string {
  return `${ev.tipo === 'ensaio' ? 'ensaio' : 'local'}:${ev.id}`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = process.env.CRON_SECRET
  const provided = req.headers['x-cron-secret'] ?? req.query.secret
  if (!secret || provided !== secret) {
    return res.status(401).json({ error: 'Não autorizado.' })
  }

  const supabase = adminClient()
  const now = new Date()
  const todayKey = toKey(now)
  const tomorrowKey = toKey(addDays(now, 1))

  const [{ data: local }, rehearsals] = await Promise.all([
    supabase
      .from('calendario_eventos')
      .select('*')
      .neq('tipo', 'ensaio')
      .eq('enviar_sms', true)
      .gte('data_inicio', todayKey)
      .lte('data_inicio', tomorrowKey),
    listRehearsals(todayKey, tomorrowKey),
  ])

  const { data: overrides } = await supabase
    .from('ensaio_sms_overrides')
    .select('ensaio_id, enviar_sms, sms_hours_before')
    .in(
      'ensaio_id',
      rehearsals.map(r => r.id)
    )
  const overrideMap = new Map(
    (overrides ?? []).map(o => [
      o.ensaio_id as string,
      { enviar_sms: o.enviar_sms as boolean, sms_hours_before: o.sms_hours_before as number },
    ])
  )
  const ensaios = rehearsals
    .map(r => {
      const ov = overrideMap.get(r.id)
      return toCalendarioEvento(r, ov?.enviar_sms ?? true, ov?.sms_hours_before ?? 5)
    })
    .filter(ev => ev.enviar_sms)

  const candidates = [...((local ?? []) as unknown as CalendarioEventoRow[]), ...ensaios].filter(
    ev => ev.hora_inicio
  )

  const due = candidates.filter(ev => {
    const start = lisbonDateTimeToUtc(ev.data_inicio, ev.hora_inicio!)
    const reminderAt = new Date(start.getTime() - ev.sms_hours_before * 3600_000)
    const minutesSinceDue = (now.getTime() - reminderAt.getTime()) / 60000
    return minutesSinceDue >= 0 && minutesSinceDue <= WINDOW_MINUTES
  })

  if (due.length === 0) {
    return res.status(200).json({ checked: candidates.length, sent: 0 })
  }

  const keys = due.map(eventKey)
  const { data: alreadySent } = await supabase
    .from('sms_log')
    .select('event_key')
    .in('event_key', keys)
  const sentSet = new Set((alreadySent ?? []).map(r => r.event_key as string))
  const toSend = due.filter(ev => !sentSet.has(eventKey(ev)))

  if (toSend.length === 0) {
    return res.status(200).json({ checked: candidates.length, sent: 0 })
  }

  const { data: members } = await supabase
    .from('team_members')
    .select('telefone')
    .not('telefone', 'is', null)
  const phones = (members ?? []).map(m => m.telefone as string).filter(Boolean)

  let sentCount = 0
  const errors: string[] = []

  for (const ev of toSend) {
    const time = ev.hora_inicio!.slice(0, 5)
    // No accents on purpose: an accented char forces the whole SMS into
    // UCS-2 encoding, which cuts the per-segment limit from 160 to 70
    // chars — often doubling the cost for a message this length. Event
    // names are free text and may still contain accents; only the fixed
    // template text here is guaranteed accent-free.
    const message = `Chico Romelo: "${ev.nome}" (${TIPOS[ev.tipo].label}) as ${time}, em ${ev.sms_hours_before}h.`

    let anySuccess = false
    for (const phone of phones) {
      try {
        await sendSms(phone, message)
        anySuccess = true
      } catch (err) {
        errors.push(`${phone}: ${String(err)}`)
      }
    }

    if (anySuccess || phones.length === 0) {
      await supabase.from('sms_log').insert({ event_key: eventKey(ev) })
      sentCount++
    }
  }

  return res
    .status(200)
    .json({ checked: candidates.length, due: due.length, sent: sentCount, errors })
}
