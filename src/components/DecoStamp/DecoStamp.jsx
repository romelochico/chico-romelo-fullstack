import styled, { css } from 'styled-components'

const positions = {
  'top-right':    css`top: 40px; right: 40px;`,
  'top-left':     css`top: 40px; left: 40px;`,
  'bottom-right': css`bottom: 40px; right: 40px;`,
  'bottom-left':  css`bottom: 40px; left: 40px;`,
}

const Img = styled.img`
  position: absolute !important;
  width: 400px;
  pointer-events: none;
  z-index: 1;
  opacity: 0.08;
  animation: spin 60s linear infinite;
  ${({ $position }) => positions[$position] ?? positions['top-right']}
`

export default function DecoStamp({ position = 'top-right' }) {
  return (
    <Img
      src="/assets/logo-stamp.png"
      alt=""
      loading="lazy"
      $position={position}
    />
  )
}
