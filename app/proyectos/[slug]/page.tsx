import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudy } from '@/components/case/case-study'
import { SellUpCase } from '@/components/case/sellup/sellup-case'
import { PROJECTS } from '@/lib/content/projects'
import { findProject, listProjects } from '@/lib/data/projects-repository'

interface CasePageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

/** Casos con su propio diseño: viven en el código, no en la base de datos. */
const CUSTOM_CASES = new Set(['sellup'])

/** Proyecto local y el siguiente en el orden del sitio. */
function findLocal(slug: string) {
  const index = PROJECTS.findIndex((p) => p.slug === slug)
  if (index === -1) return null
  return { project: PROJECTS[index], next: PROJECTS[(index + 1) % PROJECTS.length] }
}

export async function generateStaticParams() {
  const { projects } = await listProjects()
  // Barberlytics tiene su propia carpeta (portada + proyectos)
  const slugs = Array.from(new Set([...projects.map((p) => p.slug), ...Array.from(CUSTOM_CASES)]))
  return slugs.filter((slug) => slug !== 'barberlytics').map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { slug } = await params
  const found = CUSTOM_CASES.has(slug) ? findLocal(slug) : await findProject(slug)
  if (!found) return {}
  return {
    title: `${found.project.title.es} — Elkin Garcia`,
    description: found.project.tagline.es,
  }
}

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params
  if (CUSTOM_CASES.has(slug)) {
    const local = findLocal(slug)
    if (!local) notFound()
    return <SellUpCase next={{ slug: local.next.slug, title: local.next.title }} />
  }
  const found = await findProject(slug)
  if (!found) notFound()
  return <CaseStudy project={found.project} next={found.next} />
}
