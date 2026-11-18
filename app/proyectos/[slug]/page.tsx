import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudy } from '@/components/case/case-study'
import { getProject, PROJECTS } from '@/lib/content/projects'

interface CasePageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  return {
    title: `${project.title.es} — Elkin Garcia`,
    description: project.tagline.es,
  }
}

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params
  if (!getProject(slug)) notFound()
  return <CaseStudy slug={slug} />
}
