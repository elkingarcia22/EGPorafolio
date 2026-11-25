import type { Locale } from '@/lib/i18n'
import { EARLY_JOBS, JOBS, PROFILE, SKILLS, STUDIES, TOOL_GROUPS } from '@/lib/content/profile'
import { PROCESS_STAGES } from '@/lib/content/process'
import { PROJECTS } from '@/lib/content/projects'
import { OVERVIEW } from '@/lib/content/cases/barberlytics/overview'
import { THEMA_CASE } from '@/lib/content/cases/barberlytics/thema-case'
import { BOOKING_CASE } from '@/lib/content/cases/barberlytics/booking-case'
import { PLATFORM_CASE } from '@/lib/content/cases/barberlytics/platform-case'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { SELLUP_CASE } from '@/lib/content/cases/sellup/sellup-case'
import { ENCUESTAS_CASE } from '@/lib/content/cases/encuestas/case'
import { ASSUMPTIONS } from '@/components/case/sellup/impact-model'

/*
 * La base de conocimiento del agente: todo sale del contenido del sitio, así que el agente
 * nunca sabe más (ni distinto) de lo que el portafolio muestra.
 */

/** Claves que son medidas, rutas o colores: no aportan nada a una conversación. */
const SKIP = new Set(['image', 'images', 'src', 'width', 'height', 'alt', 'accent', 'mock', 'x', 'y', 'w', 'h', 'color', 'hue', 'url', 'icon', 'cover', 'hero', 'shots', 'shot', 'frame', 'callouts', 'sizes', 'id', 'slug', 'hex', 'primary', 'aiEnd', 'stops', 'open', 'versions'])
/** Textos sueltos (sin traducción) que sí valen. */
const PLAIN = new Set(['client', 'year', 'value', 'name', 'period', 'company', 'school', 'tool', 'frequency', 'index'])
const CASE_BUDGET = 9000

const isL = (v: unknown): v is { es: string; en: string } => typeof v === 'object' && v !== null && typeof (v as { es?: unknown }).es === 'string' && typeof (v as { en?: unknown }).en === 'string'

/** Recorre un objeto de contenido y saca sus textos en el idioma pedido, uno por línea. */
function flatten(value: unknown, locale: Locale, key = '', out: string[] = []): string[] {
  if (SKIP.has(key)) return out
  if (isL(value)) {
    out.push(`- ${value[locale]}`)
    return out
  }
  if (typeof value === 'string') {
    if (PLAIN.has(key) && value.length < 200) out.push(`- ${key}: ${value}`)
    return out
  }
  if (typeof value === 'number') {
    if (PLAIN.has(key)) out.push(`- ${key}: ${value}`)
    return out
  }
  if (Array.isArray(value)) {
    value.forEach((v) => flatten(v, locale, key, out))
    return out
  }
  if (typeof value === 'object' && value !== null) {
    for (const [k, v] of Object.entries(value)) {
      if (typeof v === 'string' && ['tools', 'competitors', 'products'].includes(key)) continue
      if (Array.isArray(v) && v.every((x) => typeof x === 'string') && ['tools', 'competitors', 'categories'].includes(k)) {
        out.push(`- ${k}: ${(v as string[]).join(', ')}`)
        continue
      }
      flatten(v, locale, k, out)
    }
  }
  return out
}

function section(title: string, body: string, budget = CASE_BUDGET): string {
  const trimmed = body.length > budget ? `${body.slice(0, budget)}\n- …` : body
  return `## ${title}\n${trimmed}`
}

const pick = (v: { es: string; en: string }, locale: Locale) => v[locale]

function profileBlock(locale: Locale): string {
  const jobs = JOBS.map((j) => `- ${j.company} (${j.period}, ${pick(j.location, locale)}): ${j.roles.map((r) => `${pick(r.title, locale)} [${r.period}]`).join(' · ')}. ${pick(j.summary, locale)}${j.highlights ? ` Temas: ${j.highlights.map((h) => pick(h, locale)).join(', ')}.` : ''}`).join('\n')
  const early = EARLY_JOBS.map((j) => `- ${pick(j.title, locale)}, ${j.company} (${j.period})${j.summary ? `: ${pick(j.summary, locale)}` : ''}`).join('\n')
  const studies = STUDIES.map((s) => `- ${pick(s.title, locale)} · ${s.school} (${s.period})${s.note ? ` · ${pick(s.note, locale)}` : ''}`).join('\n')
  const tools = TOOL_GROUPS.map((g) => `- ${pick(g.title, locale)}: ${g.tools.join(', ')}`).join('\n')
  return [
    `## Perfil`,
    `- Nombre: Elkin Garcia · ${pick(PROFILE.role, locale)} · ${pick(PROFILE.location, locale)} · diseñando desde ${PROFILE.startYear}.`,
    `- ${pick(PROFILE.summary, locale)}`,
    `## Contacto`,
    `- Correo: ${PROFILE.email}`,
    `- WhatsApp y llamadas: ${PROFILE.phoneDisplay}`,
    `- LinkedIn: ${PROFILE.linkedin}`,
    `- La hoja de vida se abre desde «Hoja de vida» en el menú del sitio.`,
    `## Experiencia en producto digital`,
    jobs,
    `## Antes del producto digital`,
    early,
    `## Estudios y certificaciones`,
    studies,
    `## Habilidades`,
    `- ${SKILLS.map((s) => pick(s, locale)).join(', ')}`,
    `## Herramientas`,
    tools,
  ].join('\n')
}

function processBlock(locale: Locale): string {
  return section('Proceso (las seis etapas con las que se cuenta cada caso)', PROCESS_STAGES.map((s, i) => `- ${i + 1}. ${pick(s.title, locale)}: ${pick(s.body, locale)} IA: ${pick(s.ai, locale)}`).join('\n'))
}

function projectsBlock(locale: Locale): string {
  const cards = PROJECTS.map((p) => `- [[caso:${p.slug}]] ${pick(p.title, locale)} · ${p.client} · ${p.year}. ${pick(p.tagline, locale)} Rol: ${pick(p.role, locale)}.`).join('\n')
  return `## Proyectos del portafolio (usa estos slugs para enlazar)\n${cards}`
}

/** Cada caso, con su detalle: problema, investigación, idea, forma, IA e impacto. */
function casesBlock(locale: Locale): string {
  const cases: readonly [string, unknown][] = [
    ['Caso Objetivos (UBITS) · slug objetivos', [PROJECTS.find((p) => p.slug === 'objetivos'), OBJ_CASE]],
    ['Caso Barberlytics (producto completo) · slug barberlytics', [PROJECTS.find((p) => p.slug === 'barberlytics'), OVERVIEW]],
    ['Barberlytics · Thema, el sistema de diseño', THEMA_CASE],
    ['Barberlytics · Reserva en línea (booking flow)', BOOKING_CASE],
    ['Barberlytics · Plataforma, el calendario', PLATFORM_CASE],
    ['Barberlytics · Clipper, la IA', CLIPPER_CASE],
    ['Caso SellUp · slug sellup', [PROJECTS.find((p) => p.slug === 'sellup'), SELLUP_CASE]],
    ['Caso Encuestas (UBITS) · slug encuestas', [PROJECTS.find((p) => p.slug === 'encuestas'), ENCUESTAS_CASE]],
  ]
  return cases.map(([title, data]) => section(title, flatten(data, locale).join('\n'))).join('\n\n')
}

/** El modelo de impacto de SellUp (cifras de referencia): cómo se proyectan ARR y ROI. */
function sellupImpactBlock(): string {
  const a = ASSUMPTIONS
  return section('SellUp · modelo de impacto (CIFRAS DE REFERENCIA, supuestos moderados, no resultados medidos)', [
    `- El ARR incremental se proyecta como embudo: empresas trabajadas por vendedor a la semana × ${a.weeks} semanas × tasa de conexión × reunión (${a.meeting * 100} %) × cierre (${a.win * 100} %) × contrato anual promedio (USD ${a.acv}).`,
    `- Tasa de conexión: ${a.connectManual * 100} % buscando a mano frente a ${a.connectSellUp * 100} % con SellUp; a mano, ${a.manualPerWeek} empresas por vendedor a la semana.`,
    `- Los cierres llegan con rampa: el primer año cuenta parcial en los primeros meses.`,
    `- Costo: IA unos USD ${a.aiPerCompany} por empresa (búsqueda, contactos y preparación) y USD ${a.platformYear} al año de infraestructura y proveedores.`,
    `- Tiempo: ${a.hoursSavedWeek} horas a la semana que cada vendedor deja de buscar a mano (valoradas a USD ${a.hourly} la hora).`,
    `- ROI = (ARR incremental del primer año + valor de horas ahorradas − costo) / costo.`,
  ].join('\n'))
}

/** Cómo construye: las tecnologías reales de cada proyecto (verificadas en sus repositorios). */
function buildBlock(): string {
  return section('Cómo construyo (tecnología real de cada proyecto)', [
    '- Este portafolio: Next.js (React), animaciones con GSAP y Lenis, proyectos guardados en Supabase con respaldo local si la base no responde, desplegado en Vercel, código en GitHub con ramas y commits pequeños. El agente es una ruta del servidor que llama a Claude con la clave en variables de entorno, valida las preguntas y limita cuántas hace cada visitante.',
    '- Barberlytics: React + Vite con TypeScript; Thema parte de shadcn + Radix con identidad propia; la reserva usa datos simulados con MSW para que la demo pública no toque datos reales; voz con Gemini TTS; desplegado en Vercel; pruebas con Vitest y Playwright; «npm run check» valida 9 reglas del sistema.',
    '- SellUp: Next.js con TypeScript, Tailwind, shadcn y Radix, Supabase como base de datos, desplegado en Vercel; integra HubSpot, Apollo y búsqueda web.',
    '- Objetivos y Encuestas (producto construido en UBITS): React + Vite con TypeScript, react-router, Tailwind y shadcn; archivos de contexto para agentes (AGENTS.md, CLAUDE.md); pruebas con Playwright en Objetivos.',
    '- Forma de explicarlo: el frontend es lo que la persona ve y toca; el backend es donde viven los datos y las reglas (quién puede ver qué); Vercel publica cada cambio con una URL de vista previa; GitHub guarda el historial con ramas, commits y pull requests cuando hay equipo.',
  ].join('\n'))
}

const cache = new Map<Locale, string>()

/** Todo lo que el agente sabe, en un solo texto (se arma una vez por idioma). */
export function buildKnowledge(locale: Locale): string {
  const hit = cache.get(locale)
  if (hit) return hit
  const text = [profileBlock(locale), processBlock(locale), projectsBlock(locale), casesBlock(locale), sellupImpactBlock(), buildBlock()].join('\n\n')
  cache.set(locale, text)
  return text
}
