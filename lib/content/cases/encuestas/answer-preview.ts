/**
 * La vista previa del colaborador de «Clima Organizacional - Q1 2026», tal como la arma el playground
 * (`createPublishedSurveyDraft` + `buildPreviewPages` sobre la encuesta c2026-1): textos, escalas, secciones y
 * conteos copiados del producto, sin inventar. Solo en español, como la encuesta.
 */

export const SURVEY = {
  name: 'Clima Organizacional - Q1 2026',
  kind: 'Clima',
  visibility: 'Pública',
  description: 'Primera medición de clima del año. Cubre siete dimensiones y alimenta los planes de acción de cada área para el resto de 2026.',
  opens: '15 ene 2026',
  closes: '30 ene 2026',
  sections: 7,
  questions: 54,
  minutes: 27,
  pages: 19,
} as const

/** El mensaje de bienvenida («Antes de empezar»), párrafo por párrafo; los que van en negrita, marcados. */
export const WELCOME: readonly { text: string; strong?: boolean; rest?: string }[] = [
  { text: 'Tu opinión cuenta, y esta vez cuenta el doble.', strong: true },
  { text: 'Esta es la medición de clima del primer trimestre de 2026. Recorre siete dimensiones: propósito, liderazgo, colaboración, desarrollo, reconocimiento, bienestar y compromiso.' },
  { text: 'Son 54 preguntas y toma alrededor de media hora. No hace falta responder todo de una vez: tu avance se guarda automáticamente y puedes retomar donde lo dejaste.' },
  { text: 'Esta medición no es anónima.', strong: true, rest: ' Tus respuestas quedan asociadas a tu nombre y las verá el equipo responsable de la encuesta, junto con los resultados agrupados de cada área.' },
]

/** El mensaje de cierre. */
export const CLOSING: readonly { text: string; strong?: boolean }[] = [
  { text: '¡Gracias por completar la medición!', strong: true },
  { text: 'Con 520 respuestas, esta fue la medición con mayor participación desde que empezamos a medir clima.' },
  { text: 'Los resultados generales y los de cada área se comparten durante febrero, junto con los planes de acción que cada equipo definirá a partir de ellos.' },
]

/** Escala de acuerdo del producto (`RATING_STEPS.agreement`). */
export const AGREEMENT = ['Totalmente en desacuerdo', 'En desacuerdo', 'Neutral', 'De acuerdo', 'Totalmente de acuerdo'] as const

/** Página 2 de 19: subsección 1.1. */
export const PAGE_CLARITY = {
  page: 2,
  trail: '1. Propósito y estrategia',
  numbering: '1.1',
  title: 'Claridad estratégica',
  description: 'Conocimiento del rumbo y de las prioridades de la organización.',
  minutes: 2,
  questions: [
    'Entiendo claramente la misión de la organización y hacia dónde va.',
    'Conozco los objetivos estratégicos definidos para este año.',
    'Las prioridades de la organización se mantienen estables el tiempo suficiente para poder avanzar en ellas.',
  ],
} as const

/** Página 17 de 19: subsección 7.1, el NPS con su pregunta de seguimiento por banda. */
export const PAGE_NPS = {
  page: 17,
  trail: '7. Compromiso y recomendabilidad',
  numbering: '7.1',
  title: 'Recomendabilidad',
  minutes: 1,
  statement: '¿Qué tan probable es que recomiendes a esta organización como un buen lugar para trabajar?',
  minLabel: 'Nada probable',
  maxLabel: 'Muy probable',
  followUps: {
    detractors: '¿Qué tendría que cambiar para que la recomendaras?',
    neutrals: '¿Qué falta para que la recomiendes sin dudarlo?',
    promoters: '¿Qué es lo que más valoras de trabajar aquí?',
  },
} as const

/** El índice de «Tu avance»: secciones raíz con sus preguntas, y las subsecciones de la primera. */
export const OUTLINE: readonly { n: string; title: string; total: number; subs?: readonly { n: string; title: string; total: number }[] }[] = [
  { n: '1', title: 'Propósito y estrategia', total: 6, subs: [{ n: '1.1', title: 'Claridad estratégica', total: 3 }, { n: '1.2', title: 'Mi rol en la estrategia', total: 3 }] },
  { n: '2', title: 'Liderazgo', total: 12 },
  { n: '3', title: 'Colaboración y comunicación', total: 7 },
  { n: '4', title: 'Desarrollo y crecimiento', total: 6 },
  { n: '5', title: 'Reconocimiento y compensación', total: 8 },
  { n: '6', title: 'Bienestar y carga de trabajo', total: 9 },
  { n: '7', title: 'Compromiso y recomendabilidad', total: 6, subs: [{ n: '7.1', title: 'Recomendabilidad', total: 1 }, { n: '7.2', title: 'Permanencia', total: 5 }] },
]
