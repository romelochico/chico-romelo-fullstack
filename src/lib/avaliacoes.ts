export const SET_LIST: string[] = [
  '2 de Fevereiro',
  'Test Drive',
  'Salsa de Baiano',
  'Conhecidos Estranhos',
  'Zé do Pipo',
  'Pirajá',
  'Chico Romelo',
  'Passatempo',
  'Beira do Rio',
]

export const TODOS_PAPEIS: string[] = [
  'Guitarra Base e Vocal',
  'Guitarra Solo e Vocal',
  'Bateria e Vocal',
  'Teclado e Vocal',
  'Baixo',
  'Percussão',
  'Sopro',
  'Direção',
]

export const PAPEIS_ASPECTOS: Record<string, string[]> = {
  'Guitarra Base e Vocal': ['Guitarra base', 'Voz'],
  'Guitarra Solo e Vocal': ['Guitarra solo', 'Voz'],
  'Bateria e Vocal': ['Bateria', 'Voz'],
  'Teclado e Vocal': ['Teclado', 'Voz'],
  Baixo: ['Baixo'],
  Percussão: ['Percussão'],
  Sopro: ['Sopro / Sax'],
  Direção: [],
}

export function avg(arr: number[]): number {
  const v = arr.filter(x => typeof x === 'number' && x > 0)
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0
}

export function fmtAvg(v: number): string {
  return v > 0 ? v.toFixed(1) : '—'
}

export function fmtDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export function starsStr(val: number | null | undefined): string {
  const v = Math.round(Math.max(0, Math.min(5, val || 0)))
  return '★'.repeat(v) + '☆'.repeat(5 - v)
}
