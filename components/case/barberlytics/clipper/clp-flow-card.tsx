'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { ClipperOrb } from '../clipper-orb'

const FLOWS = CLIPPER_CASE.flows
const INK = '#2a2d33'
const STICKY: Record<string, string> = {
  yellow: '#ffe98a',
  pink: '#ffc2d4',
  blue: '#bfe0ff',
  green: '#c9efc0',
  orange: '#ffd2a8',
  violet: '#dcd0ff',
}
const TILT = [-1.5, 1.2, -0.8]

/** El número del paso y su nombre, escritos a mano */
function StepLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <p className="mb-2 flex items-center gap-2 font-hand text-[19px] leading-none">
      <span className="grid h-6 w-6 place-items-center rounded-full border-[1.5px] text-[14px]" style={{ borderColor: INK }}>{n}</span>
      {children}
    </p>
  )
}

/** Flecha a mano entre pasos */
function Down() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 34" className="mx-auto my-2 h-8 w-5" fill="none" stroke="#de8c3a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2 C 8 12, 12 20, 10 30" />
      <path d="M4 24 L10 31 L16 24" />
    </svg>
  )
}

/**
 * El tablero de bocetos en el teléfono: el mismo flujo, uno a la vez y en
 * columna, con letra que se lee. Los post-its (las reglas) aparecen al tocar.
 */
export function ClipperFlowCard({ i }: { i: number }) {
  const { t } = useLocale()
  const [rulesOpen, setRulesOpen] = useState(false)
  const f = FLOWS[i]

  return (
    <article
      className="rounded-2xl p-5 text-[#2a2d33] shadow-[0_30px_70px_-35px_rgba(0,0,0,0.55)] ring-1 ring-black/10"
      style={{ backgroundColor: '#f6f4ee', backgroundImage: 'radial-gradient(rgba(42,45,51,0.16) 1px, transparent 1.2px)', backgroundSize: '22px 22px' }}
      aria-label={t({ es: `Boceto del flujo de ${t(f.name).toLowerCase()}`, en: `${t(f.name)} flow sketch` })}
    >
      <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#2a2d33]/60">{t(f.who)}</p>

      <StepLabel n={1}>{t({ es: 'Pregunta', en: 'Asks' })}</StepLabel>
      <div className="ml-6 rounded-xl border-[1.5px] bg-white px-4 py-3" style={{ borderColor: INK }}>
        <p className="font-hand text-[21px] leading-[1.15]">«{t(f.q)}»</p>
      </div>
      <p className="ml-6 mt-1.5 text-right font-hand text-[16px] opacity-60">{t({ es: 'por voz o escrito', en: 'by voice or typed' })}</p>

      <Down />

      <StepLabel n={2}>{t({ es: 'Clipper consulta', en: 'Clipper looks up' })}</StepLabel>
      <div className="flex items-center gap-4 rounded-xl border-[1.5px] border-dashed px-4 py-3" style={{ borderColor: `${INK}66` }}>
        <ClipperOrb size={52} state="thinking" />
        <div>
          <p className="font-hand text-[17px] leading-tight opacity-70">{t({ es: 'elige la herramienta', en: 'picks the tool' })}</p>
          <p className="mt-1 inline-block rounded-md border px-2 py-0.5 font-mono text-[13px]" style={{ borderColor: INK }}>{f.tool}</p>
        </div>
      </div>

      <Down />

      <StepLabel n={3}>{t({ es: 'Responde', en: 'Answers' })}</StepLabel>
      <div className="rounded-xl border-[1.5px] bg-[#ffe7c7] px-4 py-3" style={{ borderColor: INK }}>
        <p className="font-hand text-[20px] leading-[1.15]">{t(f.a)}</p>
      </div>
      {'actions' in f && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {f.actions.map((a, k) => (
            <span key={a.es} className="rounded-lg border-[1.5px] px-2 py-1.5 text-center font-hand text-[17px]" style={{ borderColor: INK, background: k === 0 ? '#ffd2a8' : 'transparent' }}>
              {t(a)}
            </span>
          ))}
        </div>
      )}

      {/* Las reglas del flujo: al tocar, se pegan los post-its */}
      <button
        type="button"
        aria-expanded={rulesOpen}
        onClick={() => setRulesOpen((o) => !o)}
        className="mt-6 flex w-full items-center justify-between rounded-xl border-[1.5px] border-dashed px-4 py-3 text-left font-hand text-[19px] transition-colors active:bg-black/5"
        style={{ borderColor: `${INK}80` }}
      >
        <span>
          {rulesOpen ? t({ es: 'Las reglas de este flujo', en: 'This flow’s rules' }) : t({ es: `Ver las ${f.stickies.length} reglas`, en: `See the ${f.stickies.length} rules` })}
        </span>
        <span aria-hidden="true" className={`text-[22px] leading-none transition-transform duration-300 ${rulesOpen ? 'rotate-45' : ''}`}>+</span>
      </button>
      {rulesOpen && (
        <ul className="mt-4 space-y-3">
          {f.stickies.map((s, k) => (
            <li
              key={s.text.es}
              className="clp-fade px-4 py-3 font-hand text-[19px] leading-[1.15] shadow-[0_6px_14px_-6px_rgba(0,0,0,0.35)]"
              style={{ background: STICKY[s.color] ?? STICKY.yellow, transform: `rotate(${TILT[k % TILT.length]}deg)`, animationDelay: `${k * 80}ms` }}
            >
              {t(s.text)}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
