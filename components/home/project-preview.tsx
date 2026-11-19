'use client'

import { MockScreen } from '@/components/mock/mock-screen'
import { HeroRumboCard } from '@/components/case/sellup/hero-rumbo'
import type { Project } from '@/lib/content/projects'
import { ClipperScenePreview } from './previews/clipper-scene-preview'
import { EncuestasPreview } from './previews/encuestas-preview'
import { ObjetivosPreview } from './previews/objetivos-preview'
import { ObjetivosCompactPreview } from './previews/objetivos-compact-preview'
import { SellupCompactPreview } from './previews/sellup-compact-preview'

type PreviewComponent = (props: { compact?: boolean }) => React.JSX.Element

/** La vista previa animada de cada proyecto: la usan la lista de la portada y «Siguiente proyecto». */
const PREVIEWS: Partial<Record<string, PreviewComponent>> = {
  barberlytics: ClipperScenePreview,
  sellup: HeroRumboCard,
  objetivos: ObjetivosPreview,
  encuestas: EncuestasPreview,
}

/**
 * En móvil y tableta la vista previa va dentro de la fila, a todo el ancho de una pantalla
 * pequeña: ahí no se encoge la composición de escritorio, se cuenta con menos piezas y más grandes.
 */
const COMPACT_PREVIEWS: Partial<Record<string, PreviewComponent>> = {
  sellup: SellupCompactPreview,
  objetivos: ObjetivosCompactPreview,
}

export const hasCustomPreview = (slug: string): boolean => Boolean(PREVIEWS[slug])

interface ProjectPreviewProps {
  project: Project
  className?: string
  /** Versión para pantallas pequeñas: menos piezas, texto legible (≥ 11 px). */
  compact?: boolean
}

export function ProjectPreview({ project, className = '', compact = false }: ProjectPreviewProps) {
  const Custom = (compact && COMPACT_PREVIEWS[project.slug]) || PREVIEWS[project.slug]
  if (Custom) return <div className={`overflow-hidden ${className}`}><Custom compact={compact} /></div>
  return <MockScreen kind={project.mock} mode="ui" accent={project.accent} className={className} />
}
