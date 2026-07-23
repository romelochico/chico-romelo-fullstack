import styled from 'styled-components'

const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.11  0 0 0 0 0.10  0 0 0 0 0.05  0 0 0 0.25 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`
const noise = `
  position: relative;
  &::before { content:''; position:absolute; inset:0; background-image:${NOISE}; opacity:0.45; mix-blend-mode:multiply; pointer-events:none; z-index:1; }
  & > * { position:relative; z-index:2; }
`

export const NewsSection = styled.section`
  ${noise}
  background: ${({ theme }) => theme.colors.cream};
  padding: 100px 5vw;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    padding: 60px 5vw;
  }
`

export const NewsHead = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  border-top: 4px double ${({ theme }) => theme.colors.charcoal};
  border-bottom: 4px double ${({ theme }) => theme.colors.charcoal};
  padding: 14px 0;
  margin: 0 auto 50px;
  max-width: 1400px;

  h2 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(64px, 9vw, 140px);
    line-height: 0.88;
    text-align: center;
    margin: 0;
    flex: 1;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.charcoal};
  }

  .ed {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.sage};
  }

  .ed:last-child {
    text-align: right;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    .ed:last-child {
      text-align: center;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    h2 {
      font-size: clamp(44px, 13vw, 80px);
    }
  }
`

export const NewsGrid = styled.div`
  display: flex;
  gap: 36px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 24px;
  }
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
  transition:
    transform 0.15s,
    background 0.15s;

  &:hover {
    transform: translateY(-2px) rotate(-0.5deg);
    background: ${({ theme }) => theme.colors.cream};
  }
`
