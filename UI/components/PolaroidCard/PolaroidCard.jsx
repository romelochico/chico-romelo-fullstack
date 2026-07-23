import { Card, Info, Caption, Title, Sub, Note, Tape } from './PolaroidCard.styles'

/**
 * PolaroidCard — polaroid-style photo card with optional title, subtitle and note.
 *
 * @param {string}  src      – image source
 * @param {string}  alt
 * @param {string}  title    – bold display title below photo
 * @param {string}  sub      – mono subtitle
 * @param {string}  note     – handwritten note
 * @param {string}  caption  – tiny mono caption (bottom of info area)
 * @param {string}  rotate   – CSS rotate e.g. "2deg"
 * @param {string}  ratio    – aspect-ratio e.g. "3/4", "1/1"
 * @param {boolean} tape     – show decorative tape piece at top
 */
export function PolaroidCard({
  src,
  alt = '',
  title,
  sub,
  note,
  caption,
  rotate,
  ratio,
  tape = false,
  ...rest
}) {
  return (
    <Card $rotate={rotate} $ratio={ratio} {...rest}>
      {tape && <Tape $top={-10} $left="50%" $w={90} $h={22} $rot="-8deg" />}
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      {(title || sub || note || caption) && (
        <Info>
          {title && <Title>{title}</Title>}
          {sub && <Sub>{sub}</Sub>}
          {note && <Note>{note}</Note>}
          {caption && <Caption>{caption}</Caption>}
        </Info>
      )}
    </Card>
  )
}
