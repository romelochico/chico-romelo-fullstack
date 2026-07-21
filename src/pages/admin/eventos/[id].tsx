import { useState, useEffect, useCallback, type FormEvent } from 'react'
import { useRouter } from 'next/router'
import styled, { keyframes } from 'styled-components'
import { ArrowLeft, Plus, Minus, Check, Trash2, PackageCheck, PackageOpen, Search, X, ChevronDown, ChevronUp, Users } from 'lucide-react'
import AdminLayout from '../../../components/Admin/AdminLayout'
import { createClient } from '../../../lib/supabase/client'
import { CATEGORIES } from '../../../lib/inventory-categories'

// ─── Types ────────────────────────────────────────────────────────────────────

interface EventRow {
  id: string
  title: string
  date: string
  time: string | null
  venue: string
  city: string
  tags: string[] | null
  badge: string | null
}

interface InventoryItem {
  id: string
  category: string
  subcategory: string | null
  name: string
  quantity: number
  condition: string
  notes: string | null
}

interface ShowGearRow {
  id: string
  event_id: string
  inventory_id: string
  quantity_taken: number
  quantity_returned: number
  created_at: string
  inventory: InventoryItem
}

interface StaffRow {
  id: string
  event_id: string
  name: string
  role: string | null
  created_at: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const C = {
  gold:   '#c8a96e',
  sage:   '#878766',
  cream:  '#f5f0e8',
  cream2: 'rgba(245,240,232,0.6)',
  dim:    'rgba(245,240,232,0.3)',
  border: 'rgba(255,255,255,0.07)',
  card:   'rgba(255,255,255,0.03)',
  red:    '#f87171',
  green:  '#4ade80',
}

const CONDITION_LABELS: Record<string, string> = {
  good: 'Bom', fair: 'Regular', needs_repair: 'Manutenção', broken: 'Danificado',
}
const CONDITION_COLORS: Record<string, string> = {
  good: '#4ade80', fair: '#facc15', needs_repair: '#fb923c', broken: '#f87171',
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`
}

// ─── Styled components ────────────────────────────────────────────────────────

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

const TagChip = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(135,135,102,0.15);
  border: 1px solid rgba(135,135,102,0.3);
  color: ${C.sage}; border-radius: 20px; padding: 2px 10px;
`

const SectionTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: ${C.sage};
  display: flex; align-items: center; gap: 10px;
  margin: 0 0 16px;
  svg { width: 16px; height: 16px; }
  &::after { content: ''; flex: 1; height: 1px; background: ${C.border}; }
`

const SectionRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
`

const AddGearBtn = styled.button`
  display: flex; align-items: center; gap: 8px;
  padding: 9px 16px;
  background: ${C.gold}; color: #0d0d0d;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  border: none; border-radius: 6px; cursor: pointer;
  transition: opacity 0.15s;
  svg { width: 13px; height: 13px; }
  &:hover { opacity: 0.85; }
`

const GearList = styled.div`
  display: flex; flex-direction: column; gap: 6px; margin-bottom: 40px;
`

const GearRow = styled.div<{ $returned?: boolean }>`
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px;
  background: ${({ $returned }) => $returned ? 'rgba(74,222,128,0.04)' : 'rgba(255,255,255,0.03)'};
  border: 1px solid ${({ $returned }) => $returned ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.07)'};
  border-radius: 8px;
  transition: all 0.2s;
`

const QtyBadge = styled.span<{ $muted?: boolean }>`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px; font-weight: 700;
  background: ${({ $muted }) => $muted ? 'rgba(135,135,102,0.2)' : C.sage};
  color: ${({ $muted }) => $muted ? C.sage : '#0d0d0d'};
  border-radius: 4px; padding: 2px 8px; flex-shrink: 0;
`

const GearName = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px; color: ${C.cream}; flex: 1;
`

const SubBadge = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px; font-weight: 600; color: ${C.dim};
  background: rgba(255,255,255,0.05); border: 1px solid ${C.border};
  border-radius: 4px; padding: 2px 7px; flex-shrink: 0;
`

const CondBadge = styled.span<{ $color: string }>`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px; font-weight: 700;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => $color}18;
  border: 1px solid ${({ $color }) => $color}40;
  border-radius: 4px; padding: 2px 7px; flex-shrink: 0;
`

const ReturnProgress = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px; font-weight: 700; color: ${C.green};
  flex-shrink: 0;
`

const ReturnBtn = styled.button<{ $done?: boolean }>`
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px;
  background: ${({ $done }) => $done ? 'rgba(74,222,128,0.12)' : 'rgba(200,169,110,0.1)'};
  border: 1px solid ${({ $done }) => $done ? 'rgba(74,222,128,0.3)' : 'rgba(200,169,110,0.3)'};
  color: ${({ $done }) => $done ? C.green : C.gold};
  font-family: 'Montserrat', sans-serif;
  font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  border-radius: 6px; cursor: ${({ $done }) => $done ? 'default' : 'pointer'};
  transition: all 0.15s; flex-shrink: 0;
  svg { width: 12px; height: 12px; }
  &:hover:not(:disabled) { opacity: 0.85; }
`

const RemoveBtn = styled.button`
  width: 28px; height: 28px;
  border: none; border-radius: 6px; background: transparent;
  color: ${C.dim}; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, color 0.15s;
  svg { width: 13px; height: 13px; }
  &:hover { background: rgba(248,113,113,0.1); color: ${C.red}; }
`

const EmptyState = styled.div`
  text-align: center; padding: 32px 24px;
  color: ${C.dim}; font-family: 'Montserrat', sans-serif; font-size: 13px;
  border: 1px dashed ${C.border}; border-radius: 8px;
`

// ─── Inventory modal styled ────────────────────────────────────────────────────

const ModalOverlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 200;
  display: flex; flex-direction: column;
`

const ModalHeader = styled.div`
  display: flex; align-items: center; gap: 16px;
  padding: 20px 28px;
  border-bottom: 1px solid ${C.border};
  background: #0d0d0d;
  flex-shrink: 0;
`

const ModalHeading = styled.h2`
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
  padding: 12px 28px 0;
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
  &:hover { opacity: 0.85; }
`

const SearchBar = styled.div`
  padding: 16px 28px;
  border-bottom: 1px solid ${C.border};
  background: #0d0d0d;
  flex-shrink: 0;
  position: relative;
  svg { position: absolute; left: 42px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: ${C.dim}; }
`

const SearchInput = styled.input`
  width: 100%; padding: 10px 14px 10px 40px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: ${C.cream}; font-family: 'Montserrat', sans-serif; font-size: 13px;
  outline: none;
  &:focus { border-color: ${C.gold}; }
`

const ModalBody = styled.div`
  flex: 1; overflow-y: auto; padding: 20px 28px;
`

const InvGroupHeader = styled.button`
  width: 100%; display: flex; align-items: center; gap: 10px;
  padding: 12px 0; background: none; border: none;
  border-bottom: 1px solid ${C.border};
  cursor: pointer; margin-bottom: 2px;
  svg { color: ${C.sage}; flex-shrink: 0; }
`

const InvGroupTitle = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  color: ${C.sage}; flex: 1; text-align: left;
`

const InvItem = styled.div<{ $added?: boolean }>`
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 8px;
  background: ${({ $added }) => $added ? 'rgba(200,169,110,0.06)' : 'transparent'};
  border: 1px solid ${({ $added }) => $added ? 'rgba(200,169,110,0.2)' : 'transparent'};
  margin-bottom: 4px;
  transition: background 0.1s;
  &:hover { background: rgba(255,255,255,0.03); }
`

const InvName = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px; color: ${C.cream}; flex: 1;
`

const QtyControl = styled.div`
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
`

const QtyBtn = styled.button`
  width: 26px; height: 26px;
  border: 1px solid ${C.border}; border-radius: 4px;
  background: rgba(255,255,255,0.04); color: ${C.cream};
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.1s;
  svg { width: 12px; height: 12px; }
  &:hover { background: rgba(255,255,255,0.08); }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`

const QtyNum = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px; font-weight: 700; color: ${C.cream};
  min-width: 20px; text-align: center;
`

const AddItemBtn = styled.button<{ $added?: boolean }>`
  padding: 6px 14px;
  background: ${({ $added }) => $added ? 'rgba(74,222,128,0.1)' : C.gold};
  border: 1px solid ${({ $added }) => $added ? 'rgba(74,222,128,0.3)' : 'transparent'};
  color: ${({ $added }) => $added ? C.green : '#0d0d0d'};
  font-family: 'Montserrat', sans-serif;
  font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  border-radius: 6px; cursor: pointer; flex-shrink: 0;
  transition: opacity 0.15s;
  &:hover { opacity: 0.85; }
`

// ─── Staff modal styled ────────────────────────────────────────────────────────

const StaffOverlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 200;
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
`

const StaffBox = styled.div`
  width: 100%; max-width: 420px;
  background: #0d0d0d;
  border: 1px solid ${C.border};
  border-radius: 12px;
  display: flex; flex-direction: column;
`

const StaffBody = styled.div`
  padding: 20px 28px 28px;
  display: flex; flex-direction: column; gap: 14px;
`

const StaffField = styled.div`
  display: flex; flex-direction: column; gap: 6px;
`

const StaffLabel = styled.label`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  color: ${C.dim};
`

const StaffInput = styled.input`
  padding: 10px 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: ${C.cream}; font-family: 'Montserrat', sans-serif; font-size: 13px;
  outline: none;
  &:focus { border-color: ${C.gold}; }
  &::placeholder { color: ${C.dim}; }
`

const StaffSubmitBtn = styled.button`
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 16px;
  background: ${C.gold}; color: #0d0d0d;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  border: none; border-radius: 6px; cursor: pointer;
  transition: opacity 0.15s;
  svg { width: 13px; height: 13px; }
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShowDetailPage() {
  const router = useRouter()
  const { id } = router.query as { id: string }

  const [event, setEvent]       = useState<EventRow | null>(null)
  const [gear, setGear]         = useState<ShowGearRow[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch]     = useState('')
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const [staff, setStaff]       = useState<StaffRow[]>([])
  const [showStaffModal, setShowStaffModal] = useState(false)
  const [staffName, setStaffName] = useState('')
  const [staffRole, setStaffRole] = useState('')

  const supabase = createClient()

  const load = useCallback(async () => {
    if (!id) return
    const [eventRes, gearRes, staffRes, invRes] = await Promise.all([
      supabase.from('events').select('*').eq('id', id).single(),
      fetch(`/api/admin/show-gear?event_id=${id}`, { headers: await authHeaders() }),
      fetch(`/api/admin/show-staff?event_id=${id}`, { headers: await authHeaders() }),
      supabase.from('inventory').select('*').order('category').order('name'),
    ])
    setEvent(eventRes.data as EventRow)
    if (gearRes.ok) setGear(await gearRes.json())
    if (staffRes.ok) setStaff(await staffRes.json())
    setInventory((invRes.data as InventoryItem[]) ?? [])
  }, [id, supabase])

  useEffect(() => { load() }, [load])

  async function authHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    }
  }

  async function addGear(inventoryId: string, qty: number) {
    const res = await fetch('/api/admin/show-gear', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ event_id: id, inventory_id: inventoryId, quantity_taken: qty }),
    })
    if (res.ok) {
      const row = await res.json() as ShowGearRow
      setGear(g => {
        const existing = g.findIndex(x => x.inventory_id === inventoryId)
        if (existing >= 0) {
          const next = [...g]
          next[existing] = row
          return next
        }
        return [...g, row]
      })
    }
  }

  async function markReturned(gearRow: ShowGearRow) {
    if (gearRow.quantity_returned >= gearRow.quantity_taken) return
    const next = gearRow.quantity_returned + 1
    const res = await fetch(`/api/admin/show-gear/${gearRow.id}`, {
      method: 'PUT',
      headers: await authHeaders(),
      body: JSON.stringify({ quantity_returned: next }),
    })
    if (res.ok) {
      const row = await res.json() as ShowGearRow
      setGear(g => g.map(x => x.id === row.id ? row : x))
    }
  }

  async function removeGear(gearRow: ShowGearRow) {
    await fetch(`/api/admin/show-gear/${gearRow.id}`, { method: 'DELETE', headers: await authHeaders() })
    setGear(g => g.filter(x => x.id !== gearRow.id))
  }

  async function addStaff() {
    if (!staffName.trim()) return
    const res = await fetch('/api/admin/show-staff', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ event_id: id, name: staffName, role: staffRole }),
    })
    if (res.ok) {
      const row = await res.json() as StaffRow
      setStaff(s => [...s, row])
      setStaffName('')
      setStaffRole('')
    }
  }

  async function removeStaff(staffRow: StaffRow) {
    await fetch(`/api/admin/show-staff/${staffRow.id}`, { method: 'DELETE', headers: await authHeaders() })
    setStaff(s => s.filter(x => x.id !== staffRow.id))
  }

  function openStaffModal() {
    setStaffName('')
    setStaffRole('')
    setShowStaffModal(true)
  }

  function openModal() {
    const initial: Record<string, number> = {}
    inventory.forEach(item => { initial[item.id] = 1 })
    setQuantities(initial)
    setSearch('')
    setShowModal(true)
  }

  function toggleCollapse(key: string) {
    setCollapsed(c => ({ ...c, [key]: !c[key] }))
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const addedIds = new Set(gear.map(g => g.inventory_id))

  const filteredInventory = search
    ? inventory.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        (i.subcategory ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : inventory

  const inventoryGroups = CATEGORIES
    .map(cat => ({ cat, items: filteredInventory.filter(i => i.category === cat.key) }))
    .filter(g => g.items.length > 0)

  const taking = gear.filter(g => g.quantity_taken > g.quantity_returned || g.quantity_returned === 0)
  const returned = gear.filter(g => g.quantity_returned > 0)

  if (!event) return <AdminLayout title="Show" subtitle=""><div /></AdminLayout>

  return (
    <AdminLayout title={event.title} subtitle={`${formatDate(event.date)} · ${event.venue}, ${event.city}`}>
      <BackBtn onClick={() => router.push('/admin/eventos')}>
        <ArrowLeft /> Voltar aos eventos
      </BackBtn>

      {/* Event header */}
      <EventHeader>
        <EventTitle>{event.title}</EventTitle>
        <EventMeta>
          <span>{formatDate(event.date)}{event.time ? ` às ${event.time}` : ''}</span>
          <span>{event.venue}, {event.city}</span>
        </EventMeta>
        {(event.tags ?? []).length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {event.tags?.map(t => <TagChip key={t}>{t}</TagChip>)}
          </div>
        )}
      </EventHeader>

      {/* O que estamos levando */}
      <SectionRow>
        <SectionTitle><PackageOpen /> O que estamos levando</SectionTitle>
        <AddGearBtn onClick={openModal}><Plus /> Adicionar item</AddGearBtn>
      </SectionRow>

      <GearList>
        {gear.length === 0 ? (
          <EmptyState>Nenhum item adicionado — clica em "Adicionar item" para começar</EmptyState>
        ) : gear.map(row => {
          const fully = row.quantity_returned >= row.quantity_taken
          const cond = row.inventory?.condition ?? 'good'
          return (
            <GearRow key={row.id} $returned={fully}>
              <QtyBadge $muted={fully}>{row.quantity_taken}×</QtyBadge>
              <GearName>{row.inventory?.name}</GearName>
              {row.inventory?.subcategory && <SubBadge>{row.inventory.subcategory}</SubBadge>}
              <CondBadge $color={CONDITION_COLORS[cond] ?? C.sage}>
                {CONDITION_LABELS[cond] ?? cond}
              </CondBadge>
              {row.quantity_returned > 0 && !fully && (
                <ReturnProgress>{row.quantity_returned}/{row.quantity_taken} devolvidos</ReturnProgress>
              )}
              {fully ? (
                <ReturnBtn $done disabled><Check /> Devolvido</ReturnBtn>
              ) : (
                <ReturnBtn onClick={() => markReturned(row)}>
                  <Check /> Devolver{row.quantity_taken > 1 ? ` (${row.quantity_returned + 1}/${row.quantity_taken})` : ''}
                </ReturnBtn>
              )}
              <RemoveBtn onClick={() => removeGear(row)} title="Remover"><Trash2 /></RemoveBtn>
            </GearRow>
          )
        })}
      </GearList>

      {/* O que estamos trazendo de volta */}
      {returned.length > 0 && (
        <>
          <SectionTitle><PackageCheck /> O que estamos trazendo de volta</SectionTitle>
          <GearList>
            {returned.map(row => {
              const fully = row.quantity_returned >= row.quantity_taken
              return (
                <GearRow key={row.id} $returned>
                  <QtyBadge $muted>{row.quantity_returned}×</QtyBadge>
                  <GearName>{row.inventory?.name}</GearName>
                  {row.inventory?.subcategory && <SubBadge>{row.inventory.subcategory}</SubBadge>}
                  {fully
                    ? <ReturnProgress>✓ Tudo devolvido</ReturnProgress>
                    : <ReturnProgress>{row.quantity_returned}/{row.quantity_taken} devolvidos</ReturnProgress>
                  }
                </GearRow>
              )
            })}
          </GearList>
        </>
      )}

      {/* Staff */}
      <SectionRow>
        <SectionTitle><Users /> Staff</SectionTitle>
        <AddGearBtn onClick={openStaffModal}><Plus /> Adicionar staff</AddGearBtn>
      </SectionRow>

      <GearList>
        {staff.length === 0 ? (
          <EmptyState>Nenhum staff adicionado — clica em "Adicionar staff" para começar</EmptyState>
        ) : staff.map(s => (
          <GearRow key={s.id}>
            <GearName>{s.name}</GearName>
            {s.role && <SubBadge>{s.role}</SubBadge>}
            <RemoveBtn onClick={() => removeStaff(s)} title="Remover"><Trash2 /></RemoveBtn>
          </GearRow>
        ))}
      </GearList>

      {/* Inventory selection modal */}
      {showModal && (
        <ModalOverlay>
          <ModalHeader>
            <ModalHeading>Adicionar equipamento ao show</ModalHeading>
            <CloseBtn onClick={() => setShowModal(false)} title="Fechar"><X /></CloseBtn>
          </ModalHeader>

          <SearchBar>
            <Search />
            <SearchInput
              placeholder="Pesquisar equipamento..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </SearchBar>

          <ConcludeRow>
            <ConcludeBtn onClick={() => { setShowModal(false); router.push(`/admin/eventos/${id}`) }}>
              <Check /> Concluir
            </ConcludeBtn>
          </ConcludeRow>

          <ModalBody>
            {inventoryGroups.length === 0 ? (
              <EmptyState>Nenhum item encontrado</EmptyState>
            ) : inventoryGroups.map(({ cat, items }) => {
              const isOpen = !collapsed[cat.key]
              return (
                <div key={cat.key}>
                  <InvGroupHeader onClick={() => toggleCollapse(cat.key)}>
                    <cat.Icon size={14} />
                    <InvGroupTitle>{cat.label}</InvGroupTitle>
                    {isOpen ? <ChevronUp size={13} color={C.dim} /> : <ChevronDown size={13} color={C.dim} />}
                  </InvGroupHeader>

                  {isOpen && items.map(item => {
                    const isAdded = addedIds.has(item.id)
                    const qty = quantities[item.id] ?? 1
                    const cond = item.condition
                    return (
                      <InvItem key={item.id} $added={isAdded}>
                        <InvName>{item.name}</InvName>
                        {item.subcategory && <SubBadge>{item.subcategory}</SubBadge>}
                        <CondBadge $color={CONDITION_COLORS[cond] ?? C.sage}>
                          {CONDITION_LABELS[cond] ?? cond}
                        </CondBadge>

                        {item.quantity > 1 && (
                          <QtyControl>
                            <QtyBtn
                              onClick={() => setQuantities(q => ({ ...q, [item.id]: Math.max(1, (q[item.id] ?? 1) - 1) }))}
                              disabled={qty <= 1}
                            ><Minus /></QtyBtn>
                            <QtyNum>{qty}</QtyNum>
                            <QtyBtn
                              onClick={() => setQuantities(q => ({ ...q, [item.id]: Math.min(item.quantity, (q[item.id] ?? 1) + 1) }))}
                              disabled={qty >= item.quantity}
                            ><Plus /></QtyBtn>
                          </QtyControl>
                        )}

                        <AddItemBtn
                          $added={isAdded}
                          onClick={() => addGear(item.id, qty)}
                        >
                          {isAdded ? '✓ Adicionado' : 'Adicionar'}
                        </AddItemBtn>
                      </InvItem>
                    )
                  })}
                </div>
              )
            })}
          </ModalBody>
        </ModalOverlay>
      )}

      {/* Staff modal */}
      {showStaffModal && (
        <StaffOverlay onClick={e => { if (e.target === e.currentTarget) setShowStaffModal(false) }}>
          <StaffBox>
            <ModalHeader>
              <ModalHeading>Adicionar staff</ModalHeading>
              <CloseBtn onClick={() => setShowStaffModal(false)} title="Fechar"><X /></CloseBtn>
            </ModalHeader>
            <StaffBody as="form" onSubmit={(e: FormEvent) => { e.preventDefault(); addStaff() }}>
              <StaffField>
                <StaffLabel>Nome *</StaffLabel>
                <StaffInput
                  value={staffName}
                  onChange={e => setStaffName(e.target.value)}
                  placeholder="Nome da pessoa"
                  autoFocus
                />
              </StaffField>
              <StaffField>
                <StaffLabel>Função (opcional)</StaffLabel>
                <StaffInput
                  value={staffRole}
                  onChange={e => setStaffRole(e.target.value)}
                  placeholder="Técnico de som, Roadie..."
                />
              </StaffField>
              <StaffSubmitBtn type="submit" disabled={!staffName.trim()}>
                <Plus /> Adicionar
              </StaffSubmitBtn>
            </StaffBody>
          </StaffBox>
        </StaffOverlay>
      )}
    </AdminLayout>
  )
}
