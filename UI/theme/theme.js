import { colors } from '../tokens/colors'
import { fonts } from '../tokens/typography'
import { breakpoints } from '../tokens/breakpoints'

/**
 * The styled-components theme object consumed by ThemeProvider.
 * Maps directly to the design tokens — use this in any component
 * via `${({ theme }) => theme.colors.olive}` etc.
 */
export const theme = {
  colors,
  fonts,
  breakpoints,
}
