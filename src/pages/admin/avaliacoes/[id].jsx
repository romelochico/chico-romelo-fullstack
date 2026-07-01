import Link from 'next/link'
import { useRouter } from 'next/router'
import AdminLayout from '../../../components/Admin/AdminLayout'
import { useEffect, useState } from 'react'
import { createClient } from '../../../lib/supabase/client'
import { StarsDisplay } from '../../../components/StarRating/StarRating'
import { SET_LIST, avg, fmtAvg, fmtDate } from '../../../lib/avaliacoes'
import {
  BackLink, AvaliarLink,
  SummaryGrid, SummaryCard, SummaryVal, SummaryLabel, SectionLabel,
  MusicaBlock, MusicaHeader, MusicaNum, MusicaTitle, MusicaAvg, MusicaChevron, MusicaBody,
  Table, Th, Td, PersonName,
  NotasGrid, NotaColTitle, NotaDot, NotaItem, NotaAuthor,
  CommentCard, CommentAuthor, CommentBody, Loading,
} from '../../../styles/pages/AvaliacoesShowAdmin.styles'

function MusicaSection({ nome, index, data }) {
  const [open, setOpen] = useState(false)

  const bandaNotas = data.flatMap(r => {
    const m = r.musicas?.[nome]; if (!m) return []
    return Object.values(m.banda || {}).map(b => b?.nota).filter(v => v > 0)
  })
  const avgBanda = avg(bandaNotas)

  const bems = data.filter(r => r.musicas?.[nome]?.bem).map(r => ({ texto: r.musicas[nome].bem, autor: r.avaliador }))
  const mels = data.filter(r => r.musicas?.[nome]?.melhorar).map(r => ({ texto: r.musicas[nome].melhorar, autor: r.avaliador }))

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
                .filter(([, v]) => typeof v === 'number' && v > 0)
                .map(([k, v]) => `${k}: ${fmtAvg(v)}★`)
                .join('  ')
              return (
                <tr key={r.id}>
                  <Td><PersonName>{r.avaliador}</PersonName></Td>
                  <Td style={{ fontSize: 12, color: '#878766' }}>{r.papel ?? ''}</Td>
                  <Td>
                    {aspectos || '—'}
                    {typeof minha.direcao_txt === 'string' && minha.direcao_txt.trim() && (
                      <div style={{ fontSize: 12, color: '#878766', fontStyle: 'italic', marginTop: 4 }}>
                        {minha.direcao_txt}
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
            <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: '#878766', margin: '12px 0 6px' }}>
              Como cada membro avaliou os outros
            </div>
            {data.map(r => {
              const m = r.musicas?.[nome]; if (!m?.banda) return null
              const entradas = Object.entries(m.banda).filter(([, v]) => v?.nota > 0)
              if (!entradas.length) return null
              return (
                <CommentCard key={r.id} style={{ marginBottom: 6 }}>
                  <CommentAuthor>{r.avaliador} avaliou:</CommentAuthor>
                  {entradas.map(([papel, v]) => (
                    <div key={papel} style={{ fontSize: 13, padding: '3px 0', borderBottom: '1px solid rgba(64,64,21,0.08)' }}>
                      <span style={{ color: '#404015', fontWeight: 600 }}>{papel}</span>
                      {' — '}
                      <StarsDisplay value={v.nota} size={12} />
                      {v.comentario && (
                        <div style={{ fontSize: 12, color: '#878766', fontStyle: 'italic' }}>{v.comentario}</div>
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
              <NotaColTitle><NotaDot $green />O que correu bem</NotaColTitle>
              {bems.length > 0
                ? bems.map((n, i) => <NotaItem key={i} $green>{n.texto}<NotaAuthor>{n.autor}</NotaAuthor></NotaItem>)
                : <span style={{ fontSize: 13, color: '#878766' }}>—</span>}
            </div>
            <div>
              <NotaColTitle><NotaDot />O que melhorar</NotaColTitle>
              {mels.length > 0
                ? mels.map((n, i) => <NotaItem key={i}>{n.texto}<NotaAuthor>{n.autor}</NotaAuthor></NotaItem>)
                : <span style={{ fontSize: 13, color: '#878766' }}>—</span>}
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

  const [show, setShow] = useState(null)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [userEval, setUserEval] = useState(null) // existing evaluation by current user

  useEffect(() => {
    if (!id) return
    const supabase = createClient()
    Promise.all([
      supabase.from('shows').select('*').eq('id', id).single(),
      supabase.from('avaliacoes').select('*').eq('show_id', id).order('submetido_em', { ascending: false }),
      supabase.auth.getUser(),
    ]).then(([{ data: showData }, { data: avalsData }, { data: { user } }]) => {
      setShow(showData)
      setData(avalsData ?? [])
      if (user) {
        const mine = (avalsData ?? []).find(a => a.user_id === user.id)
        setUserEval(mine ?? null)
      }
      setLoading(false)
    })
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

  const avgNota    = avg(data.map(r => r.nota_final).filter(n => n > 0))
  const avgEntros  = avg(data.map(r => r.geral_entrosamento).filter(n => n > 0))
  const avgEnergia = avg(data.map(r => r.geral_energia).filter(n => n > 0))
  const avgPostura = avg(data.map(r => r.apres_postura).filter(n => n > 0))
  const avgProf    = avg(data.map(r => r.apres_profissionalismo).filter(n => n > 0))

  const obsBems     = data.filter(r => r.obs_bem)
  const obsMels     = data.filter(r => r.obs_melhorar)
  const obsLivres   = data.filter(r => r.obs_livres)
  const geralComents = data.filter(r => r.geral_comentarios)
  const apresComents = data.filter(r => r.apres_comentarios)

  // Available 24h after event, closes 72h after opening (96h total from event start)
  const eventDate = new Date(show.data_show + 'T00:00:00')
  const hoursElapsed = (Date.now() - eventDate.getTime()) / 36e5
  const canEvaluate = hoursElapsed >= 24 && hoursElapsed < 96

  return (
    <AdminLayout title={show.nome} subtitle={fmtDate(show.data_show) + (show.local ? ` · ${show.local}` : '')}>
      <div>
        <Link href="/admin/avaliacoes" passHref legacyBehavior>
          <BackLink>← Todos os shows</BackLink>
        </Link>

        {canEvaluate && (
          <Link href={`/admin/avaliacoes/avaliar/${id}`} passHref legacyBehavior>
            <AvaliarLink>{userEval ? 'Editar avaliação →' : 'Avaliar este show →'}</AvaliarLink>
          </Link>
        )}

        {data.length === 0 ? (
          <Loading>Nenhuma avaliação submetida ainda.</Loading>
        ) : (
          <>
            <SummaryGrid>
              <SummaryCard><SummaryVal>{fmtAvg(avgNota)}</SummaryVal><SummaryLabel>Nota média</SummaryLabel></SummaryCard>
              <SummaryCard><SummaryVal>{data.length}</SummaryVal><SummaryLabel>Avaliações</SummaryLabel></SummaryCard>
              <SummaryCard><SummaryVal>{fmtAvg(avgEntros)}</SummaryVal><SummaryLabel>Entrosamento</SummaryLabel></SummaryCard>
              <SummaryCard><SummaryVal>{fmtAvg(avgEnergia)}</SummaryVal><SummaryLabel>Energia</SummaryLabel></SummaryCard>
              <SummaryCard><SummaryVal>{fmtAvg(avgPostura)}</SummaryVal><SummaryLabel>Presença</SummaryLabel></SummaryCard>
              <SummaryCard><SummaryVal>{fmtAvg(avgProf)}</SummaryVal><SummaryLabel>Profissionalismo</SummaryLabel></SummaryCard>
            </SummaryGrid>

            <SectionLabel>Por música</SectionLabel>
            {SET_LIST.map((nome, i) => (
              <MusicaSection key={nome} nome={nome} index={i} data={data} />
            ))}

            <SectionLabel>Performance geral da banda</SectionLabel>
            <Table>
              <thead>
                <tr>
                  <Th>Membro</Th><Th>Entrosamento</Th><Th>Energia</Th><Th>Afinação</Th><Th>Dinâmica</Th>
                </tr>
              </thead>
              <tbody>
                {data.map(r => (
                  <tr key={r.id}>
                    <Td><PersonName>{r.avaliador}</PersonName></Td>
                    <Td>{r.geral_entrosamento > 0 ? <StarsDisplay value={r.geral_entrosamento} /> : '—'}</Td>
                    <Td>{r.geral_energia > 0 ? <StarsDisplay value={r.geral_energia} /> : '—'}</Td>
                    <Td>{r.geral_afinacao > 0 ? <StarsDisplay value={r.geral_afinacao} /> : '—'}</Td>
                    <Td>{r.geral_dinamica > 0 ? <StarsDisplay value={r.geral_dinamica} /> : '—'}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {geralComents.map(r => (
              <CommentCard key={r.id}>
                <CommentAuthor>{r.avaliador}</CommentAuthor>
                <CommentBody>{r.geral_comentarios}</CommentBody>
              </CommentCard>
            ))}

            <SectionLabel>Apresentação e comportamento</SectionLabel>
            <Table>
              <thead>
                <tr>
                  <Th>Membro</Th><Th>Pontualidade</Th><Th>Postura</Th><Th>Público</Th><Th>Logística</Th><Th>Profiss.</Th>
                </tr>
              </thead>
              <tbody>
                {data.map(r => (
                  <tr key={r.id}>
                    <Td><PersonName>{r.avaliador}</PersonName></Td>
                    <Td>{r.apres_pontualidade > 0 ? <StarsDisplay value={r.apres_pontualidade} /> : '—'}</Td>
                    <Td>{r.apres_postura > 0 ? <StarsDisplay value={r.apres_postura} /> : '—'}</Td>
                    <Td>{r.apres_publico > 0 ? <StarsDisplay value={r.apres_publico} /> : '—'}</Td>
                    <Td>{r.apres_logistica > 0 ? <StarsDisplay value={r.apres_logistica} /> : '—'}</Td>
                    <Td>{r.apres_profissionalismo > 0 ? <StarsDisplay value={r.apres_profissionalismo} /> : '—'}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {apresComents.map(r => (
              <CommentCard key={r.id}>
                <CommentAuthor>{r.avaliador}</CommentAuthor>
                <CommentBody>{r.apres_comentarios}</CommentBody>
              </CommentCard>
            ))}

            {(obsBems.length > 0 || obsMels.length > 0) && (
              <>
                <SectionLabel>Observações finais</SectionLabel>
                <NotasGrid>
                  <div>
                    <NotaColTitle><NotaDot $green />O que foi bem</NotaColTitle>
                    {obsBems.map(r => <NotaItem key={r.id} $green>{r.obs_bem}<NotaAuthor>{r.avaliador}</NotaAuthor></NotaItem>)}
                  </div>
                  <div>
                    <NotaColTitle><NotaDot />O que melhorar</NotaColTitle>
                    {obsMels.map(r => <NotaItem key={r.id}>{r.obs_melhorar}<NotaAuthor>{r.avaliador}</NotaAuthor></NotaItem>)}
                  </div>
                </NotasGrid>
              </>
            )}

            {obsLivres.map(r => (
              <CommentCard key={r.id}>
                <CommentAuthor>{r.avaliador} — observações livres</CommentAuthor>
                <CommentBody>{r.obs_livres}</CommentBody>
              </CommentCard>
            ))}
          </>
        )}
      </div>
    </AdminLayout>
  )
}
