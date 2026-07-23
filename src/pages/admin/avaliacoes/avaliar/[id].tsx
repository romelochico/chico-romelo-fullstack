import Link from 'next/link'
import { useRouter } from 'next/router'
import AdminLayout from '../../../../components/Admin/AdminLayout'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '../../../../lib/supabase/client'
import StarRating from '../../../../components/StarRating/StarRating'
import { SET_LIST, PAPEIS_ASPECTOS, fmtDate } from '../../../../lib/avaliacoes'
import {
  SectionLabel,
  Field,
  FieldLabel,
  FieldInput as _FieldInput,
  FieldTextarea,
  PapelGrid,
  PapelBtn,
  MusicaCard,
  MusicaCardHeader,
  MusicaNum,
  MusicaName,
  MusicaChevron,
  MusicaBody,
  Cols2,
  ColTitle,
  StarRow,
  StarLabel,
  BandaMember,
  BandaMemberTitle,
  MusicNotes,
  NoteBlock,
  NoteLabel,
  NoteDot,
  NoteTextarea,
  GeneralBlock,
  NotaRow,
  NotaLabel,
  SubmitArea,
  SubmitBtn,
  SuccessBox,
  Toast,
} from '../../../../styles/pages/AvaliacoesAvaliarAdmin.styles'

// suppress unused import warning
void _FieldInput
void PapelGrid
void PapelBtn

const C = {
  textDim: 'rgba(245,240,232,0.45)',
  gold: '#c8a96e',
  text: '#f5f0e8',
  border: 'rgba(255,255,255,0.07)',
}

// ─── Types ───────────────────────────────────────────────────────────────────

type RatingsMap = Record<string, number>
type TextsMap = Record<string, string>

interface UserProfile {
  nome: string
  papel: string | null
  userId: string
  avatarUrl: string | null
}

interface ShowData {
  id: string
  nome: string
  data_show: string
  local?: string | null
  papeis?: string[]
}

interface ExistingAval {
  id: string
  geral_entrosamento?: number | null
  geral_energia?: number | null
  geral_afinacao?: number | null
  geral_dinamica?: number | null
  geral_comentarios?: string | null
  apres_pontualidade?: number | null
  apres_postura?: number | null
  apres_publico?: number | null
  apres_logistica?: number | null
  apres_profissionalismo?: number | null
  apres_comentarios?: string | null
  nota_final?: number | null
  obs_bem?: string | null
  obs_melhorar?: string | null
  obs_livres?: string | null
  musicas?: Record<
    string,
    {
      minha?: Record<string, number | string>
      banda?: Record<string, { nota?: number; comentario?: string }>
      bem?: string
      melhorar?: string
    }
  >
}

// ─── MusicaCardItem ──────────────────────────────────────────────────────────

interface MusicaCardItemProps {
  nome: string
  index: number
  papel: string
  outrosPapeis: string[]
  ratings: RatingsMap
  setRating: (key: string, val: number) => void
  texts: TextsMap
  setText: (key: string, val: string) => void
}

function MusicaCardItem({
  nome,
  index,
  papel,
  outrosPapeis,
  ratings,
  setRating,
  texts,
  setText,
}: MusicaCardItemProps) {
  const [open, setOpen] = useState(false)
  const aspectosProprios = PAPEIS_ASPECTOS[papel] ?? []

  return (
    <MusicaCard>
      <MusicaCardHeader onClick={() => setOpen(o => !o)}>
        <MusicaNum>{index + 1}</MusicaNum>
        <MusicaName>{nome}</MusicaName>
        <MusicaChevron $open={open}>▼</MusicaChevron>
      </MusicaCardHeader>

      <MusicaBody $open={open}>
        <Cols2>
          <div>
            <ColTitle>A minha performance</ColTitle>
            {papel === 'Direção' ? (
              <>
                <StarRow>
                  <StarLabel>Direção geral</StarLabel>
                  <StarRating
                    value={ratings[`m${index}-my-direcao`] ?? 0}
                    onChange={(v: number) => setRating(`m${index}-my-direcao`, v)}
                  />
                </StarRow>
                <NoteTextarea
                  placeholder="Comentário..."
                  value={texts[`m${index}-my-direcao-txt`] ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setText(`m${index}-my-direcao-txt`, e.target.value)
                  }
                />
              </>
            ) : (
              aspectosProprios.map((asp: string) => {
                const key = `m${index}-my-${asp.replace(/[\s/]+/g, '-').toLowerCase()}`
                return (
                  <StarRow key={asp}>
                    <StarLabel>{asp}</StarLabel>
                    <StarRating
                      value={ratings[key] ?? 0}
                      onChange={(v: number) => setRating(key, v)}
                    />
                  </StarRow>
                )
              })
            )}
          </div>

          <div>
            <ColTitle>A banda</ColTitle>
            {outrosPapeis.length === 0 ? (
              <p style={{ fontSize: 13, color: C.textDim, fontStyle: 'italic' }}>
                Nenhum outro membro neste show.
              </p>
            ) : (
              outrosPapeis.map((p: string) => {
                const pkey = `m${index}-band-${p.replace(/[\s/]+/g, '-').toLowerCase()}`
                return (
                  <BandaMember key={p}>
                    <BandaMemberTitle>{p}</BandaMemberTitle>
                    <StarRow>
                      <StarLabel>Nota</StarLabel>
                      <StarRating
                        value={ratings[pkey] ?? 0}
                        onChange={(v: number) => setRating(pkey, v)}
                      />
                    </StarRow>
                    <NoteTextarea
                      placeholder="Comentário (opcional)..."
                      style={{ minHeight: 38, fontSize: 12 }}
                      value={texts[`${pkey}-txt`] ?? ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setText(`${pkey}-txt`, e.target.value)
                      }
                    />
                  </BandaMember>
                )
              })
            )}
          </div>
        </Cols2>

        <MusicNotes>
          <NoteBlock>
            <NoteLabel>
              <NoteDot $green />O que correu bem
            </NoteLabel>
            <NoteTextarea
              placeholder="..."
              value={texts[`m${index}-bem`] ?? ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setText(`m${index}-bem`, e.target.value)
              }
            />
          </NoteBlock>
          <NoteBlock>
            <NoteLabel>
              <NoteDot />O que melhorar
            </NoteLabel>
            <NoteTextarea
              placeholder="..."
              value={texts[`m${index}-melhorar`] ?? ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setText(`m${index}-melhorar`, e.target.value)
              }
            />
          </NoteBlock>
        </MusicNotes>
      </MusicaBody>
    </MusicaCard>
  )
}

export default function AvaliarPage() {
  const router = useRouter()
  const { id } = router.query

  const [show, setShow] = useState<ShowData | null>(null)
  const [loadingShow, setLoadingShow] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  const [existingId, setExistingId] = useState<string | null>(null)
  const [ratings, setRatingsState] = useState<RatingsMap>({})
  const [texts, setTextsState] = useState<TextsMap>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [toast, setToast] = useState({ show: false, msg: '', error: false })

  useEffect(() => {
    if (!id) return
    const supabase = createClient()

    Promise.all([
      supabase.from('shows').select('*').eq('id', id).single(),
      supabase.auth.getUser(),
      fetch('/api/admin/me').then(r => r.json()),
    ]).then(
      ([
        { data: showData },
        {
          data: { user },
        },
        meData,
      ]: [
        { data: ShowData | null },
        {
          data: {
            user: { id: string; email?: string; user_metadata?: Record<string, string> } | null
          }
        },
        { nome?: string; papel?: string } | null,
      ]) => {
        setShow(showData)

        if (user) {
          const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null
          const p = (meData as { nome?: string })?.nome ? meData : null
          setProfile(
            p
              ? { ...(p as { nome: string; papel: string | null }), userId: user.id, avatarUrl }
              : { nome: user.email ?? '', papel: null, userId: user.id, avatarUrl }
          )

          supabase
            .from('avaliacoes')
            .select('*')
            .eq('show_id', id)
            .eq('user_id', user.id)
            .maybeSingle()
            .then(({ data: existing }) => {
              if (!existing) return
              const ex = existing as ExistingAval
              setExistingId(ex.id)

              const r: RatingsMap = {}
              const t: TextsMap = {}
              const papel = (meData as { papel?: string })?.papel ?? ''
              const aspectos = PAPEIS_ASPECTOS[papel] ?? []
              const outrosPapeis = (showData?.papeis ?? []).filter((pp: string) => pp !== papel)

              SET_LIST.forEach((nome, i) => {
                const m = ex.musicas?.[nome]
                if (!m) return
                if (papel === 'Direção') {
                  r[`m${i}-my-direcao`] = (m.minha?.['direcao'] as number) ?? 0
                  t[`m${i}-my-direcao-txt`] = (m.minha?.['direcao_txt'] as string) ?? ''
                } else {
                  aspectos.forEach((asp: string) => {
                    const key = `m${i}-my-${asp.replace(/[\s/]+/g, '-').toLowerCase()}`
                    r[key] = (m.minha?.[asp] as number) ?? 0
                  })
                }
                outrosPapeis.forEach((pp: string) => {
                  const pkey = `m${i}-band-${pp.replace(/[\s/]+/g, '-').toLowerCase()}`
                  r[pkey] = m.banda?.[pp]?.nota ?? 0
                  t[`${pkey}-txt`] = m.banda?.[pp]?.comentario ?? ''
                })
                t[`m${i}-bem`] = m.bem ?? ''
                t[`m${i}-melhorar`] = m.melhorar ?? ''
              })

              r['g-entros'] = ex.geral_entrosamento ?? 0
              r['g-energia'] = ex.geral_energia ?? 0
              r['g-afinacao'] = ex.geral_afinacao ?? 0
              r['g-dinamica'] = ex.geral_dinamica ?? 0
              t['geral-comentarios'] = ex.geral_comentarios ?? ''

              r['a-pontual'] = ex.apres_pontualidade ?? 0
              r['a-postura'] = ex.apres_postura ?? 0
              r['a-publico'] = ex.apres_publico ?? 0
              r['a-logistica'] = ex.apres_logistica ?? 0
              r['a-prof'] = ex.apres_profissionalismo ?? 0
              t['apres-comentarios'] = ex.apres_comentarios ?? ''

              r['nota-final'] = ex.nota_final ?? 0
              t['obs-bem'] = ex.obs_bem ?? ''
              t['obs-melhorar'] = ex.obs_melhorar ?? ''
              t['obs-livres'] = ex.obs_livres ?? ''

              setRatingsState(r)
              setTextsState(t)
            })
        }

        setLoadingShow(false)
      }
    )
  }, [id])

  const showToast = (msg: string, error = false) => {
    setToast({ show: true, msg, error })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500)
  }

  const setRating = useCallback(
    (key: string, val: number) => setRatingsState(r => ({ ...r, [key]: val })),
    []
  )
  const setText = useCallback(
    (key: string, val: string) => setTextsState(t => ({ ...t, [key]: val })),
    []
  )

  const papel = profile?.papel ?? null
  const outrosPapeis = (show?.papeis ?? []).filter((p: string) => p !== papel)

  const handleSubmit = async () => {
    if (!profile) {
      showToast('Sessão não encontrada.', true)
      return
    }
    if (!papel) {
      showToast('Seu perfil não tem papel definido.', true)
      return
    }

    setSubmitting(true)

    const aspectosProprios = PAPEIS_ASPECTOS[papel] ?? []
    const musicasData: Record<string, unknown> = {}

    SET_LIST.forEach((nome, i) => {
      const minha: Record<string, number | string> = {}
      if (papel === 'Direção') {
        minha['direcao'] = ratings[`m${i}-my-direcao`] ?? 0
        minha['direcao_txt'] = texts[`m${i}-my-direcao-txt`] ?? ''
      } else {
        aspectosProprios.forEach((asp: string) => {
          const key = `m${i}-my-${asp.replace(/[\s/]+/g, '-').toLowerCase()}`
          minha[asp] = ratings[key] ?? 0
        })
      }
      const banda: Record<string, { nota: number; comentario: string }> = {}
      outrosPapeis.forEach((p: string) => {
        const pkey = `m${i}-band-${p.replace(/[\s/]+/g, '-').toLowerCase()}`
        banda[p] = { nota: ratings[pkey] ?? 0, comentario: texts[`${pkey}-txt`] ?? '' }
      })
      musicasData[nome] = {
        minha,
        banda,
        bem: texts[`m${i}-bem`] ?? '',
        melhorar: texts[`m${i}-melhorar`] ?? '',
      }
    })

    const payload = {
      avaliador: profile.nome,
      avatar_url: profile.avatarUrl,
      papel,
      user_id: profile.userId,
      show_id: id,
      data_show: show?.data_show,
      local: show?.local,
      nome_show: show?.nome,
      musicas: musicasData,
      geral_entrosamento: ratings['g-entros'] ?? 0,
      geral_energia: ratings['g-energia'] ?? 0,
      geral_afinacao: ratings['g-afinacao'] ?? 0,
      geral_dinamica: ratings['g-dinamica'] ?? 0,
      geral_comentarios: texts['geral-comentarios'] ?? '',
      apres_pontualidade: ratings['a-pontual'] ?? 0,
      apres_postura: ratings['a-postura'] ?? 0,
      apres_publico: ratings['a-publico'] ?? 0,
      apres_logistica: ratings['a-logistica'] ?? 0,
      apres_profissionalismo: ratings['a-prof'] ?? 0,
      apres_comentarios: texts['apres-comentarios'] ?? '',
      nota_final: ratings['nota-final'] ?? 0,
      obs_bem: texts['obs-bem'] ?? '',
      obs_melhorar: texts['obs-melhorar'] ?? '',
      obs_livres: texts['obs-livres'] ?? '',
    }

    const supabase = createClient()
    const { error } = existingId
      ? await supabase.from('avaliacoes').update(payload).eq('id', existingId)
      : await supabase.from('avaliacoes').insert(payload)

    if (error) showToast('Erro ao enviar. Tente novamente.', true)
    else setSubmitted(true)
    setSubmitting(false)
  }

  if (loadingShow) {
    return (
      <AdminLayout title="Avaliar Show">
        <p style={{ color: C.textDim, fontSize: 14 }}>Carregando...</p>
      </AdminLayout>
    )
  }

  if (!show) {
    return (
      <AdminLayout title="Avaliar Show">
        <p style={{ color: C.textDim, fontSize: 14 }}>Show não encontrado.</p>
        <Link href="/admin/avaliacoes" passHref legacyBehavior>
          <a
            style={{
              fontSize: 12,
              color: C.gold,
              textDecoration: 'none',
              marginTop: 16,
              display: 'inline-block',
            }}
          >
            ← Voltar
          </a>
        </Link>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title={existingId ? `Editar avaliação: ${show.nome}` : `Avaliar: ${show.nome}`}
      subtitle={fmtDate(show.data_show) + (show.local ? ` · ${show.local}` : '')}
    >
      {/* Identity banner */}
      {profile && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(200,169,110,0.15)',
              border: '1px solid rgba(200,169,110,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 13,
              fontWeight: 700,
              color: C.gold,
              flexShrink: 0,
            }}
          >
            {profile.nome
              .split(' ')
              .map((w: string) => w[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 14,
                fontWeight: 600,
                color: C.text,
              }}
            >
              {profile.nome}
            </div>
            <div
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 11,
                color: C.textDim,
                marginTop: 2,
              }}
            >
              {papel ?? 'Sem papel definido'}
            </div>
          </div>
        </div>
      )}

      {submitted ? (
        <SuccessBox>
          <h3>✓ {existingId ? 'Avaliação atualizada!' : 'Avaliação enviada!'}</h3>
          <p>Os resultados já estão disponíveis na página do show.</p>
          <Link href={`/admin/avaliacoes/${id}`} passHref legacyBehavior>
            <a
              style={{
                display: 'inline-block',
                marginTop: 16,
                fontSize: 13,
                color: C.gold,
                fontWeight: 600,
              }}
            >
              Ver resultados →
            </a>
          </Link>
        </SuccessBox>
      ) : !papel ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: C.textDim, fontSize: 14 }}>
          Seu perfil não tem um papel definido nesta banda. Entre em contato com o administrador.
        </div>
      ) : (
        <>
          <SectionLabel>Avaliação por música</SectionLabel>
          {SET_LIST.map((nome, i) => (
            <MusicaCardItem
              key={nome}
              nome={nome}
              index={i}
              papel={papel}
              outrosPapeis={outrosPapeis}
              ratings={ratings}
              setRating={setRating}
              texts={texts}
              setText={setText}
            />
          ))}

          <SectionLabel>Performance geral da banda</SectionLabel>
          <GeneralBlock>
            {[
              { label: 'Entrosamento / conjunto', key: 'g-entros' },
              { label: 'Energia em palco', key: 'g-energia' },
              { label: 'Afinação geral', key: 'g-afinacao' },
              { label: 'Dinâmica / variação do set', key: 'g-dinamica' },
            ].map(({ label, key }) => (
              <StarRow key={key}>
                <StarLabel>{label}</StarLabel>
                <StarRating value={ratings[key] ?? 0} onChange={(v: number) => setRating(key, v)} />
              </StarRow>
            ))}
          </GeneralBlock>
          <Field style={{ marginTop: 12 }}>
            <FieldLabel>Comentários gerais sobre a banda</FieldLabel>
            <FieldTextarea
              placeholder="O que funcionou bem? O que ficou aquém?"
              value={texts['geral-comentarios'] ?? ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setText('geral-comentarios', e.target.value)
              }
            />
          </Field>

          <SectionLabel>Apresentação e comportamento</SectionLabel>
          <GeneralBlock>
            {[
              { label: 'Pontualidade / organização', key: 'a-pontual' },
              { label: 'Postura / presença em palco', key: 'a-postura' },
              { label: 'Comunicação com o público', key: 'a-publico' },
              { label: 'Logística / material de palco', key: 'a-logistica' },
              { label: 'Profissionalismo geral', key: 'a-prof' },
            ].map(({ label, key }) => (
              <StarRow key={key}>
                <StarLabel>{label}</StarLabel>
                <StarRating value={ratings[key] ?? 0} onChange={(v: number) => setRating(key, v)} />
              </StarRow>
            ))}
          </GeneralBlock>
          <Field style={{ marginTop: 12 }}>
            <FieldLabel>Comentários — apresentação e comportamento</FieldLabel>
            <FieldTextarea
              placeholder="Algo a melhorar para o próximo show?"
              value={texts['apres-comentarios'] ?? ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setText('apres-comentarios', e.target.value)
              }
            />
          </Field>

          <SectionLabel>Nota final</SectionLabel>
          <NotaRow>
            <NotaLabel>Nota geral do show</NotaLabel>
            <StarRating
              value={ratings['nota-final'] ?? 0}
              onChange={(v: number) => setRating('nota-final', v)}
              size={24}
            />
          </NotaRow>
          <Field style={{ marginTop: 12 }}>
            <FieldLabel>O que foi bem e deve ser mantido</FieldLabel>
            <FieldTextarea
              placeholder="Pontos positivos..."
              value={texts['obs-bem'] ?? ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setText('obs-bem', e.target.value)
              }
            />
          </Field>
          <Field>
            <FieldLabel>O que precisa melhorar</FieldLabel>
            <FieldTextarea
              placeholder="Pontos a trabalhar..."
              value={texts['obs-melhorar'] ?? ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setText('obs-melhorar', e.target.value)
              }
            />
          </Field>
          <Field>
            <FieldLabel>Observações livres</FieldLabel>
            <FieldTextarea
              placeholder="Qualquer outra coisa relevante..."
              value={texts['obs-livres'] ?? ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setText('obs-livres', e.target.value)
              }
            />
          </Field>

          <SubmitArea>
            <SubmitBtn onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Salvando...' : existingId ? 'Salvar alterações' : 'Enviar avaliação'}
            </SubmitBtn>
          </SubmitArea>
        </>
      )}

      <Toast $show={toast.show} $error={toast.error}>
        {toast.msg}
      </Toast>
    </AdminLayout>
  )
}
