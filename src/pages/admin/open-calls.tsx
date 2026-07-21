import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Plus, Pencil, Trash2, ExternalLink, FileText, Award, AlertTriangle, X, Search } from 'lucide-react'
import AdminLayout from '../../components/Admin/AdminLayout'
import { createClient } from '../../lib/supabase/client'

// ─── Types ───────────────────────────────────────────────────────────────────

interface OpenCallRow {
  id: string
  name: string
  website_url: string | null
  application_period: string | null
  application_date: string
  form_url: string | null
  prizes: string | null
  created_at: string
}

interface OpenCallFormData {
  name: string
  website_url: string
  application_period: string
  application_date: string
  form_url: string
  prizes: string
}

type ModalState =
  | { type: 'add' }
  | { type: 'edit'; item: OpenCallRow }
  | { type: 'delete'; item: OpenCallRow }

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
  orange: '#fb923c',
}

const ALERT_WINDOW_DAYS = 7

const EMPTY_FORM: OpenCallFormData = {
  name: '',
  website_url: '',
  application_period: '',
  application_date: '',
  form_url: '',
  prizes: '',
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(`${dateStr}T00:00:00`)
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`
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

const AlertBanner = styled.div`
  display: flex; align-items: center; gap: 10px;
  padding: 14px 18px;
  background: rgba(248,113,113,0.08);
  border: 1px solid rgba(248,113,113,0.3);
  border-radius: 10px;
  color: ${C.red};
  font-family: 'Montserrat', sans-serif; font-size: 13px;
  margin-bottom: 20px;
  svg { width: 18px; height: 18px; flex-shrink: 0; }
`

const List = styled.div`
  display: flex; flex-direction: column; gap: 10px;
`

const Card = styled.div<{ $urgent?: boolean }>`
  background: ${({ $urgent }) => $urgent ? 'rgba(248,113,113,0.05)' : C.card};
  border: 1px solid ${({ $urgent }) => $urgent ? 'rgba(248,113,113,0.25)' : C.border};
  border-radius: 10px;
  padding: 16px 18px;
  transition: border-color 0.15s;
  &:hover { border-color: ${({ $urgent }) => $urgent ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.13)'}; }
`

const CardTop = styled.div`
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
`

const NameRow = styled.div`
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
`

const CallName = styled.h3`
  font-family: 'Special Elite', serif;
  font-size: 17px; color: ${C.cream}; margin: 0;
`

const DateBadge = styled.span<{ $tone: 'urgent' | 'past' | 'normal' }>`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
  padding: 3px 9px; border-radius: 20px;
  ${({ $tone }) => {
    if ($tone === 'urgent') return `background: rgba(248,113,113,0.15); border: 1px solid rgba(248,113,113,0.4); color: ${C.red};`
    if ($tone === 'past') return `background: rgba(255,255,255,0.05); border: 1px solid ${C.border}; color: ${C.dim};`
    return `background: rgba(135,135,102,0.15); border: 1px solid rgba(135,135,102,0.3); color: ${C.sage};`
  }}
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

const MetaRow = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px 18px;
  margin-top: 10px;
`

const MetaItem = styled.div`
  display: flex; align-items: center; gap: 6px;
  font-family: 'Montserrat', sans-serif; font-size: 12px; color: ${C.cream2};
  svg { width: 12px; height: 12px; color: ${C.sage}; flex-shrink: 0; }
`

const MetaLink = styled.a`
  display: flex; align-items: center; gap: 6px;
  font-family: 'Montserrat', sans-serif; font-size: 12px; color: ${C.gold};
  text-decoration: none;
  svg { width: 12px; height: 12px; flex-shrink: 0; }
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

const Hint = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px; color: ${C.dim};
  font-weight: 400; letter-spacing: 0; text-transform: none;
  margin-left: 6px;
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

export default function AdminOpenCallsPage() {
  const [items, setItems]     = useState<OpenCallRow[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState<ModalState | null>(null)
  const [form, setForm]       = useState<OpenCallFormData>(EMPTY_FORM)
  const [saving, setSaving]   = useState(false)
  const [formError, setFormError] = useState('')
  const [search, setSearch]   = useState('')

  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('open_calls')
      .select('*')
      .gte('application_date', todayStr())
      .order('application_date')
    setItems((data as OpenCallRow[]) ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  function openAdd() {
    setForm({ ...EMPTY_FORM })
    setFormError('')
    setModal({ type: 'add' })
  }

  function openEdit(item: OpenCallRow) {
    setForm({
      name: item.name,
      website_url: item.website_url ?? '',
      application_period: item.application_period ?? '',
      application_date: item.application_date,
      form_url: item.form_url ?? '',
      prizes: item.prizes ?? '',
    })
    setFormError('')
    setModal({ type: 'edit', item })
  }

  function openDelete(item: OpenCallRow) {
    setModal({ type: 'delete', item })
  }

  function closeModal() {
    setModal(null)
    setFormError('')
    setSaving(false)
  }

  function setField(key: keyof OpenCallFormData, val: string) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleSave() {
    if (!modal || modal.type === 'delete') return
    if (!form.name.trim() || !form.application_date) {
      setFormError('Nome e data de aplicação são obrigatórios.')
      return
    }
    setSaving(true)
    setFormError('')

    const payload = {
      name: form.name.trim(),
      website_url: form.website_url.trim() || null,
      application_period: form.application_period.trim() || null,
      application_date: form.application_date,
      form_url: form.form_url.trim() || null,
      prizes: form.prizes.trim() || null,
    }

    let error: { message: string } | null = null
    if (modal.type === 'add') {
      ;({ error } = await supabase.from('open_calls').insert(payload))
    } else {
      ;({ error } = await supabase.from('open_calls').update(payload).eq('id', modal.item.id))
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
    await supabase.from('open_calls').delete().eq('id', modal.item.id)
    closeModal()
    load()
  }

  const isFormModal = modal?.type === 'add' || modal?.type === 'edit'
  const isDeleteModal = modal?.type === 'delete'

  const filteredItems = search.trim()
    ? items.filter(item => item.name.toLowerCase().includes(search.trim().toLowerCase()))
    : items

  const urgentItems = items.filter(item => {
    const d = daysUntil(item.application_date)
    return d >= 0 && d <= ALERT_WINDOW_DAYS
  })

  return (
    <AdminLayout title="Open Calls" subtitle="Editais e chamadas abertas para inscrição">
      {urgentItems.length > 0 && (
        <AlertBanner>
          <AlertTriangle />
          {urgentItems.length === 1
            ? <span><strong>{urgentItems[0].name}</strong> fecha em {daysUntil(urgentItems[0].application_date)} dia{daysUntil(urgentItems[0].application_date) !== 1 ? 's' : ''} — não perca o prazo!</span>
            : <span><strong>{urgentItems.length} open calls</strong> fecham nos próximos {ALERT_WINDOW_DAYS} dias — confira os prazos abaixo.</span>
          }
        </AlertBanner>
      )}

      <TopBar>
        <Count>{filteredItems.length} open call{filteredItems.length !== 1 ? 's' : ''}</Count>
        <AddBtn onClick={openAdd}><Plus /> Adicionar open call</AddBtn>
      </TopBar>

      <SearchBar>
        <Search />
        <SearchInput
          placeholder="Buscar por nome..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </SearchBar>

      {loading ? (
        <EmptyState>Carregando...</EmptyState>
      ) : items.length === 0 ? (
        <EmptyState>Nenhuma open call cadastrada ainda.</EmptyState>
      ) : filteredItems.length === 0 ? (
        <EmptyState>Nenhuma open call encontrada para &quot;{search}&quot;.</EmptyState>
      ) : (
        <List>
          {filteredItems.map(item => {
            const d = daysUntil(item.application_date)
            const tone: 'urgent' | 'past' | 'normal' = d < 0 ? 'past' : d <= ALERT_WINDOW_DAYS ? 'urgent' : 'normal'
            return (
              <Card key={item.id} $urgent={tone === 'urgent'}>
                <CardTop>
                  <NameRow>
                    <CallName>{item.name}</CallName>
                    <DateBadge $tone={tone}>
                      {tone === 'past' ? 'Encerrado' : tone === 'urgent' ? `Fecha em ${d} dia${d !== 1 ? 's' : ''}` : formatDate(item.application_date)}
                    </DateBadge>
                  </NameRow>
                  <CardActions>
                    <EditBtn onClick={() => openEdit(item)}><Pencil /> Editar</EditBtn>
                    <DeleteBtn onClick={() => openDelete(item)} title="Excluir"><Trash2 /></DeleteBtn>
                  </CardActions>
                </CardTop>

                <MetaRow>
                  {item.application_period && (
                    <MetaItem>{item.application_period}</MetaItem>
                  )}
                  <MetaItem>Data limite: {formatDate(item.application_date)}</MetaItem>
                  {item.website_url && (
                    <MetaLink href={item.website_url} target="_blank" rel="noreferrer"><ExternalLink /> Site</MetaLink>
                  )}
                  {item.form_url && (
                    <MetaLink href={item.form_url} target="_blank" rel="noreferrer"><FileText /> Formulário</MetaLink>
                  )}
                </MetaRow>

                {item.prizes && (
                  <NoteText><NoteLabel><Award size={10} style={{ marginRight: 4, verticalAlign: -1 }} />Premiação</NoteLabel>{item.prizes}</NoteText>
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
              <ModalTitle>{modal.type === 'add' ? 'Nova Open Call' : 'Editar Open Call'}</ModalTitle>
              <CloseBtn onClick={closeModal}><X /></CloseBtn>
            </ModalHeader>

            <ModalBody>
              <Field>
                <Label>Nome da open call *</Label>
                <Input
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder="Nome do edital / chamada"
                />
              </Field>

              <FieldRow>
                <Field>
                  <Label>Link do site</Label>
                  <Input
                    value={form.website_url}
                    onChange={e => setField('website_url', e.target.value)}
                    placeholder="https://..."
                    type="url"
                  />
                </Field>
                <Field>
                  <Label>Link do formulário <Hint>opcional</Hint></Label>
                  <Input
                    value={form.form_url}
                    onChange={e => setField('form_url', e.target.value)}
                    placeholder="https://..."
                    type="url"
                  />
                </Field>
              </FieldRow>

              <FieldRow>
                <Field>
                  <Label>Época para aplicação <Hint>opcional</Hint></Label>
                  <Input
                    value={form.application_period}
                    onChange={e => setField('application_period', e.target.value)}
                    placeholder="Ex: Inscrições de Jan a Mar"
                  />
                </Field>
                <Field>
                  <Label>Data de aplicação *</Label>
                  <Input
                    type="date"
                    value={form.application_date}
                    onChange={e => setField('application_date', e.target.value)}
                  />
                </Field>
              </FieldRow>

              <Field>
                <Label>Premiações</Label>
                <Textarea
                  value={form.prizes}
                  onChange={e => setField('prizes', e.target.value)}
                  placeholder="Dinheiro, gravação de EP/álbum, showcase..."
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
              <ConfirmTitle>Excluir open call?</ConfirmTitle>
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
