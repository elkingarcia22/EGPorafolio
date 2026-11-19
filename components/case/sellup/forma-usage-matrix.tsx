'use client'

import { useLocale, type L } from '@/lib/i18n'
import { useA11y } from '@/lib/a11y'
import { useTick } from '../barberlytics/thema/live-pieces'
import { useInView } from './ui'

/**
 * «Mapa de uso por rol» del panel de Uso de IA (cifras agregadas reales, 19-11-2026):
 * las celdas se llenan en ola y un resaltado recorre las filas contando qué pasa.
 */

type Tone = 'g' | 'gd' | 'a' | 'r' | 'rd' | 'b' | 'bd' | 'n'

const TONE: Record<Tone, string> = {
  g: 'bg-emerald-500/30 text-emerald-200',
  gd: 'bg-emerald-500/15 text-emerald-300',
  a: 'bg-amber-500/25 text-amber-200',
  r: 'bg-red-400/25 text-red-200',
  rd: 'bg-red-400/12 text-red-300',
  b: 'bg-[#6b8cff]/30 text-[#c8d4ff]',
  bd: 'bg-[#6b8cff]/12 text-[#9db0ff]',
  n: 'bg-white/[0.04] text-white/40',
}

interface Row {
  label: L
  total: string
  cells: readonly (readonly [string, Tone])[]
}

const ROLES: readonly L[] = [
  { es: 'Administrador', en: 'Admin' },
  { es: 'Líder comercial', en: 'Sales lead' },
  { es: 'Vendedor / BD', en: 'Rep / BD' },
  { es: 'Growth', en: 'Growth' },
]

const GROUPS: readonly { name: L; rows: readonly Row[] }[] = [
  {
    name: { es: 'Uso de la plataforma', en: 'Platform usage' },
    rows: [
      { label: { es: 'Personas activas', en: 'Active people' }, total: '18', cells: [['2', 'rd'], ['6', 'gd'], ['9', 'g'], ['1', 'r']] },
      { label: { es: 'Búsquedas de empresas', en: 'Company searches' }, total: '38', cells: [['0', 'r'], ['26', 'g'], ['12', 'a'], ['0', 'r']] },
      { label: { es: 'Consultas a IA y proveedores', en: 'AI & provider queries' }, total: '2.655', cells: [['1.088', 'g'], ['810', 'gd'], ['754', 'gd'], ['3', 'r']] },
      { label: { es: 'Créditos usados', en: 'Credits used' }, total: '769', cells: [['291', 'b'], ['300', 'b'], ['174', 'b'], ['4', 'bd']] },
    ],
  },
  {
    name: { es: 'Uso de los agentes', en: 'Agent usage' },
    rows: [
      { label: { es: 'Agente 1 · Empresas', en: 'Agent 1 · Companies' }, total: '1.644', cells: [['533', 'g'], ['550', 'g'], ['561', 'g'], ['0', 'r']] },
      { label: { es: 'Agente 2 · Contactos', en: 'Agent 2 · Contacts' }, total: '880', cells: [['483', 'g'], ['212', 'a'], ['182', 'rd'], ['3', 'r']] },
      { label: { es: 'Rumbo · Primer contacto', en: 'Rumbo · First contact' }, total: '83', cells: [['29', 'gd'], ['44', 'g'], ['10', 'rd'], ['0', 'r']] },
    ],
  },
  {
    name: { es: 'Resultados', en: 'Results' },
    rows: [
      { label: { es: 'Empresas para revisar', en: 'Companies to review' }, total: '414', cells: [['0', 'r'], ['275', 'g'], ['139', 'a'], ['0', 'r']] },
      { label: { es: 'Empresas aprobadas', en: 'Approved companies' }, total: '34', cells: [['0', 'r'], ['28', 'g'], ['6', 'rd'], ['0', 'r']] },
      { label: { es: 'Tasa de aprobación', en: 'Approval rate' }, total: '8 %', cells: [['—', 'n'], ['10 %', 'g'], ['4 %', 'a'], ['—', 'n']] },
    ],
  },
  {
    name: { es: 'Costo', en: 'Cost' },
    rows: [
      { label: { es: 'Costo estimado', en: 'Estimated cost' }, total: 'US$62,66', cells: [['19,57', 'b'], ['20,16', 'b'], ['22,91', 'b'], ['0,03', 'bd']] },
      { label: { es: 'Costo por aprobada', en: 'Cost per approved' }, total: 'US$1,84', cells: [['—', 'n'], ['0,72', 'g'], ['3,82', 'r'], ['—', 'n']] },
    ],
  },
]

const ROWS = GROUPS.flatMap((g) => g.rows)

/** Historias que recorre el resaltado: fila (índice plano) y columna destacada. */
const STORIES: readonly { row: number; col: number; text: L }[] = [
  { row: 1, col: 1, text: { es: 'Los líderes comerciales lanzan 26 de las 38 búsquedas de empresas.', en: 'Sales leads run 26 of the 38 company searches.' } },
  { row: 4, col: 2, text: { es: 'Los vendedores son quienes más usan el Agente 1: 561 usos.', en: 'Reps use Agent 1 the most: 561 uses.' } },
  { row: 5, col: 0, text: { es: 'El Agente 2 lo usa sobre todo el rol Administrador: 483 usos.', en: 'Agent 2 is used mostly by the Admin role: 483 uses.' } },
  { row: 8, col: 1, text: { es: '28 de las 34 empresas aprobadas salen de líderes comerciales.', en: '28 of the 34 approved companies come from sales leads.' } },
  { row: 11, col: 1, text: { es: 'Líder comercial: US$0,72 por empresa aprobada. Vendedor: US$3,82.', en: 'Sales lead: US$0.72 per approved company. Rep: US$3.82.' } },
]

export function UsageMatrix() {
  const { t } = useLocale()
  const { reducedMotion } = useA11y()
  const [ref, seen] = useInView<HTMLDivElement>(0.2)
  const tick = useTick(2200)
  const story = STORIES[reducedMotion ? 0 : tick % STORIES.length]
  const flat = (g: number, r: number) => GROUPS.slice(0, g).reduce((n, x) => n + x.rows.length, 0) + r

  return (
    <div ref={ref} className="rounded-[20px] border border-white/10 bg-[#141517]/90 p-4 md:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[15px] font-medium">{t({ es: 'Mapa de uso por rol', en: 'Usage map by role' })}</p>
        <p className="text-xs text-white/45">{t({ es: '4 roles · cada fila se compara con quien más tiene', en: '4 roles · each row compares with the top one' })}</p>
      </div>

      <div className="-mx-4 mt-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <div className="min-w-[620px]">
          <div className="grid grid-cols-[minmax(0,1.6fr)_4.5rem_repeat(4,minmax(0,1fr))] gap-1.5 pb-2 text-[11px] text-white/45">
            <span>{t({ es: 'Métrica', en: 'Metric' })}</span>
            <span className="text-right">Total</span>
            {ROLES.map((r) => <span key={r.es} className="truncate text-center">{t(r)}</span>)}
          </div>
          {GROUPS.map((g, gi) => (
            <div key={g.name.es} className="mt-2">
              <p className="mb-1 text-[12px] font-medium text-white/70">{t(g.name)}</p>
              {g.rows.map((row, ri) => {
                const idx = flat(gi, ri)
                const lit = seen && idx === story.row
                return (
                  <div
                    key={row.label.es}
                    className={`grid grid-cols-[minmax(0,1.6fr)_4.5rem_repeat(4,minmax(0,1fr))] items-center gap-1.5 rounded-lg py-0.5 transition-colors duration-300 ${lit ? 'bg-white/[0.05]' : ''}`}
                  >
                    <span className={`truncate pl-1 text-[12px] transition-colors duration-300 ${lit ? 'text-white' : 'text-white/65'}`}>{t(row.label)}</span>
                    <span className="text-right text-[12px] font-medium tabular-nums">{row.total}</span>
                    {row.cells.map(([v, tone], ci) => {
                      const hot = lit && ci === story.col
                      return (
                        <span
                          key={ci}
                          className={`rounded-md py-1 text-center text-[11.5px] tabular-nums transition-all duration-500 ease-expo ${TONE[tone]} ${hot ? 'scale-[1.08] ring-2 ring-white/70 shadow-[0_0_24px_rgba(107,140,255,0.55)]' : ''}`}
                          style={{
                            opacity: seen || reducedMotion ? 1 : 0,
                            transform: seen || reducedMotion ? undefined : 'scale(0.6)',
                            transitionDelay: seen && !hot ? `${idx * 45 + ci * 35}ms` : '0ms',
                          }}
                        >
                          {v}
                        </span>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <p key={story.text.es} aria-live="polite" className="mt-4 flex items-start gap-2 rounded-xl border border-[#6b8cff]/30 bg-[#6b8cff]/10 px-3 py-2.5 text-sm leading-snug text-white/90 animate-[usageIn_.35s_cubic-bezier(.16,1,.3,1)]">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9db0ff]" aria-hidden="true" />
        {t(story.text)}
      </p>
      <style>{'@keyframes usageIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}'}</style>
    </div>
  )
}
