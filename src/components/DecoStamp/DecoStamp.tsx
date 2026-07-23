import styled, { css } from 'styled-components'

type Position = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

const positions: Record<Position, ReturnType<typeof css>> = {
  'top-right': css`
    top: 40px;
    right: 40px;
  `,
  'top-left': css`
    top: 40px;
    left: 40px;
  `,
  'bottom-right': css`
    bottom: 40px;
    right: 40px;
  `,
  'bottom-left': css`
    bottom: 40px;
    left: 40px;
  `,
}

const Img = styled.img<{ $position: Position }>`
  position: absolute !important;
  width: 400px;
  pointer-events: none;
  z-index: 1;
  opacity: 0.08;
  animation: spin 60s linear infinite;
  ${({ $position }) => positions[$position] ?? positions['top-right']}
`

interface DecoStampProps {
  position?: Position
}

export default function DecoStamp({ position = 'top-right' }: DecoStampProps) {
  return <Img src="/assets/logo-stamp.png" alt="" loading="lazy" $position={position} />
}
