import { LabelWrap } from './SectionLabel.styles'

/**
 * SectionLabel — stamped section eyebrow with dot prefix
 * @param {boolean} dark — invert colours for use on dark backgrounds
 */
export function SectionLabel({ children, dark = false, ...rest }) {
  return (
    <LabelWrap $dark={dark} {...rest}>
      <span className="dot" />
      {children}
    </LabelWrap>
  )
}
