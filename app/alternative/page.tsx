import { Navigation } from '@/components/navigation'

export default function Page() {
  return (
    <div className="min-h-screen bg-[#ECEDEC] relative overflow-hidden">
      {/* Fondo texturizado sutil */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 1200px at 20% 10%, rgba(255,255,255,0.7), transparent 60%)",
          maskImage:
            "radial-gradient(1200px 1200px at 20% 10%, black 60%, transparent 100%)",
        }}
      />

      {/* Layout con imagen EG al lado izquierdo */}
      <div className="relative z-10 flex h-screen">
        {/* Imagen EG al lado izquierdo - BIEN GRANDE */}
        <div className="w-1/2 flex items-center justify-center">
          <div 
            className="relative"
            style={{
              width: '600px',
              height: '800px',
              background: 'linear-gradient(135deg, #4FC3F7 0%, #26C6DA 50%, #66BB6A 100%)',
              borderRadius: '30px',
              boxShadow: `
                inset 25px 25px 50px rgba(0, 0, 0, 0.3),
                inset -25px -25px 50px rgba(255, 255, 255, 0.8),
                0 0 0 2px rgba(0, 0, 0, 0.1)
              `,
              position: 'relative'
            }}
          >
            {/* Letras EG dentro de la imagen */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto',
                fontWeight: 900,
                fontSize: '300px',
                letterSpacing: '20px',
                color: 'white',
                textShadow: `
                  inset 15px 15px 30px rgba(0, 0, 0, 0.4),
                  inset -15px -15px 30px rgba(255, 255, 255, 0.6)
                `,
                filter: 'drop-shadow(0 0 0 transparent)'
              }}
            >
              EG
            </div>
          </div>
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
