import { useState, useEffect, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { Plus, Pencil, Trash2, Eye, EyeOff, Copy, Check, Link2, KeyRound, Image, FileText, Music, Share2 } from 'lucide-react'
import AdminLayout from '../../components/Admin/AdminLayout'
import { createClient } from '../../lib/supabase/client'

// ─── Types ───────────────────────────────────────────────────────────────────

type LinkCategory = 'photos' | 'documents' | 'songs' | 'social'

interface LinkRow {
  id: string
  label: string
  url: string
  icon: string | null
  category: string | null
  order: number
  active: boolean
}

interface CredentialRow {
  id: string
  site_url: string
  label: string
  login: string
  password: string
  created_at: string
}

type ActiveSection = 'links' | 'credentials'

type LinkModal =
  | { type: 'add' }
  | { type: 'edit'; item: LinkRow }
  | { type: 'delete'; item: LinkRow }

type CredModal =
  | { type: 'add' }
  | { type: 'delete'; item: CredentialRow }

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES: { key: LinkCategory; label: string; Icon: React.ElementType }[] = [
  { key: 'photos',    label: 'Fotos',        Icon: Image   },
  { key: 'documents', label: 'Documentos',   Icon: FileText },
  { key: 'songs',     label: 'Músicas',      Icon: Music   },
  { key: 'social',    label: 'Redes Sociais', Icon: Share2  },
]

const C = {
  gold:    '#c8a96e',
  sage:    '#878766',
  cream:   '#f5f0e8',
  cream2:  'rgba(245,240,232,0.6)',
  dim:     'rgba(245,240,232,0.3)',
  dimmer:  'rgba(245,240,232,0.12)',
  border:  'rgba(255,255,255,0.07)',
  card:    'rgba(255,255,255,0.03)',
  red:     '#f87171',
}

// ─── Styled components ────────────────────────────────────────────────────────

const SectionTabs = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 28px;
  background: rgba(255,255,255,0.03);
  border: 1px solid ${C.border};
  border-radius: 8px;
  padding: 4px;
  width: fit-content;
`

const SectionTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border: none;
  border-radius: 6px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  background: ${({ $active }) => $active ? C.gold : 'transparent'};
  color: ${({ $active }) => $active ? '#0d0d0d' : C.dim};
  svg { width: 14px; height: 14px; }
  &:hover { color: ${({ $active }) => $active ? '#0d0d0d' : C.cream}; }
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`

const CategorySeparator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 24px 0 10px;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${C.sage};

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${C.border};
  }
`

const AddBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: ${C.gold};
  color: #0d0d0d;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.15s;
  svg { width: 14px; height: 14px; }
  &:hover { opacity: 0.85; }
`

const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
`

const LinkCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 8px;
  transition: border-color 0.15s;
  &:hover { border-color: ${C.dimmer}; }
`

const LinkIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(135,135,102,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  svg { width: 15px; height: 15px; color: ${C.sage}; }
`

const LinkInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const LinkLabel = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${C.cream};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const LinkUrl = styled.a`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: ${C.dim};
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  &:hover { color: ${C.sage}; }
`

const RowActions = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
`

const IconBtn = styled.button<{ $red?: boolean }>`
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: ${({ $red }) => $red ? C.red : C.dim};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  svg { width: 14px; height: 14px; }
  &:hover {
    background: ${({ $red }) => $red ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.06)'};
    color: ${({ $red }) => $red ? C.red : C.cream};
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${C.dim};
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  border: 1px dashed ${C.border};
  border-radius: 8px;
  margin-top: 20px;
`

// ─── Credentials styled ───────────────────────────────────────────────────────

const CredList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`

const CredCard = styled.div`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 10px;
  padding: 16px 18px;
  transition: border-color 0.15s;
  &:hover { border-color: ${C.dimmer}; }
`

const CredSite = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`

const CredSiteLabel = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${C.sage};
`

const CredSiteUrl = styled.a`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: ${C.dim};
  text-decoration: none;
  &:hover { color: ${C.sage}; }
`

const CredRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-top: 1px solid ${C.border};
`

const CredRowLabel = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${C.dim};
  width: 64px;
  flex-shrink: 0;
`

const CredValue = styled.button`
  flex: 1;
  text-align: left;
  background: transparent;
  border: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: ${C.cream};
  cursor: pointer;
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s;
  &:hover { color: ${C.gold}; }
  title { display: none; }
`

const CredActions = styled.div`
  display: flex;
  gap: 2px;
  flex-shrink: 0;
`

const fadeIn = keyframes`from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; }`

const CopyToast = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #4ade80;
  animation: ${fadeIn} 0.15s ease;
`

// ─── Modal styled ─────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`

const Modal = styled.div`
  background: #141414;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 32px;
  width: 100%;
  max-width: 440px;
`

const ModalTitle = styled.h2`
  font-family: 'Special Elite', serif;
  font-size: 20px;
  color: ${C.cream};
  margin: 0 0 24px;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`

const Label = styled.label`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${C.dim};
`

const Input = styled.input`
  padding: 10px 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: ${C.cream};
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
  &:focus { border-color: ${C.gold}; }
`

const Select = styled.select`
  padding: 10px 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: ${C.cream};
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
  &:focus { border-color: ${C.gold}; }
  option { background: #141414; }
`

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 24px;
`

const CancelBtn = styled.button`
  padding: 10px 20px;
  background: transparent;
  border: 1px solid ${C.border};
  border-radius: 6px;
  color: ${C.dim};
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  &:hover { border-color: ${C.dim}; color: ${C.cream}; }
`

const ConfirmBtn = styled.button<{ $red?: boolean }>`
  padding: 10px 20px;
  background: ${({ $red }) => $red ? C.red : C.gold};
  border: none;
  border-radius: 6px;
  color: #0d0d0d;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const DeleteText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: ${C.cream2};
  line-height: 1.6;
  margin: 0;
`

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryIcon(cat: string | null): React.ReactNode {
  switch (cat) {
    case 'photos':    return <Image size={15} />
    case 'documents': return <FileText size={15} />
    case 'songs':     return <Music size={15} />
    case 'social':    return <Share2 size={15} />
    default:          return <Link2 size={15} />
  }
}

async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface CredentialCardProps {
  item: CredentialRow
  onDelete: (item: CredentialRow) => void
}

function CredentialCard({ item, onDelete }: CredentialCardProps) {
  const [showPass, setShowPass] = useState(false)
  const [copied, setCopied] = useState<'login' | 'password' | null>(null)

  async function handleCopy(field: 'login' | 'password', value: string) {
    await copyToClipboard(value)
    setCopied(field)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <CredCard>
      <CredSite>
        <CredSiteLabel>{item.label}</CredSiteLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CredSiteUrl href={item.site_url} target="_blank" rel="noreferrer">
            {item.site_url.replace(/^https?:\/\//, '')}
          </CredSiteUrl>
          <IconBtn $red onClick={() => onDelete(item)} title="Apagar">
            <Trash2 />
          </IconBtn>
        </div>
      </CredSite>

      <CredRow>
        <CredRowLabel>Login</CredRowLabel>
        <CredValue onClick={() => handleCopy('login', item.login)} title="Clique para copiar">
          {item.login}
        </CredValue>
        <CredActions>
          {copied === 'login'
            ? <CopyToast>Copiado!</CopyToast>
            : (
              <IconBtn onClick={() => handleCopy('login', item.login)} title="Copiar login">
                <Copy />
              </IconBtn>
            )}
        </CredActions>
      </CredRow>

      <CredRow>
        <CredRowLabel>Senha</CredRowLabel>
        <CredValue onClick={() => handleCopy('password', item.password)} title="Clique para copiar">
          {showPass ? item.password : '••••••••••••'}
        </CredValue>
        <CredActions>
          {copied === 'password'
            ? <CopyToast>Copiado!</CopyToast>
            : (
              <>
                <IconBtn onClick={() => setShowPass(s => !s)} title={showPass ? 'Ocultar' : 'Revelar'}>
                  {showPass ? <EyeOff /> : <Eye />}
                </IconBtn>
                <IconBtn onClick={() => handleCopy('password', item.password)} title="Copiar senha">
                  <Copy />
                </IconBtn>
              </>
            )}
        </CredActions>
      </CredRow>
    </CredCard>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LinksPage() {
  const [section, setSection]           = useState<ActiveSection>('links')
  const [links, setLinks]               = useState<LinkRow[]>([])
  const [credentials, setCredentials]   = useState<CredentialRow[]>([])
  const [linkModal, setLinkModal]       = useState<LinkModal | null>(null)
  const [credModal, setCredModal]       = useState<CredModal | null>(null)
  const [saving, setSaving]             = useState(false)

  // Link form state
  const [linkForm, setLinkForm] = useState({ label: '', url: '', category: 'photos' as LinkCategory })

  // Credential form state
  const [credForm, setCredForm] = useState({ site_url: '', label: '', login: '', password: '' })

  const supabase = createClient()

  const loadLinks = useCallback(async () => {
    const { data } = await supabase.from('links').select('*').order('order')
    setLinks((data as LinkRow[]) ?? [])
  }, [supabase])

  const loadCredentials = useCallback(async () => {
    const { data } = await supabase.from('credentials').select('*').order('created_at', { ascending: false })
    setCredentials((data as CredentialRow[]) ?? [])
  }, [supabase])

  useEffect(() => { loadLinks() }, [loadLinks])
  useEffect(() => { loadCredentials() }, [loadCredentials])

  // ── Link CRUD ──────────────────────────────────────────────────────────────

  function openAddLink() {
    setLinkForm({ label: '', url: '', category: 'photos' })
    setLinkModal({ type: 'add' })
  }

  function openEditLink(item: LinkRow) {
    setLinkForm({ label: item.label, url: item.url, category: (item.category ?? 'photos') as LinkCategory })
    setLinkModal({ type: 'edit', item })
  }

  async function authHeaders(extra: Record<string, string> = {}): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...extra,
    }
  }

  async function saveLink() {
    setSaving(true)
    if (linkModal?.type === 'add') {
      await fetch('/api/admin/links', {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({ ...linkForm, active: true, order: links.length }),
      })
    } else if (linkModal?.type === 'edit') {
      await fetch(`/api/admin/links/${linkModal.item.id}`, {
        method: 'PUT',
        headers: await authHeaders(),
        body: JSON.stringify(linkForm),
      })
    }
    await loadLinks()
    setLinkModal(null)
    setSaving(false)
  }

  async function deleteLink(item: LinkRow) {
    await fetch(`/api/admin/links/${item.id}`, { method: 'DELETE', headers: await authHeaders() })
    await loadLinks()
    setLinkModal(null)
  }

  // ── Credential CRUD ────────────────────────────────────────────────────────

  function openAddCred() {
    setCredForm({ site_url: '', label: '', login: '', password: '' })
    setCredModal({ type: 'add' })
  }

  async function saveCred() {
    setSaving(true)
    await fetch('/api/admin/credentials', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(credForm),
    })
    await loadCredentials()
    setCredModal(null)
    setSaving(false)
  }

  async function deleteCred(item: CredentialRow) {
    await fetch(`/api/admin/credentials/${item.id}`, { method: 'DELETE', headers: await authHeaders() })
    await loadCredentials()
    setCredModal(null)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <AdminLayout title="Links e Credenciais" subtitle="Hub de links e acessos">

      {/* Section tabs */}
      <SectionTabs>
        <SectionTab $active={section === 'links'} onClick={() => setSection('links')}>
          <Link2 /> Links
        </SectionTab>
        <SectionTab $active={section === 'credentials'} onClick={() => setSection('credentials')}>
          <KeyRound /> Credenciais
        </SectionTab>
      </SectionTabs>

      {/* ── LINKS SECTION ── */}
      {section === 'links' && (
        <>
          <TopBar>
            <span style={{ fontFamily: 'Montserrat', fontSize: 12, color: 'rgba(245,240,232,0.3)' }}>
              {links.length} link{links.length !== 1 ? 's' : ''}
            </span>
            <AddBtn onClick={openAddLink}>
              <Plus /> Adicionar
            </AddBtn>
          </TopBar>

          {links.length === 0 ? (
            <EmptyState>Nenhum link adicionado</EmptyState>
          ) : (
            CATEGORIES.map(({ key, label, Icon }) => {
              const group = links.filter(l => l.category === key)
              if (group.length === 0) return null
              return (
                <div key={key}>
                  <CategorySeparator>
                    <Icon size={13} />
                    {label}
                  </CategorySeparator>
                  <LinkList>
                    {group.map(item => (
                      <LinkCard key={item.id}>
                        <LinkIcon>{getCategoryIcon(item.category)}</LinkIcon>
                        <LinkInfo>
                          <LinkLabel>{item.label}</LinkLabel>
                          <LinkUrl href={item.url} target="_blank" rel="noreferrer">{item.url}</LinkUrl>
                        </LinkInfo>
                        <RowActions>
                          <IconBtn onClick={() => openEditLink(item)} title="Editar"><Pencil /></IconBtn>
                          <IconBtn $red onClick={() => setLinkModal({ type: 'delete', item })} title="Apagar"><Trash2 /></IconBtn>
                        </RowActions>
                      </LinkCard>
                    ))}
                  </LinkList>
                </div>
              )
            })
          )}
        </>
      )}

      {/* ── CREDENTIALS SECTION ── */}
      {section === 'credentials' && (
        <>
          <TopBar>
            <span style={{ fontFamily: 'Montserrat', fontSize: 12, color: 'rgba(245,240,232,0.3)' }}>
              {credentials.length} credencial{credentials.length !== 1 ? 'is' : ''}
            </span>
            <AddBtn onClick={openAddCred}>
              <Plus /> Adicionar
            </AddBtn>
          </TopBar>

          <CredList>
            {credentials.length === 0 ? (
              <EmptyState>Nenhuma credencial guardada</EmptyState>
            ) : credentials.map(item => (
              <CredentialCard key={item.id} item={item} onDelete={c => setCredModal({ type: 'delete', item: c })} />
            ))}
          </CredList>
        </>
      )}

      {/* ── LINK MODALS ── */}
      {linkModal && linkModal.type !== 'delete' && (
        <Overlay onClick={() => setLinkModal(null)}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalTitle>{linkModal.type === 'add' ? 'Adicionar link' : 'Editar link'}</ModalTitle>
            <Field>
              <Label>Label</Label>
              <Input value={linkForm.label} onChange={e => setLinkForm(f => ({ ...f, label: e.target.value }))} placeholder="Ex: Google Drive" />
            </Field>
            <Field>
              <Label>URL</Label>
              <Input value={linkForm.url} onChange={e => setLinkForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." />
            </Field>
            <Field>
              <Label>Categoria</Label>
              <Select value={linkForm.category} onChange={e => setLinkForm(f => ({ ...f, category: e.target.value as LinkCategory }))}>
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </Select>
            </Field>
            <ModalActions>
              <CancelBtn onClick={() => setLinkModal(null)}>Cancelar</CancelBtn>
              <ConfirmBtn onClick={saveLink} disabled={saving || !linkForm.label || !linkForm.url}>
                {saving ? 'A guardar...' : 'Guardar'}
              </ConfirmBtn>
            </ModalActions>
          </Modal>
        </Overlay>
      )}

      {linkModal?.type === 'delete' && (
        <Overlay onClick={() => setLinkModal(null)}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalTitle>Apagar link</ModalTitle>
            <DeleteText>Tens a certeza que queres apagar <strong style={{ color: 'rgba(245,240,232,0.9)' }}>{linkModal.item.label}</strong>? Esta ação não pode ser desfeita.</DeleteText>
            <ModalActions>
              <CancelBtn onClick={() => setLinkModal(null)}>Cancelar</CancelBtn>
              <ConfirmBtn $red onClick={() => deleteLink(linkModal.item)}>Apagar</ConfirmBtn>
            </ModalActions>
          </Modal>
        </Overlay>
      )}

      {/* ── CREDENTIAL MODALS ── */}
      {credModal?.type === 'add' && (
        <Overlay onClick={() => setCredModal(null)}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalTitle>Adicionar credencial</ModalTitle>
            <Field>
              <Label>Nome / Plataforma</Label>
              <Input value={credForm.label} onChange={e => setCredForm(f => ({ ...f, label: e.target.value }))} placeholder="Ex: Gmail" />
            </Field>
            <Field>
              <Label>URL do site</Label>
              <Input value={credForm.site_url} onChange={e => setCredForm(f => ({ ...f, site_url: e.target.value }))} placeholder="https://gmail.com" />
            </Field>
            <Field>
              <Label>Login / Email</Label>
              <Input value={credForm.login} onChange={e => setCredForm(f => ({ ...f, login: e.target.value }))} placeholder="romelochico@gmail.com" />
            </Field>
            <Field>
              <Label>Senha</Label>
              <Input type="password" value={credForm.password} onChange={e => setCredForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
            </Field>
            <ModalActions>
              <CancelBtn onClick={() => setCredModal(null)}>Cancelar</CancelBtn>
              <ConfirmBtn onClick={saveCred} disabled={saving || !credForm.label || !credForm.login || !credForm.password}>
                {saving ? 'A guardar...' : 'Guardar'}
              </ConfirmBtn>
            </ModalActions>
          </Modal>
        </Overlay>
      )}

      {credModal?.type === 'delete' && (
        <Overlay onClick={() => setCredModal(null)}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalTitle>Apagar credencial</ModalTitle>
            <DeleteText>Tens a certeza que queres apagar as credenciais de <strong style={{ color: 'rgba(245,240,232,0.9)' }}>{credModal.item.label}</strong>?</DeleteText>
            <ModalActions>
              <CancelBtn onClick={() => setCredModal(null)}>Cancelar</CancelBtn>
              <ConfirmBtn $red onClick={() => deleteCred(credModal.item)}>Apagar</ConfirmBtn>
            </ModalActions>
          </Modal>
        </Overlay>
      )}

    </AdminLayout>
  )
}
