import Marquee from '../Marquee/Marquee'
import { Group, EyeBorder } from './EyeMarqueeGroup.styles'

/**
 * The eye-pattern image strip glued flush to an alt/reverse marquee.
 * @param {string[]} items – marquee text segments
 */
export default function EyeMarqueeGroup({ items }) {
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
