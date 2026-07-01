import Head from 'next/head'
import Link from 'next/link'
import Nav from '../components/Nav/Nav'
import Footer from '../components/Footer/Footer'
import PageHero from '../components/PageHero/PageHero'
import Marquee from '../components/Marquee/Marquee'
import Clipping from '../components/Clipping/Clipping'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { supabase } from '../lib/supabase/public'
import { toClippingProps } from '../lib/novidades'
import { NewsSection, NewsHead, NewsGrid, CtaStrip, CtaInner, BtnPrimary } from '../styles/pages/Novidades.styles'
import type { GetStaticProps } from 'next'
import type { NewsRow } from '../types'

const MARQUEE = ['Prémios · Shows · Novos lançamentos', 'Lisboa · 2026', 'Acompanhe a banda']

interface NovidadesPageProps {
  novidades: NewsRow[]
}

export default function NovidadesPage({ novidades }: NovidadesPageProps) {
  useScrollReveal()

  return (
    <>
      <Head>
        <title>Chico Romelo | Novidades</title>
        <meta name="description" content="Últimas notícias da Chico Romelo: prêmios, shows e novidades da banda de pop rock brasileira em Lisboa." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.chicoromelo.com/novidades" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Chico Romelo — Novidades" />
        <meta property="og:description" content="Últimas notícias da Chico Romelo: prêmios, shows e novidades da banda de pop rock brasileira em Lisboa." />
        <meta property="og:url" content="https://www.chicoromelo.com/novidades" />
        <meta property="og:image" content="https://www.chicoromelo.com/uploads/thumbnail-photo.jpg" />
        <meta property="og:site_name" content="Chico Romelo" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Chico Romelo — Novidades" />
        <meta name="twitter:description" content="Últimas notícias da Chico Romelo: prêmios, shows e novidades da banda de pop rock brasileira em Lisboa." />
        <meta name="twitter:image" content="https://www.chicoromelo.com/uploads/thumbnail-photo.jpg" />
        <link rel="preload" as="image" href="/uploads/cris-prata-live.webp" type="image/webp" fetchPriority="high" />
      </Head>

      <Nav innerPage />

      <PageHero
        label="Novidades"
        title="Notícias"
        imageSrc="/uploads/cris-prata-live.webp"
        imageJpg="/uploads/cris-prata-live.jpg"
        imageAlt="Cris Prata ao teclado"
        priority
      />

      <Marquee items={MARQUEE} />

      <NewsSection>
        <NewsHead>
          <div className="ed">Vol. 01 · Nº 01</div>
          <h2>Novidades</h2>
          <div className="ed">Lisboa · 2026</div>
        </NewsHead>
        <NewsGrid>
          {novidades.map((n) => <Clipping key={n.id} {...toClippingProps(n)} />)}
        </NewsGrid>
      </NewsSection>

      <CtaStrip data-reveal>
        <CtaInner>
          <p>Quer ver a Chico Romelo ao vivo?</p>
          <Link href="/agenda" passHref legacyBehavior>
            <BtnPrimary as="a">Ver agenda completa →</BtnPrimary>
          </Link>
        </CtaInner>
      </CtaStrip>

      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<NovidadesPageProps> = async () => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('id, title, strap, date_label, body, link_url, link_label, created_at, image:media!image_id(id, storage_path, bucket, alt_text)')
      .eq('published', true)
      .order('order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) throw error
    return { props: { novidades: (data ?? []) as unknown as NewsRow[] }, revalidate: 60 }
  } catch (e) {
    console.error('[getStaticProps/novidades]', e)
    return { props: { novidades: [] }, revalidate: 30 }
  }
}
