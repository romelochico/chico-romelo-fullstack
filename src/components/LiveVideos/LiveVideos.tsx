import { useState } from 'react'
import SectionLabel from '../SectionLabel/SectionLabel'
import type { LiveSession } from '../../types'
import {
  Section,
  Inner,
  Header,
  Kicker,
  Meta,
  Player,
  Stage,
  StageCap,
  SideList,
  SideItem,
  PlayBadge,
} from './LiveVideos.styles'

interface LiveVideosProps {
  session: LiveSession
  /** Overline label, e.g. "03 · Ao Vivo". */
  label?: string
  id?: string
  /** Drop the section's bottom padding so it sits flush against what follows. */
  flush?: boolean
}

function PlayIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

export default function LiveVideos({
  session,
  label = 'Ao Vivo',
  id,
  flush = false,
}: LiveVideosProps) {
  const { videos } = session
  // order[0] is the video on the big stage; the rest sit in the side list.
  const [order, setOrder] = useState(() => videos.map((_, i) => i))
  const [started, setStarted] = useState(false)

  if (videos.length === 0) return null

  const activeIndex = order[0]
  const active = videos[activeIndex]

  function select(clicked: number) {
    setStarted(true)
    setOrder(prev => {
      if (prev[0] === clicked) return prev
      const wasActive = prev[0]
      const middle = prev.slice(1).filter(i => i !== clicked)
      // clicked jumps to the stage; the previous stage video goes to the end.
      return [clicked, ...middle, wasActive]
    })
  }

  const src =
    `https://www.youtube.com/embed/${active.id}?rel=0&modestbranding=1` +
    (started ? '&autoplay=1' : '')

  return (
    <Section id={id} $flush={flush}>
      <Inner>
        <Header>
          <SectionLabel>{label}</SectionLabel>
          <Kicker>
            Ao <span className="outline">vivo.</span>
          </Kicker>
          <Meta>
            {session.event} · {session.venue} · {session.date}
          </Meta>
        </Header>

        <Player>
          <div>
            <Stage>
              <iframe
                key={active.id}
                src={src}
                title={`${active.song} — ${session.event}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </Stage>
            <StageCap>
              {active.song} <span>— {session.event}</span>
            </StageCap>
          </div>

          <SideList>
            {order.slice(1).map(i => {
              const v = videos[i]
              return (
                <SideItem key={v.id} type="button" onClick={() => select(i)}>
                  <img
                    src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                    alt={`${v.song} — ao vivo`}
                    loading="lazy"
                    decoding="async"
                  />
                  <PlayBadge>
                    <PlayIcon />
                  </PlayBadge>
                  <span className="label">{v.song}</span>
                </SideItem>
              )
            })}
          </SideList>
        </Player>
      </Inner>
    </Section>
  )
}
