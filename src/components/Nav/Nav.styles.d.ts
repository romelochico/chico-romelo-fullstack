import type { StyledComponent } from 'styled-components'
import type { DefaultTheme } from 'styled-components'

export const NavWrapper: StyledComponent<'nav', DefaultTheme, { $innerPage?: boolean; $hidden?: boolean }>
export const NavLinks: StyledComponent<'div', DefaultTheme, { $right?: boolean }>
export const NavLogoImg: StyledComponent<'img', DefaultTheme>
export const BurgerBtn: StyledComponent<'button', DefaultTheme>
export const Drawer: StyledComponent<'div', DefaultTheme>
export const Overlay: StyledComponent<'div', DefaultTheme>
