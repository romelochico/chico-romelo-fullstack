import { Label } from './SectionLabel.styles'

export default function SectionLabel({ children }) {
  return (
    <Label>
      <span className="dot" />
      {children}
    </Label>
  )
}
