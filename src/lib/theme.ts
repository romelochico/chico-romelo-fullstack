import type { DefaultTheme } from 'styled-components'

export const theme: DefaultTheme = {
  colors: {
    sage:      '#878766',
    olive:     '#404015',
    olive2:    '#44461a',
    cream:     '#fdf4e8',
    cream2:    '#f5ebda',
    cream3:    '#ece0c8',
    white:     '#ffffff',
    charcoal:  '#373435',
    black:     '#000000',
    tape:      '#d9c96e',
    sageFade:  'rgba(135, 135, 102, 0.18)',
    // admin dark palette
    dark:      '#0d0d0d',
    dark2:     '#111111',
    dark3:     '#1a1a1a',
  },
  fonts: {
    display: '"Chunq", "Impact", sans-serif',
    body:    '"Montserrat", "Helvetica Neue", sans-serif',
    mono:    '"Special Elite", "Courier Prime", monospace',
    hand:    '"Caveat", cursive',
  },
  breakpoints: {
    tablet: '950px',
    admin:  '900px',
    mobile: '768px',
    small:  '580px',
  },
}
