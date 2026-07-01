import { MarqueeWrapper, Track, Dot, Star } from './Marquee.styles'

/**
 * @param {string[]} items   – array of text segments
 * @param {boolean}  alt     – dark background variant
 * @param {boolean}  reverse – scroll right-to-left
 */
export default function Marquee({ items = [], alt = false, reverse = false }) {
  // Duplicate items so the strip fills the full width seamlessly
  const doubled = [...items, ...items]

  return (
    <MarqueeWrapper $alt={alt} aria-hidden="true">
      <Track $reverse={reverse}>
        {doubled.map((text, i) => (
          <span key={`${text}-${i}`}>
            {text}
            {i % 2 === 0
              ? <Dot>●</Dot>
              : <Star>✦</Star>}
          </span>
        ))}
      </Track>
    </MarqueeWrapper>
  )
}
