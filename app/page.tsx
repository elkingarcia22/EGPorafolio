import { Navigation } from '@/components/navigation'
import { SupabaseTest } from '@/components/supabase-test'
import { GeometricBackground } from '@/components/geometric-background'
import { HeroSection } from '@/components/hero-section'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#000000] transition-colors duration-300 relative">
      {/* Fondo geométrico */}
      <GeometricBackground />
      
      {/* Navegación */}
      <Navigation />
      
      {/* Sección Hero */}
      <HeroSection />
      
      {/* Sección de prueba (temporal) */}
      <div className="relative z-10 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-gray-300 mb-4">
              Prueba de Conexión con Supabase
            </h2>
            <SupabaseTest />
          </div>
        </div>
      </div>
    </div>
  )
}
