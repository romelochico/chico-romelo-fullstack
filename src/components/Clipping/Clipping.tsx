import Image from 'next/image'
import Link from 'next/link'
import { Article, Strap, DateTag, Title, ImageWrap, Lede, ClipLink } from './Clipping.styles'
import type { ClippingProps } from '../../types'

export default function Clipping({
  strap,
  date,
  title,
  image,
  imageAlt,
  lede,
  link,
  priority,
}: ClippingProps) {
  return (
    <Article data-reveal>
      {strap && <Strap>{strap}</Strap>}
      <DateTag>{date}</DateTag>
      <Title>{title}</Title>

      {image && (
        <ImageWrap>
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: 'cover' }}
            priority={priority}
          />
        </ImageWrap>
      )}

      <Lede>{lede}</Lede>

      {link &&
        (link.external ? (
          <ClipLink href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label}
          </ClipLink>
        ) : (
          <Link href={link.href} passHref legacyBehavior>
            <ClipLink as="a">{link.label}</ClipLink>
          </Link>
        ))}
    </Article>
  )
}
