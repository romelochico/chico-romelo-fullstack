import { Label } from './SectionLabel.styles'
import type { ReactNode } from 'react'

interface SectionLabelProps {
  children: ReactNode
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <Label>
      <span className="dot" />
      {children}
    </Label>
  )
}
