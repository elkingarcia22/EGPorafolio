import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ObjetivosCase } from '@/components/case/objetivos/objetivos-case'
import { findProject } from '@/lib/data/projects-repository'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Objetivos · UBITS — Elkin Garcia',
  description: 'El producto completo de objetivos de UBITS: configurar, crear, alinear en cascada, aprobar, reportar avance y leer resultados, para admin, líder y colaborador.',
}

/** Caso Objetivos: tiene su propia página (no la plantilla genérica de [slug]). */
export default async function ObjetivosPage() {
  const found = await findProject('objetivos')
  if (!found) notFound()
  return <ObjetivosCase next={found.next} />
}
