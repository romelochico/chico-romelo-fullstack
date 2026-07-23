import styled from 'styled-components'

// ── PAGE WRAPPER ────────────────────────────────────────────────
export const PageWrap = styled.div`
  background: ${({ theme }) => theme.colors.cream};
  min-height: 100vh;
`

// ── STATS BAR ───────────────────────────────────────────────────
export const StatsBar = styled.div`
  background: ${({ theme }) => theme.colors.olive};
  padding: 20px 5vw;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 24px;
  }
`

export const StatItem = styled.div`
  text-align: center;
`

export const StatVal = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(28px, 4vw, 48px);
  color: ${({ theme }) => theme.colors.cream};
  line-height: 1;
`

export const StatLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sage};
  margin-top: 4px;
`

export const StatDivider = styled.div`
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.15);

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    display: none;
  }
`

// ── SHOWS SECTION ───────────────────────────────────────────────
export const ShowsSection = styled.section`
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 5vw;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    padding: 40px 5vw;
  }
`

export const SectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  border-bottom: 3px double ${({ theme }) => theme.colors.charcoal};
  padding-bottom: 14px;
`

export const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(36px, 5vw, 64px);
  line-height: 0.88;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.charcoal};
  letter-spacing: 0.02em;
`

export const ShowsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-template-columns: 1fr;
  }
`

export const ShowCard = styled.a`
  display: block;
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid rgba(64, 64, 21, 0.12);
  border-radius: 14px;
  padding: 20px 24px;
  text-decoration: none;
  cursor: pointer;
  transition:
    border-color 0.15s,
    transform 0.15s,
    box-shadow 0.15s;
  position: relative;

  &:hover {
    border-color: ${({ theme }) => theme.colors.olive};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px -8px rgba(64, 64, 21, 0.2);
  }
`

export const ShowName = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 22px;
  color: ${({ theme }) => theme.colors.olive};
  letter-spacing: 0.02em;
  text-transform: uppercase;
  margin-bottom: 4px;
`

export const ShowMeta = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.sage};
  margin-bottom: 16px;
`

export const ShowBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const Badge = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.olive};
  background: rgba(64, 64, 21, 0.08);
  border: 1px solid rgba(64, 64, 21, 0.2);
  border-radius: 4px;
  padding: 3px 8px;
`

export const ShowArrow = styled.span`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: ${({ theme }) => theme.colors.sage};
  transition:
    color 0.15s,
    right 0.15s;

  ${ShowCard}:hover & {
    color: ${({ theme }) => theme.colors.olive};
    right: 16px;
  }
`

export const EmptyShows = styled.div`
  padding: 60px 0;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.sage};
  font-style: italic;
`

// ── CRIAR SHOW (admin) ──────────────────────────────────────────
export const CriarSection = styled.section`
  background: ${({ theme }) => theme.colors.cream2};
  border-top: 1px solid rgba(64, 64, 21, 0.1);
  padding: 60px 5vw;
`

export const CriarInner = styled.div`
  max-width: 640px;
  margin: 0 auto;
`

export const FormTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(28px, 4vw, 48px);
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.charcoal};
  margin-bottom: 28px;
  letter-spacing: 0.02em;
`

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-template-columns: 1fr;
  }
`

export const FieldFull = styled.div`
  grid-column: 1 / -1;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const FieldLabel = styled.label`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.olive};
  font-weight: 600;
`

export const FieldInput = styled.input`
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid rgba(64, 64, 21, 0.15);
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.charcoal};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  padding: 10px 12px;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.olive};
  }
`

export const PapeisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 8px;
  margin: 16px 0 24px;
`

export const PapelToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1.5px solid ${({ $on, theme }) => ($on ? theme.colors.olive : 'rgba(64,64,21,0.15)')};
  background: ${({ $on, theme }) => ($on ? theme.colors.olive : theme.colors.white)};
  color: ${({ $on, theme }) => ($on ? theme.colors.cream : theme.colors.charcoal)};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;

  &:hover {
    border-color: ${({ theme }) => theme.colors.olive};
  }
`

export const SubmitBtn = styled.button`
  background: ${({ theme }) => theme.colors.olive};
  color: ${({ theme }) => theme.colors.cream};
  border: none;
  border-radius: 8px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 600;
  padding: 13px 32px;
  cursor: pointer;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

export const ExistingShows = styled.div`
  margin-top: 40px;
`

export const ExistingCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid rgba(64, 64, 21, 0.1);
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
`

export const ExistingInfo = styled.div`
  flex: 1;
`

export const ExistingName = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.olive};
  letter-spacing: 0.02em;
`

export const ExistingMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.sage};
  margin-top: 2px;
`

export const DeleteBtn = styled.button`
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: 6px;
  border: 1.5px solid rgba(163, 58, 42, 0.3);
  background: none;
  color: #a33a2a;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.body};
  transition: background 0.15s;

  &:hover {
    background: rgba(163, 58, 42, 0.08);
  }
`

export const Toast = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(${({ $show }) => ($show ? '0' : '10px')});
  background: ${({ $error, theme }) => ($error ? '#a33a2a' : theme.colors.olive)};
  border-radius: 8px;
  padding: 12px 20px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.cream};
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: all 0.3s;
  pointer-events: none;
  white-space: nowrap;
  z-index: 100;
`
