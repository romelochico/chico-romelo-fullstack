import { HeroWrapper, HeroBg, HeroContent, HeroLabel, HeroH1 } from './PageHero.styles'

/**
 * @param {string}          label     – small eyebrow label
 * @param {React.ReactNode} title     – h1 content (can contain <span className="outline">)
 * @param {string}          imageSrc  – webp src
 * @param {string}          imageAlt
 * @param {boolean}         priority  – load image eagerly
 */
export default function PageHero({ label, title, imageSrc, imageJpg, imageAlt, priority = false, imagePos }) {
  return (
    <HeroWrapper>
      <HeroBg $imagePos={imagePos}>
        <picture>
          <source srcSet={imageSrc} type="image/webp" />
          <img
            src={imageJpg}
            alt={imageAlt}
            fetchpriority={priority ? 'high' : undefined}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </picture>
      </HeroBg>

      <HeroContent>
        <HeroLabel>
          <span className="dot" />
          {label}
        </HeroLabel>
        <HeroH1>{title}</HeroH1>
      </HeroContent>
    </HeroWrapper>
  )
}
