import type { L } from '@/lib/i18n'

/**
 * Guion de «Crear encuesta con IA», calcado del agente real del playground
 * (crear/components/agente/use-conversacion.ts): mismos textos, mismas opciones
 * y los mismos tiempos de armado (MS_SECCION 520, MS_PREGUNTA 140, «Finalizando…» 1200).
 * Todo se deriva de un reloj en milisegundos para que la escena sea determinista.
 */

export const MS_SECCION = 520
export const MS_PREGUNTA = 140
const MS_FINALIZANDO = 1200

export interface Sub {
  title: L
  questions: readonly L[]
}

export interface AiSection {
  id: string
  title: L
  subs: readonly Sub[]
}

/** Las tres secciones con sus temas y enunciados reales (modelo/aiSectionThemes.ts). */
export const SECTIONS: readonly AiSection[] = [
  {
    id: 'liderazgo',
    title: { es: 'Liderazgo', en: 'Leadership' },
    subs: [
      {
        title: { es: 'Acompañamiento del líder', en: 'Leader support' },
        questions: [
          { es: 'Mi líder está disponible cuando necesito su apoyo.', en: 'My leader is available when I need support.' },
          { es: 'Mi líder escucha mis ideas antes de tomar decisiones que me afectan.', en: 'My leader listens to my ideas before decisions that affect me.' },
          { es: 'Recibo acompañamiento cuando enfrento una dificultad en mi trabajo.', en: 'I get support when I face a difficulty at work.' },
        ],
      },
      {
        title: { es: 'Claridad de expectativas', en: 'Clear expectations' },
        questions: [
          { es: 'Sé con claridad qué se espera de mí en mi cargo.', en: 'I know clearly what is expected of me in my role.' },
          { es: 'Entiendo cómo se evalúa mi desempeño.', en: 'I understand how my performance is assessed.' },
          { es: 'Las prioridades de mi equipo se comunican de forma clara.', en: 'My team’s priorities are communicated clearly.' },
        ],
      },
    ],
  },
  {
    id: 'carga',
    title: { es: 'Carga de trabajo', en: 'Workload' },
    subs: [
      {
        title: { es: 'Volumen y ritmo', en: 'Volume and pace' },
        questions: [
          { es: 'Mi carga de trabajo es manejable en una jornada normal.', en: 'My workload is manageable in a normal workday.' },
          { es: 'Los plazos que se me asignan son realistas.', en: 'The deadlines I’m given are realistic.' },
          { es: 'Cuento con apoyo cuando la carga aumenta.', en: 'I get support when the workload grows.' },
        ],
      },
      {
        title: { es: 'Equilibrio con la vida personal', en: 'Work–life balance' },
        questions: [
          { es: 'Puedo desconectarme del trabajo fuera de mi jornada.', en: 'I can disconnect from work after hours.' },
          { es: 'Mis vacaciones se respetan.', en: 'My vacations are respected.' },
          { es: 'La organización respeta mis horarios de descanso.', en: 'The organization respects my rest time.' },
        ],
      },
    ],
  },
  {
    id: 'bienestar',
    title: { es: 'Bienestar', en: 'Well-being' },
    subs: [
      {
        title: { es: 'Salud emocional', en: 'Emotional health' },
        questions: [
          { es: 'Termino la jornada con energía suficiente.', en: 'I finish the day with enough energy.' },
          { es: 'El nivel de estrés en mi trabajo es manejable.', en: 'The stress level at my job is manageable.' },
          { es: 'Sé a quién acudir si necesito apoyo emocional.', en: 'I know who to turn to for emotional support.' },
        ],
      },
      {
        title: { es: 'Entorno y seguridad', en: 'Environment and safety' },
        questions: [
          { es: 'Mi espacio de trabajo es adecuado para lo que hago.', en: 'My workspace suits what I do.' },
          { es: 'Cuento con condiciones seguras para trabajar.', en: 'I have safe working conditions.' },
          { es: 'Sé cómo reportar una condición insegura.', en: 'I know how to report an unsafe condition.' },
        ],
      },
    ],
  },
]

/** Las seis formas de responder, tal como las ofrece el chat (STYLE_CHIPS). */
export const STYLE_CHIPS: readonly L[] = [
  { es: 'Escala de acuerdo — comparables entre sí', en: 'Agreement scale — comparable to each other' },
  { es: 'Opción única — una sola respuesta', en: 'Single choice — one answer' },
  { es: 'Opción múltiple — varias respuestas', en: 'Multiple choice — several answers' },
  { es: 'Lista desplegable — lista compacta', en: 'Dropdown — compact list' },
  { es: 'Abiertas — respuesta libre', en: 'Open — free text' },
  { es: 'Mixtas — escala + una abierta al cierre', en: 'Mixed — scale + one open at the end' },
]

export const PROMPT: L = { es: 'Quiero una encuesta de clima con liderazgo, carga de trabajo y bienestar, 3 secciones', en: 'I want a climate survey on leadership, workload and well-being, 3 sections' }
export const ADJUST: L = { es: 'Quita Bienestar', en: 'Remove Well-being' }

// ── Línea de tiempo (ms) ──
export const T = {
  greet: 300,
  typeStart: 1300,
  typeEnd: 4300,
  ask: 5000,
  pick: 7200,
  pickBubble: 7600,
  start: 8200,
  build: 8900,
} as const

const SUB_SPAN = 300 + 3 * MS_PREGUNTA + 100
const SECTION_SPAN = MS_SECCION + 2 * SUB_SPAN

export interface Placed {
  section: number
  at: number
  end: number
  subs: { at: number; questions: number[] }[]
}

export const PLACED: readonly Placed[] = SECTIONS.map((s, i) => {
  const at = T.build + i * SECTION_SPAN
  return {
    section: i,
    at,
    end: at + SECTION_SPAN,
    subs: s.subs.map((sub, k) => {
      const subAt = at + MS_SECCION + k * SUB_SPAN
      return { at: subAt, questions: sub.questions.map((_, q) => subAt + 300 + q * MS_PREGUNTA) }
    }),
  }
})

const BUILD_END = PLACED[PLACED.length - 1].end
export const T2 = {
  finishing: BUILD_END,
  done: BUILD_END + MS_FINALIZANDO,
  adjustTypeStart: BUILD_END + MS_FINALIZANDO + 2200,
  adjustTypeEnd: BUILD_END + MS_FINALIZANDO + 3400,
  adjustBubble: BUILD_END + MS_FINALIZANDO + 3600,
  remove: BUILD_END + MS_FINALIZANDO + 4300,
  removed: BUILD_END + MS_FINALIZANDO + 4800,
  reply: BUILD_END + MS_FINALIZANDO + 4900,
} as const

/** Donde se queda quieta la escena (y la escena completa con movimiento reducido). */
export const END = T2.reply + 600
/** Tras una pausa con el resultado a la vista, vuelve a empezar. */
export const LOOP = END + 6000

export const STEPS: readonly { from: number; label: L }[] = [
  { from: 0, label: { es: 'Cuenta qué medir', en: 'Say what to measure' } },
  { from: T.ask, label: { es: 'Pregunta solo lo que falta', en: 'Asks only what’s missing' } },
  { from: T.start, label: { es: 'Arma a la vista', en: 'Builds in plain sight' } },
  { from: T2.adjustTypeStart, label: { es: 'Ajustas con tus palabras', en: 'Adjust in your own words' } },
]

export const stepAt = (ms: number) => STEPS.reduce((acc, s, i) => (ms >= s.from ? i : acc), 0)

/** Cuántos caracteres van escritos de `text` entre `start` y `end`. */
export const typedAt = (text: string, ms: number, start: number, end: number) =>
  ms < start ? '' : text.slice(0, Math.ceil(((Math.min(ms, end) - start) / (end - start)) * text.length))
