export default function Page() {
  return (
    <main className="min-h-screen bg-[#ECEDEC] relative overflow-hidden">
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

      {/* SVG que genera el relieve HUNDIDO + degradado dentro de las letras */}
      <EGDebossed />

      {/* Contenido de la página (si quieres poner algo encima) */}
      <section className="relative z-10 flex items-center justify-center min-h-screen">
        {/* vacío: es un fondo */}
      </section>
    </main>
  );
}

/**
 * SVG FULLSCREEN: letras "EG" hundidas (debossed) con degradado azul→verde
 * - 100% ancho/alto, centrado
 * - Filtro de doble sombra interna (clara arriba-izquierda, oscura abajo-derecha)
 * - Degradado aplicado SOLO dentro de las letras mediante máscara
 */
function EGDebossed() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
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
          {/* Texto grande centrado. Usa una fuente sans geométrica para parecerse al ejemplo */}
          <g transform="translate(0, 45)">
            <text
              x="50%"
              y="50%"
              fill="white"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
              fontWeight={800}
              fontSize={420}
              letterSpacing="8"
            >
              EG
            </text>
          </g>
        </mask>

        {/* Filtro de hendidura (inner shadow doble para neuromórfico) */}
        <filter id="innerDeboss" x="-20%" y="-20%" width="140%" height="140%">
          {/* sombra oscura interior (abajo-derecha) */}
          <feOffset dx="0" dy="4" in="SourceAlpha" result="off1" />
          <feGaussianBlur in="off1" stdDeviation="6" result="blur1" />
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
                    0 0 0 .45 0"
            result="darkInner"
          />

          {/* realce claro interior (arriba-izquierda) */}
          <feOffset dx="0" dy="-4" in="SourceAlpha" result="off2" />
          <feGaussianBlur in="off2" stdDeviation="6" result="blur2" />
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
                    0 0 0 .7 0"
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
