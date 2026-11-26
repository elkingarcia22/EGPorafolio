'use client'

import Image from 'next/image'
import { useLocale, type L } from '@/lib/i18n'
import { SHOTS, type ShotKey } from '@/lib/content/cases/encuestas/case'

interface SurfacesPhoneProps {
  surfaces: readonly { id: string; name: L; shot: ShotKey; line: L }[]
  index: number
  go: (i: number) => void
  reducedMotion: boolean
}

/** Proporción de las capturas */
const SHOT_RATIO = 1403 / 900

/**
 * Forma en el teléfono: el anillo 3D se vuelve un carrusel en perspectiva. La
 * pantalla de turno queda al frente, a todo el ancho; las vecinas asoman
 * giradas a los lados. Pasa sola y se desliza de lado; tocar una vecina la
 * trae al frente y tocar la del frente la amplía.
 */
export function SurfacesPhone({ surfaces, index, go, reducedMotion }: SurfacesPhoneProps) {
  const { t } = useLocale()
  const n = surfaces.length
  const s = surfaces[index]

  return (
    <div className="relative mt-6">
      <div className="relative mx-auto w-full overflow-hidden" style={{ aspectRatio: '100 / 66', perspective: '1100px' }}>
        {surfaces.map((sf, i) => {
          // Distancia por el camino corto: -1 a la izquierda, 0 al frente, 1 a la derecha
          const d = ((i - index + n + n / 2) % n) - n / 2
          const side = Math.abs(d) === 1
          const visible = d === 0 || side
          const shot = SHOTS[sf.shot]
          return (
            <button
              key={sf.id}
              type="button"
              onClick={d === 0 ? undefined : () => go(i)}
              aria-label={t(sf.name)}
              aria-hidden={!visible}
              tabIndex={side ? 0 : -1}
              className="absolute left-[7%] top-[6%] w-[86%] overflow-hidden rounded-xl bg-white outline-none"
              style={{
                aspectRatio: `${SHOT_RATIO}`,
                transform: d === 0 ? 'none' : `translateX(${d * 64}%) rotateY(${-d * 55}deg) scale(0.82)`,
                opacity: d === 0 ? 1 : side ? 0.4 : 0,
                zIndex: d === 0 ? 2 : 1,
                pointerEvents: visible ? 'auto' : 'none',
                boxShadow: d === 0 ? '0 40px 80px -30px rgb(var(--signal) / 0.75)' : 'none',
                transition: reducedMotion ? 'none' : 'transform 900ms cubic-bezier(.65,0,.35,1), opacity 700ms',
              }}
            >
              <Image src={shot.src} width={shot.width} height={shot.height} alt={t(shot.alt)} sizes="86vw" className="h-full w-full object-cover object-left-top" />
            </button>
          )
        })}
      </div>

      <div key={index} className="obj-fade mx-auto mt-2 max-w-[340px] text-center" aria-live="polite">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">{index + 1}/{n}</p>
        <p className="mt-1 text-[24px] font-light leading-tight">{t(s.name)}</p>
        <p className="mt-2 text-balance text-[15px] leading-snug text-paper/70">{t(s.line)}</p>
      </div>

      {/* La fibra con un nodo por superficie */}
      <ol className="relative mx-auto mt-7 flex max-w-[260px] justify-between">
        <span aria-hidden="true" className="absolute inset-x-2 top-1/2 h-px bg-white/12" />
        <span aria-hidden="true" className="absolute left-2 right-2 top-1/2 h-px origin-left bg-gradient-to-r from-signal via-[rgb(var(--glow))] to-[rgb(var(--spark))] shadow-[0_0_10px_rgb(var(--signal)/0.7)] transition-transform duration-700 ease-expo" style={{ transform: `scaleX(${index / (n - 1)})` }} />
        {surfaces.map((sf, i) => {
          const on = i === index
          return (
            <li key={sf.id} className="relative">
              <button type="button" onClick={() => go(i)} aria-label={t(sf.name)} aria-current={on} className="grid h-8 w-8 place-items-center outline-none">
                <span className="relative grid h-3 w-3 place-items-center" aria-hidden="true">
                  <span className={`absolute inset-0 rounded-full border transition-all duration-500 ${on ? 'scale-125 border-white bg-[#fffaf0] shadow-[0_0_0_4px_rgb(var(--signal)/0.25),0_0_16px_4px_rgb(var(--signal)/0.7)]' : i < index ? 'border-white/60 bg-signal' : 'border-white/35 bg-void'}`} />
                  {on && <span className="absolute inset-[-7px] rounded-full border border-signal/60 animate-[nav-node-ping_2.2s_cubic-bezier(0,0,.2,1)_infinite]" />}
                  {/* De «Resultados» sale la fibra hacia «IA en el proceso» */}
                  {i === n - 1 && <span data-fiber-from="enc-ia" className="absolute left-1/2 top-1/2 h-px w-px" />}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
