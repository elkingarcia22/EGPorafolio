import type { Metadata } from 'next'
import { CvProposals } from '@/components/cv/cv-proposals'

export const metadata: Metadata = {
  title: 'Hoja de vida — propuestas de diseño',
  robots: { index: false, follow: false },
}

export default function CvProposalsPage() {
  return <CvProposals />
}
