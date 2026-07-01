import Link from 'next/link'
import { useRouter } from 'next/router'
import { NAV_LEFT, NAV_RIGHT, NAV_ALL } from '../../lib/data'
import { useNavDrawer } from '../../hooks/useNavDrawer'
import {
  NavWrapper, NavLinks, NavLogoImg,
  BurgerBtn, Drawer, Overlay,
} from './Nav.styles'

interface NavProps {
  innerPage?: boolean
}

export default function Nav({ innerPage = false }: NavProps) {
  const { pathname } = useRouter()
  const { isOpen, isNavHidden, toggle, close } = useNavDrawer()

  return (
    <>
      <NavWrapper $innerPage={innerPage} $hidden={isNavHidden}>
        <BurgerBtn
          aria-label="Menu"
          aria-expanded={isOpen}
          className={isOpen ? 'is-open' : ''}
          onClick={toggle}
        >
          <span />
          <span />
        </BurgerBtn>

        <NavLinks>
          {NAV_LEFT.map(({ href, label }) => (
            <Link key={href} href={href}
              style={{ fontWeight: pathname === href ? 700 : undefined }}>
              {label}
            </Link>
          ))}
        </NavLinks>

        <Link href="/">
          <NavLogoImg src="/assets/logo-mobile.png" alt="Chico Romelo" />
        </Link>

        <NavLinks $right>
          {NAV_RIGHT.map(({ href, label }) => (
            <Link key={href} href={href}
              style={{ fontWeight: pathname === href ? 700 : undefined }}>
              {label}
            </Link>
          ))}
        </NavLinks>
      </NavWrapper>

      <Drawer aria-hidden={!isOpen} className={isOpen ? 'is-open' : ''}>
        {NAV_ALL.map(({ href, label }) => (
          <Link key={href} href={href} onClick={close} aria-current={pathname === href ? 'page' : undefined}>{label}</Link>
        ))}
      </Drawer>

      <Overlay
        className={isOpen ? 'is-open' : ''}
        onClick={close}
        aria-hidden="true"
      />
    </>
  )
}
