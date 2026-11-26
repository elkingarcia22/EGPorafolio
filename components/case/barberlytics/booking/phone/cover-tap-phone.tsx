'use client'

import { useLocale, type L } from '@/lib/i18n'

interface TapStep {
  label: L
  value: L
}

interface CoverTapPhoneProps {
  nodes: readonly TapStep[]
  /** Hasta qué nodo llegó la señal */
  lit: number
  /** Duración de cada salto (ms), para que la fibra baje al mismo ritmo */
  hopMs: number
  reducedMotion: boolean
}

/**
 * La portada en el teléfono: el recorrido de un toque baja como una columna.
 * Una fibra vertical se llena de nodo en nodo; cada nodo se enciende con su
 * halo y, a su lado, lo que pasa en palabras de verdad.
 */
export function CoverTapPhone({ nodes, lit, hopMs, reducedMotion }: CoverTapPhoneProps) {
  const { t } = useLocale()
  const last = nodes.length - 1
  const progress = lit / last

  return (
    <figure className="mx-auto w-full max-w-[340px]">
      <ol className="relative" aria-label={t({ es: 'Quien vuelve: su celular, lo reconoce, lo de siempre y un toque', en: 'Returning client: their phone, recognized, the usual and one tap' })}>
        {/* La fibra: apagada de fondo y, encima, lo recorrido */}
        <span aria-hidden="true" className="absolute bottom-7 left-[23px] top-7 w-px bg-white/10" />
        <span
          aria-hidden="true"
          className="absolute bottom-7 left-[22px] top-7 w-[3px] origin-top rounded-full bg-gradient-to-b from-[rgb(var(--signal))] to-[rgb(var(--bk))] shadow-[0_0_10px_rgb(var(--bk)/0.6)]"
          style={{ transform: `scaleY(${progress})`, transition: lit === 0 ? 'none' : `transform ${hopMs * 0.8}ms cubic-bezier(.5,0,.3,1)` }}
        />
        {nodes.map((n, i) => {
          const on = i <= lit
          const end = i === last
          return (
            <li key={n.label.es} className="relative flex items-center gap-5 py-3.5">
              <span className="relative grid h-12 w-12 shrink-0 place-items-center">
                <span className={`absolute inset-0 rounded-full transition-opacity duration-500 ${end ? 'bg-[rgb(var(--bk)/0.16)]' : 'bg-[rgb(var(--signal)/0.10)]'}`} style={{ opacity: on ? 1 : 0.3 }} />
                {on && i === lit && !reducedMotion && <span key={`ring-${lit}`} className="bk-ring absolute inset-2 rounded-full border border-white/80" />}
                <span
                  data-fiber-from={end ? 'bk-puntos' : undefined}
                  className={`relative grid place-items-center rounded-full border transition-[background-color,border-color,box-shadow] duration-500 ${end ? 'h-6 w-6' : 'h-4 w-4'}`}
                  style={{
                    backgroundColor: on ? (end ? 'rgb(var(--bk))' : 'white') : 'rgb(var(--void))',
                    borderColor: on ? 'white' : 'rgb(255 255 255 / 0.4)',
                    boxShadow: on ? '0 0 14px rgb(var(--bk) / 0.7)' : 'none',
                  }}
                >
                  {end && (
                    <svg viewBox="-8 -8 16 16" className="h-3 w-3" aria-hidden="true" style={{ opacity: on ? 1 : 0 }}>
                      <path d="M-5 0 l3.5 3.5 l6.5 -7" fill="none" stroke="rgb(var(--void))" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
              </span>
              <span className="min-w-0">
                <span className="block text-[1.2rem] font-light leading-tight transition-opacity duration-500" style={{ opacity: on ? 1 : 0.35 }}>{t(n.value)}</span>
                <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50">{t(n.label)}</span>
              </span>
            </li>
          )
        })}
      </ol>
      <figcaption className="mt-4 text-center text-[13px] leading-snug text-paper/50">
        {t({ es: 'De su celular a la cita, sin volver a decidir nada', en: 'From phone to booking, deciding nothing again' })}
      </figcaption>
    </figure>
  )
}
