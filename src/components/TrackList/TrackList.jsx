import { List, TrackItem, Num, TrackName, Tag, Dur } from './TrackList.styles'

/**
 * @param {{ num, name, dur, tag, cover, spotify, apple, youtube }[]} tracks
 * @param {Function} onTrackClick – called with { cover, title, spotify, apple, youtube }
 */
export default function TrackList({ tracks = [], onTrackClick }) {
  return (
    <List>
      {tracks.map((track) => (
        <TrackItem
          key={track.num}
          onClick={() => onTrackClick?.({
            cover:   track.cover,
            title:   track.name,
            spotify: track.spotify,
            apple:   track.apple,
            youtube: track.youtube,
          })}
        >
          <Num>{track.num}</Num>
          <TrackName>{track.name}</TrackName>
          {track.tag && <Tag>{track.tag}</Tag>}
          <Dur>{track.dur}</Dur>
        </TrackItem>
      ))}
    </List>
  )
}
