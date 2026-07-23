import styled, { css } from 'styled-components'

const displayBase = css`
  font-family: ${({ theme }) => theme.fonts.display};
  text-transform: uppercase;
  letter-spacing: 0.02em;
  line-height: 0.88;
  margin: 0;
`

export const DisplayXL = styled.h1`
  ${displayBase}
  font-size: clamp(72px, 14vw, 180px);
`

export const DisplayLG = styled.h2`
  ${displayBase}
  font-size: clamp(64px, 9vw, 140px);
`

export const DisplayMD = styled.h3`
  ${displayBase}
  font-size: clamp(48px, 7vw, 88px);
`

export const DisplaySM = styled.h4`
  ${displayBase}
  font-size: clamp(36px, 5vw, 64px);
`

export const Heading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(24px, 3vw, 36px);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  line-height: 1;
  margin: 0;
`

export const BodyLG = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 21px;
  font-weight: 600;
  line-height: 1.45;
  margin: 0;
`

export const Body = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: 500;
  line-height: 1.65;
  margin: 0;
`

export const BodySM = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;
  margin: 0;
`

export const Mono = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ $size }) => $size || '13px'};
  letter-spacing: ${({ $spacing }) => $spacing || '0.18em'};
  text-transform: uppercase;
  color: ${({ $muted, theme }) => ($muted ? theme.colors.sage : 'inherit')};
`

export const Hand = styled.span`
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: ${({ $size }) => $size || '22px'};
  color: ${({ $color, theme }) => $color || theme.colors.olive};
`

export const Outline = styled.span`
  -webkit-text-stroke: 2px currentColor;
  color: transparent;
`
