import styled from 'styled-components'

export const Article = styled.article`
  position: relative;
  flex: 1;
  background: ${({ theme }) => theme.colors.white};
  padding: 26px 24px 30px;
  box-shadow: 0 10px 24px -16px rgba(0,0,0,0.28);
  display: flex;
  flex-direction: column;
`

export const Strap = styled.span`
  position: absolute;
  top: -10px;
  right: 18px;
  background: ${({ theme }) => theme.colors.olive};
  color: ${({ theme }) => theme.colors.cream};
  padding: 4px 10px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  transform: rotate(4deg);
`

export const DateTag = styled.span`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 4px 8px;
  border: 1.5px solid ${({ theme }) => theme.colors.charcoal};
  margin-bottom: 14px;
  width: fit-content;
`

export const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 30px;
  line-height: 0.95;
  text-transform: uppercase;
  margin: 0 0 12px;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.colors.charcoal};
  min-height: 2em;
`

export const ImageWrap = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  margin: 14px 0 16px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.sage};
`

export const Lede = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 500;
  font-size: 14px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.charcoal};
  margin: 0;
`

export const ClipLink = styled.a`
  display: inline-block;
  margin-top: 12px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.olive};

  &:hover { text-decoration: underline; }
`
