import { ButtonBase } from './Button.styles'

/**
 * Button
 *
 * @param {'primary'|'secondary'|'olive'|'ghost'} variant
 * @param {'sm'|'md'|'lg'|'square'}               size
 * @param {string}                                 as    – render as 'a', 'button', etc.
 */
export function Button({ children, variant = 'primary', size = 'md', as, ...rest }) {
  return (
    <ButtonBase as={as} $variant={variant} $size={size} {...rest}>
      {children}
    </ButtonBase>
  )
}
