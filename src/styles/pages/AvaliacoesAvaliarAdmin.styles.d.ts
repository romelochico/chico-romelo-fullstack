import type { StyledComponent } from 'styled-components'
import type { DefaultTheme } from 'styled-components'

export const SectionLabel: StyledComponent<'div', DefaultTheme>
export const Field: StyledComponent<'div', DefaultTheme>
export const FieldLabel: StyledComponent<'label', DefaultTheme>
export const FieldInput: StyledComponent<'input', DefaultTheme>
export const FieldTextarea: StyledComponent<'textarea', DefaultTheme>
export const PapelGrid: StyledComponent<'div', DefaultTheme>
export const PapelBtn: StyledComponent<'button', DefaultTheme, { $selected?: boolean }>
export const MusicaCard: StyledComponent<'div', DefaultTheme>
export const MusicaCardHeader: StyledComponent<'div', DefaultTheme>
export const MusicaNum: StyledComponent<'span', DefaultTheme>
export const MusicaName: StyledComponent<'span', DefaultTheme>
export const MusicaChevron: StyledComponent<'span', DefaultTheme, { $open?: boolean }>
export const MusicaBody: StyledComponent<'div', DefaultTheme, { $open?: boolean }>
export const Cols2: StyledComponent<'div', DefaultTheme>
export const ColTitle: StyledComponent<'div', DefaultTheme>
export const StarRow: StyledComponent<'div', DefaultTheme>
export const StarLabel: StyledComponent<'span', DefaultTheme>
export const BandaMember: StyledComponent<'div', DefaultTheme>
export const BandaMemberTitle: StyledComponent<'div', DefaultTheme>
export const MusicNotes: StyledComponent<'div', DefaultTheme>
export const NoteBlock: StyledComponent<'div', DefaultTheme>
export const NoteLabel: StyledComponent<'label', DefaultTheme>
export const NoteDot: StyledComponent<'span', DefaultTheme, { $green?: boolean }>
export const NoteTextarea: StyledComponent<'textarea', DefaultTheme>
export const GeneralBlock: StyledComponent<'div', DefaultTheme>
export const NotaRow: StyledComponent<'div', DefaultTheme>
export const NotaLabel: StyledComponent<'span', DefaultTheme>
export const SubmitArea: StyledComponent<'div', DefaultTheme>
export const SubmitBtn: StyledComponent<'button', DefaultTheme>
export const SuccessBox: StyledComponent<'div', DefaultTheme>
export const Toast: StyledComponent<'div', DefaultTheme, { $show?: boolean; $error?: boolean }>
