import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '../../../lib/supabase/client'
import AdminLayout from '../../../components/Admin/AdminLayout'
import { avg, fmtAvg, fmtDate, TODOS_PAPEIS } from '../../../lib/avaliacoes'
import {
  StatsBar,
  StatItem,
  StatVal,
  StatLabel,
  StatDivider,
  SortBar,
  SortBtn,
  SectionHead,
  SectionTitle,
  ShowsGrid,
  ShowCard,
  ShowName,
  ShowMeta,
  ShowBadges,
  Badge,
  ShowArrow,
  EmptyShows,
  CriarSection,
  CriarInner,
  FormTitle,
  FieldGrid,
  FieldFull,
  Field,
  FieldLabel,
  FieldInput,
  PapeisGrid,
  PapelToggle,
  SubmitBtn,
  ExistingShows,
  ExistingCard,
  ExistingInfo,
  ExistingName,
  ExistingMeta,
  DeleteBtn,
  Toast,
} from '../../../styles/pages/AvaliacoesAdmin.styles'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ShowRow {
  id: string
  nome: string
  data_show: string
  local?: string | null
  papeis?: string[]
}

interface ShowStat {
  count: number
  avgNota: number
}

interface GlobalStats {
  totalShows: number
  totalAvals: number
  avgNota: number
}

export default function AvaliacoesPage() {
  const [shows, setShows] = useState<ShowRow[]>([])
  const [showStats, setShowStats] = useState<Record<string, ShowStat>>({})
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalShows: 0,
    totalAvals: 0,
    avgNota: 0,
  })
  const [loading, setLoading] = useState(true)

  const [dataShow, setDataShow] = useState('')
  const [nomeShow, setNomeShow] = useState('')
  const [localShow, setLocalShow] = useState('')
  const [papeis, setPapeis] = useState(new Set<string>())
  const [criando, setCriando] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [toast, setToast] = useState({ show: false, msg: '', error: false })
  const [sortBy, setSortBy] = useState('latest')

  const supabase = createClient()

  const showToast = (msg: string, error = false) => {
    setToast({ show: true, msg, error })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500)
  }

  const loadData = useCallback(async () => {
    try {
      const [{ data: showsData }, { data: avalsData }] = await Promise.all([
        supabase.from('shows').select('*').order('data_show', { ascending: false }),
        supabase.from('avaliacoes').select('show_id, nota_final'),
      ])

      const perShow: Record<string, { count: number; notas: number[] }> = {}
      ;((avalsData ?? []) as { show_id: string; nota_final: number | null }[]).forEach(a => {
        if (!a.show_id) return
        if (!perShow[a.show_id]) perShow[a.show_id] = { count: 0, notas: [] }
        perShow[a.show_id].count++
        if ((a.nota_final ?? 0) > 0) perShow[a.show_id].notas.push(a.nota_final!)
      })

      const stats: Record<string, ShowStat> = {}
      Object.entries(perShow).forEach(([id, { count, notas }]) => {
        stats[id] = { count, avgNota: avg(notas) }
      })

      const allNotas = ((avalsData ?? []) as { nota_final: number | null }[])
        .map(a => a.nota_final)
        .filter((n): n is number => typeof n === 'number' && n > 0)
      setGlobalStats({
        totalShows: (showsData ?? []).length,
        totalAvals: (avalsData ?? []).length,
        avgNota: avg(allNotas),
      })

      setShows((showsData ?? []) as unknown as ShowRow[])
      setShowStats(stats)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadData()
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        setIsSuperAdmin(user?.email === 'romelochico@gmail.com')
      })
  }, [loadData])

  const togglePapel = (p: string) => {
    setPapeis(prev => {
      const next = new Set(prev)
      next.has(p) ? next.delete(p) : next.add(p)
      return next
    })
  }

  const criarShow = async () => {
    if (!dataShow) {
      showToast('Selecione a data do show.', true)
      return
    }
    if (!nomeShow.trim()) {
      showToast('Escreva o nome do evento.', true)
      return
    }
    if (papeis.size === 0) {
      showToast('Selecione pelo menos um papel.', true)
      return
    }

    setCriando(true)
    const { error } = await supabase.from('shows').insert({
      data_show: dataShow,
      nome: nomeShow.trim(),
      local: localShow.trim() || null,
      papeis: Array.from(papeis),
    })

    if (error) {
      showToast('Erro ao criar show.', true)
    } else {
      showToast('✓ Show criado!')
      setDataShow('')
      setNomeShow('')
      setLocalShow('')
      setPapeis(new Set())
      loadData()
    }
    setCriando(false)
  }

  const deletarShow = async (id: string) => {
    if (!confirm('Apagar este show? As avaliações associadas ficam na base de dados.')) return
    const { error } = await supabase.from('shows').delete().eq('id', id)
    if (error) showToast('Erro ao apagar.', true)
    else {
      showToast('Show apagado.')
      loadData()
    }
  }

  return (
    <AdminLayout title="Avaliações" subtitle="Gestão de shows e feedback pós-show">
      <>
        {/* Stats */}
        <StatsBar>
          <StatItem>
            <StatVal>{globalStats.totalShows}</StatVal>
            <StatLabel>Shows</StatLabel>
          </StatItem>
          <StatDivider />
          <StatItem>
            <StatVal>{globalStats.totalAvals}</StatVal>
            <StatLabel>Avaliações</StatLabel>
          </StatItem>
          <StatDivider />
          <StatItem>
            <StatVal>{fmtAvg(globalStats.avgNota)}</StatVal>
            <StatLabel>Média geral</StatLabel>
          </StatItem>
        </StatsBar>

        {/* Shows */}
        <div style={{ marginBottom: 8 }}>
          <SectionHead>
            <SectionTitle>Shows</SectionTitle>
          </SectionHead>

          {!loading && shows.length > 0 && (
            <SortBar>
              {[
                { key: 'latest', label: 'Mais recente' },
                { key: 'oldest', label: 'Mais antigo' },
                { key: 'highest', label: '★ Melhor nota' },
                { key: 'lowest', label: '★ Pior nota' },
              ].map(({ key, label }) => (
                <SortBtn key={key} $active={sortBy === key} onClick={() => setSortBy(key)}>
                  {label}
                </SortBtn>
              ))}
            </SortBar>
          )}

          {loading ? (
            <EmptyShows>Carregando...</EmptyShows>
          ) : shows.length === 0 ? (
            <EmptyShows>Nenhum show criado ainda.</EmptyShows>
          ) : (
            <ShowsGrid>
              {[...shows]
                .sort((a, b) => {
                  const sa = showStats[a.id] ?? { count: 0, avgNota: 0 }
                  const sb = showStats[b.id] ?? { count: 0, avgNota: 0 }
                  if (sortBy === 'latest')
                    return new Date(b.data_show).getTime() - new Date(a.data_show).getTime()
                  if (sortBy === 'oldest')
                    return new Date(a.data_show).getTime() - new Date(b.data_show).getTime()
                  if (sortBy === 'highest') return sb.avgNota - sa.avgNota
                  if (sortBy === 'lowest') return sa.avgNota - sb.avgNota
                  return 0
                })
                .map(s => {
                  const st = showStats[s.id] ?? { count: 0, avgNota: 0 }
                  return (
                    <Link key={s.id} href={`/admin/avaliacoes/${s.id}`} passHref legacyBehavior>
                      <ShowCard>
                        <ShowName>{s.nome}</ShowName>
                        <ShowMeta>
                          {fmtDate(s.data_show)}
                          {s.local ? ` · ${s.local}` : ''}
                        </ShowMeta>
                        <ShowBadges>
                          {st.count > 0 && (
                            <Badge>
                              {st.count} avaliação{st.count !== 1 ? 'ões' : ''}
                            </Badge>
                          )}
                          {st.avgNota > 0 && <Badge>★ {fmtAvg(st.avgNota)}</Badge>}
                          {st.count === 0 && <Badge>Sem avaliações</Badge>}
                        </ShowBadges>
                        <ShowArrow>→</ShowArrow>
                      </ShowCard>
                    </Link>
                  )
                })}
            </ShowsGrid>
          )}
        </div>

        {/* Criar show */}
        <CriarSection>
          <CriarInner>
            <FormTitle>Criar Show</FormTitle>

            <FieldGrid>
              <Field>
                <FieldLabel htmlFor="data-show">Data do show</FieldLabel>
                <FieldInput
                  id="data-show"
                  type="date"
                  value={dataShow}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDataShow(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="nome-show">Nome do evento</FieldLabel>
                <FieldInput
                  id="nome-show"
                  type="text"
                  placeholder="ex: São João, Festa X"
                  value={nomeShow}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNomeShow(e.target.value)}
                />
              </Field>
              <FieldFull>
                <Field>
                  <FieldLabel htmlFor="local-show">Local</FieldLabel>
                  <FieldInput
                    id="local-show"
                    type="text"
                    placeholder="ex: Parque da Paz, Almada"
                    value={localShow}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setLocalShow(e.target.value)
                    }
                  />
                </Field>
              </FieldFull>
            </FieldGrid>

            <FieldLabel as="div" style={{ marginBottom: 10, marginTop: 8 }}>
              Quem tocou neste show
            </FieldLabel>
            <PapeisGrid>
              {TODOS_PAPEIS.map(p => (
                <PapelToggle key={p} $on={papeis.has(p)} onClick={() => togglePapel(p)}>
                  {papeis.has(p) ? '✓ ' : ''}
                  {p}
                </PapelToggle>
              ))}
            </PapeisGrid>

            <SubmitBtn onClick={criarShow} disabled={criando}>
              {criando ? 'Criando...' : 'Criar show'}
            </SubmitBtn>

            {shows.length > 0 && (
              <ExistingShows>
                <FieldLabel as="div" style={{ marginBottom: 12 }}>
                  Shows criados
                </FieldLabel>
                {shows.map(s => (
                  <ExistingCard key={s.id}>
                    <ExistingInfo>
                      <ExistingName>{s.nome}</ExistingName>
                      <ExistingMeta>
                        {fmtDate(s.data_show)}
                        {s.local ? ` · ${s.local}` : ''}
                      </ExistingMeta>
                    </ExistingInfo>
                    {isSuperAdmin && (
                      <DeleteBtn onClick={() => deletarShow(s.id)}>Apagar</DeleteBtn>
                    )}
                  </ExistingCard>
                ))}
              </ExistingShows>
            )}
          </CriarInner>
        </CriarSection>
      </>

      <Toast $show={toast.show} $error={toast.error}>
        {toast.msg}
      </Toast>
    </AdminLayout>
  )
}
