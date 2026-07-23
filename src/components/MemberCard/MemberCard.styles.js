import styled from 'styled-components'

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 12px 12px 0;
  box-shadow:
    0 10px 24px -10px rgba(0, 0, 0, 0.25),
    0 2px 0 rgba(0, 0, 0, 0.06);
  transition: transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
  cursor: default;

  &:nth-child(1) {
    transform: rotate(-2.5deg);
  }
  &:nth-child(2) {
    transform: rotate(1.5deg);
  }
  &:nth-child(3) {
    transform: rotate(-1deg);
  }
  &:nth-child(4) {
    transform: rotate(2deg);
  }
  &:nth-child(5) {
    transform: rotate(-1.8deg);
  }

  &:hover {
    transform: rotate(0deg) scale(1.04);
    z-index: 3;
  }

  img {
    width: 100%;
    aspect-ratio: 3/4;
    object-fit: cover;
    display: block;
  }
`

export const Info = styled.div`
  padding: 14px 4px 18px;
`

export const Name = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 22px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  line-height: 1;
  margin-bottom: 6px;
`

export const Role = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sage};
`

export const Origin = styled.div`
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.olive};
  margin-top: 4px;
`
