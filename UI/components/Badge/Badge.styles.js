import styled, { css } from 'styled-components'

export const BadgeBase = styled.span`
  display: inline-flex;
  align-items: center;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 4px 10px;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'olive':
        return css`
          background: ${theme.colors.olive};
          color: ${theme.colors.cream};
        `
      case 'cream':
        return css`
          background: ${theme.colors.cream};
          color: ${theme.colors.charcoal};
          border: 1.5px solid ${theme.colors.charcoal};
        `
      case 'tag':
        return css`
          background: ${theme.colors.cream2};
          color: ${theme.colors.olive};
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 3px;
          font-size: 11px;
          font-weight: 700;
        `
      case 'success':
        return css`
          background: #2d6a2d;
          color: #fff;
          border-radius: 3px;
          font-size: 11px;
          font-weight: 700;
        `
      default: // 'dark'
        return css`
          background: ${theme.colors.charcoal};
          color: ${theme.colors.cream};
        `
    }
  }}

  ${({ $rotate }) => $rotate && css`transform: rotate(${$rotate});`}
`
