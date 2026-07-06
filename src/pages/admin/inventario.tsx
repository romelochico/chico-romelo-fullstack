import { useState, useEffect, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { Plus, Pencil, Trash2, PackageOpen, ChevronDown, ChevronUp } from 'lucide-react'
import AdminLayout from '../../components/Admin/AdminLayout'
import { createClient } from '../../lib/supabase/client'
import { CATEGORIES } from '../../lib/inventory-categories'
import type { CategoryDef } from '../../lib/inventory-categories'

// ─── Types ───────────────────────────────────────────────────────────────────

type Condition = 'good' | 'fair' | 'needs_repair' | 'broken'

interface InventoryItem {
  id: string
  category: string
  subcategory: string | null
  name: string
  quantity: number
  condition: Condition
  notes: string | null
  created_at: string
}

type ItemModal =
  | { type: 'add' }
  | { type: 'edit'; item: InventoryItem }
  | { type: 'delete'; item: InventoryItem }

// ─── Constants ───────────────────────────────────────────────────────────────

const C = {
  gold:   '#c8a96e',
  sage:   '#878766',
  cream:  '#f5f0e8',
  cream2: 'rgba(245,240,232,0.6)',
  dim:    'rgba(245,240,232,0.3)',
  dimmer: 'rgba(245,240,232,0.12)',
  border: 'rgba(255,255,255,0.07)',
  card:   'rgba(255,255,255,0.03)',
  red:    '#f87171',
  green:  '#4ade80',
  yellow: '#facc15',
  orange: '#fb923c',
}


const CONDITIONS: { key: Condition; label: string; color: string }[] = [
  { key: 'good',         label: 'Bom',              color: C.green  },
  { key: 'fair',         label: 'Regular',           color: C.yellow },
  { key: 'needs_repair', label: 'Precisa manutenção', color: C.orange },
  { key: 'broken',       label: 'Danificado',        color: C.red    },
]

function getCategoryDef(key: string): CategoryDef {
  return CATEGORIES.find(c => c.key === key) ?? { key, label: key, Icon: PackageOpen as CategoryDef['Icon'] }
}

function getCondition(key: string) {
  return CONDITIONS.find(c => c.key === key) ?? CONDITIONS[0]
}

// ─── Styled components ────────────────────────────────────────────────────────

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
  margin-bottom: 32px;
`

const SummaryCard = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 14px 16px;
  background: ${({ $active }) => $active ? 'rgba(200,169,110,0.1)' : C.card};
  border: 1px solid ${({ $active }) => $active ? C.gold : C.border};
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  &:hover { border-color: ${C.gold}; }
  svg { color: ${({ $active }) => $active ? C.gold : C.sage}; width: 16px; height: 16px; }
`

const SummaryLabel = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${C.dim};
`

const SummaryCount = styled.span`
  font-family: 'Special Elite', serif;
  font-size: 22px;
  color: ${C.cream};
  line-height: 1;
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
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

const FilterInfo = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: ${C.dim};
  button {
    background: none;
    border: none;
    color: ${C.sage};
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
    margin-left: 8px;
    text-decoration: underline;
    &:hover { color: ${C.cream}; }
  }
`

const GroupBlock = styled.div`
  margin-bottom: 8px;
  border: 1px solid ${C.border};
  border-radius: 10px;
  overflow: hidden;
`

const GroupHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: rgba(255,255,255,0.02);
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
  &:hover { background: rgba(255,255,255,0.04); }
  svg { color: ${C.sage}; flex-shrink: 0; }
`

const GroupTitle = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${C.cream};
  flex: 1;
`

const GroupTotal = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: ${C.sage};
  margin-right: 8px;
`

const ItemList = styled.div`
  border-top: 1px solid ${C.border};
`

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid ${C.border};
  transition: background 0.1s;
  &:last-child { border-bottom: none; }
  &:hover { background: rgba(255,255,255,0.02); }
`

const ItemBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const ItemTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const QtyBadge = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #0d0d0d;
  background: ${C.sage};
  border-radius: 4px;
  padding: 2px 7px;
  flex-shrink: 0;
  min-width: 28px;
  text-align: center;
`

const ItemName = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${C.cream};
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`

const SubBadge = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: ${C.dim};
  background: rgba(255,255,255,0.05);
  border: 1px solid ${C.border};
  border-radius: 4px;
  padding: 2px 7px;
  flex-shrink: 0;
`

const CondBadge = styled.span<{ $color: string }>`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => $color}18;
  border: 1px solid ${({ $color }) => $color}40;
  border-radius: 4px;
  padding: 2px 7px;
  flex-shrink: 0;
`

const ItemNotes = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: ${C.dim};
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`

const RowActions = styled.div`
  display: flex;
  gap: 2px;
  flex-shrink: 0;
`

const IconBtn = styled.button<{ $red?: boolean }>`
  width: 28px; height: 28px;
  border: none; border-radius: 6px;
  background: transparent;
  color: ${({ $red }) => $red ? C.red : C.dim};
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, color 0.15s;
  svg { width: 13px; height: 13px; }
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
`

// ─── Modal styled ─────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 100;
  display: flex; align-items: center; justify-content: center;
  padding: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0;
    align-items: stretch;
  }
`

const Modal = styled.div`
  background: #141414;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 32px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-width: 100%;
    max-height: 100%;
    height: 100%;
    border-radius: 0;
    border: none;
    padding: 24px 20px;
  }
`

const ModalTitle = styled.h2`
  font-family: 'Special Elite', serif;
  font-size: 20px;
  color: ${C.cream};
  margin: 0 0 24px;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`

const Field = styled.div<{ $full?: boolean }>`
  display: flex; flex-direction: column; gap: 6px;
  margin-bottom: 16px;
  ${({ $full }) => $full && 'grid-column: 1 / -1;'}
`

const Label = styled.label`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
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

const Textarea = styled.textarea`
  padding: 10px 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: ${C.cream};
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  outline: none;
  resize: vertical;
  min-height: 72px;
  transition: border-color 0.2s;
  &:focus { border-color: ${C.gold}; }
`

const ModalActions = styled.div`
  display: flex; gap: 10px; justify-content: flex-end;
  margin-top: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: sticky;
    bottom: 0;
    background: #141414;
    padding: 16px 0 8px;
    margin-top: auto;
  }
`

const CancelBtn = styled.button`
  padding: 10px 20px;
  background: transparent;
  border: 1px solid ${C.border};
  border-radius: 6px;
  color: ${C.dim};
  font-family: 'Montserrat', sans-serif;
  font-size: 12px; font-weight: 700; letter-spacing: 0.06em;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  &:hover { border-color: ${C.dim}; color: ${C.cream}; }
`

const ConfirmBtn = styled.button<{ $red?: boolean }>`
  padding: 10px 20px;
  background: ${({ $red }) => $red ? C.red : C.gold};
  border: none; border-radius: 6px;
  color: #0d0d0d;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px; font-weight: 700; letter-spacing: 0.06em;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const DeleteText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px; color: ${C.cream2}; line-height: 1.6; margin: 0;
`

// ─── Empty form ───────────────────────────────────────────────────────────────

const emptyForm = {
  category: 'cables',
  subcategory: '',
  name: '',
  quantity: 1,
  condition: 'good' as Condition,
  notes: '',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InventarioPage() {
  const [items, setItems]         = useState<InventoryItem[]>([])
  const [modal, setModal]         = useState<ItemModal | null>(null)
  const [form, setForm]           = useState({ ...emptyForm })
  const [saving, setSaving]       = useState(false)
  const [filterCat, setFilterCat] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const supabase = createClient()

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('inventory')
      .select('*')
      .order('category')
      .order('name')
    setItems((data as InventoryItem[]) ?? [])
  }, [supabase])

  useEffect(() => { load() }, [load])

  async function authHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    }
  }

  function openAdd() {
    setForm({ ...emptyForm, category: filterCat ?? 'cables' })
    setModal({ type: 'add' })
  }

  function openEdit(item: InventoryItem) {
    setForm({
      category:    item.category,
      subcategory: item.subcategory ?? '',
      name:        item.name,
      quantity:    item.quantity,
      condition:   item.condition,
      notes:       item.notes ?? '',
    })
    setModal({ type: 'edit', item })
  }

  async function save() {
    setSaving(true)
    const payload = {
      ...form,
      subcategory: form.subcategory || null,
      notes: form.notes || null,
    }
    if (modal?.type === 'add') {
      await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify(payload),
      })
    } else if (modal?.type === 'edit') {
      await fetch(`/api/admin/inventory/${modal.item.id}`, {
        method: 'PUT',
        headers: await authHeaders(),
        body: JSON.stringify(payload),
      })
    }
    await load()
    setModal(null)
    setSaving(false)
  }

  async function deleteItem(item: InventoryItem) {
    await fetch(`/api/admin/inventory/${item.id}`, {
      method: 'DELETE',
      headers: await authHeaders(),
    })
    await load()
    setModal(null)
  }

  function toggleCollapse(key: string) {
    setCollapsed(c => ({ ...c, [key]: !c[key] }))
  }

  // ── Derived data ──────────────────────────────────────────────────────────

  const displayed = filterCat ? items.filter(i => i.category === filterCat) : items

  // group by category, preserving CATEGORIES order
  const groups = CATEGORIES
    .map(cat => ({
      cat,
      items: displayed.filter(i => i.category === cat.key),
    }))
    .filter(g => g.items.length > 0)

  // summary totals per category (from ALL items, ignoring filter)
  const summaryTotals = CATEGORIES.map(cat => ({
    cat,
    total: items.filter(i => i.category === cat.key).reduce((s, i) => s + i.quantity, 0),
  })).filter(s => s.total > 0)

  const selectedCatDef = form.category ? getCategoryDef(form.category) : null
  const hasSubs = (selectedCatDef?.subcategories?.length ?? 0) > 0

  return (
    <AdminLayout title="Inventário" subtitle="Equipamentos da banda">

      {/* ── Summary cards ── */}
      {summaryTotals.length > 0 && (
        <SummaryGrid>
          {summaryTotals.map(({ cat, total }) => (
            <SummaryCard
              key={cat.key}
              $active={filterCat === cat.key}
              onClick={() => setFilterCat(filterCat === cat.key ? null : cat.key)}
            >
              <cat.Icon />
              <SummaryCount>{total}</SummaryCount>
              <SummaryLabel>{cat.label}</SummaryLabel>
            </SummaryCard>
          ))}
        </SummaryGrid>
      )}

      {/* ── Top bar ── */}
      <TopBar>
        <FilterInfo>
          {filterCat
            ? <>A mostrar: <strong style={{ color: C.cream }}>{getCategoryDef(filterCat).label}</strong><button onClick={() => setFilterCat(null)}>Ver tudo</button></>
            : <>{items.length} item{items.length !== 1 ? 's' : ''} no inventário</>
          }
        </FilterInfo>
        <AddBtn onClick={openAdd}><Plus /> Adicionar</AddBtn>
      </TopBar>

      {/* ── Grouped list ── */}
      {displayed.length === 0 ? (
        <EmptyState>
          {items.length === 0
            ? 'Inventário vazio — adiciona o primeiro item'
            : 'Nenhum item nesta categoria'}
        </EmptyState>
      ) : (
        groups.map(({ cat, items: groupItems }) => {
          const isCollapsed = collapsed[cat.key]
          const groupTotal = groupItems.reduce((s, i) => s + i.quantity, 0)
          return (
            <GroupBlock key={cat.key}>
              <GroupHeader onClick={() => toggleCollapse(cat.key)}>
                <cat.Icon size={15} />
                <GroupTitle>{cat.label}</GroupTitle>
                <GroupTotal>{groupTotal} unid.</GroupTotal>
                {isCollapsed ? <ChevronDown size={14} color={C.dim} /> : <ChevronUp size={14} color={C.dim} />}
              </GroupHeader>

              {!isCollapsed && (
                <ItemList>
                  {groupItems.map(item => {
                    const cond = getCondition(item.condition)
                    return (
                      <ItemRow key={item.id}>
                        <QtyBadge>{item.quantity}×</QtyBadge>
                        <ItemBody>
                          <ItemTopRow>
                            <ItemName>{item.name}</ItemName>
                          </ItemTopRow>
                          <ItemMeta>
                            {item.subcategory && <SubBadge>{item.subcategory}</SubBadge>}
                            <CondBadge $color={cond.color}>{cond.label}</CondBadge>
                            {item.notes && <ItemNotes title={item.notes}>{item.notes}</ItemNotes>}
                          </ItemMeta>
                        </ItemBody>
                        <RowActions>
                          <IconBtn onClick={() => openEdit(item)} title="Editar"><Pencil /></IconBtn>
                          <IconBtn $red onClick={() => setModal({ type: 'delete', item })} title="Apagar"><Trash2 /></IconBtn>
                        </RowActions>
                      </ItemRow>
                    )
                  })}
                </ItemList>
              )}
            </GroupBlock>
          )
        })
      )}

      {/* ── Add / Edit modal ── */}
      {modal && modal.type !== 'delete' && (
        <Overlay onClick={() => setModal(null)}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalTitle>{modal.type === 'add' ? 'Adicionar item' : 'Editar item'}</ModalTitle>
            <FormGrid>
              <Field $full>
                <Label>Nome / Descrição</Label>
                <Input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Cabo XLR 10m"
                />
              </Field>

              <Field>
                <Label>Categoria</Label>
                <Select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value, subcategory: '' }))}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </Select>
              </Field>

              <Field>
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={e => setForm(f => ({ ...f, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                />
              </Field>

              {hasSubs && (
                <Field>
                  <Label>Tipo</Label>
                  <Select
                    value={form.subcategory}
                    onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))}
                  >
                    <option value="">— Sem tipo —</option>
                    {selectedCatDef?.subcategories?.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                </Field>
              )}

              <Field $full={!hasSubs}>
                <Label>Estado</Label>
                <Select
                  value={form.condition}
                  onChange={e => setForm(f => ({ ...f, condition: e.target.value as Condition }))}
                >
                  {CONDITIONS.map(c => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </Select>
              </Field>

              <Field $full>
                <Label>Notas (opcional)</Label>
                <Textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Ex: falta um conector..."
                />
              </Field>
            </FormGrid>

            <ModalActions>
              <CancelBtn onClick={() => setModal(null)}>Cancelar</CancelBtn>
              <ConfirmBtn onClick={save} disabled={saving || !form.name.trim()}>
                {saving ? 'A guardar...' : 'Guardar'}
              </ConfirmBtn>
            </ModalActions>
          </Modal>
        </Overlay>
      )}

      {/* ── Delete modal ── */}
      {modal?.type === 'delete' && (
        <Overlay onClick={() => setModal(null)}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalTitle>Apagar item</ModalTitle>
            <DeleteText>
              Tens a certeza que queres apagar <strong style={{ color: C.cream }}>{modal.item.name}</strong>? Esta ação não pode ser desfeita.
            </DeleteText>
            <ModalActions>
              <CancelBtn onClick={() => setModal(null)}>Cancelar</CancelBtn>
              <ConfirmBtn $red onClick={() => deleteItem(modal.item)}>Apagar</ConfirmBtn>
            </ModalActions>
          </Modal>
        </Overlay>
      )}

    </AdminLayout>
  )
}
