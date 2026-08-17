import type { NextApiRequest, NextApiResponse } from 'next'
import {
  listRehearsals,
  createRehearsal,
  toCalendarioEvento,
  calendarioFormToPayload,
  NboxesApiError,
} from '../../../../../lib/nboxes'
import { requireAccess, canManageSmsRecipients } from '../../../../../lib/api-auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAccess(req, res)
  if (!auth) return
  const { tier, supabase } = auth

  try {
    if (req.method === 'GET') {
      const { from, to } = req.query as { from?: string; to?: string }
      const rehearsals = await listRehearsals(from, to)
      const { data: overrides } = await supabase
        .from('ensaio_sms_overrides')
        .select('ensaio_id, enviar_sms, sms_hours_before, sms_recipients')
        .in(
          'ensaio_id',
          rehearsals.map(r => r.id)
        )
      const overrideMap = new Map(
        (overrides ?? []).map(o => [
          o.ensaio_id as string,
          {
            enviar_sms: o.enviar_sms as boolean,
            sms_hours_before: o.sms_hours_before as number,
            sms_recipients: (o.sms_recipients as string[] | null) ?? null,
          },
        ])
      )
      return res.status(200).json(
        rehearsals.map(r => {
          const ov = overrideMap.get(r.id)
          return toCalendarioEvento(
            r,
            ov?.enviar_sms ?? true,
            ov?.sms_hours_before ?? 5,
            ov?.sms_recipients ?? null
          )
        })
      )
    }

    if (req.method === 'POST') {
      if (tier !== 'admin' && tier !== 'membro_da_banda') {
        return res.status(403).json({ error: 'Apenas membros da banda podem adicionar eventos.' })
      }
      const {
        nome,
        data_inicio,
        hora_inicio,
        hora_fim,
        enviar_sms,
        sms_hours_before,
        sms_recipients,
      } = req.body
      if (!nome || !data_inicio || !hora_inicio) {
        return res.status(400).json({ error: 'Nome, data e hora inicial são obrigatórios.' })
      }
      const created = await createRehearsal(
        calendarioFormToPayload({ nome, data_inicio, hora_inicio, hora_fim })
      )
      const enviarSms = enviar_sms !== false
      const hoursBefore = Number(sms_hours_before) > 0 ? Number(sms_hours_before) : 5
      const recipients =
        canManageSmsRecipients(tier) && Array.isArray(sms_recipients) && sms_recipients.length > 0
          ? (sms_recipients as string[])
          : null
      await supabase.from('ensaio_sms_overrides').upsert({
        ensaio_id: created.id,
        enviar_sms: enviarSms,
        sms_hours_before: hoursBefore,
        sms_recipients: recipients,
      })
      return res.status(201).json(toCalendarioEvento(created, enviarSms, hoursBefore, recipients))
    }

    return res.status(405).end()
  } catch (err) {
    if (err instanceof NboxesApiError) {
      return res.status(err.status).json({ error: err.message, details: err.details })
    }
    console.error(err)
    return res.status(500).json({ error: 'Erro ao comunicar com nboxes.' })
  }
}
