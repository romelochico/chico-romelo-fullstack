import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Trash2, AlertTriangle, ChevronDown, Mail, Inbox, MailOpen, MailCheck } from 'lucide-react'
import AdminLayout from '../../components/Admin/AdminLayout'
import { createClient } from '../../lib/supabase/client'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ContatoRow {
  id: string
  name: string
  email: string
  subject: string | null
  message: string | null
  read: boolean | null
  created_at: string | null
}

// ─── Styled components ─────────────────────────────────────────────────────

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`

const Count = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: rgba(245,240,232,0.35);
`

const SortBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`

const SortBtn = styled.button<{ $active?: boolean }>`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid ${({ $active }) => $active ? 'rgba(200,169,110,0.6)' : 'rgba(255,255,255,0.10)'};
  background: ${({ $active }) => $active ? 'rgba(200,169,110,0.12)' : 'transparent'};
  color: ${({ $active }) => $active ? '#c8a96e' : 'rgba(245,240,232,0.45)'};
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: rgba(200,169,110,0.4); color: rgba(245,240,232,0.75); }
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Card = styled.div<{ $unread?: boolean }>`
  background: rgba(255,255,255,0.03);
  border: 1px solid ${({ $unread }) => $unread ? 'rgba(200,169,110,0.25)' : 'rgba(255,255,255,0.07)'};
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.15s;
  &:hover { border-color: rgba(255,255,255,0.13); }
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  cursor: pointer;
`

const UnreadDot = styled.div<{ $unread?: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #c8a96e;
  flex-shrink: 0;
  opacity: ${({ $unread }) => $unread ? 1 : 0};
`

const CardMeta = styled.div`
  flex: 1;
  min-width: 0;
`

const CardName = styled.div`
  font-family: 'Special Elite', serif;
  font-size: 15px;
  color: #f5f0e8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CardSub = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: rgba(245,240,232,0.35);
  margin-top: 3px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`

const SubjectBadge = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 3px;
  background: rgba(200,169,110,0.1);
  color: #c8a96e;
  border: 1px solid rgba(200,169,110,0.2);
  flex-shrink: 0;
`

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

const DeleteBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 5px;
  color: rgba(245,240,232,0.3);
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.3); color: #f87171; }
  svg { width: 13px; height: 13px; }
`

const ToggleReadBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 10px;
  height: 30px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 5px;
  color: rgba(245,240,232,0.35);
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  svg { width: 12px; height: 12px; flex-shrink: 0; }
  &:hover {
    border-color: rgba(200,169,110,0.4);
    color: #c8a96e;
    background: rgba(200,169,110,0.06);
  }
  .btn-label {
    @media (max-width: 480px) { display: none; }
  }

  @media (max-width: 480px) {
    padding: 0 8px;
    width: 30px;
    justify-content: center;
  }
`

const Chevron = styled.div<{ $open?: boolean }>`
  color: rgba(245,240,232,0.25);
  transition: transform 0.2s;
  transform: ${({ $open }) => $open ? 'rotate(180deg)' : 'rotate(0)'};
  svg { display: block; width: 16px; height: 16px; }
`

const CardBody = styled.div<{ $open?: boolean }>`
  padding: ${({ $open }) => $open ? '0 16px 16px' : '0'};
  max-height: ${({ $open }) => $open ? '600px' : '0'};
  overflow: hidden;
  transition: max-height 0.25s ease, padding 0.15s;
`

const MessageText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: rgba(245,240,232,0.7);
  line-height: 1.65;
  white-space: pre-wrap;
  border-top: 1px solid rgba(255,255,255,0.06);
  padding-top: 14px;
`

const EmailLink = styled.a`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: #c8a96e;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  &:hover { text-decoration: underline; }
  svg { width: 12px; height: 12px; }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  svg { width: 36px; height: 36px; color: rgba(245,240,232,0.15); }
  p { font-family: 'Montserrat', sans-serif; font-size: 14px; color: rgba(245,240,232,0.25); }
`

// ─── Delete confirm overlay ──────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
`

const ConfirmBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: #1a1a1a;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  overflow: hidden;
`

const ConfirmBody = styled.div`
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  svg { width: 36px; height: 36px; color: #f87171; }
`

const ConfirmTitle = styled.h3`
  font-family: 'Special Elite', serif;
  font-size: 18px;
  color: #f5f0e8;
`

const ConfirmText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: rgba(245,240,232,0.45);
  line-height: 1.5;
`

const ConfirmFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid rgba(255,255,255,0.07);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`

const BtnGhost = styled.button`
  padding: 10px 20px;
  background: transparent;
  color: rgba(245,240,232,0.5);
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  cursor: pointer;
  &:hover { color: #f5f0e8; border-color: rgba(255,255,255,0.2); }
`

const BtnDanger = styled.button`
  padding: 10px 20px;
  background: #f87171;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.85; }
`

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SUBJECT_LABELS: Record<string, string> = {
  booking:   'Booking / Shows',
  imprensa:  'Imprensa',
  parceria:  'Parcerias',
  outro:     'Outro',
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const SORT_OPTIONS = [
  { key: 'newest',  label: 'Mais recente' },
  { key: 'oldest',  label: 'Mais antigo' },
  { key: 'unread',  label: 'Não lidas' },
  { key: 'subject', label: 'Assunto' },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ContatosAdminPage() {
  const [messages, setMessages] = useState<ContatoRow[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')
  const [openId, setOpenId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ContatoRow | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await createClient()
      .from('contatos')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages((data ?? []) as ContatoRow[])
    setLoading(false)
  }

  async function markRead(id: string) {
    await createClient().from('contatos').update({ read: true }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  async function toggleRead(e: React.MouseEvent, m: ContatoRow) {
    e.stopPropagation()
    const next = !m.read
    await createClient().from('contatos').update({ read: next }).eq('id', m.id)
    setMessages(prev => prev.map(x => x.id === m.id ? { ...x, read: next } : x))
  }

  function toggleOpen(id: string) {
    setOpenId(prev => {
      const next = prev === id ? null : id
      if (next) markRead(next)
      return next
    })
  }

  async function handleDelete() {
    if (!deleteTarget) return
    await createClient().from('contatos').delete().eq('id', deleteTarget.id)
    setMessages(prev => prev.filter(m => m.id !== deleteTarget.id))
    if (openId === deleteTarget.id) setOpenId(null)
    setDeleteTarget(null)
  }

  const sorted = [...messages].sort((a, b) => {
    if (sortBy === 'newest')  return new Date(b.created_at ?? '').getTime() - new Date(a.created_at ?? '').getTime()
    if (sortBy === 'oldest')  return new Date(a.created_at ?? '').getTime() - new Date(b.created_at ?? '').getTime()
    if (sortBy === 'unread')  return (a.read ? 1 : 0) - (b.read ? 1 : 0)
    if (sortBy === 'subject') return (a.subject ?? '').localeCompare(b.subject ?? '')
    return 0
  })

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <AdminLayout
      title="Contatos"
      subtitle={`Mensagens recebidas${unreadCount > 0 ? ` · ${unreadCount} não lida${unreadCount !== 1 ? 's' : ''}` : ''}`}
    >
      <TopBar>
        <Count>{messages.length} mensagem{messages.length !== 1 ? 's' : ''}</Count>
        <SortBar>
          {SORT_OPTIONS.map(({ key, label }) => (
            <SortBtn key={key} $active={sortBy === key} onClick={() => setSortBy(key)}>
              {label}
            </SortBtn>
          ))}
        </SortBar>
      </TopBar>

      {loading ? (
        <EmptyState><Inbox /><p>Carregando...</p></EmptyState>
      ) : sorted.length === 0 ? (
        <EmptyState><Inbox /><p>Nenhuma mensagem recebida ainda.</p></EmptyState>
      ) : (
        <List>
          {sorted.map(m => {
            const isOpen = openId === m.id
            return (
              <Card key={m.id} $unread={!m.read}>
                <CardHeader onClick={() => toggleOpen(m.id)}>
                  <UnreadDot $unread={!m.read} />
                  <CardMeta>
                    <CardName>{m.name}</CardName>
                    <CardSub>
                      <SubjectBadge>{SUBJECT_LABELS[m.subject ?? ''] ?? m.subject}</SubjectBadge>
                      <span>{fmtDate(m.created_at)}</span>
                    </CardSub>
                  </CardMeta>
                  <CardActions onClick={e => e.stopPropagation()}>
                    <ToggleReadBtn onClick={e => toggleRead(e, m)} title={m.read ? 'Marcar como não lida' : 'Marcar como lida'}>
                      {m.read ? <><MailOpen /><span className="btn-label"> Marcar como não lida</span></> : <><MailCheck /><span className="btn-label"> Marcar como lida</span></>}
                    </ToggleReadBtn>
                    <DeleteBtn onClick={() => setDeleteTarget(m)} title="Excluir">
                      <Trash2 />
                    </DeleteBtn>
                  </CardActions>
                  <Chevron $open={isOpen}>
                    <ChevronDown />
                  </Chevron>
                </CardHeader>

                <CardBody $open={isOpen}>
                  <MessageText>{m.message}</MessageText>
                  <EmailLink href={`mailto:${m.email}`}>
                    <Mail />
                    {m.email}
                  </EmailLink>
                </CardBody>
              </Card>
            )
          })}
        </List>
      )}

      {deleteTarget && (
        <Overlay onClick={e => { if (e.target === e.currentTarget) setDeleteTarget(null) }}>
          <ConfirmBox>
            <ConfirmBody>
              <AlertTriangle />
              <ConfirmTitle>Excluir mensagem?</ConfirmTitle>
              <ConfirmText>
                Mensagem de <strong>{deleteTarget.name}</strong> será excluída permanentemente.
              </ConfirmText>
            </ConfirmBody>
            <ConfirmFooter>
              <BtnGhost onClick={() => setDeleteTarget(null)}>Cancelar</BtnGhost>
              <BtnDanger onClick={handleDelete}>Excluir</BtnDanger>
            </ConfirmFooter>
          </ConfirmBox>
        </Overlay>
      )}
    </AdminLayout>
  )
}
