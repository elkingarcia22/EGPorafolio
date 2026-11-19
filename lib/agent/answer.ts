import type { Locale, L } from '@/lib/i18n'
import type { Project } from '@/lib/content/projects'
import { JOBS, PROFILE, TOOL_GROUPS } from '@/lib/content/profile'

/**
 * Respaldo local del agente: si el modelo no está disponible (sin clave o sin red), responde con
 * reglas sobre el mismo contenido, en primera persona y con las mismas marcas [[…]] que usa la
 * interfaz para mostrar casos, contacto y preguntas siguientes.
 */
interface Intent {
  keys: readonly string[]
  answer: (locale: Locale, projects: readonly Project[]) => string
}

const pick = (text: L, locale: Locale) => text[locale]
const tail = (...lines: string[]) => `\n\n${lines.join('\n')}`

const INTENTS: readonly Intent[] = [
  {
    keys: ['metrica', 'metric', 'negocio', 'business', 'kpi', 'medir', 'measure', 'impacto', 'impact', 'resultado', 'outcome'],
    answer: (l) =>
      pick({
        es: 'Empiezo por la métrica antes que por la pantalla: qué tiene que moverse en el negocio —adopción, conversión, retención, tiempo ahorrado— y qué comportamiento la mueve. En Barberlytics, por ejemplo, la meta era que reservar «lo de siempre» tomara un toque, porque de eso viven las barberías: de lo que se repite. Después mido si el diseño de verdad cambió ese comportamiento.',
        en: 'I start from the metric, not the screen: what has to move in the business —adoption, conversion, retention, time saved— and which behavior moves it. In Barberlytics, for example, the goal was booking “the usual” in one tap, because that’s what barbershops live on: what repeats. Then I measure whether the design actually changed that behavior.',
      }, l) + tail('[[caso:barberlytics]]', pick({ es: '[[sugerencia:¿Cómo usas la IA en el proceso?]]', en: '[[sugerencia:How do you use AI in the process?]]' }, l)),
  },
  {
    keys: ['vibe', 'codigo', 'code', 'construy', 'build', 'programa', 'cursor', 'claude code', 'prototip'],
    answer: (l) =>
      pick({
        es: 'Diseño y también construyo. Con Claude Code y Cursor paso de la idea a un producto funcionando en días: prototipos en código para probar con personas reales, y productos completos como Barberlytics. Este mismo portafolio lo construí así. Para mí el vibe coding no reemplaza el criterio: lo acelera.',
        en: 'I design and I also build. With Claude Code and Cursor I go from idea to a working product in days: coded prototypes to test with real people, and whole products like Barberlytics. I built this very portfolio that way. To me vibe coding doesn’t replace judgment: it speeds it up.',
      }, l) + tail('[[caso:barberlytics]]', pick({ es: '[[sugerencia:¿Cómo diseñaste a Clipper, su IA?]]', en: '[[sugerencia:How did you design Clipper, its AI?]]' }, l)),
  },
  {
    keys: [' ia ', ' ai ', 'inteligencia', 'claude', 'llm', 'artificial', 'agente', 'agent', 'clipper', 'rumbo'],
    answer: (l) =>
      pick({
        es: 'Uso la IA en dos lados. En el proceso: agrupar investigación, comparar variantes y prototipar en código. Y dentro de los productos: Clipper, el asistente de Barberlytics, responde con los datos del negocio, nunca adivina una cifra y no cambia nada sin que una persona lo apruebe. Esa última regla es la que más confianza da.',
        en: 'I use AI in two places. In the process: clustering research, comparing variants and prototyping in code. And inside products: Clipper, Barberlytics’ assistant, answers with the business’s own data, never guesses a figure and changes nothing without a person approving it. That last rule is what builds the most trust.',
      }, l) + tail('[[caso:barberlytics]]', '[[caso:sellup]]'),
  },
  {
    keys: ['barber'],
    answer: (l) =>
      pick({
        es: 'Barberlytics es software para barberías que diseñé de punta a punta: el sistema de diseño (Thema), la reserva del cliente, el calendario del negocio y Clipper, su IA. Lo más difícil fue que cada barbería trabaja distinto; la respuesta fue un producto que se adapta a la barbería y no al revés.',
        en: 'Barberlytics is software for barbershops I designed end to end: the design system (Thema), client booking, the business calendar and Clipper, its AI. The hardest part was that every shop works differently; the answer was a product that adapts to the shop, not the other way around.',
      }, l) + tail('[[caso:barberlytics]]', pick({ es: '[[sugerencia:¿Cómo funciona la reserva en un toque?]]', en: '[[sugerencia:How does one-tap booking work?]]' }, l)),
  },
  {
    keys: ['objetivo', 'goal', 'okr'],
    answer: (l) =>
      pick({
        es: 'En Objetivos de UBITS rediseñé el producto completo: de una sola pantalla de configuración a todo el ciclo —crear, alinear en cascada, aprobar, reportar y leer resultados—, que se adapta a cómo cada empresa trabaja sus objetivos.',
        en: 'In UBITS Goals I redesigned the whole product: from a single setup screen to the full cycle —create, cascade, approve, report and read results—, adapting to how each company works its goals.',
      }, l) + tail('[[caso:objetivos]]'),
  },
  {
    keys: ['sellup', 'venta', 'sales', 'prospect'],
    answer: (l) =>
      pick({ es: 'SellUp es sobre vender sin buscar a ciegas: agentes que encuentran empresas, contactos y el primer mensaje, y una persona que decide.', en: 'SellUp is about selling without searching blind: agents that find companies, contacts and the first message, and a person who decides.' }, l) + tail('[[caso:sellup]]'),
  },
  {
    keys: ['encuesta', 'survey', 'clima', 'nom 035'],
    answer: (l) =>
      pick({ es: 'En Encuestas de UBITS diseñé un constructor que arma desde una encuesta sencilla hasta una normativa, y resultados que se vuelven acciones.', en: 'In UBITS Surveys I designed a builder that goes from a simple survey to a regulatory one, and results that turn into actions.' }, l) + tail('[[caso:encuestas]]'),
  },
  {
    keys: ['proceso', 'process', 'metodo', 'método', 'como trabajas', 'how do you work', 'primero', 'first'],
    answer: (l) =>
      pick({
        es: 'Voy de puntos sueltos a conexiones: escucho el problema sin filtros, busco lo que se repite, lo resumo en una pregunta y pocos principios, bocetos a mano, pantallas reales, y mido. Lo primero que diseño es lo que más se repite en el día a día de quien lo usa.',
        en: 'I go from loose dots to connections: I listen to the problem unfiltered, look for what repeats, sum it up in one question and a few principles, hand sketches, real screens, and I measure. What I design first is what repeats most in the user’s day.',
      }, l) + tail(pick({ es: '[[sugerencia:¿Cómo mides si funcionó?]]', en: '[[sugerencia:How do you measure if it worked?]]' }, l)),
  },
  {
    keys: ['contrat', 'hire', 'por que', 'why you', 'trabajar contigo', 'work with you', 'equipo', 'team'],
    answer: (l) =>
      pick({
        es: 'Porque conecto lo que normalmente vive separado: investigación, negocio, diseño y tecnología. Llego con evidencia, diseño con métricas en mente y, cuando hace falta, construyo el prototipo yo mismo con IA para validar rápido. Si quieres, hablemos de lo que tu equipo necesita.',
        en: 'Because I connect what usually lives apart: research, business, design and technology. I come with evidence, design with metrics in mind and, when needed, build the prototype myself with AI to validate fast. If you like, let’s talk about what your team needs.',
      }, l) + tail('[[contacto]]'),
  },
  {
    keys: ['experiencia', 'experience', 'trabaj', 'worked', 'años', 'years', 'carrera', 'career', 'ubits', 'siigo', 'trayectoria'],
    answer: (l) => {
      const jobs = JOBS.map((j) => `- ${j.company} (${j.period}): ${pick(j.roles[0].title, l)}`).join('\n')
      return pick({ es: `Llevo más de diez años en producto digital. Lo más reciente:\n${jobs}\n\nAntes fui diseñador gráfico y director de arte; de ahí viene mi ojo visual.`, en: `I have 10+ years in digital product. Most recent:\n${jobs}\n\nBefore that I was a graphic designer and art director; that’s where my visual eye comes from.` }, l) + tail('[[cv]]')
    },
  },
  {
    keys: ['herramienta', 'tool', 'figma', 'stack', 'software'],
    answer: (l) => pick({ es: 'Mi caja de herramientas:', en: 'My toolbox:' }, l) + '\n' + TOOL_GROUPS.map((g) => `- ${pick(g.title, l)}: ${g.tools.join(', ')}`).join('\n'),
  },
  {
    keys: ['contacto', 'contact', 'correo', 'email', 'mail', 'whatsapp', 'telefono', 'phone', 'llamar', 'call', 'hablar', 'talk'],
    answer: (l) =>
      pick({ es: `Con gusto. Escríbeme a ${PROFILE.email} o por WhatsApp al ${PROFILE.phoneDisplay}. Estoy en ${PROFILE.location.es}.`, en: `Gladly. Email me at ${PROFILE.email} or WhatsApp me at ${PROFILE.phoneDisplay}. I’m based in ${PROFILE.location.en}.` }, l) + tail('[[contacto]]'),
  },
  {
    keys: ['hoja de vida', 'cv', 'resume', 'currículum', 'curriculum'],
    answer: (l) => pick({ es: 'Aquí la tienes.', en: 'Here it is.' }, l) + tail('[[cv]]'),
  },
  {
    keys: ['estudio', 'educa', 'study', 'education', 'platzi', 'universidad', 'university'],
    answer: (l) =>
      pick({
        es: 'Soy diseñador gráfico profesional (Los Libertadores, 2010–2014), tengo la certificación internacional UX-PM niveles 1, 2 y 3 (UXalliance, 2018) y las carreras de UI, UX y Diseño de Producto de Platzi.',
        en: 'I’m a graphic designer (Los Libertadores, 2010–2014), hold the International UX-PM certification levels 1, 2 and 3 (UXalliance, 2018) and Platzi’s UI, UX and Product Design tracks.',
      }, l) + tail('[[cv]]'),
  },
  {
    keys: ['hola', 'hello', ' hi ', 'buenas', ' hey '],
    answer: (l) =>
      pick({ es: '¡Hola! Qué bueno tenerte por aquí. Pregúntame por producto, métricas, UX/UI, IA o cualquiera de mis casos.', en: 'Hi! Great to have you here. Ask me about product, metrics, UX/UI, AI or any of my cases.' }, l) +
      tail(pick({ es: '[[sugerencia:¿Cómo usas la IA?]]\n[[sugerencia:Cuéntame de Barberlytics]]', en: '[[sugerencia:How do you use AI?]]\n[[sugerencia:Tell me about Barberlytics]]' }, l)),
  },
]

const FALLBACK: L = {
  es: 'Esa no la tengo aquí, pero me encantaría conversarla. Mientras, pregúntame por mis casos, cómo mido un producto o cómo uso la IA para construir.',
  en: 'I don’t have that one here, but I’d love to talk it through. Meanwhile, ask me about my cases, how I measure a product or how I use AI to build.',
}

const fold = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

/** La pregunta con espacios a los lados y sin signos: así « ia » no coincide dentro de «deberíamos». */
function normalize(text: string): string {
  return ` ${fold(text).replace(/[¿?¡!.,;:()«»"]/g, ' ').replace(/\s+/g, ' ')} `
}

export function answerQuestion(question: string, locale: Locale, projects: readonly Project[]): string {
  const q = normalize(question)
  const intent = INTENTS.find((i) => i.keys.some((k) => q.includes(fold(k))))
  return intent ? intent.answer(locale, projects) : pick(FALLBACK, locale) + tail('[[contacto]]')
}
