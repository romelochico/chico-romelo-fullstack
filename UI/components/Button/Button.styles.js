import styled, { css } from 'styled-components'

const base = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  border: 2px solid transparent;
  transition:
    transform 0.15s,
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
  line-height: 1;

  &:hover {
    transform: translateY(-2px) rotate(-1.5deg);
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none !important;
  }

  svg {
    flex-shrink: 0;
  }
`

// ── Variants ──────────────────────────────────
const primary = css`
  background: ${({ theme }) => theme.colors.charcoal};
  color: ${({ theme }) => theme.colors.cream};
  border-color: ${({ theme }) => theme.colors.charcoal};

  &:hover {
    background: ${({ theme }) => theme.colors.olive};
    border-color: ${({ theme }) => theme.colors.olive};
  }
`

const secondary = css`
  background: transparent;
  color: ${({ theme }) => theme.colors.charcoal};
  border-color: ${({ theme }) => theme.colors.charcoal};

  &:hover {
    background: ${({ theme }) => theme.colors.charcoal};
    color: ${({ theme }) => theme.colors.cream};
  }
`

const olive = css`
  background: ${({ theme }) => theme.colors.olive};
  color: ${({ theme }) => theme.colors.cream};
  border-color: ${({ theme }) => theme.colors.olive};

  &:hover {
    background: ${({ theme }) => theme.colors.charcoal};
    border-color: ${({ theme }) => theme.colors.charcoal};
  }
`

const ghost = css`
  background: transparent;
  color: ${({ theme }) => theme.colors.cream};
  border-color: rgba(255, 255, 255, 0.5);

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: ${({ theme }) => theme.colors.cream};
  }
`

// ── Sizes ──────────────────────────────────────
const sm = css`
  font-size: 12px;
  padding: 7px 14px;
  border-radius: 999px;
`
const md = css`
  font-size: 14px;
  padding: 10px 18px;
  border-radius: 999px;
`
const lg = css`
  font-size: 16px;
  padding: 14px 28px;
  border-radius: 999px;
`
const square = css`
  padding: 10px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  justify-content: center;
`

export const ButtonBase = styled.button`
  ${base}
  ${({ $variant }) => {
    if ($variant === 'secondary') return secondary
    if ($variant === 'olive') return olive
    if ($variant === 'ghost') return ghost
    return primary
  }}
  ${({ $size }) => {
    if ($size === 'sm') return sm
    if ($size === 'lg') return lg
    if ($size === 'square') return square
    return md
  }}
`
