import { barberlytics } from './barberlytics'
import { cargaIa } from './carga-ia'
import { nomina } from './nomina'
import { objetivos } from './objetivos'
import type { Project } from './types'

export type { Project, MockKind } from './types'

/** Orden en que aparecen en el sitio. */
export const PROJECTS: readonly Project[] = [objetivos, barberlytics, cargaIa, nomina]
