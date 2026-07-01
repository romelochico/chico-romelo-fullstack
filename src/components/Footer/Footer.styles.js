import styled from 'styled-components'

const NOISE_LIGHT = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.11  0 0 0 0 0.10  0 0 0 0 0.05  0 0 0 0.25 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`
const NOISE_DARK  = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 0.8  0 0 0 0.38 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`

export const FooterEl = styled.footer`
  background: ${({ theme }) => theme.colors.olive};
  color: ${({ theme }) => theme.colors.cream};
  padding: 70px 5vw 30px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: ${NOISE_DARK};
    mix-blend-mode: overlay;
    opacity: 1;
    pointer-events: none;
    z-index: 1;
  }
  & > * { position: relative; z-index: 2; }
`

export const FooterGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  border-bottom: 1.5px solid rgba(255,255,255,0.15);
  padding-bottom: 30px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 25px;
  }
`

export const FooterSocials = styled.div`
  display: flex;
  gap: 14px;
  flex: 1;
`

export const SocBtn = styled.a`
  width: 38px;
  height: 38px;
  border: 1.5px solid ${({ theme }) => theme.colors.cream};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.cream};
    color: ${({ theme }) => theme.colors.olive};
  }
`

export const FooterLogoImg = styled.img`
  height: 36px;
  width: auto;
  filter: brightness(0) invert(1);
  opacity: 0.95;
`

export const FooterLogoMobile = styled.div`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: flex;
  }
`

export const FooterLogoFull = styled.div`
  display: flex;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`

export const FooterLinks = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  align-items: flex-end;
  font-size: 14px;
  font-weight: 500;

  a { opacity: 0.9; transition: opacity 0.2s; }
  a:hover { opacity: 1; }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 14px 22px;
    align-items: center;
    justify-content: center;
  }
`

export const FooterBottom = styled.p`
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-top: 22px;
  margin-bottom: 0;
`
