import Link from 'next/link'
import { NAV_ALL, SOCIALS } from '../../lib/data'
import { IconInstagram, IconSpotify, IconYouTube } from '../Icons/Icons'
import {
  FooterEl,
  FooterGrid,
  FooterSocials,
  SocBtn,
  FooterLogoImg,
  FooterLogoMobile,
  FooterLogoFull,
  FooterLinks,
  FooterBottom,
} from './Footer.styles'

export default function Footer() {
  return (
    <FooterEl className="site-footer">
      <FooterGrid>
        <FooterLogoMobile>
          <FooterLogoImg
            src="/assets/logo-full.png"
            alt="Chico Romelo"
            width={11419}
            height={1229}
            loading="lazy"
          />
        </FooterLogoMobile>

        <FooterSocials>
          <SocBtn
            href={SOCIALS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <IconInstagram size={16} />
          </SocBtn>
          <SocBtn
            href={SOCIALS.spotify}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Spotify"
          >
            <IconSpotify size={16} />
          </SocBtn>
          <SocBtn
            href={SOCIALS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <IconYouTube size={16} />
          </SocBtn>
        </FooterSocials>

        <FooterLogoFull>
          <FooterLogoImg
            src="/assets/logo-full.png"
            alt="Chico Romelo"
            width={11419}
            height={1229}
            loading="lazy"
          />
        </FooterLogoFull>

        <FooterLinks>
          {NAV_ALL.map(({ href, label }) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </FooterLinks>
      </FooterGrid>

      <FooterBottom>2026 © Chico Romelo</FooterBottom>
    </FooterEl>
  )
}
