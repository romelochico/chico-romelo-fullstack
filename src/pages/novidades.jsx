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

const MARQUEE = ['Prémios · Shows · Novos lançamentos', 'Lisboa · 2026', 'Acompanhe a banda']

export default function NovidadesPage({ novidades }) {
  useScrollReveal()

  return (
    <>
      <Head>
        <title>CR | Novidades</title>
        <meta name="description" content="Últimas notícias da Chico Romelo: prêmios, shows e novidades da banda de pop rock brasileira em Lisboa." />
        <link rel="canonical" href="https://www.chicoromelo.com/novidades" />
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

export async function getStaticProps() {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('id, title, strap, date_label, body, link_url, link_label, created_at, image:media!image_id(id, storage_path, bucket, alt_text)')
      .eq('published', true)
      .order('order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) throw error
    return { props: { novidades: data ?? [] }, revalidate: 60 }
  } catch {
    return { props: { novidades: [] }, revalidate: 30 }
  }
}
