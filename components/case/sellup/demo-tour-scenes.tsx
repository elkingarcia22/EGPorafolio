'use client'

import { useLocale, type L } from '@/lib/i18n'
import { APP, AppCard, Pill, RUMBO_GRADIENT, RumboOrb } from './platform'
import { BLUE } from './ui'

/** Datos de ejemplo del recorrido (empresas y personas ficticias). */
const COMPANIES = [
  { name: 'Clínica Andina del Norte', ind: 'Salud', emp: '1.240', free: true },
  { name: 'Grupo Salud Meridiano', ind: 'Salud', emp: '3.100', free: false },
  { name: 'Laboratorios Ceiba', ind: 'Farmacéutica', emp: '640', free: true },
  { name: 'Hospital San Telmo', ind: 'Salud', emp: '980', free: false },
  { name: 'Farmacias Prado', ind: 'Retail farma', emp: '2.050', free: false },
] as const

const PEOPLE = [
  { name: 'Sofía Rivas', role: { es: 'Directora de Talento', en: 'Head of Talent' }, src: 'HubSpot' },
  { name: 'Mateo Gil', role: { es: 'VP de Recursos Humanos', en: 'HR VP' }, src: { es: 'Base de contactos', en: 'Contact base' } },
  { name: 'Laura Pinto', role: { es: 'Gerente de Formación', en: 'L&D Manager' }, src: { es: 'Sitio web', en: 'Website' } },
] as const

const STAGES: readonly L[] = [
  { es: 'Prospección', en: 'Prospecting' }, { es: 'Enriquecimiento', en: 'Enrichment' }, { es: 'Primer contacto', en: 'First contact' },
  { es: 'Reunión', en: 'Meeting' }, { es: 'Cotización', en: 'Quote' }, { es: 'Venta interna', en: 'Internal sale' }, { es: 'Cierre', en: 'Close' },
]

export interface SceneProps {
  sub: number
}

const fade = (on: boolean, delay = 0) => ({ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(8px)', transition: `opacity 500ms ${delay}ms, transform 500ms ${delay}ms` })

/** 1 · Rumbo recibe el pedido y busca. */
export function SceneRumbo({ sub }: SceneProps) {
  const { t } = useLocale()
  const sources = ['HubSpot', t({ es: 'Registro oficial', en: 'Official registry' }), 'Web']
  return (
    <div className="relative h-full p-4">
      <p className="text-base font-medium">{t({ es: 'Búsquedas', en: 'Searches' })}</p>
      <div className="mt-3 space-y-2 opacity-25">
        {[0, 1, 2, 3, 4].map((i) => <div key={i} className="h-7 rounded-md bg-white/[0.06]" />)}
      </div>
      <button className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-[11px] font-medium text-white" style={{ background: RUMBO_GRADIENT }} data-target="rumbo">
        {t({ es: 'Generar con Rumbo IA', en: 'Generate with Rumbo AI' })}
      </button>
      <aside className="absolute inset-y-3 right-3 flex w-[min(290px,calc(100%-24px))] flex-col rounded-[12px] p-3 ring-1 ring-white/10" style={{ background: APP.side, ...fade(sub >= 1) }}>
        <p className="flex items-center gap-2 font-medium"><RumboOrb size={22} pulse={sub >= 2 && sub < 4} />Rumbo</p>
        <div className="mt-3 flex flex-1 flex-col justify-end gap-2 text-[11.5px]">
          <p className="ml-auto max-w-[90%] rounded-[10px] rounded-br-sm bg-[#5b7eff] px-2.5 py-1.5 text-white" style={fade(sub >= 1, 200)}>
            {t({ es: 'Empresas de salud en México, más de 200 empleados', en: 'Healthcare companies in Mexico, 200+ employees' })}
          </p>
          <div className="space-y-1" style={fade(sub >= 2)}>
            {sources.map((s, i) => (
              <p key={s} className="flex items-center justify-between rounded-md px-2 py-1 ring-1 ring-white/[0.08]">
                {s}<span className={sub >= 3 || (sub >= 2 && i === 0) ? 'text-emerald-300' : 'opacity-40'}>{sub >= 3 || (sub >= 2 && i === 0) ? '✓' : '…'}</span>
              </p>
            ))}
          </div>
          <p className="rounded-[10px] p-2 ring-1 ring-[#5b7eff]/40" style={{ background: APP.card, ...fade(sub >= 4) }}>
            {t({ es: 'Listo: 12 candidatas en «Por revisar». 0 créditos pagos.', en: 'Done: 12 candidates in “To review”. 0 paid credits.' })}
          </p>
        </div>
      </aside>
    </div>
  )
}

/** 2 y 3 · Las candidatas llegan a «Por revisar» y el vendedor aprueba. */
export function SceneReview({ sub, approving }: SceneProps & { approving: boolean }) {
  const { t } = useLocale()
  const approved = approving ? sub : 0
  return (
    <div className="h-full p-4">
      <p className="text-base font-medium">{t({ es: 'Por revisar', en: 'To review' })}</p>
      <p className="text-[11px] opacity-55">{t({ es: 'Búsqueda: Salud · México · 12 encontradas', en: 'Search: Healthcare · Mexico · 12 found' })}</p>
      <AppCard className="mt-3 divide-y divide-white/[0.06]">
        {COMPANIES.map((c, i) => {
          const shown = approving || i <= sub
          const ok = i < approved
          return (
            <div key={c.name} className="flex items-center gap-2 px-3 py-2.5" style={fade(shown, approving ? 0 : 0)}>
              <span className="min-w-0 flex-1">
                <span className="block truncate">{c.name}</span>
                <span className="block text-[10px] opacity-50">{c.ind} · {c.emp} {t({ es: 'empleados', en: 'employees' })}</span>
              </span>
              <span className="hidden sm:inline">{c.free ? <Pill tone="green">{t({ es: 'Libre en HubSpot', en: 'Free in HubSpot' })}</Pill> : <Pill tone="blue">{t({ es: 'Nueva', en: 'New' })}</Pill>}</span>
              {ok ? <Pill tone="green">✓ {t({ es: 'Aprobada', en: 'Approved' })}</Pill> : (
                <span data-target={`approve-${i}`} className="rounded-md px-2 py-1 text-[10px] font-medium text-white" style={{ background: BLUE }}>{t({ es: 'Aprobar', en: 'Approve' })}</span>
              )}
            </div>
          )
        })}
      </AppCard>
      <p className="mt-3 rounded-[10px] px-3 py-2 text-[11px] ring-1 ring-emerald-400/30" style={{ background: APP.card, ...fade(approving && sub >= 4) }}>
        ✓ {t({ es: '4 empresas aprobadas y escritas en HubSpot a tu nombre', en: '4 companies approved and written to HubSpot under your name' })}
      </p>
    </div>
  )
}

/** 4 · La empresa entra al flujo de prospección. */
export function ScenePipeline({ sub }: SceneProps) {
  const { t } = useLocale()
  const at = sub >= 3 ? 1 : 0
  return (
    <div className="grid h-full gap-3 p-4 sm:grid-cols-[150px_minmax(0,1fr)]">
      <AppCard className="hidden flex-col divide-y divide-white/[0.06] sm:flex">
        {COMPANIES.slice(0, 4).map((c, i) => (
          <span key={c.name} className={`truncate px-2.5 py-2 text-[11px] ${i === 1 ? 'bg-[#5b7eff]/10' : 'opacity-60'}`}>{c.name}</span>
        ))}
      </AppCard>
      <div className="min-w-0 space-y-3">
        <AppCard className="p-3">
          <p className="font-medium">Grupo Salud Meridiano</p>
          <p className="text-[10px] opacity-55">México · Salud · 3.100 {t({ es: 'empleados', en: 'employees' })}</p>
          <ol className="mt-3 grid grid-cols-7 gap-1">
            {STAGES.map((s, i) => (
              <li key={s.es} className="flex flex-col items-center gap-1 text-center text-[8.5px]">
                <span className={`grid h-5 w-5 place-items-center rounded-full text-[9px] transition-colors duration-700 ${i < at ? 'bg-emerald-500 text-white' : i === at ? 'bg-[#5b7eff] text-white' : 'ring-1 ring-white/20 opacity-50'}`}>{i < at ? '✓' : i + 1}</span>
                <span className={`hidden leading-tight sm:block ${i === at ? '' : 'opacity-45'}`}>{t(s)}</span>
              </li>
            ))}
          </ol>
        </AppCard>
        {[
          { n: '1', title: { es: 'Prospección · Agente 1', en: 'Prospecting · Agent 1' }, pill: <Pill tone="green">{t({ es: 'Completada', en: 'Done' })}</Pill>, on: sub >= 1 },
          { n: '2', title: { es: 'Enriquecimiento de contactos · Agente 2', en: 'Contact enrichment · Agent 2' }, pill: <Pill tone="blue">{t({ es: 'Etapa actual', en: 'Current stage' })}</Pill>, on: sub >= 3 },
        ].map((r) => (
          <AppCard key={r.n} className="flex items-center justify-between gap-2 p-3">
            <span className="min-w-0 truncate">{r.n}. {t(r.title)}</span>
            <span style={fade(r.on)}>{r.pill}</span>
          </AppCard>
        ))}
        <p className="flex justify-end" style={fade(sub >= 4)}>
          <span data-target="contacts" className="rounded-full px-3 py-1.5 text-[11px] font-medium text-white" style={{ background: RUMBO_GRADIENT }}>{t({ es: 'Buscar contactos con Rumbo IA', en: 'Find contacts with Rumbo AI' })}</span>
        </p>
      </div>
    </div>
  )
}

/** 5 · El Agente 2 encuentra a los decisores. */
export function SceneContacts({ sub }: SceneProps) {
  const { t } = useLocale()
  const chain = ['HubSpot', t({ es: 'Base de contactos', en: 'Contact base' }), t({ es: 'Sitio web', en: 'Website' })]
  return (
    <div className="h-full p-4">
      <p className="text-base font-medium">{t({ es: 'Contactos · Grupo Salud Meridiano', en: 'Contacts · Grupo Salud Meridiano' })}</p>
      <ol className="mt-3 flex flex-wrap items-center gap-1.5 text-[10.5px]">
        {chain.map((c, i) => (
          <li key={c} className="flex items-center gap-1.5">
            <span className={`rounded-md px-2 py-1 ring-1 transition-colors duration-500 ${sub > i ? 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/30' : sub === i ? 'ring-[#5b7eff] text-[#a9baff]' : 'ring-white/10 opacity-50'}`}>{c}</span>
            {i < chain.length - 1 && <span className="opacity-30">→</span>}
          </li>
        ))}
        <li className="rounded-md px-2 py-1 opacity-40 ring-1 ring-white/10 line-through">Apollo · Lusha</li>
      </ol>
      <AppCard className="mt-3 divide-y divide-white/[0.06]">
        {PEOPLE.map((p, i) => (
          <div key={p.name} className="flex items-center gap-2.5 px-3 py-2.5" style={fade(sub > i)}>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-[10px]">{p.name.split(' ').map((w) => w[0]).join('')}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate">{p.name}</span>
              <span className="block truncate text-[10px] opacity-55">{t(p.role)} · {typeof p.src === 'string' ? p.src : t(p.src)}</span>
            </span>
            <Pill tone="green">✉ {t({ es: 'correo', en: 'email' })}</Pill>
            {i === 0 && <span className="hidden sm:inline"><Pill tone="amber">☎ {t({ es: 'reservado', en: 'reserved' })}</Pill></span>}
          </div>
        ))}
      </AppCard>
      <p className="mt-3 text-[11px] opacity-60" style={fade(sub >= 4)}>{t({ es: '3 decisores · US$0 · no hizo falta pagar créditos', en: '3 decision-makers · US$0 · no paid credits needed' })}</p>
    </div>
  )
}

/** 6 · El Agente 3 prepara el primer contacto con citas. */
export function SceneFirstContact({ sub }: SceneProps) {
  const { t } = useLocale()
  const steps: readonly L[] = [
    { es: 'Lo que SellUp ya sabe', en: 'What SellUp knows' }, { es: 'Sitio oficial · 5 páginas', en: 'Official site · 5 pages' },
    { es: 'Noticias con fecha', en: 'Dated news' }, { es: 'Verificador de citas', en: 'Citation checker' },
  ]
  return (
    <div className="grid h-full gap-3 p-4 sm:grid-cols-[170px_minmax(0,1fr)]">
      <AppCard className="hidden p-3 sm:block">
        <p className="mb-2 text-[11px] opacity-60">{t({ es: 'Investigación', en: 'Research' })}</p>
        <ol className="space-y-2 text-[11px]">
          {steps.map((s, i) => (
            <li key={s.es} className={`flex items-center gap-2 transition-opacity ${sub >= i ? '' : 'opacity-30'}`}>
              <span className={`grid h-4 w-4 place-items-center rounded-full text-[8px] ${sub > i ? 'bg-emerald-500 text-white' : 'ring-1 ring-white/30'}`}>{sub > i ? '✓' : ''}</span>{t(s)}
            </li>
          ))}
        </ol>
      </AppCard>
      <AppCard className="min-w-0 p-3.5" >
        <p className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-medium">Sofía Rivas · {t({ es: 'Correo', en: 'Email' })}</span>
          <span style={fade(sub >= 4)}><Pill tone="green">{t({ es: 'Listo para enviar', en: 'Ready to send' })}</Pill></span>
        </p>
        <div className="mt-3 space-y-2 text-[12px] leading-relaxed" style={fade(sub >= 2)}>
          <p>{t({ es: 'Hola, Sofía:', en: 'Hi Sofía,' })}</p>
          <p>
            {t({ es: 'Vi que Meridiano ', en: 'I saw Meridiano ' })}
            <mark className="rounded bg-[#5b7eff]/20 px-0.5 text-[#cdd8ff]">{t({ es: 'abrió dos clínicas en Monterrey este año', en: 'opened two clinics in Monterrey this year' })}</mark><sup className="text-[#a9baff]">1</sup>
            {t({ es: ' y está ', en: ' and is ' })}
            <mark className="rounded bg-[#5b7eff]/20 px-0.5 text-[#cdd8ff]">{t({ es: 'contratando 300 personas de enfermería', en: 'hiring 300 nurses' })}</mark><sup className="text-[#a9baff]">2</sup>.
            {t({ es: ' ¿Cómo están formando a tanta gente nueva a la vez?', en: ' How are you training that many new people at once?' })}
          </p>
          <p>{t({ es: '¿Te sirven 20 minutos el jueves?', en: 'Would 20 minutes on Thursday work?' })}</p>
        </div>
        <ol className="mt-3 space-y-0.5 border-t border-white/10 pt-2 text-[10px] opacity-55" style={fade(sub >= 3)}>
          <li>1 · meridiano-salud.example/noticias · 12-09-2026</li>
          <li>2 · {t({ es: 'Vacantes publicadas', en: 'Job posts' })} · 03-11-2026</li>
        </ol>
      </AppCard>
    </div>
  )
}

/** 7 · Uso de IA y costos (cifras reales del panel, noviembre de 2026). */
export function SceneUsage({ sub }: SceneProps) {
  const { t } = useLocale()
  const kpis = [
    { l: { es: 'Costo estimado', en: 'Estimated cost' }, v: 'US$53' },
    { l: { es: 'Ejecuciones', en: 'Runs' }, v: '218' },
    { l: { es: 'Consultas', en: 'Queries' }, v: '2.340' },
    { l: { es: 'Costo medio', en: 'Average cost' }, v: 'US$0,18' },
  ]
  const agents = [
    { n: { es: 'Agente 1 · Empresas', en: 'Agent 1 · Companies' }, v: 44.67 },
    { n: { es: 'Agente 2 · Contactos', en: 'Agent 2 · Contacts' }, v: 6.71 },
    { n: { es: 'Agente 3 · Primer contacto', en: 'Agent 3 · First contact' }, v: 0.87 },
  ]
  return (
    <div className="h-full p-4">
      <p className="text-base font-medium">{t({ es: 'Uso de IA, costos y efectividad', en: 'AI usage, cost and effectiveness' })}</p>
      <AppCard className="mt-3 grid grid-cols-2 sm:grid-cols-4">
        {kpis.map((k, i) => (
          <div key={k.l.es} className="border-white/[0.06] p-3 [&:not(:last-child)]:border-r" style={fade(sub >= i * 0.5, i * 120)}>
            <p className="text-[10px] opacity-55">{t(k.l)}</p>
            <p className="mt-1 text-lg tabular-nums">{k.v}</p>
          </div>
        ))}
      </AppCard>
      <AppCard className="mt-3 space-y-2.5 p-3">
        <p className="text-[11px] opacity-60">{t({ es: 'Costo por agente', en: 'Cost per agent' })}</p>
        {agents.map((a, i) => (
          <div key={a.n.es} className="flex items-center gap-2 text-[11px]">
            <span className="w-[42%] truncate opacity-70">{t(a.n)}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
              <span className="block h-full origin-left rounded-full transition-transform duration-1000" style={{ width: `${Math.max(3, (a.v / 44.67) * 100)}%`, background: BLUE, transform: sub >= 2 ? 'scaleX(1)' : 'scaleX(0)', transitionDelay: `${i * 150}ms` }} />
            </span>
            <span className="w-12 text-right tabular-nums">${a.v.toFixed(2)}</span>
          </div>
        ))}
      </AppCard>
    </div>
  )
}
