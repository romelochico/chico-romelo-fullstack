import styled, { css } from 'styled-components'

export const NavWrapper = styled.nav`
  position: fixed;
  top: 10px;
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 30px 40px;
  z-index: 100;
  color: ${({ theme }) => theme.colors.cream};
  background: rgba(20, 18, 18, 0.55);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.1);
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.04em;
  border-radius: 14px;

  /* Always centered horizontally */
  left: 50%;
  transform: translateX(-50%);

  ${({ $hidden }) => $hidden && css`
    opacity: 0;
    pointer-events: none;
    transform: translateY(-8px);
  `}

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 16px 18px;
    right: 10px;
    left: 10px;
    transform: none !important;
    justify-content: center;
    transition: opacity 0.25s, transform 0.25s;

    ${({ $hidden }) => $hidden && css`
      opacity: 0;
      pointer-events: none;
      transform: translateY(-8px) !important;
    `}
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    top: 0;
    left: 0;
    right: 0;
    border-radius: 0;
    border-top: none;
    border-left: none;
    border-right: none;
    padding: 14px 20px;
    background: rgba(0, 0, 0, 0.55);
  }
`

export const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
  min-width: 0;
  justify-content: ${({ $right }) => $right ? 'flex-start' : 'flex-end'};

  a { opacity: 0.9; transition: opacity 0.2s; }
  a:hover { opacity: 1; }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`

export const NavLogoImg = styled.img`
  height: 44px;
  width: auto;
  flex-shrink: 0;
  filter: brightness(0) invert(1);
  opacity: 0.95;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: 36px;
    max-width: 160px;
    flex-shrink: 1;
  }
`

export const BurgerBtn = styled.button`
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 200;

  span {
    display: block;
    width: 22px;
    height: 2px;
    background: ${({ theme }) => theme.colors.cream};
    border-radius: 2px;
    transition: transform 0.25s, opacity 0.25s;
    transform-origin: center;
  }

  &.is-open span:nth-child(1) { transform: translateY(3.5px) rotate(45deg); }
  &.is-open span:nth-child(2) { transform: translateY(-3.5px) rotate(-45deg); }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`

export const Drawer = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: min(72vw, 280px);
    background: rgba(20, 18, 18, 0.82);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border-right: 1px solid rgba(255,255,255,0.1);
    padding: 90px 32px 40px;
    gap: 6px;
    z-index: 150;
    transform: translateX(-100%);
    transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);

    &.is-open { transform: translateX(0); }

    a {
      font-family: ${({ theme }) => theme.fonts.body};
      font-weight: 600;
      font-size: 20px;
      letter-spacing: 0.04em;
      color: ${({ theme }) => theme.colors.cream};
      padding: 10px 0 10px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      opacity: 0.85;
      transition: opacity 0.15s, color 0.15s;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 18px;
        border-radius: 2px;
        background: transparent;
        transition: background 0.15s;
      }

      &:last-child { border-bottom: none; }
      &:hover { opacity: 1; color: ${({ theme }) => theme.colors.tape}; }

      &[aria-current='page'] {
        opacity: 1;
        color: ${({ theme }) => theme.colors.tape};
        font-weight: 700;

        &::before { background: ${({ theme }) => theme.colors.tape}; }
      }
    }
  }
`

export const Overlay = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 140;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;

    &.is-open { opacity: 1; pointer-events: all; }
  }
`
