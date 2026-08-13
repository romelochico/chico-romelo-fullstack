// Server-only. Sends SMS via Twilio's REST API directly (fetch, no SDK) to
// keep this a zero-dependency integration, matching how nboxes is called.

function config() {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_FROM_NUMBER
  if (!sid || !token || !from) {
    throw new Error('TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER não configurados.')
  }
  return { sid, token, from }
}

/** `to` must be in E.164 format (e.g. +351912345678) — Twilio rejects anything else. */
export async function sendSms(to: string, body: string): Promise<void> {
  const { sid, token, from } = config()
  const auth = Buffer.from(`${sid}:${token}`).toString('base64')

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`Twilio ${res.status}: ${errBody}`)
  }
}
