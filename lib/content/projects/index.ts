import { barberlytics } from './barberlytics'
import { cargaIa } from './carga-ia'
import { nomina } from './nomina'
import { objetivos } from './objetivos'
import type { Project } from './types'

export type { Project, MockKind } from './types'

/** Orden en que aparecen en el sitio. */
export const PROJECTS: readonly Project[] = [objetivos, barberlytics, cargaIa, nomina]

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}

export function getNextProject(slug: string): Project {
  const index = PROJECTS.findIndex((p) => p.slug === slug)
  return PROJECTS[(index + 1) % PROJECTS.length]
}
