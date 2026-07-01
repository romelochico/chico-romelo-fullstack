import styled from 'styled-components'

export const HeroWrapper = styled.header`
  position: relative;
  min-height: 50vh;
  background: ${({ theme }) => theme.colors.black};
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  overflow: hidden;
  padding: 120px 5vw 60px;
`

export const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  animation: hero-fade-photo 1.4s cubic-bezier(0.22,0.61,0.36,1) both;

  picture {
    display: block;
    width: 100%;
    height: 100%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: ${({ $imagePos }) => $imagePos || 'center 30%'};
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0,0,0,0.4) 0%,
      rgba(0,0,0,0.15) 40%,
      rgba(0,0,0,0.6) 100%
    );
    pointer-events: none;
  }
`

export const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  animation: hero-fade-up 1s cubic-bezier(0.22,0.61,0.36,1) 0.35s both;
`

export const HeroLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.cream};
  padding: 6px 14px;
  border: 1.5px solid rgba(255,255,255,0.5);
  background: rgba(0,0,0,0.2);
  transform: rotate(-1.5deg);
  margin-bottom: 16px;

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.tape};
    display: inline-block;
  }
`

export const HeroH1 = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(72px, 14vw, 180px);
  line-height: 0.88;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.cream};
  margin: 0;

  .outline {
    -webkit-text-stroke: 2px ${({ theme }) => theme.colors.cream};
    color: transparent;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    font-size: clamp(48px, 13vw, 80px);
  }
`
