import styled from 'styled-components'

const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.11  0 0 0 0 0.10  0 0 0 0 0.05  0 0 0 0.25 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`

const noise = `
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

// ── BIO SECTION ───────────────────────────────────────────────
export const BioSection = styled.section`
  ${noise}
  background: ${({ theme }) => theme.colors.cream};
  padding: 100px 5vw;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    padding: 60px 5vw;
  }
`

export const BioInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 80px;
  align-items: flex-start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 40px;
  }
`

export const BioText = styled.div`
  flex: 1.2;
  min-width: 0;

  .lead {
    font-size: 22px;
    line-height: 1.5;
    font-weight: 600;
    margin: 24px 0 20px;
    color: ${({ theme }) => theme.colors.charcoal};
  }

  p {
    font-size: 17px;
    line-height: 1.7;
    margin: 0 0 18px;
    text-wrap: pretty;
  }
`

export const Kicker = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(52px, 9vw, 140px);
  line-height: 0.88;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  margin: 20px 0 36px;
  color: ${({ theme }) => theme.colors.charcoal};

  em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.olive};
  }
  .outline {
    -webkit-text-stroke: 2px ${({ theme }) => theme.colors.charcoal};
    color: transparent;
  }
`

export const BioPull = styled.div`
  flex: 0.8;
  min-width: 0;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`

export const BioPhotoFrame = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 14px 14px 48px;
  box-shadow:
    0 14px 34px -12px rgba(0, 0, 0, 0.3),
    0 2px 0 rgba(0, 0, 0, 0.06);
  transform: rotate(2.5deg);
  position: relative;

  img {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
    object-position: center 25%;
  }
`

export const BioPhotoCap = styled.div`
  position: absolute;
  bottom: 12px;
  left: 14px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.charcoal};
  letter-spacing: 0.04em;
`

export const BioTape = styled.div`
  position: absolute;
  background: ${({ theme }) => theme.colors.tape};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  z-index: 5;
  opacity: 0.85;
`

export const BioTapeTop = styled(BioTape)`
  top: -8px;
  right: 30px;
  width: 90px;
  height: 22px;
  transform: rotate(-12deg);
`

export const BioTapeBottom = styled(BioTape)`
  bottom: 30px;
  left: -12px;
  width: 80px;
  height: 20px;
  transform: rotate(8deg);
`

export const BioQuoteCard = styled.div`
  background: ${({ theme }) => theme.colors.olive};
  color: ${({ theme }) => theme.colors.cream};
  padding: 28px 24px;
  margin-top: 28px;
  transform: rotate(-1.5deg);
  position: relative;

  &::before {
    content: '✦';
    position: absolute;
    top: -14px;
    left: 16px;
    font-size: 28px;
    color: ${({ theme }) => theme.colors.tape};
  }

  p {
    font-family: ${({ theme }) => theme.fonts.hand};
    font-size: 24px;
    line-height: 1.35;
    margin: 0;
  }

  .attr {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-top: 14px;
    opacity: 0.7;
  }
`

// ── MEMBERS SECTION ───────────────────────────────────────────
export const MembersSection = styled.section`
  ${noise}
  background: ${({ theme }) => theme.colors.cream2};
  padding: 100px 5vw;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    padding: 60px 5vw;
  }
`

export const MembersHeader = styled.div`
  max-width: 1400px;
  min-height: 80px;
  margin: 0 auto 60px;
  display: flex;
  align-items: center;
  gap: 28px;
  border-top: 4px double ${({ theme }) => theme.colors.charcoal};
  border-bottom: 4px double ${({ theme }) => theme.colors.charcoal};
  padding: 14px 0;

  .ed {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.sage};
  }

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

  .ed:last-child {
    text-align: right;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
    h2 {
      flex: none;
    }
    .ed:last-child {
      text-align: center;
    }
  }
`

export const MembersGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-template-columns: repeat(2, 1fr);

    & > *:nth-child(5) {
      grid-column: 1 / -1;
      max-width: 60%;
      margin: 0 auto;
    }
  }
`

// ── LIVE SECTION ──────────────────────────────────────────────
export const LiveSection = styled.section`
  ${noise}
  background: ${({ theme }) => theme.colors.cream3};
  padding: 80px 5vw;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    padding: 60px 5vw;
  }
`

export const LiveInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 60px;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 40px;
  }
`

export const LivePhotos = styled.div`
  flex: 1.3;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-template-columns: 1fr 1fr;
  }
`

export const LivePhoto = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 10px 10px 36px;
  box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.3);
  position: relative;

  &:nth-child(1) {
    transform: rotate(-3deg);
  }
  &:nth-child(2) {
    transform: rotate(2deg);
    grid-row: 1 / 3;
    align-self: center;
  }
  &:nth-child(3) {
    transform: rotate(1.5deg);
  }

  img {
    width: 100%;
    aspect-ratio: 4/5;
    object-fit: cover;
  }

  &:nth-child(2) img {
    aspect-ratio: 1/1;
  }

  .cap {
    position: absolute;
    bottom: 8px;
    left: 10px;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 10px;
    color: ${({ theme }) => theme.colors.charcoal};
    letter-spacing: 0.06em;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    &:nth-child(2) {
      grid-row: auto;
    }
  }
`

export const LiveCopy = styled.div`
  flex: 0.7;
  min-width: 0;

  h3 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(36px, 5vw, 72px);
    line-height: 0.9;
    text-transform: uppercase;
    margin: 16px 0 24px;
    color: ${({ theme }) => theme.colors.charcoal};
  }

  p {
    font-size: 16px;
    line-height: 1.65;
    margin: 0 0 16px;
  }
`

export const VenuesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 24px 0 0;
  border-top: 2px dashed ${({ theme }) => theme.colors.charcoal};

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 4px;
    border-bottom: 2px dashed ${({ theme }) => theme.colors.charcoal};
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 13px;
    letter-spacing: 0.04em;
  }

  .venue-name {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 20px;
    text-transform: uppercase;
  }

  .venue-loc {
    color: ${({ theme }) => theme.colors.sage};
  }
`
