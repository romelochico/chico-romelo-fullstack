import styled from 'styled-components'

export const PageWrap = styled.div`
  background: ${({ theme }) => theme.colors.cream};
  min-height: 100vh;
`

export const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 5vw 80px;
`

export const ShowBanner = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid rgba(64,64,21,0.1);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 14px;
`

export const ShowBannerName = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 20px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.olive};
  letter-spacing: 0.02em;
`

export const ShowBannerMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.sage};
  margin-top: 2px;
`

export const SectionLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.olive};
  padding-bottom: 8px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.olive};
  margin: 28px 0 14px;
  font-weight: 600;
`

export const Field = styled.div`
  margin-bottom: 16px;
`

export const FieldLabel = styled.label`
  display: block;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.olive};
  margin-bottom: 6px;
  font-weight: 600;
`

export const FieldInput = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid rgba(64,64,21,0.15);
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.charcoal};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  padding: 10px 12px;
  outline: none;
  transition: border-color 0.2s;

  &:focus { border-color: ${({ theme }) => theme.colors.olive}; }
`

export const FieldTextarea = styled.textarea`
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid rgba(64,64,21,0.15);
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.charcoal};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  padding: 10px 12px;
  outline: none;
  resize: vertical;
  min-height: 64px;
  transition: border-color 0.2s;

  &:focus { border-color: ${({ theme }) => theme.colors.olive}; }
`

export const PapelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(165px, 1fr));
  gap: 8px;
`

export const PapelBtn = styled.button`
  padding: 11px 14px;
  border-radius: 8px;
  border: 1.5px solid ${({ $selected, theme }) => $selected ? theme.colors.olive : 'rgba(64,64,21,0.15)'};
  background: ${({ $selected, theme }) => $selected ? theme.colors.olive : theme.colors.white};
  color: ${({ $selected, theme }) => $selected ? theme.colors.cream : theme.colors.charcoal};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  font-weight: 500;

  &:hover { border-color: ${({ theme }) => theme.colors.olive}; }
`

// ── MUSIC CARD ──────────────────────────────────────────────────
export const MusicaCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid rgba(64,64,21,0.1);
  border-radius: 12px;
  margin-bottom: 10px;
  overflow: hidden;
`

export const MusicaCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;

  &:hover { background: ${({ theme }) => theme.colors.cream}; }
`

export const MusicaNum = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.cream};
  background: ${({ theme }) => theme.colors.olive};
  border-radius: 5px;
  padding: 0 8px 1px;
  min-width: 30px;
  text-align: center;
`

export const MusicaName = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.olive};
  flex: 1;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`

export const MusicaChevron = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.sage};
  transition: transform 0.2s;
  ${({ $open }) => $open && 'transform: rotate(180deg);'}
`

export const MusicaBody = styled.div`
  padding: 16px 18px;
  border-top: 1px solid rgba(64,64,21,0.08);
  display: ${({ $open }) => $open ? 'block' : 'none'};
`

export const Cols2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 32px;
  margin-bottom: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-template-columns: 1fr;
  }
`

export const ColTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.olive};
  margin-bottom: 10px;
  padding-bottom: 4px;
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.olive};
  font-weight: 600;
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
  color: ${({ theme }) => theme.colors.charcoal};
  flex: 1;
`

export const BandaMember = styled.div`
  background: ${({ theme }) => theme.colors.cream2};
  border: 1.5px solid rgba(64,64,21,0.1);
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 8px;
`

export const BandaMemberTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.olive};
  margin-bottom: 8px;
  font-weight: 600;
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
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.sage};
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

export const NoteDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $green }) => $green ? '#404015' : '#a33a2a'};
  flex-shrink: 0;
`

export const NoteTextarea = styled.textarea`
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid rgba(64,64,21,0.1);
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.charcoal};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  padding: 7px 10px;
  outline: none;
  resize: vertical;
  min-height: 48px;
  transition: border-color 0.2s;

  &:focus { border-color: ${({ theme }) => theme.colors.olive}; }
`

// ── GENERAL STARS ───────────────────────────────────────────────
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
  color: ${({ theme }) => theme.colors.charcoal};
  flex: 1;
`

// ── SUBMIT ──────────────────────────────────────────────────────
export const SubmitArea = styled.div`
  margin-top: 40px;
  text-align: center;
`

export const SubmitBtn = styled.button`
  background: ${({ theme }) => theme.colors.olive};
  color: ${({ theme }) => theme.colors.cream};
  border: none;
  border-radius: 8px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 600;
  padding: 15px 48px;
  cursor: pointer;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: opacity 0.2s;

  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

export const SuccessBox = styled.div`
  background: rgba(64,64,21,0.06);
  border: 1.5px solid ${({ theme }) => theme.colors.olive};
  border-radius: 10px;
  padding: 32px;
  text-align: center;
  margin-top: 32px;

  h3 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 28px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.olive};
    margin-bottom: 8px;
  }

  p { font-size: 14px; color: ${({ theme }) => theme.colors.charcoal}; }
`

export const Toast = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(${({ $show }) => $show ? '0' : '10px'});
  background: ${({ $error, theme }) => $error ? '#a33a2a' : theme.colors.olive};
  border-radius: 8px;
  padding: 12px 20px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.cream};
  opacity: ${({ $show }) => $show ? 1 : 0};
  transition: all 0.3s;
  pointer-events: none;
  white-space: nowrap;
  z-index: 100;
`
