'use client'

import { MinimalVisibleNavbar } from '@/components/minimal-visible-navbar'
import { NeuromorphicEGProposal2 } from '@/components/neuromorphic-eg-proposal-2'
import { AdminProvider } from '@/contexts/admin-context'

export default function TestHome2() {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-white dark:bg-dark-surface-variant">
        <MinimalVisibleNavbar onAdminClick={() => {}} />
        <NeuromorphicEGProposal2 />
      </div>
    </AdminProvider>
  )
}
