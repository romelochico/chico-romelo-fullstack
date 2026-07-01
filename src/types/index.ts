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

// ── Contact form ───────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}
