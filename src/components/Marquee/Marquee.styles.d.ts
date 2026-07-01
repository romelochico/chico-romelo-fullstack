import type { StyledComponent } from 'styled-components'
import type { DefaultTheme } from 'styled-components'

export const MarqueeWrapper: StyledComponent<'div', DefaultTheme, { $alt?: boolean }>
export const Track: StyledComponent<'div', DefaultTheme, { $reverse?: boolean }>
export const Dot: StyledComponent<'span', DefaultTheme>
export const Star: StyledComponent<'span', DefaultTheme>
