import type { UserProfile } from '../types'

const USER_PROFILES: Record<string, UserProfile> = {
  'almeida.gbrl.pt@gmail.com':  { nome: 'Gabriel Almeida',   papel: 'Baixo' },
  'danillovieira7@gmail.com':   { nome: 'Danillo Vieira',     papel: 'Guitarra Solo e Vocal' },
  'kikoprata@gmail.com':        { nome: 'Cris Prata',         papel: 'Teclado e Vocal' },
  'markintela182@gmail.com':    { nome: 'Marcus Quintela',    papel: 'Guitarra Base e Vocal' },
  'rcastro.drummer@gmail.com':  { nome: 'Renan Castro',       papel: 'Bateria e Vocal' },
  'romelochico@gmail.com':      { nome: 'Chico Romelo',       papel: null },
  'wev3rttonwtec@gmail.com':    { nome: 'Wevertton Trajano',  papel: 'Direção' },
}

export function getProfile(email: string | undefined): UserProfile | null {
  if (!email) return null
  return USER_PROFILES[email] ?? null
}
