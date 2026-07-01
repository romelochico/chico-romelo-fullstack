import Head from 'next/head'
import Link from 'next/link'
import { useRef } from 'react'
import Nav from '../components/Nav/Nav'
import Footer from '../components/Footer/Footer'
import Marquee from '../components/Marquee/Marquee'
import EyeMarqueeGroup from '../components/EyeMarqueeGroup/EyeMarqueeGroup'
import SectionLabel from '../components/SectionLabel/SectionLabel'
import StreamBtn from '../components/StreamBtn/StreamBtn'
import StreamingModal from '../components/StreamingModal/StreamingModal'
import TrackList from '../components/TrackList/TrackList'
import Clipping from '../components/Clipping/Clipping'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useEffect, useState } from 'react'
import { useStreamingModal } from '../hooks/useStreamingModal'
import { EP, SINGLES } from '../lib/data'
import { supabase } from '../lib/supabase/public'
import { toClippingProps } from '../lib/novidades'
import DecoStamp from '../components/DecoStamp/DecoStamp'
import {
  Hero, HeroBg, HeroLockup, HeroCta,
  BandaSection, BandaInner, BandaCopy, Kicker, Lead, BodyP,
  Collage, Piece, PieceCap,
  CollageT1, CollageT2, CollageT3, StampOuca, StampNovo, ColScribbleArrow, ColScribbleText,
  MusicasSection, MusicasHeader, MusicasMeta, MusicasGrid,
  EpCard, EpCoverWrap, EpSticker, EpInfo, EpEyebrow, EpTitle, EpSub,
  StreamingRow, OutrosH, Outros, OutroCard,
  NovidadesSection, NewsHead, NewsGrid,
} from '../styles/pages/Home.styles'

const MARQUEE_1 = ['Novo EP fora', 'Chico Romelo', 'Som brasileiro entre Lisboa e a rua', 'Ao vivo']
const MARQUEE_2 = ['EP · Chico Romelo', '4 faixas', '2 de Fevereiro · Teste Drive · Passatempo · Beira do Rio']
const MARQUEE_3 = ['Novidades', 'Shows · Estúdio · Imprensa', 'Fique ligado']

const COLLAGE_PIECES = [
  { src: '/assets/band.webp',         jpg: '/assets/band.jpg',         alt: 'Chico Romelo ao vivo',        cap: 'ao vivo · 2025' },
  { src: '/assets/member-2.webp',     jpg: '/assets/member-2.jpg',     alt: 'Chico Romelo no palco',      cap: 'energia no palco' },
  { src: '/assets/member-3.webp',     jpg: '/assets/member-3.jpg',     alt: 'Ensaio — Chico Romelo',      cap: 'ensaio · lisboa' },
  { src: '/assets/member-4.webp',     jpg: '/assets/member-4.jpg',     alt: 'Marcus Quintela — vocalista', cap: 'voz e guitarra' },
  { src: '/assets/renan-live.webp',   jpg: '/assets/renan-live.jpg',   alt: 'Renan Castro — bateria',     cap: 'na bateria' },
]

// Piece CSS positions per breakpoint (desktop)
const PIECE_STYLES = [
  { top: 20,  left: 180, width: 200, height: 172, objectPosition: 'center 30%', animation: 'polaroid-in-1 0.8s cubic-bezier(0.22,0.61,0.36,1) 0.1s forwards' },
  { top: 50,  left: 380, width: 235, height: 215, objectPosition: undefined,     animation: 'polaroid-in-2 0.8s cubic-bezier(0.22,0.61,0.36,1) 0.25s forwards', zIndex: 3 },
  { top: 250, left: 400, width: 255, height: 212, objectPosition: 'center 20%', animation: 'polaroid-in-3 0.8s cubic-bezier(0.22,0.61,0.36,1) 0.4s forwards',  zIndex: 2 },
  { top: 230, left: 180, width: 196, height: 222, objectPosition: 'center 15%', animation: 'polaroid-in-4 0.8s cubic-bezier(0.22,0.61,0.36,1) 0.55s forwards' },
  { top: 440, left: 190, width: 222, height: 158, objectPosition: 'center 25%', animation: 'polaroid-in-5 0.8s cubic-bezier(0.22,0.61,0.36,1) 0.7s forwards' },
]

const ANIM_NAMES = [
  'polaroid-in-1',
  'polaroid-in-2',
  'polaroid-in-3',
  'polaroid-in-4',
  'polaroid-in-5',
]

export default function HomePage({ novidades = [] }) {
  const collageRef = useRef(null)
  const heroBgRef = useRef(null)
  const [collageRevealed, setCollageRevealed] = useState(false)
  useScrollReveal()
  const { modal, openModal, closeModal } = useStreamingModal()

  useEffect(() => {
    const el = heroBgRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    function onScroll() {
      el.style.transform = `translateY(${window.scrollY * 0.38}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = collageRef.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { setCollageRevealed(true); return }
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setCollageRevealed(true); io.disconnect() } },
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <Head>
        <title>Chico Romelo | Banda de Rock Brasileiro em Lisboa</title>
        <meta name="description" content="Chico Romelo é uma banda de pop rock e MPB em Lisboa. Ouça o EP de estreia e os singles no Spotify, Apple Music e YouTube." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.chicoromelo.com" />
        <meta property="og:type" content="music.musician" />
        <meta property="og:title" content="Chico Romelo — Banda de Rock Brasileiro em Lisboa" />
        <meta property="og:description" content="Chico Romelo é uma banda de pop rock e MPB em Lisboa. Ouça o EP de estreia e os singles no Spotify, Apple Music e YouTube." />
        <meta property="og:url" content="https://www.chicoromelo.com" />
        <meta property="og:image" content="https://www.chicoromelo.com/uploads/thumbnail-photo.jpg" />
        <meta property="og:site_name" content="Chico Romelo" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Chico Romelo — Banda de Rock Brasileiro em Lisboa" />
        <meta name="twitter:description" content="Chico Romelo é uma banda de pop rock e MPB em Lisboa. Ouça o EP de estreia e os singles no Spotify, Apple Music e YouTube." />
        <meta name="twitter:image" content="https://www.chicoromelo.com/uploads/thumbnail-photo.jpg" />
        <link rel="preload" as="image" href="/assets/logo-full.webp" type="image/webp" fetchPriority="high" />
      </Head>

      <Nav />

      {/* ── HERO ── */}
      <Hero>
        <HeroBg ref={heroBgRef}>
          {/* watermark marks — top-right and bottom-left corners */}
          <img src="/assets/logo-mobile.png" alt="" aria-hidden="true" className="bg-mark bg-mark-tr" />
          <img src="/assets/logo-mobile.png" alt="" aria-hidden="true" className="bg-mark bg-mark-bl" />
          <div className="bg-vignette" />
        </HeroBg>

        <h1 className="sr-only">Chico Romelo — Banda de Rock Brasileiro em Lisboa</h1>

        <HeroLockup>
          <picture>
            <source srcSet="/assets/logo-full.webp" type="image/webp" />
            <img className="logo-full" src="/assets/logo-full.png" alt="CHICO ROMELO" width={11419} height={1229} loading="eager" decoding="async" />
          </picture>
          <picture>
            <source srcSet="/assets/logo-mobile.webp" type="image/webp" />
            <img className="logo-mobile" src="/assets/logo-mobile.png" alt="CHICO ROMELO" width={8273} height={3172} loading="eager" decoding="async" />
          </picture>
        </HeroLockup>

        <HeroCta
          onClick={() => openModal({ cover: EP.cover, title: 'Chico Romelo — EP', spotify: EP.spotify, apple: EP.apple, youtube: EP.youtube })}
        >
          Ouça já →
        </HeroCta>
      </Hero>

      <Marquee items={MARQUEE_1} />

      {/* ── A BANDA ── */}
      <BandaSection id="banda">
        <DecoStamp position="top-right" />

        <BandaInner>
          <BandaCopy>
            <SectionLabel>01 · A Banda</SectionLabel>
            <Kicker>
              Som <em>brasileiro</em><br />
              <span className="outline">entre Lisboa</span><br />
              e a rua.
            </Kicker>
            <Lead>A <b>Chico Romelo</b> nasce em Lisboa. Um som que cruza música brasileira, palco e cidade.</Lead>
            <BodyP>Energia ao vivo, proximidade com o público e vida de rua. Cinco vozes, uma batida só — feita para os bares pequenos, as praças cheias e tudo o que houver no meio.</BodyP>
          </BandaCopy>

          {/* Collage */}
          <Collage ref={collageRef}>
            <CollageT1 className={collageRevealed ? 'revealed' : ''} />
            <CollageT2 className={collageRevealed ? 'revealed' : ''} />
            <CollageT3 className={collageRevealed ? 'revealed' : ''} />

            {COLLAGE_PIECES.map((p, i) => {
              const s = PIECE_STYLES[i]
              return (
                <Piece
                  key={i}
                  $top={s.top}
                  $left={s.left}
                  $width={s.width}
                  $height={s.height}
                  $zIndex={s.zIndex}
                  $animName={ANIM_NAMES[i]}
                  $delay={`${0.1 + i * 0.15}s`}
                  $objectPos={s.objectPosition}
                  className={`piece piece-${i + 1}${collageRevealed ? ' revealed' : ''}`}
                >
                  <picture>
                    <source srcSet={p.src} type="image/webp" />
                    <img src={p.jpg} alt={p.alt} loading="lazy" decoding="async" />
                  </picture>
                  <PieceCap>{p.cap}</PieceCap>
                </Piece>
              )
            })}

            <StampOuca className={collageRevealed ? 'revealed' : ''}>★ ouça já</StampOuca>
            <StampNovo  className={collageRevealed ? 'revealed' : ''}>novo · 2025</StampNovo>
            <ColScribbleArrow className={collageRevealed ? 'revealed' : ''}>
              <svg width="110" height="54" viewBox="0 0 120 60" fill="none">
                <path d="M5 30 C 25 5, 55 5, 75 25 S 110 50, 115 35" stroke="#404015" strokeWidth="3" strokeLinecap="round" />
                <path d="M105 28 L115 35 L107 42" stroke="#404015" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            </ColScribbleArrow>
            <ColScribbleText className={collageRevealed ? 'revealed' : ''}>som da rua!</ColScribbleText>
          </Collage>
        </BandaInner>
      </BandaSection>

      <EyeMarqueeGroup items={MARQUEE_2} />

      {/* ── MÚSICAS ── */}
      <MusicasSection id="musicas">
        <DecoStamp position="top-right" />

        <MusicasHeader>
          <div>
            <SectionLabel>02 · Lançamentos</SectionLabel>
            <Kicker $noMargin>
              Músicas<br /><span className="outline">para</span> <em>ouvir alto.</em>
            </Kicker>
          </div>
          <MusicasMeta>
            // EP DE ESTREIA<br />
            // GRAVADO EM LISBOA<br />
            // 4 FAIXAS · 2025
          </MusicasMeta>
        </MusicasHeader>

        <MusicasGrid>
          <EpCard data-reveal>
            <EpCoverWrap
              onClick={() => openModal({ cover: EP.cover, title: 'Chico Romelo — EP', spotify: EP.spotify, apple: EP.apple, youtube: EP.youtube })}
            >
              <picture>
                <source srcSet={EP.cover} type="image/webp" />
                <img src={EP.coverJpg} alt="Chico Romelo — EP" loading="lazy" decoding="async" />
              </picture>
            </EpCoverWrap>
            <EpSticker>OUT<br />NOW<span>★ 2025 ★</span></EpSticker>
          </EpCard>

          <EpInfo data-reveal>
            <EpEyebrow>EP · 2025</EpEyebrow>
            <EpTitle>Chico<br />Romelo</EpTitle>
            <EpSub>4 faixas · gravado em Lisboa · 2025</EpSub>

            <TrackList tracks={EP.tracks} onTrackClick={openModal} />

            <StreamingRow>
              <StreamBtn platform="spotify" href={EP.spotify} />
              <StreamBtn platform="apple"   href={EP.apple} />
              <StreamBtn platform="youtube" href={EP.youtube} />
            </StreamingRow>

            <OutrosH>Outros lançamentos</OutrosH>
            <Outros>
              {SINGLES.map((s) => (
                <OutroCard
                  key={s.name}
                  onClick={() => openModal({ cover: s.cover, title: s.name, spotify: s.spotify, apple: s.apple, youtube: s.youtube })}
                >
                  <picture>
                    <source srcSet={s.cover} type="image/webp" />
                    <img src={s.coverPng} alt={s.name} loading="lazy" decoding="async" />
                  </picture>
                  <div className="cap">{s.name}</div>
                </OutroCard>
              ))}
            </Outros>
          </EpInfo>
        </MusicasGrid>
      </MusicasSection>

      <Marquee items={MARQUEE_3} />

      {/* ── NOVIDADES ── */}
      <NovidadesSection id="novidades">
        <NewsHead>
          <div className="ed">Vol. 01 · Nº 03</div>
          <h2>Novidades</h2>
          <div className="ed">Lisboa · 2026</div>
        </NewsHead>
        <NewsGrid>
          {novidades.map((n) => <Clipping key={n.id} {...toClippingProps(n)} />)}
        </NewsGrid>
      </NovidadesSection>

      <Footer />

      <StreamingModal isOpen={!!modal} onClose={closeModal} modal={modal} />
    </>
  )
}

export async function getStaticProps() {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('id, title, strap, date_label, body, link_url, link_label, created_at, image:media!image_id(id, storage_path, bucket, alt_text)')
      .eq('published', true)
      .order('order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) throw error
    return { props: { novidades: data ?? [] }, revalidate: 60 }
  } catch (e) {
    console.error('[getStaticProps/index]', e)
    return { props: { novidades: [] }, revalidate: 30 }
  }
}
