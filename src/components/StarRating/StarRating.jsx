import { useState } from 'react'
import styled from 'styled-components'

const Row = styled.div`
  display: flex;
  gap: 2px;
  flex-shrink: 0;
`

const Star = styled.span`
  font-size: ${({ $size }) => $size ?? 18}px;
  color: ${({ $on, theme }) => $on ? theme.colors.olive : '#ccc5b0'};
  cursor: pointer;
  transition: color 0.1s, transform 0.1s;
  line-height: 1;
  padding: 2px;
  user-select: none;

  &:active { transform: scale(1.3); }
`

export default function StarRating({ value = 0, onChange, size }) {
  const [hover, setHover] = useState(0)
  const active = hover || value

  return (
    <Row>
      {[1, 2, 3, 4, 5].map(v => (
        <Star
          key={v}
          $on={v <= active}
          $size={size}
          onClick={() => onChange?.(v)}
          onMouseEnter={() => setHover(v)}
          onMouseLeave={() => setHover(0)}
        >★</Star>
      ))}
    </Row>
  )
}

export function StarsDisplay({ value, size = 14 }) {
  const v = Math.round(Math.max(0, Math.min(5, value || 0)))
  return (
    <Row>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} $on={i <= v} $size={size} style={{ cursor: 'default', padding: 0 }}>★</Star>
      ))}
    </Row>
  )
}
