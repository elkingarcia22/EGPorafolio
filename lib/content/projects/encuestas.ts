import type { Project } from './types'

/**
 * Encuestas de UBITS. El caso completo vive en /proyectos/encuestas con sus propios componentes
 * (components/case/encuestas); esta ficha alimenta la lista de trabajo, el agente y el «siguiente proyecto».
 */
export const encuestas: Project = {
  slug: 'encuestas',
  frequency: '05.26',
  title: { es: 'Encuestas en accionables', en: 'Surveys into actions' },
  client: 'UBITS',
  year: '2026',
  accent: '12 91 239',
  mock: 'dashboard',
  tagline: {
    es: 'Rediseño del producto completo de encuestas: crear, ordenar en secciones, traer el histórico, responder y convertir los resultados en acciones, sin romper la promesa de anonimato.',
    en: 'Redesign of the whole survey product: create, organize in sections, bring in history, answer and turn results into actions, without breaking the anonymity promise.',
  },
  role: { es: 'Diseño de producto end-to-end · investigación, prototipo y especificación', en: 'End-to-end product design · research, prototype and spec' },
  team: { es: 'Diseño, producto y desarrollo de UBITS', en: 'UBITS design, product and engineering' },
  duration: { es: '7 meses, en cuatro iteraciones', en: '7 months, in four iterations' },
  tools: ['React', 'Flux UI', 'Claude Code', 'Vite', 'Figma'],
  problem: {
    context: {
      es: 'La plataforma permitía crear encuestas en blanco o con plantilla, pero no traer las mediciones hechas en otras herramientas, no tenía una experiencia diseñada para responder y los resultados había que exportarlos para leerlos.',
      en: 'The platform let you create surveys from scratch or a template, but not bring in measurements from other tools, had no designed answering experience and results had to be exported to be read.',
    },
    quotes: [
      { text: { es: '“Los archivos por gerencia no son encuestas distintas: son cortes del mismo ciclo.”', en: '“Per-department files aren’t separate surveys: they’re cuts of the same cycle.”' }, who: { es: 'Revisión de la carga histórica', en: 'Historical upload review' } },
      { text: { es: '“Un demográfico identifica igual que un nombre.”', en: '“A demographic identifies just like a name.”' }, who: { es: 'Regla de anonimato', en: 'Anonymity rule' } },
    ],
    stats: [
      { value: '83', label: { es: 'encuestas en una sola lista en la cuenta auditada', en: 'surveys in a single list in the audited account' } },
      { value: '0', label: { es: 'formas de traer el histórico', en: 'ways to bring in history' } },
    ],
  },
  research: {
    method: { es: 'Recorrido de la plataforma actual con una cuenta de administración, reuniones con el equipo y crítica de cuatro prototipos propios.', en: 'Walkthrough of the current platform with an admin account, team meetings and critique of four of our own prototypes.' },
    clusters: [
      { title: { es: 'Privacidad', en: 'Privacy' }, notes: [{ es: 'Descargas sin umbral', en: 'Downloads without threshold' }, { es: 'Demográficos que identifican', en: 'Identifying demographics' }] },
      { title: { es: 'Lectura', en: 'Reading' }, notes: [{ es: 'Exportar para leer', en: 'Export to read' }, { es: 'Puntaje sin dónde actuar', en: 'Score without where to act' }] },
    ],
    insights: [{ es: 'La privacidad es una regla que viaja a cada pantalla y cada archivo.', en: 'Privacy is a rule that travels to every screen and file.' }],
  },
  idea: {
    hmw: { es: '¿Cómo podríamos pasar de «mandé una encuesta» a «sé qué hacer y con quién»?', en: 'How might we go from “I sent a survey” to “I know what to do and with whom”?' },
    principles: [
      { title: { es: 'Anónima o pública', en: 'Anonymous or public' }, body: { es: 'Sin término medio.', en: 'Nothing in between.' } },
      { title: { es: 'A quién antes que qué', en: 'Who before what' }, body: { es: 'La audiencia define el contenido.', en: 'The audience shapes the content.' } },
    ],
  },
  sketches: {
    caption: { es: 'Cuatro iteraciones: del chat al sistema de diseño.', en: 'Four iterations: from chat to design system.' },
    notes: [{ es: 'El árbol de secciones', en: 'The section tree' }],
  },
  form: { caption: { es: 'Constructor, carga histórica, respuesta y resultados.', en: 'Builder, historical upload, answering and results.' } },
  ai: {
    intro: { es: 'IA para leer archivos, redactar preguntas y resumir resultados, siempre con la cifra que la sostiene.', en: 'AI to read files, draft questions and summarize results, always with the number behind it.' },
    steps: [{ tool: 'Claude Code', prompt: { es: 'Documentar el recorrido y la anatomía de una encuesta.', en: 'Document the journey and anatomy of a survey.' }, output: { es: 'Dos guías: una de experiencia y una técnica.', en: 'Two guides: one for experience, one technical.' } }],
  },
  results: {
    metrics: [
      { value: 99, suffix: '', label: { es: 'funcionalidades con fecha de llegada', en: 'features with a delivery date' } },
      { value: 487, suffix: '', label: { es: 'casos de uso documentados', en: 'documented use cases' } },
    ],
    learnings: [{ es: 'Escribir la regla antes que la pantalla.', en: 'Write the rule before the screen.' }],
  },
}
