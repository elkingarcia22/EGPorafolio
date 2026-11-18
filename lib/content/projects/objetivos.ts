import type { Project } from './types'

/** CONTENIDO PROVISIONAL — caso de ejemplo mientras se documentan los reales. */
export const objetivos: Project = {
  slug: 'objetivos',
  frequency: '01.24',
  title: { es: 'Objetivos que sí se cumplen', en: 'Goals that actually get done' },
  client: 'UBITS',
  year: '2024',
  accent: '64 96 255',
  mock: 'dashboard',
  tagline: {
    es: 'Rediseño del módulo de objetivos para que líderes y colaboradores pasen de "llenar un formato" a conversar sobre avances reales.',
    en: 'Redesign of the goals module so leaders and employees stop "filling a form" and start talking about real progress.',
  },
  role: { es: 'Lead UX/UI · investigación, diseño y sistema', en: 'UX/UI Lead · research, design and system' },
  team: { es: '1 PM, 4 devs, 1 QA', en: '1 PM, 4 devs, 1 QA' },
  duration: { es: '5 meses', en: '5 months' },
  tools: ['Figma', 'Miro', 'Claude', 'Cursor', 'Hotjar'],
  problem: {
    context: {
      es: 'Las empresas configuraban objetivos al inicio del año y no volvían a abrirlos. El módulo era un formulario largo, sin seguimiento ni conexión con las conversaciones 1:1.',
      en: 'Companies set goals at the start of the year and never opened them again. The module was a long form with no follow-up and no link to 1:1 conversations.',
    },
    quotes: [
      { text: { es: '“Los objetivos los lleno en enero y los vuelvo a ver en la evaluación.”', en: '“I fill in my goals in January and see them again at review time.”' }, who: { es: 'Colaborador, retail', en: 'Employee, retail' } },
      { text: { es: '“No sé si mi equipo va bien hasta que ya es tarde.”', en: '“I don’t know if my team is on track until it’s too late.”' }, who: { es: 'Líder de área', en: 'Team lead' } },
      { text: { es: '“Configurar un ciclo me toma una semana entera.”', en: '“Setting up a cycle takes me a whole week.”' }, who: { es: 'Admin de RR. HH.', en: 'HR admin' } },
    ],
    stats: [
      { value: '12%', label: { es: 'de objetivos con al menos un avance', en: 'of goals with at least one update' } },
      { value: '38 min', label: { es: 'para crear un objetivo', en: 'to create one goal' } },
      { value: '4/10', label: { es: 'satisfacción del admin', en: 'admin satisfaction' } },
    ],
  },
  research: {
    method: {
      es: '14 entrevistas, 3 empresas, análisis de 9.000 objetivos y mapas de calor del flujo actual.',
      en: '14 interviews, 3 companies, analysis of 9,000 goals and heatmaps of the current flow.',
    },
    clusters: [
      {
        title: { es: 'Olvido', en: 'Forgetting' },
        notes: [
          { es: 'Nadie recuerda volver', en: 'Nobody remembers to come back' },
          { es: 'Sin recordatorios', en: 'No reminders' },
          { es: 'Avance = evaluación', en: 'Progress = review' },
        ],
      },
      {
        title: { es: 'Complejidad', en: 'Complexity' },
        notes: [
          { es: '17 campos obligatorios', en: '17 required fields' },
          { es: 'Pesos confusos', en: 'Confusing weights' },
          { es: 'Jerga de RR. HH.', en: 'HR jargon' },
        ],
      },
      {
        title: { es: 'Visibilidad', en: 'Visibility' },
        notes: [
          { es: 'El líder no ve riesgo', en: 'Leads can’t see risk' },
          { es: 'Sin vista de equipo', en: 'No team view' },
        ],
      },
    ],
    insights: [
      { es: 'El objetivo no es el formulario: es la conversación que provoca.', en: 'The goal isn’t the form: it’s the conversation it sparks.' },
      { es: 'Actualizar debe tomar menos que un mensaje de chat.', en: 'Updating must take less time than a chat message.' },
      { es: 'El líder necesita saber dónde intervenir, no ver todo.', en: 'Leads need to know where to step in, not see everything.' },
    ],
  },
  idea: {
    hmw: {
      es: '¿Cómo podríamos hacer que actualizar un objetivo sea tan natural como contar cómo vas?',
      en: 'How might we make updating a goal as natural as saying how you’re doing?',
    },
    principles: [
      { title: { es: 'Un toque', en: 'One tap' }, body: { es: 'Avance en un gesto, detalle solo si quieres.', en: 'Progress in one gesture, detail only if you want.' } },
      { title: { es: 'Riesgo primero', en: 'Risk first' }, body: { es: 'El líder ve primero lo que necesita atención.', en: 'Leads see what needs attention first.' } },
      { title: { es: 'IA que redacta', en: 'AI that drafts' }, body: { es: 'La IA propone objetivos SMART a partir de una idea.', en: 'AI drafts SMART goals from a rough idea.' } },
    ],
  },
  sketches: {
    caption: { es: 'De 6 caminos explorados quedaron 2. El ganador puso el avance en la primera línea de cada tarjeta.', en: 'Out of 6 explored paths, 2 survived. The winner put progress on the first line of every card.' },
    notes: [
      { es: 'avance arriba', en: 'progress on top' },
      { es: '¿semáforo?', en: 'traffic light?' },
      { es: 'vista equipo', en: 'team view' },
    ],
  },
  form: {
    caption: { es: 'Arrastra para pasar del wireframe validado a la interfaz final con el sistema de diseño.', en: 'Drag to go from the validated wireframe to the final UI built on the design system.' },
  },
  ai: {
    intro: { es: 'La IA no reemplazó el criterio: comprimió semanas de exploración en días.', en: 'AI didn’t replace judgment: it compressed weeks of exploration into days.' },
    steps: [
      { tool: 'Claude', prompt: { es: 'Agrupa estas 140 notas de entrevistas por necesidad, no por tema.', en: 'Cluster these 140 interview notes by need, not by topic.' }, output: { es: '6 grupos + 3 tensiones entre líderes y colaboradores', en: '6 clusters + 3 tensions between leads and employees' } },
      { tool: 'Figma Make', prompt: { es: 'Genera 6 variaciones de tarjeta de objetivo con el avance como protagonista.', en: 'Generate 6 goal-card variations with progress as the hero.' }, output: { es: '6 prototipos navegables en una tarde', en: '6 clickable prototypes in one afternoon' } },
      { tool: 'Cursor', prompt: { es: 'Construye el prototipo de "check-in en un toque" con datos reales anonimizados.', en: 'Build the "one-tap check-in" prototype with real anonymized data.' }, output: { es: 'Prototipo en código probado con 8 usuarios', en: 'Coded prototype tested with 8 users' } },
    ],
  },
  results: {
    metrics: [
      { value: 64, suffix: '%', label: { es: 'objetivos con avance mensual', en: 'goals with monthly updates' } },
      { value: 6, suffix: ' min', label: { es: 'para crear un objetivo', en: 'to create a goal' } },
      { value: 3, prefix: '×', suffix: '', label: { es: 'más check-ins de líderes', en: 'more check-ins from leads' } },
    ],
    learnings: [
      { es: 'Medir la conversación, no el formulario.', en: 'Measure the conversation, not the form.' },
      { es: 'Prototipar en código cambió la calidad del feedback.', en: 'Prototyping in code changed the quality of feedback.' },
    ],
  },
}
