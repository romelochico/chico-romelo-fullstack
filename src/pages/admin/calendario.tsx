import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  AlertTriangle,
  Trash2,
  Pencil,
  CalendarDays,
  MessageSquare,
  FileText,
  Link2,
  Check,
} from 'lucide-react'
import AdminLayout from '../../components/Admin/AdminLayout'
import { createClient } from '../../lib/supabase/client'
import { useTier } from '../../lib/useTier'
import {
  MONTHS,
  WEEKDAYS,
  WEEKDAYS_SHORT,
  WEEKDAYS_MIN,
  TIPOS,
  toKey,
  parseKey,
  addDays,
  addMonths,
  startOfWeek,
  startOfMonth,
  isToday,
  monthMatrix,
  eventsForDay,
  formatDatePt,
  formatShort,
  formatTimeRange,
  todayStr,
  eventShareUrl,
} from '../../lib/calendario'
import type { CalendarioEventoRow, CalendarioTipo } from '../../types'

// ─── Types ───────────────────────────────────────────────────────────────────

type ViewType = 'day' | 'week' | 'month' | 'year'

interface CalendarioFormData {
  nome: string
  tipo: CalendarioTipo
  data_inicio: string
  data_fim: string
  hora_inicio: string
  hora_fim: string
  descricao: string
  enviar_sms: boolean
  sms_hours_before: number
  sms_recipients: string[]
}

type ModalState =
  | { type: 'add' }
  | { type: 'view'; item: CalendarioEventoRow }
  | { type: 'edit'; item: CalendarioEventoRow }
  | { type: 'delete'; item: CalendarioEventoRow }

const EMPTY_FORM: CalendarioFormData = {
  nome: '',
  tipo: 'ensaio',
  data_inicio: '',
  data_fim: '',
  hora_inicio: '',
  hora_fim: '',
  descricao: '',
  enviar_sms: true,
  sms_hours_before: 5,
  sms_recipients: [],
}

// ─── Layout ────────────────────────────────────────────────────────────────

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  gap: 14px;
`

// ─── Toolbar ─────────────────────────────────────────────────────────────────

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  row-gap: 10px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 8px;
  }
`

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const IconBtn = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(245, 240, 232, 0.6);
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #f5f0e8;
  }
  svg {
    width: 15px;
    height: 15px;
  }
`

const TodayBtn = styled.button`
  height: 30px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(245, 240, 232, 0.6);
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #f5f0e8;
  }
`

const PeriodLabel = styled.div`
  font-family: 'Special Elite', serif;
  font-size: 18px;
  color: #f5f0e8;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 15px;
  }
`

const ViewSelect = styled.select`
  height: 30px;
  padding: 0 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #f5f0e8;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  option {
    background: #111111;
  }
`

const MonthStepper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 4px 8px;
`

const StepperLabel = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(245, 240, 232, 0.3);
  margin-right: 2px;
`

const StepBtn = styled.button<{ $active: boolean }>`
  width: 22px;
  height: 22px;
  border: 1px solid transparent;
  background: ${p => (p.$active ? '#c8a96e' : 'transparent')};
  color: ${p => (p.$active ? '#0d0d0d' : 'rgba(245, 240, 232, 0.5)')};
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
  font-variant-numeric: tabular-nums;
  &:hover {
    color: ${p => (p.$active ? '#0d0d0d' : '#f5f0e8')};
    border-color: ${p => (p.$active ? 'transparent' : 'rgba(255,255,255,0.15)')};
  }
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
  white-space: nowrap;
  flex-shrink: 0;
  &:hover {
    opacity: 0.85;
  }
  svg {
    width: 15px;
    height: 15px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 8px;
    span {
      display: none;
    }
  }
`

// ─── Legend ────────────────────────────────────────────────────────────────

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  row-gap: 6px;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 10px 14px;
  }
`

const LegendItem = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Montserrat', sans-serif;
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(245, 240, 232, 0.8);
`

const LegendIcon = styled.span<{ $color: string }>`
  display: flex;
  color: ${p => p.$color};
  flex-shrink: 0;
  svg {
    width: 13px;
    height: 13px;
  }
`

// ─── Board (grid area) ───────────────────────────────────────────────────────

const Board = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-height: 70dvh;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 32px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: rgba(245, 240, 232, 0.2);
`

// Month (single)

const MonthCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 520px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-height: 0;
  }
`

const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 6px;
  flex-shrink: 0;
`

const WeekdayHead = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(245, 240, 232, 0.3);
  padding: 0 4px 6px;
`

const MonthGridLarge = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  gap: 1px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
`

const DayCell = styled.div<{ $outside?: boolean }>`
  background: #111111;
  padding: 6px 6px 4px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  cursor: pointer;
  transition: background 0.12s;
  opacity: ${p => (p.$outside ? 0.35 : 1)};
  &:hover {
    background: #1a1a1a;
  }
`

const DayNum = styled.div<{ $today?: boolean }>`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: rgba(245, 240, 232, 0.6);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
  margin-bottom: 4px;
  ${p =>
    p.$today &&
    css`
      background: #c8a96e;
      color: #0d0d0d;
    `}
`

const ChipList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-height: 0;
  overflow: hidden;
`

const Chip = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'Montserrat', sans-serif;
  font-size: 10.5px;
  font-weight: 600;
  color: #f5f0e8;
  background: rgba(255, 255, 255, 0.05);
  border-left: 2px solid ${p => p.$color};
  padding: 2px 5px;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

const ChipIcon = styled.span<{ $color: string }>`
  display: flex;
  color: ${p => p.$color};
  flex-shrink: 0;
  svg {
    width: 10px;
    height: 10px;
  }
`

const ChipTime = styled.span`
  font-variant-numeric: tabular-nums;
  color: rgba(245, 240, 232, 0.55);
  flex-shrink: 0;
`

const ChipMore = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: rgba(245, 240, 232, 0.3);
  padding: 1px 5px;
  cursor: pointer;
  &:hover {
    color: rgba(245, 240, 232, 0.6);
  }
`

// Mini month (multi-month / year)

const MiniGridWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
  align-content: start;
`

const MiniMonthBox = styled.div`
  background: #111111;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px 12px 10px;
`

const MiniHeading = styled.h3`
  margin: 0 0 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12.5px;
  font-weight: 700;
  color: #f5f0e8;
`

const MiniWeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 3px;
`

const MiniWeekdayHead = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 700;
  color: rgba(245, 240, 232, 0.3);
  text-align: center;
`

const MiniGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`

const MiniCell = styled.div<{ $outside?: boolean; $today?: boolean }>`
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  color: rgba(245, 240, 232, 0.6);
  opacity: ${p => (p.$outside ? 0.35 : 1)};
  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
  ${p =>
    p.$today &&
    css`
      background: #c8a96e;
      color: #0d0d0d;
      font-weight: 700;
    `}
`

const MiniDots = styled.div`
  display: flex;
  gap: 2px;
  height: 4px;
`

const MiniDot = styled.span<{ $color: string; $today?: boolean }>`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${p => (p.$today ? '#0d0d0d' : p.$color)};
`

// Week view

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  height: 100%;
  min-height: 480px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    height: auto;
  }
`

const WeekCol = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #111111;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-height: 120px;
  }
`

const WeekColHead = styled.div`
  padding: 10px 10px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
  cursor: pointer;
  flex-shrink: 0;
  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }
`

const WeekColWd = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(245, 240, 232, 0.3);
  display: block;
  margin-bottom: 4px;
`

const WeekColNum = styled.span<{ $today?: boolean }>`
  width: 26px;
  height: 26px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: #f5f0e8;
  ${p =>
    p.$today &&
    css`
      background: #c8a96e;
      color: #0d0d0d;
    `}
`

const WeekColBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const WeekChip = styled.div<{ $color: string }>`
  display: flex;
  align-items: flex-start;
  gap: 7px;
  background: rgba(255, 255, 255, 0.05);
  border-left: 3px solid ${p => p.$color};
  border-radius: 4px;
  padding: 6px 8px;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

const WeekChipIcon = styled.span<{ $color: string }>`
  display: flex;
  color: ${p => p.$color};
  flex-shrink: 0;
  margin-top: 1px;
  svg {
    width: 12px;
    height: 12px;
  }
`

const WeekChipName = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 11.5px;
  font-weight: 600;
  color: #f5f0e8;
`

const WeekChipType = styled.span<{ $color: string }>`
  display: block;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${p => p.$color};
  margin-top: 2px;
`

const WeekEmpty = styled.div`
  font-family: 'Montserrat', sans-serif;
  color: rgba(245, 240, 232, 0.2);
  font-size: 11px;
  text-align: center;
  padding-top: 14px;
`

// Day view

const DayView = styled.div`
  max-width: 720px;
  margin: 0 auto;
`

const DayViewHead = styled.div`
  margin-bottom: 18px;
`

const DayViewWeekday = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #c8a96e;
`

const DayViewDate = styled.div`
  font-family: 'Special Elite', serif;
  font-size: 26px;
  color: #f5f0e8;
  margin-top: 2px;
`

const DayEventCard = styled.div<{ $color: string }>`
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-left: 3px solid ${p => p.$color};
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`

const DayEventIconBox = styled.div<{ $color: string }>`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => `${p.$color}22`};
  color: ${p => p.$color};
  flex-shrink: 0;
  svg {
    width: 16px;
    height: 16px;
  }
`

const DayEventName = styled.div`
  font-family: 'Special Elite', serif;
  font-size: 15px;
  color: #f5f0e8;
`

const DayEventMeta = styled.div<{ $color: string }>`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: ${p => p.$color};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 3px;
`

const DayEventDesc = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 12.5px;
  color: rgba(245, 240, 232, 0.5);
  margin-top: 6px;
  line-height: 1.5;
`

const DayEmpty = styled.div`
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  color: rgba(245, 240, 232, 0.2);
  font-size: 13px;
  padding: 60px 0;
  line-height: 1.6;
`

// ─── Modal ─────────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0;
    align-items: stretch;
  }
`

const ModalBox = styled.div`
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-width: 100%;
    max-height: 100%;
    height: 100%;
    border-radius: 0;
    border: none;
  }
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
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
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 6px;
  color: rgba(245, 240, 232, 0.5);
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #f5f0e8;
  }
  svg {
    width: 16px;
    height: 16px;
  }
`

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const PlainFieldset = styled.fieldset`
  display: contents;
  border: none;
  padding: 0;
  margin: 0;
`

// ─── Event view (read-only details) ─────────────────────────────────────────

const TypeBadge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${p => p.$color};
  background: ${p => `${p.$color}22`};
  color: #f5f0e8;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 600;

  svg {
    width: 14px;
    height: 14px;
    color: ${p => p.$color};
    flex-shrink: 0;
  }
`

const DetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;

  svg {
    width: 16px;
    height: 16px;
    color: rgba(245, 240, 232, 0.35);
    flex-shrink: 0;
    margin-top: 2px;
  }
`

const DetailText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`

const DetailValue = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 13.5px;
  color: #f5f0e8;
  line-height: 1.5;
  white-space: pre-wrap;
`

const DetailSub = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: rgba(245, 240, 232, 0.45);
  line-height: 1.4;
`

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  position: sticky;
  bottom: 0;
  background: #1a1a1a;
`

const FooterActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`

const Label = styled.label`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(245, 240, 232, 0.45);
`

const Hint = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  color: rgba(245, 240, 232, 0.2);
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
  margin-left: 6px;
`

const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: rgba(245, 240, 232, 0.6);
  margin-bottom: 14px;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    accent-color: #c8a96e;
  }
`

const RecipientBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 180px;
  overflow-y: auto;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
`

const RecipientCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: rgba(245, 240, 232, 0.7);

  input[type='checkbox'] {
    width: 15px;
    height: 15px;
    accent-color: #c8a96e;
    flex-shrink: 0;
  }
`

const RecipientEmpty = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: rgba(245, 240, 232, 0.3);
`

const inputStyles = css`
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #f5f0e8;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  &:focus {
    border-color: #c8a96e;
  }
  &::placeholder {
    color: rgba(245, 240, 232, 0.2);
  }
`

const Input = styled.input`
  ${inputStyles}
`

const TypePicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const TypeOption = styled.button<{ $color: string; $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${p => (p.$selected ? p.$color : 'rgba(255, 255, 255, 0.1)')};
  background: ${p => (p.$selected ? `${p.$color}22` : 'rgba(255, 255, 255, 0.05)')};
  color: ${p => (p.$selected ? '#f5f0e8' : 'rgba(245, 240, 232, 0.55)')};
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    border-color: ${p => p.$color};
    color: #f5f0e8;
  }
  svg {
    width: 14px;
    height: 14px;
    color: ${p => p.$color};
    flex-shrink: 0;
  }
`

const Textarea = styled.textarea`
  ${inputStyles}
  resize: vertical;
  min-height: 70px;
  font-family: 'Montserrat', sans-serif;
`

const FormError = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: #f87171;
`

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
  &:hover {
    opacity: 0.85;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const BtnGhost = styled.button`
  padding: 10px 20px;
  background: transparent;
  color: rgba(245, 240, 232, 0.5);
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    color: #f5f0e8;
    border-color: rgba(255, 255, 255, 0.2);
  }
`

const BtnDangerGhost = styled.button`
  padding: 10px 16px;
  background: transparent;
  color: #f87171;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s;
  &:hover {
    background: rgba(248, 113, 113, 0.1);
  }
  svg {
    width: 13px;
    height: 13px;
  }
`

const BtnDanger = styled(BtnPrimary)`
  background: #f87171;
  color: #fff;
`

const ConfirmBox = styled(ModalBox)`
  max-width: 400px;
`

const ConfirmBody = styled.div`
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  svg {
    width: 36px;
    height: 36px;
    color: #f87171;
  }
`

const ConfirmTitle = styled.h3`
  font-family: 'Special Elite', serif;
  font-size: 18px;
  color: #f5f0e8;
`

const ConfirmText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: rgba(245, 240, 232, 0.45);
  line-height: 1.5;
`

// ─── Helpers ───────────────────────────────────────────────────────────────

function buildPeriodLabel(view: ViewType, current: Date, monthCount: number): string {
  if (view === 'day') {
    return `${WEEKDAYS[current.getDay()]}, ${current.getDate()} de ${MONTHS[current.getMonth()]} de ${current.getFullYear()}`
  }
  if (view === 'week') {
    const start = startOfWeek(current)
    const end = addDays(start, 6)
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} – ${end.getDate()} de ${MONTHS[start.getMonth()]} ${start.getFullYear()}`
    }
    return `${formatShort(start)} – ${formatShort(end)} de ${end.getFullYear()}`
  }
  if (view === 'month') {
    if (monthCount === 1) return `${MONTHS[current.getMonth()]} ${current.getFullYear()}`
    const first = startOfMonth(current)
    const last = addMonths(first, monthCount - 1)
    return `${MONTHS[first.getMonth()]} ${first.getFullYear()} – ${MONTHS[last.getMonth()]} ${last.getFullYear()}`
  }
  return String(current.getFullYear())
}

const TIPO_KEYS = Object.keys(TIPOS) as CalendarioTipo[]

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AdminCalendarioPage() {
  const router = useRouter()
  const [events, setEvents] = useState<CalendarioEventoRow[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(new Date())
  const [view, setView] = useState<ViewType>('month')
  const [monthCount, setMonthCount] = useState(1)
  const [modal, setModal] = useState<ModalState | null>(null)
  const [form, setForm] = useState<CalendarioFormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const { tier } = useTier()
  const canAddEvent = tier === 'admin' || tier === 'membro_da_banda'
  const canManageEvents = tier !== null && tier !== 'percussao_e_metais'
  const canManageSmsRecipients = tier === 'admin' || tier === 'diretoria'
  const [smsCandidates, setSmsCandidates] = useState<{ id: string; label: string }[]>([])
  const [copiedLink, setCopiedLink] = useState(false)
  const openedFromLink = useRef(false)

  // Opens straight to an event's details when arriving via a /e/<id> share
  // link (?ev=<id>) — only once, so closing the modal doesn't reopen it.
  useEffect(() => {
    if (openedFromLink.current) return
    const evId = router.query.ev
    if (typeof evId !== 'string' || events.length === 0) return
    const match = events.find(e => e.id === evId)
    if (match) {
      openedFromLink.current = true
      openView(match)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, router.query.ev])

  useEffect(() => {
    load()
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    supabase
      .from('team_members')
      .select('id, nome, sobrenome, telefone')
      .not('telefone', 'is', null)
      .then(({ data }) => {
        setSmsCandidates(
          (data ?? []).map(m => ({
            id: m.id as string,
            label: [m.nome, m.sobrenome].filter(Boolean).join(' ') || (m.telefone as string),
          }))
        )
      })
  }, [])

  async function authHeaders(): Promise<Record<string, string>> {
    const {
      data: { session },
    } = await createClient().auth.getSession()
    return {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    }
  }

  async function load() {
    setLoading(true)
    const [{ data: local }, ensaiosRes] = await Promise.all([
      createClient()
        .from('calendario_eventos')
        .select('*')
        .neq('tipo', 'ensaio')
        .order('data_inicio', { ascending: true }),
      fetch('/api/admin/calendario/ensaios', { headers: await authHeaders() }),
    ])
    const ensaios = ensaiosRes.ok ? ((await ensaiosRes.json()) as CalendarioEventoRow[]) : []
    const merged = [...((local ?? []) as unknown as CalendarioEventoRow[]), ...ensaios].sort(
      (a, b) => a.data_inicio.localeCompare(b.data_inicio)
    )
    setEvents(merged)
    setLoading(false)
  }

  function openAdd(dateKey?: string) {
    if (!canAddEvent) return
    setForm({ ...EMPTY_FORM, data_inicio: dateKey || todayStr() })
    setFormError('')
    setModal({ type: 'add' })
  }

  function openView(item: CalendarioEventoRow) {
    setModal({ type: 'view', item })
  }

  async function handleCopyLink(item: CalendarioEventoRow) {
    await navigator.clipboard.writeText(eventShareUrl(item))
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 1500)
  }

  function openEdit(item: CalendarioEventoRow) {
    setForm({
      nome: item.nome,
      tipo: item.tipo,
      data_inicio: item.data_inicio,
      data_fim: item.data_fim ?? '',
      hora_inicio: item.hora_inicio ?? '',
      hora_fim: item.hora_fim ?? '',
      descricao: item.descricao ?? '',
      enviar_sms: item.enviar_sms,
      sms_hours_before: item.sms_hours_before,
      sms_recipients: item.sms_recipients ?? [],
    })
    setFormError('')
    setModal({ type: 'edit', item })
  }

  function openDelete(item: CalendarioEventoRow) {
    setModal({ type: 'delete', item })
  }

  function closeModal() {
    setModal(null)
    setFormError('')
    setSaving(false)
  }

  function setField<K extends keyof CalendarioFormData>(key: K, val: CalendarioFormData[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleSave() {
    if (!modal || modal.type === 'delete') return
    if (!form.nome.trim() || !form.data_inicio) {
      setFormError('Nome e data de início são obrigatórios.')
      return
    }
    if (form.data_fim && form.data_fim < form.data_inicio) {
      setFormError('A data final não pode ser anterior à data de início.')
      return
    }
    const sameDate = !form.data_fim || form.data_fim === form.data_inicio
    if (sameDate && form.hora_inicio && form.hora_fim && form.hora_fim < form.hora_inicio) {
      setFormError('A hora final não pode ser anterior à hora de início.')
      return
    }
    if (form.tipo === 'ensaio' && !form.hora_inicio) {
      setFormError('Hora inicial é obrigatória para ensaios (agendados via nboxes).')
      return
    }
    setSaving(true)
    setFormError('')

    // Ensaios são derivados do nboxes — não vivem em calendario_eventos.
    if (form.tipo === 'ensaio') {
      const requestBody = JSON.stringify({
        nome: form.nome.trim(),
        data_inicio: form.data_inicio,
        hora_inicio: form.hora_inicio,
        hora_fim: form.hora_fim || null,
        enviar_sms: form.enviar_sms,
        sms_hours_before: form.sms_hours_before,
        sms_recipients: form.sms_recipients,
        descricao: form.descricao.trim() || null,
      })
      const res = await fetch(
        modal.type === 'add'
          ? '/api/admin/calendario/ensaios'
          : `/api/admin/calendario/ensaios/${modal.item.id}`,
        {
          method: modal.type === 'add' ? 'POST' : 'PATCH',
          headers: await authHeaders(),
          body: requestBody,
        }
      )
      if (!res.ok) {
        const errBody = await res.json().catch(() => null)
        setFormError(errBody?.error || 'Falha ao agendar ensaio no nboxes.')
        setSaving(false)
        return
      }
      closeModal()
      load()
      return
    }

    const payload: Record<string, unknown> = {
      nome: form.nome.trim(),
      tipo: form.tipo,
      data_inicio: form.data_inicio,
      data_fim: form.data_fim || null,
      hora_inicio: form.hora_inicio || null,
      hora_fim: form.hora_fim || null,
      descricao: form.descricao.trim() || null,
      enviar_sms: form.enviar_sms,
      sms_hours_before: form.sms_hours_before,
      sms_recipients: form.sms_recipients.length > 0 ? form.sms_recipients : null,
    }

    const client = createClient()
    let error: { message: string } | null = null

    if (modal.type === 'add') {
      payload['created_by'] = user?.email ?? null
      ;({ error } = await client.from('calendario_eventos').insert(payload))
    } else {
      ;({ error } = await client.from('calendario_eventos').update(payload).eq('id', modal.item.id))
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
    if (modal.item.tipo === 'ensaio') {
      await fetch(`/api/admin/calendario/ensaios/${modal.item.id}`, {
        method: 'DELETE',
        headers: await authHeaders(),
      })
    } else {
      await createClient().from('calendario_eventos').delete().eq('id', modal.item.id)
    }
    closeModal()
    load()
  }

  function navigate(dir: 1 | -1) {
    if (view === 'day') setCurrent(c => addDays(c, dir))
    else if (view === 'week') setCurrent(c => addDays(c, dir * 7))
    else if (view === 'month') setCurrent(c => addMonths(c, dir * monthCount))
    else setCurrent(c => new Date(c.getFullYear() + dir, c.getMonth(), 1))
  }

  function goToDay(dateKey: string) {
    setCurrent(parseKey(dateKey))
    setView('day')
  }

  const periodLabel = useMemo(
    () => buildPeriodLabel(view, current, monthCount),
    [view, current, monthCount]
  )
  const isFormModal = modal?.type === 'add' || modal?.type === 'edit'
  const isViewModal = modal?.type === 'view'
  const isDeleteModal = modal?.type === 'delete'

  function recipientLabel(id: string): string {
    return smsCandidates.find(c => c.id === id)?.label ?? 'Membro removido'
  }

  return (
    <AdminLayout title="Calendário" subtitle="Agenda interna de eventos" fullHeight compactHeader>
      <Wrapper>
        <Toolbar>
          <ViewSelect value={view} onChange={e => setView(e.target.value as ViewType)}>
            <option value="day">Diário</option>
            <option value="week">Semanal</option>
            <option value="month">Mensal</option>
            <option value="year">Anual</option>
          </ViewSelect>

          {view === 'month' && (
            <MonthStepper>
              <StepperLabel>Meses</StepperLabel>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <StepBtn key={n} $active={monthCount === n} onClick={() => setMonthCount(n)}>
                  {n}
                </StepBtn>
              ))}
            </MonthStepper>
          )}

          {canAddEvent && (
            <AddBtn onClick={() => openAdd()}>
              <Plus /> <span>Novo evento</span>
            </AddBtn>
          )}

          <TodayBtn onClick={() => setCurrent(new Date())}>Hoje</TodayBtn>
          <NavGroup>
            <IconBtn onClick={() => navigate(-1)} aria-label="Período anterior">
              <ChevronLeft />
            </IconBtn>
            <PeriodLabel>{periodLabel}</PeriodLabel>
            <IconBtn onClick={() => navigate(1)} aria-label="Próximo período">
              <ChevronRight />
            </IconBtn>
          </NavGroup>
        </Toolbar>

        <Board>
          {loading ? (
            <EmptyState>Carregando...</EmptyState>
          ) : view === 'month' ? (
            monthCount === 1 ? (
              <MonthSingle
                monthRef={current}
                events={events}
                onCellClick={openAdd}
                onEventClick={openView}
                onMore={goToDay}
              />
            ) : (
              <MiniGridWrap>
                {Array.from({ length: monthCount }, (_, i) =>
                  addMonths(startOfMonth(current), i)
                ).map(m => (
                  <MiniMonth key={toKey(m)} monthRef={m} events={events} onDayClick={goToDay} />
                ))}
              </MiniGridWrap>
            )
          ) : view === 'week' ? (
            <WeekView
              start={startOfWeek(current)}
              events={events}
              onCellClick={openAdd}
              onEventClick={openView}
            />
          ) : view === 'day' ? (
            <DayViewPanel date={current} events={events} onEventClick={openView} />
          ) : (
            <MiniGridWrap>
              {Array.from({ length: 12 }, (_, i) => new Date(current.getFullYear(), i, 1)).map(
                m => (
                  <MiniMonth key={toKey(m)} monthRef={m} events={events} onDayClick={goToDay} />
                )
              )}
            </MiniGridWrap>
          )}
        </Board>

        <Legend>
          {TIPO_KEYS.map(tipo => {
            const Icon = TIPOS[tipo].icon
            return (
              <LegendItem key={tipo}>
                <LegendIcon $color={TIPOS[tipo].color}>
                  <Icon />
                </LegendIcon>
                {TIPOS[tipo].label}
              </LegendItem>
            )
          })}
        </Legend>
      </Wrapper>

      {/* ── Event details (view) ── */}
      {isViewModal && modal && modal.type === 'view' && (
        <Overlay
          onClick={e => {
            if (e.target === e.currentTarget) closeModal()
          }}
        >
          <ModalBox>
            <ModalHeader>
              <ModalTitle>{modal.item.nome}</ModalTitle>
              <CloseBtn onClick={closeModal}>
                <X />
              </CloseBtn>
            </ModalHeader>

            <ModalBody>
              <DetailList>
                <TypeBadge $color={TIPOS[modal.item.tipo].color}>
                  {(() => {
                    const Icon = TIPOS[modal.item.tipo].icon
                    return <Icon />
                  })()}
                  {TIPOS[modal.item.tipo].label}
                </TypeBadge>

                <DetailRow>
                  <CalendarDays />
                  <DetailText>
                    <DetailValue>
                      {formatDatePt(parseKey(modal.item.data_inicio))}
                      {modal.item.data_fim && modal.item.data_fim !== modal.item.data_inicio
                        ? ` – ${formatDatePt(parseKey(modal.item.data_fim))}`
                        : ''}
                    </DetailValue>
                    {formatTimeRange(modal.item) && (
                      <DetailSub>{formatTimeRange(modal.item)}</DetailSub>
                    )}
                  </DetailText>
                </DetailRow>

                {modal.item.descricao && (
                  <DetailRow>
                    <FileText />
                    <DetailText>
                      <DetailValue>{modal.item.descricao}</DetailValue>
                    </DetailText>
                  </DetailRow>
                )}

                <DetailRow>
                  <MessageSquare />
                  <DetailText>
                    <DetailValue>
                      {modal.item.enviar_sms
                        ? `Lembrete por SMS, ${modal.item.sms_hours_before}h antes`
                        : 'Sem lembrete por SMS'}
                    </DetailValue>
                    {modal.item.enviar_sms && (
                      <DetailSub>
                        {modal.item.sms_recipients && modal.item.sms_recipients.length > 0
                          ? modal.item.sms_recipients.map(recipientLabel).join(', ')
                          : 'Todos os membros com telefone'}
                      </DetailSub>
                    )}
                  </DetailText>
                </DetailRow>
              </DetailList>
            </ModalBody>

            <ModalFooter>
              <BtnGhost
                onClick={() => handleCopyLink(modal.item)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {copiedLink ? (
                  <>
                    <Check size={13} /> Copiado!
                  </>
                ) : (
                  <>
                    <Link2 size={13} /> Copiar link
                  </>
                )}
              </BtnGhost>
              <FooterActions>
                <BtnGhost onClick={closeModal}>Fechar</BtnGhost>
                {canManageEvents && (
                  <BtnPrimary
                    onClick={() => openEdit(modal.item)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Pencil size={13} /> Editar
                  </BtnPrimary>
                )}
              </FooterActions>
            </ModalFooter>
          </ModalBox>
        </Overlay>
      )}

      {/* ── Add / Edit modal ── */}
      {isFormModal && modal && (
        <Overlay
          onClick={e => {
            if (e.target === e.currentTarget) closeModal()
          }}
        >
          <ModalBox>
            <ModalHeader>
              <ModalTitle>
                {!canManageEvents
                  ? 'Detalhes do Evento'
                  : modal.type === 'add'
                    ? 'Novo Evento'
                    : 'Editar Evento'}
                {!canManageEvents && <Hint>somente leitura</Hint>}
              </ModalTitle>
              <CloseBtn onClick={closeModal}>
                <X />
              </CloseBtn>
            </ModalHeader>

            <ModalBody>
              <PlainFieldset disabled={!canManageEvents}>
                <Field>
                  <Label>Nome do evento *</Label>
                  <Input
                    value={form.nome}
                    onChange={e => setField('nome', e.target.value)}
                    placeholder="Ex.: Ensaio geral, Show na Trapiche…"
                  />
                </Field>

                <Field>
                  <Label>Tipo de evento *</Label>
                  <TypePicker>
                    {TIPO_KEYS.map(tipo => {
                      const Icon = TIPOS[tipo].icon
                      return (
                        <TypeOption
                          key={tipo}
                          type="button"
                          $color={TIPOS[tipo].color}
                          $selected={form.tipo === tipo}
                          onClick={() => setField('tipo', tipo)}
                        >
                          <Icon />
                          {TIPOS[tipo].label}
                        </TypeOption>
                      )
                    })}
                  </TypePicker>
                </Field>

                <FieldRow>
                  <Field>
                    <Label>Data de início *</Label>
                    <Input
                      type="date"
                      value={form.data_inicio}
                      onChange={e => setField('data_inicio', e.target.value)}
                    />
                  </Field>
                  <Field>
                    <Label>
                      Hora de início <Hint>opcional</Hint>
                    </Label>
                    <Input
                      type="time"
                      value={form.hora_inicio}
                      onChange={e => setField('hora_inicio', e.target.value)}
                    />
                  </Field>
                </FieldRow>

                <FieldRow>
                  <Field>
                    <Label>
                      Data final <Hint>opcional</Hint>
                    </Label>
                    <Input
                      type="date"
                      value={form.data_fim}
                      onChange={e => setField('data_fim', e.target.value)}
                    />
                  </Field>
                  <Field>
                    <Label>
                      Hora final <Hint>opcional</Hint>
                    </Label>
                    <Input
                      type="time"
                      value={form.hora_fim}
                      onChange={e => setField('hora_fim', e.target.value)}
                    />
                  </Field>
                </FieldRow>

                <ToggleRow>
                  <input
                    type="checkbox"
                    checked={form.enviar_sms}
                    onChange={e => setField('enviar_sms', e.target.checked)}
                  />
                  Enviar lembrete por SMS
                </ToggleRow>

                {form.enviar_sms && (
                  <Field style={{ maxWidth: 180 }}>
                    <Label>Horas antes do início</Label>
                    <Input
                      type="number"
                      min={1}
                      max={72}
                      value={form.sms_hours_before}
                      onChange={e => setField('sms_hours_before', Number(e.target.value) || 5)}
                    />
                  </Field>
                )}

                {form.enviar_sms && canManageSmsRecipients && (
                  <Field>
                    <Label>
                      Destinatários do SMS <Hint>vazio = todos com telefone</Hint>
                    </Label>
                    <RecipientBox>
                      {smsCandidates.length === 0 && (
                        <RecipientEmpty>Nenhum membro com telefone cadastrado.</RecipientEmpty>
                      )}
                      {smsCandidates.map(c => (
                        <RecipientCheckbox key={c.id}>
                          <input
                            type="checkbox"
                            checked={form.sms_recipients.includes(c.id)}
                            onChange={e =>
                              setField(
                                'sms_recipients',
                                e.target.checked
                                  ? [...form.sms_recipients, c.id]
                                  : form.sms_recipients.filter(id => id !== c.id)
                              )
                            }
                          />
                          {c.label}
                        </RecipientCheckbox>
                      ))}
                    </RecipientBox>
                  </Field>
                )}

                <Field>
                  <Label>
                    Descrição <Hint>opcional</Hint>
                  </Label>
                  <Textarea
                    value={form.descricao}
                    onChange={e => setField('descricao', e.target.value)}
                    placeholder="Detalhes, local, observações…"
                  />
                </Field>

                {formError && <FormError>{formError}</FormError>}
              </PlainFieldset>
            </ModalBody>

            <ModalFooter>
              {canManageEvents && modal.type === 'edit' && (
                <BtnDangerGhost onClick={() => openDelete(modal.item)}>
                  <Trash2 /> Excluir
                </BtnDangerGhost>
              )}
              <FooterActions>
                {canManageEvents ? (
                  <>
                    <BtnGhost onClick={closeModal}>Cancelar</BtnGhost>
                    <BtnPrimary onClick={handleSave} disabled={saving}>
                      {saving ? 'Salvando...' : modal.type === 'add' ? 'Adicionar' : 'Salvar'}
                    </BtnPrimary>
                  </>
                ) : (
                  <BtnGhost onClick={closeModal}>Fechar</BtnGhost>
                )}
              </FooterActions>
            </ModalFooter>
          </ModalBox>
        </Overlay>
      )}

      {/* ── Delete confirm ── */}
      {isDeleteModal && modal && (
        <Overlay
          onClick={e => {
            if (e.target === e.currentTarget) closeModal()
          }}
        >
          <ConfirmBox>
            <ConfirmBody>
              <AlertTriangle />
              <ConfirmTitle>Excluir evento?</ConfirmTitle>
              <ConfirmText>
                Tem certeza que quer excluir <strong>&quot;{modal.item.nome}&quot;</strong>? Esta
                ação não pode ser desfeita.
              </ConfirmText>
            </ConfirmBody>
            <ModalFooter>
              <FooterActions>
                <BtnGhost onClick={closeModal}>Cancelar</BtnGhost>
                <BtnDanger onClick={handleDelete}>Excluir</BtnDanger>
              </FooterActions>
            </ModalFooter>
          </ConfirmBox>
        </Overlay>
      )}
    </AdminLayout>
  )
}

// ─── Sub-views ───────────────────────────────────────────────────────────────

function MonthSingle({
  monthRef,
  events,
  onCellClick,
  onEventClick,
  onMore,
}: {
  monthRef: Date
  events: CalendarioEventoRow[]
  onCellClick: (dateKey: string) => void
  onEventClick: (item: CalendarioEventoRow) => void
  onMore: (dateKey: string) => void
}) {
  const days = monthMatrix(monthRef)
  return (
    <MonthCard>
      <WeekdayRow>
        {WEEKDAYS_SHORT.map(w => (
          <WeekdayHead key={w}>{w}</WeekdayHead>
        ))}
      </WeekdayRow>
      <MonthGridLarge>
        {days.map(d => {
          const key = toKey(d)
          const outside = d.getMonth() !== monthRef.getMonth()
          const dayEvents = eventsForDay(events, d)
          const shown = dayEvents.slice(0, 3)
          const extra = dayEvents.length - shown.length
          return (
            <DayCell key={key} $outside={outside} onClick={() => onCellClick(key)}>
              <DayNum $today={isToday(d)}>{d.getDate()}</DayNum>
              <ChipList>
                {shown.map(ev => {
                  const Icon = TIPOS[ev.tipo].icon
                  const time = ev.hora_inicio ? ev.hora_inicio.slice(0, 5) : null
                  return (
                    <Chip
                      key={ev.id}
                      $color={TIPOS[ev.tipo].color}
                      onClick={e => {
                        e.stopPropagation()
                        onEventClick(ev)
                      }}
                    >
                      <ChipIcon $color={TIPOS[ev.tipo].color}>
                        <Icon />
                      </ChipIcon>
                      {time && <ChipTime>{time}</ChipTime>}
                      {ev.nome}
                    </Chip>
                  )
                })}
                {extra > 0 && (
                  <ChipMore
                    onClick={e => {
                      e.stopPropagation()
                      onMore(key)
                    }}
                  >
                    +{extra} mais
                  </ChipMore>
                )}
              </ChipList>
            </DayCell>
          )
        })}
      </MonthGridLarge>
    </MonthCard>
  )
}

function MiniMonth({
  monthRef,
  events,
  onDayClick,
}: {
  monthRef: Date
  events: CalendarioEventoRow[]
  onDayClick: (dateKey: string) => void
}) {
  const days = monthMatrix(monthRef)
  return (
    <MiniMonthBox>
      <MiniHeading>
        {MONTHS[monthRef.getMonth()]} {monthRef.getFullYear()}
      </MiniHeading>
      <MiniWeekdayRow>
        {WEEKDAYS_MIN.map((w, i) => (
          <MiniWeekdayHead key={i}>{w}</MiniWeekdayHead>
        ))}
      </MiniWeekdayRow>
      <MiniGrid>
        {days.map(d => {
          const key = toKey(d)
          const outside = d.getMonth() !== monthRef.getMonth()
          const dayEvents = eventsForDay(events, d).slice(0, 4)
          const today = isToday(d)
          return (
            <MiniCell key={key} $outside={outside} $today={today} onClick={() => onDayClick(key)}>
              <span>{d.getDate()}</span>
              <MiniDots>
                {dayEvents.map(ev => (
                  <MiniDot key={ev.id} $color={TIPOS[ev.tipo].color} $today={today} />
                ))}
              </MiniDots>
            </MiniCell>
          )
        })}
      </MiniGrid>
    </MiniMonthBox>
  )
}

function WeekView({
  start,
  events,
  onCellClick,
  onEventClick,
}: {
  start: Date
  events: CalendarioEventoRow[]
  onCellClick: (dateKey: string) => void
  onEventClick: (item: CalendarioEventoRow) => void
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))
  return (
    <WeekGrid>
      {days.map((d, i) => {
        const key = toKey(d)
        const dayEvents = eventsForDay(events, d)
        const today = isToday(d)
        return (
          <WeekCol key={key}>
            <WeekColHead onClick={() => onCellClick(key)}>
              <WeekColWd>{WEEKDAYS_SHORT[i]}</WeekColWd>
              <WeekColNum $today={today}>{d.getDate()}</WeekColNum>
            </WeekColHead>
            <WeekColBody>
              {dayEvents.length ? (
                dayEvents.map(ev => {
                  const Icon = TIPOS[ev.tipo].icon
                  const time = formatTimeRange(ev)
                  return (
                    <WeekChip
                      key={ev.id}
                      $color={TIPOS[ev.tipo].color}
                      onClick={() => onEventClick(ev)}
                    >
                      <WeekChipIcon $color={TIPOS[ev.tipo].color}>
                        <Icon />
                      </WeekChipIcon>
                      <div>
                        <WeekChipName>{ev.nome}</WeekChipName>
                        <WeekChipType $color={TIPOS[ev.tipo].color}>
                          {time ? `${time} · ${TIPOS[ev.tipo].label}` : TIPOS[ev.tipo].label}
                        </WeekChipType>
                      </div>
                    </WeekChip>
                  )
                })
              ) : (
                <WeekEmpty>Sem eventos</WeekEmpty>
              )}
            </WeekColBody>
          </WeekCol>
        )
      })}
    </WeekGrid>
  )
}

function DayViewPanel({
  date,
  events,
  onEventClick,
}: {
  date: Date
  events: CalendarioEventoRow[]
  onEventClick: (item: CalendarioEventoRow) => void
}) {
  const dayEvents = eventsForDay(events, date)
  return (
    <DayView>
      <DayViewHead>
        <DayViewWeekday>{WEEKDAYS[date.getDay()]}</DayViewWeekday>
        <DayViewDate>{formatDatePt(date)}</DayViewDate>
      </DayViewHead>
      {dayEvents.length === 0 ? (
        <DayEmpty>
          Nenhum evento neste dia.
          <br />
          Clique em &quot;Novo evento&quot; para adicionar.
        </DayEmpty>
      ) : (
        dayEvents.map(ev => {
          const range =
            ev.data_fim && ev.data_fim !== ev.data_inicio
              ? `${formatDatePt(parseKey(ev.data_inicio))} – ${formatDatePt(parseKey(ev.data_fim))}`
              : formatDatePt(parseKey(ev.data_inicio))
          const time = formatTimeRange(ev)
          const Icon = TIPOS[ev.tipo].icon
          return (
            <DayEventCard
              key={ev.id}
              $color={TIPOS[ev.tipo].color}
              onClick={() => onEventClick(ev)}
            >
              <DayEventIconBox $color={TIPOS[ev.tipo].color}>
                <Icon />
              </DayEventIconBox>
              <div style={{ flex: 1 }}>
                <DayEventName>{ev.nome}</DayEventName>
                <DayEventMeta $color={TIPOS[ev.tipo].color}>
                  {TIPOS[ev.tipo].label} · {range}
                  {time ? ` · ${time}` : ''}
                </DayEventMeta>
                {ev.descricao && <DayEventDesc>{ev.descricao}</DayEventDesc>}
              </div>
            </DayEventCard>
          )
        })
      )}
    </DayView>
  )
}
