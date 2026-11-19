'use client'

import { useState } from 'react'
import { useA11y } from '@/lib/a11y'
import { useLocale, type L } from '@/lib/i18n'
import { AREAS, EMPRESA, ESCALA, OBJETIVOS, avanceArea, avanceEmpresa, tramoDe } from './cascade-model'
import { AppWindow, Pill, ProgressBar, Stage, UBITS_BLUE, useStepper } from './forma-ui'

const VIEW_MS = 4200
const ramp = 'animate-[ramp-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both]'
const delay = (i: number) => ({ animationDelay: `${i * 70}ms` })

function Resumen() {
  const kpis = [
    { k: 'Avance promedio', v: '53,9 %', d: '−7,5 pp' },
    { k: 'Objetivos cumplidos', v: '30,4 %', d: '−1,7 pp' },
    { k: 'Personas reportando', v: '93,9 %', d: '−1,7 pp' },
  ]
  const periods = [
    { p: 'Q1', v: 55.4, s: 'Cerrado' },
    { p: 'Q2', v: 56.1, s: 'Cerrado' },
    { p: 'Q3', v: 8.1, s: 'En curso' },
    { p: 'Q4', v: 0, s: 'Por iniciar' },
  ]
  return (
    <div className="grid gap-3 p-4">
      <div className="grid grid-cols-3 gap-3">
        {kpis.map((x, i) => (
          <div key={x.k} className={`${ramp} rounded-xl bg-white p-3`} style={delay(i)}>
            <p className="text-[11px] text-black/50">{x.k}</p>
            <p className="mt-1 text-xl font-medium">{x.v}</p>
            <p className="text-[10px] text-[#d92d20]">↘ {x.d}</p>
          </div>
        ))}
      </div>
      <div className={`${ramp} rounded-xl bg-white p-3`} style={delay(3)}>
        <p className="mb-2 text-[11px] text-black/50">Periodos del ciclo</p>
        <div className="grid grid-cols-4 gap-3">
          {periods.map((x) => (
            <div key={x.p}>
              <p className="flex justify-between text-[11px]"><b className="font-medium">{x.p}</b><span className="text-black/45">{x.s}</span></p>
              <ProgressBar value={x.v} className="mt-1.5 h-1.5" />
              <p className="mt-1 font-mono text-[10px] text-black/50">{x.v.toString().replace('.', ',')} %</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Alineacion() {
  const areas = AREAS.slice(0, 4)
  const ys = [30, 80, 130, 180]
  const ey = [45, 105, 165]
  const link = (area: string, e: string) => OBJETIVOS.filter((o) => o.area === area && o.empresa === e).reduce((s, o) => s + o.peso, 0)
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 p-4 text-[11px]">
      <div className="grid gap-[22px]">
        {areas.map((a) => <span key={a} className="rounded-md bg-white px-2 py-1.5">{a}</span>)}
      </div>
      <svg viewBox="0 0 200 210" className="h-[210px] w-full" preserveAspectRatio="none" aria-hidden="true">
        {areas.flatMap((a, i) =>
          EMPRESA.map((e, j) => {
            const w = link(a, e.id)
            if (!w) return null
            const color = tramoDe(avanceEmpresa(OBJETIVOS, e.id)).color
            return <path key={`${a}-${e.id}`} d={`M0 ${ys[i]} C100 ${ys[i]} 100 ${ey[j]} 200 ${ey[j]}`} fill="none" stroke={color} strokeOpacity={0.55} strokeWidth={w / 4} pathLength={1} strokeDasharray={1} className="obj-draw" style={delay(i + j)} />
          }),
        )}
      </svg>
      <div className="grid gap-[30px]">
        {EMPRESA.map((e) => <span key={e.id} className="rounded-md bg-[#0c5bef] px-2 py-1.5 text-white">{e.corto}</span>)}
      </div>
    </div>
  )
}

function Cumplimiento() {
  const areas = AREAS.slice(0, 5)
  return (
    <div className="p-4 text-[11px]">
      <div className="grid grid-cols-[5.5rem_repeat(5,minmax(0,1fr))] gap-1 sm:grid-cols-[8rem_repeat(5,minmax(0,1fr))]">
        <span />
        {ESCALA.map((t) => <span key={t.id} className="truncate text-center text-black/50">{t.nombre.replace('parcialmente', 'parc.')}</span>)}
        {areas.map((a, i) => (
          <div key={a} className="contents">
            <span className="truncate py-2">{a}</span>
            {ESCALA.map((t, j) => {
              const v = (i * 7 + j * 5 + 3) % 9
              const level = Math.min(4, Math.floor(v / 2))
              return (
                <span key={t.id} className={`${ramp} grid place-items-center rounded-md font-mono`} style={{ ...delay(i + j), background: `${t.color}${['12', '28', '48', 'c0', 'e6'][level]}`, color: level >= 3 ? '#fff' : '#161a2c' }}>{v}</span>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function Participantes() {
  return (
    <ul className="divide-y divide-black/[0.05] p-2 text-[12px]">
      {OBJETIVOS.slice(0, 6).map((o, i) => {
        const tr = tramoDe(o.avance)
        return (
          <li key={o.id} className={`${ramp} grid grid-cols-[2rem_minmax(0,1fr)_5rem_auto] items-center gap-3 px-2 py-2`} style={delay(i)}>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#0c5bef]/10 text-[10px] text-[#0c5bef]">{o.persona.split(' ').map((p) => p[0]).join('')}</span>
            <span className="min-w-0"><span className="block truncate">{o.persona}</span><span className="block truncate text-[11px] text-black/45">{o.area}</span></span>
            <ProgressBar value={o.avance} color={tr.color} />
            <Pill color={o.etapa === 'aprobado' ? tr.color : '#f38744'}>{o.etapa === 'aprobado' ? `${o.avance} %` : 'Por aprobar'}</Pill>
          </li>
        )
      })}
    </ul>
  )
}

function Ranking() {
  const podium = [
    { a: 'Operaciones', v: 96, h: 'h-20', place: 2 },
    { a: 'Comercial', v: 100, h: 'h-28', place: 1 },
    { a: 'Marketing', v: 91, h: 'h-14', place: 3 },
  ]
  return (
    <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex items-end justify-center gap-2">
        {podium.map((p, i) => (
          <div key={p.a} className="w-24 text-center text-[11px]">
            <p className="font-medium">{p.a}</p>
            <p className="text-black/50">{p.v} % reporta</p>
            <div className={`${ramp} mt-1 grid ${p.h} origin-bottom place-items-center rounded-t-lg text-lg font-light text-white`} style={{ ...delay(i), background: p.place === 1 ? UBITS_BLUE : '#7b93ff' }}>{p.place}</div>
          </div>
        ))}
      </div>
      <ul className="space-y-2 text-[12px]">
        {[['Valentina Ríos', 6], ['Verónica Martínez', 5], ['Isabella Mendoza', 4]].map(([n, w], i) => (
          <li key={n as string} className={`${ramp} flex items-center justify-between rounded-lg bg-white px-3 py-2`} style={delay(i + 3)}>
            <span>{n}</span>
            <span className="rounded-full bg-[#0c5bef]/10 px-2 py-0.5 text-[11px] text-[#0c5bef]">En racha · {w} sem</span>
          </li>
        ))}
        <li className="text-[11px] text-black/45">3 personas no han reportado esta semana.</li>
      </ul>
    </div>
  )
}

function Analisis() {
  const findings = [
    { k: 'Hallazgo', c: UBITS_BLUE, t: `Ingresos va en ${Math.round(avanceEmpresa(OBJETIVOS, 'ingresos'))} %: Comercial lo sostiene.` },
    { k: 'Riesgo', c: '#d92d20', t: `Marketing avanza ${Math.round(avanceArea(OBJETIVOS, 'Marketing'))} % con el cierre a 3 semanas.` },
    { k: 'Acción', c: '#17b26a', t: 'Revisar con Gente y Cultura el objetivo sin alinear.' },
  ]
  return (
    <div className="grid gap-2 p-4 text-[12px]">
      <p className="flex items-center gap-2 text-[11px] text-black/50"><span className="text-[#7b5cff]">✦</span> Lectura del ciclo con evidencia</p>
      {findings.map((f, i) => (
        <div key={f.k} className={`${ramp} rounded-xl bg-white p-3`} style={delay(i * 2)}>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: f.c }}>{f.k}</span>
          <p className="mt-1">{f.t}</p>
        </div>
      ))}
    </div>
  )
}

function Accionables() {
  const items = [
    { k: 'Evaluación 360', t: 'Lanzar a quienes cerraron por debajo de 70 %' },
    { k: 'Matriz de talento', t: 'Ubicar a cada persona con su cumplimiento' },
    { k: 'PDI', t: 'Abrir un plan de desarrollo con lo que faltó' },
  ]
  return (
    <div className="grid gap-3 p-4 sm:grid-cols-3">
      {items.map((x, i) => (
        <div key={x.k} className={`${ramp} flex flex-col justify-between rounded-xl bg-white p-4 text-[12px]`} style={delay(i)}>
          <span className="font-medium">{x.k}</span>
          <span className="mt-2 text-black/60">{x.t}</span>
          <span className="mt-4 self-start rounded-lg bg-[#0c5bef] px-3 py-1.5 text-[11px] text-white">Continuar →</span>
        </div>
      ))}
    </div>
  )
}

const VIEWS: readonly { id: string; label: string; note: L; View: () => JSX.Element }[] = [
  { id: 'resumen', label: 'Resumen', note: { es: 'Cómo va, comparado con los ciclos anteriores y periodo a periodo.', en: 'How it’s going, against past cycles and period by period.' }, View: Resumen },
  { id: 'alineacion', label: 'Alineación', note: { es: 'Grosor = cuánto aporta cada área; color = cómo va el objetivo de empresa.', en: 'Thickness = how much each area adds; color = how the company goal is doing.' }, View: Alineacion },
  { id: 'cumplimiento', label: 'Cumplimiento', note: { es: 'Áreas contra los tramos de la escala: dónde se concentra cada resultado.', en: 'Areas against the scale bands: where each result piles up.' }, View: Cumplimiento },
  { id: 'participantes', label: 'Participantes', note: { es: 'Cada persona con su avance; lo que no está aprobado se dice.', en: 'Each person with their progress; what isn’t approved says so.' }, View: Participantes },
  { id: 'ranking', label: 'Ranking', note: { es: 'Se premia reportar: podio por área y rachas; a quien falta se le cuenta.', en: 'Reporting is rewarded: podium by area and streaks; those missing are counted.' }, View: Ranking },
  { id: 'ia', label: 'Análisis con IA', note: { es: 'Hallazgos, riesgos y acciones, cada uno con su cifra.', en: 'Findings, risks and actions, each with its figure.' }, View: Analisis },
  { id: 'accionables', label: 'Accionables', note: { es: 'Lo que sigue al cierre: 360, matriz de talento y PDI.', en: 'What comes after close: 360, talent matrix and PDP.' }, View: Accionables },
]

/** 5.4 · Siete pestañas del mismo ciclo, recreadas en vivo: rotan solas o se tocan. */
export function ResultsLive() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [pinned, setPinned] = useState(false)
  const { step: i, ref, set } = useStepper(VIEW_MS, VIEWS.length, pinned)
  const v = VIEWS[i]

  return (
    <div ref={ref}>
      <Stage>
        <div role="tablist" aria-label={t({ es: 'Pestañas de resultados', en: 'Results tabs' })} className="mb-4 flex flex-wrap gap-2">
          {VIEWS.map((x, k) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={k === i}
              onClick={() => {
                set(k)
                setPinned(true)
              }}
              className="relative overflow-hidden rounded-full border border-white/15 px-3.5 py-1.5 text-[12px] text-white/60 transition-colors hover:text-white aria-selected:border-white aria-selected:bg-white aria-selected:text-[#0b0d16]"
            >
              <span className="mr-1 font-mono text-[10px] opacity-50">{String(k + 1).padStart(2, '0')}</span>
              {x.label}
              {k === i && !pinned && !reducedMotion && (
                <span key={i} className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[#0c5bef]" style={{ animation: `view-progress ${VIEW_MS}ms linear both` }} aria-hidden="true" />
              )}
            </button>
          ))}
        </div>

        <AppWindow title="Objetivos de compañía 2026 · por trimestres" meta={`Resultados · ${v.label}`}>
          <div key={v.id} className="h-[300px] overflow-hidden">
            <v.View />
          </div>
        </AppWindow>
        <p key={`n-${v.id}`} className={`${ramp} mt-5 max-w-[62ch] text-sm leading-relaxed text-white/70`}>
          <b className="font-medium text-white">{v.label}.</b> {t(v.note)}
        </p>
      </Stage>
    </div>
  )
}
