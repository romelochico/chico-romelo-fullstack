'use client'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { theme } from './theme'

/**
 * Drop-in ThemeProvider for the Chico Romelo design system.
 * Wrap your app (or Storybook decorator) with this.
 */
export function ThemeProvider({ children }) {
  return (
    <StyledThemeProvider theme={theme}>
      {children}
    </StyledThemeProvider>
  )
}
