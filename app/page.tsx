'use client'

import { NeuromorphicEG } from '@/components/neuromorphic-eg'
import { Navbar } from '@/components/navbar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300 relative overflow-hidden">
      <Navbar />
      
      {/* EG neuromórfico como elementos reales - con espacio para la barra fija */}
      <div className="pt-24">
        <NeuromorphicEG />
      </div>
    </div>
  )
}
