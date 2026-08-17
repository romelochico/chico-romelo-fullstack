// ── Navigation ─────────────────────────────────────────────────────────────

export interface NavLink {
  href: string
  label: string
}

// ── Members ────────────────────────────────────────────────────────────────

export interface Member {
  name: string
  role: string
  origin: string
  image: string
  jpg: string
}

// ── Shows / Events ─────────────────────────────────────────────────────────

export interface ShowLink {
  href: string
  label: string
  external?: boolean
}

export interface Show {
  day: string
  month: string
  year: string
  name: string
  venue: string
  tags?: string[]
  link?: ShowLink
  badge?: string
}

/** A row from the `events` Supabase table */
export interface EventRow {
  id: string
  date: string
  title: string
  venue: string
  city: string
  tags: string[] | null
  badge: string | null
  link_url: string | null
  link_label: string | null
  show_day: boolean | null | false
  time?: string | null
  created_by?: string | null
}

/** Props passed to <ShowCard> (mapped from EventRow via toShowCardProps) */
export interface ShowCardProps {
  day: string | null
  month: string
  year: string
  name: string
  venue: string
  tags: string[]
  badge: string | null
  link: ShowLink | null
  past: boolean
}

// ── Calendário ─────────────────────────────────────────────────────────────

export type CalendarioTipo = 'ensaio' | 'show' | 'publicidade' | 'suporte_eventos'

/** A row from the `calendario_eventos` Supabase table */
export interface CalendarioEventoRow {
  id: string
  nome: string
  tipo: CalendarioTipo
  data_inicio: string
  data_fim: string | null
  hora_inicio: string | null
  hora_fim: string | null
  descricao: string | null
  enviar_sms: boolean
  sms_hours_before: number
  sms_recipients: string[] | null
  created_by?: string | null
  created_at?: string
}

// ── News ───────────────────────────────────────────────────────────────────

export interface NewsLink {
  href: string
  label: string
  external?: boolean
}

export interface MediaItem {
  id: string
  storage_path: string
  bucket: string
  alt_text: string | null
}

/** A row from the `news` Supabase table (with joined media) */
export interface NewsRow {
  id: string
  title: string
  strap: string | null
  date_label: string | null
  body: string
  link_url: string | null
  link_label: string | null
  created_at: string
  image: MediaItem | null
}

/** Props for <Clipping> component */
export interface ClippingProps {
  strap?: string | null
  date: string
  title: string
  image: string | null
  imageJpg: string | null
  imageAlt: string
  lede: string
  link?: NewsLink | null
  priority?: boolean
}

// ── Music ──────────────────────────────────────────────────────────────────

export interface Track {
  num: string
  name: string
  dur: string
  tag?: string
  cover: string
  spotify: string
  apple: string
  youtube: string
}

export interface EP {
  title: string
  type: string
  year: number
  cover: string
  coverJpg: string
  spotify: string
  apple: string
  youtube: string
  tracks: Track[]
}

export interface Single {
  name: string
  meta: string
  strap: string
  cover: string
  coverPng: string
  spotify: string
  apple: string
  youtube: string
}

// ── Streaming modal ────────────────────────────────────────────────────────

export interface StreamingModalData {
  cover: string
  title: string
  spotify?: string
  apple?: string
  youtube?: string
}

// ── Press ──────────────────────────────────────────────────────────────────

export interface PressPhoto {
  src: string
  jpg: string
  alt: string
  cap: string
  download: string
}

export interface LivePhoto {
  src: string
  jpg: string
  alt: string
  cap: string
}

export interface PressFact {
  label: string
  value: string
}

export interface Venue {
  name: string
  loc: string
}

// ── User profiles ──────────────────────────────────────────────────────────

export interface UserProfile {
  nome: string
  papel: string | null
}

// ── Team members ───────────────────────────────────────────────────────────

/** Permission tier — see supabase/team-tiers.sql for the access rules. */
export type Tier =
  'admin' | 'diretoria' | 'marketing' | 'equipe' | 'membro_da_banda' | 'percussao_e_metais'

/** A row from the `team_members` Supabase table */
export interface TeamMemberRow {
  id: string
  email: string
  nome: string | null
  sobrenome: string | null
  avatar_url: string | null
  telefone: string | null
  data_nascimento: string | null
  redes_sociais: string | null
  papel: string | null
  tier: Tier | null
  is_band_member: boolean
  delete_requested_at: string | null
  created_at?: string
}

// ── Contact form ───────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}
