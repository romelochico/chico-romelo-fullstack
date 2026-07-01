import { Card, Info, Name, Role, Origin } from './MemberCard.styles'

export default function MemberCard({ name, role, origin, image, jpg }) {
  return (
    <Card data-reveal>
      <picture>
        <source srcSet={image} type="image/webp" />
        <img src={jpg} alt={name} loading="lazy" decoding="async" />
      </picture>
      <Info>
        <Name>{name}</Name>
        <Role>{role}</Role>
        <Origin>{origin}</Origin>
      </Info>
    </Card>
  )
}
