import styled, { css } from 'styled-components'

export const CardRow = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr auto;
  align-items: center;
  gap: 32px;
  padding: 28px 0;
  border-bottom: 1px solid rgba(0,0,0,0.1);

  &:first-child { border-top: 1px solid rgba(0,0,0,0.1); }

  ${({ $past }) => $past && css`opacity: 0.55;`}

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-template-columns: 70px 1fr;
    gap: 16px;
  }
`

export const DateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ $past, theme }) => $past ? '#999' : theme.colors.olive};
  color: #fff;
  border-radius: 4px;
  padding: 12px 8px;
  text-align: center;
  min-width: 72px;
`

export const Day = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 32px;
  line-height: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    font-size: 24px;
  }
`

export const Month = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 2px;
`

export const Year = styled.span`
  font-size: 10px;
  opacity: 0.7;
  margin-top: 2px;
`

export const ShowInfo = styled.div``

export const ShowName = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 20px;
  color: ${({ theme }) => theme.colors.charcoal};
  margin-bottom: 4px;
`

export const ShowVenue = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`

export const ShowTags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`

export const ShowTag = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: ${({ theme }) => theme.colors.cream2};
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 3px;
  padding: 2px 8px;
  color: ${({ theme }) => theme.colors.olive};
`

export const ShowCta = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-column: 2;
  }
`

export const ShowLink = styled.a`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.olive};
  text-decoration: none;
  white-space: nowrap;

  &:hover { text-decoration: underline; }
`

export const ShowBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: #2d6a2d;
  color: #fff;
  border-radius: 3px;
  padding: 4px 10px;
`
