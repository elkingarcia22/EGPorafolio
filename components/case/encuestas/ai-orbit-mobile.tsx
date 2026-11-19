'use client'

import { AI_GRADIENT, BUILDER, SECTIONS } from '@/lib/content/cases/encuestas/orbit-real'
import { Message, Orb, UNITS, type Frame } from './ai-orbit'

/** En qué unidad del guion aparece cada subsección y cada pregunta (el mismo orden que en escritorio). */
const SUB_AT: Record<string, number> = { '1.1': 1, '2.1': 8, '2.2': 9 }
const Q_START: Record<string, number> = { '1.1': 2, '2.2': 10 }
const SECTION_SPAN = [
  { start: 0, done: 6 },
  { start: 7, done: 14 },
] as const

/** Lo que Orbit va creando, en tarjetas a lo ancho del celular: secciones, subsecciones y preguntas que entran. */
function MobileBuilt({ built }: { built: number }) {
  const seen = (i: number) => built > i
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden px-3 pb-3 [mask-image:linear-gradient(180deg,transparent,#000_12%)]">
      {SECTIONS.map((sec, si) => {
        const { start, done } = SECTION_SPAN[si]
        if (!seen(start)) return null
        const creating = !seen(done)
        // Como en el producto, la sección terminada se pliega: quedan sus subsecciones y el conteo.
        const collapsed = !creating && si < SECTIONS.length - 1
        return (
          <article
            key={sec.n}
            className={`enc-ai-pop shrink-0 rounded-xl border bg-white px-3 py-2.5 transition-[border-color,box-shadow] duration-500 ${creating ? 'border-[#7e2be0] shadow-[0_10px_24px_-14px_rgba(126,43,224,0.7)]' : 'border-black/[0.08]'}`}
          >
            <p className="flex items-center gap-2 text-[14px] font-semibold">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0c5bef] text-[11px] text-white">{sec.n}</span>
              <span className="min-w-0 flex-1 truncate">{sec.title}</span>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-black/10 px-1.5 py-0.5 text-[11px] font-normal">
                <Orb className={`h-3.5 w-3.5 ${creating ? 'enc-ai-spin' : ''}`} />
                {creating ? 'Creando…' : 'Creada con IA'}
              </span>
            </p>
            <div className="mt-1.5 space-y-1.5">
              {sec.subs.map((sub) => {
                if (!seen(SUB_AT[sub.n] ?? 99)) return null
                const qs = sub.questions ?? []
                const shown = qs.filter((_, k) => seen((Q_START[sub.n] ?? 99) + k))
                return (
                  <div key={sub.n} className="enc-ai-in">
                    <p className="flex items-center gap-1.5 text-[13px] font-medium">
                      <span className="rounded border border-black/10 px-1 font-mono text-[11px]">{sub.n}</span>
                      <span className="truncate">{sub.title}</span>
                      <span className="ml-auto shrink-0 text-[11px] font-normal text-[#5c646f]">{qs.length ? `${shown.length}/${qs.length}` : '4'} preg.</span>
                    </p>
                    {!collapsed && shown.map((q) => (
                      <p key={q.n} className="enc-ai-pop ml-1 mt-1 flex gap-2 border-l-2 border-[#7e2be0]/30 pl-2 text-[12px] leading-snug text-[#414a5c]">
                        <span className="shrink-0 font-mono text-[11px] text-[#979ba3]">{q.n}</span>
                        {q.text}
                      </p>
                    ))}
                  </div>
                )
              })}
            </div>
          </article>
        )
      })}
    </div>
  )
}

/**
 * Orbit en el celular: el mismo guion que en escritorio, en una sola columna. Primero el chat a lo ancho (pedido,
 * preguntas y respuestas); al empezar a crear, el chat se reduce a lo que Orbit está haciendo y la encuesta crece debajo.
 */
export function OrbitMobile({ f, working }: { f: Frame; working: boolean }) {
  const docked = f.part === 2
  const status = docked ? f.msgs.filter((m) => m.kind === 'thinking' || m.kind === 'agent').slice(-1) : f.msgs
  const finished = f.built >= UNITS.length
  return (
    <div className="relative h-[36rem] overflow-hidden rounded-3xl bg-[#f7f8fb] p-2.5">
      <div
        className="enc-ai-aurora pointer-events-none absolute -inset-[8%]"
        style={{ background: 'radial-gradient(70% 60% at 0% 0%, color-mix(in oklab, #285ee6 24%, transparent), transparent 72%), radial-gradient(70% 60% at 100% 0%, color-mix(in oklab, #eb6233 22%, transparent), transparent 72%)' }}
        aria-hidden="true"
      />
      {/* Mientras Orbit trabaja, el borde de IA gira alrededor de la tarjeta. */}
      <div className={`pointer-events-none absolute inset-[8px] transition-opacity duration-500 ${working ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
        <span className="enc-ai-border enc-ai-border-line absolute inset-0 rounded-[18px]" />
      </div>
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white text-[#303a47]">
        <div className="flex items-center gap-2.5 border-b border-black/[0.06] px-3.5 py-2.5">
          <Orb className="h-7 w-7" />
          <p className="text-[15px] font-semibold">Orbit</p>
          <span key={f.context.label} className="enc-ai-in ml-auto min-w-0 truncate rounded-full bg-[#f1f3f6] px-2.5 py-1 text-[11px] text-[#5c646f]">{f.context.label}</span>
        </div>

        {/* La conversación: llena la tarjeta en la parte 1 y se reduce a una línea de estado en la 2. */}
        <div
          className={`flex flex-col justify-end gap-3 overflow-hidden px-3.5 transition-[flex-grow,padding] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] [mask-image:linear-gradient(180deg,transparent,#000_14%)] ${docked ? 'flex-none py-2.5' : 'min-h-0 flex-1 py-3'}`}
        >
          {status.map((m, i) => <Message key={`${m.kind}-${'text' in m ? m.text : i}`} m={m} />)}
        </div>

        {docked ? (
          <>
            <p className="mx-3 mb-2 flex items-center justify-between border-t border-black/[0.06] pt-2 text-[12px]">
              <span className="font-semibold">Secciones y preguntas</span>
              <span className="text-[11px] text-[#5c646f]">Paso 4 de 5</span>
            </p>
            <MobileBuilt built={f.built} />
            <p className="flex items-center justify-between border-t border-black/[0.06] px-3 py-2 text-[11px]">
              <span className="rounded-full border border-black/10 px-2 py-0.5">{finished ? 'Guardado' : 'Cambios sin guardar'}</span>
              <span className="rounded-md bg-[#0c5bef] px-2.5 py-1 text-white">Continuar ›</span>
            </p>
          </>
        ) : (
          <div className="px-2.5 pb-2.5">
            <div className="rounded-[18px] p-[1.5px] transition-[background] duration-500" style={{ background: f.composer.focus ? AI_GRADIENT : 'rgba(0,0,0,0.08)' }}>
              <div className="flex items-end gap-2 rounded-[16.5px] bg-white px-3 py-2">
                <p className="min-h-[2.6rem] flex-1 text-[13px] leading-snug">
                  {f.composer.text ? (
                    <>
                      {f.composer.text}
                      <span className="enc-ai-caret ml-px inline-block h-3.5 w-px bg-[#303a47] align-middle" />
                    </>
                  ) : (
                    <span className="text-[#979ba3]">{f.composer.placeholder}</span>
                  )}
                </p>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-opacity ${f.composer.text ? 'opacity-100' : 'opacity-40'}`} style={{ background: '#285ee6' }}>↑</span>
              </div>
            </div>
            <p className="mt-1.5 text-center text-[11px] text-[#979ba3]">{BUILDER.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  )
}
