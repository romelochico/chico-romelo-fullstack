import { Item, Num, Name, Tag, Duration, ListEl } from './TrackItem.styles'

/**
 * TrackItem — a single row in a tracklist.
 * Wrap several in <TrackItem.List>.
 */
export function TrackItem({ num, name, duration, tag, onClick, ...rest }) {
  return (
    <Item $clickable={!!onClick} onClick={onClick} {...rest}>
      <Num>{num}</Num>
      <Name>{name}</Name>
      {tag && <Tag>{tag}</Tag>}
      {duration && <Duration>{duration}</Duration>}
    </Item>
  )
}

/**
 * TrackItem.List — wraps TrackItems in a styled <ol>
 */
TrackItem.List = function TrackList({ children, ...rest }) {
  return <ListEl {...rest}>{children}</ListEl>
}
