'use client'

import { MockScreen } from '@/components/mock/mock-screen'
import { HeroRumboCard } from '@/components/case/sellup/hero-rumbo'
import type { Project } from '@/lib/content/projects'
import { ClipperScenePreview } from './previews/clipper-scene-preview'
import { EncuestasPreview } from './previews/encuestas-preview'
import { ObjetivosPreview } from './previews/objetivos-preview'

/** La vista previa animada de cada proyecto: la usan la lista de la portada y «Siguiente proyecto». */
const PREVIEWS: Partial<Record<string, () => React.JSX.Element>> = {
  barberlytics: ClipperScenePreview,
  sellup: HeroRumboCard,
  objetivos: ObjetivosPreview,
  encuestas: EncuestasPreview,
}

export const hasCustomPreview = (slug: string): boolean => Boolean(PREVIEWS[slug])

export function ProjectPreview({ project, className = '' }: { project: Project; className?: string }) {
  const Custom = PREVIEWS[project.slug]
  if (Custom) return <div className={`overflow-hidden ${className}`}><Custom /></div>
  return <MockScreen kind={project.mock} mode="ui" accent={project.accent} className={className} />
}
