import { List, TrackItem, Num, TrackName, Tag, Dur } from './TrackList.styles'
import type { Track, StreamingModalData } from '../../types'

interface TrackListProps {
  tracks?: Track[]
  onTrackClick?: (data: StreamingModalData) => void
}

export default function TrackList({ tracks = [], onTrackClick }: TrackListProps) {
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
