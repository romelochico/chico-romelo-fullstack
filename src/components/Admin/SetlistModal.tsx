import { useState } from 'react'
import styled from 'styled-components'
import { X, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, MessageSquare, Check } from 'lucide-react'
import { createClient } from '../../lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SpeechLine {
  id: string
  song_id: string
  timing: 'before' | 'after'
  position: number
  speaker: string
  text: string
}

interface SetlistSong {
  id: string
  block_id: string
  position: number
  title: string
  speeches: SpeechLine[]
}

interface SetlistBlock {
  id: string
  event_id: string
  position: number
  name: string | null
  songs: SetlistSong[]
}

interface Props {
  eventId: string
  blocks: SetlistBlock[]
  onClose: () => void
  reload: () => void | Promise<void>
}

// ─── Constants ────────────────────────────────────────────────────────────────

const C = {
  gold:   '#c8a96e',
  sage:   '#878766',
  cream:  '#f5f0e8',
  dim:    'rgba(245,240,232,0.3)',
  border: 'rgba(255,255,255,0.07)',
  red:    '#f87171',
  green:  '#4ade80',
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 200;
  display: flex; flex-direction: column;
`

const Header = styled.div`
  display: flex; align-items: center; gap: 16px;
  padding: 20px 28px;
  border-bottom: 1px solid ${C.border};
  background: #0d0d0d;
  flex-shrink: 0;
`

const Heading = styled.h2`
  font-family: 'Special Elite', serif;
  font-size: 20px; color: ${C.cream}; margin: 0; flex: 1;
`

const CloseBtn = styled.button`
  width: 36px; height: 36px;
  border: none; border-radius: 8px; background: rgba(255,255,255,0.05);
  color: ${C.dim}; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, color 0.15s;
  svg { width: 18px; height: 18px; }
  &:hover { background: rgba(255,255,255,0.1); color: ${C.cream}; }
`

const ConcludeRow = styled.div`
  display: flex; justify-content: flex-end;
  padding: 16px 28px 0;
  background: #0d0d0d;
  flex-shrink: 0;
`

const ConcludeBtn = styled.button`
  display: flex; align-items: center; gap: 8px;
  padding: 10px 20px;
  background: ${C.gold}; color: #0d0d0d;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  border: none; border-radius: 6px; cursor: pointer;
  transition: opacity 0.15s;
  svg { width: 14px; height: 14px; }
  &:hover { opacity: 0.85; }
`

const Body = styled.div`
  flex: 1; overflow-y: auto; padding: 20px 28px 40px;
  display: flex; flex-direction: column; gap: 20px;
`

const BlockCard = styled.div<{ $dragOver?: boolean }>`
  border: 1px solid ${({ $dragOver }) => $dragOver ? C.gold : C.border};
  border-radius: 10px;
  background: rgba(255,255,255,0.02);
  transition: border-color 0.1s;
`

const BlockHeader = styled.div`
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid ${C.border};
`

const BlockNameInput = styled.input`
  flex: 1;
  background: none; border: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px; font-weight: 700; letter-spacing: 0.04em;
  color: ${C.cream};
  outline: none;
  padding: 4px 0;
  &::placeholder { color: ${C.dim}; }
`

const IconBtn = styled.button`
  width: 28px; height: 28px;
  border: none; border-radius: 6px; background: transparent;
  color: ${C.dim}; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, color 0.15s;
  svg { width: 14px; height: 14px; }
  &:hover { background: rgba(248,113,113,0.1); color: ${C.red}; }
`

const SongListArea = styled.div`
  padding: 10px 16px 16px;
  display: flex; flex-direction: column; gap: 6px;
  min-height: 40px;
`

const SongCardWrap = styled.div<{ $dragging?: boolean }>`
  border: 1px solid ${C.border};
  border-radius: 8px;
  background: rgba(255,255,255,0.03);
  opacity: ${({ $dragging }) => $dragging ? 0.4 : 1};
`

const SongRow = styled.div`
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
`

const DragHandle = styled.span`
  color: ${C.dim}; cursor: grab; flex-shrink: 0; display: flex;
  svg { width: 14px; height: 14px; }
`

const SongTitleInput = styled.input`
  flex: 1;
  background: none; border: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px; color: ${C.cream};
  outline: none;
  padding: 4px 0;
  border-bottom: 1px solid transparent;
  transition: border-color 0.15s;
  &:hover, &:focus { border-bottom-color: ${C.border}; }
  &:focus { border-bottom-color: ${C.gold}; }
`

const FalasToggle = styled.button<{ $active?: boolean; $hasContent?: boolean }>`
  display: flex; align-items: center; gap: 6px;
  padding: 5px 10px;
  background: ${({ $active }) => $active ? 'rgba(200,169,110,0.12)' : 'rgba(255,255,255,0.04)'};
  border: 1px solid ${({ $hasContent }) => $hasContent ? 'rgba(200,169,110,0.3)' : C.border};
  color: ${({ $hasContent }) => $hasContent ? C.gold : C.dim};
  font-family: 'Montserrat', sans-serif;
  font-size: 10px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
  border-radius: 5px; cursor: pointer; flex-shrink: 0;
  svg { width: 12px; height: 12px; }
`

const SpeechesArea = styled.div`
  padding: 4px 12px 12px 36px;
  display: flex; flex-direction: column; gap: 12px;
`

const SpeechColumn = styled.div`
  display: flex; flex-direction: column; gap: 6px;
`

const SpeechColumnLabel = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  color: ${C.sage};
`

const SpeechLineRow = styled.div`
  display: flex; align-items: flex-start; gap: 8px;
  padding: 6px 10px;
  background: rgba(255,255,255,0.03);
  border: 1px solid ${C.border};
  border-radius: 6px;
`

const SpeechSpeaker = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px; font-weight: 700; color: ${C.gold};
  flex-shrink: 0; white-space: nowrap;
`

const SpeechText = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px; color: ${C.cream}; flex: 1; line-height: 1.4;
`

const MiniInput = styled.input`
  padding: 7px 10px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 5px;
  color: ${C.cream}; font-family: 'Montserrat', sans-serif; font-size: 12px;
  outline: none;
  &:focus { border-color: ${C.gold}; }
  &::placeholder { color: ${C.dim}; }
`

const SpeechAddRow = styled.div`
  display: flex; gap: 6px;
`

const SpeechSpeakerInput = styled(MiniInput)`
  width: 110px; flex-shrink: 0;
`

const SpeechTextInput = styled(MiniInput)`
  flex: 1;
`

const MiniAddBtn = styled.button`
  width: 30px; flex-shrink: 0;
  background: ${C.gold}; color: #0d0d0d;
  border: none; border-radius: 5px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: opacity 0.15s;
  svg { width: 14px; height: 14px; }
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`

const AddSongRow = styled.div`
  display: flex; gap: 8px; padding-top: 4px;
`

const AddSongInput = styled(MiniInput)`
  flex: 1;
`

const AddSongBtn = styled.button`
  display: flex; align-items: center; gap: 6px; flex-shrink: 0;
  padding: 0 14px;
  background: rgba(200,169,110,0.1); color: ${C.gold};
  border: 1px solid rgba(200,169,110,0.3); border-radius: 5px; cursor: pointer;
  font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700;
  transition: opacity 0.15s;
  svg { width: 13px; height: 13px; }
  &:hover { opacity: 0.85; }
`

const AddBlockBtn = styled.button`
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px;
  background: none;
  border: 1px dashed ${C.border}; border-radius: 10px;
  color: ${C.dim}; cursor: pointer;
  font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.04em;
  transition: all 0.15s;
  svg { width: 14px; height: 14px; }
  &:hover { color: ${C.cream}; border-color: rgba(255,255,255,0.2); }
`

const EmptySongs = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px; color: ${C.dim};
  padding: 8px 4px;
`

// ─── Component ────────────────────────────────────────────────────────────────

export default function SetlistModal({ eventId, blocks, onClose, reload }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [newSongTitle, setNewSongTitle] = useState<Record<string, string>>({})
  const [newSpeech, setNewSpeech] = useState<Record<string, { speaker: string; text: string }>>({})
  const [dragging, setDragging] = useState<{ songId: string; fromBlockId: string } | null>(null)
  const [dragOverBlock, setDragOverBlock] = useState<string | null>(null)

  const supabase = createClient()

  async function authHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    }
  }

  async function addBlock() {
    await fetch('/api/admin/setlist', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ event_id: eventId }),
    })
    await reload()
  }

  async function renameBlock(blockId: string, name: string) {
    await fetch(`/api/admin/setlist/blocks/${blockId}`, {
      method: 'PUT',
      headers: await authHeaders(),
      body: JSON.stringify({ name }),
    })
    await reload()
  }

  async function deleteBlock(blockId: string) {
    if (!window.confirm('Excluir este bloco e todas as músicas dentro dele?')) return
    await fetch(`/api/admin/setlist/blocks/${blockId}`, { method: 'DELETE', headers: await authHeaders() })
    await reload()
  }

  async function addSong(blockId: string) {
    const title = (newSongTitle[blockId] ?? '').trim()
    if (!title) return
    await fetch('/api/admin/setlist/songs', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ block_id: blockId, title }),
    })
    setNewSongTitle(s => ({ ...s, [blockId]: '' }))
    await reload()
  }

  async function renameSong(songId: string, title: string) {
    if (!title.trim()) return
    await fetch(`/api/admin/setlist/songs/${songId}`, {
      method: 'PUT',
      headers: await authHeaders(),
      body: JSON.stringify({ title }),
    })
    await reload()
  }

  async function deleteSong(songId: string) {
    await fetch(`/api/admin/setlist/songs/${songId}`, { method: 'DELETE', headers: await authHeaders() })
    await reload()
  }

  async function addSpeech(songId: string, timing: 'before' | 'after') {
    const draft = newSpeech[`${songId}:${timing}`]
    if (!draft?.speaker.trim() || !draft?.text.trim()) return
    await fetch('/api/admin/setlist/speeches', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ song_id: songId, timing, speaker: draft.speaker, text: draft.text }),
    })
    setNewSpeech(s => ({ ...s, [`${songId}:${timing}`]: { speaker: '', text: '' } }))
    await reload()
  }

  async function deleteSpeech(speechId: string) {
    await fetch(`/api/admin/setlist/speeches/${speechId}`, { method: 'DELETE', headers: await authHeaders() })
    await reload()
  }

  async function handleDrop(destBlockId: string, destSongId: string | null) {
    setDragOverBlock(null)
    if (!dragging) return
    const { songId, fromBlockId } = dragging
    setDragging(null)
    if (songId === destSongId) return

    const blocksCopy = blocks.map(b => ({ ...b, songs: [...b.songs] }))
    const fromBlock = blocksCopy.find(b => b.id === fromBlockId)
    const toBlock = blocksCopy.find(b => b.id === destBlockId)
    if (!fromBlock || !toBlock) return

    const movingIndex = fromBlock.songs.findIndex(s => s.id === songId)
    if (movingIndex === -1) return
    const [movingSong] = fromBlock.songs.splice(movingIndex, 1)

    let insertAt = toBlock.songs.length
    if (destSongId) {
      const idx = toBlock.songs.findIndex(s => s.id === destSongId)
      if (idx !== -1) insertAt = idx
    }
    toBlock.songs.splice(insertAt, 0, movingSong)

    const updates: { id: string; block_id: string; position: number }[] = []
    fromBlock.songs.forEach((s, i) => updates.push({ id: s.id, block_id: fromBlock.id, position: i }))
    if (toBlock.id !== fromBlock.id) {
      toBlock.songs.forEach((s, i) => updates.push({ id: s.id, block_id: toBlock.id, position: i }))
    }

    await fetch('/api/admin/setlist/songs/reorder', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ updates }),
    })
    await reload()
  }

  function toggleExpanded(songId: string) {
    setExpanded(e => ({ ...e, [songId]: !e[songId] }))
  }

  return (
    <Overlay>
      <Header>
        <Heading>Gerenciar setlist</Heading>
        <CloseBtn onClick={onClose} title="Fechar"><X /></CloseBtn>
      </Header>

      <ConcludeRow>
        <ConcludeBtn onClick={onClose}><Check /> Concluir</ConcludeBtn>
      </ConcludeRow>

      <Body>
        {blocks.map(block => {
          const before = (songId: string) =>
            newSpeech[`${songId}:before`] ?? { speaker: '', text: '' }
          const after = (songId: string) =>
            newSpeech[`${songId}:after`] ?? { speaker: '', text: '' }

          return (
            <BlockCard
              key={block.id}
              $dragOver={dragOverBlock === block.id}
              onDragOver={e => { e.preventDefault(); setDragOverBlock(block.id) }}
              onDragLeave={() => setDragOverBlock(cur => cur === block.id ? null : cur)}
              onDrop={e => { e.preventDefault(); handleDrop(block.id, null) }}
            >
              <BlockHeader>
                <BlockNameInput
                  defaultValue={block.name ?? ''}
                  placeholder={`Bloco ${block.position + 1}`}
                  onBlur={e => {
                    if (e.target.value !== (block.name ?? '')) renameBlock(block.id, e.target.value)
                  }}
                />
                <IconBtn onClick={() => deleteBlock(block.id)} title="Excluir bloco"><Trash2 /></IconBtn>
              </BlockHeader>

              <SongListArea>
                {block.songs.length === 0 && <EmptySongs>Nenhuma música neste bloco ainda.</EmptySongs>}

                {block.songs.map(song => {
                  const hasContent = song.speeches.length > 0
                  const isOpen = !!expanded[song.id]
                  const beforeLines = song.speeches.filter(s => s.timing === 'before')
                  const afterLines = song.speeches.filter(s => s.timing === 'after')

                  return (
                    <SongCardWrap
                      key={song.id}
                      $dragging={dragging?.songId === song.id}
                      draggable
                      onDragStart={() => setDragging({ songId: song.id, fromBlockId: block.id })}
                      onDragOver={e => { e.preventDefault(); e.stopPropagation() }}
                      onDrop={e => { e.preventDefault(); e.stopPropagation(); handleDrop(block.id, song.id) }}
                    >
                      <SongRow>
                        <DragHandle><GripVertical /></DragHandle>
                        <SongTitleInput
                          defaultValue={song.title}
                          onBlur={e => {
                            if (e.target.value !== song.title) renameSong(song.id, e.target.value)
                          }}
                          onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
                        />
                        <FalasToggle
                          $active={isOpen}
                          $hasContent={hasContent}
                          onClick={() => toggleExpanded(song.id)}
                        >
                          <MessageSquare /> Falas {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </FalasToggle>
                        <IconBtn onClick={() => deleteSong(song.id)} title="Remover música"><Trash2 /></IconBtn>
                      </SongRow>

                      {isOpen && (
                        <SpeechesArea>
                          <SpeechColumn>
                            <SpeechColumnLabel>Antes da música</SpeechColumnLabel>
                            {beforeLines.map(line => (
                              <SpeechLineRow key={line.id}>
                                <SpeechSpeaker>{line.speaker}:</SpeechSpeaker>
                                <SpeechText>{line.text}</SpeechText>
                                <IconBtn onClick={() => deleteSpeech(line.id)} title="Remover fala"><Trash2 /></IconBtn>
                              </SpeechLineRow>
                            ))}
                            <SpeechAddRow>
                              <SpeechSpeakerInput
                                placeholder="Personagem"
                                value={before(song.id).speaker}
                                onChange={e => setNewSpeech(s => ({ ...s, [`${song.id}:before`]: { ...before(song.id), speaker: e.target.value } }))}
                              />
                              <SpeechTextInput
                                placeholder="Texto da fala..."
                                value={before(song.id).text}
                                onChange={e => setNewSpeech(s => ({ ...s, [`${song.id}:before`]: { ...before(song.id), text: e.target.value } }))}
                                onKeyDown={e => { if (e.key === 'Enter') addSpeech(song.id, 'before') }}
                              />
                              <MiniAddBtn
                                onClick={() => addSpeech(song.id, 'before')}
                                disabled={!before(song.id).speaker.trim() || !before(song.id).text.trim()}
                              ><Plus /></MiniAddBtn>
                            </SpeechAddRow>
                          </SpeechColumn>

                          <SpeechColumn>
                            <SpeechColumnLabel>Depois da música</SpeechColumnLabel>
                            {afterLines.map(line => (
                              <SpeechLineRow key={line.id}>
                                <SpeechSpeaker>{line.speaker}:</SpeechSpeaker>
                                <SpeechText>{line.text}</SpeechText>
                                <IconBtn onClick={() => deleteSpeech(line.id)} title="Remover fala"><Trash2 /></IconBtn>
                              </SpeechLineRow>
                            ))}
                            <SpeechAddRow>
                              <SpeechSpeakerInput
                                placeholder="Personagem"
                                value={after(song.id).speaker}
                                onChange={e => setNewSpeech(s => ({ ...s, [`${song.id}:after`]: { ...after(song.id), speaker: e.target.value } }))}
                              />
                              <SpeechTextInput
                                placeholder="Texto da fala..."
                                value={after(song.id).text}
                                onChange={e => setNewSpeech(s => ({ ...s, [`${song.id}:after`]: { ...after(song.id), text: e.target.value } }))}
                                onKeyDown={e => { if (e.key === 'Enter') addSpeech(song.id, 'after') }}
                              />
                              <MiniAddBtn
                                onClick={() => addSpeech(song.id, 'after')}
                                disabled={!after(song.id).speaker.trim() || !after(song.id).text.trim()}
                              ><Plus /></MiniAddBtn>
                            </SpeechAddRow>
                          </SpeechColumn>
                        </SpeechesArea>
                      )}
                    </SongCardWrap>
                  )
                })}

                <AddSongRow>
                  <AddSongInput
                    placeholder="Nome da música..."
                    value={newSongTitle[block.id] ?? ''}
                    onChange={e => setNewSongTitle(s => ({ ...s, [block.id]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') addSong(block.id) }}
                  />
                  <AddSongBtn onClick={() => addSong(block.id)}><Plus /> Música</AddSongBtn>
                </AddSongRow>
              </SongListArea>
            </BlockCard>
          )
        })}

        <AddBlockBtn onClick={addBlock}><Plus /> Adicionar bloco</AddBlockBtn>
      </Body>
    </Overlay>
  )
}
