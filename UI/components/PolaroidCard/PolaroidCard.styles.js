import styled from 'styled-components'

export const Card = styled.div`
  background: #fff;
  padding: 12px 12px 0;
  box-shadow:
    0 10px 24px -10px rgba(0, 0, 0, 0.25),
    0 2px 0 rgba(0, 0, 0, 0.06);
  transition: transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
  cursor: default;
  position: relative;

  transform: ${({ $rotate }) => ($rotate ? `rotate(${$rotate})` : 'rotate(-1.5deg)')};
  &:hover {
    transform: rotate(0deg) scale(1.04);
    z-index: 3;
  }

  img {
    width: 100%;
    aspect-ratio: ${({ $ratio }) => $ratio || '3/4'};
    object-fit: cover;
    display: block;
  }
`

export const Info = styled.div`
  padding: 14px 4px 18px;
`

export const Caption = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.charcoal};
  letter-spacing: 0.06em;
  text-transform: lowercase;
`

export const Title = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  line-height: 1;
  margin-bottom: 4px;
`

export const Sub = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sage};
`

export const Note = styled.div`
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.olive};
  margin-top: 4px;
`

export const Tape = styled.div`
  position: absolute;
  background: ${({ theme }) => theme.colors.tape};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  opacity: 0.85;
  z-index: 5;
  ${({ $top }) => $top != null && `top:    ${$top}px;`}
  ${({ $right }) => $right != null && `right:  ${$right}px;`}
  ${({ $bottom }) => $bottom != null && `bottom: ${$bottom}px;`}
  ${({ $left }) => $left != null && `left:   ${$left}px;`}
  width:  ${({ $w }) => $w || 80}px;
  height: ${({ $h }) => $h || 20}px;
  transform: rotate(${({ $rot }) => $rot || '0deg'});
`
