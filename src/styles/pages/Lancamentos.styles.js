import styled from 'styled-components'

const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.11  0 0 0 0 0.10  0 0 0 0 0.05  0 0 0 0.25 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`
const noise = `
  position: relative;
  &::before { content:''; position:absolute; inset:0; background-image:${NOISE}; opacity:0.45; mix-blend-mode:multiply; pointer-events:none; z-index:1; }
  & > * { position:relative; z-index:2; }
`

// ── EP SECTION ────────────────────────────────────────────────
export const EpSection = styled.section`
  ${noise}
  background: ${({ theme }) => theme.colors.cream};
  padding: 100px 5vw;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) { padding: 60px 5vw; }
`

export const EpInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 70px;
  align-items: flex-start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 50px;
    align-items: center;
  }
`

export const EpCoverWrap = styled.div`
  flex: 1.1;
  min-width: 0;
  position: relative;
  cursor: pointer;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) { flex: none; width: 100%; }
`

export const EpCover = styled.div`
  position: relative;
  aspect-ratio: 1/1;
  background: ${({ theme }) => theme.colors.charcoal};
  box-shadow: 0 24px 40px -20px rgba(0,0,0,.4);
  transform: rotate(-2deg);

  img { width: 100%; height: 100%; object-fit: cover; display: block; }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(0,0,0,.5) 1px, transparent 1.3px);
    background-size: 5px 5px;
    mix-blend-mode: multiply;
    opacity: 0.2;
    pointer-events: none;
  }
`

export const EpSticker = styled.div`
  position: absolute; top: -22px; right: -22px;
  width: 130px; height: 130px;
  background: ${({ theme }) => theme.colors.olive};
  color: ${({ theme }) => theme.colors.cream};
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center; flex-direction: column;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 28px; text-transform: uppercase; text-align: center; line-height: 0.9;
  transform: rotate(14deg);
  box-shadow: 0 8px 0 rgba(0,0,0,.12);
  z-index: 3;

  span { display: block; font-family: ${({ theme }) => theme.fonts.mono}; font-size: 10px; letter-spacing: 0.2em; margin-top: 4px; }
`

export const EpDetail = styled.div`
  flex: 1; min-width: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: none;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

export const EpEyebrow = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono}; font-size: 13px; letter-spacing: 0.18em;
  text-transform: uppercase; color: ${({ theme }) => theme.colors.sage}; margin-top: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) { text-align: center; }
`

export const EpTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(48px, 6vw, 88px); line-height: 0.88;
  margin: 10px 0 14px; text-transform: uppercase; color: ${({ theme }) => theme.colors.charcoal};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) { text-align: center; }
`

export const EpSub = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono}; font-size: 13px; letter-spacing: 0.18em;
  text-transform: uppercase; color: ${({ theme }) => theme.colors.sage}; margin-bottom: 22px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) { text-align: center; }
`

export const StreamingRow = styled.div`
  display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: center;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    flex-wrap: nowrap; gap: 7px;
    a { padding: 8px 12px; font-size: 12px; }
  }
`

// ── SINGLES SECTION ───────────────────────────────────────────
export const SinglesSection = styled.section`
  ${noise}
  background: ${({ theme }) => theme.colors.cream2};
  padding: 100px 5vw;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) { padding: 60px 5vw; }
`

export const SinglesHeader = styled.div`
  max-width: 1400px;
  margin: 0 auto 60px;
  display: flex; align-items: center; justify-content: space-between;
  border-top: 4px double ${({ theme }) => theme.colors.charcoal};
  border-bottom: 4px double ${({ theme }) => theme.colors.charcoal};
  padding: 14px 0;

  .ed { font-family: ${({ theme }) => theme.fonts.mono}; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: ${({ theme }) => theme.colors.sage}; }

  h2 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(48px, 8vw, 120px); line-height: 0.88;
    text-align: center; margin: 0; flex: 1; text-transform: uppercase; color: ${({ theme }) => theme.colors.charcoal};
  }

  .ed:last-child { text-align: right; }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    flex-direction: column; align-items: center; text-align: center; gap: 8px;
    h2 { flex: none; }
    .ed:last-child { text-align: center; }
  }
`

export const SinglesGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 36px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr); gap: 24px;
    & > *:nth-child(3) { grid-column: 1 / -1; max-width: 50%; margin: 0 auto; }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-template-columns: 1fr;
    & > *:nth-child(3) { max-width: 100%; }
  }
`

export const SingleCard = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.white};
  padding: 16px 16px 0;
  box-shadow: 0 12px 28px -10px rgba(0,0,0,.25);
  transition: transform 0.3s cubic-bezier(0.22,0.61,0.36,1);
  cursor: pointer;

  &:nth-child(1) { transform: rotate(-2deg); }
  &:nth-child(2) { transform: rotate(1.5deg); }
  &:nth-child(3) { transform: rotate(-1deg); }
  &:hover { transform: rotate(0deg) scale(1.03); z-index: 2; }

  img { width: 100%; aspect-ratio: 1/1; object-fit: cover; display: block; }
`

export const SingleStrap = styled.div`
  position: absolute; top: -10px; right: 16px;
  background: ${({ theme }) => theme.colors.olive}; color: ${({ theme }) => theme.colors.cream};
  padding: 4px 10px;
  font-family: ${({ theme }) => theme.fonts.mono}; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
  transform: rotate(4deg);
`

export const SingleInfo = styled.div`
  padding: 16px 4px 20px;
`

export const SingleName = styled.div`
  font-family: ${({ theme }) => theme.fonts.display}; font-size: 28px;
  text-transform: uppercase; line-height: 0.95; margin-bottom: 8px;
`

export const SingleMeta = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono}; font-size: 11px; letter-spacing: 0.15em;
  text-transform: uppercase; color: ${({ theme }) => theme.colors.sage}; margin-bottom: 14px;
`

export const SingleLinks = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap;

  a {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px;
    background: ${({ theme }) => theme.colors.charcoal}; color: ${({ theme }) => theme.colors.cream};
    border-radius: 999px;
    font-family: ${({ theme }) => theme.fonts.body}; font-weight: 600; font-size: 11px;
    transition: transform 0.15s, background 0.15s;

    svg { width: 14px; height: 14px; flex-shrink: 0; }

    &:hover { transform: translateY(-2px); background: ${({ theme }) => theme.colors.olive}; }
  }
`
