import { EARLY_JOBS, JOBS, PROFILE, SKILLS, STUDIES, TOOL_GROUPS } from '@/lib/content/profile'
import type { L } from '@/lib/i18n'

/** Tamaño carta a 96 ppp: lo que mide la hoja impresa o en PDF */
export const PAGE = { width: 816, height: 1056 } as const

/** Títulos de sección de la hoja de vida */
export const CV_LABELS = {
  profile: { es: 'Perfil', en: 'Profile' },
  experience: { es: 'Experiencia', en: 'Experience' },
  earlier: { es: 'Trayectoria previa', en: 'Earlier work' },
  education: { es: 'Educación', en: 'Education' },
  skills: { es: 'Habilidades', en: 'Skills' },
  tools: { es: 'Herramientas', en: 'Tools' },
  contact: { es: 'Contacto', en: 'Contact' },
  years: { es: 'años diseñando', en: 'years designing' },
  trainings: { es: 'formaciones', en: 'credentials' },
  companies: { es: 'empresas', en: 'companies' },
  portfolio: { es: 'Portafolio', en: 'Portfolio' },
} as const satisfies Record<string, L>

export interface CvView {
  firstName: string
  lastName: string
  role: string
  summary: string
  contact: { label: string; value: string }[]
  jobs: { company: string; period: string; roles: { title: string; period: string }[]; summary: string }[]
  earlier: { title: string; company: string; period: string }[]
  studies: { title: string; school: string; period: string }[]
  skills: string[]
  tools: { title: string; tools: readonly string[] }[]
  stats: { value: string; label: string }[]
}

/** La hoja de vida ya traducida, lista para cualquiera de los diseños. */
export function buildCv(t: (text: L) => string): CvView {
  const linkedin = PROFILE.linkedin.replace(/^https?:\/\/(www\.)?/, '')
  return {
    firstName: PROFILE.firstName,
    lastName: PROFILE.lastName,
    role: t(PROFILE.role),
    summary: t(PROFILE.summary),
    contact: [
      { label: 'Tel', value: PROFILE.phoneDisplay },
      { label: 'Mail', value: PROFILE.email },
      { label: 'In', value: linkedin },
      { label: 'Loc', value: t(PROFILE.location) },
    ],
    jobs: JOBS.map((job) => ({
      company: job.company,
      period: job.period.replace('2026', t({ es: 'hoy', en: 'now' })),
      roles: job.roles.map((r) => ({ title: t(r.title), period: r.period })),
      summary: t(job.summary),
    })),
    earlier: EARLY_JOBS.map((job) => ({ title: t(job.title), company: job.company, period: job.period })),
    studies: STUDIES.map((s) => ({ title: t(s.title), school: s.school, period: s.period })),
    skills: SKILLS.map(t),
    tools: TOOL_GROUPS.map((g) => ({ title: t(g.title), tools: g.tools })),
    stats: [
      { value: `${PROFILE.currentYear - PROFILE.startYear}+`, label: t(CV_LABELS.years) },
      { value: String(JOBS.length + EARLY_JOBS.length), label: t(CV_LABELS.companies) },
      { value: String(STUDIES.length), label: t(CV_LABELS.trainings) },
    ],
  }
}
