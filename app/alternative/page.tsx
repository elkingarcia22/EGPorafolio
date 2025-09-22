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
 * Componente EG con efecto neumórfico hundido - ENFOQUE SIMPLE
 * - Texto grande con gradiente
 * - Efecto neumórfico con múltiples sombras
 * - Simulación de letras hundidas en la superficie
 */
function EGDebossed() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center">
      {/* Letras EG con efecto neumórfico */}
      <div 
        className="relative"
        style={{
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto',
          fontWeight: 900,
          fontSize: '420px',
          letterSpacing: '8px',
          color: '#4FC3F7',
          textShadow: `
            0 0 0 transparent,
            inset 20px 20px 40px rgba(0, 0, 0, 0.3),
            inset -20px -20px 40px rgba(255, 255, 255, 0.8),
            0 0 0 1px rgba(0, 0, 0, 0.1)
          `,
          background: 'linear-gradient(135deg, #4FC3F7 0%, #26C6DA 50%, #66BB6A 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 0 transparent)',
          position: 'relative'
        }}
      >
        EG
      </div>
    </div>
  );
}
