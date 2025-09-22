import { Navigation } from '@/components/navigation'

export default function Page() {
  return (
    <div className="min-h-screen bg-[#ECEDEC] relative overflow-hidden">
      {/* Fondo texturizado sutil (opcional) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 1200px at 20% 10%, rgba(255,255,255,0.7), transparent 60%)",
          maskImage:
            "radial-gradient(1200px 1200px at 20% 10%, black 60%, transparent 100%)",
        }}
      />

      {/* SVG que genera el relieve HUNDIDO + degradado dentro de las letras - COMO FONDO */}
      <EGDebossed />

      {/* Navegación por encima del fondo */}
      <div className="relative z-10">
        <Navigation />
      </div>
    </div>
  );
}

/**
 * Componente EG con efecto neumórfico hundido EXACTO como en la imagen
 * - Letras grandes centradas con gradiente azul-turquesa-verde
 * - Efecto neumórfico hundido con sombras suaves y difusas
 * - Textura de fondo mate
 * - Sombras internas para simular letras talladas en la superficie
 */
function EGDebossed() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center">
      {/* Contenedor principal para las letras EG */}
      <div className="relative">
        {/* Letras EG con efecto neumórfico hundido */}
        <div 
          className="relative"
          style={{
            fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto',
            fontWeight: 900,
            fontSize: '420px',
            letterSpacing: '8px',
            color: 'transparent',
            background: 'linear-gradient(135deg, #4FC3F7 0%, #26C6DA 50%, #66BB6A 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            position: 'relative',
            zIndex: 2
          }}
        >
          EG
        </div>
        
        {/* Capa de sombra interna para efecto hundido */}
        <div 
          className="absolute inset-0"
          style={{
            fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto',
            fontWeight: 900,
            fontSize: '420px',
            letterSpacing: '8px',
            color: 'transparent',
            background: 'linear-gradient(135deg, #4FC3F7 0%, #26C6DA 50%, #66BB6A 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `
              inset 15px 15px 30px rgba(0, 0, 0, 0.25),
              inset -15px -15px 30px rgba(255, 255, 255, 0.7)
            `,
            zIndex: 1
          }}
        >
          EG
        </div>
        
        {/* Capa de fondo con efecto de profundidad */}
        <div 
          className="absolute inset-0"
          style={{
            fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto',
            fontWeight: 900,
            fontSize: '420px',
            letterSpacing: '8px',
            color: 'transparent',
            background: 'linear-gradient(135deg, #4FC3F7 0%, #26C6DA 50%, #66BB6A 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'blur(2px)',
            opacity: 0.3,
            zIndex: 0
          }}
        >
          EG
        </div>
      </div>
    </div>
  );
}
