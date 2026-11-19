import { barberlytics } from './barberlytics'
import { encuestas } from './encuestas'
import { objetivos } from './objetivos'
import { sellup } from './sellup'
import type { Project } from './types'

export type { Project, MockKind } from './types'

/** Orden en que aparecen en el sitio. */
export const PROJECTS: readonly Project[] = [encuestas, barberlytics, sellup, objetivos]
