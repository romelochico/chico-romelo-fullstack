import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import AdminLayout from '../../../components/Admin/AdminLayout'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '../../../lib/supabase/client'
import { StarsDisplay } from '../../../components/StarRating/StarRating'
import { SET_LIST, avg, fmtAvg, fmtDate } from '../../../lib/avaliacoes'
import {
  BackLink,
  AvaliarLink,
  AiSummaryBtn,
  AiSummaryBox,
  AiSummarySubheading,
  AiSummaryError,
  SummaryGrid,
  SummaryCard,
  SummaryVal,
  SummaryLabel,
  SectionLabel,
  MusicaBlock,
  MusicaHeader,
  MusicaNum,
  MusicaTitle,
  MusicaAvg,
  MusicaChevron,
  MusicaBody,
  Table,
  Th,
  Td,
  PersonName,
  AuthorAvatar,
  NotasGrid,
  NotaColTitle,
  NotaDot,
  NotaItem,
  NotaAuthor,
  CommentCard,
  CommentAuthor,
  CommentBody,
  Loading,
} from '../../../styles/pages/AvaliacoesShowAdmin.styles'

function Author({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
  return (
    <>
      <AuthorAvatar>
        {avatarUrl ? (
          <Image src={avatarUrl} alt="" fill sizes="18px" />
        ) : (
          name.trim().charAt(0).toUpperCase()
        )}
      </AuthorAvatar>
      {name}
    </>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface BandaEntry {
  nota: number
  comentario?: string
}

interface MusicaEntry {
  bem?: string
  melhorar?: string
  minha?: Record<string, number | string>
  banda?: Record<string, BandaEntry>
}

interface AvaliacaoRow {
  id: string
  show_id: string
  user_id: string
  avaliador: string
  avatar_url?: string | null
  papel?: string | null
  nota_final: number
  geral_entrosamento: number
  geral_energia: number
  geral_afinacao?: number
  geral_dinamica?: number
  geral_comentarios?: string | null
  apres_postura: number
  apres_profissionalismo: number
  apres_pontualidade?: number
  apres_publico?: number
  apres_logistica?: number
  apres_comentarios?: string | null
  obs_bem?: string | null
  obs_melhorar?: string | null
  obs_livres?: string | null
  musicas?: Record<string, MusicaEntry>
  submetido_em?: string | null
}

interface ShowRow {
  id: string
  nome: string
  data_show: string
  local?: string | null
  resumo_ia?: string | null
}

const MIN_AVALIACOES_PARA_RESUMO = 5
const ACOES_HEADER = 'Ações para o próximo show'
const RECLAMACOES_HEADER = 'Reclamações recorrentes'

function splitSummary(text: string): { reclamacoes: string; acoes: string } | null {
  const idx = text.indexOf(ACOES_HEADER)
  if (idx === -1) return null
  const reclamacoes = text.slice(0, idx).replace(RECLAMACOES_HEADER, '').trim()
  const acoes = text.slice(idx).replace(ACOES_HEADER, '').trim()
  return { reclamacoes, acoes }
}

// ─── MusicaSection ────────────────────────────────────────────────────────────

interface MusicaSectionProps {
  nome: string
  index: number
  data: AvaliacaoRow[]
}

function MusicaSection({ nome, index, data }: MusicaSectionProps) {
  const [open, setOpen] = useState(false)

  const bandaNotas = data.flatMap(r => {
    const m = r.musicas?.[nome]
    if (!m) return []
    return Object.values(m.banda ?? {})
      .map(b => b?.nota)
      .filter((v): v is number => typeof v === 'number' && v > 0)
  })
  const avgBanda = avg(bandaNotas)

  const bems = data
    .filter(r => r.musicas?.[nome]?.bem)
    .map(r => ({ texto: r.musicas![nome].bem!, autor: r.avaliador, avatarUrl: r.avatar_url }))
  const mels = data
    .filter(r => r.musicas?.[nome]?.melhorar)
    .map(r => ({ texto: r.musicas![nome].melhorar!, autor: r.avaliador, avatarUrl: r.avatar_url }))

  return (
    <MusicaBlock>
      <MusicaHeader onClick={() => setOpen(o => !o)}>
        <MusicaNum>{index + 1}</MusicaNum>
        <MusicaTitle>{nome}</MusicaTitle>
        <MusicaAvg>{avgBanda > 0 ? fmtAvg(avgBanda) + '/5' : '—'}</MusicaAvg>
        <MusicaChevron $open={open}>▼</MusicaChevron>
      </MusicaHeader>

      <MusicaBody $open={open}>
        <Table>
          <thead>
            <tr>
              <Th>Membro</Th>
              <Th>Papel</Th>
              <Th>Minha performance</Th>
            </tr>
          </thead>
          <tbody>
            {data.map(r => {
              const m = r.musicas?.[nome]
              const minha = m?.minha ?? {}
              const aspectos = Object.entries(minha)
                .filter(([, v]) => typeof v === 'number' && (v as number) > 0)
                .map(([k, v]) => `${k}: ${fmtAvg(v as number)}★`)
                .join('  ')
              const nota = minha['direcao_txt'] ?? minha['minha_txt']
              return (
                <tr key={r.id}>
                  <Td>
                    <PersonName>
                      <Author name={r.avaliador} avatarUrl={r.avatar_url} />
                    </PersonName>
                  </Td>
                  <Td style={{ fontSize: 12, color: '#878766' }}>{r.papel ?? ''}</Td>
                  <Td>
                    {aspectos || '—'}
                    {typeof nota === 'string' && nota.trim() && (
                      <div
                        style={{
                          fontSize: 12,
                          color: '#878766',
                          fontStyle: 'italic',
                          marginTop: 4,
                        }}
                      >
                        {nota}
                      </div>
                    )}
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </Table>

        {data.some(r => Object.values(r.musicas?.[nome]?.banda ?? {}).some(b => b?.nota > 0)) && (
          <>
            <div
              style={{
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: '#878766',
                margin: '12px 0 6px',
              }}
            >
              Como cada membro avaliou os outros
            </div>
            {data.map(r => {
              const m = r.musicas?.[nome]
              if (!m?.banda) return null
              const entradas = Object.entries(m.banda).filter(([, v]) => (v?.nota ?? 0) > 0)
              if (!entradas.length) return null
              return (
                <CommentCard key={r.id} style={{ marginBottom: 6 }}>
                  <CommentAuthor>
                    <Author name={r.avaliador} avatarUrl={r.avatar_url} /> avaliou:
                  </CommentAuthor>
                  {entradas.map(([papel, v]) => (
                    <div
                      key={papel}
                      style={{
                        fontSize: 13,
                        padding: '3px 0',
                        borderBottom: '1px solid rgba(64,64,21,0.08)',
                      }}
                    >
                      <span style={{ color: '#404015', fontWeight: 600 }}>{papel}</span>
                      {' — '}
                      <StarsDisplay value={v.nota} size={12} />
                      {v.comentario && (
                        <div style={{ fontSize: 12, color: '#878766', fontStyle: 'italic' }}>
                          {v.comentario}
                        </div>
                      )}
                    </div>
                  ))}
                </CommentCard>
              )
            })}
          </>
        )}

        {(bems.length > 0 || mels.length > 0) && (
          <NotasGrid>
            <div>
              <NotaColTitle>
                <NotaDot $green />O que correu bem
              </NotaColTitle>
              {bems.length > 0 ? (
                bems.map((n, i) => (
                  <NotaItem key={i} $green>
                    {n.texto}
                    <NotaAuthor>
                      <Author name={n.autor} avatarUrl={n.avatarUrl} />
                    </NotaAuthor>
                  </NotaItem>
                ))
              ) : (
                <span style={{ fontSize: 13, color: '#878766' }}>—</span>
              )}
            </div>
            <div>
              <NotaColTitle>
                <NotaDot />O que melhorar
              </NotaColTitle>
              {mels.length > 0 ? (
                mels.map((n, i) => (
                  <NotaItem key={i}>
                    {n.texto}
                    <NotaAuthor>
                      <Author name={n.autor} avatarUrl={n.avatarUrl} />
                    </NotaAuthor>
                  </NotaItem>
                ))
              ) : (
                <span style={{ fontSize: 13, color: '#878766' }}>—</span>
              )}
            </div>
          </NotasGrid>
        )}
      </MusicaBody>
    </MusicaBlock>
  )
}

export default function AvaliacoesShowPage() {
  const router = useRouter()
  const { id } = router.query

  const [show, setShow] = useState<ShowRow | null>(null)
  const [data, setData] = useState<AvaliacaoRow[]>([])
  const [loading, setLoading] = useState(true)
  const [userEval, setUserEval] = useState<AvaliacaoRow | null>(null)
  const [summary, setSummary] = useState('')
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [summaryError, setSummaryError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function downloadFile(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleDownloadResumo() {
    setLoadingSummary(true)
    setSummaryError('')
    try {
      const res = await fetch(`/api/admin/avaliacoes/${id}/summary`)
      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? 'Erro ao gerar arquivos.')
      downloadFile(`resumo-${id}.json`, JSON.stringify(body.digest, null, 2), 'application/json')
      downloadFile(`prompt-${id}.txt`, body.prompt as string, 'text/plain')
    } catch (e) {
      setSummaryError(e instanceof Error ? e.message : 'Erro ao gerar arquivos.')
    } finally {
      setLoadingSummary(false)
    }
  }

  function handleUploadClick() {
    fileInputRef.current?.click()
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setLoadingSummary(true)
    setSummaryError('')
    try {
      const parsed = JSON.parse(await file.text())
      if (typeof parsed.summary !== 'string') {
        throw new Error('JSON inválido: campo "summary" não encontrado.')
      }
      const res = await fetch(`/api/admin/avaliacoes/${id}/summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: parsed.summary }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? 'Erro ao salvar resumo.')
      setSummary(body.summary as string)
    } catch (e) {
      setSummaryError(e instanceof Error ? e.message : 'Erro ao processar arquivo.')
    } finally {
      setLoadingSummary(false)
    }
  }

  useEffect(() => {
    if (!id) return
    const supabase = createClient()
    Promise.all([
      supabase.from('shows').select('*').eq('id', id).single(),
      supabase
        .from('avaliacoes')
        .select('*')
        .eq('show_id', id)
        .order('submetido_em', { ascending: false }),
      supabase.auth.getUser(),
    ]).then(
      ([
        { data: showData },
        { data: avalsData },
        {
          data: { user },
        },
      ]) => {
        const showRow = showData as ShowRow | null
        setShow(showRow)
        if (showRow?.resumo_ia) setSummary(showRow.resumo_ia)
        const avals = (avalsData ?? []) as AvaliacaoRow[]
        setData(avals)
        if (user) {
          const mine = avals.find(a => a.user_id === user.id)
          setUserEval(mine ?? null)
        }
        setLoading(false)
      }
    )
  }, [id])

  if (loading) {
    return (
      <AdminLayout title="Avaliações">
        <Loading>Carregando resultados...</Loading>
      </AdminLayout>
    )
  }

  if (!show) {
    return (
      <AdminLayout title="Avaliações">
        <Loading>Show não encontrado.</Loading>
        <Link href="/admin/avaliacoes" passHref legacyBehavior>
          <BackLink>← Voltar</BackLink>
        </Link>
      </AdminLayout>
    )
  }

  const avgNota = avg(
    data.map(r => r.nota_final).filter((n): n is number => typeof n === 'number' && n > 0)
  )
  const avgEntros = avg(
    data.map(r => r.geral_entrosamento).filter((n): n is number => typeof n === 'number' && n > 0)
  )
  const avgEnergia = avg(
    data.map(r => r.geral_energia).filter((n): n is number => typeof n === 'number' && n > 0)
  )
  const avgPostura = avg(
    data.map(r => r.apres_postura).filter((n): n is number => typeof n === 'number' && n > 0)
  )
  const avgProf = avg(
    data
      .map(r => r.apres_profissionalismo)
      .filter((n): n is number => typeof n === 'number' && n > 0)
  )

  const obsBems = data.filter(r => r.obs_bem)
  const obsMels = data.filter(r => r.obs_melhorar)
  const obsLivres = data.filter(r => r.obs_livres)
  const geralComents = data.filter(r => r.geral_comentarios)
  const apresComents = data.filter(r => r.apres_comentarios)

  const eventDate = new Date(show.data_show + 'T00:00:00')
  const hoursElapsed = (Date.now() - eventDate.getTime()) / 36e5
  const canEvaluate = hoursElapsed >= 24 && hoursElapsed < 24 * 10

  return (
    <AdminLayout
      title={show.nome}
      subtitle={fmtDate(show.data_show) + (show.local ? ` · ${show.local}` : '')}
    >
      <div>
        <Link href="/admin/avaliacoes" passHref legacyBehavior>
          <BackLink>← Todos os shows</BackLink>
        </Link>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          {canEvaluate && (
            <Link href={`/admin/avaliacoes/avaliar/${id}`} passHref legacyBehavior>
              <AvaliarLink>{userEval ? 'Editar avaliação →' : 'Avaliar este show →'}</AvaliarLink>
            </Link>
          )}

          {!summary && data.length >= MIN_AVALIACOES_PARA_RESUMO && (
            <>
              <AiSummaryBtn onClick={handleDownloadResumo} disabled={loadingSummary}>
                {loadingSummary ? 'Gerando...' : 'Baixar Resumo'}
              </AiSummaryBtn>
              <AiSummaryBtn onClick={handleUploadClick} disabled={loadingSummary}>
                Carregar Resumo
              </AiSummaryBtn>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                style={{ display: 'none' }}
                onChange={handleFileSelected}
              />
            </>
          )}
        </div>

        {summaryError && <AiSummaryError>{summaryError}</AiSummaryError>}

        {data.length === 0 ? (
          <Loading>Nenhuma avaliação submetida ainda.</Loading>
        ) : (
          <>
            <SummaryGrid>
              <SummaryCard>
                <SummaryVal>{fmtAvg(avgNota)}</SummaryVal>
                <SummaryLabel>Nota média</SummaryLabel>
              </SummaryCard>
              <SummaryCard>
                <SummaryVal>{data.length}</SummaryVal>
                <SummaryLabel>Avaliações</SummaryLabel>
              </SummaryCard>
              <SummaryCard>
                <SummaryVal>{fmtAvg(avgEntros)}</SummaryVal>
                <SummaryLabel>Entrosamento</SummaryLabel>
              </SummaryCard>
              <SummaryCard>
                <SummaryVal>{fmtAvg(avgEnergia)}</SummaryVal>
                <SummaryLabel>Energia</SummaryLabel>
              </SummaryCard>
              <SummaryCard>
                <SummaryVal>{fmtAvg(avgPostura)}</SummaryVal>
                <SummaryLabel>Presença</SummaryLabel>
              </SummaryCard>
              <SummaryCard>
                <SummaryVal>{fmtAvg(avgProf)}</SummaryVal>
                <SummaryLabel>Profissionalismo</SummaryLabel>
              </SummaryCard>
            </SummaryGrid>

            <SectionLabel>Por música</SectionLabel>
            {SET_LIST.map((nome, i) => (
              <MusicaSection key={nome} nome={nome} index={i} data={data} />
            ))}

            <SectionLabel>Performance geral da banda</SectionLabel>
            <Table>
              <thead>
                <tr>
                  <Th>Membro</Th>
                  <Th>Entrosamento</Th>
                  <Th>Energia</Th>
                  <Th>Afinação</Th>
                  <Th>Dinâmica</Th>
                </tr>
              </thead>
              <tbody>
                {data.map(r => (
                  <tr key={r.id}>
                    <Td>
                      <PersonName>
                        <Author name={r.avaliador} avatarUrl={r.avatar_url} />
                      </PersonName>
                    </Td>
                    <Td>
                      {(r.geral_entrosamento ?? 0) > 0 ? (
                        <StarsDisplay value={r.geral_entrosamento} />
                      ) : (
                        '—'
                      )}
                    </Td>
                    <Td>
                      {(r.geral_energia ?? 0) > 0 ? <StarsDisplay value={r.geral_energia} /> : '—'}
                    </Td>
                    <Td>
                      {(r.geral_afinacao ?? 0) > 0 ? (
                        <StarsDisplay value={r.geral_afinacao!} />
                      ) : (
                        '—'
                      )}
                    </Td>
                    <Td>
                      {(r.geral_dinamica ?? 0) > 0 ? (
                        <StarsDisplay value={r.geral_dinamica!} />
                      ) : (
                        '—'
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {geralComents.map(r => (
              <CommentCard key={r.id}>
                <CommentAuthor>
                  <Author name={r.avaliador} avatarUrl={r.avatar_url} />
                </CommentAuthor>
                <CommentBody>{r.geral_comentarios}</CommentBody>
              </CommentCard>
            ))}

            <SectionLabel>Apresentação e comportamento</SectionLabel>
            <Table>
              <thead>
                <tr>
                  <Th>Membro</Th>
                  <Th>Pontualidade</Th>
                  <Th>Postura</Th>
                  <Th>Público</Th>
                  <Th>Logística</Th>
                  <Th>Profiss.</Th>
                </tr>
              </thead>
              <tbody>
                {data.map(r => (
                  <tr key={r.id}>
                    <Td>
                      <PersonName>
                        <Author name={r.avaliador} avatarUrl={r.avatar_url} />
                      </PersonName>
                    </Td>
                    <Td>
                      {(r.apres_pontualidade ?? 0) > 0 ? (
                        <StarsDisplay value={r.apres_pontualidade!} />
                      ) : (
                        '—'
                      )}
                    </Td>
                    <Td>
                      {(r.apres_postura ?? 0) > 0 ? <StarsDisplay value={r.apres_postura} /> : '—'}
                    </Td>
                    <Td>
                      {(r.apres_publico ?? 0) > 0 ? <StarsDisplay value={r.apres_publico!} /> : '—'}
                    </Td>
                    <Td>
                      {(r.apres_logistica ?? 0) > 0 ? (
                        <StarsDisplay value={r.apres_logistica!} />
                      ) : (
                        '—'
                      )}
                    </Td>
                    <Td>
                      {(r.apres_profissionalismo ?? 0) > 0 ? (
                        <StarsDisplay value={r.apres_profissionalismo} />
                      ) : (
                        '—'
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {apresComents.map(r => (
              <CommentCard key={r.id}>
                <CommentAuthor>
                  <Author name={r.avaliador} avatarUrl={r.avatar_url} />
                </CommentAuthor>
                <CommentBody>{r.apres_comentarios}</CommentBody>
              </CommentCard>
            ))}

            {(obsBems.length > 0 || obsMels.length > 0) && (
              <>
                <SectionLabel>Observações finais</SectionLabel>
                <NotasGrid>
                  <div>
                    <NotaColTitle>
                      <NotaDot $green />O que foi bem
                    </NotaColTitle>
                    {obsBems.map(r => (
                      <NotaItem key={r.id} $green>
                        {r.obs_bem}
                        <NotaAuthor>
                          <Author name={r.avaliador} avatarUrl={r.avatar_url} />
                        </NotaAuthor>
                      </NotaItem>
                    ))}
                  </div>
                  <div>
                    <NotaColTitle>
                      <NotaDot />O que melhorar
                    </NotaColTitle>
                    {obsMels.map(r => (
                      <NotaItem key={r.id}>
                        {r.obs_melhorar}
                        <NotaAuthor>
                          <Author name={r.avaliador} avatarUrl={r.avatar_url} />
                        </NotaAuthor>
                      </NotaItem>
                    ))}
                  </div>
                </NotasGrid>
              </>
            )}

            {obsLivres.map(r => (
              <CommentCard key={r.id}>
                <CommentAuthor>
                  <Author name={r.avaliador} avatarUrl={r.avatar_url} /> — observações livres
                </CommentAuthor>
                <CommentBody>{r.obs_livres}</CommentBody>
              </CommentCard>
            ))}

            {summary &&
              (() => {
                const parts = splitSummary(summary)
                return (
                  <>
                    <SectionLabel>Resumo Médio das Avaliações</SectionLabel>
                    {parts ? (
                      <>
                        <AiSummarySubheading>{RECLAMACOES_HEADER}</AiSummarySubheading>
                        <AiSummaryBox>{parts.reclamacoes}</AiSummaryBox>
                        <AiSummarySubheading>{ACOES_HEADER}</AiSummarySubheading>
                        <AiSummaryBox>{parts.acoes}</AiSummaryBox>
                      </>
                    ) : (
                      <AiSummaryBox>{summary}</AiSummaryBox>
                    )}
                  </>
                )
              })()}
          </>
        )}
      </div>
    </AdminLayout>
  )
}
