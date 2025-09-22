import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f0f0f3] dark:bg-[#0a0a0a] transition-colors duration-300 relative">
      {/* Navegación */}
      <Navigation />
      
      {/* Sección Hero */}
      <HeroSection />
    </div>
  )
}
