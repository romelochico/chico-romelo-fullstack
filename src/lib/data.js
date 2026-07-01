// ── Navigation ────────────────────────────────────────────────
export const NAV_LEFT = [
  { href: '/sobre',      label: 'Sobre' },
  { href: '/lancamentos',label: 'Lançamentos' },
  { href: '/novidades',  label: 'Novidades' },
]
export const NAV_RIGHT = [
  { href: '/agenda',   label: 'Agenda' },
  { href: '/imprensa', label: 'Imprensa' },
  { href: '/contatos', label: 'Contatos' },
]
export const NAV_ALL = [...NAV_LEFT, ...NAV_RIGHT]

// ── Social links ───────────────────────────────────────────────
export const SOCIALS = {
  instagram:  'https://www.instagram.com/chicoromelo',
  spotify:    'https://open.spotify.com/artist/36kAOthCGAS4uOla6Sa4BF',
  youtube:    'https://www.youtube.com/@ChicoRomelo',
  appleMusic: 'https://music.apple.com/pt/artist/chico-romelo/1727802157',
}

// ── Band members ───────────────────────────────────────────────
export const MEMBERS = [
  {
    name:   'Marcus Quintela',
    role:   'Guitarra · Voz principal',
    origin: 'Salvador, BA',
    image:  '/assets/marcus-quintela.webp',
    jpg:    '/assets/marcus-quintela.jpg',
  },
  {
    name:   'Gabriel Almeida',
    role:   'Baixo',
    origin: 'Salvador, BA',
    image:  '/assets/gabriel-almeida.webp',
    jpg:    '/assets/gabriel-almeida.jpg',
  },
  {
    name:   'Cris Prata',
    role:   'Teclado · Vocais',
    origin: 'Santos, SP',
    image:  '/assets/cris-prata.webp',
    jpg:    '/assets/cris-prata.jpg',
  },
  {
    name:   'Renan Castro',
    role:   'Bateria · Vocais',
    origin: 'Brasil, Portugal',
    image:  '/assets/renan-castro.webp',
    jpg:    '/assets/renan-castro.jpg',
  },
  {
    name:   'Danillo Vieira',
    role:   '2ª Guitarra · Vocais',
    origin: 'Salvador, BA',
    image:  '/assets/danillo-vieira.webp',
    jpg:    '/assets/danillo-vieira.jpg',
  },
]

// ── EP ─────────────────────────────────────────────────────────
export const EP = {
  title:   'Chico Romelo',
  type:    'EP',
  year:    2025,
  cover:   '/assets/ep-cover.webp',
  coverJpg:'/assets/ep-cover.jpg',
  spotify: 'https://open.spotify.com/album/2Y7nk3TuplQ2WvlEcwWROX',
  apple:   'https://music.apple.com/pt/album/chico-romelo-ep/1834828852',
  youtube: 'https://www.youtube.com/playlist?list=OLAK5uy_kRF-_VxfEMnxMSB_AWVb9wuseBOUx5c18',
  tracks: [
    {
      num: '01', name: '2 de Fevereiro', dur: '3:42', tag: 'Regravação',
      cover:   '/assets/ep-cover.webp',
      spotify: 'https://open.spotify.com/track/4sEwfBMgnFQWXzRn3Vy9J1',
      apple:   'https://music.apple.com/pt/song/2-de-fevereiro-feat-jefferson-arg%C3%B4lo/1834828853',
      youtube: 'https://www.youtube.com/watch?v=6FFyv7y_S7A',
    },
    {
      num: '02', name: 'Teste Drive', dur: '2:58',
      cover:   '/assets/ep-cover.webp',
      spotify: 'https://open.spotify.com/track/0Dl85WOI86WE4PUf8RQfTj',
      apple:   'https://music.apple.com/pt/song/teste-drive/1834828855',
      youtube: 'https://www.youtube.com/watch?v=qMva5ybHVB8',
    },
    {
      num: '03', name: 'Passatempo', dur: '4:11',
      cover:   '/assets/ep-cover.webp',
      spotify: 'https://open.spotify.com/track/1d6pXlQP80QEOIxBAWp0WK',
      apple:   'https://music.apple.com/pt/song/passatempo/1834828857',
      youtube: 'https://www.youtube.com/watch?v=x-Ucvgd04CI',
    },
    {
      num: '04', name: 'Beira do Rio', dur: '3:29', tag: 'Inédita',
      cover:   '/assets/ep-cover.webp',
      spotify: 'https://open.spotify.com/track/2EcvhkOc9xTST3sTMWyYeg',
      apple:   'https://music.apple.com/pt/song/beira-do-rio/1834829099',
      youtube: 'https://www.youtube.com/watch?v=BLWOrynC0sA',
    },
  ],
}

// ── Singles ────────────────────────────────────────────────────
export const SINGLES = [
  {
    name:   '2 de Fevereiro',
    meta:   'Single · 2024',
    strap:  '★ 1º Single',
    cover:  '/assets/single-2-de-fevereiro.webp',
    coverPng:'/assets/single-2-de-fevereiro.png',
    spotify: 'https://open.spotify.com/track/60bpv7NYz92b5uzDMgv0b2',
    apple:   'https://music.apple.com/pt/album/2-de-fevereiro-single-version-single/1728524651',
    youtube: 'https://www.youtube.com/watch?v=OAPaSq6s1Ss',
  },
  {
    name:   'Passatempo',
    meta:   'Single · 2025',
    strap:  '★ 2025',
    cover:  '/assets/single-passatempo.webp',
    coverPng:'/assets/single-passatempo.png',
    spotify: 'https://open.spotify.com/track/7h9agnhaBlPSOXHnUFg3bU',
    apple:   'https://music.apple.com/pt/album/passatempo-single-version-single/1829988804',
    youtube: 'https://www.youtube.com/watch?v=i2bbp3gVeAM',
  },
  {
    name:   'Teste Drive',
    meta:   'Single · 2025',
    strap:  '★ 2025',
    cover:  '/assets/single-teste-drive.webp',
    coverPng:'/assets/single-teste-drive.png',
    spotify: 'https://open.spotify.com/track/11TtlzDfdAzvviwmMzd7Ot',
    apple:   'https://music.apple.com/pt/album/teste-drive-single-version-single/1831955846',
    youtube: 'https://www.youtube.com/watch?v=WwQSOBaKPWc',
  },
]

// ── Shows ──────────────────────────────────────────────────────
export const UPCOMING_SHOWS = [
  {
    day: '13', month: 'JUN', year: '2026',
    name:  'Final — Concurso Novos Valores',
    venue: 'Organização JCP · Festa do Avante!',
    tags:  ['Concurso', 'Lisboa'],
    link:  { href: '/novidades', label: 'Saiba mais →' },
  },
  {
    day: '24', month: 'JUN', year: '2026',
    name:  'Está Tudo em Festa',
    venue: 'Parque da Paz · Almada',
    tags:  ['Festival', 'Almada'],
    badge: 'Grátis',
  },
]

export const PAST_SHOWS = [
  {
    day: '15', month: 'MAI', year: '2026',
    name:  'Rock à Margem — Final',
    venue: 'Casa Amarela · Almada',
    tags:  ['1º Lugar ★'],
  },
  {
    day: '25', month: 'JAN', year: '2025',
    name:  'Hollywood Spot',
    venue: 'Hollywood Spot · Almada',
  },
  {
    day: '28', month: 'NOV', year: '2024',
    name:  'Titanic Sur Mer',
    venue: 'Titanic · Lisboa',
  },
  {
    day: '04', month: 'JUL', year: '2024',
    name:  'mySpot · Nirvana Studios',
    venue: 'mySpot · Oeiras',
  },
]

// ── News ───────────────────────────────────────────────────────
export const NEWS = [
  {
    strap:      '★ Prémio',
    date:       'JUN · 2026',
    title:      'Vencedores do Rock à Margem',
    image:      '/uploads/rock-a-margem-vencedor.webp',
    imageJpg:   '/uploads/rock-a-margem-vencedor.jpg',
    imageAlt:   'Chico Romelo vence o Rock à Margem em Almada',
    lede:       'Chico Romelo vence a 1ª edição do Rock à Margem em Almada. A banda vai se apresentar no festival Está Tudo em Festa no dia 24 de junho no Parque da Paz e gravará um EP como prémio.',
    link:       { href: 'https://www.cm-almada.pt/chico-romelo-vence-concurso-de-bandas-rock-a-margem', label: 'Ler artigo →', external: true },
  },
  {
    strap:    '★ Ao Vivo',
    date:     'JUN · 2026',
    title:    'Final do Novos Valores',
    image:    '/uploads/novos-valores-2026.webp',
    imageJpg: '/uploads/novos-valores-2026.jpg',
    imageAlt: 'Concurso Novos Valores 2026 — JCP / Festa do Avante',
    lede:     'Chico Romelo está na final do Concurso Novos Valores 2026, organizado pela JCP. A banda se apresenta no dia 13 de junho e os cinco finalistas têm a chance de tocar na Festa do Avante!',
    link:     { href: '/agenda', label: 'Ver agenda →' },
  },
  {
    strap:    '★ Ao Vivo',
    date:     'MAIO · 2026',
    title:    'Rock à Margem — Casa Amarela',
    image:    '/uploads/rock-a-margem.webp',
    imageJpg: '/uploads/rock-a-margem.jpg',
    imageAlt: 'Chico Romelo no Rock à Margem',
    lede:     'Show na Casa Amarela em Almada, com casa cheia. Uma noite que marcou a trajetória da banda e abriu portas para novos palcos.',
  },
]

// ── Press photos ───────────────────────────────────────────────
export const PRESS_PHOTOS = [
  { src: '/uploads/_MG_2808.webp', jpg: '/uploads/_MG_2808.jpg',       alt: 'Marcus ao vivo',            cap: 'marcus quintela · ao vivo',  download: 'Chico-Romelo-marcus-ao-vivo.jpg' },
  { src: '/uploads/_MG_2880.webp', jpg: '/uploads/_MG_2880.jpg',       alt: 'Backstage',                 cap: 'backstage · 2025',           download: 'Chico-Romelo-backstage-2025.jpg' },
  { src: '/uploads/_MG_2546.webp', jpg: '/uploads/_MG_2546.jpg',       alt: 'Banda completa',            cap: 'banda completa · ao vivo',   download: 'Chico-Romelo-banda-completa.jpg' },
]

// ── Live photos (Sobre page) ───────────────────────────────────
export const LIVE_PHOTOS = [
  { src: '/uploads/_MG_2808.webp', jpg: '/uploads/_MG_2808.jpg', alt: 'Ao vivo',  cap: 'ao vivo · lisboa' },
  { src: '/assets/band.webp',    jpg: '/band.jpg',    alt: 'Palco',     cap: 'no palco · 2025' },
  { src: '/uploads/_MG_2880.webp', jpg: '/uploads/_MG_2880.jpg', alt: 'Ensaio',   cap: 'backstage' },
]

// ── Venues ─────────────────────────────────────────────────────
export const VENUES = [
  { name: 'mySpot',         loc: 'Oeiras' },
  { name: 'Titanic',        loc: 'Lisboa' },
  { name: 'Hollywood Spot', loc: 'Almada' },
  { name: 'Rock à Margem',  loc: 'Almada' },
]

// ── Press facts ────────────────────────────────────────────────
export const PRESS_FACTS = [
  { label: 'Género',   value: 'Pop Rock / MPB' },
  { label: 'Base',     value: 'Lisboa, Portugal' },
  { label: 'Membros',  value: '5' },
  { label: 'EP',       value: 'Chico Romelo (2025)' },
  { label: 'Singles',  value: '3' },
  { label: 'Contato',  value: 'romelochico@gmail.com' },
]
