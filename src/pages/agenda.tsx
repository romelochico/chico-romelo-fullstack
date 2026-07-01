import Head from 'next/head'
import Link from 'next/link'
import Nav from '../components/Nav/Nav'
import Footer from '../components/Footer/Footer'
import PageHero from '../components/PageHero/PageHero'
import Marquee from '../components/Marquee/Marquee'
import EyeMarqueeGroup from '../components/EyeMarqueeGroup/EyeMarqueeGroup'
import SectionLabel from '../components/SectionLabel/SectionLabel'
import ShowCard from '../components/ShowCard/ShowCard'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { supabase } from '../lib/supabase/public'
import { splitEvents, toShowCardProps } from '../lib/events'
import DecoStamp from '../components/DecoStamp/DecoStamp'
import type { GetStaticProps } from 'next'
import type { EventRow } from '../types'
import {
  AgendaSection, AgendaHeader, Kicker, EmptyShows,
  ShowList, CtaStrip, CtaInner, BtnPrimary,
} from '../styles/pages/Agenda.styles'

const MARQUEE_1 = ['Ao vivo em Lisboa e Portugal', '2026', 'Próximos shows']
const MARQUEE_2 = ['Pop Rock · MPB · Funaná · Afrobeat', 'Lisboa — Salvador — Santos']

interface AgendaPageProps {
  upcoming: EventRow[]
  past: EventRow[]
}

export default function AgendaPage({ upcoming, past }: AgendaPageProps) {
  useScrollReveal()

  return (
    <>
      <Head>
        <title>Chico Romelo | Agenda de Shows</title>
        <meta name="description" content="Agenda de shows da Chico Romelo em 2026: próximos concertos e histórico de apresentações ao vivo." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.chicoromelo.com/agenda" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Chico Romelo — Agenda de Shows" />
        <meta property="og:description" content="Agenda de shows da Chico Romelo em 2026: próximos concertos e histórico de apresentações ao vivo." />
        <meta property="og:url" content="https://www.chicoromelo.com/agenda" />
        <meta property="og:image" content="https://www.chicoromelo.com/uploads/thumbnail-photo.jpg" />
        <meta property="og:site_name" content="Chico Romelo" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Chico Romelo — Agenda de Shows" />
        <meta name="twitter:description" content="Agenda de shows da Chico Romelo em 2026: próximos concertos e histórico de apresentações ao vivo." />
        <meta name="twitter:image" content="https://www.chicoromelo.com/uploads/thumbnail-photo.jpg" />
        <link rel="preload" as="image" href="/uploads/_MG_2808.webp" type="image/webp" fetchPriority="high" />
      </Head>

      <Nav innerPage />

      <PageHero
        label="Ao Vivo"
        title="Agenda"
        imageSrc="/uploads/_MG_2808.webp"
        imageJpg="/uploads/_MG_2808.jpg"
        imageAlt="Chico Romelo ao vivo"
        priority
      />

      <Marquee items={MARQUEE_1} />

      {/* ── UPCOMING ── */}
      <AgendaSection>
        <DecoStamp position="top-right" />

        <AgendaHeader>
          <SectionLabel>Próximos Shows</SectionLabel>
          <Kicker>Próximas<br /><span className="outline">datas.</span></Kicker>
        </AgendaHeader>

        <ShowList>
          {upcoming.length > 0
            ? upcoming.map(e => <ShowCard key={e.id} {...toShowCardProps(e)} />)
            : <EmptyShows>Novos shows em breve.</EmptyShows>
          }
        </ShowList>
      </AgendaSection>

      <EyeMarqueeGroup items={MARQUEE_2} />

      {/* ── PAST ── */}
      <AgendaSection>
        <AgendaHeader>
          <SectionLabel>Histórico</SectionLabel>
          <Kicker>Shows<br /><span className="outline">anteriores.</span></Kicker>
        </AgendaHeader>

        <ShowList className="past">
          {past.map(e => <ShowCard key={e.id} {...toShowCardProps(e)} />)}
        </ShowList>
      </AgendaSection>

      {/* ── BOOKING CTA ── */}
      <CtaStrip data-reveal>
        <CtaInner>
          <p>Quer a Chico Romelo no seu evento?</p>
          <Link href="/contatos" passHref legacyBehavior>
            <BtnPrimary as="a">Fale conosco →</BtnPrimary>
          </Link>
        </CtaInner>
      </CtaStrip>

      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<AgendaPageProps> = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('id, date, title, venue, city, tags, badge, link_url, link_label, show_day')
      .order('date', { ascending: false })
      .limit(500)

    if (error) throw error

    const { upcoming, past } = splitEvents((data ?? []) as EventRow[])
    return { props: { upcoming, past }, revalidate: 86400 }
  } catch (e) {
    console.error('[getStaticProps/agenda]', e)
    return { props: { upcoming: [], past: [] }, revalidate: 60 }
  }
}
