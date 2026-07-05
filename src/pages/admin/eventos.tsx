import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Plus, Pencil, X, AlertTriangle, Backpack } from 'lucide-react'
import AdminLayout from '../../components/Admin/AdminLayout'
import { createClient } from '../../lib/supabase/client'
import { splitEvents, toShowCardProps } from '../../lib/events'
import type { EventRow } from '../../types'

// ─── Types ───────────────────────────────────────────────────────────────────

interface EventFormData {
  title: string
  date: string
  time: string
  venue: string
  city: string
  tags: string
  link_url: string
  link_label: string
  badge: string
  show_day: boolean
}

type ModalState =
  | { type: 'add' }
  | { type: 'edit'; item: EventRow }
  | { type: 'delete'; item: EventRow }

// ─── List ──────────────────────────────────────────────────────────────────

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

const Count = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: rgba(245,240,232,0.35);
`

const AddBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #c8a96e;
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
  &:hover { opacity: 0.85; }
  svg { width: 15px; height: 15px; }
`

const SectionTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.3);
  margin: 28px 0 10px;

  &:first-of-type { margin-top: 0; }
`

const UpcomingDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
  margin-right: 8px;
  vertical-align: middle;
`

const PastDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(245,240,232,0.2);
  margin-right: 8px;
  vertical-align: middle;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Card = styled.div<{ $past?: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px;
  transition: border-color 0.15s;
  opacity: ${p => p.$past ? 0.6 : 1};
  &:hover { border-color: rgba(255,255,255,0.13); opacity: 1; }
`

const DateBadge = styled.div<{ $past?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${p => p.$past ? '#444' : '#3d3d2e'};
  border-radius: 4px;
  padding: 8px 10px;
  min-width: 52px;
  text-align: center;
  flex-shrink: 0;
`

const DateDay = styled.span`
  font-family: 'Special Elite', serif;
  font-size: 22px;
  color: #f5f0e8;
  line-height: 1;
`

const DateMon = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(245,240,232,0.6);
  margin-top: 2px;
`

const DateYear = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  color: rgba(245,240,232,0.35);
`

const CardInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const EventName = styled.div`
  font-family: 'Special Elite', serif;
  font-size: 15px;
  color: #f5f0e8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const EventVenue = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: rgba(245,240,232,0.4);
  margin-top: 2px;
`

const TagList = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 6px;
`

const Tag = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(200,169,110,0.12);
  color: #c8a96e;
  border: 1px solid rgba(200,169,110,0.2);
`

const CardMeta = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  color: rgba(245,240,232,0.25);
  white-space: nowrap;
`

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`

const EditBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 5px;
  color: rgba(245,240,232,0.7);
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: rgba(255,255,255,0.1); color: #f5f0e8; }
  svg { width: 11px; height: 11px; }
`

const DeleteBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 5px;
  color: rgba(245,240,232,0.3);
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.3); color: #f87171; }
  svg { width: 12px; height: 12px; }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 32px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: rgba(245,240,232,0.2);
`

// ─── Modal ─────────────────────────────────────────────────────────────────

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

const ModalBox = styled.div`
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  background: #1a1a1a;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  position: sticky;
  top: 0;
  background: #1a1a1a;
  z-index: 1;
`

const ModalTitle = styled.h2`
  font-family: 'Special Elite', serif;
  font-size: 18px;
  color: #f5f0e8;
  font-weight: 400;
`

const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  border: none;
  border-radius: 6px;
  color: rgba(245,240,232,0.5);
  cursor: pointer;
  &:hover { background: rgba(255,255,255,0.1); color: #f5f0e8; }
  svg { width: 16px; height: 16px; }
`

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  position: sticky;
  bottom: 0;
  background: #1a1a1a;
`

// ─── Form ──────────────────────────────────────────────────────────────────

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FieldRow = styled.div<{ $cols?: string }>`
  display: grid;
  grid-template-columns: ${p => p.$cols ?? '1fr 1fr'};
  gap: 12px;
`

const Label = styled.label`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.45);
`

const Hint = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  color: rgba(245,240,232,0.2);
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
  margin-left: 6px;
`

const Input = styled.input`
  padding: 10px 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: #f5f0e8;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  &:focus { border-color: #c8a96e; }
  &::placeholder { color: rgba(245,240,232,0.2); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: rgba(245,240,232,0.6);

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #c8a96e;
  }
`

const FormError = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: #f87171;
`

// ─── Buttons ───────────────────────────────────────────────────────────────

const BtnPrimary = styled.button`
  padding: 10px 20px;
  background: #c8a96e;
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
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
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

const BtnDanger = styled(BtnPrimary)`
  background: #f87171;
  color: #fff;
`

// ─── Delete confirm ─────────────────────────────────────────────────────────

const ConfirmBox = styled(ModalBox)`max-width: 400px;`

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

// ─── Helpers ───────────────────────────────────────────────────────────────

const EMPTY_FORM: EventFormData = {
  title: '',
  date: '',
  time: '',
  venue: '',
  city: '',
  tags: '',
  link_url: '',
  link_label: 'Ver mais →',
  badge: '',
  show_day: true,
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AdminEventosPage() {
  const router = useRouter()
  const [items, setItems] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalState | null>(null)
  const [form, setForm] = useState<EventFormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [user, setUser] = useState<{ email?: string } | null>(null)

  useEffect(() => {
    load()
    createClient().auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  async function load() {
    setLoading(true)
    const { data } = await createClient()
      .from('events')
      .select('*')
      .order('date', { ascending: false })
    setItems((data ?? []) as unknown as EventRow[])
    setLoading(false)
  }

  function openAdd() {
    setForm({ ...EMPTY_FORM, date: todayStr() })
    setFormError('')
    setModal({ type: 'add' })
  }

  function openEdit(item: EventRow) {
    setForm({
      title: item.title,
      date: item.date,
      time: item.time ?? '',
      venue: item.venue,
      city: item.city,
      tags: (item.tags ?? []).join(', '),
      link_url: item.link_url ?? '',
      link_label: item.link_label ?? 'Ver mais →',
      badge: item.badge ?? '',
      show_day: item.show_day !== false,
    })
    setFormError('')
    setModal({ type: 'edit', item })
  }

  function openDelete(item: EventRow) {
    setModal({ type: 'delete', item })
  }

  function closeModal() {
    setModal(null)
    setFormError('')
    setSaving(false)
  }

  function setField(key: keyof EventFormData, val: string | boolean) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleSave() {
    if (!modal || modal.type === 'delete') return
    if (!form.title.trim() || !form.date || !form.venue.trim() || !form.city.trim()) {
      setFormError('Título, data, local e cidade são obrigatórios.')
      return
    }
    setSaving(true)
    setFormError('')

    const tags = form.tags
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean)

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      date: form.date,
      time: form.time.trim() || null,
      venue: form.venue.trim(),
      city: form.city.trim(),
      tags,
      link_url: form.link_url.trim() || null,
      link_label: form.link_url.trim() ? (form.link_label.trim() || 'Ver mais →') : null,
      badge: form.badge.trim() || null,
      show_day: form.show_day,
    }

    const client = createClient()
    let error: { message: string } | null = null

    if (modal.type === 'add') {
      payload['created_by'] = user?.email ?? null
      ;({ error } = await client.from('events').insert(payload))
    } else {
      ;({ error } = await client.from('events').update(payload).eq('id', modal.item.id))
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
    await createClient().from('events').delete().eq('id', modal.item.id)
    closeModal()
    load()
  }

  const { upcoming, past } = splitEvents(items)
  const isFormModal = modal?.type === 'add' || modal?.type === 'edit'
  const isDeleteModal = modal?.type === 'delete'

  function EventCard({ item }: { item: EventRow }) {
    const p = toShowCardProps(item)
    return (
      <Card $past={p.past}>
        <DateBadge $past={p.past}>
          {p.day && <DateDay>{p.day}</DateDay>}
          <DateMon>{p.month}</DateMon>
          <DateYear>{p.year}</DateYear>
        </DateBadge>
        <CardInfo>
          <EventName>{item.title}</EventName>
          <EventVenue>{item.venue} · {item.city}{item.time ? ` · ${item.time}` : ''}</EventVenue>
          {(item.tags ?? []).length > 0 && (
            <TagList>{item.tags?.map((t: string) => <Tag key={t}>{t}</Tag>)}</TagList>
          )}
        </CardInfo>
        <CardMeta>
          {(item as EventRow & { created_by?: string }).created_by
            ? `por ${(item as EventRow & { created_by?: string }).created_by!.split('@')[0]}`
            : ''}
        </CardMeta>
        <CardActions>
          <EditBtn onClick={() => router.push(`/admin/eventos/${item.id}`)} title="Ver gear do show" style={{ background: 'rgba(200,169,110,0.08)', borderColor: 'rgba(200,169,110,0.2)', color: '#c8a96e' }}><Backpack /> Gear</EditBtn>
          <EditBtn onClick={() => openEdit(item)}><Pencil /> Editar</EditBtn>
          <DeleteBtn onClick={() => openDelete(item)} title="Excluir"><X /></DeleteBtn>
        </CardActions>
      </Card>
    )
  }

  return (
    <AdminLayout title="Eventos" subtitle="Gestão de shows e concertos">
      <TopBar>
        <Count>{items.length} evento{items.length !== 1 ? 's' : ''}</Count>
        <AddBtn onClick={openAdd}><Plus /> Adicionar Evento</AddBtn>
      </TopBar>

      {loading ? (
        <EmptyState>Carregando...</EmptyState>
      ) : (
        <>
          <SectionTitle><UpcomingDot />Próximos ({upcoming.length})</SectionTitle>
          <List>
            {upcoming.length > 0
              ? upcoming.map(e => <EventCard key={e.id} item={e} />)
              : <EmptyState>Nenhum evento próximo.</EmptyState>
            }
          </List>

          <SectionTitle><PastDot />Histórico ({past.length})</SectionTitle>
          <List>
            {past.map(e => <EventCard key={e.id} item={e} />)}
          </List>
        </>
      )}

      {/* ── Add / Edit modal ── */}
      {isFormModal && modal && (
        <Overlay onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <ModalBox>
            <ModalHeader>
              <ModalTitle>{modal.type === 'add' ? 'Novo Evento' : 'Editar Evento'}</ModalTitle>
              <CloseBtn onClick={closeModal}><X /></CloseBtn>
            </ModalHeader>

            <ModalBody>
              <Field>
                <Label>Título *</Label>
                <Input
                  value={form.title}
                  onChange={e => setField('title', e.target.value)}
                  placeholder="Final — Concurso Novos Valores"
                />
              </Field>

              <FieldRow $cols="1fr 1fr">
                <Field>
                  <Label>Data *</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={e => setField('date', e.target.value)}
                  />
                </Field>
                <Field>
                  <Label>Hora <Hint>opcional</Hint></Label>
                  <Input
                    type="time"
                    value={form.time}
                    onChange={e => setField('time', e.target.value)}
                    placeholder="21:00"
                  />
                </Field>
              </FieldRow>

              <ToggleRow>
                <input
                  type="checkbox"
                  checked={form.show_day}
                  onChange={e => setField('show_day', e.target.checked)}
                />
                Mostrar dia exato (desativa para mostrar só mês e ano)
              </ToggleRow>

              <FieldRow>
                <Field>
                  <Label>Local *</Label>
                  <Input
                    value={form.venue}
                    onChange={e => setField('venue', e.target.value)}
                    placeholder="Parque da Paz"
                  />
                </Field>
                <Field>
                  <Label>Cidade *</Label>
                  <Input
                    value={form.city}
                    onChange={e => setField('city', e.target.value)}
                    placeholder="Almada"
                  />
                </Field>
              </FieldRow>

              <FieldRow>
                <Field>
                  <Label>Tags <Hint>separadas por vírgula</Hint></Label>
                  <Input
                    value={form.tags}
                    onChange={e => setField('tags', e.target.value)}
                    placeholder="Festival, Almada"
                  />
                </Field>
                <Field>
                  <Label>Badge <Hint>opcional</Hint></Label>
                  <Input
                    value={form.badge}
                    onChange={e => setField('badge', e.target.value)}
                    placeholder="Grátis"
                  />
                </Field>
              </FieldRow>

              <FieldRow>
                <Field>
                  <Label>Link <Hint>opcional</Hint></Label>
                  <Input
                    value={form.link_url}
                    onChange={e => setField('link_url', e.target.value)}
                    placeholder="https://..."
                    type="url"
                  />
                </Field>
                <Field>
                  <Label>Texto do link</Label>
                  <Input
                    value={form.link_label}
                    onChange={e => setField('link_label', e.target.value)}
                    placeholder="Ver mais →"
                    disabled={!form.link_url}
                  />
                </Field>
              </FieldRow>

              {formError && <FormError>{formError}</FormError>}
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
              <ConfirmTitle>Excluir evento?</ConfirmTitle>
              <ConfirmText>
                Tem certeza que quer excluir <strong>&quot;{modal.item.title}&quot;</strong>?
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
