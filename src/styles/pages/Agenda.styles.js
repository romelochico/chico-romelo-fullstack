import styled from 'styled-components'

const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.11  0 0 0 0 0.10  0 0 0 0 0.05  0 0 0 0.25 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`
const noise = `
  position: relative;
  &::before { content:''; position:absolute; inset:0; background-image:${NOISE}; opacity:0.45; mix-blend-mode:multiply; pointer-events:none; z-index:1; }
  & > * { position:relative; z-index:2; }
`

export const AgendaSection = styled.section`
  ${noise}
  background: ${({ theme }) => theme.colors.cream};
  padding: 80px 6vw;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) { padding: 50px 5vw; }
`

export const AgendaHeader = styled.div`
  margin-bottom: 48px;
`

export const Kicker = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(52px, 9vw, 120px);
  line-height: 0.88;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  margin: 20px 0 0;
  color: ${({ theme }) => theme.colors.charcoal};

  .outline { -webkit-text-stroke: 2px ${({ theme }) => theme.colors.charcoal}; color: transparent; }
`

export const ShowList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 860px;

  &.past { opacity: 0.75; }
`

export const CtaStrip = styled.section`
  ${noise}
  padding: 60px 6vw;
  text-align: center;
  background: ${({ theme }) => theme.colors.olive};
`

export const CtaInner = styled.div`
  max-width: 600px;
  margin: 0 auto;

  p {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 24px;
    color: #fff;
    margin-bottom: 24px;
  }
`

export const EmptyShows = styled.p`
  opacity: 0.4;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
`

export const BtnPrimary = styled.a`
  display: inline-block;
  padding: 14px 32px;
  background: #fff;
  color: ${({ theme }) => theme.colors.olive};
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: 2px;
  transition: transform 0.15s, background 0.15s;

  &:hover {
    transform: translateY(-2px) rotate(-0.5deg);
    background: ${({ theme }) => theme.colors.cream};
  }
`
