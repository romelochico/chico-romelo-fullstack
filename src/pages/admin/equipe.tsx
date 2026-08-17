import { useState, useEffect, useCallback, useRef, type ChangeEvent } from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import { Plus, Mail, Phone, Cake, Share2, Upload, User as UserIcon } from 'lucide-react'
import AdminLayout from '../../components/Admin/AdminLayout'
import { createClient } from '../../lib/supabase/client'
import { MONTHS } from '../../lib/calendario'
import type { TeamMemberRow, Tier } from '../../types'

// ─── Types ───────────────────────────────────────────────────────────────────

interface MemberFormData {
  email: string
  nome: string
  sobrenome: string
  telefone: string
  data_nascimento: string
  redes_sociais: string
  papel: string
  avatar_url: string
  tier: Tier | ''
  is_band_member: boolean
}

type Modal =
  | { type: 'add' }
  | { type: 'edit'; item: TeamMemberRow }
  | { type: 'delete'; item: TeamMemberRow }
  | { type: 'view'; item: TeamMemberRow }

// ─── Constants ─────────────────────────────────────────────────────────────

const C = {
  gold: '#c8a96e',
  sage: '#878766',
  cream: '#f5f0e8',
  cream2: 'rgba(245,240,232,0.6)',
  dim: 'rgba(245,240,232,0.3)',
  dimmer: 'rgba(245,240,232,0.12)',
  border: 'rgba(255,255,255,0.07)',
  card: 'rgba(255,255,255,0.03)',
  red: '#f87171',
}

const TIER_LABELS: Record<Tier, string> = {
  admin: 'Admin',
  diretoria: 'Diretoria',
  marketing: 'Marketing',
  equipe: 'Equipe',
  membro_da_banda: 'Membro da Banda',
  percussao_e_metais: 'Percussão e Metais',
}

const ASSIGNABLE_TIERS: Tier[] = [
  'diretoria',
  'marketing',
  'equipe',
  'membro_da_banda',
  'percussao_e_metais',
]

const EMPTY_FORM: MemberFormData = {
  email: '',
  nome: '',
  sobrenome: '',
  telefone: '',
  data_nascimento: '',
  redes_sociais: '',
  papel: '',
  avatar_url: '',
  tier: '',
  is_band_member: true,
}

// ─── Styled components ────────────────────────────────────────────────────

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`

const Count = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: ${C.dim};
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
  svg {
    width: 14px;
    height: 14px;
  }
  &:hover {
    opacity: 0.85;
  }
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SectionTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${C.dim};
  margin: 28px 0 12px;

  &:first-of-type {
    margin-top: 0;
  }
`

const MemberCard = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 12px;
  padding: 14px 16px;
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s;
  &:hover {
    border-color: ${C.dimmer};
  }
`

const MemberIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1 1 180px;
  min-width: 0;
`

const MemberTags = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  flex-shrink: 0;
`

const Avatar = styled.div`
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(135, 135, 102, 0.12);
  border: 1px solid rgba(135, 135, 102, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${C.sage};

  svg {
    width: 18px;
    height: 18px;
  }
  img {
    object-fit: cover;
  }
`

const MemberInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const MemberName = styled.div`
  font-family: 'Special Elite', serif;
  font-size: 15px;
  color: ${C.cream};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const MemberMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 3px;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: ${C.dim};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const RoleTag = styled.span`
  flex-shrink: 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(200, 169, 110, 0.12);
  color: ${C.gold};
  border: 1px solid rgba(200, 169, 110, 0.2);
`

const RequestTag = styled.span`
  flex-shrink: 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(248, 113, 113, 0.12);
  color: ${C.red};
  border: 1px solid rgba(248, 113, 113, 0.25);
`

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${C.dim};
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  border: 1px dashed ${C.border};
  border-radius: 8px;
`

// ─── Modal styled ───────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0;
    align-items: stretch;
  }
`

const ModalBox = styled.div`
  background: #141414;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 32px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-width: 100%;
    max-height: 100%;
    height: 100%;
    border-radius: 0;
    border: none;
    padding: 24px 20px;
    /* clears the fixed mobile TopBar (56px) so content isn't hidden behind it */
    padding-top: 80px;
  }
`

const ModalTitle = styled.h2`
  font-family: 'Special Elite', serif;
  font-size: 20px;
  color: ${C.cream};
  margin: 0 0 20px;
`

const ModalAvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`

const ModalAvatarHint = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: ${C.dim};
  line-height: 1.4;
`

const AvatarUploadWrap = styled.div`
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
`

const AvatarUploadBadge = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${C.gold};
  border: 2px solid #141414;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 10px;
    height: 10px;
    color: #0d0d0d;
  }
`

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
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

const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: ${C.cream2};
  margin-bottom: 16px;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    accent-color: ${C.gold};
  }
`

const Input = styled.input`
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: ${C.cream};
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${C.gold};
  }
  &::placeholder {
    color: rgba(245, 240, 232, 0.2);
  }
`

const Select = styled.select`
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: ${C.cream};
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${C.gold};
  }
  option {
    background: #141414;
  }
`

const TierTag = styled.span`
  flex-shrink: 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(135, 135, 102, 0.15);
  color: ${C.sage};
  border: 1px solid rgba(135, 135, 102, 0.3);
`

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 8px;
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
  transition:
    border-color 0.15s,
    color 0.15s;
  &:hover {
    border-color: ${C.dim};
    color: ${C.cream};
  }
`

const ConfirmBtn = styled.button<{ $red?: boolean }>`
  padding: 10px 20px;
  background: ${({ $red }) => ($red ? C.red : C.gold)};
  border: none;
  border-radius: 6px;
  color: #0d0d0d;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover {
    opacity: 0.85;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const DeleteText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: ${C.cream2};
  line-height: 1.6;
  margin: 0;
`

const FormError = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: ${C.red};
  margin: -6px 0 16px;
`

// ─── Profile view modal ───────────────────────────────────────────────────

const ProfileBox = styled(ModalBox)`
  max-width: 380px;
  text-align: center;
`

const ProfileAvatarWrap = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  margin: 0 auto 16px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(135, 135, 102, 0.12);
  border: 2px solid ${C.gold};
  box-shadow: 0 0 0 4px rgba(200, 169, 110, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${C.gold};

  svg {
    width: 34px;
    height: 34px;
  }
  img {
    object-fit: cover;
  }
`

const ProfileInitials = styled.span`
  font-family: 'Special Elite', serif;
  font-size: 32px;
`

const ProfileName = styled.h3`
  font-family: 'Special Elite', serif;
  font-size: 22px;
  font-weight: 400;
  color: ${C.cream};
  margin: 0 0 6px;
`

const ProfileRole = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${C.gold};
  margin-bottom: 4px;
`

const ProfileSince = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: ${C.dim};
  margin-bottom: 10px;
`

const ProfileDivider = styled.div`
  height: 1px;
  background: ${C.border};
  margin: 10px 0 20px;
`

const ProfileInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
  margin-bottom: 24px;
`

const ProfileInfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`

const ProfileInfoIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: rgba(135, 135, 102, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  svg {
    width: 14px;
    height: 14px;
    color: ${C.sage};
  }
`

const ProfileInfoBody = styled.div`
  min-width: 0;
`

const ProfileInfoLabel = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${C.dim};
  margin-bottom: 2px;
`

const ProfileInfoValue = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: ${C.cream};
  word-break: break-word;
`

const ProfileActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
`

// ─── Helpers ────────────────────────────────────────────────────────────────

function fullName(item: TeamMemberRow): string {
  const name = [item.nome, item.sobrenome].filter(Boolean).join(' ').trim()
  return name || item.email
}

function initials(item: TeamMemberRow): string {
  const name = [item.nome, item.sobrenome].filter(Boolean).join(' ').trim()
  if (!name) return item.email.charAt(0).toUpperCase()
  return name
    .split(/\s+/)
    .map(w => w[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join('')
}

function formatDob(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return `${d} de ${MONTHS[m - 1]} de ${y}`
}

function formatSince(dateStr: string): string {
  const [y, m] = dateStr.split('-').map(Number)
  return `Na equipe desde ${MONTHS[m - 1]} de ${y}`
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function EquipePage() {
  const [items, setItems] = useState<TeamMemberRow[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Modal | null>(null)
  const [form, setForm] = useState<MemberFormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [currentEmail, setCurrentEmail] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('team_members').select('*').order('nome')
    setItems((data as TeamMemberRow[]) ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    load()
    supabase.auth.getUser().then(({ data }) => setCurrentEmail(data.user?.email ?? null))
  }, [load]) // eslint-disable-line react-hooks/exhaustive-deps

  const isAdmin = items.find(i => i.email === currentEmail?.toLowerCase())?.tier === 'admin'
  function canEdit(item: TeamMemberRow): boolean {
    return isAdmin || item.email === currentEmail
  }

  function openView(item: TeamMemberRow) {
    setModal({ type: 'view', item })
  }

  function openAdd() {
    setForm(EMPTY_FORM)
    setFormError('')
    setModal({ type: 'add' })
  }

  function openEdit(item: TeamMemberRow) {
    setForm({
      email: item.email,
      nome: item.nome ?? '',
      sobrenome: item.sobrenome ?? '',
      telefone: item.telefone ?? '',
      data_nascimento: item.data_nascimento ?? '',
      redes_sociais: item.redes_sociais ?? '',
      papel: item.papel ?? '',
      avatar_url: item.avatar_url ?? '',
      tier: item.tier ?? '',
      is_band_member: item.is_band_member,
    })
    setFormError('')
    setModal({ type: 'edit', item })
  }

  function closeModal() {
    setModal(null)
    setFormError('')
    setSaving(false)
  }

  function setField<K extends keyof MemberFormData>(key: K, val: MemberFormData[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleAvatarUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setFormError('')

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `avatars/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadErr } = await supabase.storage.from('media').upload(path, file)
    if (uploadErr) {
      setFormError('Erro no upload: ' + uploadErr.message)
      setUploading(false)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('media').getPublicUrl(path)
    setField('avatar_url', publicUrl)
    setUploading(false)
  }

  async function handleSave() {
    if (!modal || modal.type === 'delete') return
    if (!form.email.trim() || !form.nome.trim()) {
      setFormError('Email e primeiro nome são obrigatórios.')
      return
    }
    if (modal.type === 'add' && !form.tier) {
      setFormError('Selecione um tier — é isso que dá acesso ao painel.')
      return
    }
    setSaving(true)
    setFormError('')

    const payload = {
      email: form.email.trim().toLowerCase(),
      nome: form.nome.trim(),
      sobrenome: form.sobrenome.trim() || null,
      telefone: form.telefone.trim() || null,
      data_nascimento: form.data_nascimento || null,
      redes_sociais: form.redes_sociais.trim() || null,
      papel: form.papel.trim() || null,
      avatar_url: form.avatar_url.trim() || null,
      tier: form.tier || null,
      is_band_member: form.is_band_member,
    }

    const { error } =
      modal.type === 'add'
        ? await supabase.from('team_members').insert(payload)
        : await supabase.from('team_members').update(payload).eq('id', modal.item.id)

    if (error) {
      setFormError(error.message)
      setSaving(false)
      return
    }

    closeModal()
    load()
  }

  async function handleDelete() {
    if (!modal || modal.type !== 'delete') return
    await supabase.from('team_members').delete().eq('id', modal.item.id)
    closeModal()
    load()
  }

  async function toggleDeletionRequest(item: TeamMemberRow) {
    await supabase
      .from('team_members')
      .update({ delete_requested_at: item.delete_requested_at ? null : new Date().toISOString() })
      .eq('id', item.id)
    load()
  }

  const isFormModal = modal?.type === 'add' || modal?.type === 'edit'
  const pendingCount = items.filter(i => i.delete_requested_at).length
  const bandMembers = items.filter(i => i.is_band_member)
  const crewMembers = items.filter(i => !i.is_band_member)

  function renderMemberCard(item: TeamMemberRow) {
    return (
      <MemberCard key={item.id} onClick={() => openView(item)}>
        <MemberIdentity>
          <Avatar>
            {item.avatar_url ? (
              <Image src={item.avatar_url} alt="" fill sizes="42px" />
            ) : item.nome ? (
              initials(item)
            ) : (
              <UserIcon />
            )}
          </Avatar>
          <MemberInfo>
            <MemberName>{fullName(item)}</MemberName>
            <MemberMeta>
              <span>{item.email}</span>
            </MemberMeta>
          </MemberInfo>
        </MemberIdentity>
        <MemberTags>
          {item.papel && <RoleTag>{item.papel}</RoleTag>}
          {isAdmin && item.tier && <TierTag>{TIER_LABELS[item.tier]}</TierTag>}
          {item.delete_requested_at && <RequestTag>Exclusão solicitada</RequestTag>}
        </MemberTags>
      </MemberCard>
    )
  }

  return (
    <AdminLayout title="Banda e Equipe" subtitle="Perfis da banda e da equipe">
      <TopBar>
        <Count>
          {items.length} pessoa{items.length !== 1 ? 's' : ''}
          {isAdmin && pendingCount > 0 && (
            <>
              {' '}
              ·{' '}
              <RequestTag as="span">
                {pendingCount} pedido{pendingCount !== 1 ? 's' : ''} de exclusão
              </RequestTag>
            </>
          )}
        </Count>
        {isAdmin && (
          <AddBtn onClick={openAdd}>
            <Plus /> Convidar
          </AddBtn>
        )}
      </TopBar>

      {loading ? (
        <EmptyState>Carregando...</EmptyState>
      ) : items.length === 0 ? (
        <EmptyState>Nenhum membro cadastrado ainda.</EmptyState>
      ) : (
        <>
          {bandMembers.length > 0 && (
            <>
              <SectionTitle>Banda</SectionTitle>
              <List>{bandMembers.map(renderMemberCard)}</List>
            </>
          )}
          {crewMembers.length > 0 && (
            <>
              <SectionTitle>Equipe</SectionTitle>
              <List>{crewMembers.map(renderMemberCard)}</List>
            </>
          )}
        </>
      )}

      {/* ── Add / Edit modal ── */}
      {isFormModal && modal && (
        <Overlay onClick={closeModal}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalTitle>{modal.type === 'add' ? 'Convidar membro' : 'Editar membro'}</ModalTitle>

            <ModalAvatarRow>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarUpload}
              />
              <AvatarUploadWrap onClick={() => !uploading && avatarInputRef.current?.click()}>
                <Avatar>
                  {form.avatar_url ? (
                    <Image src={form.avatar_url} alt="" fill sizes="42px" />
                  ) : (
                    <UserIcon />
                  )}
                </Avatar>
                <AvatarUploadBadge>
                  <Upload />
                </AvatarUploadBadge>
              </AvatarUploadWrap>
              <ModalAvatarHint>
                {uploading
                  ? 'Enviando foto...'
                  : 'Clique na foto para trocar. Também sincroniza automaticamente no login com Google.'}
              </ModalAvatarHint>
            </ModalAvatarRow>

            <Field>
              <Label>Email {modal.type === 'add' ? '*' : ''}</Label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setField('email', e.target.value)}
                placeholder="nome@gmail.com"
                disabled={modal.type === 'edit'}
              />
              {modal.type === 'add' && (
                <ModalAvatarHint>
                  Isso não envia um email — a pessoa só ganha acesso quando fizer login com essa
                  conta Google.
                </ModalAvatarHint>
              )}
            </Field>

            <FieldRow>
              <Field style={{ marginBottom: 0 }}>
                <Label>Primeiro Nome *</Label>
                <Input
                  value={form.nome}
                  onChange={e => setField('nome', e.target.value)}
                  placeholder="Chico"
                />
              </Field>
              <Field style={{ marginBottom: 0 }}>
                <Label>Último Nome</Label>
                <Input
                  value={form.sobrenome}
                  onChange={e => setField('sobrenome', e.target.value)}
                  placeholder="Romelo"
                />
              </Field>
            </FieldRow>

            <Field>
              <Label>Papel / Função</Label>
              <Input
                value={form.papel}
                onChange={e => setField('papel', e.target.value)}
                placeholder="Baixista, Guitarrista, Produtor..."
              />
            </Field>

            {isAdmin && (
              <ToggleRow>
                <input
                  type="checkbox"
                  checked={form.is_band_member}
                  onChange={e => setField('is_band_member', e.target.checked)}
                />
                Membro da banda
              </ToggleRow>
            )}

            {isAdmin && !(modal.type === 'edit' && modal.item.tier === 'admin') && (
              <Field>
                <Label>Tier {modal.type === 'add' ? '*' : ''}</Label>
                <Select
                  value={form.tier}
                  onChange={e => setField('tier', e.target.value as Tier | '')}
                >
                  <option value="">
                    {modal.type === 'add' ? 'Selecione um tier...' : 'Sem acesso (revogado)'}
                  </option>
                  {ASSIGNABLE_TIERS.map(t => (
                    <option key={t} value={t}>
                      {TIER_LABELS[t]}
                    </option>
                  ))}
                </Select>
              </Field>
            )}

            <FieldRow>
              <Field style={{ marginBottom: 0 }}>
                <Label>Telefone</Label>
                <Input
                  type="tel"
                  value={form.telefone}
                  onChange={e => setField('telefone', e.target.value)}
                  placeholder="+351 912 345 678"
                />
              </Field>
              <Field style={{ marginBottom: 0 }}>
                <Label>Data de Nascimento</Label>
                <Input
                  type="date"
                  value={form.data_nascimento}
                  onChange={e => setField('data_nascimento', e.target.value)}
                />
              </Field>
            </FieldRow>

            <Field>
              <Label>Redes Sociais</Label>
              <Input
                value={form.redes_sociais}
                onChange={e => setField('redes_sociais', e.target.value)}
                placeholder="@chicoromelo no Instagram"
              />
            </Field>

            {formError && <FormError>{formError}</FormError>}

            <ModalActions>
              <CancelBtn onClick={closeModal}>Cancelar</CancelBtn>
              <ConfirmBtn onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : modal.type === 'add' ? 'Convidar' : 'Salvar'}
              </ConfirmBtn>
            </ModalActions>
          </ModalBox>
        </Overlay>
      )}

      {/* ── Profile view ── */}
      {modal?.type === 'view' && (
        <Overlay onClick={closeModal}>
          <ProfileBox onClick={e => e.stopPropagation()}>
            <ProfileAvatarWrap>
              {modal.item.avatar_url ? (
                <Image src={modal.item.avatar_url} alt="" fill sizes="96px" />
              ) : modal.item.nome ? (
                <ProfileInitials>{initials(modal.item)}</ProfileInitials>
              ) : (
                <UserIcon />
              )}
            </ProfileAvatarWrap>

            <ProfileName>{fullName(modal.item)}</ProfileName>
            {modal.item.papel && <ProfileRole>{modal.item.papel}</ProfileRole>}
            {isAdmin && modal.item.tier && <TierTag>{TIER_LABELS[modal.item.tier]}</TierTag>}
            {modal.item.created_at && (
              <ProfileSince>{formatSince(modal.item.created_at)}</ProfileSince>
            )}
            {modal.item.delete_requested_at && <RequestTag>Exclusão solicitada</RequestTag>}

            <ProfileDivider />

            <ProfileInfoList>
              <ProfileInfoRow>
                <ProfileInfoIcon>
                  <Mail />
                </ProfileInfoIcon>
                <ProfileInfoBody>
                  <ProfileInfoLabel>Email</ProfileInfoLabel>
                  <ProfileInfoValue>{modal.item.email}</ProfileInfoValue>
                </ProfileInfoBody>
              </ProfileInfoRow>

              {modal.item.telefone && (
                <ProfileInfoRow>
                  <ProfileInfoIcon>
                    <Phone />
                  </ProfileInfoIcon>
                  <ProfileInfoBody>
                    <ProfileInfoLabel>Telefone</ProfileInfoLabel>
                    <ProfileInfoValue>{modal.item.telefone}</ProfileInfoValue>
                  </ProfileInfoBody>
                </ProfileInfoRow>
              )}

              {modal.item.data_nascimento && (
                <ProfileInfoRow>
                  <ProfileInfoIcon>
                    <Cake />
                  </ProfileInfoIcon>
                  <ProfileInfoBody>
                    <ProfileInfoLabel>Data de Nascimento</ProfileInfoLabel>
                    <ProfileInfoValue>{formatDob(modal.item.data_nascimento)}</ProfileInfoValue>
                  </ProfileInfoBody>
                </ProfileInfoRow>
              )}

              {modal.item.redes_sociais && (
                <ProfileInfoRow>
                  <ProfileInfoIcon>
                    <Share2 />
                  </ProfileInfoIcon>
                  <ProfileInfoBody>
                    <ProfileInfoLabel>Redes Sociais</ProfileInfoLabel>
                    <ProfileInfoValue>{modal.item.redes_sociais}</ProfileInfoValue>
                  </ProfileInfoBody>
                </ProfileInfoRow>
              )}
            </ProfileInfoList>

            <ProfileActions>
              <CancelBtn onClick={closeModal}>Fechar</CancelBtn>
              {isAdmin && modal.item.delete_requested_at && (
                <CancelBtn onClick={() => toggleDeletionRequest(modal.item)}>
                  Recusar pedido
                </CancelBtn>
              )}
              {!isAdmin && modal.item.email === currentEmail && (
                <CancelBtn onClick={() => toggleDeletionRequest(modal.item)}>
                  {modal.item.delete_requested_at ? 'Cancelar solicitação' : 'Solicitar exclusão'}
                </CancelBtn>
              )}
              {canEdit(modal.item) && (
                <ConfirmBtn onClick={() => openEdit(modal.item)}>Editar</ConfirmBtn>
              )}
              {isAdmin && (
                <ConfirmBtn $red onClick={() => setModal({ type: 'delete', item: modal.item })}>
                  Apagar
                </ConfirmBtn>
              )}
            </ProfileActions>
          </ProfileBox>
        </Overlay>
      )}

      {/* ── Delete confirm ── */}
      {modal?.type === 'delete' && (
        <Overlay onClick={closeModal}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalTitle>Apagar membro</ModalTitle>
            <DeleteText>
              Tem certeza que quer apagar{' '}
              <strong style={{ color: C.cream }}>{fullName(modal.item)}</strong>? Esta ação não pode
              ser desfeita.
            </DeleteText>
            <ModalActions>
              <CancelBtn onClick={closeModal}>Cancelar</CancelBtn>
              <ConfirmBtn $red onClick={handleDelete}>
                Apagar
              </ConfirmBtn>
            </ModalActions>
          </ModalBox>
        </Overlay>
      )}
    </AdminLayout>
  )
}
