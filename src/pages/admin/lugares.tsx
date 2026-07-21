import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Plus, Pencil, Trash2, MapPin, Mail, Phone, MessageCircle, AlertTriangle, User, X, Search } from 'lucide-react'
import AdminLayout from '../../components/Admin/AdminLayout'
import { createClient } from '../../lib/supabase/client'

// ─── Types ───────────────────────────────────────────────────────────────────

type ContactType = 'email' | 'telefone' | 'whatsapp'

interface PlaceRow {
  id: string
  name: string
  venue_contact_name: string | null
  band_contact_name: string | null
  contact_type: ContactType | null
  contact_value: string | null
  location: string | null
  description: string | null
  feedback: string | null
  created_at: string
}

interface PlaceFormData {
  name: string
  venue_contact_name: string
  band_contact_name: string
  contact_type: ContactType
  contact_value: string
  location: string
  description: string
  feedback: string
}

type ModalState =
  | { type: 'add' }
  | { type: 'edit'; item: PlaceRow }
  | { type: 'delete'; item: PlaceRow }

// ─── Constants ───────────────────────────────────────────────────────────────

const C = {
  gold:   '#c8a96e',
  sage:   '#878766',
  cream:  '#f5f0e8',
  cream2: 'rgba(245,240,232,0.6)',
  dim:    'rgba(245,240,232,0.3)',
  border: 'rgba(255,255,255,0.07)',
  card:   'rgba(255,255,255,0.03)',
  red:    '#f87171',
}

const CONTACT_TYPES: { key: ContactType; label: string; icon: typeof Mail }[] = [
  { key: 'email',    label: 'Email',    icon: Mail },
  { key: 'telefone', label: 'Telefone', icon: Phone },
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
]

function contactMeta(type: ContactType | null) {
  return CONTACT_TYPES.find(c => c.key === type) ?? null
}

function contactHref(type: ContactType | null, value: string | null): string | null {
  if (!type || !value) return null
  if (type === 'email') return `mailto:${value}`
  if (type === 'telefone') return `tel:${value.replace(/[^\d+]/g, '')}`
  if (type === 'whatsapp') return `https://wa.me/${value.replace(/\D/g, '')}`
  return null
}

const EMPTY_FORM: PlaceFormData = {
  name: '',
  venue_contact_name: '',
  band_contact_name: '',
  contact_type: 'whatsapp',
  contact_value: '',
  location: '',
  description: '',
  feedback: '',
}

// ─── Styled components ───────────────────────────────────────────────────────

const TopBar = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px;
`

const Count = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px; color: ${C.dim};
`

const AddBtn = styled.button`
  display: flex; align-items: center; gap: 8px;
  padding: 10px 18px;
  background: ${C.gold}; color: #0d0d0d;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  border: none; border-radius: 6px; cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.85; }
  svg { width: 15px; height: 15px; }
`

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 20px;
  svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: ${C.dim}; }
`

const SearchInput = styled.input`
  width: 100%; padding: 10px 14px 10px 40px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: ${C.cream}; font-family: 'Montserrat', sans-serif; font-size: 13px;
  outline: none;
  &:focus { border-color: ${C.gold}; }
  &::placeholder { color: ${C.dim}; }
`

const List = styled.div`
  display: flex; flex-direction: column; gap: 10px;
`

const Card = styled.div`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 10px;
  padding: 16px 18px;
  transition: border-color 0.15s;
  &:hover { border-color: rgba(255,255,255,0.13); }
`

const CardTop = styled.div`
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
`

const PlaceName = styled.h3`
  font-family: 'Special Elite', serif;
  font-size: 17px; color: ${C.cream}; margin: 0;
`

const LocationRow = styled.div`
  display: flex; align-items: center; gap: 6px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px; color: ${C.dim};
  margin-top: 4px;
  svg { width: 12px; height: 12px; flex-shrink: 0; }
`

const CardActions = styled.div`
  display: flex; align-items: center; gap: 6px; flex-shrink: 0;
`

const EditBtn = styled.button`
  display: flex; align-items: center; gap: 5px;
  padding: 6px 10px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 5px;
  color: ${C.cream2};
  font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 600;
  cursor: pointer; transition: all 0.15s;
  &:hover { background: rgba(255,255,255,0.1); color: ${C.cream}; }
  svg { width: 11px; height: 11px; }
`

const DeleteBtn = styled.button`
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 5px;
  color: ${C.dim}; cursor: pointer; transition: all 0.15s;
  &:hover { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.3); color: ${C.red}; }
  svg { width: 12px; height: 12px; }
`

const ContactsRow = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px 16px;
  margin-top: 12px;
`

const ContactChip = styled.div`
  display: flex; align-items: center; gap: 6px;
  font-family: 'Montserrat', sans-serif; font-size: 12px; color: ${C.cream2};
  svg { width: 12px; height: 12px; color: ${C.sage}; flex-shrink: 0; }
`

const ContactLink = styled.a`
  color: ${C.gold}; text-decoration: none;
  &:hover { text-decoration: underline; }
`

const NoteText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px; color: ${C.dim}; line-height: 1.5;
  margin: 10px 0 0;
`

const NoteLabel = styled.span`
  font-weight: 700; color: ${C.sage};
  text-transform: uppercase; font-size: 10px; letter-spacing: 0.06em;
  margin-right: 6px;
`

const EmptyState = styled.div`
  text-align: center; padding: 40px 24px;
  color: ${C.dim}; font-family: 'Montserrat', sans-serif; font-size: 13px;
  border: 1px dashed ${C.border}; border-radius: 8px;
`

// ─── Modal styled ─────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 100; padding: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0; align-items: stretch;
  }
`

const ModalBox = styled.div`
  width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto;
  background: #1a1a1a;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  display: flex; flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-width: 100%; max-height: 100%; height: 100%; border-radius: 0; border: none;
  }
`

const ModalHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  position: sticky; top: 0; background: #1a1a1a; z-index: 1;
`

const ModalTitle = styled.h2`
  font-family: 'Special Elite', serif;
  font-size: 18px; color: ${C.cream}; font-weight: 400;
`

const CloseBtn = styled.button`
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.05); border: none; border-radius: 6px;
  color: ${C.cream2}; cursor: pointer;
  &:hover { background: rgba(255,255,255,0.1); color: ${C.cream}; }
  svg { width: 16px; height: 16px; }
`

const ModalBody = styled.div`
  padding: 24px; display: flex; flex-direction: column; gap: 14px;
`

const ModalFooter = styled.div`
  padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.07);
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
  position: sticky; bottom: 0; background: #1a1a1a;
`

const Field = styled.div`
  display: flex; flex-direction: column; gap: 6px;
`

const FieldRow = styled.div<{ $cols?: string }>`
  display: grid;
  grid-template-columns: ${p => p.$cols ?? '1fr 1fr'};
  gap: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`

const Label = styled.label`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  color: ${C.cream2};
`

const Input = styled.input`
  padding: 10px 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: ${C.cream}; font-family: 'Montserrat', sans-serif; font-size: 14px;
  outline: none; transition: border-color 0.15s;
  &:focus { border-color: ${C.gold}; }
  &::placeholder { color: ${C.dim}; }
`

const Select = styled.select`
  padding: 10px 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: ${C.cream}; font-family: 'Montserrat', sans-serif; font-size: 14px;
  outline: none; transition: border-color 0.15s;
  &:focus { border-color: ${C.gold}; }
  option { background: #1a1a1a; }
`

const Textarea = styled.textarea`
  padding: 10px 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: ${C.cream}; font-family: 'Montserrat', sans-serif; font-size: 14px;
  outline: none; resize: vertical; min-height: 64px;
  transition: border-color 0.15s;
  &:focus { border-color: ${C.gold}; }
  &::placeholder { color: ${C.dim}; }
`

const BtnPrimary = styled.button`
  padding: 10px 20px;
  background: ${C.gold}; color: #0d0d0d;
  font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  border: none; border-radius: 6px; cursor: pointer; transition: opacity 0.15s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const BtnGhost = styled.button`
  padding: 10px 20px;
  background: transparent; color: ${C.cream2};
  font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600;
  border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; cursor: pointer;
  &:hover { color: ${C.cream}; border-color: rgba(255,255,255,0.2); }
`

const BtnDanger = styled(BtnPrimary)`
  background: ${C.red}; color: #fff;
`

const ConfirmBox = styled(ModalBox)`max-width: 400px;`

const ConfirmBody = styled.div`
  padding: 28px 24px; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center;
  svg { width: 36px; height: 36px; color: ${C.red}; }
`

const ConfirmTitle = styled.h3`
  font-family: 'Special Elite', serif; font-size: 18px; color: ${C.cream};
`

const ConfirmText = styled.p`
  font-family: 'Montserrat', sans-serif; font-size: 13px; color: ${C.cream2}; line-height: 1.5;
`

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminLugaresPage() {
  const [items, setItems]     = useState<PlaceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState<ModalState | null>(null)
  const [form, setForm]       = useState<PlaceFormData>(EMPTY_FORM)
  const [saving, setSaving]   = useState(false)
  const [formError, setFormError] = useState('')
  const [search, setSearch]   = useState('')

  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('play_venues')
      .select('*')
      .order('name')
    setItems((data as PlaceRow[]) ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  function openAdd() {
    setForm({ ...EMPTY_FORM })
    setFormError('')
    setModal({ type: 'add' })
  }

  function openEdit(item: PlaceRow) {
    setForm({
      name: item.name,
      venue_contact_name: item.venue_contact_name ?? '',
      band_contact_name: item.band_contact_name ?? '',
      contact_type: item.contact_type ?? 'whatsapp',
      contact_value: item.contact_value ?? '',
      location: item.location ?? '',
      description: item.description ?? '',
      feedback: item.feedback ?? '',
    })
    setFormError('')
    setModal({ type: 'edit', item })
  }

  function openDelete(item: PlaceRow) {
    setModal({ type: 'delete', item })
  }

  function closeModal() {
    setModal(null)
    setFormError('')
    setSaving(false)
  }

  function setField(key: keyof PlaceFormData, val: string) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleSave() {
    if (!modal || modal.type === 'delete') return
    if (!form.name.trim()) {
      setFormError('O nome do lugar é obrigatório.')
      return
    }
    setSaving(true)
    setFormError('')

    const payload = {
      name: form.name.trim(),
      venue_contact_name: form.venue_contact_name.trim() || null,
      band_contact_name: form.band_contact_name.trim() || null,
      contact_type: form.contact_value.trim() ? form.contact_type : null,
      contact_value: form.contact_value.trim() || null,
      location: form.location.trim() || null,
      description: form.description.trim() || null,
      feedback: form.feedback.trim() || null,
    }

    let error: { message: string } | null = null
    if (modal.type === 'add') {
      ;({ error } = await supabase.from('play_venues').insert(payload))
    } else {
      ;({ error } = await supabase.from('play_venues').update(payload).eq('id', modal.item.id))
    }

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
    await supabase.from('play_venues').delete().eq('id', modal.item.id)
    closeModal()
    load()
  }

  const isFormModal = modal?.type === 'add' || modal?.type === 'edit'
  const isDeleteModal = modal?.type === 'delete'

  const filteredItems = search.trim()
    ? items.filter(item => {
        const q = search.trim().toLowerCase()
        return item.name.toLowerCase().includes(q) || (item.location ?? '').toLowerCase().includes(q)
      })
    : items

  return (
    <AdminLayout title="Lugares para tocar" subtitle="Locais e contatos de booking">
      <TopBar>
        <Count>{filteredItems.length} lugar{filteredItems.length !== 1 ? 'es' : ''}</Count>
        <AddBtn onClick={openAdd}><Plus /> Adicionar lugar</AddBtn>
      </TopBar>

      <SearchBar>
        <Search />
        <SearchInput
          placeholder="Buscar por nome ou localização..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </SearchBar>

      {loading ? (
        <EmptyState>Carregando...</EmptyState>
      ) : items.length === 0 ? (
        <EmptyState>Nenhum lugar cadastrado ainda.</EmptyState>
      ) : filteredItems.length === 0 ? (
        <EmptyState>Nenhum lugar encontrado para &quot;{search}&quot;.</EmptyState>
      ) : (
        <List>
          {filteredItems.map(item => {
            const meta = contactMeta(item.contact_type)
            const href = contactHref(item.contact_type, item.contact_value)
            return (
              <Card key={item.id}>
                <CardTop>
                  <div>
                    <PlaceName>{item.name}</PlaceName>
                    {item.location && (
                      <LocationRow><MapPin /> {item.location}</LocationRow>
                    )}
                  </div>
                  <CardActions>
                    <EditBtn onClick={() => openEdit(item)}><Pencil /> Editar</EditBtn>
                    <DeleteBtn onClick={() => openDelete(item)} title="Excluir"><Trash2 /></DeleteBtn>
                  </CardActions>
                </CardTop>

                <ContactsRow>
                  {item.venue_contact_name && (
                    <ContactChip><User /> Responsável do lugar: {item.venue_contact_name}</ContactChip>
                  )}
                  {item.band_contact_name && (
                    <ContactChip><User /> Contato pela banda: {item.band_contact_name}</ContactChip>
                  )}
                  {meta && item.contact_value && (
                    <ContactChip>
                      <meta.icon />
                      {meta.label}:{' '}
                      {href ? <ContactLink href={href} target="_blank" rel="noreferrer">{item.contact_value}</ContactLink> : item.contact_value}
                    </ContactChip>
                  )}
                </ContactsRow>

                {item.description && (
                  <NoteText><NoteLabel>Descrição</NoteLabel>{item.description}</NoteText>
                )}
                {item.feedback && (
                  <NoteText><NoteLabel>Feedback</NoteLabel>{item.feedback}</NoteText>
                )}
              </Card>
            )
          })}
        </List>
      )}

      {/* ── Add / Edit modal ── */}
      {isFormModal && modal && (
        <Overlay onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <ModalBox>
            <ModalHeader>
              <ModalTitle>{modal.type === 'add' ? 'Novo Lugar' : 'Editar Lugar'}</ModalTitle>
              <CloseBtn onClick={closeModal}><X /></CloseBtn>
            </ModalHeader>

            <ModalBody>
              <Field>
                <Label>Lugar *</Label>
                <Input
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder="Nome do local"
                />
              </Field>

              <FieldRow>
                <Field>
                  <Label>Responsável do lugar</Label>
                  <Input
                    value={form.venue_contact_name}
                    onChange={e => setField('venue_contact_name', e.target.value)}
                    placeholder="Nome de quem gere o espaço"
                  />
                </Field>
                <Field>
                  <Label>Responsável pelo contato</Label>
                  <Input
                    value={form.band_contact_name}
                    onChange={e => setField('band_contact_name', e.target.value)}
                    placeholder="Quem da banda trata deste contato"
                  />
                </Field>
              </FieldRow>

              <FieldRow $cols="140px 1fr">
                <Field>
                  <Label>Tipo de contato</Label>
                  <Select
                    value={form.contact_type}
                    onChange={e => setField('contact_type', e.target.value as ContactType)}
                  >
                    {CONTACT_TYPES.map(ct => (
                      <option key={ct.key} value={ct.key}>{ct.label}</option>
                    ))}
                  </Select>
                </Field>
                <Field>
                  <Label>Contato</Label>
                  <Input
                    value={form.contact_value}
                    onChange={e => setField('contact_value', e.target.value)}
                    placeholder={form.contact_type === 'email' ? 'email@exemplo.com' : '+351 9xx xxx xxx'}
                  />
                </Field>
              </FieldRow>

              <Field>
                <Label>Localização</Label>
                <Input
                  value={form.location}
                  onChange={e => setField('location', e.target.value)}
                  placeholder="Cidade / morada"
                />
              </Field>

              <Field>
                <Label>Descrição do lugar</Label>
                <Textarea
                  value={form.description}
                  onChange={e => setField('description', e.target.value)}
                  placeholder="Viabilidade, acesso, características do palco..."
                />
              </Field>

              <Field>
                <Label>Feedback do contato</Label>
                <Textarea
                  value={form.feedback}
                  onChange={e => setField('feedback', e.target.value)}
                  placeholder="Resultado da conversa, resposta recebida..."
                />
              </Field>

              {formError && <ConfirmText style={{ color: C.red }}>{formError}</ConfirmText>}
            </ModalBody>

            <ModalFooter>
              <BtnGhost onClick={closeModal}>Cancelar</BtnGhost>
              <BtnPrimary onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : modal.type === 'add' ? 'Adicionar' : 'Salvar'}
              </BtnPrimary>
            </ModalFooter>
          </ModalBox>
        </Overlay>
      )}

      {/* ── Delete confirm ── */}
      {isDeleteModal && modal && modal.type === 'delete' && (
        <Overlay onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <ConfirmBox>
            <ConfirmBody>
              <AlertTriangle />
              <ConfirmTitle>Excluir lugar?</ConfirmTitle>
              <ConfirmText>
                Tem certeza que quer excluir <strong>&quot;{modal.item.name}&quot;</strong>?
                Esta ação não pode ser desfeita.
              </ConfirmText>
            </ConfirmBody>
            <ModalFooter>
              <BtnGhost onClick={closeModal}>Cancelar</BtnGhost>
              <BtnDanger onClick={handleDelete}>Excluir</BtnDanger>
            </ModalFooter>
          </ConfirmBox>
        </Overlay>
      )}
    </AdminLayout>
  )
}
