import type { NextApiRequest, NextApiResponse } from 'next'
import {
  updateRehearsal,
  deleteRehearsal,
  toCalendarioEvento,
  calendarioFormToPayload,
  NboxesApiError,
} from '../../../../../lib/nboxes'
import { requireAccess, canManageSmsRecipients } from '../../../../../lib/api-auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAccess(req, res)
  if (!auth) return
  const { tier, supabase } = auth

  const { id } = req.query as { id: string }

  if (
    (req.method === 'PATCH' || req.method === 'PUT' || req.method === 'DELETE') &&
    tier === 'percussao_e_metais'
  ) {
    return res.status(403).json({ error: 'Acesso somente leitura ao calendário.' })
  }

  try {
    if (req.method === 'PATCH' || req.method === 'PUT') {
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
      const updated = await updateRehearsal(
        id,
        calendarioFormToPayload({ nome, data_inicio, hora_inicio, hora_fim })
      )
      const enviarSms = enviar_sms !== false
      const hoursBefore = Number(sms_hours_before) > 0 ? Number(sms_hours_before) : 5

      let recipients: string[] | null
      if (canManageSmsRecipients(tier)) {
        recipients =
          Array.isArray(sms_recipients) && sms_recipients.length > 0
            ? (sms_recipients as string[])
            : null
      } else {
        const { data: existing } = await supabase
          .from('ensaio_sms_overrides')
          .select('sms_recipients')
          .eq('ensaio_id', id)
          .maybeSingle()
        recipients = (existing?.sms_recipients as string[] | null) ?? null
      }

      await supabase.from('ensaio_sms_overrides').upsert({
        ensaio_id: id,
        enviar_sms: enviarSms,
        sms_hours_before: hoursBefore,
        sms_recipients: recipients,
      })
      return res.status(200).json(toCalendarioEvento(updated, enviarSms, hoursBefore, recipients))
    }

    if (req.method === 'DELETE') {
      await deleteRehearsal(id)
      await supabase.from('ensaio_sms_overrides').delete().eq('ensaio_id', id)
      return res.status(204).end()
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
