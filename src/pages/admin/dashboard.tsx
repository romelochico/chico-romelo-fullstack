import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import styled, { keyframes } from 'styled-components'
import { Calendar, Newspaper, Disc3, Image, Link2, MessageSquare, Star, Package, AlertTriangle } from 'lucide-react'
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
    --cell: calc((100dvh - 152px) / 4);
    grid-template-columns: repeat(2, var(--cell));
    grid-template-rows: repeat(4, var(--cell));
    gap: 8px;
    justify-content: center;
  }
`

const Card = styled.div<{ $alert?: boolean }>`
  background: ${({ $alert }) => $alert ? 'rgba(248,113,113,0.08)' : 'rgba(255,255,255,0.06)'};
  border: 1px solid ${({ $alert }) => $alert ? 'rgba(248,113,113,0.35)' : 'rgba(255,255,255,0.13)'};
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.1s;

  &:hover {
    background: ${({ $alert }) => $alert ? 'rgba(248,113,113,0.12)' : 'rgba(255,255,255,0.09)'};
    border-color: ${({ $alert }) => $alert ? 'rgba(248,113,113,0.55)' : 'rgba(200,169,110,0.35)'};
    transform: translateY(-1px);
  }

  svg { color: ${({ $alert }) => $alert ? '#f87171' : '#c8a96e'}; width: 22px; height: 22px; }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    aspect-ratio: 1;
    padding: 12px;
    gap: 5px;
    svg { width: 16px; height: 16px; }
  }
`

const CardLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.55);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 9px;
    letter-spacing: 0.06em;
  }
`

const CardValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 36px;
  color: #f5f0e8;
  line-height: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 24px;
  }
`

const CardSub = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 2px;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 1px;
    margin-top: 0;
  }
`

const spin = keyframes`to { transform: rotate(360deg); }`

const Spinner = styled.span`
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.12);
  border-top-color: #c8a96e;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  margin: 9px 0;
`

const SubStat = styled.span<{ $green?: boolean; $red?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  color: rgba(245,240,232,0.45);

  strong {
    font-weight: 700;
    color: ${({ $green, $red }) => $red ? '#f87171' : $green ? '#4ade80' : 'rgba(245,240,232,0.85)'};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 10px;
  }
`

const ALERT_WINDOW_DAYS = 7

function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(`${dateStr}T00:00:00`)
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

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
  linksCount: number
  credsCount: number
  inventoryItems: number
  inventoryUnits: number
  openCallsTotal: number
  openCallsUrgent: number
  nextUrgentOpenCall: { name: string; days: number } | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashStats | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const supabase = createClient()

    const [eventsRes, newsRes, releasesRes, showsRes, avalsRes, contatosRes, linksRes, credsRes, inventoryRes, openCallsRes] = await Promise.all([
      supabase.from('events').select('date'),
      supabase.from('news').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('releases').select('type'),
      supabase.from('shows').select('id', { count: 'exact', head: true }),
      supabase.from('avaliacoes').select('nota_final'),
      supabase.from('contatos').select('read'),
      supabase.from('links').select('id', { count: 'exact', head: true }),
      supabase.from('credentials').select('id', { count: 'exact', head: true }),
      supabase.from('inventory').select('id, quantity'),
      supabase.from('open_calls').select('id, name, application_date'),
    ])

    const openCallsData = (openCallsRes.data ?? []) as { id: string; name: string; application_date: string }[]
    const currentOpenCalls = openCallsData
      .map(oc => ({ name: oc.name, days: daysUntil(oc.application_date) }))
      .filter(oc => oc.days >= 0)
    const urgentCalls = currentOpenCalls
      .filter(oc => oc.days <= ALERT_WINDOW_DAYS)
      .sort((a, b) => a.days - b.days)

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
      linksCount: linksRes.count ?? 0,
      credsCount: credsRes.count ?? 0,
      inventoryItems: (inventoryRes.data ?? []).length,
      inventoryUnits: (inventoryRes.data ?? [] as { quantity: number }[]).reduce((s: number, i: { quantity: number }) => s + (i.quantity ?? 0), 0),
      openCallsTotal: currentOpenCalls.length,
      openCallsUrgent: urgentCalls.length,
      nextUrgentOpenCall: urgentCalls[0] ?? null,
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
    { href: '/admin/media',      label: 'Imprensa',          icon: Image,   value: null, sub: null },
    {
      href: '/admin/inventario',
      label: 'Inventário',
      icon: Package,
      value: s ? s.inventoryUnits : undefined,
      sub: s ? (
        <CardSub>
          <SubStat><strong>{s.inventoryItems}</strong> tipo{s.inventoryItems !== 1 ? 's' : ''}</SubStat>
          <SubStat><strong>{s.inventoryUnits}</strong> unidades</SubStat>
        </CardSub>
      ) : null,
    },
    {
      href: '/admin/links',
      label: 'Links e Credenciais',
      icon: Link2,
      value: s ? s.linksCount + s.credsCount : undefined,
      sub: s ? (
        <CardSub>
          <SubStat><strong>{s.linksCount}</strong> links</SubStat>
          <SubStat><strong>{s.credsCount}</strong> credenciais</SubStat>
        </CardSub>
      ) : null,
    },
    {
      href: '/admin/open-calls',
      label: 'Open Calls',
      icon: AlertTriangle,
      value: s ? s.openCallsTotal : undefined,
      alert: !!s && s.openCallsUrgent > 0,
      sub: s && s.nextUrgentOpenCall ? (
        <CardSub>
          <SubStat $red>
            <strong>{s.nextUrgentOpenCall.name}</strong> fecha em {s.nextUrgentOpenCall.days} dia{s.nextUrgentOpenCall.days !== 1 ? 's' : ''}
          </SubStat>
        </CardSub>
      ) : null,
    },
  ], [s])

  return (
    <AdminLayout title="Dashboard" subtitle="Bem-vindo ao painel de administração">
      <Grid>
        {SECTIONS.map(({ href, label, icon: Icon, value, sub, alert }) => (
          <Card key={href} $alert={alert} onClick={() => router.push(href)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Icon />
            </div>
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
