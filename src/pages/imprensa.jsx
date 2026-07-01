import Head from 'next/head'
import Nav from '../components/Nav/Nav'
import Footer from '../components/Footer/Footer'
import PageHero from '../components/PageHero/PageHero'
import Marquee from '../components/Marquee/Marquee'
import EyeMarqueeGroup from '../components/EyeMarqueeGroup/EyeMarqueeGroup'
import SectionLabel from '../components/SectionLabel/SectionLabel'
import { IconDownload } from '../components/Icons/Icons'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { PRESS_FACTS, PRESS_PHOTOS } from '../lib/data'
import DecoStamp from '../components/DecoStamp/DecoStamp'
import {
  PressIntro, PressIntroInner, PressBio, Kicker, KickerLogos, LogoStampImg,
  PressSidebar, PressFactCard, FactRow, FactLabel, FactValue,
  PressDownloadCard, DownloadBtn,
  PhotosSection, PhotosHeader, PhotosGrid, PressPhoto, DlBadge,
  VideoSection, VideoInner, VideoHeader, VideoKicker, VideoSub, VideoWrap,
  LogosSection, LogosInner, LogosGrid, LogoCard,
} from '../styles/pages/Imprensa.styles'

const MARQUEE_1 = ['Press Kit · Chico Romelo', 'Fotos · Logos · Bio', 'Para uso editorial']
const MARQUEE_2 = ['Fotos de imprensa', 'Alta resolução · Uso editorial livre']

export default function ImprensaPage() {
  useScrollReveal()

  return (
    <>
      <Head>
        <title>Chico Romelo | Imprensa e Press Kit</title>
        <meta name="description" content="Press kit de Chico Romelo: fotos de alta resolução, biografias, cobertura de mídia e contatos para imprensa." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.chicoromelo.com/imprensa" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Chico Romelo — Imprensa e Press Kit" />
        <meta property="og:description" content="Press kit de Chico Romelo: fotos de alta resolução, biografias, cobertura de mídia e contatos para imprensa." />
        <meta property="og:url" content="https://www.chicoromelo.com/imprensa" />
        <meta property="og:image" content="https://www.chicoromelo.com/uploads/thumbnail-photo.jpg" />
        <meta property="og:site_name" content="Chico Romelo" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Chico Romelo — Imprensa e Press Kit" />
        <meta name="twitter:description" content="Press kit de Chico Romelo: fotos de alta resolução, biografias, cobertura de mídia e contatos para imprensa." />
        <meta name="twitter:image" content="https://www.chicoromelo.com/uploads/thumbnail-photo.jpg" />
        <link rel="preload" as="image" href="/assets/renan-live.webp" type="image/webp" fetchPriority="high" />
      </Head>

      <Nav innerPage />

      <PageHero
        label="Press Kit"
        title={<>Im<span className="outline">pren</span>sa</>}
        imageSrc="/assets/renan-live.webp"
        imageJpg="/assets/renan-live.jpg"
        imageAlt="Renan Castro — bateria ao vivo"
        imagePos="center 15%"
        priority
      />

      <Marquee items={MARQUEE_1} />

      {/* ── BIO + SIDEBAR ── */}
      <PressIntro>
        <DecoStamp position="top-left" />

        <PressIntroInner>
          <PressBio>
            <SectionLabel>Press Kit</SectionLabel>
            <Kicker>Biografia<br /><span className="outline">oficial.</span></Kicker>
            <p className="lead">Chico Romelo é uma banda formada por músicos brasileiros e portugueses radicados em Lisboa, misturando pop rock com fortes influências da música brasileira, latino-americana e cabo-verdiana.</p>
            <p>Nascida do cruzamento entre a canção brasileira, o pop-rock e os ritmos latinos que ecoam por Lisboa, a banda constrói um som que fala de gente, de rua e de pertencimento.</p>
            <p>Nos palcos, essa energia já passou por espaços marcantes da cidade como o Titanic, o mySpot (Nirvana Studios) e o Hollywood Spot.</p>
            <p>O grupo é composto por Marcus Quintela (guitarra e voz principal), Gabriel Almeida (baixo), Cris Prata (teclado e vocais), Renan Castro (bateria e vocais) e Danillo Vieira (segunda guitarra e vocais).</p>
          </PressBio>

          <PressSidebar>
            <PressFactCard>
              <h4>Ficha Técnica</h4>
              {PRESS_FACTS.map((f) => (
                <FactRow key={f.label}>
                  <FactLabel>{f.label}</FactLabel>
                  <FactValue>{f.value}</FactValue>
                </FactRow>
              ))}
            </PressFactCard>

            <PressDownloadCard>
              <h4>Download</h4>
              <p>Bio completa, fotos em alta resolução e logotipos para uso editorial.</p>
              <DownloadBtn
                href="https://github.com/romelochico/chico-romelo-site/releases/download/press-kit-v1/Chico.Comelo.Preskit.zip"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconDownload size={16} />
                Download Press Kit
              </DownloadBtn>
            </PressDownloadCard>
          </PressSidebar>
        </PressIntroInner>
      </PressIntro>

      <EyeMarqueeGroup items={MARQUEE_2} />

      {/* ── PHOTOS ── */}
      <PhotosSection>
        <PhotosHeader>
          <div className="ed">Galeria</div>
          <h2>Fotos</h2>
          <div className="ed">Hi-Res</div>
        </PhotosHeader>

        <PhotosGrid>
          {PRESS_PHOTOS.map((p) => (
            <PressPhoto key={p.src} data-reveal>
              <DlBadge href={p.jpg} download={p.download} aria-label="Download foto" onClick={(e) => e.stopPropagation()}>
                <IconDownload size={14} />
              </DlBadge>
              <picture>
                <source srcSet={p.src} type="image/webp" />
                <img src={p.jpg} alt={p.alt} loading="lazy" decoding="async" />
              </picture>
              <div className="cap">{p.cap}</div>
            </PressPhoto>
          ))}
        </PhotosGrid>
      </PhotosSection>

      {/* ── VIDEO ── */}
      <VideoSection>
        <VideoInner>
          <VideoHeader>
            <SectionLabel>Ao Vivo</SectionLabel>
            <VideoKicker>Ver a<br /><span className="outline">banda.</span></VideoKicker>
            <VideoSub>Registro ao vivo — energia, palco e público.</VideoSub>
          </VideoHeader>
          <VideoWrap data-reveal>
            <iframe
              src="https://www.youtube.com/embed/4n8EmuvIurw"
              title="Chico Romelo — Ao Vivo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </VideoWrap>
        </VideoInner>
      </VideoSection>

      {/* ── LOGOS ── */}
      <LogosSection>
        <LogosInner>
          <div>
            <SectionLabel>Logotipos</SectionLabel>
            <KickerLogos>
              Logos &amp;<br /><span className="outline">Marca.</span>
            </KickerLogos>
          </div>
          <LogosGrid>
            <LogoCard data-reveal>
              <img src="/assets/logo-full.png" alt="Logo completo" loading="lazy" />
              <span>Logo completo · Cream</span>
            </LogoCard>
            <LogoCard $dark data-reveal>
              <img src="/assets/logo-full.png" alt="Logo — fundo escuro" loading="lazy" />
              <span>Logo completo · Dark</span>
            </LogoCard>
            <LogoCard $olive data-reveal>
              <img src="/assets/logo-full.png" alt="Logo — fundo olive" loading="lazy" />
              <span>Logo completo · Olive</span>
            </LogoCard>
            <LogoCard $dark data-reveal>
              <LogoStampImg src="/assets/logo-stamp.png" alt="Logo stamp" loading="lazy" />
              <span>Stamp · Circular</span>
            </LogoCard>
          </LogosGrid>
        </LogosInner>
      </LogosSection>

      <Footer />
    </>
  )
}
