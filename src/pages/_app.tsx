import { ThemeProvider } from 'styled-components'
import { theme } from '../lib/theme'
import GlobalStyles from '../styles/GlobalStyles'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
