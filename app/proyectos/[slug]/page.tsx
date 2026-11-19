import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudy } from '@/components/case/case-study'
import { BarberlyticsCase } from '@/components/case/barberlytics/barberlytics-case'
import { findProject, listProjects } from '@/lib/data/projects-repository'

interface CasePageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

export async function generateStaticParams() {
  const { projects } = await listProjects()
  return projects.map((p) => ({ slug: p.slug }))
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
  // Barberlytics ya tiene su caso real, con su propia estructura.
  if (found.project.slug === 'barberlytics') return <BarberlyticsCase next={found.next} />
  return <CaseStudy project={found.project} next={found.next} />
}
