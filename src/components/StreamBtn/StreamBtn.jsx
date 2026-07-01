import { IconSpotify, IconAppleMusic, IconYouTube } from '../Icons/Icons'
import { Btn } from './StreamBtn.styles'

const ICONS = {
  spotify:     <IconSpotify size={20} />,
  apple:       <IconAppleMusic size={20} />,
  youtube:     <IconYouTube size={20} />,
}

const LABELS = {
  spotify: 'Spotify',
  apple:   'Apple Music',
  youtube: 'YouTube',
}

/**
 * @param {'spotify'|'apple'|'youtube'} platform
 * @param {string} href
 */
export default function StreamBtn({ platform, href, children, ...rest }) {
  return (
    <Btn href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {ICONS[platform] || null}
      {children || LABELS[platform] || platform}
    </Btn>
  )
}
