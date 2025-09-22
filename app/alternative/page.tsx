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
 * Componente EG con efecto neumórfico hundido usando CSS
 * - Letras grandes centradas
 * - Efecto neumórfico con box-shadow inset
 * - Gradiente azul → verde
 * - Efecto hundido pronunciado
 */
function EGDebossed() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center">
      {/* Letras EG con efecto neumórfico hundido */}
      <div 
        className="relative"
        style={{
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto',
          fontWeight: 900,
          fontSize: '500px',
          letterSpacing: '20px',
          color: 'transparent',
          background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: `
            inset 20px 20px 40px rgba(0, 0, 0, 0.3),
            inset -20px -20px 40px rgba(255, 255, 255, 0.8),
            0 0 0 1px rgba(0, 0, 0, 0.1)
          `,
          filter: 'drop-shadow(0 0 0 transparent)',
          position: 'relative'
        }}
      >
        EG
        {/* Efecto de sombra adicional para simular hundimiento */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)',
            borderRadius: '20px',
            boxShadow: `
              inset 25px 25px 50px rgba(0, 0, 0, 0.4),
              inset -25px -25px 50px rgba(255, 255, 255, 0.9),
              0 0 0 2px rgba(0, 0, 0, 0.1)
            `,
            zIndex: -1,
            margin: '-10px',
            opacity: 0.1
          }}
        />
      </div>
    </div>
  );
}
