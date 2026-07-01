import styled, { css } from 'styled-components'

export const MarqueeWrapper = styled.div`
  background: ${({ $alt, theme }) => $alt ? theme.colors.charcoal : theme.colors.olive};
  color: ${({ theme }) => theme.colors.cream};
  border-top: ${({ $alt }) => $alt ? 'none' : '2px solid #000'};
  border-bottom: 2px solid #000;
  overflow: hidden;
  padding: 14px 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 36px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    font-size: 26px;
  }
`

export const Track = styled.div`
  display: inline-block;
  animation: marquee 28s linear infinite;
  animation-direction: ${({ $reverse }) => $reverse ? 'reverse' : 'normal'};
  padding-left: 100%;
`

export const Dot = styled.span`
  color: ${({ theme }) => theme.colors.sage};
  margin: 0 24px;
`

export const Star = styled.span`
  color: ${({ theme }) => theme.colors.tape};
  margin: 0 24px;
`
