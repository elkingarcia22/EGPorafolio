'use client'

import { useLocale, type L } from '@/lib/i18n'
import { useTick } from '../barberlytics/thema/live-pieces'
import { APP, RumboOrb } from './platform'
import { useInView } from './ui'

/**
 * 01 · Los puntos: el problema no es el tamaño del mercado, es cómo se trabaja.
 * El vendedor busca empresas a mano, busca a las personas a mano y llama sin
 * conocerlas. Los tiempos son cifras de referencia, no mediciones.
 */

interface Pain {
  n: string
  today: L
  detail: L
  tabs: readonly string[]
  hours: number
  agent: L
  fix: L
}

const PAINS: readonly Pain[] = [
  {
    n: '01',
    today: { es: 'Busca las empresas a mano', en: 'Finds companies by hand' },
    detail: { es: 'Google, LinkedIn, Apollo y HubSpot abiertos a la vez, sin un criterio común. Lo que encuentra entra al CRM con duplicados y cuentas de otro vendedor.', en: 'Google, LinkedIn, Apollo and HubSpot open at once, with no shared criteria. Whatever turns up lands in the CRM with duplicates and other reps’ accounts.' },
    tabs: ['Google', 'LinkedIn', 'Apollo', 'HubSpot', 'Excel'],
    hours: 6,
    agent: { es: 'Agente 1 · Empresas', en: 'Agent 1 · Companies' },
    fix: { es: 'Busca por país, industria y tamaño, verifica que la empresa exista y que nadie la tenga, y la deja lista para aprobar.', en: 'Searches by country, industry and size, checks the company exists and nobody owns it, and leaves it ready to approve.' },
  },
  {
    n: '02',
    today: { es: 'Busca a las personas a mano', en: 'Finds the people by hand' },
    detail: { es: 'Adivina quién decide, revisa perfiles uno por uno y gasta créditos para ver un teléfono que a veces no existe.', en: 'Guesses who decides, checks profiles one by one and spends credits to reveal a phone number that sometimes doesn’t exist.' },
    tabs: ['LinkedIn', 'Apollo', 'Lusha', 'Sitio web'],
    hours: 5,
    agent: { es: 'Agente 2 · Contactos', en: 'Agent 2 · Contacts' },
    fix: { es: 'Encuentra a quién decide en RR. HH. y Formación, primero en lo gratis, y solo paga un teléfono cuando hace falta.', en: 'Finds who decides in HR and L&D, free sources first, and only pays for a phone when needed.' },
  },
  {
    n: '03',
    today: { es: 'Llama sin conocer a la empresa', en: 'Calls without knowing the company' },
    detail: { es: 'La primera llamada sale en frío: no sabe qué está pasando en la empresa, qué le duele ni qué es nuevo. La conversación muere en el primer minuto.', en: 'The first call goes out cold: no idea what’s happening at the company, what hurts or what’s new. The conversation dies in the first minute.' },
    tabs: ['Noticias', 'Empleo', 'LinkedIn'],
    hours: 4,
    agent: { es: 'Agente 3 · Primer contacto', en: 'Agent 3 · First contact' },
    fix: { es: 'Investiga a la empresa y a la persona, y prepara qué decir en cada canal con hechos citados: noticias, vacantes, cambios.', en: 'Researches the company and the person, and prepares what to say on each channel with cited facts: news, openings, changes.' },
  },
]

/** Pestañas del navegador que se apilan mientras el vendedor busca a mano. */
function TabPile({ tabs, on }: { tabs: readonly string[]; on: boolean }) {
  const tick = useTick(700)
  const active = tick % tabs.length
  return (
    <div className="relative h-[128px]" aria-hidden="true">
      {tabs.map((tab, i) => (
        <div
          key={tab}
          className="absolute left-0 right-6 rounded-[10px] p-2.5 ring-1 ring-white/10 transition-all duration-700 ease-expo"
          style={{
            top: i * 16,
            left: i * 8,
            background: i === active ? APP.cardHi : APP.card,
            opacity: on ? 1 : 0,
            transform: on ? `rotate(${(i % 2 ? 1 : -1) * (i * 0.6)}deg)` : 'translateY(30px)',
            transitionDelay: `${i * 120}ms`,
            zIndex: i,
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
            <span className={`ml-2 text-[11px] ${i === active ? 'text-white' : 'text-white/50'}`}>{tab}</span>
          </div>
          <div className="mt-2 h-1.5 w-2/3 rounded bg-white/10" />
          <div className="mt-1 h-1.5 w-1/2 rounded bg-white/[0.06]" />
        </div>
      ))}
    </div>
  )
}

function PainRow({ p }: { p: Pain }) {
  const { t } = useLocale()
  const [ref, seen] = useInView<HTMLLIElement>(0.35)
  return (
    <li ref={ref} className="grid gap-5 border-t border-white/10 pt-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10">
      <div>
        <p className="flex items-baseline gap-3">
          <span className="mono-label text-red-300/80">{t({ es: 'Hoy', en: 'Today' })} · {p.n}</span>
        </p>
        <p className="mt-2 text-[clamp(1.4rem,1rem+1.2vw,2rem)] font-light leading-tight">{t(p.today)}</p>
        <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-white/65">{t(p.detail)}</p>
        <div className="mt-5 flex items-center gap-4">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <span className="block h-full rounded-full bg-red-400/70 transition-[width] duration-[1600ms] ease-expo" style={{ width: seen ? `${(p.hours / 6) * 100}%` : '0%' }} />
          </div>
          <span className="whitespace-nowrap font-mono text-xs text-white/60">≈ {p.hours} h / {t({ es: 'semana', en: 'week' })}</span>
        </div>
        <div className="mt-5"><TabPile tabs={p.tabs} on={seen} /></div>
      </div>
      <div className={`relative self-center rounded-[16px] p-5 ring-1 ring-[#5b7eff]/30 transition-all duration-1000 ease-expo ${seen ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`} style={{ background: 'linear-gradient(160deg,rgba(91,126,255,0.14),rgba(139,92,246,0.06) 60%,transparent)', transitionDelay: '500ms' }}>
        <p className="flex items-center gap-2.5 text-sm font-medium text-[#b7c6ff]"><RumboOrb size={20} />{t(p.agent)}</p>
        <p className="mt-3 text-lg leading-snug">{t(p.fix)}</p>
      </div>
    </li>
  )
}

export function SellUpDots() {
  const { t } = useLocale()
  return (
    <div>
      <p data-reveal="mask" className="max-w-[24ch] text-[clamp(1.8rem,1rem+2.6vw,3.4rem)] font-light leading-[1.08] tracking-tight">
        {t({ es: 'El vendedor gastaba la semana buscando, y llegaba a la llamada sin saber qué decir.', en: 'Reps spent the week searching, and reached the call without knowing what to say.' })}
      </p>
      <p data-reveal className="mt-8 max-w-[62ch] text-lg leading-relaxed opacity-80">
        {t({ es: 'En UBITS la prospección era artesanal. Cada vendedor buscaba empresas a mano, buscaba a mano a las personas que deciden, y hacía la primera llamada con poco contexto: sin conocer lo nuevo de la empresa, sus dolores ni sus necesidades. SellUp nació para cambiar esas tres tareas, una por agente.', en: 'At UBITS, prospecting was handcrafted. Each rep searched for companies by hand, searched by hand for the people who decide, and made the first call with little context: without knowing what was new at the company, its pains or its needs. SellUp was born to change those three tasks, one per agent.' })}
      </p>
      <ol className="mt-16 space-y-14">
        {PAINS.map((p) => <PainRow key={p.n} p={p} />)}
      </ol>
      <p className="mt-10 text-xs text-white/40">{t({ es: 'Horas por semana: cifras de referencia estimadas, no una medición.', en: 'Hours per week: estimated reference figures, not a measurement.' })}</p>
    </div>
  )
}
