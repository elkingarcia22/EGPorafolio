import type { L } from '@/lib/i18n'

/**
 * Textos del caso Objetivos (UBITS). Las cifras «de construcción» salen del playground y del tablero del
 * rediseño; las de impacto son de referencia y lo dicen en pantalla.
 * Fuentes: playground-ux (admin/desempeno-cultura/objetivos), prototipo «configuración objetivos»,
 * motor de Rediseno-UBITS-2027 y el tablero «Rediseño UBITS».
 */

export interface Fact {
  value: string
  label: L
}

export interface Shot {
  src: string
  alt: L
  caption: L
}

const img = (name: string) => `/cases/objetivos/${name}.webp`

export const OBJ_CASE = {
  title: { es: 'Objetivos', en: 'Goals' } as L,
  eyebrow: { es: 'UBITS · Desempeño y cultura', en: 'UBITS · Performance & culture' } as L,
  tagline: {
    es: 'El producto completo de objetivos: del ciclo que configura RR. HH. al avance que reporta cada persona, con la empresa, las áreas y la gente conectadas en una sola cascada.',
    en: 'The whole goals product: from the cycle HR sets up to the progress each person reports, with company, areas and people connected in a single cascade.',
  } as L,
  meta: [
    { label: { es: 'Rol', en: 'Role' }, value: { es: 'Diseño de producto · de la investigación al prototipo en código', en: 'Product design · from research to coded prototype' } },
    { label: { es: 'Año', en: 'Year' }, value: { es: '2026', en: '2026' } },
    { label: { es: 'Equipo', en: 'Team' }, value: { es: 'PM, diseño, front y QA del rediseño del admin', en: 'PM, design, front-end and QA of the admin redesign' } },
    { label: { es: 'Alcance', en: 'Scope' }, value: { es: 'Admin, líder y colaborador', en: 'Admin, lead and employee' } },
  ] as readonly { label: L; value: L }[],
  tools: ['Figma', 'React + Vite', 'Claude', 'Jira', 'Playwright'] as readonly string[],

  dots: {
    kicker: { es: 'Los objetivos se configuraban. Después, silencio.', en: 'Goals got configured. Then, silence.' } as L,
    lead: {
      es: 'Objetivos era una sola pantalla: armar el ciclo y cargar un Excel. Ahí terminaba; nadie veía si la empresa avanzaba.',
      en: 'Goals was a single screen: set up the cycle and upload an Excel. It ended there; no one could see if the company moved.',
    } as L,
    seen: [
      {
        title: { es: 'Un formulario, no un producto', en: 'A form, not a product' },
        body: { es: 'Todo giraba en torno a crear el ciclo. Seguimiento, aprobación y resultados quedaban por fuera.', en: 'Everything revolved around creating the cycle. Tracking, approval and results were left out.' },
      },
      {
        title: { es: 'Carga masiva frágil', en: 'Fragile bulk upload' },
        body: { es: 'La operación se elegía a mano y «equivocarse no da error»; un usuario repetido avisaba pero no bloqueaba.', en: 'The operation was picked by hand and “getting it wrong throws no error”; a duplicate user warned but didn’t block.' },
      },
      {
        title: { es: 'Avance sin lectura', en: 'Progress with no reading' },
        body: { es: 'Un porcentaje por persona, sin saber si iba atrasado frente al calendario ni a qué objetivo de empresa aportaba.', en: 'One percentage per person, with no sense of whether it lagged the calendar or which company goal it fed.' },
      },
    ] as readonly { title: L; body: L }[],
    facts: [
      { value: '1', label: { es: 'pantalla en la plataforma actual', en: 'screen on the current platform' } },
      { value: '7', label: { es: 'momentos del ciclo por cubrir', en: 'cycle moments to cover' } },
      { value: '3', label: { es: 'roles: admin, líder y colaborador', en: 'roles: admin, lead and employee' } },
      { value: '15', label: { es: 'áreas de casos de uso', en: 'use-case areas' } },
    ] as readonly Fact[],
  },

  patterns: {
    lead: {
      es: 'Sin entrevistas ni métricas de uso, comparé cómo escriben objetivos cinco tipos de empresa.',
      en: 'With no interviews or usage data, I compared how five kinds of companies write goals.',
    } as L,
    insights: [
      { es: 'Premiar la constancia de reportar, no el % crudo: el % castiga a quien se pone metas ambiciosas.', en: 'Reward the habit of reporting, not the raw %: raw % punishes ambitious goals.' },
      { es: 'Comparar grupos de tamaño parecido; un grupo de menos de 3 personas no se compara.', en: 'Compare groups of similar size; a group under 3 people is never compared.' },
      { es: 'En público solo se nombra para reconocer: a quien falta se le cuenta, no se le nombra.', en: 'In public you only name people to praise them: those missing are counted, not named.' },
      { es: 'Un objetivo sin aprobar no lleva avance: primero se acuerda, después se mide.', en: 'An unapproved goal carries no progress: agree first, measure later.' },
    ] as readonly L[],
  },

  idea: {
    hmw: {
      es: '¿Cómo podríamos hacer que el producto se adapte a la forma en que cada empresa trabaja sus objetivos, y no al revés?',
      en: 'How might we make the product adapt to the way each company works its goals, and not the other way around?',
    } as L,
  },

  form: {
    lead: {
      es: 'El rediseño se construyó en React, sobre el sistema de diseño de UBITS: estos son sus bloques reales, con datos de prueba.',
      en: 'The redesign was built in React on the UBITS design system: these are its real blocks, with test data.',
    } as L,
    steps: [
      { id: 'general', label: { es: 'Parametrización', en: 'Setup' }, shot: { src: img('crear'), alt: { es: 'Paso 1 del constructor: nombre, duración y fechas', en: 'Builder step 1: name, duration and dates' }, caption: { es: 'Nombre, duración y quién redacta. «Así va el ciclo» dice qué falta.', en: 'Name, duration and who writes. “How the cycle is going” says what’s missing.' } } },
      { id: 'company', label: { es: 'Objetivos de la empresa', en: 'Company goals' }, shot: { src: img('empresa'), alt: { es: 'Paso de objetivos de la empresa con Crear con IA', en: 'Company goals step with Create with AI' } , caption: { es: 'El norte primero: cada objetivo con qué se quiere lograr y cómo se mide.', en: 'North first: each goal with what to achieve and how it’s measured.' } } },
      { id: 'objectives', label: { es: 'Objetivos asignados', en: 'Assigned goals' }, shot: { src: img('asignados'), alt: { es: 'Paso de objetivos asignados por grupo', en: 'Assigned goals by group step' }, caption: { es: 'Se reparten por grupo o persona, con su peso; el resumen confirma que todo está listo.', en: 'Split by group or person, with weight; the summary confirms all is ready.' } } },
      { id: 'carga', label: { es: 'Carga masiva', en: 'Bulk upload' }, shot: { src: img('carga'), alt: { es: 'Panel de carga masiva de objetivos', en: 'Bulk goal upload panel' }, caption: { es: 'La operación se elige antes de subir el archivo: crear, editar o actualizar avance.', en: 'The operation is chosen before uploading: create, edit or update progress.' } } },
    ] as readonly { id: string; label: L; shot: Shot }[],
    tabs: [
      { id: 'resumen', label: { es: 'Resumen', en: 'Summary' }, shot: { src: img('resumen'), alt: { es: 'Resumen de un ciclo finalizado', en: 'Summary of a closed cycle' }, caption: { es: 'Cómo cerró: avance frente al calendario y ritmo de reportes.', en: 'How it closed: progress vs. calendar and reporting rhythm.' } } },
      { id: 'alineacion', label: { es: 'Alineación', en: 'Alignment' }, shot: { src: img('alineacion'), alt: { es: 'Mapa de alineación de áreas a objetivos de empresa', en: 'Alignment map from areas to company goals' }, caption: { es: 'De cada área a cada objetivo de empresa: el grosor es lo que aporta y el color, cómo va.', en: 'From each area to each company goal: thickness is contribution, colour is progress.' } } },
      { id: 'cumplimiento', label: { es: 'Cumplimiento', en: 'Attainment' }, shot: { src: img('calor'), alt: { es: 'Mapa de calor de cumplimiento por área', en: 'Attainment heat map by area' }, caption: { es: 'Mapa de calor: un cruce de menos de 3 personas sale reservado.', en: 'Heat map: a cell with under 3 people is kept private.' } } },
      { id: 'participantes', label: { es: 'Participantes', en: 'People' }, shot: { src: img('ficha'), alt: { es: 'Ficha de un colaborador con sus objetivos', en: 'Employee profile with their goals' }, caption: { es: 'La ficha de cada persona: peso, objetivos en meta y «Actualizar avance».', en: 'Each person’s profile: weight, goals on target and “Update progress”.' } } },
      { id: 'ranking', label: { es: 'Ranking', en: 'Ranking' }, shot: { src: img('ranking'), alt: { es: 'Pulso de reporte con podio por área', en: 'Reporting pulse with podium by area' }, caption: { es: 'Pulso de reporte: rachas y podio por área, con «Felicitar».', en: 'Reporting pulse: streaks and area podium, with “Congratulate”.' } } },
      { id: 'ia', label: { es: 'Análisis con IA', en: 'AI analysis' }, shot: { src: img('ia'), alt: { es: 'Lectura de la IA del ciclo', en: 'AI reading of the cycle' }, caption: { es: 'Hallazgos, riesgos y acciones, cada uno con su evidencia y su confiabilidad.', en: 'Findings, risks and actions, each with evidence and confidence.' } } },
      { id: 'accionables', label: { es: 'Accionables', en: 'Actions' }, shot: { src: img('accionables'), alt: { es: 'Accionables sugeridos del ciclo', en: 'Suggested cycle actions' }, caption: { es: 'Cada accionable crea una tarea con responsable y entregable.', en: 'Each action creates a task with an owner and a deliverable.' } } },
    ] as readonly { id: string; label: L; shot: Shot }[],
    home: { src: img('inicio'), alt: { es: 'Inicio de Objetivos con Para atender y pulso', en: 'Goals home with To attend and pulse' }, caption: { es: 'El inicio: lo que hay que atender, el pulso de todos los ciclos y la lista.', en: 'Home: what needs attention, the pulse of every cycle and the list.' } } as Shot,
    noGoals: { src: img('sin-objetivos'), alt: { es: 'Usuarios sin objetivos', en: 'Users without goals' }, caption: { es: '«Usuarios sin objetivos»: quién quedó por fuera, con «Agregar a ciclo».', en: '“Users without goals”: who was left out, with “Add to cycle”.' } } as Shot,
    periods: { src: img('periodos'), alt: { es: 'Ciclo anual dividido en trimestres', en: 'Yearly cycle split into quarters' }, caption: { es: 'Un ciclo anual dividido en periodos: cada trimestre con su estado.', en: 'A yearly cycle split into periods: each quarter with its state.' } } as Shot,
  },

  ai: {
    lead: {
      es: 'Escribir un buen objetivo es lo más difícil. «Crear con IA» lo resuelve con dos preguntas que cualquiera responde.',
      en: 'Writing a good goal is the hardest part. “Create with AI” solves it with two questions anyone can answer.',
    } as L,
  },

  impact: {
    lead: {
      es: 'El rediseño todavía no está en producción. Estas son las mejoras que esperamos ver en las empresas: cifras de referencia, no medidas.',
      en: 'The redesign isn’t in production yet. These are the improvements we expect companies to see: reference figures, not measurements.',
    } as L,
    built: [
      { value: '926', label: { es: 'casos de uso, cada uno con su subtarea en Jira', en: 'use cases, each with its Jira subtask' } },
      { value: '80', label: { es: 'funcionalidades repartidas por trimestre', en: 'features split by quarter' } },
      { value: '7', label: { es: 'pestañas de resultados', en: 'results tabs' } },
      { value: '5', label: { es: 'pasos del constructor de ciclos', en: 'cycle-builder steps' } },
    ] as readonly Fact[],
    reference: [
      { value: 18, prefix: '+', suffix: ' %', label: { es: 'Proactividad', en: 'Proactivity' }, detail: { es: 'personas que reportan sin que nadie se lo recuerde', en: 'people who report without being reminded' } },
      { value: 15, prefix: '+', suffix: ' pts', label: { es: 'Foco', en: 'Focus' }, detail: { es: 'peso de los objetivos alineado a la estrategia', en: 'goal weight aligned to strategy' } },
      { value: 12, prefix: '+', suffix: ' %', label: { es: 'Crecimiento', en: 'Growth' }, detail: { es: 'objetivos de empresa que cierran en meta', en: 'company goals that close on target' } },
      { value: 30, prefix: '−', suffix: ' %', label: { es: 'Agilidad', en: 'Speed' }, detail: { es: 'tiempo para lanzar un ciclo', en: 'time to launch a cycle' } },
    ] as readonly { value: number; prefix: string; suffix: string; label: L; detail: L }[],
    learnings: [
      { es: 'Escribir las reglas al lado del código —con fecha y por qué— hizo que las decisiones sobrevivieran a cada iteración.', en: 'Writing rules next to the code —with date and reason— made decisions survive every iteration.' },
      { es: 'Un caso de uso que abre la pantalla exacta (?caso=) vale más que diez capturas en un documento.', en: 'A use case that opens the exact screen (?caso=) is worth more than ten screenshots in a doc.' },
      { es: 'Decir qué no existe todavía («nada que finja») evitó prometer pantallas que nadie iba a construir.', en: 'Stating what doesn’t exist yet (“nothing that pretends”) avoided promising screens nobody would build.' },
    ] as readonly L[],
  },

  demo: {
    lead: {
      es: 'El módulo real y en vivo, solo Objetivos: crea un ciclo o abre los resultados de uno.',
      en: 'The real, live module, Goals only: create a cycle or open one’s results.',
    } as L,
  },
} as const
