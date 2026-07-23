import { useState, useEffect, useCallback } from 'react'
import { flushSync } from 'react-dom'
import { useRouter } from 'next/router'
import styled, { createGlobalStyle } from 'styled-components'
import { ArrowLeft, Music, FileDown } from 'lucide-react'
import AdminLayout from '../../../../components/Admin/AdminLayout'
import { createClient } from '../../../../lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────

interface EventRow {
  id: string
  title: string
  date: string
  time: string | null
  venue: string
  city: string
}

interface SpeechLine {
  id: string
  timing: 'before' | 'after'
  position: number
  speaker: string
  text: string
}

interface SetlistSong {
  id: string
  position: number
  title: string
  speeches: SpeechLine[]
}

interface SetlistBlock {
  id: string
  position: number
  name: string | null
  songs: SetlistSong[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const C = {
  cream:  '#f5f0e8',
  dim:    'rgba(245,240,232,0.3)',
  border: 'rgba(255,255,255,0.07)',
  sage:   '#878766',
  gold:   '#c8a96e',
}

const BLOCK_COLORS = ['#c8a96e', '#7dd3fc', '#c084fc', '#4ade80', '#fb923c', '#f472b6']

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const BackBtn = styled.button`
  display: flex; align-items: center; gap: 8px;
  background: none; border: none; color: ${C.dim};
  font-family: 'Montserrat', sans-serif;
  font-size: 12px; font-weight: 600; letter-spacing: 0.06em;
  cursor: pointer; padding: 0; margin-bottom: 24px;
  transition: color 0.15s;
  &:hover { color: ${C.cream}; }
  svg { width: 14px; height: 14px; }
`

const EventHeader = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 24px 28px;
  margin-bottom: 32px;
`

const EventTitle = styled.h1`
  font-family: 'Special Elite', serif;
  font-size: 26px; color: ${C.cream}; margin: 0 0 6px;
`

const EventMeta = styled.div`
  display: flex; flex-wrap: wrap; gap: 6px 16px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px; color: ${C.dim};
`

const BlockList = styled.div`
  display: flex; flex-direction: column; gap: 20px;
`

const BlockCard = styled.div<{ $color: string }>`
  border: 1px solid ${C.border};
  border-left: 4px solid ${({ $color }) => $color};
  border-radius: 10px;
  background: rgba(255,255,255,0.02);
  overflow: hidden;
`

const BlockHeader = styled.div<{ $color: string }>`
  display: flex; align-items: center; gap: 10px;
  padding: 14px 20px;
  background: ${({ $color }) => $color}12;
  border-bottom: 1px solid ${C.border};
`

const BlockDot = styled.span<{ $color: string }>`
  width: 10px; height: 10px; border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`

const BlockName = styled.span`
  font-family: 'Special Elite', serif;
  font-size: 16px; color: ${C.cream};
`

const BlockCount = styled.span`
  margin-left: auto;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px; font-weight: 700; color: ${C.dim};
`

const SongList = styled.div`
  display: flex; flex-direction: column;
`

const SongRow = styled.div`
  padding: 14px 20px;
  border-bottom: 1px solid ${C.border};
  &:last-child { border-bottom: none; }
`

const SongTop = styled.div`
  display: flex; align-items: center; gap: 12px;
`

const SongIndex = styled.span<{ $color: string }>`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px; font-weight: 700;
  color: ${({ $color }) => $color};
  min-width: 20px;
`

const SongTitle = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 14px; font-weight: 600; color: ${C.cream};
`

const SpeechBlock = styled.div`
  margin-top: 8px; margin-left: 32px;
  display: flex; flex-direction: column; gap: 6px;
`

const SpeechLabel = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  color: ${C.sage};
`

const SpeechLineText = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px; color: ${C.dim}; line-height: 1.5;
  strong { color: ${C.gold}; font-weight: 700; }
`

const EmptyState = styled.div`
  text-align: center; padding: 40px 24px;
  color: ${C.dim}; font-family: 'Montserrat', sans-serif; font-size: 13px;
  border: 1px dashed ${C.border}; border-radius: 8px;
`

const ExportRow = styled.div`
  display: flex; gap: 10px; margin-bottom: 24px;
`

const ExportBtn = styled.button`
  display: flex; align-items: center; gap: 8px;
  padding: 9px 16px;
  background: rgba(255,255,255,0.04);
  border: 1px solid ${C.border};
  color: ${C.cream};
  font-family: 'Montserrat', sans-serif;
  font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  border-radius: 6px; cursor: pointer;
  transition: all 0.15s;
  svg { width: 14px; height: 14px; }
  &:hover { border-color: ${C.gold}; color: ${C.gold}; }
`

// ─── Print styles ─────────────────────────────────────────────────────────────
// Printed setlists are read live on stage, so the template bumps every font
// size well past the on-screen size and forces light/dark-neutral ink colors.

const PrintStyles = createGlobalStyle`
  @media print {
    .no-print { display: none !important; }

    body { background: #fff !important; }

    .print-event-title { color: #000 !important; font-size: 30px !important; }

    .print-block { break-inside: avoid; border: none !important; background: #fff !important; border-radius: 0 !important; }
    .print-block-header { background: none !important; border-bottom: 1px solid #000 !important; }
    .print-block-name { color: #000 !important; font-size: 26px !important; }
    .print-block-count { color: #000 !important; font-size: 14px !important; }
    .print-block-dot { display: none !important; }

    .print-song-row { border-color: #000 !important; }
    .print-song-index { color: #000 !important; font-size: 22px !important; }
    .print-song-title { color: #000 !important; font-size: 22px !important; font-weight: 700 !important; }
    .print-song-title svg { display: none !important; }

    .print-speech-label { color: #000 !important; font-size: 12px !important; }
    .print-speech-line { color: #000 !important; font-size: 16px !important; }
    .print-speech-line strong { color: #000 !important; }

    [data-print-falas="false"] .print-speech-block { display: none !important; }
  }
`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SetlistDetailPage() {
  const router = useRouter()
  const { id } = router.query as { id: string }

  const [event, setEvent] = useState<EventRow | null>(null)
  const [blocks, setBlocks] = useState<SetlistBlock[]>([])
  const [printFalas, setPrintFalas] = useState(true)

  const supabase = createClient()

  const load = useCallback(async () => {
    if (!id) return
    const { data: { session } } = await supabase.auth.getSession()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    }
    const [eventRes, setlistRes] = await Promise.all([
      supabase.from('events').select('*').eq('id', id).single(),
      fetch(`/api/admin/setlist?event_id=${id}`, { headers }),
    ])
    setEvent(eventRes.data as EventRow)
    if (setlistRes.ok) setBlocks(await setlistRes.json())
  }, [id, supabase])

  useEffect(() => { load() }, [load])

  function exportPdf(withFalas: boolean) {
    flushSync(() => setPrintFalas(withFalas))
    window.print()
  }

  if (!event) return <AdminLayout title="Setlist" subtitle=""><div /></AdminLayout>

  const songNumbers = new Map<string, number>()
  let songCounter = 0
  blocks.forEach(block => {
    block.songs.forEach(song => {
      songCounter += 1
      songNumbers.set(song.id, songCounter)
    })
  })

  return (
    <AdminLayout title={event.title} subtitle={`Setlist completo · ${formatDate(event.date)}`}>
      <PrintStyles />

      <BackBtn className="no-print" onClick={() => router.push(`/admin/eventos/${id}`)}>
        <ArrowLeft /> Voltar ao show
      </BackBtn>

      <ExportRow className="no-print">
        <ExportBtn onClick={() => exportPdf(true)}><FileDown /> Exportar PDF (com falas)</ExportBtn>
        <ExportBtn onClick={() => exportPdf(false)}><FileDown /> Exportar PDF (sem falas)</ExportBtn>
      </ExportRow>

      <div data-print-falas={printFalas ? 'true' : 'false'}>
        <EventHeader>
          <EventTitle className="print-event-title">{event.title}</EventTitle>
          <EventMeta className="no-print">
            <span>{formatDate(event.date)}{event.time ? ` às ${event.time}` : ''}</span>
            <span>{event.venue}, {event.city}</span>
          </EventMeta>
        </EventHeader>

        {blocks.length === 0 ? (
          <EmptyState>Nenhum bloco de setlist criado para este show ainda.</EmptyState>
        ) : (
          <BlockList>
            {blocks.map((block, blockIdx) => {
              const color = BLOCK_COLORS[blockIdx % BLOCK_COLORS.length]
              return (
                <BlockCard key={block.id} $color={color} className="print-block">
                  <BlockHeader $color={color} className="print-block-header">
                    <BlockDot $color={color} className="print-block-dot" />
                    <BlockName className="print-block-name">{block.name || `Bloco ${block.position + 1}`}</BlockName>
                    <BlockCount className="print-block-count">{block.songs.length} música{block.songs.length !== 1 ? 's' : ''}</BlockCount>
                  </BlockHeader>

                  <SongList>
                    {block.songs.length === 0 ? (
                      <SongRow><SongTitle style={{ color: C.dim }}>Nenhuma música neste bloco.</SongTitle></SongRow>
                    ) : block.songs.map(song => {
                      const before = song.speeches.filter(s => s.timing === 'before')
                      const after = song.speeches.filter(s => s.timing === 'after')
                      return (
                        <SongRow key={song.id} className="print-song-row">
                          <SongTop>
                            <SongIndex $color={color} className="print-song-index">{songNumbers.get(song.id)}.</SongIndex>
                            <SongTitle className="print-song-title"><Music size={12} style={{ marginRight: 6, verticalAlign: -1 }} />{song.title}</SongTitle>
                          </SongTop>

                          {before.length > 0 && (
                            <SpeechBlock className="print-speech-block">
                              <SpeechLabel className="print-speech-label">Antes da música</SpeechLabel>
                              {before.map(line => (
                                <SpeechLineText key={line.id} className="print-speech-line"><strong>{line.speaker}:</strong> {line.text}</SpeechLineText>
                              ))}
                            </SpeechBlock>
                          )}

                          {after.length > 0 && (
                            <SpeechBlock className="print-speech-block">
                              <SpeechLabel className="print-speech-label">Depois da música</SpeechLabel>
                              {after.map(line => (
                                <SpeechLineText key={line.id} className="print-speech-line"><strong>{line.speaker}:</strong> {line.text}</SpeechLineText>
                              ))}
                            </SpeechBlock>
                          )}
                        </SongRow>
                      )
                    })}
                  </SongList>
                </BlockCard>
              )
            })}
          </BlockList>
        )}
      </div>
    </AdminLayout>
  )
}
