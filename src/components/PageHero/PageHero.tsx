import { HeroWrapper, HeroBg, HeroContent, HeroLabel, HeroH1 } from './PageHero.styles'
import type { ReactNode } from 'react'

interface PageHeroProps {
  label: string
  title: ReactNode
  imageSrc: string
  imageJpg: string
  imageAlt: string
  priority?: boolean
  imagePos?: string
}

export default function PageHero({ label, title, imageSrc, imageJpg, imageAlt, priority = false, imagePos }: PageHeroProps) {
  return (
    <HeroWrapper>
      <HeroBg $imagePos={imagePos}>
        <picture>
          <source srcSet={imageSrc} type="image/webp" />
          <img
            src={imageJpg}
            alt={imageAlt}
            fetchPriority={priority ? 'high' : undefined}
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
