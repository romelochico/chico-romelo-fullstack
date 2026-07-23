// ─────────────────────────────────────────────
// Chico Romelo — Color Tokens
// ─────────────────────────────────────────────

export const colors = {
  // Brand primaries
  sage: '#878766',
  olive: '#404015',
  olive2: '#44461a',

  // Backgrounds
  cream: '#fdf4e8',
  cream2: '#f5ebda',
  cream3: '#ece0c8',

  // Neutrals
  white: '#ffffff',
  charcoal: '#373435',
  black: '#000000',

  // Accent
  tape: '#d9c96e',

  // Alpha
  sageFade: 'rgba(135, 135, 102, 0.18)',
  overlayDark: 'rgba(0, 0, 0, 0.72)',
}

// Semantic aliases
export const semantic = {
  background: colors.cream,
  backgroundAlt: colors.cream2,
  backgroundDeep: colors.cream3,
  backgroundInverse: colors.olive,
  backgroundDark: colors.charcoal,

  textPrimary: colors.charcoal,
  textInverse: colors.cream,
  textMuted: colors.sage,
  textAccent: colors.olive,

  borderDefault: colors.charcoal,
  borderMuted: colors.sage,

  interactive: colors.olive,
  interactiveHover: colors.charcoal,
  accent: colors.tape,
}
