import type { L } from '@/lib/i18n'

/** Imagen de producto: archivo en /public/cases/barberlytics, con su tamaño real. */
export interface CaseImage {
  src: string
  width: number
  height: number
  alt: L
  caption?: L
}

export interface CaseStat {
  value: string
  label: L
}

export interface TitledText {
  title: L
  body: L
}

/** Una decisión de diseño con su porqué. */
export interface Decision {
  title: L
  why: L
}

export interface ChapterIntro {
  /** Pregunta o frase que abre el capítulo */
  kicker: L
  lead: L
  stats: readonly CaseStat[]
}
