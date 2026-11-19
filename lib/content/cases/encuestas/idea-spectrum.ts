import type { L } from '@/lib/i18n'

/**
 * Las plantillas reales del catálogo de Encuestas (playground, `modelo/nom035Templates.ts` y `plantillasPorLargo.ts`),
 * medidas con el `measureTemplate` del producto: secciones raíz, preguntas y minutos (0,5 min por pregunta).
 * Las de la NOM 035 son las del prototipo: una muestra del cuestionario oficial, con su misma estructura.
 */

export type Tier = 'sencilla' | 'robusta' | 'normativa'

export interface SpectrumSection {
  title: string
  questions: number
  /** Dominios (subsecciones) dentro de la categoría, en las guías de riesgo. */
  sub?: number
}

export interface SpectrumTemplate {
  id: string
  name: L
  tier: Tier
  /** Niveles del árbol: 1 = solo secciones; 3 = categoría → dominio → dimensión. */
  levels: 1 | 3
  sections: readonly SpectrumSection[]
  /** Para qué la usa una empresa. */
  use: L
}

const flat = (titles: readonly string[], each: number): SpectrumSection[] => titles.map((title) => ({ title, questions: each }))

const CLIMA = ['Orientación organizacional', 'Gestión del talento humano', 'Estilo de liderazgo', 'Comunicación organizacional', 'Colaboración', 'Capacidad profesional', 'Ambiente físico de trabajo', 'Salud y seguridad en el trabajo', 'Manejo del cambio', 'Equilibrio trabajo-vida']
const CULTURA = ['Participación', 'Consistencia', 'Misión', 'Adaptabilidad', 'Reconocimiento']
const RIESGO = [
  { title: 'Ambiente de trabajo', questions: 4, sub: 1 },
  { title: 'Factores propios de la actividad', questions: 4, sub: 2 },
  { title: 'Organización del tiempo de trabajo', questions: 2, sub: 2 },
  { title: 'Liderazgo y relaciones en el trabajo', questions: 3, sub: 3 },
]

export const SPECTRUM: readonly SpectrumTemplate[] = [
  { id: 'ucorp', tier: 'sencilla', levels: 1, name: { es: 'Universidad Corporativa', en: 'Corporate University' }, use: { es: 'Cómo fue una experiencia de aprendizaje', en: 'How a learning experience went' }, sections: flat(['Experiencia de aprendizaje'], 4) },
  { id: 'enps', tier: 'sencilla', levels: 1, name: { es: 'eNPS', en: 'eNPS' }, use: { es: 'Un pulso rápido de lealtad', en: 'A quick loyalty pulse' }, sections: flat(['Satisfacción laboral', 'Confianza en la organización', 'Compromiso organizacional', 'Lealtad del colaborador', 'Valor percibido del empleo'], 1) },
  { id: 'ia', tier: 'sencilla', levels: 1, name: { es: 'Adopción de IA', en: 'AI adoption' }, use: { es: 'Qué tanto usa el equipo la IA', en: 'How much the team uses AI' }, sections: flat(['Percepción general sobre IA', 'Conocimiento técnico básico', 'Aplicación práctica en el trabajo', 'Formación y desarrollo', 'Ética y seguridad'], 2) },
  { id: 'cultura', tier: 'robusta', levels: 1, name: { es: 'Cultura · completa', en: 'Culture · full' }, use: { es: 'Los valores, medidos a fondo', en: 'Values, measured in depth' }, sections: flat(CULTURA, 10) },
  { id: 'clima', tier: 'robusta', levels: 1, name: { es: 'Clima · completa', en: 'Climate · full' }, use: { es: 'La medición anual de toda la empresa', en: 'The company-wide yearly measurement' }, sections: flat(CLIMA, 5) },
  { id: 'nom1', tier: 'normativa', levels: 1, name: { es: 'NOM 035 · Guía I', en: 'NOM 035 · Guide I' }, use: { es: 'Quién vivió un acontecimiento traumático severo', en: 'Who went through a severe traumatic event' }, sections: [{ title: 'Acontecimiento traumático severo', questions: 6 }, { title: 'Recuerdos persistentes', questions: 2 }, { title: 'Esfuerzo por evitar circunstancias', questions: 7 }, { title: 'Afectación', questions: 5 }] },
  { id: 'nom3', tier: 'normativa', levels: 3, name: { es: 'NOM 035 · Guía III', en: 'NOM 035 · Guide III' }, use: { es: 'Riesgo psicosocial, más de 50 colaboradores', en: 'Psychosocial risk, over 50 employees' }, sections: [...RIESGO, { title: 'Entorno organizacional', questions: 4, sub: 2 }] },
]

export interface Rule {
  id: string
  label: L
}

/** Lo que la persona decide en cualquier plantilla organizacional. */
export const EDITABLE: readonly Rule[] = [
  { id: 'preguntas', label: { es: 'Edita, suma o quita preguntas', en: 'Edit, add or remove questions' } },
  { id: 'secciones', label: { es: 'Secciones y subsecciones hasta 3 niveles', en: 'Sections and subsections up to 3 levels' } },
  { id: 'visibilidad', label: { es: 'Anónima o pública, con mínimo por grupo', en: 'Anonymous or public, with a group minimum' } },
  { id: 'participantes', label: { es: 'Toda la empresa, por grupos o por persona', en: 'Whole company, by group or by person' } },
]

/** Lo que la norma enciende en una NOM 035 (verificado en el código del playground). */
export const NORMATIVE: readonly Rule[] = [
  { id: 'oficial', label: { es: 'Cuestionario oficial: se revisa, no se edita', en: 'Official questionnaire: reviewed, not edited' } },
  { id: 'demografico', label: { es: 'Al menos un dato demográfico activo', en: 'At least one active demographic' } },
  { id: 'participacion', label: { es: 'Exige el 100 % de participación', en: 'Requires 100 % participation' } },
  { id: 'riesgo', label: { es: 'Se lee como riesgo, no como favorabilidad', en: 'Read as risk, not favorability' } },
]

/** Lo que entrega cada guía de la norma en vez de un puntaje. */
export const NORMATIVE_OUTPUT: Record<string, L> = {
  nom1: { es: 'Resultado: la lista de personas a canalizar', en: 'Result: the list of people to refer' },
  nom3: { es: 'Resultado: riesgo por categoría → dominio → dimensión', en: 'Result: risk by category → domain → dimension' },
}

export const TIER_LABEL: Record<Tier, L> = {
  sencilla: { es: 'Sencilla', en: 'Simple' },
  robusta: { es: 'Robusta', en: 'Robust' },
  normativa: { es: 'Normativa', en: 'Regulatory' },
}

export const MINUTES_PER_QUESTION = 0.5
