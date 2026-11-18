import type { L } from '@/lib/i18n'

/** Tipo de pantalla simulada que usan los bocetos y la UI final. */
export type MockKind = 'dashboard' | 'mobile' | 'upload' | 'table'

export interface Quote {
  text: L
  who: L
}

export interface Stat {
  value: string
  label: L
}

export interface Cluster {
  title: L
  notes: readonly L[]
}

export interface Principle {
  title: L
  body: L
}

export interface AiStep {
  tool: string
  prompt: L
  output: L
}

export interface Metric {
  value: number
  prefix?: string
  suffix: string
  label: L
}

export interface Project {
  slug: string
  /** "Frecuencia" del proyecto: número + año, se usa como índice visual */
  frequency: string
  title: L
  client: string
  year: string
  /** Color propio del caso, como triplete RGB: "64 96 255" */
  accent: string
  mock: MockKind
  tagline: L
  role: L
  team: L
  duration: L
  tools: readonly string[]
  problem: {
    context: L
    quotes: readonly Quote[]
    stats: readonly Stat[]
  }
  research: {
    method: L
    clusters: readonly Cluster[]
    insights: readonly L[]
  }
  idea: {
    hmw: L
    principles: readonly Principle[]
  }
  sketches: {
    caption: L
    notes: readonly L[]
  }
  form: {
    caption: L
  }
  ai: {
    intro: L
    steps: readonly AiStep[]
  }
  results: {
    metrics: readonly Metric[]
    learnings: readonly L[]
  }
}
