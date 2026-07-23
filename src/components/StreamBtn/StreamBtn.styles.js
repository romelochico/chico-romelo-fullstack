import styled from 'styled-components'

export const Btn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.charcoal};
  color: ${({ theme }) => theme.colors.cream};
  border: 2px solid ${({ theme }) => theme.colors.charcoal};
  border-radius: 999px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition:
    transform 0.15s,
    background 0.15s;
  text-decoration: none;
  white-space: nowrap;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    transform: translateY(-2px) rotate(-1.5deg);
    background: ${({ theme }) => theme.colors.olive};
    border-color: ${({ theme }) => theme.colors.olive};
  }
`
