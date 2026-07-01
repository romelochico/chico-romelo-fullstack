import Head from 'next/head'
import { useState } from 'react'
import Nav from '../components/Nav/Nav'
import Footer from '../components/Footer/Footer'
import PageHero from '../components/PageHero/PageHero'
import Marquee from '../components/Marquee/Marquee'
import SectionLabel from '../components/SectionLabel/SectionLabel'
import { IconInstagram, IconSpotify, IconAppleMusic, IconYouTube, IconEmail, IconPin } from '../components/Icons/Icons'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SOCIALS } from '../lib/data'
import DecoStamp from '../components/DecoStamp/DecoStamp'
import {
  ErrorMsg, ContactSection, ContactInner,
  FormWrap, Kicker, ContactForm, FormRow, FormGroup,
  FormInput, FormSelect, FormTextarea, SubmitBtn, FormSuccess,
  Sidebar, DirectCard, DirectRow, DirectContent, DirectLabel, DirectValue,
  SocialCard, SocialLinks, SocialLink, LocationStamp,
} from '../styles/pages/Contatos.styles'

const MARQUEE = ['Booking · Imprensa · Parcerias', 'romelochico@gmail.com', 'Lisboa, Portugal']

const SOCIAL_LIST = [
  { href: SOCIALS.instagram,  Icon: IconInstagram,  name: 'Instagram' },
  { href: SOCIALS.spotify,    Icon: IconSpotify,    name: 'Spotify' },
  { href: SOCIALS.appleMusic, Icon: IconAppleMusic, name: 'Apple Music' },
  { href: SOCIALS.youtube,    Icon: IconYouTube,    name: 'YouTube' },
]

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID

export default function ContatosPage() {
  useScrollReveal()

  const [status,  setStatus]  = useState('idle')   // idle | sending | success | error
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'booking', message: '' })

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const [formspreeRes, apiRes] = await Promise.all([
        fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(formData),
        }),
        fetch('/api/contatos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }),
      ])
      setStatus(formspreeRes.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Head>
        <title>CR | Contatos</title>
        <meta name="description" content="Entre em contato com Chico Romelo para shows, parcerias, imprensa ou qualquer outro assunto." />
        <link rel="canonical" href="https://www.chicoromelo.com/contatos" />
        <link rel="preload" as="image" href="/uploads/_MG_2880.webp" type="image/webp" fetchPriority="high" />
      </Head>

      <Nav innerPage />

      <PageHero
        label="Fale conosco"
        title={<>Con<span className="outline">ta</span>tos</>}
        imageSrc="/uploads/_MG_2880.webp"
        imageJpg="/uploads/_MG_2880.jpg"
        imageAlt="Chico Romelo"
        priority
      />

      <Marquee items={MARQUEE} />

      <ContactSection>
        <DecoStamp position="top-left" />

        <ContactInner>
          {/* ── FORM ── */}
          <FormWrap>
            <SectionLabel>Contacto</SectionLabel>
            <Kicker>Nos envie<br />uma <em>mensagem.</em></Kicker>
            <p className="intro">Booking, parcerias, imprensa ou só para dizer olá — estamos ouvindo.</p>

            {status === 'success' ? (
              <FormSuccess $show>
                <h3>Mensagem enviada!</h3>
                <p>Obrigado pelo contato. Respondemos o mais rápido possível!</p>
              </FormSuccess>
            ) : (
              <ContactForm onSubmit={handleSubmit}>
                <FormRow>
                  <FormGroup>
                    <label htmlFor="name">Nome</label>
                    <FormInput id="name" name="name" type="text" placeholder="Seu nome" required
                      value={formData.name} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="email">Email</label>
                    <FormInput id="email" name="email" type="email" placeholder="email@exemplo.com" required
                      value={formData.email} onChange={handleChange} />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <label htmlFor="subject">Assunto</label>
                  <FormSelect id="subject" name="subject" value={formData.subject} onChange={handleChange}>
                    <option value="booking">Booking / Shows</option>
                    <option value="imprensa">Imprensa</option>
                    <option value="parceria">Parcerias</option>
                    <option value="outro">Outro</option>
                  </FormSelect>
                </FormGroup>

                <FormGroup>
                  <label htmlFor="message">Mensagem</label>
                  <FormTextarea id="message" name="message" placeholder="Sua mensagem..." required
                    value={formData.message} onChange={handleChange} />
                </FormGroup>

                {status === 'error' && (
                  <ErrorMsg>
                    Erro ao enviar. Tente novamente ou escreva para romelochico@gmail.com
                  </ErrorMsg>
                )}

                <SubmitBtn type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Enviando…' : 'Enviar mensagem →'}
                </SubmitBtn>
              </ContactForm>
            )}
          </FormWrap>

          {/* ── SIDEBAR ── */}
          <Sidebar>
            <DirectCard>
              <h4>Contacto direto</h4>
              <DirectRow>
                <IconEmail size={18} />
                <DirectContent>
                  <DirectLabel>Email</DirectLabel>
                  <DirectValue><a href="mailto:romelochico@gmail.com">romelochico@gmail.com</a></DirectValue>
                </DirectContent>
              </DirectRow>
              <DirectRow>
                <IconPin size={18} />
                <DirectContent>
                  <DirectLabel>Base</DirectLabel>
                  <DirectValue>Lisboa, Portugal</DirectValue>
                </DirectContent>
              </DirectRow>
            </DirectCard>

            <SocialCard>
              <h4>Redes sociais</h4>
              <SocialLinks>
                {SOCIAL_LIST.map(({ href, Icon, name }) => (
                  <SocialLink key={name} href={href} target="_blank" rel="noopener noreferrer">
                    <Icon size={22} />
                    <span className="name">{name}</span>
                    <span className="arrow">→</span>
                  </SocialLink>
                ))}
              </SocialLinks>
            </SocialCard>

            <LocationStamp>
              <IconPin size={32} />
              <span>Lisboa, Portugal<br />Som brasileiro entre Lisboa e a rua</span>
            </LocationStamp>
          </Sidebar>
        </ContactInner>
      </ContactSection>

      <Footer />
    </>
  )
}
