'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { SELLUP_CASE } from '@/lib/content/cases/sellup/sellup-case'

/** Cada cuánto pasa a la frase siguiente (ms) */
const STEP_MS = 3600
/** Si la persona elige una, espera esto antes de seguir sola (ms) */
const RESUME_MS = 9000

/** La pregunta, en trozos: los que tienen `p` son las frases de las que nace un principio */
const QUESTION: readonly { text: L; p?: number }[] = [
  { text: { es: '…darle a ', en: '…give ' } },
  { text: { es: 'cada vendedor', en: 'every rep' }, p: 0 },
  { text: { es: ' la empresa, la persona y ', en: ' the right company, the right person and ' } },
  { text: { es: 'las palabras correctas', en: 'the right words' }, p: 3 },
  { text: { es: ', ', en: ', ' } },
  { text: { es: 'sin gastar un crédito de más', en: 'without spending an extra credit' }, p: 1 },
  { text: { es: ' ni ', en: ' or ' } },
  { text: { es: 'escribir en HubSpot sin permiso', en: 'writing to HubSpot without permission' }, p: 2 },
  { text: { es: '?', en: '?' } },
]
/** Los principios en el orden en que aparecen sus frases: así las fibras no se cruzan */
const ORDER = QUESTION.filter((q) => q.p !== undefined).map((q) => q.p as number)

/** Nombre corto de cada principio (índice del contenido) */
const SHORT: readonly L[] = [
  { es: 'La persona decide', en: 'The person decides' },
  { es: 'Primero lo gratis', en: 'Free first' },
  { es: 'HubSpot con permiso', en: 'HubSpot with permission' },
  { es: 'Todo deja rastro', en: 'Everything leaves a trace' },
]

/**
 * 03 · La idea: la pregunta, y de debajo de ella se abren cuatro fibras, una
 * por principio; cada principio nace de una frase de la pregunta. Se recorren solas, una a la vez: la frase se
 * enciende, la fibra se tiende y el principio se prende. Tocar uno lo fija
 * y da su detalle. Del último sale la fibra hacia «Bocetos».
 */
export function SellUpIdea() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const { idea } = SELLUP_CASE
  const rootRef = useRef<HTMLDivElement>(null)
  const questionRef = useRef<HTMLParagraphElement>(null)
  const phraseRefs = useRef<(HTMLSpanElement | null)[]>([])
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [paths, setPaths] = useState<readonly string[]>([])
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [inView, setInView] = useState(false)
  /** Posición (en ORDER) de la frase encendida */
  const [at, setAt] = useState(0)
  const [picked, setPicked] = useState(false)

  // Las fibras se miden sobre el texto real: de la frase (abajo, al centro) al nodo.
  const measure = useCallback(() => {
    const root = rootRef.current
    if (!root) return
    const r = root.getBoundingClientRect()
    setBox({ w: r.width, h: r.height })
    setPaths(
      ORDER.map((p) => {
        const a = phraseRefs.current[p]?.getBoundingClientRect()
        const b = nodeRefs.current[p]?.getBoundingClientRect()
        if (!a || !b) return ''
        // Todas nacen del mismo punto, bajo la pregunta (no la atraviesan), y se abren hacia su principio
        const q = questionRef.current?.getBoundingClientRect()
        const x1 = q ? q.left + q.width / 2 - r.left : a.left + a.width / 2 - r.left
        const y1 = (q ? q.bottom : a.bottom) - r.top + 22
        const x2 = b.left + b.width / 2 - r.left
        const y2 = b.top + b.height / 2 - r.top
        const dy = y2 - y1
        return `M${x1} ${y1} C${x1} ${y1 + dy * 0.55}, ${x2} ${y2 - dy * 0.55}, ${x2} ${y2}`
      }),
    )
  }, [])

  useLayoutEffect(() => {
    measure()
    const root = rootRef.current
    if (!root) return
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    document.fonts?.ready.then(measure).catch(() => undefined)
    return () => ro.disconnect()
  }, [measure, t])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -30% 0px' })
    io.observe(root)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reducedMotion) return
    const id = window.setTimeout(() => {
      setPicked(false)
      setAt((a) => (a + 1) % ORDER.length)
    }, picked ? RESUME_MS : STEP_MS)
    return () => window.clearTimeout(id)
  }, [inView, reducedMotion, at, picked])

  const activeP = ORDER[at]
  const principle = idea.principles[activeP]
  const pick = (p: number) => {
    setAt(ORDER.indexOf(p))
    setPicked(true)
  }

  return (
    <div ref={rootRef} className="relative">
      {/* Las fibras de cada frase a su principio: tenues todas, la encendida se tiende */}
      <svg viewBox={`0 0 ${box.w || 1} ${box.h || 1}`} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="su-idea-fiber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7e2be0" />
            <stop offset="1" stopColor="rgb(var(--signal))" />
          </linearGradient>
        </defs>
        {/* El punto del que nacen las cuatro fibras */}
        {paths[0] && (() => {
          const m = /^M([\d.]+) ([\d.]+)/.exec(paths[0])
          return m ? <circle cx={m[1]} cy={m[2]} r={4} fill="#fffaf0" style={{ filter: 'drop-shadow(0 0 6px rgb(var(--signal)))' }} /> : null
        })()}
        {paths.map((d, i) => d && (
          <g key={ORDER[i]}>
            <path d={d} fill="none" stroke="white" strokeOpacity={0.16} strokeWidth={1.2} strokeDasharray="2 5" />
            <path
              key={`${ORDER[i]}-${i === at}`}
              d={d}
              fill="none"
              stroke="url(#su-idea-fiber)"
              strokeWidth={1.8}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={i === at ? 0 : 1}
              className={i === at && !reducedMotion ? 'su-draw' : undefined}
              style={{ filter: 'drop-shadow(0 0 5px rgb(var(--signal) / 0.7))' }}
            />
          </g>
        ))}
      </svg>

      <p data-reveal className="mono-label mb-5 text-center text-signal">{t({ es: '¿Cómo podríamos…?', en: 'How might we…?' })}</p>
      <p ref={questionRef} className="relative mx-auto max-w-[30ch] text-balance text-center text-[clamp(1.5rem,1rem+2vw,2.8rem)] font-light leading-[1.3] tracking-tight">
        {QUESTION.map((q, i) => {
          if (q.p === undefined) return <span key={i} className="text-paper/55">{t(q.text)}</span>
          const p = q.p
          const on = p === activeP
          return (
            <span
              key={i}
              ref={(el) => {
                phraseRefs.current[p] = el
              }}
              role="button"
              tabIndex={0}
              onClick={() => pick(p)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  pick(p)
                }
              }}
              className={`cursor-pointer bg-[length:100%_2px] bg-bottom bg-no-repeat outline-none transition-colors duration-500 ${on ? 'text-paper' : 'text-paper/75 hover:text-paper'}`}
              style={{ backgroundImage: on ? 'linear-gradient(90deg,#285ee6,#7e2be0,#d22d6a)' : 'linear-gradient(90deg,rgb(255 255 255 / 0.18),rgb(255 255 255 / 0.18))' }}
            >
              {t(q.text)}
            </span>
          )
        })}
      </p>

      {/* Los principios: un nodo por frase, en el mismo orden */}
      <ol className="relative mx-auto mt-[clamp(5rem,4rem+5vw,8rem)] grid max-w-[880px] grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {ORDER.map((p, i) => {
          const on = p === activeP
          return (
            <li key={p}>
              <button type="button" aria-pressed={on && picked} onClick={() => pick(p)} className="group flex w-full flex-col items-center text-center outline-none">
                <span
                  ref={(el) => {
                    nodeRefs.current[p] = el
                  }}
                  className="relative grid h-4 w-4 place-items-center"
                  aria-hidden="true"
                >
                  {on && <span className="absolute inset-[-8px] rounded-full border border-signal/60 animate-[nav-node-ping_2.2s_cubic-bezier(0,0,.2,1)_infinite]" />}
                  <span className={`h-full w-full rounded-full border transition-all duration-500 ${on ? 'scale-125 border-white bg-[#fffaf0] shadow-[0_0_0_4px_rgb(var(--signal)/0.25),0_0_18px_4px_rgb(var(--signal)/0.7)]' : 'border-white/50 bg-void group-hover:border-white'}`} />
                  {i === ORDER.length - 1 && <span data-fiber-from="su-bocetos" className="absolute left-1/2 top-1/2 h-px w-px" />}
                </span>
                <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/40">0{i + 1}</span>
                <span className={`mt-1.5 text-balance text-[15px] leading-tight transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-45 group-hover:opacity-80'}`}>{t(SHORT[p])}</span>
              </button>
            </li>
          )
        })}
      </ol>

      {/* El principio encendido, en una frase; el detalle, al tocarlo */}
      <div key={activeP} aria-live="polite" className="su-fade mx-auto mt-12 min-h-[4.5rem] max-w-[58ch] text-center">
        <p className="text-balance text-[clamp(1.05rem,0.9rem+0.6vw,1.4rem)] font-light leading-snug">{t(principle.title)}</p>
        {picked && <p className="mt-2 text-balance text-sm leading-relaxed text-paper/60">{t(principle.body)}</p>}
      </div>
    </div>
  )
}
