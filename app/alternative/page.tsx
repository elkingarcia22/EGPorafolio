import { Navigation } from '@/components/navigation'
import { EGFullScreen } from '@/components/eg-fullscreen'

export default function AlternativeHomePage() {
  return (
    <div className="min-h-screen bg-[#f0f0f3] dark:bg-[#0a0a0a] transition-colors duration-300 relative overflow-hidden">
      {/* Navegación */}
      <Navigation />
      
      {/* Letras EG en pantalla completa */}
      <EGFullScreen />
    </div>
  )
}
