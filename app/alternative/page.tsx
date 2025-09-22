import { Navigation } from '@/components/navigation'

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f0f0f3] dark:bg-[#0a0a0a] transition-colors duration-300 relative">
      {/* Navegación */}
      <Navigation />
      
      {/* Contenido de la página */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-8">
            Página Alternative
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Contenido limpio sin fondos especiales
          </p>
        </div>
      </div>
    </div>
  );
}
