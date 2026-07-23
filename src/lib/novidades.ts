import type { NewsRow, ClippingProps } from '../types'

const PT_MONTHS = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEZ',
]

export function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr)
  return `${PT_MONTHS[d.getMonth()]} · ${d.getFullYear()}`
}

export function getMediaUrl(
  media: { storage_path: string; bucket: string } | null | undefined
): string | null {
  if (!media?.storage_path) return null
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${media.bucket}/${media.storage_path}`
}

// Maps a news DB row (with joined media) to Clipping component props
export function toClippingProps(n: NewsRow): ClippingProps {
  const imageUrl = getMediaUrl(n.image)
  return {
    strap: n.strap,
    date: n.date_label ?? formatDateLabel(n.created_at),
    title: n.title,
    image: imageUrl,
    imageJpg: imageUrl,
    imageAlt: n.image?.alt_text ?? n.title,
    lede: n.body,
    link: n.link_url
      ? { href: n.link_url, label: n.link_label || 'Ler mais →', external: true }
      : null,
  }
}
