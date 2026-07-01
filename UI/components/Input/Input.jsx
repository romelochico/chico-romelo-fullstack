import { InputBase, TextareaBase, SelectBase, LabelEl, FieldWrap } from './Input.styles'

/**
 * Input — text input with optional label
 */
export function Input({ label, id, ...rest }) {
  return (
    <FieldWrap>
      {label && <LabelEl htmlFor={id}>{label}</LabelEl>}
      <InputBase id={id} {...rest} />
    </FieldWrap>
  )
}

/**
 * Textarea — multiline input with optional label
 */
export function Textarea({ label, id, ...rest }) {
  return (
    <FieldWrap>
      {label && <LabelEl htmlFor={id}>{label}</LabelEl>}
      <TextareaBase id={id} {...rest} />
    </FieldWrap>
  )
}

/**
 * Select — dropdown with optional label
 */
export function Select({ label, id, children, ...rest }) {
  return (
    <FieldWrap>
      {label && <LabelEl htmlFor={id}>{label}</LabelEl>}
      <SelectBase id={id} {...rest}>{children}</SelectBase>
    </FieldWrap>
  )
}
