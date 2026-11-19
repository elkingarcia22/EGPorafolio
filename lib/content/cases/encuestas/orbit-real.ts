/**
 * Orbit, el agente de UBITS, creando una encuesta: textos, opciones, nombres y preguntas tal como salen en el
 * playground (`agente-encuestas.tsx`, `crear/components/agente/use-conversacion.ts`, `aiSectionsChat.ts`,
 * `agent-kit.tsx`) al pedir «Quiero una encuesta de clima con liderazgo, carga de trabajo y bienestar», elegir
 * «Escala de acuerdo» y «Corta». Capturado en local el 19-nov-2026. Solo en español, como el producto.
 */

/** Los cuatro colores de la IA de Flux UI (`--ai-blue`, `--ai-purple`, `--ai-pink`, `--ai-orange`). */
export const AI = { blue: '#285ee6', purple: '#7e2be0', pink: '#d22d6a', orange: '#eb6233' } as const
export const AI_GRADIENT = `linear-gradient(90deg in oklab, ${AI.blue}, ${AI.purple}, ${AI.pink}, ${AI.orange})`

export const ORB = '/cases/encuestas/orbit-orb.webp'

export const HOME = {
  context: { label: 'Encuestas', detail: '29 encuestas' },
  greeting: 'Hola, Carolina. Te ayudo a leer tus encuestas y a crear una nueva.',
  kicker: '¿Qué quieres hacer?',
  suggestions: ['¿Qué encuestas necesitan atención?', '¿Cómo va la participación?', 'Crear una encuesta con IA'],
  placeholder: 'Pregunta algo sobre tus encuestas',
} as const

export const REQUEST = 'Quiero una encuesta de clima con liderazgo, carga de trabajo y bienestar'

export const BUILDER = {
  contextBefore: { label: 'Encuesta sin título', detail: 'secciones y preguntas' },
  contextAfter: { label: 'Clima laboral · nov 2026', detail: 'secciones y preguntas' },
  continued: 'Sigo aquí con lo que me pediste en Encuestas. Mientras armo la encuesta, la vas a ver crecer a la izquierda.',
  understood: 'Entendido: Liderazgo, Carga de trabajo y Bienestar. Me falta algo más:',
  styleQuestion: '¿Cómo quieres que respondan?',
  styleChips: [
    'Escala de acuerdo — comparables entre sí',
    'Opción única — una sola respuesta',
    'Opción múltiple — varias respuestas',
    'Lista desplegable — lista compacta',
    'Abiertas — respuesta libre',
    'Mixtas — escala + una abierta al cierre',
  ],
  thanks: 'Gracias. Para armarla necesito saber algo más:',
  sizeQuestion: '¿De qué tamaño la armo?',
  sizeChips: ['Corta — 2 secciones × 2 subsecciones × 4 preguntas', 'Estándar — 3 secciones × 3 subsecciones × 5 preguntas', 'Completa — 5 secciones × 3 subsecciones × 6 preguntas'],
  start: 'Perfecto: Liderazgo, Carga de trabajo y Bienestar en la encuesta: 2 secciones × 2 subsecciones × 4 preguntas, escala de acuerdo. Empiezo.',
  working: 'Estoy creando las secciones y sus preguntas en «Secciones y preguntas». Le puse de nombre «Clima laboral · nov 2026» y el tipo Clima en «Datos generales»; cámbialos cuando quieras.',
  reasoned: 'Razonó en 2 pasos · 7s',
  done: 'Listo: la encuesta tiene 2 secciones nuevas con 16 preguntas. Pídeme ajustes aquí o cámbiala a mano: lo que edites lo respeto. Antes de finalizar te faltan las fechas.',
  followUps: ['Agrega una pregunta abierta en Liderazgo', 'Cambia la escala a frecuencia', 'Quita Carga de trabajo'],
  discard: 'Descartar lo que hizo la IA',
  placeholderAsk: 'Escribe lo que quieres medir...',
  placeholderBusy: 'Creando la encuesta...',
  placeholderAdjust: 'Pide un ajuste: «quita Bienestar»...',
  disclaimer: 'Orbit puede cometer errores. Verifica la respuesta.',
} as const

export interface BuiltQuestion {
  n: string
  text: string
}
export interface BuiltSub {
  n: string
  title: string
  description: string
  questions?: readonly BuiltQuestion[]
}
export interface BuiltSection {
  n: string
  title: string
  description: string
  subs: readonly BuiltSub[]
}

/** Lo que Orbit crea en «Secciones y preguntas» (2 × 2 × 4, escala de acuerdo). */
export const SECTIONS: readonly BuiltSection[] = [
  {
    n: '1',
    title: 'Liderazgo',
    description: 'Cómo perciben las personas el acompañamiento, la claridad y la cercanía de quien las lidera.',
    subs: [
      {
        n: '1.1',
        title: 'Confianza y autonomía',
        description: 'Margen de decisión y confianza que recibe el equipo.',
        questions: [
          { n: '1.1.1', text: 'Puedo asumir riesgos razonables sin miedo a ser sancionado.' },
          { n: '1.1.2', text: 'Los errores se tratan como aprendizaje y no como culpa.' },
          { n: '1.1.3', text: 'Se me involucra en las decisiones que afectan a mi equipo.' },
          { n: '1.1.4', text: 'Tengo autonomía para decidir cómo hago mi trabajo.' },
        ],
      },
    ],
  },
  {
    n: '2',
    title: 'Carga de trabajo',
    description: 'Qué tan sostenible es el ritmo de trabajo y qué tanto respeta la vida fuera de la jornada.',
    subs: [
      { n: '2.1', title: 'Volumen y ritmo', description: 'Relación entre lo que se pide y el tiempo disponible.' },
      {
        n: '2.2',
        title: 'Equilibrio con la vida personal',
        description: 'Respeto por el tiempo fuera de la jornada.',
        questions: [
          { n: '2.2.1', text: 'La organización respeta mis horarios de descanso.' },
          { n: '2.2.2', text: 'Puedo desconectarme del trabajo fuera de mi jornada.' },
          { n: '2.2.3', text: 'Rara vez trabajo en fines de semana o festivos.' },
          { n: '2.2.4', text: 'Puedo atender asuntos personales sin sentir culpa.' },
        ],
      },
    ],
  },
]

export const STEPS = ['Datos generales', 'Participantes', 'Datos demográficos', 'Secciones y preguntas', 'Bienvenida y cierre'] as const
export const QUESTION_TYPE = 'Likert (escala de preferencias)'
