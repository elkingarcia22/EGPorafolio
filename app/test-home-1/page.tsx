'use client'

import { MinimalVisibleNavbar } from '@/components/minimal-visible-navbar'
import { NeuromorphicEGProposal1 } from '@/components/neuromorphic-eg-proposal-1'
import { AdminProvider } from '@/contexts/admin-context'

export default function TestHome1() {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-white dark:bg-dark-surface-variant">
        <MinimalVisibleNavbar onAdminClick={() => {}} />
        <NeuromorphicEGProposal1 />
      </div>
    </AdminProvider>
  )
}
