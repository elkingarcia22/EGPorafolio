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
 * SVG FULLSCREEN: letras "EG" hundidas (debossed) con degradado azul→verde
 * - 100% ancho/alto, posicionado al lado izquierdo
 * - Filtro de doble sombra interna más pronunciado (clara arriba-izquierda, oscura abajo-derecha)
 * - Degradado aplicado SOLO dentro de las letras mediante máscara
 * - Letras mucho más grandes y con efecto neumórfico más marcado
 */
function EGDebossed() {
  return (
    <svg
      className="absolute inset-0 w-full h-full z-0"
      viewBox="0 0 1440 900"
      aria-hidden
    >
      <defs>
        {/* Degradado azul → verde (ajusta colores si lo prefieres) */}
        <linearGradient id="egGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#16A2FF" />
          <stop offset="1" stopColor="#35D07F" />
        </linearGradient>

        {/* Máscara: las letras en blanco definen dónde se "pinta" el gradiente */}
        <mask id="egMask">
          <rect width="100%" height="100%" fill="black" />
          {/* Texto centrado y más grande, sin cortarse */}
          <g transform="translate(0, 0)">
            <text
              x="50%"
              y="50%"
              fill="white"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
              fontWeight={900}
              fontSize={500}
              letterSpacing="20"
            >
              EG
            </text>
          </g>
        </mask>

        {/* Filtro de hendidura MÁS PRONUNCIADO (inner shadow doble para neuromórfico) */}
        <filter id="innerDeboss" x="-50%" y="-50%" width="200%" height="200%">
          {/* sombra oscura interior MÁS INTENSA (abajo-derecha) */}
          <feOffset dx="0" dy="8" in="SourceAlpha" result="off1" />
          <feGaussianBlur in="off1" stdDeviation="12" result="blur1" />
          <feComposite
            in="blur1"
            in2="SourceAlpha"
            operator="arithmetic"
            k2="-1"
            k3="1"
            result="innerShadow1"
          />
          <feColorMatrix
            in="innerShadow1"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 .6 0"
            result="darkInner"
          />

          {/* realce claro interior MÁS INTENSO (arriba-izquierda) */}
          <feOffset dx="0" dy="-8" in="SourceAlpha" result="off2" />
          <feGaussianBlur in="off2" stdDeviation="12" result="blur2" />
          <feComposite
            in="blur2"
            in2="SourceAlpha"
            operator="arithmetic"
            k2="-1"
            k3="1"
            result="innerShadow2"
          />
          <feColorMatrix
            in="innerShadow2"
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 .8 0"
            result="lightInner"
          />

          <feMerge>
            <feMergeNode in="darkInner" />
            <feMergeNode in="lightInner" />
          </feMerge>
        </filter>
      </defs>

      {/* Capa base del fondo (mismo gris de la página para continuidad) */}
      <rect width="100%" height="100%" fill="#ECEDEC" />

      {/* Grupo enmascarado: el gradiente solo aparece dentro de las letras */}
      <g mask="url(#egMask)">
        {/* Relleno de color (degradado) que se verá SOLO dentro de "EG" */}
        <rect width="100%" height="100%" fill="url(#egGrad)" />
        {/* Aplico el filtro de hendidura para dar profundidad */}
        <rect width="100%" height="100%" fill="transparent" filter="url(#innerDeboss)" />
      </g>
    </svg>
  );
}
