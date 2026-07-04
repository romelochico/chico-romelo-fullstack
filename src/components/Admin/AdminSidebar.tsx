import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import {
  LayoutDashboard, Calendar, Newspaper, Disc3,
  Image, Link2, Mail, LogOut, X, Star, Package,
  type LucideIcon,
} from 'lucide-react'
import { createClient } from '../../lib/supabase/client'
import type { User } from '@supabase/supabase-js'

/* ── Overlay (mobile only) ────────────────────────────────────────── */

const Overlay = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.admin}) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 190;
    opacity: ${({ $open }) => $open ? 1 : 0};
    pointer-events: ${({ $open }) => $open ? 'auto' : 'none'};
    transition: opacity 0.25s;
  }
`

/* ── Sidebar shell ────────────────────────────────────────────────── */

const Sidebar = styled.aside<{ $open: boolean }>`
  width: 240px;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.dark2};
  border-right: 1px solid rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.admin}) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100dvh;
    z-index: 200;
    transform: ${({ $open }) => $open ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${({ $open }) => $open ? '4px 0 32px rgba(0,0,0,0.5)' : 'none'};
    overflow-y: auto;
  }
`

/* ── Top section ─────────────────────────────────────────────────── */

const SidebarTop = styled.div`
  padding: 28px 24px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  span {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
  }
`

const BrandLogo = styled.img`
  height: auto;
  width: 160px;
  filter: brightness(0) invert(1);
  opacity: 0.9;
`

const CloseBtn = styled.button`
  display: none;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  border: none;
  border-radius: 6px;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s;

  &:hover { background: rgba(255,255,255,0.1); color: ${({ theme }) => theme.colors.cream}; }
  svg { width: 15px; height: 15px; }

  @media (max-width: ${({ theme }) => theme.breakpoints.admin}) {
    display: flex;
  }
`

/* ── Nav ─────────────────────────────────────────────────────────── */

const Nav = styled.nav`
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const NavItem = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 500;
  color: ${({ $active, theme }) => $active ? theme.colors.cream : 'rgba(255,255,255,0.4)'};
  background: ${({ $active, theme }) => $active ? theme.colors.sageFade : 'transparent'};
  text-decoration: none;
  transition: all 0.15s;

  svg { width: 16px; height: 16px; flex-shrink: 0; }

  &:hover {
    color: ${({ theme }) => theme.colors.cream};
    background: ${({ theme }) => theme.colors.sageFade};
  }
`

/* ── Bottom ──────────────────────────────────────────────────────── */

const SidebarBottom = styled.div`
  padding: 12px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
`

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => `${theme.colors.sage}22`};
  border: 1px solid ${({ theme }) => `${theme.colors.sage}55`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.sage};
  flex-shrink: 0;
  letter-spacing: 0.04em;
`

const UserName = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.5);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const SignOutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.3);
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: all 0.15s;

  svg { width: 16px; height: 16px; flex-shrink: 0; }

  &:hover { color: #f87171; background: rgba(248,113,113,0.06); }
`

/* ── Data ────────────────────────────────────────────────────────── */

interface NavLinkDef {
  href: string
  label: string
  icon: LucideIcon
}

const NAV_LINKS: NavLinkDef[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/eventos',   label: 'Eventos',   icon: Calendar },
  { href: '/admin/novidades', label: 'Novidades', icon: Newspaper },
  { href: '/admin/releases',  label: 'Releases',  icon: Disc3 },
  { href: '/admin/media',     label: 'Imprensa',  icon: Image },
  { href: '/admin/links',      label: 'Links e Credenciais', icon: Link2 },
  { href: '/admin/inventario', label: 'Inventário',          icon: Package },
  { href: '/admin/contatos',   label: 'Contatos',            icon: Mail },
  { href: '/admin/avaliacoes', label: 'Avaliações', icon: Star },
]

function getDisplayName(user: User): string {
  const meta = user.user_metadata as Record<string, string> | undefined
  if (meta?.full_name) return meta.full_name
  if (meta?.name) return meta.name
  const prefix = user.email?.split('@')[0] ?? ''
  return prefix.charAt(0).toUpperCase() + prefix.slice(1)
}

function getInitials(user: User): string {
  return getDisplayName(user)
    .split(/[\s._]+/)
    .map(w => w[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join('')
}

/* ── Component ───────────────────────────────────────────────────── */

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ isOpen = false, onClose = () => {} }: AdminSidebarProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  // close drawer on route change
  useEffect(() => { onClose() }, [router.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSignOut() {
    await createClient().auth.signOut()
    router.push('/admin/login')
  }

  return (
    <>
      <Overlay $open={isOpen} onClick={onClose} />
      <Sidebar $open={isOpen}>
        <SidebarTop>
          <Brand>
            <BrandLogo src="/assets/logo-mobile.png" alt="Chico Romelo" />
            <span>Painel Admin</span>
          </Brand>
          <CloseBtn onClick={onClose} aria-label="Fechar menu"><X /></CloseBtn>
        </SidebarTop>

        <Nav>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <NavItem key={href} href={href} $active={router.pathname === href}>
              <Icon />
              {label}
            </NavItem>
          ))}
        </Nav>

        <SidebarBottom>
          {user && (
            <UserRow>
              <Avatar>{getInitials(user)}</Avatar>
              <UserName>{getDisplayName(user)}</UserName>
            </UserRow>
          )}
          <SignOutBtn onClick={handleSignOut}>
            <LogOut />
            Sair
          </SignOutBtn>
        </SidebarBottom>
      </Sidebar>
    </>
  )
}
