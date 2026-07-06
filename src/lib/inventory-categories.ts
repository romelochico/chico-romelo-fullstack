import {
  Cable, SlidersHorizontal, GitFork, Volume2, Speaker,
  Guitar, Music2, Mic, Mic2, Headphones, Laptop, Zap,
  Layers, Monitor, PackageOpen,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface CategoryDef {
  key: string
  label: string
  Icon: LucideIcon
  subcategories?: string[]
}

export const CATEGORIES: CategoryDef[] = [
  {
    key: 'cables', label: 'Cabos', Icon: Cable,
    subcategories: ['XLR', 'P10', 'XLR → RCA', 'P10 → XLR Fêmea', 'XLR Patch', 'Cabo de PA', 'Cabo de Força', 'P2 → RCA', 'P2 → 2×P10 (Stereo)', 'P2 → XLR Fêmea', 'USB-C', 'USB-C → USB-B', 'USB → USB-B'],
  },
  { key: 'mixer',    label: 'Mesa Digital',    Icon: SlidersHorizontal },
  { key: 'splitter', label: 'Splitters',        Icon: GitFork },
  {
    key: 'amplifier', label: 'Amplificadores', Icon: Volume2,
    subcategories: ['Guitarra', 'Baixo'],
  },
  {
    key: 'pa', label: 'PA', Icon: Speaker,
    subcategories: ['Ativo', 'Passivo'],
  },
  { key: 'guitar',    label: 'Guitarras',   Icon: Guitar },
  { key: 'bass',      label: 'Baixos',      Icon: Music2 },
  {
    key: 'drums', label: 'Bateria', Icon: Layers,
    subcategories: ['Bumbo', 'Tom 1', 'Tom 2', 'Floor Tom', 'Caixa', 'Pratos', 'Hi-Hat', 'Pedal de Bumbo', 'Suporte de Prato', 'Suporte de Caixa', 'Banco'],
  },
  {
    key: 'drums_hardware', label: 'Hardware de Bateria', Icon: Layers,
    subcategories: ['Pedal de Bumbo', 'Banco', 'Suporte de Banco', 'Suporte de Caixa', 'Pedestal de Prato Reto', 'Pedestal de Prato Girafa', 'Pedestal de Hi-Hat', 'Clamp', 'Braço de Extensão'],
  },
  { key: 'pedalboard', label: 'Pedalboard', Icon: Zap },
  {
    key: 'pedals', label: 'Pedais', Icon: Zap,
    subcategories: ['Pedal de Expressão', 'Sustain', 'Multi Efeito'],
  },
  { key: 'keyboard',   label: 'Teclado',    Icon: Music2 },
  { key: 'support',    label: 'Suportes',   Icon: Monitor },
  {
    key: 'microphone', label: 'Microfones', Icon: Mic,
    subcategories: ['Guitarra', 'Voz', 'Bumbo', 'OH', 'Caixa', 'Condensador'],
  },
  { key: 'mic_stand', label: 'Pedestais de Mic',  Icon: Mic2 },
  { key: 'pa_stand',  label: 'Suportes de PA',    Icon: PackageOpen },
  { key: 'interface', label: 'Interface de Áudio', Icon: Headphones },
  { key: 'computer',  label: 'Computador',         Icon: Laptop },
  { key: 'extension', label: 'Extensões',           Icon: Zap },
  { key: 'iem',       label: 'IEM',                 Icon: Headphones },
  { key: 'iem_ammo',  label: 'Munição IEM',         Icon: PackageOpen },
  {
    key: 'wireless', label: 'Wireless', Icon: GitFork,
    subcategories: ['Guitarra', 'IEM'],
  },
]
