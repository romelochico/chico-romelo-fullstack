import styled from 'styled-components'

export const Item = styled.li`
  display: flex;
  align-items: center;
  padding: 12px 4px;
  border-bottom: 2px dashed ${({ theme }) => theme.colors.charcoal};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  letter-spacing: 0.04em;
  list-style: none;
  cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'default'};
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: ${({ $clickable, theme }) => $clickable ? theme.colors.sageFade : 'transparent'};
    transform: ${({ $clickable }) => $clickable ? 'translateX(4px)' : 'none'};
  }
`

export const Num = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 22px;
  color: ${({ theme }) => theme.colors.sage};
  width: 40px;
  flex-shrink: 0;
`

export const Name = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 22px;
  text-transform: uppercase;
  flex: 1;
`

export const Tag = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: ${({ theme }) => theme.colors.olive};
  color: ${({ theme }) => theme.colors.cream};
  padding: 2px 6px;
  margin-left: 8px;
`

export const Duration = styled.span`
  color: ${({ theme }) => theme.colors.sage};
  flex-shrink: 0;
`

export const ListEl = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 2px dashed ${({ theme }) => theme.colors.charcoal};
`
