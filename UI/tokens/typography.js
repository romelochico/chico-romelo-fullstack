// ─────────────────────────────────────────────
// Chico Romelo — Typography Tokens
// ─────────────────────────────────────────────

export const fonts = {
  display: '"Chunq", "Impact", sans-serif',
  body:    '"Montserrat", "Helvetica Neue", Arial, sans-serif',
  mono:    '"Special Elite", "Courier Prime", "Courier New", monospace',
  hand:    '"Caveat", "Comic Sans MS", cursive',
}

export const fontWeights = {
  regular:   400,
  medium:    500,
  semibold:  600,
  bold:      700,
}

export const fontSizes = {
  // Static scale
  xs:   '10px',
  sm:   '11px',
  base: '14px',
  md:   '16px',
  lg:   '18px',
  xl:   '22px',
  '2xl': '28px',
  '3xl': '36px',
  '4xl': '48px',

  // Fluid / display sizes (use clamp)
  displaySm:  'clamp(36px, 5vw, 64px)',
  displayMd:  'clamp(48px, 7vw, 88px)',
  displayLg:  'clamp(64px, 9vw, 140px)',
  displayXl:  'clamp(72px, 14vw, 180px)',
}

export const lineHeights = {
  tight:  0.88,
  snug:   1.1,
  normal: 1.45,
  relaxed: 1.65,
  loose:  1.75,
}

export const letterSpacings = {
  tight:  '-0.01em',
  normal:  '0',
  wide:    '0.04em',
  wider:   '0.1em',
  widest:  '0.2em',
  stamp:   '0.3em',
}
