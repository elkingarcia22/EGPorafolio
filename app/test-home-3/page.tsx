'use client'

import { MinimalVisibleNavbar } from '@/components/minimal-visible-navbar'
import { NeuromorphicEGProposal3 } from '@/components/neuromorphic-eg-proposal-3'
import { AdminProvider } from '@/contexts/admin-context'

export default function TestHome3() {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-white dark:bg-dark-surface-variant">
        <MinimalVisibleNavbar onAdminClick={() => {}} />
        <NeuromorphicEGProposal3 />
      </div>
    </AdminProvider>
  )
}
