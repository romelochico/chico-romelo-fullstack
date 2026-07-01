import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      sage: string
      olive: string
      olive2: string
      cream: string
      cream2: string
      cream3: string
      white: string
      charcoal: string
      black: string
      tape: string
      sageFade: string
      dark: string
      dark2: string
      dark3: string
    }
    fonts: {
      display: string
      body: string
      mono: string
      hand: string
    }
    breakpoints: {
      tablet: string
      admin: string
      mobile: string
      small: string
    }
  }
}
