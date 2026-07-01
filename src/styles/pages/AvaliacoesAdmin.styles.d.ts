import type { StyledComponent } from 'styled-components'
import type { DefaultTheme } from 'styled-components'

export const StatsBar: StyledComponent<'div', DefaultTheme>
export const StatItem: StyledComponent<'div', DefaultTheme>
export const StatVal: StyledComponent<'div', DefaultTheme>
export const StatLabel: StyledComponent<'div', DefaultTheme>
export const StatDivider: StyledComponent<'div', DefaultTheme>
export const SortBar: StyledComponent<'div', DefaultTheme>
export const SortBtn: StyledComponent<'button', DefaultTheme, { $active?: boolean }>
export const SectionHead: StyledComponent<'div', DefaultTheme>
export const SectionTitle: StyledComponent<'h2', DefaultTheme>
export const ShowsGrid: StyledComponent<'div', DefaultTheme>
export const ShowCard: StyledComponent<'a', DefaultTheme>
export const ShowName: StyledComponent<'div', DefaultTheme>
export const ShowMeta: StyledComponent<'div', DefaultTheme>
export const ShowBadges: StyledComponent<'div', DefaultTheme>
export const Badge: StyledComponent<'span', DefaultTheme>
export const ShowArrow: StyledComponent<'span', DefaultTheme>
export const EmptyShows: StyledComponent<'div', DefaultTheme>
export const CriarSection: StyledComponent<'section', DefaultTheme>
export const CriarInner: StyledComponent<'div', DefaultTheme>
export const FormTitle: StyledComponent<'h3', DefaultTheme>
export const FieldGrid: StyledComponent<'div', DefaultTheme>
export const FieldFull: StyledComponent<'div', DefaultTheme>
export const Field: StyledComponent<'div', DefaultTheme>
export const FieldLabel: StyledComponent<'label', DefaultTheme>
export const FieldInput: StyledComponent<'input', DefaultTheme>
export const PapeisGrid: StyledComponent<'div', DefaultTheme>
export const PapelToggle: StyledComponent<'button', DefaultTheme, { $on?: boolean }>
export const SubmitBtn: StyledComponent<'button', DefaultTheme>
export const ExistingShows: StyledComponent<'div', DefaultTheme>
export const ExistingCard: StyledComponent<'div', DefaultTheme>
export const ExistingInfo: StyledComponent<'div', DefaultTheme>
export const ExistingName: StyledComponent<'div', DefaultTheme>
export const ExistingMeta: StyledComponent<'div', DefaultTheme>
export const DeleteBtn: StyledComponent<'button', DefaultTheme>
export const Toast: StyledComponent<'div', DefaultTheme, { $show?: boolean; $error?: boolean }>
