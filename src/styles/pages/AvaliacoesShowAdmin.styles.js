import styled from 'styled-components'

const C = {
  text:       '#f5f0e8',
  textDim:    'rgba(245,240,232,0.45)',
  textFaint:  'rgba(245,240,232,0.2)',
  border:     'rgba(255,255,255,0.07)',
  borderHov:  'rgba(255,255,255,0.13)',
  card:       'rgba(255,255,255,0.03)',
  gold:       '#c8a96e',
  red:        '#f87171',
  green:      '#86efac',
}

export const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${C.textDim};
  text-decoration: none;
  margin-bottom: 24px;
  transition: color 0.2s;
  cursor: pointer;

  &:hover { color: ${C.text}; }
`

export const AvaliarLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  background: ${C.gold};
  color: #0d0d0d;
  border-radius: 6px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  margin-bottom: 32px;
  transition: opacity 0.15s;
  cursor: pointer;

  &:hover { opacity: 0.85; }
`

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  margin-bottom: 36px;
`

export const SummaryCard = styled.div`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 10px;
  padding: 14px 12px;
  text-align: center;
`

export const SummaryVal = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 32px;
  color: ${C.gold};
  line-height: 1;
  margin-bottom: 4px;
`

export const SummaryLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 9px;
  color: ${C.textDim};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
`

export const SectionLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${C.textDim};
  padding-bottom: 8px;
  border-bottom: 1px solid ${C.border};
  margin: 32px 0 14px;
  font-weight: 700;
`

// ── PER-SONG ────────────────────────────────────────────────────
export const MusicaBlock = styled.div`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 10px;
  margin-bottom: 6px;
  overflow: hidden;
`

export const MusicaHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 18px;
  cursor: pointer;
  transition: background 0.15s;
  user-select: none;

  &:hover { background: rgba(255,255,255,0.03); }
`

export const MusicaNum = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 13px;
  color: #0d0d0d;
  background: ${C.gold};
  border-radius: 4px;
  padding: 0 7px 1px;
  min-width: 28px;
  text-align: center;
  line-height: 1.6;
`

export const MusicaTitle = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 16px;
  color: ${C.text};
  flex: 1;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`

export const MusicaAvg = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  font-weight: 600;
  color: ${C.gold};
`

export const MusicaChevron = styled.span`
  font-size: 10px;
  color: ${C.textFaint};
  transition: transform 0.2s;
  ${({ $open }) => $open && 'transform: rotate(180deg);'}
`

export const MusicaBody = styled.div`
  padding: 14px 18px;
  border-top: 1px solid ${C.border};
  display: ${({ $open }) => $open ? 'block' : 'none'};
`

// ── TABLES ──────────────────────────────────────────────────────
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-bottom: 14px;
`

export const Th = styled.th`
  text-align: left;
  padding: 6px 10px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${C.textDim};
  border-bottom: 1px solid ${C.border};
  font-weight: 700;
`

export const Td = styled.td`
  padding: 8px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  vertical-align: top;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  color: ${C.text};

  &:last-child { border-bottom: none; }
`

export const PersonName = styled.span`
  font-weight: 700;
  color: ${C.gold};
`

// ── NOTAS GRID ──────────────────────────────────────────────────
export const NotasGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-template-columns: 1fr;
  }
`

export const NotaColTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  color: ${C.textDim};
`

export const NotaDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $green }) => $green ? C.green : C.red};
  flex-shrink: 0;
`

export const NotaItem = styled.div`
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 6px;
  color: ${C.text};
  background: ${({ $green }) => $green ? 'rgba(134,239,172,0.05)' : 'rgba(248,113,113,0.05)'};
  border-left: 2px solid ${({ $green }) => $green ? C.green : C.red};
`

export const NotaAuthor = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 10px;
  color: ${C.textDim};
  margin-top: 3px;
  letter-spacing: 0.04em;
`

// ── COMMENT CARD ────────────────────────────────────────────────
export const CommentCard = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid ${C.border};
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 6px;
`

export const CommentAuthor = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 10px;
  font-weight: 700;
  color: ${C.gold};
  margin-bottom: 4px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

export const CommentBody = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  color: ${C.text};
  line-height: 1.5;
`

export const Loading = styled.div`
  text-align: center;
  padding: 48px 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  color: ${C.textDim};
`
