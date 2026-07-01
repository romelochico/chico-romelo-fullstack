import Head from 'next/head'
import Nav from '../components/Nav/Nav'
import Footer from '../components/Footer/Footer'
import PageHero from '../components/PageHero/PageHero'
import Marquee from '../components/Marquee/Marquee'
import EyeMarqueeGroup from '../components/EyeMarqueeGroup/EyeMarqueeGroup'
import SectionLabel from '../components/SectionLabel/SectionLabel'
import MemberCard from '../components/MemberCard/MemberCard'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { MEMBERS, LIVE_PHOTOS, VENUES } from '../lib/data'
import DecoStamp from '../components/DecoStamp/DecoStamp'
import {
  BioSection, BioInner, BioText, Kicker,
  BioPull, BioPhotoFrame, BioPhotoCap, BioTapeTop, BioTapeBottom, BioQuoteCard,
  MembersSection, MembersHeader, MembersGrid,
  LiveSection, LiveInner, LivePhotos, LivePhoto, LiveCopy, VenuesList,
} from '../styles/pages/Sobre.styles'

const MARQUEE_1 = ['Comunidade em movimento', 'Lisboa · Salvador · Santos', 'Cinco vozes, uma batida']
const MARQUEE_2 = ['Pop Rock · MPB · Funaná · Afrobeat', 'Lisboa — Salvador — Santos']

export default function SobrePage() {
  useScrollReveal()

  return (
    <>
      <Head>
        <title>CR | Sobre</title>
        <meta name="description" content="Conheça a Chico Romelo: cinco músicos brasileiros e portugueses em Lisboa que misturam pop rock, MPB e ritmos latinos." />
        <link rel="canonical" href="https://www.chicoromelo.com/sobre" />
        <link rel="preload" as="image" href="/uploads/AZ4A0489.webp" type="image/webp" fetchPriority="high" />
      </Head>

      <Nav innerPage />

      <PageHero
        label="A Banda"
        title="Sobre"
        imageSrc="/uploads/AZ4A0489.webp"
        imageJpg="/uploads/AZ4A0489.jpg"
        imageAlt="Chico Romelo ao vivo"
        priority
      />

      <Marquee items={MARQUEE_1} />

      {/* ── BIO ── */}
      <BioSection>
        <DecoStamp position="top-left" />

        <BioInner>
          <BioText>
            <SectionLabel>01 · A Banda</SectionLabel>
            <Kicker>Uma viagem<br /><span className="outline">musical.</span></Kicker>
            <p className="lead">Chico Romelo é mais do que uma banda — é um ponto de encontro.</p>
            <p>Nascida do cruzamento entre a canção brasileira, o pop-rock e os ritmos latinos que ecoam por Lisboa, a banda constrói um som que fala de gente, de rua e de pertencimento.</p>
            <p>Nos palcos, essa energia já passou por espaços marcantes da cidade como o Titanic, o mySpot (Nirvana Studios) e o Hollywood Spot, sempre com atuações intensas, próximas e cheias de troca com o público.</p>
            <p>Fora do palco, Chico Romelo se mistura ao próprio público: gente dos blocos de carnaval, das rodas de Samba e da cena de Jams and open mics em Lisboa.</p>
          </BioText>

          <BioPull>
            <BioPhotoFrame>
              <BioTapeTop />
              <BioTapeBottom />
              <picture>
                <source srcSet="/assets/band.webp" type="image/webp" />
                <img src="/assets/hero-photo.jpg" alt="Chico Romelo — grupo" loading="lazy" decoding="async" />
              </picture>
              <BioPhotoCap>chico romelo · lisboa · 2025</BioPhotoCap>
            </BioPhotoFrame>
            <BioQuoteCard>
              <p>Chico Romelo é comunidade em movimento. Um espaço onde música, cidade e pessoas se encontram, se misturam e continuam a tocar, mesmo quando o palco se apaga.</p>
              <div className="attr">— Manifesto da banda</div>
            </BioQuoteCard>
          </BioPull>
        </BioInner>
      </BioSection>

      <EyeMarqueeGroup items={MARQUEE_2} />

      {/* ── MEMBERS ── */}
      <MembersSection>
        <DecoStamp position="top-left" />
        <MembersHeader>
          <div className="ed">Vol. 01</div>
          <h2>A Banda</h2>
          <div className="ed">5 músicos</div>
        </MembersHeader>
        <MembersGrid>
          {MEMBERS.map((m) => <MemberCard key={m.name} {...m} />)}
        </MembersGrid>
      </MembersSection>

      {/* ── AO VIVO ── */}
      <LiveSection>
        <LiveInner>
          <LivePhotos data-reveal>
            {LIVE_PHOTOS.map((p) => (
              <LivePhoto key={p.src}>
                <picture>
                  <source srcSet={p.src} type="image/webp" />
                  <img src={p.jpg} alt={p.alt} loading="lazy" decoding="async" />
                </picture>
                <div className="cap">{p.cap}</div>
              </LivePhoto>
            ))}
          </LivePhotos>

          <LiveCopy data-reveal>
            <SectionLabel>02 · Ao Vivo</SectionLabel>
            <h3>Palcos<br />de Lisboa</h3>
            <p>Atuações intensas, próximas e cheias de troca com o público. A energia ao vivo é a alma da Chico Romelo.</p>
            <VenuesList>
              {VENUES.map((v) => (
                <li key={v.name}>
                  <span className="venue-name">{v.name}</span>
                  <span className="venue-loc">{v.loc}</span>
                </li>
              ))}
            </VenuesList>
          </LiveCopy>
        </LiveInner>
      </LiveSection>

      <Footer />
    </>
  )
}
