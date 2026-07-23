import styled from 'styled-components'

const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.11  0 0 0 0 0.10  0 0 0 0 0.05  0 0 0 0.25 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`
const noise = `
  position: relative;
  &::before { content:''; position:absolute; inset:0; background-image:${NOISE}; opacity:0.45; mix-blend-mode:multiply; pointer-events:none; z-index:1; }
  & > * { position:relative; z-index:2; }
`

export const ErrorMsg = styled.p`
  color: #c0392b;
  font-size: 13px;
  font-family: ${({ theme }) => theme.fonts.mono};
`

export const ContactSection = styled.section`
  ${noise}
  background: ${({ theme }) => theme.colors.cream};
  padding: 100px 5vw;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    padding: 60px 5vw;
  }
`

export const ContactInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 80px;
  align-items: flex-start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 50px;
  }
`

// ── FORM SIDE ─────────────────────────────────────────────────
export const FormWrap = styled.div`
  flex: 1.2;
  min-width: 0;

  p.intro {
    font-size: 17px;
    line-height: 1.65;
    margin: 20px 0 32px;
    max-width: 520px;
  }
`

export const Kicker = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(52px, 7vw, 120px);
  line-height: 0.88;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  margin: 20px 0 0;
  color: ${({ theme }) => theme.colors.charcoal};

  em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.olive};
  }
`

export const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 560px;
`

export const FormRow = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    flex-direction: column;
    gap: 20px;
  }
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;

  label {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.sage};
  }
`

export const FormInput = styled.input`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.charcoal};
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.charcoal};
  padding: 12px 14px;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.olive};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.sageFade};
  }
`

export const FormSelect = styled.select`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.charcoal};
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.charcoal};
  padding: 12px 14px;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.olive};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.sageFade};
  }
`

export const FormTextarea = styled.textarea`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.charcoal};
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.charcoal};
  padding: 12px 14px;
  outline: none;
  resize: vertical;
  min-height: 120px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.olive};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.sageFade};
  }
`

export const SubmitBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: ${({ theme }) => theme.colors.charcoal};
  color: ${({ theme }) => theme.colors.cream};
  border: 2px solid ${({ theme }) => theme.colors.charcoal};
  border-radius: 999px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition:
    transform 0.15s,
    background 0.15s;
  align-self: flex-start;

  &:hover {
    transform: translateY(-2px) rotate(-1.5deg);
    background: ${({ theme }) => theme.colors.olive};
    border-color: ${({ theme }) => theme.colors.olive};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }
`

export const FormSuccess = styled.div`
  display: ${({ $show }) => ($show ? 'block' : 'none')};
  background: ${({ theme }) => theme.colors.olive};
  color: ${({ theme }) => theme.colors.cream};
  padding: 24px;
  text-align: center;

  h3 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 28px;
    text-transform: uppercase;
    margin: 0 0 8px;
  }
  p {
    font-size: 14px;
    opacity: 0.8;
    margin: 0;
  }
`

// ── SIDEBAR ───────────────────────────────────────────────────
export const Sidebar = styled.div`
  flex: 0.65;
  min-width: 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`

export const DirectCard = styled.div`
  background: ${({ theme }) => theme.colors.olive};
  color: ${({ theme }) => theme.colors.cream};
  padding: 32px 28px;
  transform: rotate(1.5deg);
  position: relative;
  margin-bottom: 28px;

  &::before {
    content: '✦';
    position: absolute;
    top: -14px;
    left: 16px;
    font-size: 28px;
    color: ${({ theme }) => theme.colors.tape};
  }

  h4 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 24px;
    text-transform: uppercase;
    margin: 0 0 18px;
  }
`

export const DirectRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);

  &:last-child {
    border-bottom: none;
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    margin-top: 2px;
    opacity: 0.7;
  }
`

export const DirectContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const DirectLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.6;
`

export const DirectValue = styled.span`
  font-size: 15px;
  font-weight: 600;

  a {
    color: ${({ theme }) => theme.colors.cream};
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-color: rgba(255, 255, 255, 0.3);
    transition: text-decoration-color 0.2s;

    &:hover {
      text-decoration-color: ${({ theme }) => theme.colors.cream};
    }
  }
`

export const SocialCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 28px 24px;
  box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.2);
  transform: rotate(-1deg);

  h4 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 22px;
    text-transform: uppercase;
    margin: 0 0 18px;
  }
`

export const SocialLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const SocialLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.cream};
  border: 1.5px solid transparent;
  transition:
    border-color 0.2s,
    transform 0.15s;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.olive};
    transform: translateX(4px);
  }

  svg {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.charcoal};
  }

  .name {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 18px;
    text-transform: uppercase;
    flex: 1;
  }
  .arrow {
    font-size: 16px;
    opacity: 0.4;
    transition: opacity 0.2s;
  }

  &:hover .arrow {
    opacity: 1;
  }
`

export const LocationStamp = styled.div`
  margin-top: 28px;
  background: ${({ theme }) => theme.colors.cream2};
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 14px;
  transform: rotate(0.5deg);

  svg {
    width: 32px;
    height: 32px;
    color: ${({ theme }) => theme.colors.olive};
    flex-shrink: 0;
  }

  span {
    font-family: ${({ theme }) => theme.fonts.hand};
    font-size: 22px;
    color: ${({ theme }) => theme.colors.olive};
    line-height: 1.2;
  }
`
