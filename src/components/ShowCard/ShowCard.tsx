import Link from 'next/link'
import {
  CardRow, DateBox, Day, Month, Year,
  ShowInfo, ShowName, ShowVenue, ShowTags, ShowTag,
  ShowCta, ShowLink, ShowBadge,
} from './ShowCard.styles'
import type { ShowCardProps } from '../../types'

export default function ShowCard({ day, month, year, name, venue, tags = [], link, badge, past = false }: ShowCardProps) {
  return (
    <CardRow $past={past} data-reveal>
      <DateBox $past={past}>
        {day && <Day>{day}</Day>}
        <Month>{month}</Month>
        <Year>{year}</Year>
      </DateBox>

      <ShowInfo>
        <ShowName>{name}</ShowName>
        <ShowVenue>{venue}</ShowVenue>
        {tags.length > 0 && (
          <ShowTags>
            {tags.map((t) => <ShowTag key={t}>{t}</ShowTag>)}
          </ShowTags>
        )}
      </ShowInfo>

      <ShowCta>
        {badge && <ShowBadge>{badge}</ShowBadge>}
        {link && (
          link.external
            ? <ShowLink href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</ShowLink>
            : <Link href={link.href} passHref legacyBehavior><ShowLink as="a">{link.label}</ShowLink></Link>
        )}
      </ShowCta>
    </CardRow>
  )
}
