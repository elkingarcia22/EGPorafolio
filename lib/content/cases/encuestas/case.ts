import type { L } from '@/lib/i18n'
import type { Fact, Finding, Iteration, Shot, Station, Titled } from './types'

const DIR = '/cases/encuestas'

/** Capturas reales del rediseño, tomadas del playground corriendo en local (1440 × 900, sin el menú lateral). */
const shot = (name: string, width: number, alt: L): Shot => ({ src: `${DIR}/${name}.webp`, width, height: 900, alt })

export const SHOTS = {
  lista: shot('lista', 1152, { es: 'Inicio de Encuestas: atajos para crear, «Para atender» y la lista', en: 'Surveys home: create shortcuts, “To address” and the list' }),
  plantillas: shot('plantillas', 1152, { es: 'Catálogo de plantillas: organizacionales y NOM 035', en: 'Template catalog: organizational and NOM 035' }),
  crear: shot('crear', 1403, { es: 'Crear encuesta, paso 1 en blanco, con los demás pasos bloqueados', en: 'Create survey, blank step 1, the rest locked' }),
  general: shot('general', 1403, { es: 'Datos generales con visibilidad anónima y mínimo por grupo', en: 'General data with anonymous visibility and group minimum' }),
  participantes: shot('participantes', 1403, { es: 'Participantes: toda la empresa por defecto', en: 'Participants: whole company by default' }),
  demograficos: shot('demograficos', 1403, { es: 'Datos demográficos: del sistema, guardados o creados para esta encuesta', en: 'Demographics: from the system, saved or created for this survey' }),
  secciones: shot('secciones', 1403, { es: 'Secciones y subsecciones con el resumen vivo a la derecha', en: 'Sections and subsections with the live summary on the right' }),
  banco: shot('banco', 1403, { es: 'Banco de preguntas por tipo y por sección', en: 'Question bank by type and section' }),
  bienvenida: shot('bienvenida', 1403, { es: 'Bienvenida y cierre, editados a la vez', en: 'Welcome and closing, edited together' }),
  previewBienvenida: shot('preview-bienvenida', 1440, { es: 'Vista previa: la bienvenida que ve el colaborador', en: 'Preview: the welcome the employee sees' }),
  previewPreguntas: shot('preview-preguntas', 1440, { es: 'Vista previa: una página por subsección, con el avance a la derecha', en: 'Preview: one page per subsection, progress on the right' }),
  previewFinal: shot('preview-final', 1440, { es: 'Vista previa: la última página antes de enviar', en: 'Preview: the last page before sending' }),
  cargarAnaliza: shot('cargar-analiza', 1152, { es: 'Carga histórica: analizando el archivo', en: 'Historical upload: analyzing the file' }),
  cargarDatos: shot('cargar-datos', 1152, { es: 'Carga histórica: datos generales detectados', en: 'Historical upload: detected general data' }),
  cargarEstructura: shot('cargar-estructura', 1152, { es: 'Carga histórica: indicadores y match de participantes', en: 'Historical upload: indicators and participant match' }),
  participacion: shot('res-participacion', 1403, { es: 'Resultados: participación por colaborador', en: 'Results: participation by employee' }),
  favorabilidad: shot('res-favorabilidad', 1403, { es: 'Resultados: favorabilidad por secciones', en: 'Results: favorability by section' }),
  heatmap: shot('res-heatmap', 1403, { es: 'Resultados: mapa de calor con grupos reservados', en: 'Results: heatmap with reserved groups' }),
  personas: shot('res-personas', 1403, { es: 'Resultados: respuestas por persona', en: 'Results: answers by person' }),
  comentarios: shot('res-comentarios', 1403, { es: 'Resultados: comentarios con sentimiento y tema', en: 'Results: comments with sentiment and topic' }),
  enps: shot('res-enps', 1403, { es: 'Resultados: eNPS por secciones', en: 'Results: eNPS by section' }),
  ia: shot('res-ia', 1403, { es: 'Resultados: análisis con IA, cada lectura con su confiabilidad', en: 'Results: AI analysis, each reading with its confidence' }),
  accionables: shot('res-accionables', 1403, { es: 'Resultados: accionables que salen de la medición', en: 'Results: actions derived from the measurement' }),
  descargas: shot('res-descargas', 1440, { es: 'Reportes de resultados: cinco formatos', en: 'Result reports: five formats' }),
  comparativo: shot('comparativo', 1403, { es: 'Comparativo entre mediciones', en: 'Comparison across measurements' }),
} as const

export type ShotKey = keyof typeof SHOTS

export const ENCUESTAS_CASE = {
  title: { es: 'Encuestas que crean accionables', en: 'Surveys that create actions' } satisfies L,
  eyebrow: { es: 'UBITS · Desempeño y cultura', en: 'UBITS · Performance & culture' } satisfies L,
  headline: { es: 'De preguntar a entender.', en: 'From asking to understanding.' } satisfies L,
  lead: {
    es: 'Rediseño del producto completo de encuestas de clima, cultura, eNPS y NOM 035: crearlas, ordenarlas en secciones, traer las que se hicieron por fuera, responderlas y convertir los resultados en acciones, sin romper la promesa de anonimato.',
    en: 'Redesign of the whole climate, culture, eNPS and NOM 035 survey product: create them, organize them in sections, bring in the ones run elsewhere, answer them and turn results into actions, without breaking the anonymity promise.',
  } satisfies L,
  meta: [
    { label: { es: 'Rol', en: 'Role' }, value: { es: 'Diseño de producto end-to-end', en: 'End-to-end product design' } },
    { label: { es: 'Alcance', en: 'Scope' }, value: { es: '99 funcionalidades · 6 superficies', en: '99 features · 6 surfaces' } },
    { label: { es: 'Periodo', en: 'Period' }, value: { es: 'May – nov 2026', en: 'May – Nov 2026' } },
    { label: { es: 'Herramientas', en: 'Tools' }, value: { es: 'React, Flux UI, Claude Code', en: 'React, Flux UI, Claude Code' } },
  ] satisfies readonly { label: L; value: L }[],

  /* 01 · Los puntos */
  dots: {
    kicker: { es: 'Una encuesta no termina cuando se cierra: termina cuando alguien hace algo con ella.', en: 'A survey doesn’t end when it closes: it ends when someone acts on it.' } satisfies L,
    lead: {
      es: 'En la plataforma de hoy una encuesta se crea en blanco o con plantilla. La cuenta de administración que recorrimos tenía 83 en una sola lista, no había forma de traer las mediciones que la empresa ya había hecho en otras herramientas y responder una encuesta ni siquiera tenía historia de usuario. El rediseño tenía que cubrir el ciclo entero, no una pantalla.',
      en: 'On today’s platform a survey is created blank or from a template. The admin account we walked through had 83 in a single list, there was no way to bring in measurements run in other tools and answering a survey didn’t even have a user story. The redesign had to cover the whole cycle, not one screen.',
    } satisfies L,
    stations: [
      { id: 'crear', name: { es: 'Crear', en: 'Create' }, who: { es: 'Admin de RR. HH.', en: 'HR admin' }, before: { es: 'Dos puertas, en blanco o con plantilla. Guiar el orden sin volverlo un trámite.', en: 'Two doors, blank or template. Guide the order without turning it into paperwork.' }, after: { es: 'Cinco pasos con candado real y un resumen vivo.', en: 'Five steps with a real lock and a live summary.' } },
      { id: 'estructurar', name: { es: 'Estructurar', en: 'Structure' }, who: { es: 'Admin de RR. HH.', en: 'HR admin' }, before: { es: 'Un clima de 54 preguntas y 7 dimensiones necesita jerarquía, no una lista.', en: 'A 54-question, 7-dimension climate survey needs hierarchy, not a list.' }, after: { es: 'Secciones, subsecciones y sub-subsecciones con numeración automática.', en: 'Sections, subsections and sub-subsections, auto-numbered.' } },
      { id: 'historico', name: { es: 'Traer el histórico', en: 'Bring history' }, who: { es: 'Consultor de implementación', en: 'Implementation consultant' }, before: { es: 'No había importación: la historia de cada cliente se quedaba fuera, o había que reconstruirla a mano.', en: 'There was no import: each customer’s history stayed out, or had to be rebuilt by hand.' }, after: { es: 'Subir el archivo, confirmar lo detectado y cargarlo en segundo plano.', en: 'Upload the file, confirm what was detected, load it in the background.' } },
      { id: 'responder', name: { es: 'Responder', en: 'Answer' }, who: { es: 'Colaborador', en: 'Employee' }, before: { es: 'Sin historia de usuario: la experiencia de quien responde estaba por definir.', en: 'No user story: the respondent’s experience was undefined.' }, after: { es: 'Una página por tema, avance visible y la promesa de privacidad dicha al empezar.', en: 'One page per topic, visible progress and the privacy promise stated up front.' } },
      { id: 'leer', name: { es: 'Leer', en: 'Read' }, who: { es: 'RR. HH. y líderes', en: 'HR and leaders' }, before: { es: 'Un puntaje global no dice dónde actuar, y cortar por grupo puede señalar a alguien.', en: 'A global score doesn’t say where to act, and cutting by group can single someone out.' }, after: { es: 'Seis pestañas, cada una responde una pregunta distinta.', en: 'Six tabs, each answering a different question.' } },
      { id: 'actuar', name: { es: 'Actuar', en: 'Act' }, who: { es: 'Líderes', en: 'Leaders' }, before: { es: 'Que la medición termine en una decisión con dueño, no en un archivo.', en: 'Make the measurement end in a decision with an owner, not a file.' }, after: { es: 'Accionables con dueño, plazo y recordatorio, conectados a otros módulos.', en: 'Actions with owner, deadline and reminder, linked to other modules.' } },
    ] satisfies readonly Station[],
    facts: [
      { value: '83', label: { es: 'encuestas en una sola lista, en la cuenta real que recorrimos', en: 'surveys in a single list, in the real account we audited' } },
      { value: '0', label: { es: 'formas de traer mediciones hechas en otras herramientas', en: 'ways to bring in measurements from other tools' } },
      { value: '0', label: { es: 'historias de usuario para «responder una encuesta»', en: 'user stories for “answer a survey”' } },
      { value: '2', label: { es: 'formas de crear: en blanco o con plantilla', en: 'ways to create: blank or template' } },
    ] satisfies readonly Fact[],
  },

  /* 02 · Patrones */
  patterns: {
    lead: {
      es: 'No hubo entrevistas formales: los patrones salen de recorrer la plataforma actual con una cuenta de administración, de las reuniones con el equipo y de criticar nuestros propios prototipos con la misma vara. Los agrupé por la parte del producto donde aparecen.',
      en: 'There were no formal interviews: the patterns come from walking the current platform with an admin account, from team meetings and from critiquing our own prototypes with the same yardstick. I grouped them by the part of the product where they show up.',
    } satisfies L,
    findings: [
      { area: 'lista', text: { es: '83 encuestas en una lista con filtros por estado y tipo, pero nada que diga cuál necesita atención hoy.', en: '83 surveys in a list with status and type filters, but nothing saying which needs attention today.' } },
      { area: 'lista', text: { es: 'En un prototipo, la tarjeta «por cerrar» y el filtro de la tabla contaban cosas distintas: enseñaba a desconfiar de las dos.', en: 'In a prototype, the “closing soon” card and the table filter disagreed: it taught people to distrust both.' } },
      { area: 'constructor', text: { es: 'Con el contenido primero, elegir participantes al final se volvía un trámite.', en: 'With content first, picking participants at the end became a formality.' } },
      { area: 'constructor', text: { es: 'Encuestas no tenía historias de usuario: el diseño también tenía que escribir la especificación.', en: 'Surveys had no user stories: design also had to write the spec.' } },
      { area: 'carga', text: { es: 'Los archivos por gerencia se trataban como encuestas distintas cuando eran cortes del mismo ciclo.', en: 'Per-department files were treated as separate surveys when they were cuts of the same cycle.' } },
      { area: 'carga', text: { es: 'Un archivo con 718 columnas terminaba en «0 preguntas» sin explicar por qué.', en: 'A 718-column file ended in “0 questions” with no explanation.' } },
      { area: 'resultados', text: { es: 'El puntaje global no dice dónde actuar: sin el mapa por secciones, el corte por grupo es adivinar.', en: 'The global score doesn’t say where to act: without the section map, cutting by group is guessing.' } },
      { area: 'resultados', text: { es: 'Una pregunta abierta no puede tomar prestada una barra de 1 a 5: el mapa señalaría el problema equivocado.', en: 'An open question can’t borrow a 1–5 bar: the map would point at the wrong problem.' } },
      { area: 'privacidad', text: { es: 'La descarga era la única puerta que ignoraba el mínimo de respuestas por grupo.', en: 'Downloads were the only door that ignored the minimum responses per group.' } },
      { area: 'privacidad', text: { es: 'Un demográfico identifica igual que un nombre: «Marketing, Colombia, 18–24, mujer» puede ser una sola persona.', en: 'A demographic identifies just like a name: “Marketing, Colombia, 18–24, woman” can be one person.' } },
    ] satisfies readonly Finding[],
    insights: [
      { es: 'La privacidad no es un ajuste: es una regla que tiene que viajar a cada pantalla, cada filtro y cada archivo.', en: 'Privacy isn’t a setting: it’s a rule that must travel to every screen, filter and file.' },
      { es: 'Cada vista de resultados tiene que responder una sola pregunta; si responde todas, no responde ninguna.', en: 'Each results view must answer one question; if it answers all, it answers none.' },
      { es: 'El histórico no es una migración: es la línea base sin la cual la primera medición no se puede comparar con nada.', en: 'History isn’t a migration: it’s the baseline without which the first measurement can’t be compared to anything.' },
    ] satisfies readonly L[],
  },

  /* 03 · La idea */
  idea: {
    hmw: { es: '¿Cómo podríamos darle a cada empresa un solo constructor que sirva igual para un pulso de cinco preguntas, un clima de cincuenta y la norma de su país, sin que nadie tema contestar con honestidad?', en: 'How might we give every company a single builder that works just as well for a five-question pulse, a fifty-question climate survey and its country’s regulation, without anyone fearing to answer honestly?' } satisfies L,
    axis: {
      title: { es: 'El eje: tan personalizable que cabe cualquier caso de uso', en: 'The axis: customizable enough to fit any use case' } satisfies L,
      body: {
        es: 'La idea central fue no hacer una encuesta para cada caso, sino un modelo que se adapta: secciones de hasta tres niveles, tipos de pregunta, visibilidad, participantes y reglas que se encienden según lo que se mide. Con eso la misma pieza arma desde una encuesta sencilla hasta una robusta, e incluso una normativa como la NOM 035 de México, sin construir un módulo aparte. Eso fue lo que más nos apalancó: cada plantilla nueva es contenido y reglas, no pantallas nuevas.',
        en: 'The core idea was not to build a survey per use case but a model that adapts: sections up to three levels deep, question types, visibility, participants and rules that switch on depending on what is measured. That lets the same piece build anything from a simple survey to a robust one, even a regulatory one like Mexico’s NOM 035, without a separate module. That was our biggest lever: each new template is content and rules, not new screens.',
      } satisfies L,
    },
    principles: [
      { title: { es: 'Anónima o pública, sin término medio', en: 'Anonymous or public, nothing in between' }, body: { es: 'O el sistema guarda el vínculo entre persona y respuesta, o no lo guarda. Un punto intermedio sería una promesa imposible de cumplir.', en: 'Either the system keeps the person–answer link or it doesn’t. A middle ground would be a promise it can’t keep.' } },
      { title: { es: 'A quién antes que qué', en: 'Who before what' }, body: { es: 'Participantes va antes que el contenido: decidir a quién se le pregunta cambia qué vale la pena preguntar.', en: 'Participants come before content: who you ask changes what’s worth asking.' } },
      { title: { es: 'Lo que no aplica, no está', en: 'What doesn’t apply isn’t there' }, body: { es: 'Cada estado ofrece solo lo que se puede hacer honestamente con él. No hay botones apagados esperando.', en: 'Each state offers only what can honestly be done with it. No disabled buttons waiting around.' } },
      { title: { es: 'La IA propone, la persona decide', en: 'AI proposes, people decide' }, body: { es: 'La IA lee archivos, redacta y resume; nunca confirma una carga, ni inventa participantes, ni esconde de dónde sale una cifra.', en: 'AI reads files, drafts and summarizes; it never confirms an upload, invents participants or hides where a number comes from.' } },
    ] satisfies readonly Titled[],
  },

  /* 04 · Bocetos: cuatro iteraciones */
  iterations: [
    { id: 'v1', name: 'Carga histórica · V1', when: { es: 'may – jul 2026 · 383 commits', en: 'May – Jul 2026 · 383 commits' }, shape: 'chat', tried: { es: 'Un asistente de importación en chat: una decisión por turno, a la izquierda la conversación y a la derecha la estructura detectada.', en: 'A chat import assistant: one decision per turn, conversation on the left and detected structure on the right.' }, dropped: { es: 'La puerta «Continuar análisis local», que parecía pedir permiso de más, y las acciones genéricas como «Resolver ahora». El chat alargaba decisiones obvias.', en: 'The “Continue local analysis” gate, which seemed to ask permission needlessly, and generic actions like “Resolve now”. Chat dragged out obvious decisions.' }, kept: { es: 'El parser es la verdad y la IA interpreta. Cada decisión dice qué se detectó, por qué importa y qué pasa con cada opción.', en: 'The parser is the truth and AI interprets. Each decision says what was detected, why it matters and what each option does.' } },
    { id: 'v2', name: 'Carga histórica · V2', when: { es: 'jul 2026 · reinicio', en: 'Jul 2026 · restart' }, shape: 'drawer', tried: { es: 'Un panel lateral de tres pasos: archivos, datos generales y estructura, con un lector real de Excel.', en: 'A three-step side panel: files, general data and structure, with a real Excel reader.' }, dropped: { es: 'Inferir el tipo de encuesta por el nombre del archivo: clasificaba mal y luego se comparaba con lo que no era.', en: 'Inferring the survey type from the filename: it misclassified and then got compared with the wrong surveys.' }, kept: { es: 'La visibilidad no se elige, se deriva: solo es pública si el archivo trae una fila por persona.', en: 'Visibility isn’t chosen, it’s derived: public only if the file has one row per person.' } },
    { id: 'v3', name: 'Secciones y subsecciones', when: { es: 'ago – sep 2026 · 51 commits', en: 'Aug – Sep 2026 · 51 commits' }, shape: 'tree', tried: { es: 'El producto entero en un prototipo: constructor con árbol de tres niveles, vista previa, resultados, descargas y comparativo.', en: 'The whole product in one prototype: builder with a three-level tree, preview, results, downloads and comparison.' }, dropped: { es: 'Arrastrar entre ramas: un mal soltado cambiaría de padre por accidente. Arrastrar solo reordena hermanas; cambiar de rama es «Mover a…», con solo destinos válidos.', en: 'Dragging across branches: a bad drop would reparent by accident. Dragging only reorders siblings; changing branch is “Move to…”, with valid targets only.' }, kept: { es: 'La numeración se calcula sola y el mismo borrador alimenta la vista previa, los resultados y los archivos.', en: 'Numbering computes itself and the same draft feeds preview, results and files.' } },
    { id: 'v4', name: 'Flux UI · plataforma', when: { es: 'sep – nov 2026 · 127 commits', en: 'Sep – Nov 2026 · 127 commits' }, shape: 'system', tried: { es: 'Llevar todo al sistema de diseño de la empresa, dentro de la plataforma nueva, con rutas reales y alcance por trimestre.', en: 'Bring it all to the company design system, inside the new platform, with real routes and quarterly scope.' }, dropped: { es: 'La matriz Likert como tabla: cada enunciado con su escala completa se lee y se contesta mejor en su propia tarjeta.', en: 'The Likert matrix as a table: each statement with its full scale reads and answers better in its own card.' }, kept: { es: '99 funcionalidades con fecha de llegada y 487 casos de uso, cada uno con su subtarea.', en: '99 features with a delivery date and 487 use cases, each with its subtask.' } },
  ] satisfies readonly Iteration[],

  /* 07 · Impacto */
  impact: {
    lead: {
      es: 'El módulo está maquetado y en revisión con el equipo de desarrollo; todavía no corre con clientes. Lo que sí se puede contar es el alcance cerrado y verificable, y unas metas modestas para medir cuando salga.',
      en: 'The module is built as a prototype and under review with engineering; it doesn’t run with customers yet. What can be told is the closed, verifiable scope, plus modest goals to measure once it ships.',
    } satisfies L,
    scope: [
      { value: '99', label: { es: 'funcionalidades con fecha: 74 en Q4 2026, 24 en Q1 2027 y 1 en backlog', en: 'features with a date: 74 in Q4 2026, 24 in Q1 2027, 1 in backlog' } },
      { value: '487', label: { es: 'casos de uso documentados, cada uno con su subtarea', en: 'documented use cases, each with its subtask' } },
      { value: '4', label: { es: 'iteraciones del producto, del chat al sistema de diseño', en: 'product iterations, from chat to design system' } },
      { value: '25', label: { es: 'pantallas reales en este caso, todas del playground', en: 'real screens in this case, all from the playground' } },
    ] satisfies readonly Fact[],
    goals: [
      { value: '−30 %', label: { es: 'tiempo para armar una encuesta de clima desde plantilla', en: 'time to build a climate survey from a template' }, reference: true },
      { value: '+5 pp', label: { es: 'participación con recordatorios por grupo en vez de a toda la empresa', en: 'participation with per-group reminders instead of company-wide' }, reference: true },
      { value: '1 día', label: { es: 'para tener la línea base histórica de un cliente nuevo', en: 'to get a new customer’s historical baseline' }, reference: true },
      { value: '0', label: { es: 'descargas que muestren un grupo por debajo del mínimo', en: 'downloads exposing a group below the minimum' } },
    ] satisfies readonly Fact[],
    learnings: [
      { es: 'Escribir la regla antes que la pantalla: «el mínimo no baja de 3» ahorró discusiones en diez lugares distintos.', en: 'Write the rule before the screen: “the minimum never goes below 3” saved arguments in ten places.' },
      { es: 'Un prototipo que se usa como especificación tiene que ser determinista: los mismos datos, los mismos números, siempre.', en: 'A prototype used as a spec must be deterministic: same data, same numbers, always.' },
      { es: 'La IA rinde más en el proceso que en la pantalla: documentar, auditar y generar casos de uso fue donde más tiempo devolvió.', en: 'AI pays off more in the process than on screen: documenting, auditing and generating use cases is where it gave back most time.' },
    ] satisfies readonly L[],
  },
} as const
