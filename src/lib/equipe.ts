import { createClient } from './supabase/client'
import type { User } from '@supabase/supabase-js'

function splitName(fullName: string): { nome: string; sobrenome: string } {
  const parts = fullName.trim().split(/\s+/)
  return { nome: parts[0] ?? '', sobrenome: parts.slice(1).join(' ') }
}

/**
 * Keeps the logged-in user's team_members row in sync with their Google
 * profile: seeds a new row on first login, refreshes the avatar on every
 * login, and only fills nome/sobrenome from Google if they're still empty
 * (so manual edits made via the Equipe page are never overwritten).
 */
export async function syncTeamMemberFromGoogle(user: User): Promise<void> {
  if (!user.email) return

  const supabase = createClient()
  const meta = user.user_metadata as Record<string, string> | undefined
  const avatarUrl = meta?.avatar_url || meta?.picture || null
  const fullName = meta?.full_name || meta?.name || null

  const { data: existing } = await supabase
    .from('team_members')
    .select('id, nome, sobrenome')
    .eq('email', user.email)
    .maybeSingle()

  if (!existing) {
    const { nome, sobrenome } = fullName ? splitName(fullName) : { nome: '', sobrenome: '' }
    await supabase.from('team_members').insert({
      email: user.email,
      nome,
      sobrenome,
      avatar_url: avatarUrl,
    })
    return
  }

  const updates: Record<string, string | null> = { avatar_url: avatarUrl }
  if (!existing.nome && fullName) {
    const { nome, sobrenome } = splitName(fullName)
    updates.nome = nome
    updates.sobrenome = sobrenome
  }
  await supabase.from('team_members').update(updates).eq('id', existing.id)
}
