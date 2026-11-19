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
    keys: ['vibe coding', 'vibe', 'codigo', 'programas', 'programar', 'construyes', 'construir', 'cursor', 'claude code', 'build', 'coding', 'code'],
    replies: [
      s('Diseño y también construyo. Con Claude Code y Cursor paso de la idea a algo que funciona en días: escribo primero las reglas del sistema de diseño para que la IA las respete, armo piezas pequeñas, las pruebo en el navegador y voy subiendo. El vibe coding no reemplaza el criterio; lo acelera.\n\nPor ejemplo, Barberlytics lo diseñé y construí así, y este mismo portafolio también.', 'I design and I also build. With Claude Code and Cursor I go from idea to something that works in days: I first write the design-system rules so AI respects them, build small pieces, test them in the browser and scale up. Vibe coding doesn’t replace judgment; it speeds it up.\n\nFor example, I designed and built Barberlytics that way, and this very portfolio too.'),
      s('Lo que más cambió en mi forma de trabajar es que ya no entrego solo diseños: entrego prototipos que se pueden usar. Así la conversación con negocio y desarrollo es sobre algo real, no sobre una imagen.\n\nPor ejemplo, en Objetivos de UBITS validé el ciclo completo con un prototipo en código antes de pedirle tiempo de desarrollo al equipo.', 'What changed my work the most is that I no longer hand over designs only: I hand over prototypes people can use. That way the conversation with business and engineering is about something real, not a picture.\n\nFor example, in UBITS Goals I validated the full cycle with a coded prototype before asking the team for development time.'),
    ],
    deep: s('Mi método: reglas escritas (tokens, componentes, qué no se puede hacer), piezas pequeñas y validaciones que frenan lo que se sale de la línea. En Barberlytics eso se volvió Thema: 218 componentes que también sigue la IA, así que lo que genera ya sale con la identidad correcta.', 'My method: written rules (tokens, components, what’s not allowed), small pieces and checks that stop anything off-line. In Barberlytics that became Thema: 218 components AI follows too, so whatever it generates comes out with the right identity.'),
    extras: join(CASE('barberlytics'), sug('¿Qué herramientas usas?', 'What tools do you use?')),
  },
  {
    id: 'process',
    keys: ['proceso', 'metodologia', 'metodo', 'como trabajas', 'como abordas', 'como empiezas', 'pasos', 'process', 'approach', 'workflow'],
    replies: [
      s('Voy de puntos sueltos a conexiones, en ocho etapas: escucho el problema sin filtros, busco lo que se repite, lo resumo en una pregunta y pocos principios, bocetos a mano, pantallas reales, diseño cómo piensa la IA si la hay, mido el impacto y cierro con una demo funcionando.\n\nPor ejemplo, en Barberlytics esa pregunta fue: ¿cómo hacer que reservar «lo de siempre» tome un toque?', 'I go from loose dots to connections, in eight stages: I listen to the problem unfiltered, find what repeats, sum it up in one question and a few principles, hand sketch, real screens, design how the AI thinks if there is one, measure impact and close with a working demo.\n\nFor example, in Barberlytics that question was: how do we make booking “the usual” take one tap?'),
    ],
    deep: s('Lo que más cuido es el paso de patrones a idea: sin una pregunta clara, los bocetos se dispersan. En Objetivos la pregunta fue cómo adaptar el producto a la forma en que cada empresa trabaja sus objetivos, y de ahí salieron cuatro principios que decidieron todo lo demás.', 'What I care about most is going from patterns to the idea: without a clear question, sketches scatter. In Goals the question was how to adapt the product to the way each company works its goals, and that produced four principles that decided everything else.'),
    extras: join(CASE('objetivos'), sug('¿Cómo bocetas?', 'How do you sketch?')),
  },
  {
    id: 'research',
    keys: ['investigacion', 'investigas', 'research', 'entrevistas', 'interviews', 'usuarios', 'users', 'descubrimiento', 'discovery', 'insights', 'empatia'],
    replies: [
      s('Investigo con lo que haya disponible y lo digo tal cual: entrevistas y observación cuando se puede, datos de uso, tickets de soporte, reseñas públicas y comparación de productos. Lo importante es separar lo que la gente dice de lo que hace.\n\nPor ejemplo, en el calendario de Barberlytics leí reseñas y centros de ayuda de 22 calendarios; la queja que más se repetía era «demasiados clics», y eso definió que el siguiente paso viviera en la tarjeta.', 'I research with whatever is available and say so plainly: interviews and observation when possible, usage data, support tickets, public reviews and product comparisons. The key is separating what people say from what they do.\n\nFor example, for the Barberlytics calendar I read reviews and help centers of 22 calendars; the most repeated complaint was “too many clicks”, which is why the next step lives on the card.'),
    ],
    deep: s('Cuando no hay entrevistas propias, no las invento: lo aclaro y uso la voz disponible. En el calendario lo dejé escrito en el caso: «No hubo entrevistas propias: esta es la voz disponible».', 'When there are no first-hand interviews, I don’t fake them: I say so and use the voice available. In the calendar case I wrote it down: “There were no first-hand interviews: this is the voice available”.'),
    extras: join(CASE('barberlytics'), sug('¿Cómo haces un benchmark?', 'How do you benchmark?')),
  },
  {
    id: 'benchmark',
    keys: ['benchmark', 'competencia', 'competidores', 'competitors', 'comparar', 'compare', 'referentes', 'mercado', 'market'],
    replies: [
      s('Comparo productos con un criterio claro, no por inspiración: qué hacen, qué prometen y qué se queja la gente de ellos, marcando lo que no pude confirmar. Luego agrupo en columnas: lo que ya hacemos mejor, lo estándar que nos falta, lo que vale copiar y nuestros riesgos.\n\nPor ejemplo, para la reserva de Barberlytics comparé 15 productos (Booksy, Fresha, Squire, theCut, Vagaro…) y de ahí salieron ideas como la cita recurrente y «lo antes posible».', 'I compare products with clear criteria, not for inspiration: what they do, what they promise and what people complain about, flagging what I couldn’t confirm. Then I group into columns: what we already do better, standard things we lack, what’s worth copying and our own risks.\n\nFor example, for Barberlytics booking I compared 15 products (Booksy, Fresha, Squire, theCut, Vagaro…) and that produced ideas like recurring appointments and “as soon as possible”.'),
    ],
    extras: CASE('barberlytics'),
  },
  {
    id: 'sketch',
    keys: ['boceto', 'bocetos', 'bocetas', 'bocetar', 'bocetacion', 'sketch', 'sketches', 'wireframe', 'wireframes', 'flujo', 'flujos', 'flow', 'ideacion', 'ideas', 'variantes', 'versiones'],
    replies: [
      s('Bocetar para mí es pensar barato. Antes de cualquier pantalla hago tableros a mano: el flujo completo, dónde se separan los caminos, qué pasa cuando algo falla y varias versiones lado a lado. Ahí descarto rápido, sin apego.\n\nPor ejemplo, en la reserva de Barberlytics bocetamos cuatro versiones —paso a paso, agenda en lista, según el cliente y Clipper— sobre un mismo motor, y «según el cliente» quedó por defecto.', 'Sketching to me is cheap thinking. Before any screen I make hand-drawn boards: the whole flow, where paths split, what happens when something fails and several versions side by side. There I discard fast, without attachment.\n\nFor example, in Barberlytics booking we sketched four versions —step by step, list agenda, by client and Clipper— on one engine, and “by client” became the default.'),
    ],
    deep: s('También boceto lo que no se ve: cómo responde la IA. En Clipper boceté la anatomía de una respuesta —corta, con su fuente a la vista y con los cambios como propuestas— antes de tocar el modelo, y la construcción del orbe paso a paso.', 'I also sketch what you can’t see: how the AI answers. In Clipper I sketched the anatomy of an answer —short, with its source in view and changes as proposals— before touching the model, and the orb’s construction step by step.'),
    extras: join(CASE('barberlytics'), sug('¿Cómo prototipas?', 'How do you prototype?')),
  },
  {
    id: 'prototype',
    keys: ['prototipo', 'prototipos', 'prototipas', 'prototype', 'prototyping', 'figma make', 'mvp'],
    replies: [
      s('Prototipo en el nivel que la pregunta necesita: papel si es de flujo, Figma si es de forma y código si es de comportamiento o de datos reales. Cada vez más voy directo a código con IA, porque así se prueba con lo que de verdad va a pasar.\n\nPor ejemplo, la demo de la reserva de Barberlytics es la reserva real funcionando con datos de prueba, en celular, tablet, monitor y widget.', 'I prototype at the level the question needs: paper for flow, Figma for form and code for behavior or real data. More and more I go straight to code with AI, because that tests what will actually happen.\n\nFor example, the Barberlytics booking demo is the real booking running with test data, on phone, tablet, monitor and widget.'),
    ],
    extras: CASE('barberlytics'),
  },
  {
    id: 'testing',
    keys: ['prueba', 'pruebas', 'pruebas de usabilidad', 'usabilidad', 'usability', 'testing', 'validar', 'validacion', 'validate', 'test', 'a/b', 'experimento'],
    replies: [
      s('Valido lo más barato primero: un prototipo frente a la tarea real, mirando dónde se traba la persona. Si hay datos de uso, defino antes la señal que confirmaría la hipótesis. Y si el producto lleva IA, la valido con evaluaciones.\n\nPor ejemplo, Clipper tiene 60 preguntas de evaluación en tres variantes de idioma, con una meta del 90 % de acierto que todavía falta correr con la clave de producción.', 'I validate the cheapest way first: a prototype against the real task, watching where the person gets stuck. If there’s usage data, I define upfront the signal that would confirm the hypothesis. And if the product carries AI, I validate it with evaluations.\n\nFor example, Clipper has 60 evaluation questions in three language variants, with a 90% accuracy target still to be run with the production key.'),
    ],
    extras: CASE('barberlytics'),
  },
  {
    id: 'metrics',
    keys: ['metrica', 'metricas', 'metrics', 'kpi', 'kpis', 'medir', 'mides', 'medicion', 'measure', 'indicadores', 'exito', 'success', 'resultados', 'outcome', 'outcomes', 'north star'],
    replies: [
      s('Empiezo por la métrica, no por la pantalla: qué tiene que moverse en el negocio —adopción, conversión, retención, tiempo ahorrado, ingresos— y qué comportamiento la mueve. Escribo la hipótesis, la señal que la confirma y diseño para esa señal.\n\nPor ejemplo, en Objetivos la métrica de avance en % castigaba a quien se ponía metas ambiciosas; la cambiamos por la constancia de reportar, y eso cambió el diseño entero.', 'I start from the metric, not the screen: what has to move in the business —adoption, conversion, retention, time saved, revenue— and which behavior moves it. I write the hypothesis, the signal that confirms it and design for that signal.\n\nFor example, in Goals the % progress metric punished ambitious goals; we changed it to the habit of reporting, and that changed the whole design.'),
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
    keys: ['adopcion', 'adoption', 'engagement', 'retencion', 'retention', 'uso', 'usage', 'onboarding', 'activacion', 'habito', 'habit'],
    replies: [
      s('La adopción se diseña en lo que se repite: si lo de todos los días es rápido y claro, la gente vuelve. Busco el camino más frecuente y lo dejo a un toque, y premio la constancia más que el resultado.\n\nPor ejemplo, en Objetivos premiamos reportar cada semana con rachas, en lugar del % crudo, y en Barberlytics quien vuelve encuentra «lo de siempre» ya armado.', 'Adoption is designed in what repeats: if the everyday thing is fast and clear, people come back. I find the most frequent path and put it one tap away, and reward habit over the result.\n\nFor example, in Goals we reward reporting every week with streaks instead of raw %, and in Barberlytics returning clients find “the usual” already set.'),
    ],
    extras: join(CASE('objetivos'), CASE('barberlytics')),
  },
  {
    id: 'prioritize',
    keys: ['priorizar', 'priorizas', 'prioridad', 'prioritize', 'priority', 'roadmap', 'alcance', 'scope', 'que disenar primero', 'primero'],
    replies: [
      s('Priorizo por frecuencia e impacto: lo que más se repite en el día de quien lo usa y lo que más mueve la métrica va primero. Lo raro pero crítico (errores, dinero, datos sensibles) se diseña bien aunque sea poco frecuente.\n\nPor ejemplo, en el calendario de Barberlytics lo primero fue el siguiente paso en la tarjeta —ingresar, sentar, cobrar— porque pasa decenas de veces al día.', 'I prioritize by frequency and impact: what repeats most in the user’s day and what moves the metric most goes first. Rare but critical things (errors, money, sensitive data) get designed well even if infrequent.\n\nFor example, in the Barberlytics calendar the first thing was the next step on the card —check in, seat, charge— because it happens dozens of times a day.'),
    ],
    extras: CASE('barberlytics'),
  },
  {
    id: 'design-system',
    keys: ['sistema de diseno', 'design system', 'tokens', 'componentes', 'components', 'libreria', 'library', 'temas', 'themes', 'consistencia'],
    replies: [
      s('Me gustan los sistemas que dejan personalizar sin romper. Defino pocas decisiones y que el resto se derive: un color primario genera el tema completo, y lo que tiene significado —éxito, error, aviso— no cambia nunca.\n\nPor ejemplo, en Thema, el sistema de Barberlytics, pasé de cuatro fuentes de tokens en conflicto a 218 componentes, 22 familias y 10 temas, con reglas que la IA también sigue.', 'I like systems that let you customize without breaking. I define few decisions and derive the rest: one primary color generates the whole theme, and whatever carries meaning —success, error, warning— never changes.\n\nFor example, in Thema, Barberlytics’ system, I went from four conflicting token sources to 218 components, 22 families and 10 themes, with rules AI follows too.'),
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
    keys: ['accesibilidad', 'accessibility', 'a11y', 'contraste', 'contrast', 'inclusivo', 'inclusive', 'wcag'],
    replies: [
      s('La accesibilidad la trato como parte del sistema, no como un extra: contraste que siga pasando aunque cambie el tema, foco visible y respeto por «reducir movimiento».\n\nPor ejemplo, en Thema cada barbería elige su color y el contraste tiene que seguir pasando; y este portafolio tiene ajustes de accesibilidad con alto contraste y movimiento reducido.', 'I treat accessibility as part of the system, not an extra: contrast that keeps passing when the theme changes, visible focus and respect for “reduce motion”.\n\nFor example, in Thema every shop picks its color and contrast must still pass; and this portfolio has accessibility settings with high contrast and reduced motion.'),
    ],
    extras: CASE('barberlytics'),
  },
  {
    id: 'data-viz',
    keys: ['dashboard', 'dashboards', 'datos', 'data', 'graficos', 'charts', 'visualizacion', 'reportes', 'reports', 'resultados de encuesta', 'heatmap'],
    replies: [
      s('Un dashboard bueno responde una pregunta, no muestra todos los números. Empiezo por lo que la persona tiene que decidir y ordeno los datos para esa decisión.\n\nPor ejemplo, en Encuestas el mapa de calor por área compara grupos, pero los que tienen menos de cinco respuestas quedan reservados para cuidar el anonimato; y en Objetivos la lectura del ciclo se arma en cinco preguntas.', 'A good dashboard answers a question, it doesn’t show every number. I start from what the person has to decide and order the data for that decision.\n\nFor example, in Surveys the heatmap by area compares groups, but those with fewer than five answers stay reserved to protect anonymity; and in Goals reading a cycle is built around five questions.'),
    ],
    extras: join(CASE('encuestas'), CASE('objetivos')),
  },
  {
    id: 'branding',
    weight: 1.5,
    keys: ['logo', 'logos', 'logotipo', 'isotipo', 'imagotipo', 'marca', 'marcas', 'branding', 'brand', 'identidad visual', 'identity', 'icono', 'icon', 'orbe', 'orb'],
    replies: [
      s('Boceto un logo como cualquier problema: primero qué tiene que decir y después muchas formas de decirlo, a mano, antes de pulir una. Exploro direcciones con el mismo ADN, me quedo con lo que sobrevive y termino con la construcción y sus medidas, probándolo en todos los tamaños y temas.\n\nPor ejemplo, en Barberlytics la pregunta era cómo «barbería» y «métricas» se vuelven un solo signo. Boceté seis direcciones —impulso, peine, poste, navaja, placa y sello— y lo afiné en seis rondas: la flecha que sube se quedó, le di un pulso, el gradiente de IA, lo probé en los catorce temas y al final la flecha sola quedó como isotipo para el favicon y el ícono de la app.', 'I sketch a logo like any problem: first what it has to say, then many ways of saying it, by hand, before polishing one. I explore directions with the same DNA, keep what survives and finish with the construction and its measures, testing it at every size and theme.\n\nFor example, in Barberlytics the question was how “barbershop” and “metrics” become one sign. I sketched six directions —momentum, comb, pole, razor, plate and seal— and refined it in six rounds: the rising arrow stayed, I gave it a pulse, the AI gradient, tested it in all fourteen themes and in the end the arrow alone became the isotype for favicon and app icon.'),
    ],
    deep: s('También diseñé la presencia de Clipper, la IA: no un ícono sino un orbe. Lo construí desde el poste de barbería —franjas a 45°, recortadas en círculo— con el gradiente de IA, vidrio, anillo y halo, y tres estados: reposo, escucha y piensa. Y en Thema la barbería puede sacar su tema de color de su propio logo.', 'I also designed the presence of Clipper, the AI: not an icon but an orb. I built it from the barber pole —45° stripes, cut into a circle— with the AI gradient, glass, ring and halo, and three states: idle, listening and thinking. And in Thema a shop can pull its color theme from its own logo.'),
    extras: join(CASE('barberlytics'), sug('¿Cómo construiste el orbe de Clipper?', 'How did you build Clipper’s orb?')),
  },

  {
    id: 'motivation',
    keys: ['te gusta', 'gusta', 'pasion', 'motiva', 'motivacion', 'disfrutas', 'inspira', 'love', 'enjoy', 'passion'],
    replies: [
      s('Lo que más disfruto es el momento en que puntos sueltos se conectan: una queja en una reseña, un dato de uso y una idea de negocio que de pronto explican lo mismo. Y ahora, con IA, ver esa idea funcionando el mismo día.\n\nPor ejemplo, en Barberlytics esa conexión fue darme cuenta de que una barbería vive de lo que se repite; de ahí salió casi todo el producto.', 'What I enjoy most is the moment loose dots connect: a complaint in a review, a usage data point and a business idea that suddenly explain the same thing. And now, with AI, seeing that idea working the same day.\n\nFor example, in Barberlytics that connection was realizing a barbershop lives on what repeats; almost the whole product came from there.'),
    ],
    extras: CASE('barberlytics'),
  },

  /* ── IA ───────────────────────────────────────────────────────────── */
  {
    id: 'ai',
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
    weight: 1.2,
    keys: ['agente', 'agentes', 'agent', 'agents', 'asistente', 'assistant', 'chatbot', 'bot', 'clipper', 'rumbo', 'orbit', 'evaluaciones', 'evals', 'guardrails', 'alucin'],
    replies: [
      s('Cuando diseño un agente, diseño tres cosas además de la interfaz: qué puede consultar, qué puede proponer y qué nunca hace solo. Y lo evalúo con preguntas reales antes de soltarlo.\n\nPor ejemplo, Clipper nunca adivina: si una respuesta trae una cifra que no salió de los datos, el servidor la frena; y trata las notas de los clientes como datos, nunca como órdenes.', 'When I design an agent, I design three things besides the interface: what it can look up, what it can propose and what it never does alone. And I evaluate it with real questions before letting it loose.\n\nFor example, Clipper never guesses: if an answer has a figure that didn’t come from the data, the server stops it; and it treats client notes as data, never as orders.'),
    ],
    deep: s('En SellUp separé el trabajo en tres agentes con reglas propias: el primero busca empresas y no gasta créditos si lo gratis alcanza, el segundo encuentra a la persona que decide y el tercero prepara el primer contacto. Cada uno deja un recibo de lo que hizo.', 'In SellUp I split the work into three agents with their own rules: the first finds companies and spends no credits if free is enough, the second finds the decision-maker and the third prepares the first contact. Each leaves a receipt of what it did.'),
    extras: join(CASE('barberlytics'), CASE('sellup')),
  },

  /* ── Casos ────────────────────────────────────────────────────────── */
  {
    id: 'barberlytics',
    keys: ['barberlytics', 'barberia', 'barberias', 'barbershop', 'barber', 'thema', 'reserva', 'booking', 'calendario', 'calendar', 'plataforma'],
    replies: [
      s('Barberlytics es software para barberías que diseñé de punta a punta: el sistema de diseño (Thema), la reserva del cliente, el calendario del negocio y Clipper, su IA. Lo más difícil fue que cada barbería trabaja distinto; la respuesta fue un producto que se adapta a la barbería y no al revés.', 'Barberlytics is software for barbershops I designed end to end: the design system (Thema), client booking, the business calendar and Clipper, its AI. The hardest part was that every shop works differently; the answer was a product that adapts to the shop, not the other way around.'),
      s('Es mi proyecto más completo. Una barbería vive de lo que se repite: el corte de siempre, con el mismo barbero, cada pocas semanas. Con eso diseñé una reserva que pone «lo de siempre» a un toque y un calendario donde cada cita dice su siguiente paso: ingresar, sentar, cobrar.', 'It’s my most complete project. A barbershop lives on what repeats: the usual cut, same barber, every few weeks. With that I designed booking that puts “the usual” one tap away and a calendar where every visit shows its next step: check in, seat, charge.'),
    ],
    deep: s('Para la reserva comparé 15 productos y bocetamos cuatro versiones sobre un mismo motor. Para el calendario revisé 22 calendarios: nadie en el sector reacomodaba por retraso, así que el nuestro propone en la rejilla y todo se puede deshacer.', 'For booking I compared 15 products and sketched four versions on one engine. For the calendar I reviewed 22 calendars: nobody in the industry reflowed for delays, so ours proposes on the grid and everything can be undone.'),
    extras: join(CASE('barberlytics'), sug('¿Cómo funciona Clipper por dentro?', 'How does Clipper work inside?')),
  },
  {
    id: 'objetivos',
    keys: ['objetivos', 'objetivo', 'goals', 'goal', 'okr', 'okrs', 'cascada', 'cascade', 'desempeno', 'performance'],
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
    keys: ['proyectos', 'projects', 'casos', 'cases', 'portafolio', 'portfolio', 'trabajos', 'favorito', 'favorite', 'mejor proyecto', 'orgulloso', 'proud'],
    replies: [
      s('En el portafolio hay cuatro: Objetivos y Encuestas de UBITS, SellUp —la plataforma comercial con IA de UBITS— y Barberlytics, software para barberías que diseñé y construí de punta a punta. Si tuviera que elegir uno, Barberlytics, porque ahí junté todo: sistema de diseño, producto, IA y código.', 'There are four in the portfolio: UBITS Goals and Surveys, SellUp —UBITS’ AI sales platform— and Barberlytics, software for barbershops I designed and built end to end. If I had to pick one, Barberlytics, because it brings it all together: design system, product, AI and code.'),
    ],
    extras: join(CASE('barberlytics'), CASE('objetivos')),
  },

  /* ── Equipo y forma de ser ───────────────────────────────────────── */
  {
    id: 'team',
    keys: ['equipo', 'team', 'desarrolladores', 'developers', 'devs', 'ingenieros', 'engineers', 'handoff', 'entrega', ' pm ', 'product manager', 'colaboras', 'collaborate', 'trabajas con'],
    replies: [
      s('Trabajo muy pegado a producto y desarrollo. Llevo la evidencia a la mesa, dejo las decisiones escritas con su porqué y, cuando una idea genera dudas, la prototipo para que la discusión sea sobre algo real. El handoff casi no existe porque muchas veces entrego en código.\n\nPor ejemplo, en Objetivos trabajé con PM, front y QA en el rediseño del admin.', 'I work very close to product and engineering. I bring evidence to the table, write decisions down with their why and, when an idea raises doubts, I prototype it so the discussion is about something real. Handoff barely exists because I often deliver in code.\n\nFor example, in Goals I worked with PM, front-end and QA on the admin redesign.'),
    ],
    extras: CASE('objetivos'),
  },
  {
    id: 'stakeholders',
    keys: ['stakeholders', 'negociar', 'desacuerdo', 'disagree', 'conflicto', 'conflict', 'convencer', 'persuade', 'feedback', 'criticas', 'retroalimentacion', 'jefe', 'cliente dificil'],
    replies: [
      s('Cuando hay desacuerdo, bajo la discusión de opiniones a evidencia: qué dice el usuario, qué dice el dato y qué cuesta cada opción. Si sigue abierta, prototipo las dos y que la prueba decida.\n\nPor ejemplo, en una revisión de Objetivos alguien dijo que las métricas no le hacían sentido para incentivar el progreso; esa crítica nos llevó a cambiar el % por la constancia.', 'When there’s disagreement, I bring the discussion from opinions down to evidence: what the user says, what the data says and what each option costs. If it’s still open, I prototype both and let the test decide.\n\nFor example, in a Goals review someone said the metrics didn’t make sense to encourage progress; that critique led us to swap % for habit.'),
    ],
    extras: CASE('objetivos'),
  },
  {
    id: 'methodologies',
    keys: ['agile', 'scrum', 'design thinking', 'lean', 'lean ux', 'shape up', 'sprint', 'sprints', 'kanban', 'double diamond'],
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
    keys: ['experiencia', 'experience', 'trayectoria', 'carrera', 'career', 'anos', 'years', 'ubits', 'siigo', 'trabajado', 'worked', 'cargo', 'rol actual'],
    replies: [
      s('Llevo más de diez años en producto digital. Hoy estoy en UBITS como Diseñador UX/UI Senior Specialist, en software de Recursos Humanos (objetivos, encuestas y matriz de talento); entre 2022 y 2025 lideré el diseño de Barberlytics, y antes estuve en Siigo diseñando un ERP contable, de nómina a facturación electrónica. Empecé como diseñador gráfico y director de arte.', 'I have 10+ years in digital product. Today I’m at UBITS as Senior UX/UI Design Specialist, in HR software (goals, surveys and talent matrix); between 2022 and 2025 I led design at Barberlytics, and before that I was at Siigo designing an accounting ERP, from payroll to e-invoicing. I started as a graphic designer and art director.'),
    ],
    deep: s('En Siigo aprendí a diseñar productos complejos de punta a punta, de la investigación a la implementación; en UBITS conecto cada decisión con adopción y outcomes; en Barberlytics aprendí a diseñar y construir un producto completo con IA.', 'At Siigo I learned to design complex products end to end, from research to implementation; at UBITS I tie every decision to adoption and outcomes; at Barberlytics I learned to design and build a whole product with AI.'),
    extras: s('[[cv]]', '[[cv]]'),
  },
  {
    id: 'tools',
    keys: ['herramientas', 'herramienta', 'tools', 'tool', 'stack', 'figma', 'adobe', 'software', 'n8n', 'supabase', 'notion', 'jira', 'make', 'antigravity'],
    replies: [
      s('En IA uso Claude, Claude Code, Cursor, Antigravity, ChatGPT y Figma Make. En diseño, Figma y Adobe. Para producto y datos, Supabase, Notion, Jira y n8n o Make. La herramienta cambia; el criterio se queda.\n\nPor ejemplo, Barberlytics combina Figma, Claude Code, React, TypeScript y Vercel.', 'For AI I use Claude, Claude Code, Cursor, Antigravity, ChatGPT and Figma Make. For design, Figma and Adobe. For product and data, Supabase, Notion, Jira and n8n or Make. Tools change; judgment stays.\n\nFor example, Barberlytics combines Figma, Claude Code, React, TypeScript and Vercel.'),
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
    keys: ['contacto', 'contactarte', 'contact', 'correo', 'email', 'mail', 'whatsapp', 'telefono', 'phone', 'llamar', 'call', 'linkedin', 'disponible', 'disponibilidad', 'available', 'remoto', 'remote', 'ubicacion', 'donde vives', 'location'],
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
    id: 'hello',
    keys: ['hola', 'hello', 'hi', 'buenas', 'hey', 'buen dia', 'buenos dias', 'buenas tardes', 'good morning', 'que tal', 'saludos'],
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
