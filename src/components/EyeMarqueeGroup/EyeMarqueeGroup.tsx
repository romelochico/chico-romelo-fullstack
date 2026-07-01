import Marquee from '../Marquee/Marquee'
import { Group, EyeBorder } from './EyeMarqueeGroup.styles'

interface EyeMarqueeGroupProps {
  items: string[]
}

export default function EyeMarqueeGroup({ items }: EyeMarqueeGroupProps) {
  return (
    <Group>
      <EyeBorder>
        <picture>
          <source srcSet="/assets/eye-pattern.webp" type="image/webp" />
          <img src="/assets/eye-pattern.png" alt="" loading="lazy" decoding="async" />
        </picture>
      </EyeBorder>
      <Marquee items={items} alt reverse />
    </Group>
  )
}
