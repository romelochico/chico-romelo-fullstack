import styled from 'styled-components'

export const LabelWrap = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  padding: 6px 14px;
  border: 1.5px solid ${({ $dark, theme }) => ($dark ? theme.colors.cream : theme.colors.charcoal)};
  color: ${({ $dark, theme }) => ($dark ? theme.colors.cream : theme.colors.olive)};
  background: ${({ $dark, theme }) => ($dark ? 'transparent' : theme.colors.cream)};
  transform: rotate(-1.5deg);

  .dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${({ $dark, theme }) => ($dark ? theme.colors.cream : theme.colors.olive)};
    flex-shrink: 0;
  }
`
