import { DisplayXL, DisplayLG, DisplayMD, DisplaySM, Heading, BodyLG, Body, BodySM, Mono, Hand, Outline } from './Typography.styles'

export default {
  title: 'Design System/Typography',
  parameters: { layout: 'padded' },
}

export const DisplayScale = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <DisplayXL>Display XL</DisplayXL>
      <DisplayLG>Display LG</DisplayLG>
      <DisplayMD>Display MD</DisplayMD>
      <DisplaySM>Display SM</DisplaySM>
      <Heading>Heading</Heading>
    </div>
  ),
}

export const TextScale = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>
      <BodyLG>Body Large — Chico Romelo nasce em Lisboa.</BodyLG>
      <Body>Body — Som que cruza música brasileira, palco e cidade. Energia ao vivo, proximidade com o público e vida de rua.</Body>
      <BodySM>Body SM — Cinco vozes, uma batida só.</BodySM>
    </div>
  ),
}

export const UtilityTypes = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Mono $muted>01 · A Banda · Mono muted</Mono>
      <Mono>EP · 2025 · Mono default</Mono>
      <Hand>Som da rua! — Hand</Hand>
      <DisplayLG>Entre <Outline>Lisboa</Outline> e a rua</DisplayLG>
    </div>
  ),
}
