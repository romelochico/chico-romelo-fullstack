import styled from 'styled-components'

export const List = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
  border-top: 2px dashed ${({ theme }) => theme.colors.charcoal};
  width: 100%;
`

export const TrackItem = styled.li`
  display: flex;
  align-items: center;
  padding: 12px 4px;
  border-bottom: 2px dashed ${({ theme }) => theme.colors.charcoal};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  letter-spacing: 0.04em;
  transition:
    background 0.2s,
    transform 0.2s;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.sageFade};
    transform: translateX(4px);
  }
`

export const Num = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 22px;
  color: ${({ theme }) => theme.colors.sage};
  width: 40px;
  flex-shrink: 0;
`

export const TrackName = styled.span`
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

export const Dur = styled.span`
  color: ${({ theme }) => theme.colors.sage};
`
