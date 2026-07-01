import { Input, Textarea, Select } from './Input'

export default {
  title: 'Design System/Input',
  parameters: { layout: 'padded' },
}

export const TextInput = {
  render: () => (
    <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Input label="Nome" id="name" placeholder="Seu nome completo" />
      <Input label="Email" id="email" type="email" placeholder="email@exemplo.com" />
      <Select label="Assunto" id="subject">
        <option>Booking / Shows</option>
        <option>Imprensa</option>
        <option>Parcerias</option>
      </Select>
      <Textarea label="Mensagem" id="message" placeholder="A sua mensagem..." />
    </div>
  ),
}

export const States = {
  render: () => (
    <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Input placeholder="Default state" />
      <Input placeholder="With label" label="Campo" />
      <Input placeholder="Disabled" disabled />
    </div>
  ),
}
