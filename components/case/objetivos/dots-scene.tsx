'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/motion'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { MOMENTS, ROLE_NAME, type Moment } from './lifecycle-moments'

/** Lienzo de la escena (unidades del SVG) */
const W = 800
const H = 560
const C = { x: W / 2, y: H / 2 }
const R = 190
/** Cuánto se salen del anillo los momentos que no existían (antes del rediseño) */
const LOOSE = { push: 70, scale: 0.6 }
/** Cuánto se queda cada etapa en la animación (ms); la última se queda fija */
const STAGE_MS = [2800, 3400, 3400, 3400]

/** Etapas: el ciclo de antes, sus tres puntos sueltos y el rediseño conectado */
type Stage = 0 | 1 | 2 | 3 | 4
const STAGES = 5
/** Hacia dónde mira la cámara en cada etapa: el momento en foco y cuánto se acerca */
const CAMERA: Record<Stage, { focus: number | null; zoom: number }> = {
  0: { focus: null, zoom: 1 },
  1: { focus: 3.5, zoom: 1.25 },
  2: { focus: 1, zoom: 2.3 },
  3: { focus: 4.5, zoom: 1.7 },
  4: { focus: null, zoom: 1 },
}
/** Momentos que se señalan en cada punto suelto */
const HOT: Partial<Record<Stage, readonly number[]>> = { 1: [2, 3, 4, 5, 6], 2: [1], 3: [4, 5] }

const angleOf = (i: number) => ((i * 360) / MOMENTS.length - 90) * (Math.PI / 180)
const round = (n: number) => Math.round(n * 100) / 100
const onRing = (i: number, r = R) => ({ x: round(C.x + Math.cos(angleOf(i)) * r), y: round(C.y + Math.sin(angleOf(i)) * r) })
/** Arco del anillo entre dos momentos seguidos */
const arcPath = (i: number) => {
  const a = onRing(i)
  const b = onRing((i + 1) % MOMENTS.length)
  return `M${a.x} ${a.y} A${R} ${R} 0 0 1 ${b.x} ${b.y}`
}

/**
 * 01 · Los puntos, como una escena que se anima sola al entrar: primero el
 * ciclo de antes (dos momentos conectados y cinco sueltos, fuera del anillo);
 * la cámara se acerca a cada punto suelto; al final los siete entran al anillo,
 * las fibras los conectan y una señal lo recorre. Tocar un momento muestra qué
 * es y quién lo vive.
 */
export function DotsScene() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const rootRef = useRef<HTMLDivElement>(null)
  /** La escena empezó a animarse (al entrar en pantalla) */
  const [playing, setPlaying] = useState(false)
  const cameraRef = useRef<SVGGElement>(null)
  /** Dónde está la cámara ahora (para seguir desde ahí al cambiar de etapa) */
  const camState = useRef({ x: C.x, y: C.y, s: 1 })
  const [stage, setStage] = useState<Stage>(reducedMotion ? 4 : 0)
  const [picked, setPicked] = useState<number | null>(null)
  const connected = stage === 4
  const covered = (m: Moment) => connected || m.before
  const count = MOMENTS.filter(covered).length

  // Se anima sola cuando entra en pantalla: etapa por etapa hasta el ciclo conectado.
  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion) {
      setStage(4)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setPlaying(true)
        observer.disconnect()
      },
      { rootMargin: '0px 0px -35% 0px' },
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [reducedMotion])

  useEffect(() => {
    if (!playing || stage >= 4 || picked !== null) return
    const id = window.setTimeout(() => setStage((s) => Math.min(4, s + 1) as Stage), STAGE_MS[stage])
    return () => window.clearTimeout(id)
  }, [playing, stage, picked])

  /** Elegir una etapa (o volver a empezar) */
  const goTo = (next: Stage) => {
    setPicked(null)
    setPlaying(true)
    setStage(next)
  }

  // La cámara viaja al momento en foco de la etapa.
  useEffect(() => {
    const cam = cameraRef.current
    if (!cam) return
    const { focus, zoom } = CAMERA[stage]
    const target = focus === null ? C : (() => {
      const a = onRing(Math.floor(focus))
      const b = onRing(Math.ceil(focus) % MOMENTS.length)
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
    })()
    const state = camState.current
    const apply = () => {
      cam.setAttribute('transform', `translate(${C.x} ${C.y}) scale(${state.s}) translate(${-state.x} ${-state.y})`)
    }
    const tween = gsap.to(state, { x: target.x, y: target.y, s: zoom, duration: reducedMotion ? 0 : 1.2, ease: 'expo.inOut', onUpdate: apply })
    return () => {
      tween.kill()
    }
  }, [stage, reducedMotion])

  const caption = (() => {
    if (picked !== null) {
      const m = MOMENTS[picked]
      return { tag: `0${picked + 1} · ${t(m.name)}`, title: covered(m) ? t(m.where) : t({ es: 'No existía.', en: 'Didn’t exist.' }), roles: m.roles }
    }
    if (stage === 0) return { tag: t({ es: 'Antes', en: 'Before' }), title: t(OBJ_CASE.dots.kicker) }
    if (stage === 4) return { tag: t({ es: 'Rediseño', en: 'Redesign' }), title: t({ es: 'Los siete momentos, conectados.', en: 'All seven moments, connected.' }) }
    const seen = OBJ_CASE.dots.seen[stage - 1]
    return { tag: `0${stage} · ${t({ es: 'Punto suelto', en: 'Loose end' })}`, title: t(seen.title), body: t(seen.body) }
  })()

  return (
    <div ref={rootRef} className="relative mt-12">
      <div className="flex flex-col items-center text-center">
        {/* Lo que dice la etapa (o el momento elegido): poco texto, sobre la escena */}
        <div key={`${stage}-${picked}`} className="obj-fade flex min-h-[8.5rem] max-w-[36ch] flex-col items-center justify-end">
          <p className="mono-label text-signal">{caption.tag}</p>
          <p className="mt-3 text-[clamp(1.4rem,1rem+1.4vw,2.2rem)] font-light leading-[1.15] tracking-tight">{caption.title}</p>
          {caption.body && <p className="mt-2 text-sm leading-relaxed text-paper/55">{caption.body}</p>}
          {caption.roles && (
            <p className="mt-3 flex justify-center gap-2">
              {caption.roles.map((r) => (
                <span key={r} className="rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/70">{t(ROLE_NAME[r])}</span>
              ))}
            </p>
          )}
        </div>

        <div className="relative mx-auto mt-6 w-full max-w-[760px] overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(ellipse_at_50%_45%,rgb(var(--signal)/0.12),transparent_65%)]">
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto max-h-[50svh] w-full" role="group" aria-label={t({ es: 'Los siete momentos del ciclo', en: 'The seven cycle moments' })}>
            <defs>
              <linearGradient id="dots-fiber" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="rgb(var(--signal))" />
                <stop offset="1" stopColor="#ff54aa" />
              </linearGradient>
            </defs>
            <g ref={cameraRef}>
              {/* El anillo: tenue de fondo, y las fibras que conectan cada momento con el siguiente */}
              <circle cx={C.x} cy={C.y} r={R} fill="none" stroke="white" strokeOpacity={0.06} />
              {MOMENTS.map((m, i) => {
                const lit = connected || (m.before && MOMENTS[(i + 1) % MOMENTS.length].before && i < MOMENTS.length - 1)
                return (
                  <path
                    key={m.id}
                    d={arcPath(i)}
                    pathLength={1}
                    fill="none"
                    stroke="url(#dots-fiber)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeDasharray="1"
                    strokeDashoffset={lit ? 0 : 1}
                    style={{ transition: `stroke-dashoffset 0.9s cubic-bezier(.65,0,.35,1) ${connected ? i * 0.14 : 0}s`, filter: 'drop-shadow(0 0 4px rgb(var(--signal) / 0.6))' }}
                  />
                )
              })}
              {/* La señal que recorre el ciclo cuando ya está conectado */}
              <circle
                cx={C.x}
                cy={C.y}
                r={R}
                fill="none"
                stroke="white"
                strokeWidth={3}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="0.04 0.96"
                transform={`rotate(-90 ${C.x} ${C.y})`}
                className="dots-signal"
                style={{ opacity: connected ? 1 : 0, transition: 'opacity 0.6s 1s', filter: 'drop-shadow(0 0 6px white)' }}
              />
              {/* Los momentos: los que no existían quedan sueltos, fuera del anillo, hasta el rediseño */}
              {MOMENTS.map((m, i) => {
                const on = covered(m)
                const at = on ? onRing(i) : onRing(i, R + LOOSE.push)
                const label = onRing(i, (on ? R : R + LOOSE.push) + 30)
                const hot = HOT[stage]?.includes(i)
                const isPicked = picked === i
                return (
                  <g
                    key={m.id}
                    role="button"
                    tabIndex={0}
                    aria-label={t(m.name)}
                    onClick={() => setPicked(isPicked ? null : i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setPicked(isPicked ? null : i)
                      }
                    }}
                    onMouseEnter={() => setPicked(i)}
                    onMouseLeave={() => setPicked(null)}
                    className="cursor-pointer outline-none"
                  >
                    <g style={{ transform: `translate(${at.x}px, ${at.y}px) scale(${on ? 1 : LOOSE.scale})`, transition: `transform 1s cubic-bezier(.16,1,.3,1) ${connected ? i * 0.1 : 0}s` }}>
                      <circle r={22} fill={hot ? '#ff54aa' : 'rgb(var(--signal))'} opacity={on || hot ? (isPicked ? 0.35 : 0.16) : 0} style={{ transition: 'opacity .5s, fill .5s' }} />
                      {hot && <circle r={14} fill="none" stroke="#ff54aa" strokeWidth={1.5} className="dots-hot" />}
                      <circle r={on ? 7 : 6} fill={on ? (isPicked ? 'white' : 'rgb(var(--signal))') : 'rgb(var(--void))'} stroke={on ? 'white' : 'rgb(255 255 255 / 0.55)'} strokeWidth={1.4} style={{ transition: 'fill .5s, stroke .5s' }} />
                    </g>
                    <g style={{ transform: `translate(${label.x}px, ${label.y}px)`, transition: `transform 1s cubic-bezier(.16,1,.3,1) ${connected ? i * 0.1 : 0}s` }}>
                      <text
                        textAnchor={label.x < C.x - 10 ? 'end' : label.x > C.x + 10 ? 'start' : 'middle'}
                        dy="0.35em"
                        className="pointer-events-none fill-current font-mono uppercase"
                        fontSize={12}
                        letterSpacing="0.14em"
                        style={{ opacity: on ? 0.85 : 0.42, transition: 'opacity .6s' }}
                      >
                        {t(m.name)}
                      </text>
                    </g>
                  </g>
                )
              })}
              {/* Centro: cuántos momentos cubre (se aparta mientras la cámara mira un punto suelto) */}
              <g style={{ opacity: CAMERA[stage].zoom > 1 ? 0.15 : 1, transition: 'opacity .8s' }}>
              <text x={C.x} y={C.y - 8} textAnchor="middle" className="fill-current" fontSize={72} fontWeight={300}>
                {count}
                <tspan fontSize={26} className="opacity-40">/7</tspan>
              </text>
              <text x={C.x} y={C.y + 30} textAnchor="middle" className="fill-current font-mono uppercase opacity-50" fontSize={11} letterSpacing="0.14em">
                {connected ? t({ es: 'en el rediseño', en: 'in the redesign' }) : t({ es: 'cubiertos hoy', en: 'covered today' })}
              </text>
              </g>
            </g>
          </svg>
        </div>

        {/* Las etapas: avanzan solas; tocar una lleva a ella */}
        <div className="mt-6 flex items-center gap-4">
          <ol className="relative flex items-center gap-6">
            <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-white/12" aria-hidden="true" />
            <span className="absolute left-1 top-1/2 h-px -translate-y-1/2 origin-left bg-gradient-to-r from-signal to-[#ff54aa] transition-[width] duration-700 ease-expo" style={{ width: `calc((100% - 0.5rem) * ${stage / (STAGES - 1)})` }} aria-hidden="true" />
            {Array.from({ length: STAGES }, (_, i) => (
              <li key={i} className="relative">
                <button
                  type="button"
                  onClick={() => goTo(i as Stage)}
                  aria-current={stage === i ? 'step' : undefined}
                  aria-label={i === 0 ? t({ es: 'Antes', en: 'Before' }) : i === 4 ? t({ es: 'Rediseño', en: 'Redesign' }) : `${t({ es: 'Punto suelto', en: 'Loose end' })} 0${i}`}
                  className={`block rounded-full transition-all duration-500 ease-expo ${stage === i ? 'h-3 w-3 bg-signal shadow-[0_0_12px_2px_rgb(var(--signal)/0.7)]' : i < stage ? 'h-2 w-2 bg-white/60' : 'h-2 w-2 border border-white/40 bg-void hover:border-white'}`}
                />
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => goTo(0)}
            className={`mono-label rounded-full border border-white/12 px-3 py-1 text-paper/60 transition-all duration-500 hover:border-white/35 hover:text-paper ${stage === 4 ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            ↻ {t({ es: 'Otra vez', en: 'Replay' })}
          </button>
        </div>

        {/* Al conectarse, las cifras del punto de partida */}
        <dl className={`mx-auto mt-8 grid w-full max-w-[760px] grid-cols-4 gap-3 transition-all duration-700 ease-expo ${connected ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
          {OBJ_CASE.dots.facts.map((f) => (
            <div key={f.label.es} className="text-center">
              <dt className="sr-only">{t(f.label)}</dt>
              <dd>
                <span className="block text-[clamp(1.6rem,1.2rem+1.4vw,2.6rem)] font-light leading-none text-signal tabular-nums">{f.value}</span>
                <span className="mt-2 block text-[11px] leading-snug text-paper/50">{t(f.label as L)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
