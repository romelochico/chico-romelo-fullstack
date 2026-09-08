import styled from 'styled-components'

const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.11  0 0 0 0 0.10  0 0 0 0 0.05  0 0 0 0.25 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`
const noise = `
  position: relative;
  &::before { content:''; position:absolute; inset:0; background-image:${NOISE}; opacity:0.45; mix-blend-mode:multiply; pointer-events:none; z-index:1; }
  & > * { position:relative; z-index:2; }
`

// Gap that doubles as the mobile edge margin — keeps the border margin and the
// spacing between stacked videos identical.
const MOBILE_GAP = '5vw'

export const Section = styled.section`
  ${noise}
  background: ${({ theme }) => theme.colors.cream3};
  padding: 80px 5vw ${({ $flush }) => ($flush ? '0' : '80px')};
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    padding: 60px ${MOBILE_GAP} ${({ $flush }) => ($flush ? '0' : '48px')};
  }
`

export const Inner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`

export const Header = styled.div`
  margin-bottom: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    margin-bottom: 28px;
  }
`

export const Kicker = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(40px, 6vw, 80px);
  line-height: 0.88;
  text-transform: uppercase;
  margin: 16px 0 0;
  color: ${({ theme }) => theme.colors.charcoal};

  .outline {
    -webkit-text-stroke: 2px ${({ theme }) => theme.colors.charcoal};
    color: transparent;
  }
`

export const Meta = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.sage};
  margin: 10px 0 0;
`

export const Player = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 28px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${MOBILE_GAP};
  }
`

export const Stage = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.charcoal};
  border: 3px solid ${({ theme }) => theme.colors.olive};
  box-shadow: 12px 12px 0 ${({ theme }) => theme.colors.olive};

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    box-shadow: 8px 8px 0 ${({ theme }) => theme.colors.olive};
  }
`

export const StageCap = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(20px, 2.6vw, 32px);
  line-height: 1;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.charcoal};
  margin: 20px 0 0;

  span {
    display: block;
    margin-top: 6px;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 12px;
    letter-spacing: 0.04em;
    text-transform: none;
    color: ${({ theme }) => theme.colors.sage};
  }
`

export const SideList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${MOBILE_GAP};
  }
`

export const SideItem = styled.button`
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: 2px solid ${({ theme }) => theme.colors.olive};
  cursor: pointer;
  background: ${({ theme }) => theme.colors.charcoal};
  overflow: hidden;
  aspect-ratio: 16 / 9;
  transition:
    transform 0.15s,
    box-shadow 0.15s;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    opacity: 0.82;
    transition: opacity 0.15s;
  }

  &:hover {
    transform: translateY(-3px) rotate(-1deg);
    box-shadow: 6px 6px 0 ${({ theme }) => theme.colors.olive};
  }

  &:hover img {
    opacity: 1;
  }

  .label {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20px 12px 9px;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 12px;
    letter-spacing: 0.03em;
    color: ${({ theme }) => theme.colors.cream};
    text-align: left;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.75), transparent);
  }
`

export const PlayBadge = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.cream};
  color: ${({ theme }) => theme.colors.charcoal};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin-left: 2px;
  }
`
