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
 * Componente EG con efecto neumórfico hundido usando CSS puro
 * - Letras grandes centradas con gradiente azul-turquesa-verde
 * - Efecto neumórfico hundido con box-shadow inset
 * - Simulación de letras talladas en la superficie
 */
function EGDebossed() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center">
      {/* Contenedor principal para las letras EG */}
      <div className="relative">
        {/* Letra E */}
        <div 
          className="relative inline-block mr-8"
          style={{
            width: '200px',
            height: '280px',
            background: '#f8f8f8',
            borderRadius: '20px',
            boxShadow: `
              inset 15px 15px 30px rgba(209, 217, 230, 0.8),
              inset -15px -15px 30px rgba(255, 255, 255, 0.9)
            `,
            position: 'relative'
          }}
        >
          {/* Gradiente interno para la letra E */}
          <div 
            className="absolute inset-4 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #4FC3F7 0%, #26C6DA 50%, #66BB6A 100%)',
              borderRadius: '12px',
              boxShadow: 'inset 8px 8px 16px rgba(0, 0, 0, 0.2)'
            }}
          />
          
          {/* Forma de la letra E usando pseudo-elementos */}
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            {/* Barra superior */}
            <div 
              className="w-full"
              style={{
                height: '24px',
                background: 'transparent',
                borderRadius: '12px',
                boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.3)'
              }}
            />
            
            {/* Barra media */}
            <div 
              className="w-3/4"
              style={{
                height: '24px',
                background: 'transparent',
                borderRadius: '12px',
                boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.3)'
              }}
            />
            
            {/* Barra inferior */}
            <div 
              className="w-full"
              style={{
                height: '24px',
                background: 'transparent',
                borderRadius: '12px',
                boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.3)'
              }}
            />
          </div>
        </div>

        {/* Letra G */}
        <div 
          className="relative inline-block"
          style={{
            width: '200px',
            height: '280px',
            background: '#f8f8f8',
            borderRadius: '20px',
            boxShadow: `
              inset 15px 15px 30px rgba(209, 217, 230, 0.8),
              inset -15px -15px 30px rgba(255, 255, 255, 0.9)
            `,
            position: 'relative'
          }}
        >
          {/* Gradiente interno para la letra G */}
          <div 
            className="absolute inset-4 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #26C6DA 0%, #66BB6A 50%, #4CAF50 100%)',
              borderRadius: '12px',
              boxShadow: 'inset 8px 8px 16px rgba(0, 0, 0, 0.2)'
            }}
          />
          
          {/* Forma de la letra G usando pseudo-elementos */}
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            {/* Barra superior */}
            <div 
              className="w-full"
              style={{
                height: '24px',
                background: 'transparent',
                borderRadius: '12px',
                boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.3)'
              }}
            />
            
            {/* Barra media con apertura */}
            <div className="flex justify-between w-full">
              <div 
                className="w-1/2"
                style={{
                  height: '24px',
                  background: 'transparent',
                  borderRadius: '12px',
                  boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.3)'
                }}
              />
              <div 
                className="w-1/3"
                style={{
                  height: '24px',
                  background: 'transparent',
                  borderRadius: '12px',
                  boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.3)'
                }}
              />
            </div>
            
            {/* Barra inferior */}
            <div 
              className="w-full"
              style={{
                height: '24px',
                background: 'transparent',
                borderRadius: '12px',
                boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.3)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
