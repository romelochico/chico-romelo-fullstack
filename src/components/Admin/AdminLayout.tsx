import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styled, { createGlobalStyle } from 'styled-components'
import { Menu } from 'lucide-react'
import AdminSidebar from './AdminSidebar'
import { createClient } from '../../lib/supabase/client'
import type { ReactNode } from 'react'

const AdminReset = createGlobalStyle`
  body { background: ${({ theme }) => theme.colors.dark} !important; }
`

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
  border-bottom: 1px solid rgba(255,255,255,0.06);
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

  &:hover { background: rgba(255,255,255,0.06); }
  svg { width: 20px; height: 20px; }
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
const TopBarSpacer = styled.div`width: 40px;`

/* ── Main content area ────────────────────────────────────────────── */

const Main = styled.main`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: ${({ theme }) => theme.colors.dark};
  min-width: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.admin}) {
    padding-top: 56px;
  }
`

const Header = styled.div`
  padding: 20px 32px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 10px 16px 8px;
    margin-bottom: 10px;
  }
`

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 24px;
  color: ${({ theme }) => theme.colors.cream};
  font-weight: 700;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 18px;
  }
`

const PageSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  margin-top: 2px;
  letter-spacing: 0.04em;
`

const Content = styled.div`
  padding: 0 32px 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 16px 16px;
  }
`

interface AdminLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    createClient().auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        const next = encodeURIComponent(router.asPath)
        router.replace(`/admin/login?next=${next}`)
      } else {
        setAuthed(true)
      }
    })
  }, [router])

  if (!authed) return null

  return (
    <>
      <Head>
        <title>{title ? `Admin | ${title}` : 'Admin | Chico Romelo'}</title>
      </Head>
      <AdminReset />

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
        <Main>
          {(title || subtitle) && (
            <Header>
              {title && <PageTitle>{title}</PageTitle>}
              {subtitle && <PageSub>{subtitle}</PageSub>}
            </Header>
          )}
          <Content>{children}</Content>
        </Main>
      </Shell>
    </>
  )
}
