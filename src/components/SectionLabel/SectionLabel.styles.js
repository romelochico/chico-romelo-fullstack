import styled from 'styled-components'

export const Label = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.olive};
  padding: 6px 14px;
  border: 1.5px solid ${({ theme }) => theme.colors.charcoal};
  background: ${({ theme }) => theme.colors.cream};
  transform: rotate(-1.5deg);
  margin-bottom: 16px;

  .dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.olive};
  }
`
