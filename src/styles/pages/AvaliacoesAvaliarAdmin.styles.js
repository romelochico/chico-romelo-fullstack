import styled from 'styled-components'

const C = {
  text:      '#f5f0e8',
  textDim:   'rgba(245,240,232,0.45)',
  textFaint: 'rgba(245,240,232,0.2)',
  border:    'rgba(255,255,255,0.07)',
  card:      'rgba(255,255,255,0.03)',
  gold:      '#c8a96e',
  red:       '#f87171',
  green:     '#86efac',
}

export const SectionLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${C.textDim};
  padding-bottom: 8px;
  border-bottom: 1px solid ${C.border};
  margin: 24px 0 14px;
  font-weight: 700;
`

export const Field = styled.div`
  margin-bottom: 14px;
`

export const FieldLabel = styled.label`
  display: block;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${C.textDim};
  margin-bottom: 6px;
`

export const FieldInput = styled.input`
  width: 100%;
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

export const FieldTextarea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid ${C.border};
  border-radius: 6px;
  color: ${C.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 64px;
  transition: border-color 0.15s;

  &:focus { border-color: ${C.gold}; }
  &::placeholder { color: ${C.textFaint}; }
`

export const PapelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 6px;
`

export const PapelBtn = styled.button`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid ${({ $selected }) => $selected ? C.gold : C.border};
  background: ${({ $selected }) => $selected ? 'rgba(200,169,110,0.12)' : 'transparent'};
  color: ${({ $selected }) => $selected ? C.gold : C.textDim};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  font-weight: 500;

  &:hover { border-color: ${C.gold}; color: ${C.gold}; }
`

// ── MUSIC CARD ──────────────────────────────────────────────────
export const MusicaCard = styled.div`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 10px;
  margin-bottom: 6px;
  overflow: hidden;
`

export const MusicaCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;

  &:hover { background: rgba(255,255,255,0.03); }
`

export const MusicaNum = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 13px;
  color: #0d0d0d;
  background: ${C.gold};
  border-radius: 4px;
  padding: 0 7px 1px;
  min-width: 26px;
  text-align: center;
  line-height: 1.6;
`

export const MusicaName = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 16px;
  color: ${C.text};
  flex: 1;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`

export const MusicaChevron = styled.span`
  font-size: 10px;
  color: ${C.textFaint};
  transition: transform 0.2s;
  ${({ $open }) => $open && 'transform: rotate(180deg);'}
`

export const MusicaBody = styled.div`
  padding: 14px 16px;
  border-top: 1px solid ${C.border};
  display: ${({ $open }) => $open ? 'block' : 'none'};
`

export const Cols2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 28px;
  margin-bottom: 10px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-template-columns: 1fr;
  }
`

export const ColTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${C.textDim};
  margin-bottom: 10px;
  padding-bottom: 4px;
  border-bottom: 1px solid ${C.border};
  font-weight: 700;
`

export const StarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`

export const StarLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  color: ${C.text};
  flex: 1;
`

export const BandaMember = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid ${C.border};
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 6px;
`

export const BandaMemberTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${C.gold};
  margin-bottom: 8px;
  font-weight: 700;
`

export const MusicNotes = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-template-columns: 1fr;
  }
`

export const NoteBlock = styled.div``

export const NoteLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 10px;
  font-weight: 700;
  color: ${C.textDim};
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

export const NoteDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $green }) => $green ? C.green : C.red};
  flex-shrink: 0;
`

export const NoteTextarea = styled.textarea`
  width: 100%;
  background: rgba(255,255,255,0.03);
  border: 1px solid ${C.border};
  border-radius: 5px;
  color: ${C.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  padding: 7px 10px;
  outline: none;
  resize: vertical;
  min-height: 48px;
  transition: border-color 0.15s;

  &:focus { border-color: ${C.gold}; }
  &::placeholder { color: ${C.textFaint}; }
`

// ── GENERAL ─────────────────────────────────────────────────────
export const GeneralBlock = styled.div`
  margin-bottom: 8px;
`

export const NotaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`

export const NotaLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 600;
  color: ${C.text};
  flex: 1;
`

// ── SUBMIT ──────────────────────────────────────────────────────
export const SubmitArea = styled.div`
  margin-top: 36px;
  padding-top: 24px;
  border-top: 1px solid ${C.border};
`

export const SubmitBtn = styled.button`
  background: ${C.gold};
  color: #0d0d0d;
  border: none;
  border-radius: 6px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 700;
  padding: 13px 40px;
  cursor: pointer;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: opacity 0.2s;

  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

export const SuccessBox = styled.div`
  background: rgba(134,239,172,0.05);
  border: 1px solid rgba(134,239,172,0.2);
  border-radius: 10px;
  padding: 32px;
  text-align: center;
  margin-top: 24px;

  h3 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 28px;
    text-transform: uppercase;
    color: ${C.green};
    margin-bottom: 8px;
  }

  p { font-size: 14px; color: ${C.textDim}; }
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
