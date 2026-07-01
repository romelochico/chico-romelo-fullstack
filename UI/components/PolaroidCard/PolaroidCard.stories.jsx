import { PolaroidCard } from './PolaroidCard'

const PLACEHOLDER = 'https://placehold.co/300x400/fdf4e8/404015?text=Foto'

export default {
  title: 'Design System/PolaroidCard',
  component: PolaroidCard,
  parameters: { layout: 'centered' },
  argTypes: {
    rotate: { control: 'text' },
    ratio:  { control: 'text' },
    tape:   { control: 'boolean' },
    title:  { control: 'text' },
    sub:    { control: 'text' },
    note:   { control: 'text' },
  },
  args: {
    src:   PLACEHOLDER,
    alt:   'Member photo',
    title: 'Marcus Quintela',
    sub:   'Guitarra · Voz',
    note:  'Salvador, BA',
  },
}

export const Default  = {}
export const Rotated  = { args: { rotate: '3deg' } }
export const Square   = { args: { ratio: '1/1', title: undefined, sub: undefined, note: undefined, caption: 'ao vivo · 2025' } }
export const WithTape = { args: { tape: true, title: undefined, note: undefined, caption: 'backstage · lisboa' } }

export const Gallery = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <PolaroidCard src={PLACEHOLDER} alt="" title="Marcus" sub="Guitarra" note="Salvador, BA" rotate="-2.5deg" style={{ width: 160 }} />
      <PolaroidCard src={PLACEHOLDER} alt="" title="Cris"   sub="Teclado"  note="Santos, SP"  rotate="1.5deg"  style={{ width: 160 }} />
      <PolaroidCard src={PLACEHOLDER} alt="" title="Rafa"   sub="Bateria"  note="Portugal 🇨🇻" rotate="-1deg"   style={{ width: 160 }} />
    </div>
  ),
}
