import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import styled, { keyframes } from 'styled-components'
import { Calendar, Newspaper, Disc3, Image, Link2, MessageSquare, Star } from 'lucide-react'
import AdminLayout from '../../components/Admin/AdminLayout'
import { createClient } from '../../lib/supabase/client'
import { splitEvents } from '../../lib/events'
import { avg, fmtAvg } from '../../lib/avaliacoes'
import type { EventRow } from '../../types'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.12);
  }

  svg { color: ${({ theme }) => theme.colors.sage}; width: 22px; height: 22px; }
`

const CardLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
`

const CardValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 36px;
  color: ${({ theme }) => theme.colors.cream};
  line-height: 1;
`

const CardSub = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 2px;
`

const spin = keyframes`to { transform: rotate(360deg); }`

const Spinner = styled.span`
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.08);
  border-top-color: ${({ theme }) => theme.colors.sage};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  margin: 9px 0;
`

const SubStat = styled.span<{ $green?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  color: rgba(255,255,255,0.3);

  strong {
    font-weight: 700;
    color: ${({ $green, theme }) => $green ? '#4ade80' : theme.colors.cream2};
  }
`

interface DashStats {
  upcomingCount: number
  pastCount: number
  newsCount: number
  singles: number
  eps: number
  albums: number
  showsCount: number
  avalsCount: number
  avalsAvg: number
  contatosTotal: number
  contatosUnread: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashStats | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const supabase = createClient()

    const [eventsRes, newsRes, releasesRes, showsRes, avalsRes, contatosRes] = await Promise.all([
      supabase.from('events').select('date'),
      supabase.from('news').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('releases').select('type'),
      supabase.from('shows').select('id', { count: 'exact', head: true }),
      supabase.from('avaliacoes').select('nota_final'),
      supabase.from('contatos').select('read'),
    ])

    const rawEvents = (eventsRes.data ?? []) as unknown as EventRow[]
    const { upcoming, past } = splitEvents(rawEvents)
    const singles = (releasesRes.data ?? []).filter((r: { type: string }) => r.type === 'single').length
    const eps = (releasesRes.data ?? []).filter((r: { type: string }) => r.type === 'ep').length
    const albums = (releasesRes.data ?? []).filter((r: { type: string }) => r.type === 'album').length

    const avalsData = (avalsRes.data ?? []) as { nota_final: number | null }[]
    const avgNota = avg(avalsData.map(a => a.nota_final).filter((n): n is number => n !== null && n > 0))

    const contatosData = (contatosRes.data ?? []) as { read: boolean | null }[]
    const unreadCount = contatosData.filter(c => !c.read).length

    setStats({
      upcomingCount: upcoming.length,
      pastCount: past.length,
      newsCount: newsRes.count ?? 0,
      singles,
      eps,
      albums,
      showsCount: showsRes.count ?? 0,
      avalsCount: avalsData.length,
      avalsAvg: avgNota,
      contatosTotal: contatosData.length,
      contatosUnread: unreadCount,
    })
  }

  const s = stats

  const SECTIONS = useMemo(() => [
    {
      href: '/admin/eventos',
      label: 'Eventos',
      icon: Calendar,
      value: s ? s.upcomingCount + s.pastCount : undefined,
      sub: s ? (
        <CardSub>
          <SubStat $green><strong>{s.upcomingCount}</strong> próximos</SubStat>
          <SubStat><strong>{s.pastCount}</strong> passados</SubStat>
        </CardSub>
      ) : null,
    },
    {
      href: '/admin/novidades',
      label: 'Novidades',
      icon: Newspaper,
      value: s ? s.newsCount : undefined,
      sub: null,
    },
    {
      href: '/admin/releases',
      label: 'Releases',
      icon: Disc3,
      value: s ? s.singles + s.eps + s.albums : undefined,
      sub: s ? (
        <CardSub>
          <SubStat><strong>{s.singles}</strong> singles</SubStat>
          <SubStat><strong>{s.eps}</strong> EPs</SubStat>
        </CardSub>
      ) : null,
    },
    {
      href: '/admin/avaliacoes',
      label: 'Avaliações',
      icon: Star,
      value: s ? fmtAvg(s.avalsAvg) : undefined,
      sub: s ? (
        <CardSub>
          <SubStat><strong>{s.showsCount}</strong> shows</SubStat>
          <SubStat><strong>{s.avalsCount}</strong> avaliações</SubStat>
        </CardSub>
      ) : null,
    },
    {
      href: '/admin/contatos',
      label: 'Contatos',
      icon: MessageSquare,
      value: s ? s.contatosTotal : undefined,
      sub: s && s.contatosUnread > 0 ? (
        <CardSub>
          <SubStat $green><strong>{s.contatosUnread}</strong> não lida{s.contatosUnread !== 1 ? 's' : ''}</SubStat>
        </CardSub>
      ) : null,
    },
    { href: '/admin/media',    label: 'Imprensa', icon: Image,    value: null, sub: null },
    { href: '/admin/links',    label: 'Links',    icon: Link2,    value: null, sub: null },
  ], [s])

  return (
    <AdminLayout title="Dashboard" subtitle="Bem-vindo ao painel de administração">
      <Grid>
        {SECTIONS.map(({ href, label, icon: Icon, value, sub }) => (
          <Card key={href} onClick={() => router.push(href)}>
            <Icon />
            <CardLabel>{label}</CardLabel>
            {value === undefined && <Spinner />}
            {value !== null && value !== undefined && <CardValue>{value}</CardValue>}
            {sub}
          </Card>
        ))}
      </Grid>
    </AdminLayout>
  )
}
