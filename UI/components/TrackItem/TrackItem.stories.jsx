import { TrackItem } from './TrackItem'

const TRACKS = [
  { num: '01', name: '2 de Fevereiro', duration: '3:42', tag: 'Regravação' },
  { num: '02', name: 'Teste Drive', duration: '2:58' },
  { num: '03', name: 'Passatempo', duration: '4:11' },
  { num: '04', name: 'Beira do Rio', duration: '3:29', tag: 'Inédita' },
]

export default {
  title: 'Design System/TrackItem',
  component: TrackItem,
  parameters: { layout: 'padded' },
}

export const SingleItem = {
  render: () => (
    <TrackItem.List>
      <TrackItem num="01" name="2 de Fevereiro" duration="3:42" tag="Regravação" />
    </TrackItem.List>
  ),
}

export const FullTracklist = {
  render: () => (
    <TrackItem.List style={{ maxWidth: 560 }}>
      {TRACKS.map(t => (
        <TrackItem key={t.num} {...t} onClick={() => alert(`Playing: ${t.name}`)} />
      ))}
    </TrackItem.List>
  ),
}
