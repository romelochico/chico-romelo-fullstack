import styled from 'styled-components'

const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.11  0 0 0 0 0.10  0 0 0 0 0.05  0 0 0 0.25 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`

// ── Shared paper-noise mixin ─────────────────────────────────
const paperNoise = `
  position: relative;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: ${NOISE};
    opacity: 0.45;
    mix-blend-mode: multiply;
    pointer-events: none;
    z-index: 1;
  }
  & > * { position: relative; z-index: 2; }
`

// ── HERO ────────────────────────────────────────────────────
export const Hero = styled.header`
  position: relative;
  min-height: 100vh;
  background: #1a1c0a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-height: 100svh;
  }
`

export const HeroBg = styled.div`
  position: absolute;
  inset: -30% 0;
  z-index: 0;
  overflow: hidden;
  will-change: transform;

  /* 3-shade brand gradient: sage (top) → olive → deep olive (bottom) */
  background: linear-gradient(148deg, #878766 0%, #404015 55%, #1a1c0a 100%);

  /* halftone dots */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(245, 240, 232, 0.16) 1.5px, transparent 1.5px);
    background-size: 13px 13px;
    z-index: 1;
    pointer-events: none;
  }

  /* diagonal stripes */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      -58deg,
      transparent 0px,
      transparent 32px,
      rgba(245, 240, 232, 0.04) 32px,
      rgba(245, 240, 232, 0.04) 34px
    );
    z-index: 2;
    pointer-events: none;
  }

  /* large watermark marks — positioned via children */
  .bg-mark {
    position: absolute;
    width: clamp(280px, 42vw, 640px);
    height: auto;
    opacity: 0.06;
    filter: brightness(0) invert(1);
    pointer-events: none;
    z-index: 3;
  }
  .bg-mark-tr {
    top: 5%;
    right: -8%;
    transform: rotate(15deg);
  }
  .bg-mark-bl {
    bottom: 5%;
    left: -6%;
    transform: rotate(-10deg);
  }

  /* vignette */
  .bg-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, 0.5) 100%);
    z-index: 4;
    pointer-events: none;
  }
`

export const HeroLockup = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  animation: hero-fade-up 1s cubic-bezier(0.22, 0.61, 0.36, 1) 0.35s both;

  img {
    width: clamp(300px, 58vw, 860px);
    height: auto;
    filter: brightness(0) invert(1);
    opacity: 0.95;
    margin: 0 auto;
    display: block;
    drop-shadow: 0 4px 32px rgba(0, 0, 0, 0.4);
  }

  .logo-full {
    display: block;
  }
  .logo-mobile {
    display: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 24px;

    .logo-full {
      display: none;
    }
    .logo-mobile {
      display: block;
      width: clamp(200px, 72vw, 340px);
      height: auto;
      filter: brightness(0) invert(1);
    }
  }
`

export const HeroCta = styled.button`
  position: absolute;
  bottom: 6vh;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  z-index: 3;
  animation: hero-fade-up 1s cubic-bezier(0.22, 0.61, 0.36, 1) 0.6s both;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.cream};
  letter-spacing: 0.08em;
  font-size: 18px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.75;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: static;
    display: block;
    text-align: center;
    color: ${({ theme }) => theme.colors.cream};
    padding: 16px 0 32px;
    font-size: 16px;
    flex-shrink: 0;
  }
`

// ── BANDA SECTION ─────────────────────────────────────────────
export const BandaSection = styled.section`
  ${paperNoise}
  background: ${({ theme }) => theme.colors.cream};
  padding: 100px 5vw 80px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const BandaInner = styled.div`
  display: flex;
  gap: 80px;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: 30px;
    align-items: flex-start;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    flex-direction: column;
    gap: 24px;
  }
`

export const BandaCopy = styled.div`
  flex: 1.05;
  min-width: 0;
  max-width: 540px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 1;
    max-width: 42%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    max-width: 100%;
    flex: none;
  }
`

export const Kicker = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(57.6px, 7.2vw, 115.2px);
  line-height: 0.88;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  text-align: left;
  margin: 20px 0 ${({ $noMargin }) => ($noMargin ? '0' : '36px')};
  color: ${({ theme }) => theme.colors.charcoal};

  em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.olive};
  }
  .outline {
    -webkit-text-stroke: 2px ${({ theme }) => theme.colors.charcoal};
    color: transparent;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: clamp(38px, 5.5vw, 80px);
    margin-bottom: 14px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    font-size: clamp(34px, 10.5vw, 50px);
    margin-bottom: 12px;
  }
`

export const Lead = styled.p`
  font-size: 21px;
  line-height: 1.45;
  font-weight: 600;
  margin-bottom: 26px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 16px;
    margin-bottom: 14px;
  }
`

export const BodyP = styled.p`
  font-size: 17px;
  line-height: 1.6;
  margin: 0 0 16px;

  b {
    font-weight: 700;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 14px;
    line-height: 1.5;
  }
`

// ── COLLAGE ───────────────────────────────────────────────────
export const Collage = styled.div`
  position: relative;
  height: 580px;
  flex: 1;
  min-width: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 1.3;
    height: 470px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    flex: none;
    width: 100%;
    height: 500px;
  }
`

export const Piece = styled.div`
  position: absolute;
  box-shadow:
    0 12px 30px -10px rgba(0, 0, 0, 0.35),
    0 2px 0 rgba(0, 0, 0, 0.08);
  background: #fff;
  padding: 12px 12px 36px;
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
  animation-duration: 0.8s;
  animation-name: none;
  opacity: 0;

  top: ${({ $top }) => $top ?? 0}px;
  left: ${({ $left }) => $left ?? 0}px;
  width: ${({ $width }) => $width ?? 0}px;
  height: ${({ $height }) => $height ?? 0}px;
  ${({ $zIndex }) => ($zIndex ? `z-index: ${$zIndex};` : '')}
  animation-delay: ${({ $delay }) => $delay ?? '0s'};

  &.revealed {
    animation-name: ${({ $animName }) => $animName ?? 'none'};
  }

  img {
    width: 100%;
    height: calc(100% - 24px);
    object-fit: cover;
    display: block;
    object-position: ${({ $objectPos }) => $objectPos ?? 'center'};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    &.piece-1 {
      top: 40px;
      left: 4px;
      width: 155px;
      height: 138px;
    }
    &.piece-2 {
      top: 0px;
      left: 168px;
      width: 180px;
      height: 162px;
      z-index: 3;
    }
    &.piece-3 {
      top: 180px;
      left: 155px;
      width: 195px;
      height: 162px;
      z-index: 2;
    }
    &.piece-4 {
      top: 170px;
      left: -8px;
      width: 158px;
      height: 178px;
    }
    &.piece-5 {
      top: 355px;
      left: 100px;
      width: 172px;
      height: 124px;
    }
  }
`

export const PieceCap = styled.div`
  position: absolute;
  bottom: 8px;
  left: 12px;
  right: 12px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.charcoal};
  letter-spacing: 0.04em;
`

const Tape = styled.div`
  position: absolute;
  background: ${({ theme }) => theme.colors.tape};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  z-index: 5;
  opacity: 0;
  transition: opacity 0.5s ease 0.8s;
  &.revealed {
    opacity: 0.85;
  }
`

export const CollageT1 = styled(Tape)`
  top: 20px;
  left: 152px;
  width: 100px;
  height: 24px;
  transform: rotate(-45deg);
`
export const CollageT2 = styled(Tape)`
  top: 200px;
  left: 140px;
  width: 90px;
  height: 22px;
  transform: rotate(25deg);
`
export const CollageT3 = styled(Tape)`
  top: 370px;
  right: 20px;
  width: 110px;
  height: 24px;
  transform: rotate(-10deg);
`

export const Stamp = styled.div`
  position: absolute;
  font-family: ${({ theme }) => theme.fonts.mono};
  color: ${({ theme }) => theme.colors.olive};
  border: 2.5px solid ${({ theme }) => theme.colors.olive};
  padding: 6px 12px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 14px;
  background: transparent;
  z-index: 6;
  opacity: 0;
  transition: opacity 0.5s ease 0.9s;
  &.revealed {
    opacity: 1;
  }
`

export const StampOuca = styled(Stamp)`
  top: 6px;
  left: 8px;
  transform: rotate(-3deg);
`
export const StampNovo = styled(Stamp)`
  bottom: 30px;
  left: 450px;
  transform: rotate(3deg);
`

export const ScribbleArrow = styled.div`
  position: absolute;
  z-index: 7;
  opacity: 0;
  transition: opacity 0.5s ease 1s;
  &.revealed {
    opacity: 1;
  }
`

export const ColScribbleArrow = styled(ScribbleArrow)`
  top: 210px;
  left: 14px;
  transform: rotate(-8deg);
`

export const ScribbleText = styled.div`
  position: absolute;
  font-family: ${({ theme }) => theme.fonts.hand};
  color: ${({ theme }) => theme.colors.olive};
  font-size: 30px;
  z-index: 7;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.5s ease 1s;
  &.revealed {
    opacity: 1;
  }
`

export const ColScribbleText = styled(ScribbleText)`
  bottom: 0px;
  right: 30px;
  transform: rotate(-4deg);
`

// ── MÚSICAS SECTION ───────────────────────────────────────────
export const MusicasSection = styled.section`
  ${paperNoise}
  background: ${({ theme }) => theme.colors.cream2};
  padding: 100px 5vw 80px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    padding: 60px 5vw 40px;
  }
`

export const MusicasHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto 48px;
  gap: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 32px;
  }
`

export const MusicasMeta = styled.div`
  text-align: right;
  line-height: 1.5;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.sage};
  max-width: 280px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    text-align: left;
    max-width: none;
    white-space: nowrap;
  }
`

export const MusicasGrid = styled.div`
  display: flex;
  gap: 70px;
  align-items: flex-start;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 50px;
  }
`

export const EpCard = styled.div`
  position: relative;
  flex: 1.1;
  min-width: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: none;
    width: 100%;
  }
`

export const EpCoverWrap = styled.div`
  position: relative;
  aspect-ratio: 1/1;
  background: ${({ theme }) => theme.colors.charcoal};
  box-shadow: 0 24px 40px -20px rgba(0, 0, 0, 0.4);
  transform: rotate(-2deg);
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(0, 0, 0, 0.5) 1px, transparent 1.3px);
    background-size: 5px 5px;
    mix-blend-mode: multiply;
    opacity: 0.2;
    pointer-events: none;
  }
`

export const EpSticker = styled.div`
  position: absolute;
  top: -22px;
  right: -22px;
  width: 130px;
  height: 130px;
  background: ${({ theme }) => theme.colors.olive};
  color: ${({ theme }) => theme.colors.cream};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 28px;
  text-transform: uppercase;
  text-align: center;
  line-height: 0.9;
  transform: rotate(14deg);
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.12);
  z-index: 3;

  span {
    display: block;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 10px;
    letter-spacing: 0.2em;
    margin-top: 4px;
  }
`

export const EpInfo = styled.div`
  flex: 1;
  min-width: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: none;
  }
`

export const EpEyebrow = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sage};
`

export const EpTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(48px, 6vw, 88px);
  line-height: 0.88;
  margin: 0 0 14px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.charcoal};
`

export const EpSub = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sage};
  margin-bottom: 22px;
`

export const StreamingRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 28px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    flex-wrap: nowrap;
    gap: 7px;
    justify-content: center;

    a {
      padding: 8px 12px;
      font-size: 12px;
    }
    a svg {
      width: 16px;
      height: 16px;
    }
  }
`

export const OutrosH = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sage};
  margin: 0 0 18px;
  display: flex;
  align-items: center;
  gap: 12px;

  &::before,
  &::after {
    content: '';
    height: 2px;
    flex: 1;
    background: ${({ theme }) => theme.colors.charcoal};
    opacity: 0.3;
  }
`

export const Outros = styled.div`
  display: flex;
  gap: 14px;
`

export const OutroCard = styled.div`
  position: relative;
  flex: 1;
  aspect-ratio: 1/1;
  background: ${({ theme }) => theme.colors.charcoal};
  box-shadow: 0 8px 18px -10px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s;
  cursor: pointer;
  overflow: hidden;

  &:nth-child(1) {
    transform: rotate(-3deg);
  }
  &:nth-child(2) {
    transform: rotate(2deg);
  }
  &:nth-child(3) {
    transform: rotate(-1.5deg);
  }
  &:hover {
    transform: rotate(0) scale(1.04);
    z-index: 2;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .cap {
    position: absolute;
    bottom: 6px;
    left: 6px;
    background: ${({ theme }) => theme.colors.cream};
    color: ${({ theme }) => theme.colors.charcoal};
    padding: 3px 7px;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
`

// ── NOVIDADES SECTION ─────────────────────────────────────────
export const NovidadesSection = styled.section`
  ${paperNoise}
  background: ${({ theme }) => theme.colors.cream3};
  padding: 120px 5vw;
  overflow: hidden;
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

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
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
