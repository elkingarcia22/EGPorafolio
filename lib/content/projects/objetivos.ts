import type { Project } from './types'

/**
 * Ficha de Objetivos (UBITS) para la lista de trabajo y «siguiente proyecto».
 * El caso completo vive en lib/content/cases/objetivos y se muestra con ObjetivosCase.
 * Las cifras de resultados son de referencia: el rediseño aún no está en producción.
 */
export const objetivos: Project = {
  slug: 'objetivos',
  frequency: '01.26',
  title: { es: 'Objetivos que sí se cumplen', en: 'Goals that actually get met' },
  client: 'UBITS',
  year: '2026',
  accent: '64 96 255',
  mock: 'dashboard',
  tagline: {
    es: 'El producto completo de objetivos de UBITS: configurar, crear, alinear en cascada, aprobar, reportar avance y leer resultados, para admin, líder y colaborador.',
    en: 'UBITS’ whole goals product: set up, create, cascade alignment, approve, report progress and read results, for admin, lead and employee.',
  },
  role: { es: 'Diseño de producto · de la investigación al prototipo en código', en: 'Product design · from research to coded prototype' },
  team: { es: 'PM, diseño, front y QA del rediseño del admin', en: 'PM, design, front-end and QA of the admin redesign' },
  duration: { es: 'Sep–nov 2026, en curso', en: 'Sep–Nov 2026, ongoing' },
  tools: ['Figma', 'React + Vite', 'Claude', 'Jira', 'Playwright'],
  problem: {
    context: {
      es: 'En la plataforma, Objetivos era una sola pantalla para configurar ciclos. El producto terminaba al crear el ciclo: no había aprobación, seguimiento ni lectura de resultados.',
      en: 'On the platform, Goals was a single screen to set up cycles. The product ended when the cycle was created: no approval, tracking or reading of results.',
    },
    quotes: [
      { text: { es: '«Estas métricas no me hacen sentido… para incentivar que pongan el progreso.»', en: '“These metrics don’t make sense to me… to encourage people to log progress.”' }, who: { es: 'Revisión de diseño, 30-oct', en: 'Design review, Oct 30' } },
    ],
    stats: [
      { value: '1', label: { es: 'pantalla en la plataforma actual', en: 'screen on the current platform' } },
      { value: '7', label: { es: 'momentos del ciclo por cubrir', en: 'cycle moments to cover' } },
      { value: '3', label: { es: 'roles: admin, líder y colaborador', en: 'roles: admin, lead and employee' } },
    ],
  },
  research: {
    method: {
      es: 'Revisión de producto: Lattice, Viva Goals, Geekbot, Duolingo, Strava, Ambition y Spinify, más el prototipo anterior de configuración.',
      en: 'Product review: Lattice, Viva Goals, Geekbot, Duolingo, Strava, Ambition and Spinify, plus the previous setup prototype.',
    },
    clusters: [
      { title: { es: 'Constancia', en: 'Habit' }, notes: [{ es: 'Premiar reportar, no el % crudo', en: 'Reward reporting, not raw %' }, { es: 'Rachas semanales', en: 'Weekly streaks' }] },
      { title: { es: 'Alineación', en: 'Alignment' }, notes: [{ es: 'Todo cuelga de la empresa', en: 'Everything hangs from the company' }, { es: '«Sin alinear» visible', en: 'Visible “unaligned”' }] },
      { title: { es: 'Privacidad', en: 'Privacy' }, notes: [{ es: 'Menos de 3 no se compara', en: 'Under 3 isn’t compared' }, { es: 'Contar, no nombrar', en: 'Count, don’t name' }] },
    ],
    insights: [
      { es: 'Un objetivo sin aprobar no lleva avance.', en: 'An unapproved goal carries no progress.' },
      { es: 'En público solo se nombra para reconocer.', en: 'In public you only name people to praise them.' },
    ],
  },
  idea: {
    hmw: {
      es: '¿Cómo podríamos hacer que el producto se adapte a la forma en que cada empresa trabaja sus objetivos, y no al revés?',
      en: 'How might we make the product adapt to the way each company works its goals, and not the other way around?',
    },
    principles: [
      { title: { es: 'El norte primero', en: 'North first' }, body: { es: 'Cada objetivo dice a cuál de empresa empuja.', en: 'Every goal says which company goal it pushes.' } },
      { title: { es: 'Acordar antes de medir', en: 'Agree before measuring' }, body: { es: 'Sin aprobación no hay avance.', en: 'No approval, no progress.' } },
      { title: { es: 'Constancia antes que %', en: 'Habit over %' }, body: { es: 'Se premia volver a reportar.', en: 'Coming back to report is rewarded.' } },
    ],
  },
  sketches: {
    caption: { es: 'El recorrido del constructor cambia según quién redacta los objetivos.', en: 'The builder path changes with who writes the goals.' },
    notes: [{ es: '¿quién redacta?', en: 'who writes?' }, { es: 'sin alinear', en: 'unaligned' }, { es: 'resumen en 5 bloques', en: '5-block summary' }],
  },
  form: {
    caption: { es: 'Capturas reales del playground de UBITS con el alcance completo.', en: 'Real screenshots of UBITS’ playground with the full scope.' },
  },
  ai: {
    intro: { es: 'IA para escribir objetivos, leer el ciclo y sincronizar el código con los casos de uso.', en: 'AI to write goals, read the cycle and sync code with use cases.' },
    steps: [
      { tool: 'Crear con IA', prompt: { es: 'Cinco preguntas, ningún campo técnico.', en: 'Five questions, no technical fields.' }, output: { es: 'Objetivos con dirección y medida deducidas', en: 'Goals with deduced direction and measure' } },
      { tool: 'Análisis con IA', prompt: { es: 'Leer el ciclo completo.', en: 'Read the whole cycle.' }, output: { es: 'Hallazgos, riesgos y acciones con evidencia', en: 'Findings, risks and actions with evidence' } },
      { tool: 'Claude', prompt: { es: 'Cruzar cada cambio del playground con los casos de uso.', en: 'Match every playground change with the use cases.' }, output: { es: 'Propuestas con pantallazo para aprobación humana', en: 'Screenshot proposals for human approval' } },
    ],
  },
  results: {
    metrics: [
      { value: 926, suffix: '', label: { es: 'casos de uso con su subtarea en Jira', en: 'use cases with their Jira subtask' } },
      { value: 80, suffix: '', label: { es: 'funcionalidades repartidas por trimestre', en: 'features split by quarter' } },
      { value: 7, suffix: '', label: { es: 'pestañas de resultados', en: 'results tabs' } },
    ],
    learnings: [
      { es: 'Escribir las reglas al lado del código hizo que las decisiones sobrevivieran.', en: 'Writing rules next to the code made decisions survive.' },
      { es: 'Decir qué no existe todavía evitó prometer pantallas.', en: 'Stating what doesn’t exist yet avoided promising screens.' },
    ],
  },
}
