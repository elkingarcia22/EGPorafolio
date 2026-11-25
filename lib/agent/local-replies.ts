import type { L } from '@/lib/i18n'
import { PROFILE } from '@/lib/content/profile'

/*
 * Respuestas del agente cuando no hay modelo (sin clave, sin créditos o con error). Escritas a mano,
 * en primera persona y solo con datos del portafolio. Cada tema responde la pregunta y cierra con un
 * ejemplo concreto de un caso; tiene una versión más profunda para «¿y eso cómo?».
 * Todas las cifras de impacto de los casos son de referencia y así se dice.
 */

export interface Topic {
  id: string
  /** Palabras que lo activan, sin tildes. Una palabra suelta tolera un error de tipeo. */
  keys: readonly string[]
  /** Peso de cada coincidencia: los saludos pesan poco para no tapar la pregunta real. */
  weight?: number
  replies: readonly L[]
  deep?: L
  /** Una frase para cuando el tema llega como parte de una pregunta compuesta («…y qué herramientas usas»). */
  short?: L
  /** Marcas para la interfaz: casos, contacto, hoja de vida y preguntas siguientes. */
  extras?: L
}

const s = (es: string, en: string): L => ({ es, en })
const sug = (es: string, en: string) => s(`[[sugerencia:${es}]]`, `[[sugerencia:${en}]]`)
const join = (...parts: L[]): L => s(parts.map((p) => p.es).join('\n'), parts.map((p) => p.en).join('\n'))
const CASE = (slug: string) => s(`[[caso:${slug}]]`, `[[caso:${slug}]]`)

export const TOPICS: readonly Topic[] = [
  /* ── Cómo trabajo ─────────────────────────────────────────────────── */
  {
    id: 'vibe',
    weight: 2,
    keys: ['vibe coding', 'vibe', 'codigo', 'programas', 'programar', 'construyes', 'construir', 'cursor', 'claude code', 'build', 'coding', 'code', 'eres desarrollador', 'desarrollador o', 'full stack', 'fullstack'],
    short: s('Y cuando hace falta, lo construyo yo mismo: React y TypeScript con shadcn, Supabase como base de datos y despliegue en Vercel.', 'And when needed, I build it myself: React and TypeScript with shadcn, Supabase as the database and deploys on Vercel.'),
    replies: [
      s('Diseño y también construyo, de punta a punta. Con Claude Code y Cursor armo el frontend —lo que la persona ve y toca— en React con TypeScript, Tailwind y componentes de shadcn sobre Radix. Lo conecto a una base de datos en Supabase, que es donde viven los datos y las reglas de quién puede ver qué, y lo publico en Vercel, que lo pone en internet con una URL de prueba para cada cambio. El código vive en GitHub, con ramas y commits pequeños que cuentan qué cambió y por qué.\n\nPor ejemplo, este portafolio está hecho así: Next.js, los proyectos guardados en Supabase, animaciones con GSAP y desplegado en Vercel; y este mismo agente es una ruta en el servidor que habla con Claude.', 'I design and I also build, end to end. With Claude Code and Cursor I build the frontend —what people see and touch— in React with TypeScript, Tailwind and shadcn components on Radix. I connect it to a Supabase database, which is where the data and the rules about who can see what live, and I publish it on Vercel, which puts it online with a preview URL for every change. The code lives on GitHub, with branches and small commits that say what changed and why.\n\nFor example, this portfolio is built that way: Next.js, projects stored in Supabase, animations with GSAP and deployed on Vercel; and this very agent is a server route that talks to Claude.'),
      s('Lo que más cambió en mi forma de trabajar es que ya no entrego solo diseños: entrego software que se puede usar. La IA escribe mucho del código, pero yo decido la arquitectura —qué va en el navegador y qué en el servidor—, reviso cada cambio y escribo las reglas que tiene que respetar.\n\nPor ejemplo, en Barberlytics el producto es React + Vite con TypeScript, la reserva funciona con datos simulados (MSW) para que la demo pública nunca toque datos reales, y todo se despliega en Vercel.', 'What changed my work the most is that I no longer hand over designs only: I hand over software people can use. AI writes a lot of the code, but I decide the architecture —what runs in the browser and what on the server—, review every change and write the rules it has to respect.\n\nFor example, in Barberlytics the product is React + Vite with TypeScript, booking runs on simulated data (MSW) so the public demo never touches real data, and everything deploys on Vercel.'),
    ],
    deep: s('Mi método con la IA: primero el contexto —un archivo con las reglas del proyecto, el sistema de diseño y qué no se puede hacer—, después tareas pequeñas que pruebo en el navegador, y validaciones automáticas que fallan si algo se sale de la línea. En Thema eso es «npm run check»: frena librerías ajenas, colores o tamaños escritos a mano y un catálogo desactualizado. Así la IA acelera sin que el producto se desordene.', 'My method with AI: first the context —a file with the project rules, the design system and what isn’t allowed—, then small tasks I test in the browser, and automatic checks that fail if anything goes off-line. In Thema that’s “npm run check”: it stops foreign libraries, hand-set colors or sizes and a stale catalog. That way AI speeds things up without the product getting messy.'),
    extras: join(CASE('barberlytics'), sug('¿Cómo conectas la base de datos?', 'How do you connect the database?')),
  },
  {
    id: 'process',
    short: s('Sobre mi proceso: voy de puntos sueltos a conexiones en seis etapas, de escuchar el problema a medir su impacto.', 'On my process: I go from loose dots to connections in six stages, from listening to the problem to measuring its impact.'),
    keys: ['por donde empiezas', 'empiezas', 'arrancas', 'proceso', 'metodologia', 'metodo', 'como trabajas', 'como abordas', 'como empiezas', 'pasos', 'process', 'approach', 'workflow'],
    replies: [
      s('Mi proceso sigue la lógica del Double Diamond —primero divergir para entender el problema, después converger en una solución—, contado en seis etapas: los puntos (desk research, datos y voz del usuario), patrones (síntesis en un mapa de afinidad hasta los insights), la idea (un «¿cómo podríamos…?» y principios de diseño), forma (user flows, wireframes, UI de alta fidelidad y sistema de diseño), IA en el proceso e impacto (métricas).\n\nPor ejemplo, en Barberlytics el insight fue que una barbería vive de lo que se repite, y el HMW quedó así: ¿cómo hacer que reservar «lo de siempre» tome un toque?', 'My process follows the Double Diamond logic —diverge first to understand the problem, then converge on a solution—, told in six stages: the dots (desk research, data and the voice of the user), patterns (synthesis in an affinity map down to insights), the idea (a “how might we…?” and design principles), form (user flows, wireframes, high-fidelity UI and the design system), AI in the process and impact (metrics).\n\nFor example, in Barberlytics the insight was that a barbershop lives on what repeats, and the HMW became: how do we make booking “the usual” take one tap?'),
    ],
    deep: s('Lo que más cuido es el paso de patrones a idea: sin una pregunta clara, los bocetos se dispersan. En Objetivos la pregunta fue cómo adaptar el producto a la forma en que cada empresa trabaja sus objetivos, y de ahí salieron cuatro principios que decidieron todo lo demás.', 'What I care about most is going from patterns to the idea: without a clear question, sketches scatter. In Goals the question was how to adapt the product to the way each company works its goals, and that produced four principles that decided everything else.'),
    extras: join(CASE('objetivos'), sug('¿Cómo bocetas?', 'How do you sketch?')),
  },
  {
    id: 'research',
    short: s('Antes investigo: entrevistas cuando se puede, datos de uso, soporte, reseñas y comparación de productos.', 'Before that I research: interviews when possible, usage data, support, reviews and product comparisons.'),
    keys: ['metodos de investigacion', 'research methods', 'sintetizas', 'sintesis', 'synthesis', 'hallazgos', 'findings', 'desk research', 'triangulas', 'triangulacion', 'investigacion', 'investigas', 'research', 'entrevistas', 'interviews', 'usuarios', 'users', 'descubrimiento', 'discovery', 'insights', 'empatia'],
    replies: [
      s('Combino métodos según lo que hay disponible y lo declaro: desk research (reseñas públicas, centros de ayuda, tickets de soporte), análisis de uso, observación y entrevistas cuando se puede. Luego triangulo —cruzo fuentes— para separar lo que la gente dice de lo que hace, y sintetizo en un mapa de afinidad hasta llegar a insights accionables.\n\nPor ejemplo, en el calendario de Barberlytics crucé dos fuentes: un benchmark de 22 calendarios y la voz del usuario en reseñas. El dolor que más se repetía era «demasiados clics», y eso definió que el siguiente paso viviera en la tarjeta.', 'I combine methods based on what’s available and I say so: desk research (public reviews, help centers, support tickets), usage analysis, observation and interviews when possible. Then I triangulate —cross sources— to separate what people say from what they do, and synthesize in an affinity map down to actionable insights.\n\nFor example, for the Barberlytics calendar I crossed two sources: a benchmark of 22 calendars and the voice of the user in reviews. The most repeated pain was “too many clicks”, which is why the next step lives on the card.'),
    ],
    deep: s('Cuando no hay entrevistas propias, no las invento: lo aclaro y uso la voz disponible. En el calendario lo dejé escrito en el caso: «No hubo entrevistas propias: esta es la voz disponible».', 'When there are no first-hand interviews, I don’t fake them: I say so and use the voice available. In the calendar case I wrote it down: “There were no first-hand interviews: this is the voice available”.'),
    extras: join(CASE('barberlytics'), sug('¿Cómo haces un benchmark?', 'How do you benchmark?')),
  },
  {
    id: 'benchmark',
    keys: ['analisis competitivo', 'competitive analysis', 'competitivo', 'benchmark', 'competencia', 'competidores', 'competitors', 'comparar', 'compare', 'referentes', 'mercado', 'market'],
    replies: [
      s('Hago análisis competitivo con criterio, no por inspiración: una matriz de funciones contra los productos del sector, marcando lo que no pude confirmar, y una lectura de su voz del usuario. Después agrupo los hallazgos en un mapa de afinidad con cuatro columnas: fortalezas propias, lo estándar que falta, lo que vale la pena copiar y los riesgos.\n\nPor ejemplo, para la reserva de Barberlytics comparé 15 productos (Booksy, Fresha, Squire, theCut, Vagaro…) y de ahí salieron patrones como la cita recurrente y «lo antes posible»; para el calendario, una matriz de 15 funciones contra 8 productos.', 'I do competitive analysis with criteria, not for inspiration: a feature matrix against industry products, flagging what I couldn’t confirm, and a read of their voice of the user. Then I group findings in an affinity map with four columns: own strengths, missing standards, what’s worth copying and risks.\n\nFor example, for Barberlytics booking I compared 15 products (Booksy, Fresha, Squire, theCut, Vagaro…) and that surfaced patterns like recurring appointments and “as soon as possible”; for the calendar, a matrix of 15 functions against 8 products.'),
    ],
    extras: CASE('barberlytics'),
  },
  {
    id: 'sketch',
    short: s('Sobre bocetos: siempre empiezo en tableros a mano —el flujo, las variantes y lo que no puede pasar— antes de cualquier pantalla.', 'On sketches: I always start on hand-drawn boards —the flow, the variants and what must not happen— before any screen.'),
    keys: ['boceto', 'bocetos', 'bocetas', 'bocetar', 'bocetacion', 'sketch', 'sketches', 'wireframe', 'wireframes', 'flujo', 'flujos', 'flow', 'ideacion', 'ideas', 'variantes', 'versiones'],
    replies: [
      s('En la etapa de ideación divergo rápido y barato: user flows en tableros a mano, wireframes de baja fidelidad y varias alternativas lado a lado, incluidos los casos de borde —qué pasa si algo falla, si no hay datos, si el usuario vuelve—. Después convergo con los principios de diseño como filtro.\n\nPor ejemplo, en la reserva de Barberlytics mapeé el flujo completo —dónde se separan quien vuelve y quien llega, dónde se pide el código— y bocetamos cuatro versiones sobre un mismo motor; «según el cliente» quedó por defecto.', 'In ideation I diverge fast and cheap: user flows on hand-drawn boards, low-fidelity wireframes and several alternatives side by side, including edge cases —what if something fails, if there’s no data, if the user comes back—. Then I converge using the design principles as a filter.\n\nFor example, in Barberlytics booking I mapped the whole flow —where returning and new clients split, where the code is asked— and we sketched four versions on one engine; “by client” became the default.'),
    ],
    deep: s('También boceto lo que no se ve: cómo responde la IA. En Clipper boceté la anatomía de una respuesta —corta, con su fuente a la vista y con los cambios como propuestas— antes de tocar el modelo, y la construcción del orbe paso a paso.', 'I also sketch what you can’t see: how the AI answers. In Clipper I sketched the anatomy of an answer —short, with its source in view and changes as proposals— before touching the model, and the orb’s construction step by step.'),
    extras: join(CASE('barberlytics'), sug('¿Cómo prototipas?', 'How do you prototype?')),
  },
  {
    id: 'prototype',
    short: s('Después lo prototipo al nivel que la pregunta necesita: papel, Figma o código.', 'Then I prototype it at the level the question needs: paper, Figma or code.'),
    keys: ['prototipo', 'prototipos', 'prototipas', 'prototype', 'prototyping', 'figma make', 'mvp'],
    replies: [
      s('Prototipo en el nivel que la pregunta necesita: papel si es de flujo, Figma si es de forma y código si es de comportamiento o de datos reales. Cada vez más voy directo a código con IA: un prototipo en React con datos simulados se siente como el producto, se comparte con un link de Vercel y deja ver problemas que en Figma no aparecen, como tiempos de carga o estados vacíos.\n\nPor ejemplo, la demo de la reserva de Barberlytics es la reserva real funcionando con datos de prueba, en celular, tablet, monitor y widget.', 'I prototype at the level the question needs: paper for flow, Figma for form and code for behavior or real data. More and more I go straight to code with AI: a React prototype with simulated data feels like the product, gets shared with a Vercel link and surfaces problems Figma hides, like loading times or empty states.\n\nFor example, the Barberlytics booking demo is the real booking running with test data, on phone, tablet, monitor and widget.'),
    ],
    extras: CASE('barberlytics'),
  },
  {
    id: 'testing',
    short: s('Y lo valido con un prototipo frente a la tarea real; si lleva IA, con evaluaciones.', 'And I validate it with a prototype against the real task; if it carries AI, with evaluations.'),
    keys: ['pruebas con usuarios', 'test con usuarios', 'prueba', 'pruebas', 'pruebas de usabilidad', 'usabilidad', 'usability', 'testing', 'validar', 'validacion', 'validate', 'test', 'a/b', 'experimento'],
    replies: [
      s('Valido en capas. Primero pruebas de usabilidad con un prototipo frente a la tarea real (dónde se traba la persona, cuánto tarda, qué no entiende). Si hay datos, defino antes la hipótesis y la métrica que la confirma. En código, pruebas end-to-end con Playwright —un navegador que recorre los flujos solo— para no romper lo que ya funcionaba. Y si el producto lleva IA, un set de evaluaciones con preguntas reales y una meta de acierto.\n\nPor ejemplo, Clipper tiene 60 preguntas de evaluación en tres variantes de idioma, con una meta del 90 % que todavía falta correr con la clave de producción.', 'I validate in layers. First usability tests with a prototype against the real task (where people get stuck, how long it takes, what they don’t get). If there’s data, I define the hypothesis and the metric that confirms it upfront. In code, end-to-end tests with Playwright —a browser that walks the flows on its own— so I don’t break what already worked. And if the product carries AI, an evaluation set with real questions and an accuracy target.\n\nFor example, Clipper has 60 evaluation questions in three language variants, with a 90% target still to be run with the production key.'),
    ],
    extras: CASE('barberlytics'),
  },
  {
    id: 'metrics',
    short: s('Y lo mido: defino antes la métrica de negocio que tiene que moverse y la señal que la confirma.', 'And I measure it: I define upfront the business metric that has to move and the signal that confirms it.'),
    keys: ['mides el impacto', 'medir el impacto', 'si funciono', 'diseno funciono', 'como sabes si', 'metrica', 'metricas', 'metrics', 'kpi', 'kpis', 'medir', 'mides', 'medicion', 'measure', 'indicadores', 'exito', 'success', 'resultados', 'outcome', 'outcomes', 'north star'],
    replies: [
      s('Empiezo por la métrica, no por la pantalla. Defino una métrica norte —la que mejor representa el valor para el usuario y el negocio— y debajo las métricas de producto (adopción, activación, retención) y de experiencia (tiempo en tarea, tasa de error, abandono). Escribo la hipótesis, la señal que la confirmaría y diseño para moverla.\n\nPor ejemplo, en Objetivos la métrica de avance en % castigaba a quien se ponía metas ambiciosas; cambiamos la métrica norte por la constancia de reportar, y eso cambió el diseño entero.', 'I start from the metric, not the screen. I define a north star metric —the one that best captures value for user and business— and below it product metrics (adoption, activation, retention) and experience metrics (time on task, error rate, drop-off). I write the hypothesis, the signal that would confirm it and design to move it.\n\nFor example, in Goals the % progress metric punished ambitious goals; we changed the north star to the habit of reporting, and that changed the whole design.'),
      s('Para mí un diseño está terminado cuando cambia un comportamiento que le importa al negocio. Por eso cada caso tiene su sección de impacto, y aclaro cuando las cifras son de referencia porque el rediseño aún no está en producción.\n\nPor ejemplo, en la reserva de Barberlytics la apuesta fue el tiempo para reservar «lo de siempre»: en el caso lo muestro bajando de 2 min 40 s a unos 35 s, como cifra de referencia.', 'To me a design is done when it changes a behavior the business cares about. That’s why every case has an impact section, and I say when figures are reference values because the redesign isn’t in production yet.\n\nFor example, in Barberlytics booking the bet was time to book “the usual”: in the case I show it dropping from 2 min 40 s to about 35 s, as a reference figure.'),
    ],
    deep: s('Divido las métricas en tres niveles: la de negocio (ingresos, retención), la de producto (adopción, uso de la función) y la de experiencia (tiempo, errores, abandono). El diseño mueve la tercera, que empuja la segunda, que explica la primera.', 'I split metrics into three levels: business (revenue, retention), product (adoption, feature usage) and experience (time, errors, drop-off). Design moves the third, which pushes the second, which explains the first.'),
    extras: join(CASE('objetivos'), sug('¿Cómo mides el ARR de un producto?', 'How do you measure a product’s ARR?')),
  },
  {
    id: 'revenue',
    weight: 1.5,
    keys: ['arr', 'aerr', 'mrr', 'ingresos', 'revenue', 'roi', 'ventas', 'pipeline', 'embudo', 'funnel', 'conversion', 'cac', 'ltv', 'retorno', 'dinero', 'negocio', 'business'],
    replies: [
      s('El ARR lo leo como el resultado de un embudo, no como un número suelto: cuántas oportunidades entran, qué tasa pasa a reunión, cuál cierra y cuánto vale cada contrato al año. El diseño mueve las tasas del medio, y ahí es donde mido.\n\nPor ejemplo, en SellUp armé un modelo de proyección: si la tasa de conexión sube de 18 % a 30 % con contactos mejor elegidos, con reunión al 20 %, cierre al 8 % y un contrato anual promedio de USD 12.000, se ve el ARR incremental del primer año y el ROI contra el costo de IA (unos USD 0,70 por empresa). Son cifras de referencia, para ver el orden de magnitud.', 'I read ARR as the output of a funnel, not a loose number: how many opportunities come in, what rate gets to a meeting, which close and how much each contract is worth per year. Design moves the middle rates, and that’s where I measure.\n\nFor example, in SellUp I built a projection model: if the connect rate rises from 18% to 30% with better-picked contacts, with 20% to meeting, 8% to close and an average annual contract of USD 12,000, you see first-year incremental ARR and ROI against AI cost (about USD 0.70 per company). These are reference figures, to see the order of magnitude.'),
    ],
    deep: s('En ese modelo también cuento lo que no es ingreso: 4,5 horas a la semana que cada vendedor deja de buscar a mano. Y le resto el costo real: IA por empresa y la plataforma al año. Un ROI sin costos no le sirve a nadie.', 'That model also counts what isn’t revenue: 4.5 hours a week each seller stops searching by hand. And I subtract real cost: AI per company and the platform per year. An ROI without costs helps nobody.'),
    extras: join(CASE('sellup'), sug('¿Cómo funcionan los agentes de SellUp?', 'How do SellUp’s agents work?')),
  },
  {
    id: 'adoption',
    keys: ['use el producto', 'usen el producto', 'la gente use', 'adopcion', 'adoption', 'engagement', 'retencion', 'retention', 'uso', 'usage', 'onboarding', 'activacion', 'habito', 'habit'],
    replies: [
      s('La adopción se diseña en lo que se repite: si lo de todos los días es rápido y claro, la gente vuelve. Busco el camino más frecuente y lo dejo a un toque, y premio la constancia más que el resultado.\n\nPor ejemplo, en Objetivos premiamos reportar cada semana con rachas, en lugar del % crudo, y en Barberlytics quien vuelve encuentra «lo de siempre» ya armado.', 'Adoption is designed in what repeats: if the everyday thing is fast and clear, people come back. I find the most frequent path and put it one tap away, and reward habit over the result.\n\nFor example, in Goals we reward reporting every week with streaks instead of raw %, and in Barberlytics returning clients find “the usual” already set.'),
    ],
    extras: join(CASE('objetivos'), CASE('barberlytics')),
  },
  {
    id: 'prioritize',
    keys: ['priorizar', 'priorizas', 'prioridad', 'prioritize', 'priority', 'roadmap', 'alcance', 'scope', 'que disenar primero', 'primero'],
    replies: [
      s('Priorizo cruzando frecuencia, impacto y esfuerzo: lo que más se repite en el día del usuario y más mueve la métrica va primero; lo raro pero crítico (dinero, errores, datos sensibles) se diseña bien aunque sea poco frecuente. Trabajo con el alcance fijo y el tiempo como presupuesto —la lógica de Shape Up—, recortando alcance antes que calidad.\n\nPor ejemplo, en el calendario de Barberlytics lo primero fue el siguiente paso en la tarjeta —ingresar, sentar, cobrar— porque pasa decenas de veces al día.', 'I prioritize by crossing frequency, impact and effort: what repeats most in the user’s day and moves the metric most goes first; rare but critical things (money, errors, sensitive data) get designed well even if infrequent. I treat time as a budget —Shape Up’s logic—, cutting scope before quality.\n\nFor example, in the Barberlytics calendar the first thing was the next step on the card —check in, seat, charge— because it happens dozens of times a day.'),
    ],
    extras: CASE('barberlytics'),
  },
  {
    id: 'design-system',
    short: s('Y todo cae en un sistema de diseño que deja personalizar sin romper, como Thema.', 'And everything lands in a design system that allows customizing without breaking, like Thema.'),
    keys: ['thema', 'sistema de diseno', 'design system', 'tokens', 'componentes', 'components', 'libreria', 'library', 'temas', 'themes', 'consistencia'],
    replies: [
      s('Trabajo los sistemas de diseño con design tokens: pocas decisiones de base (color, tipografía, radio, espaciado) que se guardan como variables y que leen todos los componentes, sobre shadcn y Radix. El theming se deriva: un color primario genera el tema completo, y los colores semánticos —éxito, error, aviso— no cambian nunca. La documentación también es producto.\n\nPor ejemplo, en Thema, el sistema de Barberlytics, pasé de cuatro fuentes de tokens en conflicto a 218 componentes, 22 familias y 10 temas, con reglas que la IA también sigue.', 'I build design systems with design tokens: a few base decisions (color, type, radius, spacing) stored as variables every component reads, on shadcn and Radix. Theming is derived: one primary color generates the whole theme, and semantic colors —success, error, warning— never change. The docs are a product too.\n\nFor example, in Thema, Barberlytics’ system, I went from four conflicting token sources to 218 components, 22 families and 10 themes, with rules AI follows too.'),
    ],
    deep: s('La clave fue que la documentación también fuera producto: un catálogo generado, reglas escritas y validaciones que bloquean antes de que algo llegue al código. Así una persona o una IA no pueden romper el sistema.', 'The key was making the docs a product too: a generated catalog, written rules and checks that block before anything reaches code. That way neither a person nor an AI can break the system.'),
    extras: CASE('barberlytics'),
  },
  {
    id: 'ui',
    keys: [' ui ', 'visual', 'interfaz', 'interface', 'estetica', 'tipografia', 'typography', 'color', 'animacion', 'animation', 'motion', 'diseno visual', 'graphic'],
    replies: [
      s('Vengo del diseño gráfico y la dirección de arte, así que cuido la forma: jerarquía, tipografía, ritmo y movimiento con intención. Pero la forma siempre está al servicio de una decisión de producto.\n\nPor ejemplo, en el calendario de Barberlytics cada barbería elige colorear las tarjetas por estado, servicio o cliente, y la densidad, porque cada una trabaja distinto.', 'I come from graphic design and art direction, so I care about form: hierarchy, typography, rhythm and purposeful motion. But form always serves a product decision.\n\nFor example, in the Barberlytics calendar each shop chooses to color cards by status, service or client, and the density, because each one works differently.'),
    ],
    extras: CASE('barberlytics'),
  },
  {
    id: 'accessibility',
    keys: ['discapacidad', 'disability', 'daltonismo', 'lectores de pantalla', 'accesibilidad', 'accessibility', 'a11y', 'contraste', 'contrast', 'inclusivo', 'inclusive', 'wcag'],
    replies: [
      s('Trato la accesibilidad como un requisito del sistema, siguiendo WCAG: contraste suficiente aunque cambie el tema, foco visible, navegación por teclado, textos alternativos y respeto por «reducir movimiento». Si el sistema es temable, la accesibilidad tiene que estar automatizada, no revisada a ojo.\n\nPor ejemplo, en Thema un test exige el contraste en los diez temas y en modo claro y oscuro; y este portafolio tiene ajustes de accesibilidad con alto contraste y movimiento reducido.', 'I treat accessibility as a system requirement, following WCAG: enough contrast even when the theme changes, visible focus, keyboard navigation, alt text and respect for “reduce motion”. If the system is themeable, accessibility has to be automated, not eyeballed.\n\nFor example, in Thema a test enforces contrast across all ten themes in light and dark mode; and this portfolio has accessibility settings with high contrast and reduced motion.'),
    ],
    extras: CASE('barberlytics'),
  },
  {
    id: 'data-viz',
    keys: ['datos', 'visualizas', 'visualizar', 'dashboard', 'dashboards', 'datos', 'data', 'graficos', 'charts', 'visualizacion', 'reportes', 'reports', 'resultados de encuesta', 'heatmap'],
    replies: [
      s('Un dashboard bueno responde una pregunta, no muestra todos los números. Empiezo por lo que la persona tiene que decidir y ordeno los datos para esa decisión.\n\nPor ejemplo, en Encuestas el mapa de calor por área compara grupos, pero los que tienen menos de cinco respuestas quedan reservados para cuidar el anonimato; y en Objetivos la lectura del ciclo se arma en cinco preguntas.', 'A good dashboard answers a question, it doesn’t show every number. I start from what the person has to decide and order the data for that decision.\n\nFor example, in Surveys the heatmap by area compares groups, but those with fewer than five answers stay reserved to protect anonymity; and in Goals reading a cycle is built around five questions.'),
    ],
    extras: join(CASE('encuestas'), CASE('objetivos')),
  },
  {
    id: 'branding',
    short: s('Sobre marca: en Barberlytics boceté seis direcciones de logo y lo afiné en seis rondas hasta dejar la flecha sola como isotipo.', 'On brand: in Barberlytics I sketched six logo directions and refined it in six rounds until the arrow alone became the isotype.'),
    weight: 3,
    keys: ['logo', 'logos', 'logotipo', 'isotipo', 'imagotipo', 'marca', 'marcas', 'branding', 'brand', 'identidad visual', 'identity', 'icono', 'icon', 'orbe', 'orb'],
    replies: [
      s('Boceto un logo como cualquier problema: primero qué tiene que decir y después muchas formas de decirlo, a mano, antes de pulir una. Exploro direcciones con el mismo ADN, me quedo con lo que sobrevive y termino con la construcción y sus medidas, probándolo en todos los tamaños y temas.\n\nPor ejemplo, en Barberlytics la pregunta era cómo «barbería» y «métricas» se vuelven un solo signo. Boceté seis direcciones —impulso, peine, poste, navaja, placa y sello— y lo afiné en seis rondas: la flecha que sube se quedó, le di un pulso, el gradiente de IA, lo probé en los catorce temas y al final la flecha sola quedó como isotipo para el favicon y el ícono de la app.', 'I sketch a logo like any problem: first what it has to say, then many ways of saying it, by hand, before polishing one. I explore directions with the same DNA, keep what survives and finish with the construction and its measures, testing it at every size and theme.\n\nFor example, in Barberlytics the question was how “barbershop” and “metrics” become one sign. I sketched six directions —momentum, comb, pole, razor, plate and seal— and refined it in six rounds: the rising arrow stayed, I gave it a pulse, the AI gradient, tested it in all fourteen themes and in the end the arrow alone became the isotype for favicon and app icon.'),
    ],
    deep: s('También diseñé la presencia de Clipper, la IA: no un ícono sino un orbe. Lo construí desde el poste de barbería —franjas a 45°, recortadas en círculo— con el gradiente de IA, vidrio, anillo y halo, y tres estados: reposo, escucha y piensa. Y en Thema la barbería puede sacar su tema de color de su propio logo.', 'I also designed the presence of Clipper, the AI: not an icon but an orb. I built it from the barber pole —45° stripes, cut into a circle— with the AI gradient, glass, ring and halo, and three states: idle, listening and thinking. And in Thema a shop can pull its color theme from its own logo.'),
    extras: join(CASE('barberlytics'), sug('¿Cómo construiste el orbe de Clipper?', 'How did you build Clipper’s orb?')),
  },

  {
    id: 'motivation',
    keys: ['gusta', 'pasion', 'motiva', 'motivacion', 'disfrutas', 'inspira', 'love', 'enjoy', 'passion'],
    replies: [
      s('Lo que más disfruto es el momento en que puntos sueltos se conectan: una queja en una reseña, un dato de uso y una idea de negocio que de pronto explican lo mismo. Y ahora, con IA, ver esa idea funcionando el mismo día.\n\nPor ejemplo, en Barberlytics esa conexión fue darme cuenta de que una barbería vive de lo que se repite; de ahí salió casi todo el producto.', 'What I enjoy most is the moment loose dots connect: a complaint in a review, a usage data point and a business idea that suddenly explain the same thing. And now, with AI, seeing that idea working the same day.\n\nFor example, in Barberlytics that connection was realizing a barbershop lives on what repeats; almost the whole product came from there.'),
    ],
    extras: CASE('barberlytics'),
  },

  {
    id: 'voice',
    weight: 2,
    keys: ['voz', 'voice', 'hablar con', 'dictado', 'dictation', 'llamada', 'speech', 'conversacional', 'conversational'],
    short: s('Y si hay voz, la diseño con paciencia: espera cuando la frase queda abierta y se interrumpe con un toque.', 'And if there’s voice, I design it patiently: it waits when a phrase is left open and one tap interrupts it.'),
    replies: [
      s('La voz la diseño alrededor de la paciencia: una pausa corta significa «terminé», pero si la frase queda abierta —«con», «a las»— el asistente espera el doble. Y siempre se puede interrumpir con un toque.\n\nPor ejemplo, en Clipper la reserva funciona como una llamada: saluda, responde en voz alta con la voz «Achird» de Gemini y vuelve a escuchar; en la app del equipo, por ahora, la voz es dictado.', 'I design voice around patience: a short pause means “done”, but if the phrase is left open —“with”, “at”— the assistant waits twice as long. And one tap always interrupts it.\n\nFor example, in Clipper booking works like a phone call: it greets, answers aloud with Gemini’s “Achird” voice and listens again; in the team app, for now, voice is dictation.'),
    ],
    extras: CASE('barberlytics'),
  },
  {
    id: 'mobile',
    weight: 1.5,
    keys: ['movil', 'mobile', 'celular', 'responsive', 'app movil', 'tablet', 'pantallas', 'dispositivos', 'devices', 'ios', 'android'],
    short: s('Y lo pienso para cada superficie: celular, tablet, monitor o widget, según dónde se usa.', 'And I think it through for each surface: phone, tablet, monitor or widget, depending on where it’s used.'),
    replies: [
      s('Diseño pensando en dónde y cómo se usa cada cosa, no solo en el tamaño de la pantalla. Quien reserva lo hace en el celular, con una mano; quien atiende la recepción mira un monitor todo el día.\n\nPor ejemplo, la reserva de Barberlytics funciona en celular, tablet, monitor y como widget en la web de la barbería, en español e inglés; y en Encuestas muestro cómo se responde desde el celular.', 'I design around where and how each thing is used, not just screen size. Someone booking does it on the phone, one-handed; the front desk watches a monitor all day.\n\nFor example, Barberlytics booking works on phone, tablet, monitor and as a widget on the shop’s website, in Spanish and English; and in Surveys I show how answering works on the phone.'),
    ],
    extras: join(CASE('barberlytics'), CASE('encuestas')),
  },
  {
    id: 'ia-architecture',
    weight: 1.5,
    keys: ['organizas', 'organizar', 'informacion', 'arquitectura de informacion', 'information architecture', 'navegacion', 'navigation', 'estructura', 'jerarquia', 'organizar contenido', 'menu', 'flujos complejos', 'card sorting'],
    replies: [
      s('Ordeno la información por el ciclo de quien la usa, no por cómo está guardada en la base de datos. Primero mapeo los momentos y los roles, y después decido qué ve cada uno y cuándo.\n\nPor ejemplo, en Objetivos el producto cubría un solo momento; lo reorganicé en siete momentos del ciclo para tres roles: admin, líder y colaborador. Y en Encuestas había 83 encuestas en una sola lista, sin nada que dijera cuál necesitaba atención hoy.', 'I order information around the user’s cycle, not how it’s stored in the database. First I map moments and roles, then decide what each one sees and when.\n\nFor example, in Goals the product covered a single moment; I reorganized it into seven cycle moments for three roles: admin, lead and employee. And in Surveys there were 83 surveys in a single list, with nothing saying which one needed attention today.'),
    ],
    extras: join(CASE('objetivos'), CASE('encuestas')),
  },
  {
    id: 'ux-writing',
    weight: 1.5,
    keys: ['ux writing', 'microcopy', 'textos', 'copy', 'copys', 'redaccion', 'lenguaje', 'tono', 'tone', 'nombres', 'wording'],
    replies: [
      s('Los textos son diseño: dicen qué pasó, qué sigue y quién decide. Escribo corto, honesto y en el idioma de quien lo usa.\n\nPor ejemplo, en Clipper la regla es «nunca digas que ya está hecho: di que quedó lista para aplicar». Y en el calendario, donde algo era una regla y no IA, le quitamos la etiqueta de IA y lo llamamos «Sugerencia».', 'Copy is design: it says what happened, what’s next and who decides. I write short, honest and in the user’s language.\n\nFor example, in Clipper the rule is “never say it’s done: say it’s ready to apply”. And in the calendar, where something was a rule and not AI, we removed the AI label and called it “Suggestion”.'),
    ],
    extras: CASE('barberlytics'),
  },
  {
    id: 'gamification',
    weight: 2,
    keys: ['gamificacion', 'gamification', 'rachas', 'streaks', 'motivar usuarios', 'incentivos', 'incentives', 'recompensas', 'rewards'],
    replies: [
      s('Uso la gamificación para premiar el hábito, no para adornar: rachas, reconocimiento y metas que se pueden cumplir. Y cuido que no exponga a nadie.\n\nPor ejemplo, en Objetivos estudié Duolingo y Strava y premiamos reportar cada semana con rachas, en lugar del % crudo; en público solo se nombra para reconocer. Y antes del producto digital hice cursos e-learning gamificados para Contecar, Corficolombiana y Puerto de Cartagena.', 'I use gamification to reward habit, not to decorate: streaks, recognition and goals that can be met. And I make sure it exposes nobody.\n\nFor example, in Goals I studied Duolingo and Strava and we reward reporting every week with streaks instead of raw %; in public you only name people to praise them. And before digital product I made gamified e-learning courses for Contecar, Corficolombiana and Port of Cartagena.'),
    ],
    extras: CASE('objetivos'),
  },
  {
    id: 'privacy',
    weight: 2,
    keys: ['privacidad', 'privacy', 'datos sensibles', 'sensitive data', 'seguridad', 'security', 'confidencial', 'permisos', 'permissions', 'roles y permisos', 'gdpr'],
    replies: [
      s('Diseño la privacidad desde el inicio (privacy by design), como una regla del producto y no como letra pequeña: qué se muestra, a quién y con cuántas personas detrás. Uso umbrales de anonimato —un grupo demasiado pequeño no muestra resultados— y control de acceso por rol.\n\nPor ejemplo, en Encuestas un grupo con menos de cinco respuestas no muestra resultados; en Objetivos un grupo de menos de tres personas no se compara; y en Clipper el rol sale de la sesión firmada, así que cada persona solo ve sus datos.', 'I design privacy from the start (privacy by design), as a product rule and not fine print: what’s shown, to whom and with how many people behind it. I use anonymity thresholds —a group that’s too small shows no results— and role-based access control.\n\nFor example, in Surveys a group with fewer than five answers shows no results; in Goals a group under three people isn’t compared; and in Clipper the role comes from the signed session, so each person only sees their own data.'),
    ],
    extras: join(CASE('encuestas'), CASE('objetivos')),
  },
  {
    id: 'leadership',
    weight: 1.5,
    keys: ['liderazgo', 'leadership', 'lideras', 'lead', 'liderar', 'diriges', 'manage', 'senior', 'mentor', 'mentoria'],
    replies: [
      s('He liderado diseño de punta a punta: fui UX/UI Lead en Siigo y Design Lead en Barberlytics, y hoy en UBITS lidero proyectos completos como Design Engineer. Para mí liderar es dar claridad: la pregunta, los principios y el porqué de cada decisión, escritos.\n\nPor ejemplo, en Objetivos trabajé con PM, front y QA, y cuatro principios escritos decidieron el resto del diseño.', 'I’ve led design end to end: I was UX/UI Lead at Siigo and Design Lead at Barberlytics, and today at UBITS I lead whole projects as Design Engineer. To me leading means giving clarity: the question, the principles and the why of each decision, written down.\n\nFor example, in Goals I worked with PM, front-end and QA, and four written principles decided the rest of the design.'),
    ],
    extras: CASE('objetivos'),
  },
  {
    id: 'documentation',
    weight: 1.5,
    keys: ['documentacion', 'documentation', 'documentas', 'docs', 'specs', 'especificaciones', 'guias', 'guidelines'],
    replies: [
      s('Documento para que las decisiones sobrevivan: qué se decidió, por qué y qué no se puede hacer. Y si la documentación la va a leer una IA, tiene que poder verificarse sola: escribo archivos de contexto para los agentes (las reglas del proyecto, cómo se nombran las cosas, qué componentes existen) para que la IA trabaje como alguien del equipo y no invente.\n\nPor ejemplo, en Thema la documentación también es producto: un catálogo generado, reglas escritas y validaciones que fallan si alguien usa un color o un tamaño a mano.', 'I document so decisions survive: what was decided, why, and what isn’t allowed. And if an AI will read the docs, they have to be self-checking: I write context files for agents (project rules, naming, which components exist) so AI works like a team member and doesn’t make things up.\n\nFor example, in Thema the docs are a product too: a generated catalog, written rules and checks that fail if someone uses a hand-set color or size.'),
    ],
    extras: CASE('barberlytics'),
  },
  {
    id: 'b2b',
    weight: 1.5,
    keys: ['b2b', 'saas', 'recursos humanos', 'rrhh', 'hr tech', 'erp', 'software empresarial', 'enterprise', 'contabilidad', 'nomina', 'facturacion'],
    replies: [
      s('Casi toda mi carrera ha sido software para empresas: Recursos Humanos en UBITS (objetivos, encuestas, matriz de talento), un ERP contable en Siigo (nómina, facturación electrónica, inventarios, POS y contabilidad) y la gestión de una barbería en Barberlytics. Lo que aprendí: en B2B quien compra no es quien usa, y hay que diseñar para los dos.\n\nPor ejemplo, en Objetivos diseñé para el admin que configura, el líder que aprueba y el colaborador que reporta.', 'Almost my whole career has been business software: HR at UBITS (goals, surveys, talent matrix), an accounting ERP at Siigo (payroll, e-invoicing, inventory, POS and accounting) and running a barbershop with Barberlytics. What I learned: in B2B the buyer isn’t the user, and you have to design for both.\n\nFor example, in Goals I designed for the admin who sets up, the lead who approves and the employee who reports.'),
    ],
    extras: CASE('objetivos'),
  },

  {
    id: 'stack',
    weight: 2,
    keys: ['tecnologias', 'tecnologia', 'tech', 'stack tecnico', 'react', 'vite', 'next', 'nextjs', 'next js', 'typescript', 'tailwind', 'shadcn', 'radix', 'frameworks', 'framework', 'librerias', 'libraries', 'lenguajes'],
    short: s('En tecnología trabajo con React y TypeScript, Vite o Next.js, Tailwind y shadcn sobre Radix.', 'On tech I work with React and TypeScript, Vite or Next.js, Tailwind and shadcn on Radix.'),
    replies: [
      s('Mi stack de cabecera es React con TypeScript. Uso Vite cuando es una aplicación (más rápida para desarrollar) y Next.js cuando necesito páginas del lado del servidor o rutas de API. Para la interfaz, Tailwind y shadcn sobre Radix: Radix resuelve la accesibilidad y el comportamiento de los componentes, y shadcn me deja el código en el proyecto para adaptarlo al sistema de diseño en vez de pelear con una librería cerrada.\n\nPor ejemplo, Thema, el sistema de Barberlytics, parte de shadcn + Radix con identidad propia; SellUp es Next.js con shadcn y Supabase; y Objetivos y Encuestas, los productos que construí en UBITS, son React + Vite con shadcn.', 'My go-to stack is React with TypeScript. I use Vite when it’s an app (faster to develop) and Next.js when I need server-rendered pages or API routes. For the UI, Tailwind and shadcn on Radix: Radix handles component accessibility and behavior, and shadcn leaves the code in the project so I can adapt it to the design system instead of fighting a closed library.\n\nFor example, Thema, Barberlytics’ system, starts from shadcn + Radix with its own identity; SellUp is Next.js with shadcn and Supabase; and Goals and Surveys, the products I built at UBITS, are React + Vite with shadcn.'),
    ],
    extras: join(CASE('barberlytics'), sug('¿Cómo despliegas en Vercel?', 'How do you deploy on Vercel?')),
  },
  {
    id: 'backend',
    weight: 2,
    keys: ['base de datos', 'bases de datos', 'database', 'backend', 'back end', 'supabase', 'servidor', 'server', 'api', 'apis', 'endpoint', 'datos reales', 'sql', 'postgres', 'autenticacion', 'auth', 'login'],
    short: s('Y lo conecto a datos reales: Supabase como base de datos, con reglas de acceso, y rutas del servidor para lo sensible.', 'And I connect it to real data: Supabase as the database, with access rules, and server routes for anything sensitive.'),
    replies: [
      s('Lo explico simple: el frontend es lo que ves; el backend es donde viven los datos y las reglas. Uso Supabase, que me da una base de datos Postgres, autenticación y reglas de acceso por fila —quién puede leer o escribir cada dato— sin montar un servidor desde cero. Cuando algo no debe correr en el navegador (una clave, una llamada a una IA, un cobro), lo pongo en una ruta del servidor.\n\nPor ejemplo, en este portafolio los proyectos vienen de Supabase con respaldo local si la base no responde, y este agente corre en una ruta del servidor que guarda la clave de Claude, valida cada pregunta y limita cuántas puede hacer cada visitante.', 'Put simply: the frontend is what you see; the backend is where data and rules live. I use Supabase, which gives me a Postgres database, authentication and row-level access rules —who can read or write each record— without building a server from scratch. When something must not run in the browser (a key, an AI call, a payment), I put it in a server route.\n\nFor example, in this portfolio projects come from Supabase with a local fallback if the database doesn’t answer, and this agent runs on a server route that keeps the Claude key, validates every question and limits how many each visitor can ask.'),
    ],
    deep: s('Para las demos públicas uso datos simulados: en la reserva de Barberlytics, MSW intercepta las llamadas y responde como lo haría el servidor, así cualquiera puede probarla sin tocar datos reales. Y en Clipper el rol de cada persona sale de la sesión firmada en el servidor, no de lo que pida el navegador.', 'For public demos I use simulated data: in Barberlytics booking, MSW intercepts calls and answers like the server would, so anyone can try it without touching real data. And in Clipper each person’s role comes from the signed session on the server, not from what the browser asks.'),
    extras: join(CASE('barberlytics'), sug('¿Cómo manejas GitHub?', 'How do you handle GitHub?')),
  },
  {
    id: 'deploy',
    weight: 2,
    keys: ['vercel', 'despliegue', 'despliegues', 'desplegar', 'deploy', 'deploys', 'deployment', 'produccion', 'production', 'hosting', 'dominio', 'preview', 'publicar', 'ci', 'cd'],
    short: s('Y lo publico en Vercel, con una vista previa por cada cambio y las claves como variables de entorno.', 'And I publish it on Vercel, with a preview for every change and keys as environment variables.'),
    replies: [
      s('Despliego en Vercel. Cada vez que subo un cambio a GitHub, Vercel construye el proyecto y me da una URL de vista previa para revisarlo antes de que llegue a producción; si la construcción falla, no se publica. Las claves (de la base de datos o de una IA) van como variables de entorno en Vercel, nunca en el código.\n\nPor ejemplo, Barberlytics y su reserva viven en Vercel, y la documentación de Thema también: cuando cambié la doc para mostrarla en este portafolio como vitrina, el cambio se publicó solo al subirlo a GitHub.', 'I deploy on Vercel. Every time I push a change to GitHub, Vercel builds the project and gives me a preview URL to review before it reaches production; if the build fails, nothing gets published. Keys (database or AI) go in as environment variables in Vercel, never in the code.\n\nFor example, Barberlytics and its booking live on Vercel, and so do Thema’s docs: when I changed the docs to show them as a showcase in this portfolio, the change went live on its own when I pushed it to GitHub.'),
    ],
    extras: join(CASE('barberlytics'), sug('¿Cómo manejas GitHub?', 'How do you handle GitHub?')),
  },
  {
    id: 'git',
    weight: 2,
    keys: ['github', 'git', 'commit', 'commits', 'pull request', 'pull requests', 'pr', 'prs', 'ramas', 'rama', 'branch', 'branches', 'merge', 'repositorio', 'repositorios', 'repo', 'versionamiento', 'control de versiones', 'version control'],
    short: s('Y lo versiono en GitHub: ramas, commits pequeños y pull requests cuando hay equipo.', 'And I version it on GitHub: branches, small commits and pull requests with a team.'),
    replies: [
      s('Todo mi código vive en GitHub. Trabajo en ramas para no romper lo que funciona, con commits pequeños y descriptivos —«qué cambió y por qué», en formato feat/fix—, y cuando hay equipo, con pull requests para que alguien revise antes de unir. Para mí el historial de commits es otra forma de documentación: cualquiera puede ver cómo se tomó cada decisión.\n\nPor ejemplo, este portafolio lo trabajé en una rama de rediseño, con cada mejora en su propio commit, mientras otras ramas construían cada caso en paralelo y luego se unían.', 'All my code lives on GitHub. I work in branches so I don’t break what works, with small descriptive commits —“what changed and why”, in feat/fix format—, and with a team, pull requests so someone reviews before merging. To me commit history is another form of documentation: anyone can see how each decision was made.\n\nFor example, I built this portfolio on a redesign branch, with each improvement in its own commit, while other branches built each case in parallel and were merged later.'),
    ],
    extras: sug('¿Cómo despliegas en Vercel?', 'How do you deploy on Vercel?'),
  },

  {
    id: 'frameworks',
    weight: 2,
    keys: ['double diamond', 'doble diamante', 'jobs to be done', 'jtbd', 'user personas', 'personas de usuario', 'proto personas', 'arquetipos', 'journey map', 'customer journey', 'mapa de experiencia', 'card sorting', 'heuristicas', 'heuristica', 'nielsen', 'design sprint', 'atomic design', 'affinity', 'mapa de afinidad', 'service blueprint', 'how might we', 'hmw', 'como podriamos', 'mvp', 'lean canvas', 'sus', 'heart'],
    replies: [
      s('Uso los métodos según la pregunta que necesito responder, no por receta. Los que más pesaron en mis casos: Double Diamond como marco (divergir y converger), desk research y benchmark con matriz de funciones, mapa de afinidad para sintetizar, el «¿cómo podríamos…?» (HMW) para encuadrar el problema, principios de diseño como filtro, user flows y wireframes, y evaluaciones cuando hay IA. También pienso en términos de jobs to be done: qué trabajo viene a resolver la persona.\n\nPor ejemplo, en la reserva de Barberlytics el job de quien vuelve era «lo de siempre, sin decidir nada otra vez», y el de quien llega, «la hora libre más cercana»: dos arquetipos con dos caminos.', 'I use methods depending on the question I need to answer, not as a recipe. The ones that weighed most in my cases: Double Diamond as a frame (diverge and converge), desk research and benchmarking with a feature matrix, affinity mapping to synthesize, “how might we…?” (HMW) to frame the problem, design principles as a filter, user flows and wireframes, and evaluations when there’s AI. I also think in jobs to be done: what job the person comes to get done.\n\nFor example, in Barberlytics booking the returning client’s job was “the usual, without deciding anything again”, and the new client’s, “the nearest free slot”: two archetypes with two paths.'),
    ],
    extras: join(CASE('barberlytics'), sug('¿Cuál es tu proceso?', 'What is your process?')),
  },

  /* ── IA ───────────────────────────────────────────────────────────── */
  {
    id: 'ai',
    short: s('Y la IA me acompaña en todo: agrupar investigación, generar variantes, prototipar en código y evaluar.', 'And AI comes along in everything: clustering research, generating variants, coded prototyping and evaluating.'),
    weight: 1.2,
    keys: [' ia ', ' ai ', 'inteligencia artificial', 'artificial intelligence', 'llm', 'gpt', 'chatgpt', 'gemini', 'machine learning', 'claude'],
    replies: [
      s('Uso la IA en dos lados. En el proceso: agrupar investigación, generar variantes, prototipar en código y evaluar. Y dentro de los productos, con una regla fija: la IA propone y una persona decide.\n\nPor ejemplo, Clipper, el asistente de Barberlytics, responde con los datos del negocio, nunca adivina una cifra y no cambia nada sin que una persona lo apruebe.', 'I use AI in two places. In the process: clustering research, generating variants, prototyping in code and evaluating. And inside products, with a fixed rule: AI proposes and a person decides.\n\nFor example, Clipper, Barberlytics’ assistant, answers with the business’s data, never guesses a figure and changes nothing without a person approving.'),
      s('Para mí la IA vale cuando gana confianza, y la confianza se diseña: fuentes a la vista, vista previa, deshacer y límites claros. La IA rápida y sin control la pierde.\n\nPor ejemplo, en SellUp tres agentes encuentran la empresa, la persona que decide y el primer mensaje, y un vendedor aprueba cada paso antes de que algo entre a HubSpot.', 'To me AI is worth it when it earns trust, and trust is designed: visible sources, preview, undo and clear limits. Fast AI without control loses it.\n\nFor example, in SellUp three agents find the company, the decision-maker and the first message, and a seller approves each step before anything enters HubSpot.'),
    ],
    deep: s('En Clipper diseñé también cómo piensa: 18 herramientas (13 consultan y 5 proponen), cada rol ve solo las suyas, 60 preguntas de evaluación y un filtro que frena cualquier número que no salga de los datos.', 'In Clipper I also designed how it thinks: 18 tools (13 read and 5 propose), each role sees only its own, 60 evaluation questions and a guard that stops any number not coming from the data.'),
    extras: join(CASE('barberlytics'), CASE('sellup')),
  },
  {
    id: 'ai-agents',
    weight: 1.5,
    keys: ['human in the loop', 'inyeccion', 'prompt injection', 'prompts', 'tool calling', 'agente', 'agentes', 'agent', 'agents', 'asistente', 'assistant', 'chatbot', 'bot', 'clipper', 'rumbo', 'orbit', 'evaluaciones', 'evals', 'guardrails', 'alucin'],
    replies: [
      s('Diseño agentes con humano en el bucle (human-in-the-loop): defino qué puede consultar, qué puede proponer y qué nunca hace solo. Técnicamente el modelo usa herramientas (tool calling) —funciones que consultan la base de datos— según la pregunta y el rol; pongo guardrails en el servidor que revisan la respuesta antes de mostrarla y lo mido con un set de evaluaciones. Y trato lo que escribe un usuario como dato, nunca como instrucción, que es la defensa contra la inyección de prompts.\n\nPor ejemplo, Clipper nunca adivina: si una respuesta trae una cifra que no salió de los datos, el servidor la frena.', 'I design agents with a human in the loop: I define what they can look up, what they can propose and what they never do alone. Technically the model uses tool calling —functions that query the database— based on the question and role; I add server-side guardrails that check the answer before showing it and measure it with an evaluation set. And I treat what a user writes as data, never as instructions, which is the defense against prompt injection.\n\nFor example, Clipper never guesses: if an answer has a figure that didn’t come from the data, the server stops it.'),
    ],
    deep: s('En SellUp separé el trabajo en tres agentes con reglas propias: el primero busca empresas y no gasta créditos si lo gratis alcanza, el segundo encuentra a la persona que decide y el tercero prepara el primer contacto. Cada uno deja un recibo de lo que hizo.', 'In SellUp I split the work into three agents with their own rules: the first finds companies and spends no credits if free is enough, the second finds the decision-maker and the third prepares the first contact. Each leaves a receipt of what it did.'),
    extras: join(CASE('barberlytics'), CASE('sellup')),
  },

  /* ── Casos ────────────────────────────────────────────────────────── */
  {
    id: 'barberlytics',
    keys: ['barberlytics', 'barberia', 'barberias', 'barbershop', 'barber', 'reserva', 'booking', 'calendario', 'calendar', 'plataforma'],
    replies: [
      s('Barberlytics es software para barberías que diseñé de punta a punta: el sistema de diseño (Thema), la reserva del cliente, el calendario del negocio y Clipper, su IA. Lo más difícil fue que cada barbería trabaja distinto; la respuesta fue un producto que se adapta a la barbería y no al revés.', 'Barberlytics is software for barbershops I designed end to end: the design system (Thema), client booking, the business calendar and Clipper, its AI. The hardest part was that every shop works differently; the answer was a product that adapts to the shop, not the other way around.'),
      s('Es mi proyecto más completo. Una barbería vive de lo que se repite: el corte de siempre, con el mismo barbero, cada pocas semanas. Con eso diseñé una reserva que pone «lo de siempre» a un toque y un calendario donde cada cita dice su siguiente paso: ingresar, sentar, cobrar.', 'It’s my most complete project. A barbershop lives on what repeats: the usual cut, same barber, every few weeks. With that I designed booking that puts “the usual” one tap away and a calendar where every visit shows its next step: check in, seat, charge.'),
    ],
    deep: s('Para la reserva comparé 15 productos y bocetamos cuatro versiones sobre un mismo motor. Para el calendario revisé 22 calendarios: nadie en el sector reacomodaba por retraso, así que el nuestro propone en la rejilla y todo se puede deshacer.', 'For booking I compared 15 products and sketched four versions on one engine. For the calendar I reviewed 22 calendars: nobody in the industry reflowed for delays, so ours proposes on the grid and everything can be undone.'),
    extras: join(CASE('barberlytics'), sug('¿Cómo funciona Clipper por dentro?', 'How does Clipper work inside?')),
  },
  {
    id: 'objetivos',
    keys: ['aprueba', 'aprobar', 'aprobacion', 'approve', 'objetivos', 'objetivo', 'goals', 'goal', 'okr', 'okrs', 'cascada', 'cascade', 'desempeno', 'performance'],
    replies: [
      s('En Objetivos de UBITS el producto era una sola pantalla para configurar ciclos: terminaba ahí. Lo rediseñé como el ciclo completo —crear, alinear en cascada, aprobar, reportar y leer resultados— para admin, líder y colaborador, y que se adapte a cómo cada empresa trabaja sus objetivos (SMART, OKR, KPI…).', 'In UBITS Goals the product was a single screen to set up cycles: it ended there. I redesigned it as the full cycle —create, cascade, approve, report and read results— for admin, lead and employee, adapting to how each company works its goals (SMART, OKR, KPI…).'),
    ],
    deep: s('Cuatro principios lo ordenan: el norte primero (todo cuelga de un objetivo de empresa), acordar antes de medir (sin aprobación no hay avance), constancia antes que % y contar sin exponer: en público solo se nombra para reconocer.', 'Four principles order it: north first (everything hangs from a company goal), agree before measuring (no approval, no progress), habit over % and count without exposing: in public you only name people to praise them.'),
    extras: CASE('objetivos'),
  },
  {
    id: 'sellup',
    keys: ['sellup', 'sell up', 'prospeccion', 'prospectos', 'prospect', 'comercial', 'vendedores', 'sellers', 'hubspot', 'apollo'],
    replies: [
      s('SellUp nace de una pregunta del equipo comercial de UBITS: con 206.000 empresas posibles en 20 países, ¿a cuál llamamos mañana, a quién y qué le decimos? Diseñé tres agentes que encuentran la empresa, dan con la persona que decide y preparan el primer contacto, con una persona aprobando cada paso.', 'SellUp comes from a question by UBITS’ sales team: with 206,000 possible companies in 20 countries, which one do we call tomorrow, who, and what do we say? I designed three agents that find the company, reach the decision-maker and prepare the first contact, with a person approving each step.'),
    ],
    deep: s('Lo clave fue el costo y la confianza: nada se paga si lo gratis alcanza, y nada entra a HubSpot sin revisión. Antes se buscaba a mano en Apollo o Lusha, sin criterio común y con duplicados.', 'The key was cost and trust: nothing gets paid for if free is enough, and nothing enters HubSpot unreviewed. Before, people searched by hand in Apollo or Lusha, with no shared criteria and with duplicates.'),
    extras: join(CASE('sellup'), sug('¿Cómo mides el ARR de SellUp?', 'How do you measure SellUp’s ARR?')),
  },
  {
    id: 'encuestas',
    keys: ['encuestas', 'encuesta', 'survey', 'surveys', 'clima laboral', 'clima organizacional', 'nom 035', 'enps', 'anonimato', 'anonymity'],
    replies: [
      s('En Encuestas de UBITS se creaba en blanco o con plantilla, sin traer lo que la empresa ya había medido. Lo rediseñé como un solo constructor que sirve igual para un pulso de cinco preguntas, un clima de cincuenta o la norma del país, sin que nadie tema responder con honestidad.', 'In UBITS Surveys you started blank or from a template, with no way to bring what the company had already measured. I redesigned it as a single builder that works for a five-question pulse, a fifty-question climate survey or the country’s regulation, without anyone fearing to answer honestly.'),
    ],
    deep: s('La parte más delicada fue el anonimato: si un grupo tiene menos de cinco respuestas, sus resultados no se muestran. Y una encuesta no termina cuando se cierra; termina cuando alguien hace algo con ella, por eso los resultados se vuelven acciones.', 'The most delicate part was anonymity: if a group has fewer than five answers, its results aren’t shown. And a survey doesn’t end when it closes; it ends when someone acts on it, so results turn into actions.'),
    extras: CASE('encuestas'),
  },
  {
    id: 'projects',
    /** «¿En qué proyecto…?» no debe tapar el tema real de la pregunta. */
    weight: 0.3,
    keys: ['proyectos', 'projects', 'casos', 'cases', 'portafolio', 'portfolio', 'trabajos', 'proyecto favorito', 'favorite project', 'mejor proyecto', 'orgulloso', 'proud'],
    replies: [
      s('En el portafolio hay cuatro: Objetivos y Encuestas de UBITS, SellUp —la plataforma comercial con IA de UBITS— y Barberlytics, software para barberías que diseñé y construí de punta a punta. Si tuviera que elegir uno, Barberlytics, porque ahí junté todo: sistema de diseño, producto, IA y código.', 'There are four in the portfolio: UBITS Goals and Surveys, SellUp —UBITS’ AI sales platform— and Barberlytics, software for barbershops I designed and built end to end. If I had to pick one, Barberlytics, because it brings it all together: design system, product, AI and code.'),
    ],
    extras: join(CASE('barberlytics'), CASE('objetivos')),
  },

  /* ── Equipo y forma de ser ───────────────────────────────────────── */
  {
    id: 'team',
    short: s('Y lo trabajo muy pegado a producto y desarrollo, con las decisiones escritas y su porqué.', 'And I work it closely with product and engineering, with decisions written down and their why.'),
    keys: ['work with developers', 'with developers', 'with engineers', 'equipo', 'team', 'desarrolladores', 'developers', 'devs', 'ingenieros', 'engineers', 'handoff', 'entrega', ' pm ', 'product manager', 'colaboras', 'collaborate', 'trabajas con'],
    replies: [
      s('Trabajo muy pegado a producto y desarrollo. Llevo la evidencia a la mesa, dejo las decisiones escritas con su porqué y, cuando una idea genera dudas, la prototipo para que la discusión sea sobre algo real. El handoff casi no existe porque muchas veces entrego en código, con los mismos componentes que usa el equipo, en una rama de GitHub y con las tareas en Jira.\n\nPor ejemplo, en Objetivos trabajé con PM, front y QA en el rediseño del admin.', 'I work very close to product and engineering. I bring evidence to the table, write decisions down with their why and, when an idea raises doubts, I prototype it so the discussion is about something real. Handoff barely exists because I often deliver in code, with the same components the team uses, on a GitHub branch and with tasks in Jira.\n\nFor example, in Goals I worked with PM, front-end and QA on the admin redesign.'),
    ],
    extras: CASE('objetivos'),
  },
  {
    id: 'stakeholders',
    keys: ['de acuerdo', 'no estas de acuerdo', 'no estan de acuerdo', 'stakeholders', 'negociar', 'desacuerdo', 'disagree', 'conflicto', 'conflict', 'convencer', 'persuade', 'feedback', 'criticas', 'retroalimentacion', 'jefe', 'cliente dificil'],
    replies: [
      s('Cuando hay desacuerdo, bajo la discusión de opiniones a evidencia: qué dice el usuario, qué dice el dato y qué cuesta cada opción. Si sigue abierta, prototipo las dos y que la prueba decida.\n\nPor ejemplo, en una revisión de Objetivos alguien dijo que las métricas no le hacían sentido para incentivar el progreso; esa crítica nos llevó a cambiar el % por la constancia.', 'When there’s disagreement, I bring the discussion from opinions down to evidence: what the user says, what the data says and what each option costs. If it’s still open, I prototype both and let the test decide.\n\nFor example, in a Goals review someone said the metrics didn’t make sense to encourage progress; that critique led us to swap % for habit.'),
    ],
    extras: CASE('objetivos'),
  },
  {
    id: 'methodologies',
    weight: 2.5,
    keys: ['agile', 'scrum', 'design thinking', 'lean', 'lean ux', 'shape up', 'sprint', 'sprints', 'kanban'],
    replies: [
      s('He trabajado con Design Thinking, Lean UX, Agile UX, Scrum, Agile Inception y Shape Up, sobre todo en Siigo. Más que casarme con una, tomo lo útil de cada una según el momento del producto.\n\nPor ejemplo, hoy combino ciclos cortos de prototipo en código con IA con la disciplina de dejar cada decisión escrita.', 'I’ve worked with Design Thinking, Lean UX, Agile UX, Scrum, Agile Inception and Shape Up, mostly at Siigo. Rather than marrying one, I take what’s useful from each depending on the product’s moment.\n\nFor example, today I combine short coded-prototype cycles with AI with the discipline of writing every decision down.'),
    ],
    extras: s('[[cv]]', '[[cv]]'),
  },
  {
    id: 'strengths',
    keys: ['fortaleza', 'fortalezas', 'strength', 'strengths', 'debilidad', 'debilidades', 'weakness', 'defecto', 'habilidades', 'skills'],
    replies: [
      s('Mi fortaleza es conectar: llevar una investigación a una decisión de producto, y esa decisión a algo que funciona. Me muevo bien en estrategia de producto, diseño de interacciones, arquitectura de información, sistemas de diseño, investigación y prototipado en código con IA. Lo que me falta por mejorar lo hablamos mejor en persona; ahí se nota más que en un chat.\n\nPor ejemplo, en Barberlytics esa mezcla fue la que permitió diseñar y construir el producto completo.', 'My strength is connecting: taking research to a product decision, and that decision to something that works. I’m strong in product strategy, interaction design, information architecture, design systems, research and coded prototyping with AI. What I still need to improve is better talked about in person; it shows more there than in a chat.\n\nFor example, in Barberlytics that mix is what made it possible to design and build the whole product.'),
    ],
    extras: CASE('barberlytics'),
  },
  {
    id: 'learning',
    keys: ['error', 'errores', 'mistake', 'fracaso', 'failure', 'aprendiste', 'aprendizaje', 'learned', 'lesson', 'leccion', 'salio mal', 'went wrong'],
    replies: [
      s('Uno de los aprendizajes más claros fue con la IA: prometerla y no darla quita confianza. En Clipper encontramos que la interfaz prometía cosas que no hacía —un demo con cifras inventadas y botones de IA sobre reglas fijas—, así que primero lo hicimos honesto y seguro, y después ambicioso.', 'One of my clearest lessons was with AI: promising it and not delivering costs trust. In Clipper we found the interface promised things it didn’t do —a demo with made-up figures and AI buttons on fixed rules—, so we first made it honest and safe, and then ambitious.'),
    ],
    extras: CASE('barberlytics'),
  },
  {
    id: 'experience',
    short: s('Llevo más de diez años en producto digital: hoy en UBITS, antes en Barberlytics y Siigo.', 'I have 10+ years in digital product: today at UBITS, before at Barberlytics and Siigo.'),
    keys: ['experiencia', 'experience', 'trayectoria', 'carrera', 'career', 'anos', 'years', 'ubits', 'siigo', 'trabajado', 'worked', 'cargo', 'rol actual'],
    replies: [
      s('Llevo más de diez años en producto digital. Hoy estoy en UBITS como Design Engineer, en software de Recursos Humanos (objetivos, encuestas y matriz de talento); entre 2022 y 2025 lideré el diseño de Barberlytics, y antes estuve en Siigo diseñando un ERP contable, de nómina a facturación electrónica. Empecé como diseñador gráfico y director de arte.', 'I have 10+ years in digital product. Today I’m at UBITS as Design Engineer, in HR software (goals, surveys and talent matrix); between 2022 and 2025 I led design at Barberlytics, and before that I was at Siigo designing an accounting ERP, from payroll to e-invoicing. I started as a graphic designer and art director.'),
    ],
    deep: s('En Siigo aprendí a diseñar productos complejos de punta a punta, de la investigación a la implementación; en UBITS conecto cada decisión con adopción y outcomes; en Barberlytics aprendí a diseñar y construir un producto completo con IA.', 'At Siigo I learned to design complex products end to end, from research to implementation; at UBITS I tie every decision to adoption and outcomes; at Barberlytics I learned to design and build a whole product with AI.'),
    extras: s('[[cv]]', '[[cv]]'),
  },
  {
    id: 'tools',
    short: s('Sobre herramientas: en diseño uso Figma y Adobe, y para explorar y construir con IA, Claude, Claude Code, Cursor y Figma Make.', 'On tools: for design I use Figma and Adobe, and to explore and build with AI, Claude, Claude Code, Cursor and Figma Make.'),
    keys: ['herramientas', 'herramienta', 'tools', 'tool', 'stack', 'figma', 'adobe', 'software', 'n8n', 'supabase', 'notion', 'jira', 'make', 'antigravity'],
    replies: [
      s('En IA uso Claude, Claude Code, Cursor, Antigravity, ChatGPT y Figma Make. En diseño, Figma y Adobe. Para construir, React, TypeScript, Vite o Next.js, Tailwind y shadcn; Supabase como base de datos, GitHub para el código y Vercel para publicar. Para producto, Notion, Jira y n8n o Make para automatizar. La herramienta cambia; el criterio se queda.\n\nPor ejemplo, Barberlytics combina Figma, Claude Code, React, TypeScript y Vercel.', 'For AI I use Claude, Claude Code, Cursor, Antigravity, ChatGPT and Figma Make. For design, Figma and Adobe. To build, React, TypeScript, Vite or Next.js, Tailwind and shadcn; Supabase as the database, GitHub for code and Vercel to publish. For product, Notion, Jira and n8n or Make for automation. Tools change; judgment stays.\n\nFor example, Barberlytics combines Figma, Claude Code, React, TypeScript and Vercel.'),
    ],
    extras: CASE('barberlytics'),
  },
  {
    id: 'education',
    keys: ['estudios', 'estudiaste', 'educacion', 'education', 'study', 'platzi', 'universidad', 'university', 'certificacion', 'certificaciones', 'certification', 'titulo', 'degree'],
    replies: [
      s('Soy diseñador gráfico profesional de Los Libertadores (2010–2014). Tengo la certificación internacional UX-PM niveles 1, 2 y 3 de UXalliance (2018) y las carreras de UI, UX y Diseño de Producto de Platzi. Lo demás lo aprendí haciendo producto.', 'I’m a graphic designer from Los Libertadores (2010–2014). I hold the International UX-PM certification levels 1, 2 and 3 from UXalliance (2018) and Platzi’s UI, UX and Product Design tracks. The rest I learned building product.'),
    ],
    extras: s('[[cv]]', '[[cv]]'),
  },
  {
    id: 'hire',
    keys: ['contratar', 'contratarte', 'hire', 'por que deberiamos', 'por que tu', 'why you', 'why should', 'trabajar contigo', 'work with you', 'diferencia', 'different', 'valor', 'aportar', 'aportas'],
    replies: [
      s('Porque conecto lo que casi siempre vive separado: investigación, negocio, diseño y tecnología. Llego con evidencia, diseño pensando en la métrica que hay que mover y, cuando hace falta, construyo el prototipo yo mismo con IA para validar en días y no en semanas.\n\nPor ejemplo, en Objetivos llevé un producto de una sola pantalla al ciclo completo y lo validé en código antes de pedir desarrollo.', 'Because I connect what usually lives apart: research, business, design and technology. I come with evidence, design around the metric that needs to move and, when needed, build the prototype myself with AI to validate in days, not weeks.\n\nFor example, in Goals I took a single-screen product to the full cycle and validated it in code before asking for development.'),
    ],
    extras: join(s('[[contacto]]', '[[contacto]]'), sug('¿Cómo conectas diseño con métricas?', 'How do you tie design to metrics?')),
  },
  {
    id: 'money',
    keys: ['salario', 'salary', 'sueldo', 'cobras', 'tarifa', 'tarifas', 'rate', 'precio', 'price', 'cuanto cuesta', 'how much do you charge', 'aspiracion salarial'],
    weight: 2,
    replies: [s('Eso prefiero hablarlo directo, porque depende mucho del alcance y del equipo. Escríbeme y lo conversamos.', 'I’d rather talk about that directly, since it depends a lot on scope and team. Write to me and we’ll talk it through.')],
    extras: s('[[contacto]]', '[[contacto]]'),
  },
  {
    id: 'contact',
    weight: 1.2,
    keys: ['based in', 'where are you based', 'where are you', 'donde estas', 'contacto', 'contactarte', 'contact', 'correo', 'email', 'mail', 'whatsapp', 'telefono', 'phone', 'llamar', 'call', 'linkedin', 'disponible', 'disponibilidad', 'available', 'remoto', 'remote', 'ubicacion', 'donde vives', 'location'],
    replies: [s(`Con gusto. Escríbeme a ${PROFILE.email} o por WhatsApp al ${PROFILE.phoneDisplay}. Estoy en ${PROFILE.location.es} y trabajo en remoto o híbrido.`, `Gladly. Email me at ${PROFILE.email} or WhatsApp me at ${PROFILE.phoneDisplay}. I’m based in ${PROFILE.location.en} and work remote or hybrid.`)],
    extras: s('[[contacto]]', '[[contacto]]'),
  },
  {
    id: 'cv',
    keys: ['hoja de vida', 'cv', 'resume', 'curriculum', 'curriculo'],
    weight: 2,
    replies: [s('Claro, aquí la tienes. Si quieres, también te cuento lo que no cabe en una hoja de vida: cómo tomo decisiones.', 'Sure, here it is. If you like, I can also tell you what doesn’t fit in a résumé: how I make decisions.')],
    extras: s('[[cv]]', '[[cv]]'),
  },
  {
    id: 'personal',
    weight: 3,
    keys: ['futbol', 'football', 'soccer', 'comida', 'food', 'edad', 'age', 'how old', 'cuantos anos tienes', 'hobby', 'hobbies', 'pasatiempo', 'pasatiempos', 'familia', 'family', 'hijos', 'kids', 'musica', 'music', 'pelicula', 'movie', 'serie', 'signo', 'religion', 'politica', 'politics'],
    replies: [s('Eso te lo cuento mejor en persona 🙂 Aquí me enfoco en lo que hago: producto, diseño, métricas e IA. Si quieres, conversamos directo.', 'I’d rather tell you that in person 🙂 Here I focus on what I do: product, design, metrics and AI. If you like, let’s talk directly.')],
    extras: s('[[contacto]]', '[[contacto]]'),
  },
  {
    id: 'hello',
    keys: ['ola', 'hola', 'hello', 'hi', 'buenas', 'hey', 'buen dia', 'buenos dias', 'buenas tardes', 'good morning', 'que tal', 'saludos'],
    weight: 0.2,
    replies: [
      s('¡Hola! Qué bueno tenerte por aquí. Pregúntame lo que quieras: cómo pienso un producto, cómo lo mido, cómo boceto o cómo uso la IA para construirlo.', 'Hi! Great to have you here. Ask me anything: how I think a product through, how I measure it, how I sketch or how I use AI to build it.'),
      s('¡Hola! Soy Elkin. ¿Te cuento de algún caso o prefieres saber cómo trabajo?', 'Hi! I’m Elkin. Shall I tell you about a case, or would you rather know how I work?'),
    ],
    extras: join(sug('Cuéntame de Barberlytics', 'Tell me about Barberlytics'), sug('¿Cómo usas la IA?', 'How do you use AI?')),
  },
  {
    id: 'thanks',
    keys: ['gracias', 'thanks', 'thank you', 'genial', 'great', 'perfecto', 'excelente', 'chevere'],
    weight: 0.2,
    replies: [s('¡Con gusto! Si quieres seguir la conversación en persona, aquí estoy.', 'My pleasure! If you’d like to continue the conversation in person, I’m here.')],
    extras: s('[[contacto]]', '[[contacto]]'),
  },
]

/** Preguntas que piden ir más a fondo en el tema anterior. */
export const FOLLOW_UP = ['y eso', 'como asi', 'por que', 'cuentame mas', 'mas detalle', 'un ejemplo', 'ejemplo', 'como lo', 'profundiza', 'y luego', 'y como', 'tell me more', 'why', 'how so', 'example', 'more detail', 'go deeper', 'and then', 'how did you']

export const FALLBACK: readonly L[] = [
  s('Esa no la tengo a mano y prefiero no improvisarte. Lo que sí te puedo contar: cómo investigo, boceto y mido un producto, cómo uso la IA para construirlo o cualquiera de mis casos: Barberlytics, Objetivos, SellUp o Encuestas.', 'I don’t have that one at hand and I’d rather not improvise. What I can tell you: how I research, sketch and measure a product, how I use AI to build it, or any of my cases: Barberlytics, Goals, SellUp or Surveys.'),
  s('Buena pregunta; esa la hablamos mejor directo. Mientras, si te sirve, te cuento cómo conecto diseño con métricas de negocio, con un ejemplo real.', 'Good question; that one is better in person. Meanwhile, if it helps, I can tell you how I tie design to business metrics, with a real example.'),
]
