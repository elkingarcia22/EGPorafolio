import { Navigation } from '@/components/navigation'
import { EGLogoDisplay } from '@/components/eg-logo-display'

export default function Page() {
  return (
    <div className="min-h-screen bg-[#ECEDEC] relative overflow-hidden">
      {/* Fondo exacto como en la imagen de referencia */}
      <div
        className="absolute inset-0"
        style={{
          background: '#ECEDEC'
        }}
      />

      {/* Layout con imagen EG al lado izquierdo */}
      <div className="relative z-10 flex h-screen">
        {/* Imagen EG al lado izquierdo - BIEN GRANDE */}
        <div className="w-1/2 flex items-center justify-center">
          <EGLogoDisplay position="left" size="large" />
        </div>

        {/* Contenido al lado derecho */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-8" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto' }}>
              Portafolio EG
            </h1>
            <p className="text-xl text-gray-600 mb-8" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto' }}>
              Diseño UX/UI con estilo neumórfico
            </p>
            <button 
              className="px-8 py-4 text-white rounded-lg transition-colors"
              style={{
                background: '#3B82F6',
                fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              Ver Proyectos
            </button>
          </div>
        </div>
      </div>

      {/* Navegación por encima del fondo */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <Navigation />
      </div>
    </div>
  );
}
