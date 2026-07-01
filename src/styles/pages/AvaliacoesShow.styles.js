import styled from 'styled-components'

export const PageWrap = styled.div`
  background: ${({ theme }) => theme.colors.cream};
  min-height: 100vh;
`

export const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 48px 5vw 80px;
`

export const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sage};
  text-decoration: none;
  margin-bottom: 32px;
  transition: color 0.2s;
  cursor: pointer;

  &:hover { color: ${({ theme }) => theme.colors.olive}; }
`

export const ShowHeader = styled.div`
  margin-bottom: 32px;
`

export const ShowTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(40px, 6vw, 80px);
  line-height: 0.88;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.charcoal};
  letter-spacing: 0.02em;
  margin-bottom: 8px;
`

export const ShowMeta = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.sage};
`

export const AvaliarLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 24px;
  background: ${({ theme }) => theme.colors.olive};
  color: ${({ theme }) => theme.colors.cream};
  border-radius: 6px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  margin-bottom: 40px;
  transition: opacity 0.15s;
  cursor: pointer;

  &:hover { opacity: 0.85; }
`

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
  margin-bottom: 48px;
`

export const SummaryCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid rgba(64,64,21,0.1);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
`

export const SummaryVal = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 36px;
  color: ${({ theme }) => theme.colors.olive};
  line-height: 1;
  margin-bottom: 4px;
`

export const SummaryLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 9px;
  color: ${({ theme }) => theme.colors.sage};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
`

export const SectionLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.olive};
  padding-bottom: 10px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.olive};
  margin: 40px 0 16px;
  font-weight: 600;
`

// ── PER-SONG ────────────────────────────────────────────────────
export const MusicaBlock = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid rgba(64,64,21,0.1);
  border-radius: 12px;
  margin-bottom: 8px;
  overflow: hidden;
`

export const MusicaHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: ${({ theme }) => theme.colors.cream2}; }
`

export const MusicaNum = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.cream};
  background: ${({ theme }) => theme.colors.olive};
  border-radius: 5px;
  padding: 0 8px 1px;
  min-width: 30px;
  text-align: center;
  line-height: 1.5;
`

export const MusicaTitle = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.olive};
  flex: 1;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`

export const MusicaAvg = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.olive};
`

export const MusicaChevron = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.sage};
  transition: transform 0.2s;
  ${({ $open }) => $open && 'transform: rotate(180deg);'}
`

export const MusicaBody = styled.div`
  padding: 16px 20px;
  border-top: 1px solid rgba(64,64,21,0.08);
  display: ${({ $open }) => $open ? 'block' : 'none'};
`

// ── TABLES ──────────────────────────────────────────────────────
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-bottom: 16px;
`

export const Th = styled.th`
  text-align: left;
  padding: 6px 10px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sage};
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.olive};
  font-weight: 600;
`

export const Td = styled.td`
  padding: 8px 10px;
  border-bottom: 1px solid rgba(64,64,21,0.07);
  vertical-align: top;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;

  &:last-child { border-bottom: none; }
`

export const PersonName = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.olive};
`

// ── NOTAS GRID ──────────────────────────────────────────────────
export const NotasGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-template-columns: 1fr;
  }
`

export const NotaColTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.charcoal};
`

export const NotaDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $green }) => $green ? '#404015' : '#a33a2a'};
  flex-shrink: 0;
`

export const NotaItem = styled.div`
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 6px;
  background: ${({ $green }) => $green ? 'rgba(64,64,21,0.06)' : 'rgba(163,58,42,0.06)'};
  border-left: 2px solid ${({ $green }) => $green ? '#404015' : '#a33a2a'};
`

export const NotaAuthor = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.sage};
  margin-top: 3px;
  letter-spacing: 0.04em;
`

// ── COMMENT CARD ────────────────────────────────────────────────
export const CommentCard = styled.div`
  background: ${({ theme }) => theme.colors.cream2};
  border: 1.5px solid rgba(64,64,21,0.1);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 6px;
`

export const CommentAuthor = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.olive};
  margin-bottom: 4px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

export const CommentBody = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.charcoal};
  line-height: 1.5;
`

export const Loading = styled.div`
  text-align: center;
  padding: 60px 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.sage};
`
