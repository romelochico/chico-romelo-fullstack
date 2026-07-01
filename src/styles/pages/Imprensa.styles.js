import styled from 'styled-components'

const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.11  0 0 0 0 0.10  0 0 0 0 0.05  0 0 0 0.25 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`
const noise = `
  position: relative;
  &::before { content:''; position:absolute; inset:0; background-image:${NOISE}; opacity:0.45; mix-blend-mode:multiply; pointer-events:none; z-index:1; }
  & > * { position:relative; z-index:2; }
`

// ── PRESS INTRO ───────────────────────────────────────────────
export const PressIntro = styled.section`
  ${noise}
  background: ${({ theme }) => theme.colors.cream};
  padding: 100px 5vw;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) { padding: 60px 5vw; }
`

export const PressIntroInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 80px;
  align-items: flex-start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) { flex-direction: column; gap: 40px; }
`

export const PressBio = styled.div`
  flex: 1.2; min-width: 0;

  .lead { font-size: 22px; line-height: 1.5; font-weight: 600; margin: 24px 0 20px; }
  p { font-size: 16px; line-height: 1.7; margin: 0 0 16px; text-wrap: pretty; }
`

export const Kicker = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(52px, 9vw, 140px); line-height: 0.88;
  letter-spacing: 0.02em; text-transform: uppercase;
  margin: 20px 0 36px; color: ${({ theme }) => theme.colors.charcoal};

  .outline { -webkit-text-stroke: 2px ${({ theme }) => theme.colors.charcoal}; color: transparent; }
`

export const KickerLogos = styled(Kicker)`
  font-size: clamp(40px, 6vw, 80px);
  margin: 16px 0 0;
`

export const LogoStampImg = styled.img`
  height: 70px;
`

export const PressSidebar = styled.div`
  flex: 0.6; min-width: 0;
`

export const PressFactCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 28px 24px;
  box-shadow: 0 8px 20px -8px rgba(0,0,0,.2);
  transform: rotate(1.5deg);
  margin-bottom: 24px;

  h4 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 20px; text-transform: uppercase;
    margin: 0 0 16px; letter-spacing: 0.02em;
  }
`

export const FactRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.sage};
  font-size: 14px;
  &:last-child { border-bottom: none; }
`

export const FactLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sage};
`

export const FactValue = styled.span`
  font-weight: 600; text-align: right;
`

export const PressDownloadCard = styled.div`
  background: ${({ theme }) => theme.colors.olive};
  color: ${({ theme }) => theme.colors.cream};
  padding: 28px 24px;
  transform: rotate(-1deg);
  position: relative;

  &::before { content: '✦'; position: absolute; top: -14px; right: 16px; font-size: 28px; color: ${({ theme }) => theme.colors.tape}; }

  h4 { font-family: ${({ theme }) => theme.fonts.display}; font-size: 20px; text-transform: uppercase; margin: 0 0 8px; }
  p  { font-size: 13px; line-height: 1.5; opacity: 0.8; margin: 0 0 16px; }
`

export const DownloadBtn = styled.a`
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 18px;
  background: ${({ theme }) => theme.colors.cream};
  color: ${({ theme }) => theme.colors.olive};
  border-radius: 999px;
  font-family: ${({ theme }) => theme.fonts.body}; font-weight: 600; font-size: 13px;
  cursor: pointer; transition: transform 0.15s;

  svg { width: 16px; height: 16px; }
  &:hover { transform: translateY(-2px) rotate(-1.5deg); }
`

// ── PHOTOS SECTION ────────────────────────────────────────────
export const PhotosSection = styled.section`
  ${noise}
  background: ${({ theme }) => theme.colors.cream2};
  padding: 100px 5vw;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) { padding: 60px 5vw; }
`

export const PhotosHeader = styled.div`
  max-width: 1400px;
  margin: 0 auto 50px;
  display: flex; align-items: center;
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

export const PhotosGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: ${({ theme }) => theme.breakpoints.small}) { grid-template-columns: 1fr; }
`

export const PressPhoto = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.white};
  padding: 10px 10px 40px;
  box-shadow: 0 8px 20px -8px rgba(0,0,0,.25);
  transition: transform 0.3s cubic-bezier(0.22,0.61,0.36,1);
  cursor: pointer;

  &:nth-child(1) { transform: rotate(-2deg); }
  &:nth-child(2) { transform: rotate(1.5deg); }
  &:nth-child(3) { transform: rotate(-1deg); }
  &:nth-child(4) { transform: rotate(2deg); }
  &:nth-child(5) { transform: rotate(-1.5deg); }
  &:nth-child(6) { transform: rotate(0.8deg); }
  &:hover { transform: rotate(0) scale(1.03); z-index: 3; }

  img { width: 100%; aspect-ratio: 4/3; object-fit: cover; }

  .cap {
    position: absolute; bottom: 10px; left: 10px;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 10px; letter-spacing: 0.08em; color: ${({ theme }) => theme.colors.charcoal};
  }
`

export const DlBadge = styled.a`
  position: absolute; top: -8px; right: 8px;
  background: ${({ theme }) => theme.colors.olive}; color: ${({ theme }) => theme.colors.cream};
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transform: rotate(6deg); z-index: 2; cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;

  svg { width: 14px; height: 14px; }
  &:hover { transform: rotate(6deg) scale(1.15); background: ${({ theme }) => theme.colors.charcoal}; }
`

// ── VIDEO SECTION ─────────────────────────────────────────────
export const VideoSection = styled.section`
  ${noise}
  background: ${({ theme }) => theme.colors.cream3};
  padding: 80px 5vw;
  overflow: hidden;
`

export const VideoInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`

export const VideoHeader = styled.div`
  margin-bottom: 40px;
`

export const VideoSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px; letter-spacing: 0.04em; color: ${({ theme }) => theme.colors.sage};
  margin: 8px 0 0;
`

export const VideoKicker = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(40px, 6vw, 80px); line-height: 0.88;
  text-transform: uppercase; margin: 16px 0 0; color: ${({ theme }) => theme.colors.charcoal};

  .outline { -webkit-text-stroke: 2px ${({ theme }) => theme.colors.charcoal}; color: transparent; }
`

export const VideoWrap = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;

  iframe {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    border: 0;
  }
`

// ── LOGOS SECTION ─────────────────────────────────────────────
export const LogosSection = styled.section`
  ${noise}
  background: ${({ theme }) => theme.colors.cream};
  padding: 80px 5vw;
  overflow: hidden;
`

export const LogosInner = styled.div`
  max-width: 1400px; margin: 0 auto;
`

export const LogosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin-top: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: ${({ theme }) => theme.breakpoints.small}) { grid-template-columns: 1fr; }
`

export const LogoCard = styled.div`
  background: ${({ $dark, $olive, theme }) =>
    $dark ? theme.colors.charcoal : $olive ? theme.colors.olive : theme.colors.white};
  color: ${({ $dark, $olive, theme }) => ($dark || $olive) ? theme.colors.cream : 'inherit'};
  padding: 40px 30px;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
  box-shadow: 0 6px 16px -8px rgba(0,0,0,.18);
  transition: transform 0.2s;

  &:hover { transform: translateY(-4px); }

  img {
    height: 50px; width: auto; object-fit: contain;
    ${({ $dark, $olive }) => ($dark || $olive) ? 'filter: brightness(0) invert(1);' : ''}
  }

  span {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.6;
  }
`
