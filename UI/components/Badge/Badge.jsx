import { BadgeBase } from './Badge.styles'

/**
 * Badge / Tag
 *
 * @param {'dark'|'olive'|'cream'|'tag'|'success'} variant
 * @param {string} rotate  – CSS rotate value e.g. "4deg"
 */
export function Badge({ children, variant = 'dark', rotate, ...rest }) {
  return (
    <BadgeBase $variant={variant} $rotate={rotate} {...rest}>
      {children}
    </BadgeBase>
  )
}
