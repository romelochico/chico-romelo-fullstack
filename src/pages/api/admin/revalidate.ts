import type { NextApiRequest, NextApiResponse } from 'next'

const ALLOWED_PATHS = ['/agenda', '/novidades']

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { path } = req.body as { path?: string }
  if (!path || !ALLOWED_PATHS.includes(path)) {
    return res.status(400).json({ error: 'Path inválido.' })
  }

  try {
    await res.revalidate(path)
    return res.status(200).json({ revalidated: true })
  } catch (e) {
    console.error('[api/admin/revalidate]', e)
    return res.status(500).json({ error: 'Erro ao revalidar página.' })
  }
}
