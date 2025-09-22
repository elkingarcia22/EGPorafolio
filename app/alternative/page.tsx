import { Navigation } from '@/components/navigation'
import { EGLogoDisplay } from '@/components/eg-logo-display'

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f8f8f8] relative overflow-hidden">
      {/* Fondo con textura sutil como en la imagen */}
      <div
        className="absolute inset-0"
        style={{
          background: '#f8f8f8',
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0),
            radial-gradient(circle at 2px 2px, rgba(0,0,0,0.01) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px, 40px 40px'
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
            <h1 className="text-6xl font-bold text-gray-800 mb-8">
              Portafolio EG
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Diseño UX/UI con estilo neumórfico
            </p>
            <button className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
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
