import { Button } from './Button'

export default {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'cream',
      values: [
        { name: 'cream', value: '#fdf4e8' },
        { name: 'olive', value: '#404015' },
        { name: 'dark', value: '#373435' },
      ],
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'olive', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    children: { control: 'text' },
  },
  args: { children: 'Ouça já →' },
}

export const Primary = { args: { variant: 'primary' } }
export const Secondary = { args: { variant: 'secondary' } }
export const Olive = { args: { variant: 'olive' } }
export const Ghost = {
  args: { variant: 'ghost' },
  parameters: { backgrounds: { default: 'olive' } },
}
export const Small = { args: { variant: 'primary', size: 'sm' } }
export const Large = { args: { variant: 'primary', size: 'lg' } }

export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Ouvir agora</Button>
      <Button variant="secondary">Saiba mais</Button>
      <Button variant="olive">Ver agenda</Button>
      <Button size="sm" variant="primary">
        Small
      </Button>
      <Button size="lg" variant="primary">
        Large
      </Button>
    </div>
  ),
}
