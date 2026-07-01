import { Badge } from './Badge'

export default {
  title: 'Design System/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['dark', 'olive', 'cream', 'tag', 'success'] },
    children: { control: 'text' },
    rotate: { control: 'text' },
  },
  args: { children: '★ Prémio' },
}

export const Dark    = { args: { variant: 'dark' } }
export const Olive   = { args: { variant: 'olive' } }
export const Cream   = { args: { variant: 'cream' } }
export const Tag     = { args: { variant: 'tag', children: 'Lisboa' } }
export const Success = { args: { variant: 'success', children: 'Grátis' } }
export const Rotated = { args: { variant: 'olive', rotate: '4deg', children: '★ Ao Vivo' } }

export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="dark">EP · 2025</Badge>
      <Badge variant="olive">★ Prémio</Badge>
      <Badge variant="cream">Lisboa</Badge>
      <Badge variant="tag">Concurso</Badge>
      <Badge variant="success">Grátis</Badge>
    </div>
  ),
}
