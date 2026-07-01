import styled from 'styled-components'

const C = {
  text:       '#f5f0e8',
  textDim:    'rgba(245,240,232,0.45)',
  textFaint:  'rgba(245,240,232,0.25)',
  border:     'rgba(255,255,255,0.07)',
  borderHov:  'rgba(255,255,255,0.13)',
  card:       'rgba(255,255,255,0.03)',
  gold:       '#c8a96e',
  red:        '#f87171',
  redBg:      'rgba(248,113,113,0.08)',
  greenBg:    'rgba(64,64,21,0.15)',
}

// ── STATS BAR ───────────────────────────────────────────────────
export const StatsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(255,255,255,0.03);
  border: 1px solid ${C.border};
  border-radius: 10px;
  margin-bottom: 28px;
  overflow: hidden;
`

export const StatItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 20px 16px;
`

export const StatVal = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(28px, 4vw, 42px);
  color: ${C.gold};
  line-height: 1;
`

export const StatLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${C.textDim};
  margin-top: 4px;
`

export const StatDivider = styled.div`
  width: 1px;
  align-self: stretch;
  background: ${C.border};
`

// ── SORT BAR ────────────────────────────────────────────────────
export const SortBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 18px;
`

export const SortBtn = styled.button`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid ${({ $active }) => $active ? 'rgba(200,169,110,0.6)' : 'rgba(255,255,255,0.10)'};
  background: ${({ $active }) => $active ? 'rgba(200,169,110,0.12)' : 'transparent'};
  color: ${({ $active }) => $active ? '#c8a96e' : 'rgba(245,240,232,0.45)'};
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover { border-color: rgba(200,169,110,0.4); color: rgba(245,240,232,0.75); }
`

// ── SECTION HEAD ────────────────────────────────────────────────
export const SectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${C.border};
  padding-bottom: 12px;
  margin-bottom: 20px;
`

export const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(22px, 3vw, 36px);
  line-height: 1;
  text-transform: uppercase;
  color: ${C.text};
  letter-spacing: 0.02em;
`

// ── SHOWS GRID ──────────────────────────────────────────────────
export const ShowsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin-bottom: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-template-columns: 1fr;
  }
`

export const ShowCard = styled.a`
  display: block;
  position: relative;
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 10px;
  padding: 16px 48px 16px 18px;
  text-decoration: none;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: ${C.borderHov};
    background: rgba(255,255,255,0.05);
  }
`

export const ShowName = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 18px;
  color: ${C.text};
  letter-spacing: 0.02em;
  text-transform: uppercase;
  margin-bottom: 3px;
`

export const ShowMeta = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  color: ${C.textDim};
  margin-bottom: 10px;
`

export const ShowBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

export const Badge = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${C.gold};
  background: rgba(200,169,110,0.1);
  border: 1px solid rgba(200,169,110,0.2);
  border-radius: 4px;
  padding: 2px 7px;
`

export const ShowArrow = styled.span`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: ${C.textFaint};
  transition: color 0.15s, right 0.15s;

  ${ShowCard}:hover & {
    color: ${C.gold};
    right: 12px;
  }
`

export const EmptyShows = styled.div`
  padding: 40px 0;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  color: ${C.textDim};
  font-style: italic;
`

// ── CRIAR SHOW FORM ─────────────────────────────────────────────
export const CriarSection = styled.section`
  border-top: 1px solid ${C.border};
  padding-top: 32px;
  margin-top: 8px;
`

export const CriarInner = styled.div`
  max-width: 640px;
`

export const FormTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(22px, 3vw, 34px);
  text-transform: uppercase;
  color: ${C.text};
  margin-bottom: 20px;
  letter-spacing: 0.02em;
`

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-template-columns: 1fr;
  }
`

export const FieldFull = styled.div`
  grid-column: 1 / -1;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

export const FieldLabel = styled.label`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${C.textDim};
`

export const FieldInput = styled.input`
  padding: 10px 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid ${C.border};
  border-radius: 6px;
  color: ${C.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;

  &:focus { border-color: ${C.gold}; }
  &::placeholder { color: ${C.textFaint}; }
`

export const PapeisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 6px;
  margin: 12px 0 20px;
`

export const PapelToggle = styled.button`
  padding: 9px 12px;
  border-radius: 6px;
  border: 1px solid ${({ $on }) => $on ? C.gold : C.border};
  background: ${({ $on }) => $on ? 'rgba(200,169,110,0.12)' : 'transparent'};
  color: ${({ $on }) => $on ? C.gold : C.textDim};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;

  &:hover { border-color: ${C.gold}; color: ${C.gold}; }
`

export const SubmitBtn = styled.button`
  background: ${C.gold};
  color: #0d0d0d;
  border: none;
  border-radius: 6px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 700;
  padding: 11px 28px;
  cursor: pointer;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: opacity 0.2s;

  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

export const ExistingShows = styled.div`
  margin-top: 32px;
  border-top: 1px solid ${C.border};
  padding-top: 20px;
`

export const ExistingCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 8px;
  margin-bottom: 6px;
`

export const ExistingInfo = styled.div`
  flex: 1;
`

export const ExistingName = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 15px;
  color: ${C.text};
  letter-spacing: 0.02em;
`

export const ExistingMeta = styled.div`
  font-size: 11px;
  color: ${C.textDim};
  margin-top: 2px;
`

export const DeleteBtn = styled.button`
  padding: 5px 10px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: 5px;
  border: 1px solid rgba(248,113,113,0.25);
  background: none;
  color: ${C.red};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.body};
  transition: background 0.15s;

  &:hover { background: ${C.redBg}; }
`

export const Toast = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(${({ $show }) => $show ? '0' : '10px'});
  background: ${({ $error }) => $error ? '#7f1d1d' : '#404015'};
  border: 1px solid ${({ $error }) => $error ? 'rgba(248,113,113,0.3)' : 'rgba(200,169,110,0.3)'};
  border-radius: 8px;
  padding: 11px 20px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  color: ${C.text};
  opacity: ${({ $show }) => $show ? 1 : 0};
  transition: all 0.3s;
  pointer-events: none;
  white-space: nowrap;
  z-index: 9999;
`
