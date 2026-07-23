import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s;

  &.is-open {
    opacity: 1;
    pointer-events: all;
  }
`

export const Card = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.charcoal};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  padding: 32px 28px 28px;
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  transform: translateY(16px) scale(0.97);
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);

  .is-open & {
    transform: translateY(0) scale(1);
  }
`

export const CloseBtn = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.cream};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.16);
  }
`

export const CoverWrap = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);

  img {
    object-fit: cover;
  }
`

export const Title = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 20px;
  color: ${({ theme }) => theme.colors.cream};
  margin: 0;
  text-align: center;
  letter-spacing: 0.04em;
`

export const ModalLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sage};
`

export const BtnsCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;

  a {
    width: 100%;
    justify-content: center;
    font-size: 14px;
    padding: 11px 16px;
  }
`
