import { SectionLabel } from './SectionLabel'

export default {
  title: 'Design System/SectionLabel',
  component: SectionLabel,
  parameters: { layout: 'centered' },
  argTypes: {
    children: { control: 'text' },
    dark: { control: 'boolean' },
  },
  args: { children: '01 · A Banda' },
}

export const Default = {}
export const Dark    = {
  args: { dark: true },
  parameters: { backgrounds: { default: 'olive', values: [{ name: 'olive', value: '#404015' }] } },
}

export const Variants = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionLabel>01 · A Banda</SectionLabel>
      <SectionLabel>02 · Lançamentos</SectionLabel>
      <SectionLabel>03 · Novidades</SectionLabel>
    </div>
  ),
}
