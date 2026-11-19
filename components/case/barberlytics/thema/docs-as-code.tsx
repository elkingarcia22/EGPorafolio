'use client'

import { useEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale } from '@/lib/i18n'
import { ClipperOrb, type ClipperOrbState } from '../clipper-orb'
import { useTick } from './live-pieces'

/** La ficha real de ClipperOrb (src/docs/registry/ai/clipper-orb.tsx), resumida. */
const CODE: readonly { text: string; tone?: 'key' | 'str' | 'dim' }[] = [
  { text: 'export const clipperOrbEntry = defineEntry({', tone: 'key' },
  { text: '  id: "clipper-orb",', tone: 'str' },
  { text: '  name: "ClipperOrb",', tone: 'str' },
  { text: '  group: "ai",', tone: 'str' },
  { text: '  description: "El símbolo de la IA en todo el sistema…",', tone: 'str' },
  { text: '  status: "stable",', tone: 'str' },
  { text: '  playground: definePlayground({', tone: 'key' },
  { text: '    controls: {' },
  { text: '      size: { type: "number", default: 128, min: 14, max: 220 },' },
  { text: '      state: { type: "select", options: ["idle", "listening", "thinking"] },' },
  { text: '    },' },
  { text: '  }),' },
  { text: '  props: [ size · state · bare ],', tone: 'dim' },
  { text: '  guidelines: {', tone: 'key' },
  { text: '    do: ["Úsalo siempre que haya que mostrar «la IA»…"],', tone: 'str' },
  { text: '    dont: ["No dibujes otro destello o icono de IA…"],', tone: 'str' },
  { text: '  },' },
  { text: '})' , tone: 'key' },
]

const TONE = { key: 'text-[#d9b36a]', str: 'text-[#9fd6c4]', dim: 'text-white/45' } as const

const PROPS = [
  ['size', 'number', '128', 'Lado en px.'],
  ['state', '"idle" | "listening" | "thinking"', '"idle"', 'Lo que hace Clipper.'],
  ['bare', 'boolean', 'false', 'Sin halo ni anillo.'],
] as const

const STATES: readonly ClipperOrbState[] = ['idle', 'listening', 'thinking']

/** Escribe el código línea a línea cuando el panel entra en pantalla. */
function useTypedLines(total: number) {
  const { reducedMotion } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(reducedMotion ? total : 0)
  useEffect(() => {
    if (reducedMotion) return setShown(total)
    const el = ref.current
    if (!el) return
    let timer = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      timer = window.setInterval(() => setShown((n) => (n >= total ? (window.clearInterval(timer), n) : n + 1)), 140)
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => {
      observer.disconnect()
      window.clearInterval(timer)
    }
  }, [total, reducedMotion])
  return { ref, shown }
}

/** La documentación es código: la ficha de un componente y lo que genera. */
export function DocsAsCode() {
  const { t } = useLocale()
  const { ref, shown } = useTypedLines(CODE.length)
  const tick = useTick(2200)
  const state = STATES[tick % STATES.length]

  return (
    <div ref={ref} className="grid gap-6 lg:grid-cols-2">
      <figure data-reveal="device" className="overflow-hidden rounded-xl bg-[#0d0e11] ring-1 ring-white/10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
        <figcaption className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 font-mono text-[11px] text-white/55">
          <span>src/docs/registry/ai/clipper-orb.tsx</span>
          <span className="text-[#d9b36a]">TSX</span>
        </figcaption>
        <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-[1.75] text-white/85">
          {CODE.map((line, i) => (
            <span key={i} className={`block transition-opacity duration-300 ${line.tone ? TONE[line.tone] : ''} ${i < shown ? 'opacity-100' : 'opacity-0'}`}>
              <span className="mr-4 inline-block w-5 select-none text-right text-white/25">{i + 1}</span>
              {line.text}
            </span>
          ))}
        </pre>
      </figure>

      <figure data-reveal="device" className="overflow-hidden rounded-xl bg-[#17140f] text-[#efe9dd] ring-1 ring-[#d9b36a]/15 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
        <figcaption className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 font-mono text-[11px] text-white/55">
          /docs#/components/clipper-orb
        </figcaption>
        <div className="p-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#d9b36a]">IA · stable</p>
          <p className="mt-1 text-2xl font-semibold">ClipperOrb</p>
          <p className="mt-2 text-sm text-white/65">{t({ es: 'El símbolo de la IA en todo el sistema: el poste de barbería hecho esfera de vidrio.', en: 'The AI symbol across the system: the barber pole turned into a glass sphere.' })}</p>
          <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-black/25 p-5">
            <ClipperOrb size={92} state={state} />
            <div className="flex flex-col gap-1.5 text-xs">
              {STATES.map((s) => (
                <span key={s} className={`rounded-md px-2.5 py-1 font-mono transition-colors ${s === state ? 'bg-[#d9b36a] text-[#17140f]' : 'text-white/50'}`}>state=&quot;{s}&quot;</span>
              ))}
            </div>
          </div>
          <table className="mt-5 w-full text-left text-[11px]">
            <thead className="text-white/45">
              <tr><th className="pb-2 font-normal">Prop</th><th className="pb-2 font-normal">{t({ es: 'Tipo', en: 'Type' })}</th><th className="pb-2 font-normal">Default</th></tr>
            </thead>
            <tbody>
              {PROPS.map(([name, type, def]) => (
                <tr key={name} className="border-t border-white/10">
                  <td className="py-2 font-mono text-[#d9b36a]">{name}</td>
                  <td className="py-2 font-mono text-white/70">{type}</td>
                  <td className="py-2 font-mono text-white/55">{def}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-5 grid gap-2 text-xs sm:grid-cols-2">
            <p className="rounded-lg border border-[#7fd8af]/30 bg-[#7fd8af]/10 p-3"><span className="text-[#7fd8af]">✓ </span>{t({ es: 'Úsalo siempre que haya que mostrar «la IA».', en: 'Use it whenever “the AI” needs showing.' })}</p>
            <p className="rounded-lg border border-[#e5484d]/30 bg-[#e5484d]/10 p-3"><span className="text-[#e5484d]">✕ </span>{t({ es: 'No dibujes otro destello o icono de IA.', en: 'Don’t draw any other AI sparkle or icon.' })}</p>
          </div>
        </div>
      </figure>
    </div>
  )
}
