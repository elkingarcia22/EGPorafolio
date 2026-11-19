import type { Metadata } from 'next'
import { EncuestasCase } from '@/components/case/encuestas/encuestas-case'
import { PROJECTS } from '@/lib/content/projects'
import { encuestas } from '@/lib/content/projects/encuestas'
import { findProject } from '@/lib/data/projects-repository'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Encuestas en accionables · UBITS — Elkin Garcia',
  description: 'Rediseño del producto completo de encuestas de UBITS: crear, secciones, histórico, responder, resultados y acciones.',
}

/** Caso Encuestas: tiene sus propios capítulos en vez del caso genérico. */
export default async function EncuestasPage() {
  // Si la fuente remota todavía no trae Encuestas, el «siguiente» sale del contenido local.
  const found = await findProject('encuestas')
  const localIndex = PROJECTS.findIndex((p) => p.slug === encuestas.slug)
  const next = found?.next ?? PROJECTS[(localIndex + 1) % PROJECTS.length]
  return <EncuestasCase next={next} />
}
