import { ThemeProvider } from 'styled-components'
import { theme } from '../lib/theme'
import GlobalStyles from '../styles/GlobalStyles'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
