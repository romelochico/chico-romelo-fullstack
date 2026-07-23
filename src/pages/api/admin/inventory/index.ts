import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

async function getUser(req: NextApiRequest) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return null
  const {
    data: { user },
  } = await adminClient().auth.getUser(token)
  return user
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: 'Não autenticado.' })

  const supabase = adminClient()

  if (req.method === 'POST') {
    const { category, subcategory, name, quantity, condition, notes } = req.body
    const { data, error } = await supabase
      .from('inventory')
      .insert({
        category,
        subcategory: subcategory || null,
        name,
        quantity,
        condition,
        notes: notes || null,
      })
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  return res.status(405).end()
}
