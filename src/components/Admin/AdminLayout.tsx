import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styled, { createGlobalStyle, css, keyframes } from 'styled-components'
import { Menu } from 'lucide-react'
import AdminSidebar from './AdminSidebar'
import { createClient } from '../../lib/supabase/client'
import { useTier } from '../../lib/useTier'
import type { ReactNode } from 'react'

// Minimum time the splash stays up once we start showing it, so a
// near-instant tier fetch doesn't just flash the logo for a single frame.
// Doesn't apply at all when the tier is already cached (see useTier) —
// then there's nothing pending and the splash never appears.
const MIN_SPLASH_MS = 400

const Shell = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dark};
  font-family: ${({ theme }) => theme.fonts.body};
`

/* ── Mobile top bar ───────────────────────────────────────────────── */

const TopBar = styled.header`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: ${({ theme }) => theme.colors.dark2};
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 150;

  @media (max-width: ${({ theme }) => theme.breakpoints.admin}) {
    display: flex;
  }
`

const HamburgerBtn = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.cream};
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
  svg {
    width: 20px;
    height: 20px;
  }
`

const TopBarLogo = styled.img`
  height: 22px;
  width: auto;
  filter: brightness(0) invert(1);
  opacity: 0.9;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`

/* spacer so TopBar right side is balanced */
const TopBarSpacer = styled.div`
  width: 40px;
`

/* ── Main content area ────────────────────────────────────────────── */

const Main = styled.main<{ $fullHeight?: boolean }>`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: ${({ theme }) => theme.colors.dark};
  min-width: 0;

  ${({ $fullHeight }) =>
    $fullHeight &&
    css`
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.admin}) {
    padding-top: 56px;
  }
`

const Header = styled.div<{ $compact?: boolean }>`
  padding: 20px 32px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 10px 16px 8px;
    margin-bottom: 10px;

    ${({ $compact }) =>
      $compact &&
      css`
        padding: 6px 16px 4px;
        margin-bottom: 6px;
        border-bottom: none;
      `}
  }
`

const PageTitle = styled.h1<{ $compact?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 24px;
  color: ${({ theme }) => theme.colors.cream};
  font-weight: 700;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 18px;

    ${({ $compact }) =>
      $compact &&
      css`
        font-size: 14px;
      `}
  }
`

const PageSub = styled.p<{ $compact?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 2px;
  letter-spacing: 0.04em;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    ${({ $compact }) =>
      $compact &&
      css`
        display: none;
      `}
  }
`

const Content = styled.div<{ $fullHeight?: boolean }>`
  padding: 0 32px 40px;

  ${({ $fullHeight }) =>
    $fullHeight &&
    css`
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      padding: 0 32px 24px;
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 16px 16px;
  }
`

/* ── Splash (auth + tier resolving) ───────────────────────────────── */

const SplashShell = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.dark};
  z-index: 500;
`

const glow = keyframes`
  0%, 100% {
    filter: brightness(0) invert(1) drop-shadow(0 0 6px rgba(200, 169, 110, 0.15));
    opacity: 0.75;
  }
  50% {
    filter: brightness(0) invert(1) drop-shadow(0 0 26px rgba(200, 169, 110, 0.65));
    opacity: 1;
  }
`

const SplashLogo = styled.img`
  width: 120px;
  height: auto;
  animation: ${glow} 1.4s ease-in-out infinite;
`

const AdminReset = createGlobalStyle`
  body { background: ${({ theme }) => theme.colors.dark} !important; }

  @media print {
    aside { display: none !important; }
    ${TopBar} { display: none !important; }
    ${Header} { display: none !important; }
    ${Shell} { height: auto !important; overflow: visible !important; }
    ${Main} { overflow: visible !important; }
    ${Content} { padding: 0 !important; }
  }
`

interface AdminLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  /** Makes <Main>/<Content> fill the remaining viewport height instead of growing with content — for pages that manage their own internal scrolling (e.g. the calendar). */
  fullHeight?: boolean
  /** Shrinks the title and drops the subtitle on mobile, for pages where the header should get out of the way of the content (e.g. the calendar). */
  compactHeader?: boolean
}

export default function AdminLayout({
  children,
  title,
  subtitle,
  fullHeight,
  compactHeader,
}: AdminLayoutProps) {
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [authed, setAuthed] = useState(false)
  const { loading: tierLoading } = useTier()

  const mountedAt = useRef(Date.now())
  const hadToWaitForTier = useRef(tierLoading)
  const [minSplashDone, setMinSplashDone] = useState(!tierLoading)

  useEffect(() => {
    createClient()
      .auth.getSession()
      .then(({ data: { session } }) => {
        if (!session) {
          const next = encodeURIComponent(router.asPath)
          router.replace(`/admin/login?next=${next}`)
        } else {
          setAuthed(true)
        }
      })
  }, [router])

  useEffect(() => {
    if (!hadToWaitForTier.current || tierLoading) return
    const remaining = Math.max(0, MIN_SPLASH_MS - (Date.now() - mountedAt.current))
    const t = setTimeout(() => setMinSplashDone(true), remaining)
    return () => clearTimeout(t)
  }, [tierLoading])

  // Rendered unconditionally (before the loading gates below) so the body
  // stays dark from the very first paint — otherwise there's a gap on every
  // navigation where the site's default light theme shows through before
  // this mounts, which reads as a flash/blink.
  const reset = <AdminReset />

  // Session check re-runs on every page (fresh component instance per
  // route in the Pages Router) but reads local state, so it's effectively
  // instant — stay invisible here rather than flashing the splash on every
  // navigation.
  if (!authed) return reset

  // Tier is cached module-wide (see useTier), so this genuinely only
  // blocks on the very first admin page of the session.
  if (tierLoading || !minSplashDone) {
    return (
      <>
        {reset}
        <SplashShell>
          <SplashLogo src="/assets/logo-mobile.png" alt="Chico Romelo" />
        </SplashShell>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{title ? `Admin | ${title}` : 'Admin | Chico Romelo'}</title>
      </Head>
      {reset}

      {/* mobile top bar */}
      <TopBar>
        <HamburgerBtn onClick={() => setDrawerOpen(true)} aria-label="Abrir menu">
          <Menu />
        </HamburgerBtn>
        <TopBarLogo src="/assets/logo-mobile.png" alt="Chico Romelo" />
        <TopBarSpacer />
      </TopBar>

      <Shell>
        <AdminSidebar isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <Main $fullHeight={fullHeight}>
          {(title || subtitle) && (
            <Header $compact={compactHeader}>
              {title && <PageTitle $compact={compactHeader}>{title}</PageTitle>}
              {subtitle && <PageSub $compact={compactHeader}>{subtitle}</PageSub>}
            </Header>
          )}
          <Content $fullHeight={fullHeight}>{children}</Content>
        </Main>
      </Shell>
    </>
  )
}
