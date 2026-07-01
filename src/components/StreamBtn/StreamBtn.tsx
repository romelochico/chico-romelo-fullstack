import { IconSpotify, IconAppleMusic, IconYouTube } from '../Icons/Icons'
import { Btn } from './StreamBtn.styles'
import type { ReactNode } from 'react'

type Platform = 'spotify' | 'apple' | 'youtube'

const ICONS: Record<Platform, ReactNode> = {
  spotify:     <IconSpotify size={20} />,
  apple:       <IconAppleMusic size={20} />,
  youtube:     <IconYouTube size={20} />,
}

const LABELS: Record<Platform, string> = {
  spotify: 'Spotify',
  apple:   'Apple Music',
  youtube: 'YouTube',
}

interface StreamBtnProps {
  platform: Platform
  href: string
  children?: ReactNode
  [key: string]: unknown
}

export default function StreamBtn({ platform, href, children, ...rest }: StreamBtnProps) {
  return (
    <Btn href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {ICONS[platform] || null}
      {children || LABELS[platform] || platform}
    </Btn>
  )
}
