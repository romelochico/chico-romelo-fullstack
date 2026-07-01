import Head from 'next/head'
import Nav from '../components/Nav/Nav'
import Footer from '../components/Footer/Footer'
import PageHero from '../components/PageHero/PageHero'
import Marquee from '../components/Marquee/Marquee'
import EyeMarqueeGroup from '../components/EyeMarqueeGroup/EyeMarqueeGroup'
import SectionLabel from '../components/SectionLabel/SectionLabel'
import StreamBtn from '../components/StreamBtn/StreamBtn'
import StreamingModal from '../components/StreamingModal/StreamingModal'
import TrackList from '../components/TrackList/TrackList'
import { IconSpotify, IconAppleMusic } from '../components/Icons/Icons'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useStreamingModal } from '../hooks/useStreamingModal'
import { EP, SINGLES } from '../lib/data'
import DecoStamp from '../components/DecoStamp/DecoStamp'
import {
  EpSection, EpInner, EpCoverWrap, EpCover, EpSticker, EpDetail,
  EpEyebrow, EpTitle, EpSub, StreamingRow,
  SinglesSection, SinglesHeader, SinglesGrid, SingleCard, SingleStrap,
  SingleInfo, SingleName, SingleMeta, SingleLinks,
} from '../styles/pages/Lancamentos.styles'

const MARQUEE_1 = ['EP · Chico Romelo', '4 faixas', '2 de Fevereiro · Teste Drive · Passatempo · Beira do Rio']
const MARQUEE_2 = ['Singles · 2024–2025', '2 de Fevereiro · Passatempo · Teste Drive']

export default function LancamentosPage() {
  useScrollReveal()
  const { modal, openModal, closeModal } = useStreamingModal()

  return (
    <>
      <Head>
        <title>CR | Lançamentos</title>
        <meta name="description" content="Discografia de Chico Romelo: EP, singles e todos os lançamentos. Ouça no Spotify, Apple Music e YouTube." />
        <link rel="canonical" href="https://www.chicoromelo.com/lancamentos" />
        <link rel="preload" as="image" href="/uploads/_MG_2546.webp" type="image/webp" fetchPriority="high" />
      </Head>

      <Nav innerPage />

      <PageHero
        label="Discografia"
        title={<>Lança<span className="outline">mentos</span></>}
        imageSrc="/uploads/_MG_2546.webp"
        imageJpg="/uploads/_MG_2546.jpg"
        imageAlt="Chico Romelo ao vivo"
        priority
      />

      <Marquee items={MARQUEE_1} />

      {/* ── EP ── */}
      <EpSection>
        <DecoStamp position="top-right" />

        <EpInner>
          <EpCoverWrap
            data-reveal
            onClick={() => openModal({ cover: EP.cover, title: 'Chico Romelo — EP', spotify: EP.spotify, apple: EP.apple, youtube: EP.youtube })}
          >
            <EpCover>
              <picture>
                <source srcSet={EP.cover} type="image/webp" />
                <img src={EP.coverJpg} alt="Chico Romelo — EP" loading="lazy" decoding="async" />
              </picture>
            </EpCover>
            <EpSticker>OUT<br />NOW<span>★ 2025 ★</span></EpSticker>
          </EpCoverWrap>

          <EpDetail data-reveal>
            <SectionLabel>01 · EP de Estreia</SectionLabel>
            <EpEyebrow>EP · 2025</EpEyebrow>
            <EpTitle>Chico<br />Romelo</EpTitle>
            <EpSub>4 faixas · gravado em Lisboa · 2025</EpSub>

            <TrackList tracks={EP.tracks} onTrackClick={openModal} />

            <StreamingRow>
              <StreamBtn platform="spotify" href={EP.spotify} />
              <StreamBtn platform="apple"   href={EP.apple} />
              <StreamBtn platform="youtube" href={EP.youtube} />
            </StreamingRow>
          </EpDetail>
        </EpInner>
      </EpSection>

      <EyeMarqueeGroup items={MARQUEE_2} />

      {/* ── SINGLES ── */}
      <SinglesSection>
        <DecoStamp position="top-left" />

        <SinglesHeader>
          <div className="ed">2024 — 2025</div>
          <h2>Singles</h2>
          <div className="ed">3 Lançamentos</div>
        </SinglesHeader>

        <SinglesGrid>
          {SINGLES.map((s) => (
            <SingleCard
              key={s.name}
              data-reveal
              onClick={() => openModal({ cover: s.cover, title: s.name, spotify: s.spotify, apple: s.apple, youtube: s.youtube })}
            >
              <SingleStrap>{s.strap}</SingleStrap>
              <picture>
                <source srcSet={s.cover} type="image/webp" />
                <img src={s.coverPng} alt={s.name} loading="lazy" decoding="async" />
              </picture>
              <SingleInfo>
                <SingleName>{s.name}</SingleName>
                <SingleMeta>{s.meta}</SingleMeta>
                <SingleLinks>
                  <a href={s.spotify} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <IconSpotify size={14} /> Spotify
                  </a>
                  <a href={s.apple} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <IconAppleMusic size={14} /> Apple
                  </a>
                </SingleLinks>
              </SingleInfo>
            </SingleCard>
          ))}
        </SinglesGrid>
      </SinglesSection>

      <Footer />
      <StreamingModal isOpen={!!modal} onClose={closeModal} modal={modal} />
    </>
  )
}
