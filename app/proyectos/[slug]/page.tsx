import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudy } from '@/components/case/case-study'
import { findProject, listProjects } from '@/lib/data/projects-repository'

interface CasePageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

export async function generateStaticParams() {
  const { projects } = await listProjects()
  // Barberlytics y Encuestas tienen su propia carpeta y su propio caso
  const OWN_ROUTE = new Set(['barberlytics', 'encuestas'])
  return projects.filter((p) => !OWN_ROUTE.has(p.slug)).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { slug } = await params
  const found = await findProject(slug)
  if (!found) return {}
  return {
    title: `${found.project.title.es} — Elkin Garcia`,
    description: found.project.tagline.es,
  }
}

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params
  const found = await findProject(slug)
  if (!found) notFound()
  return <CaseStudy project={found.project} next={found.next} />
}
