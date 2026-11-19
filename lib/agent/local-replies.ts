import type { L } from '@/lib/i18n'
import { PROFILE } from '@/lib/content/profile'

/*
 * Respuestas del agente cuando no hay modelo (sin clave, sin créditos o con error). Están escritas
 * a mano, en primera persona, con datos del portafolio; cada tema tiene varias formas de decirse y
 * una versión más profunda para cuando la persona pide detalle.
 */

export interface Topic {
  id: string
  /** Palabras que lo activan (sin tildes; las cortas van con espacios a los lados). */
  keys: readonly string[]
  replies: readonly L[]
  /** Para «¿y eso cómo?», «cuéntame más», «¿por qué?» después de este tema. */
  deep?: L
  /** Marcas para la interfaz: casos, contacto, hoja de vida y preguntas siguientes. */
  extras?: { es: string; en: string }
}

const s = (es: string, en: string) => ({ es, en })

export const TOPICS: readonly Topic[] = [
  {
    id: 'hire',
    keys: ['contrat', 'hire', 'por que deberiamos', 'por que tu', 'why you', 'why should', 'trabajar contigo', 'work with you', 'que te diferencia', 'what makes you'],
    replies: [
      s('Porque conecto lo que casi siempre vive separado: investigación, negocio, diseño y tecnología. Llego con evidencia, diseño pensando en la métrica que hay que mover y, cuando hace falta, construyo el prototipo yo mismo con IA para validar en días y no en semanas. Si quieres, hablemos de lo que tu equipo necesita.', 'Because I connect what usually lives apart: research, business, design and technology. I come with evidence, design around the metric that needs to move and, when needed, build the prototype myself with AI to validate in days, not weeks. If you like, let’s talk about what your team needs.'),
      s('Te diría tres cosas. Pienso el producto completo, no pantallas sueltas. Mido: cada decisión la amarro a adopción, uso o tiempo ahorrado. Y no me quedo en Figma: con Claude Code y Cursor llevo las ideas a algo que funciona. Eso le ahorra mucho ida y vuelta a un equipo.', 'I’d say three things. I think about the whole product, not loose screens. I measure: every decision ties to adoption, usage or time saved. And I don’t stop at Figma: with Claude Code and Cursor I take ideas to something that works. That saves a team a lot of back and forth.'),
    ],
    deep: s('Un ejemplo concreto: en Objetivos de UBITS el producto terminaba al crear el ciclo. Lo convertí en el ciclo completo —crear, alinear, aprobar, reportar y leer resultados— y lo validé con un prototipo en código antes de pedirle tiempo de desarrollo al equipo.', 'A concrete example: in UBITS Goals the product ended when the cycle was created. I turned it into the full cycle —create, align, approve, report and read results— and validated it with a coded prototype before asking the team for development time.'),
    extras: s('[[contacto]]\n[[sugerencia:¿Cómo conectas diseño con métricas?]]', '[[contacto]]\n[[sugerencia:How do you tie design to metrics?]]'),
  },
  {
    id: 'metrics',
    keys: ['metrica', 'metric', 'negocio', 'business', 'kpi', 'medir', 'mides', 'measure', 'impacto', 'impact', 'resultado', 'outcome', 'conversion', 'retencion', 'retention', 'adopcion', 'adoption'],
    replies: [
      s('Empiezo por la métrica, no por la pantalla: qué tiene que moverse en el negocio —adopción, conversión, retención, tiempo ahorrado— y qué comportamiento la mueve. En Barberlytics la apuesta fue que reservar «lo de siempre» tomara un toque, porque de eso viven las barberías: de lo que se repite.', 'I start from the metric, not the screen: what has to move in the business —adoption, conversion, retention, time saved— and which behavior moves it. In Barberlytics the bet was making booking “the usual” take one tap, because that’s what barbershops live on: what repeats.'),
      s('Para mí un diseño está terminado cuando cambia un comportamiento que le importa al negocio. Por eso defino antes la señal: en Objetivos no era el % de avance, que castiga a quien se pone metas ambiciosas, sino la constancia de reportar. Cambiar la métrica cambió el diseño entero.', 'To me a design is done when it changes a behavior the business cares about. So I define the signal first: in Goals it wasn’t the % of progress, which punishes ambitious goals, but the habit of reporting. Changing the metric changed the whole design.'),
    ],
    deep: s('En la práctica: escribo la hipótesis («si la tarjeta muestra el siguiente paso, la recepción cobra sin abrir la cita»), defino la señal que la confirma y diseño el experimento más barato para verla. Varias cifras de impacto en mis casos son de referencia porque algunos rediseños aún no están en producción; lo aclaro siempre.', 'In practice: I write the hypothesis (“if the card shows the next step, the front desk charges without opening the visit”), define the signal that confirms it and design the cheapest experiment to see it. Several impact figures in my cases are reference values because some redesigns aren’t in production yet; I always say so.'),
    extras: s('[[caso:barberlytics]]\n[[sugerencia:¿Cómo usas la IA en el proceso?]]', '[[caso:barberlytics]]\n[[sugerencia:How do you use AI in the process?]]'),
  },
  {
    id: 'vibe',
    keys: ['vibe', 'codigo', ' code', 'construy', 'build', 'programa', 'cursor', 'claude code', 'prototip'],
    replies: [
      s('Diseño y también construyo. Con Claude Code y Cursor paso de la idea a algo que funciona en días: prototipos en código para probar con personas reales y productos completos como Barberlytics. Este mismo portafolio lo construí así. El vibe coding no reemplaza el criterio; lo acelera.', 'I design and I also build. With Claude Code and Cursor I go from idea to something that works in days: coded prototypes to test with real people and whole products like Barberlytics. I built this very portfolio that way. Vibe coding doesn’t replace judgment; it speeds it up.'),
      s('Lo que más cambió en mi forma de trabajar es que ya no entrego solo diseños: entrego prototipos que se pueden usar. Eso cambia las conversaciones con negocio y con desarrollo, porque discutimos sobre algo real y no sobre una imagen.', 'What changed my work the most is that I no longer hand over designs only: I hand over prototypes people can use. That changes conversations with business and engineering, because we discuss something real, not a picture.'),
    ],
    deep: s('Mi forma: primero las reglas del sistema de diseño escritas para que la IA las respete, después piezas pequeñas que pruebo en el navegador, y validaciones que frenan lo que se sale de la línea. En Barberlytics eso se volvió Thema: 218 componentes que también sigue la IA.', 'My way: first the design system rules written so AI respects them, then small pieces I test in the browser, and checks that stop anything off-line. In Barberlytics that became Thema: 218 components the AI follows too.'),
    extras: s('[[caso:barberlytics]]\n[[sugerencia:¿Cómo diseñaste a Clipper?]]', '[[caso:barberlytics]]\n[[sugerencia:How did you design Clipper?]]'),
  },
  {
    id: 'ai',
    keys: [' ia ', ' ai ', 'inteligencia', 'claude', 'llm', 'artificial', 'agente', 'agent', 'clipper', 'rumbo', 'orbit', 'modelo', 'model'],
    replies: [
      s('Uso la IA en dos lados. En el proceso: agrupar investigación, comparar variantes y prototipar en código. Y dentro de los productos: Clipper, el asistente de Barberlytics, responde con los datos del negocio, nunca adivina una cifra y no cambia nada sin que una persona lo apruebe. Esa última regla es la que más confianza genera.', 'I use AI in two places. In the process: clustering research, comparing variants and prototyping in code. And inside products: Clipper, Barberlytics’ assistant, answers with the business’s data, never guesses a figure and changes nothing without a person approving. That last rule builds the most trust.'),
      s('Mi regla con la IA en un producto es simple: propone, una persona decide. Lo apliqué en Clipper, en los agentes de SellUp —que encuentran la empresa, la persona y el primer mensaje— y en Orbit, el asistente de Encuestas. La IA rápida y sin control quita confianza; con vista previa y deshacer, la gana.', 'My rule for AI in a product is simple: it proposes, a person decides. I applied it in Clipper, in SellUp’s agents —which find the company, the person and the first message— and in Orbit, Surveys’ assistant. Fast AI without control costs trust; with preview and undo, it earns it.'),
    ],
    deep: s('En Clipper diseñé también cómo piensa: 18 herramientas (13 consultan y 5 proponen), 60 preguntas de evaluación y un filtro que frena cualquier número que no salga de los datos. Si una respuesta trae una cifra inventada, el servidor no la muestra.', 'In Clipper I also designed how it thinks: 18 tools (13 read and 5 propose), 60 evaluation questions and a guard that stops any number not coming from the data. If an answer has a made-up figure, the server won’t show it.'),
    extras: s('[[caso:barberlytics]]\n[[caso:sellup]]', '[[caso:barberlytics]]\n[[caso:sellup]]'),
  },
  {
    id: 'barberlytics',
    keys: ['barber', 'thema', 'reserva', 'booking', 'calendario', 'calendar', 'plataforma'],
    replies: [
      s('Barberlytics es software para barberías que diseñé de punta a punta: el sistema de diseño (Thema), la reserva del cliente, el calendario del negocio y Clipper, su IA. Lo más difícil fue que cada barbería trabaja distinto; la respuesta fue un producto que se adapta a la barbería y no al revés.', 'Barberlytics is software for barbershops I designed end to end: the design system (Thema), client booking, the business calendar and Clipper, its AI. The hardest part was that every shop works differently; the answer was a product that adapts to the shop, not the other way around.'),
      s('Es mi proyecto más completo. Empecé por entender que una barbería vive de lo que se repite: el corte de siempre, con el mismo barbero, cada pocas semanas. Con eso diseñé una reserva que pone «lo de siempre» en un toque y un calendario donde cada cita dice su siguiente paso: ingresar, sentar, cobrar.', 'It’s my most complete project. I started by understanding a barbershop lives on what repeats: the usual cut, same barber, every few weeks. With that I designed booking that puts “the usual” one tap away and a calendar where every visit shows its next step: check in, seat, charge.'),
    ],
    deep: s('Para la reserva comparé 15 productos y bocetamos cuatro versiones sobre un mismo motor. Para el calendario revisé 22 calendarios: nadie en el sector reacomodaba por retraso, así que el nuestro propone en la rejilla y todo se puede deshacer.', 'For booking I compared 15 products and sketched four versions on one engine. For the calendar I reviewed 22 calendars: nobody in the industry reflowed for delays, so ours proposes on the grid and everything can be undone.'),
    extras: s('[[caso:barberlytics]]\n[[sugerencia:¿Cómo funciona Clipper por dentro?]]', '[[caso:barberlytics]]\n[[sugerencia:How does Clipper work inside?]]'),
  },
  {
    id: 'objetivos',
    keys: ['objetivo', 'goal', 'okr', 'cascada', 'cascade'],
    replies: [
      s('En Objetivos de UBITS el producto era una sola pantalla para configurar ciclos: terminaba ahí. Lo rediseñé como el ciclo completo —crear, alinear en cascada, aprobar, reportar y leer resultados— para admin, líder y colaborador, y que se adapte a cómo cada empresa trabaja sus objetivos.', 'In UBITS Goals the product was a single screen to set up cycles: it ended there. I redesigned it as the full cycle —create, cascade, approve, report and read results— for admin, lead and employee, adapting to how each company works its goals.'),
    ],
    deep: s('Cuatro principios lo ordenan: el norte primero (todo cuelga de un objetivo de empresa), acordar antes de medir (sin aprobación no hay avance), constancia antes que % y contar sin exponer: en público solo se nombra para reconocer.', 'Four principles order it: north first (everything hangs from a company goal), agree before measuring (no approval, no progress), habit over % and count without exposing: in public you only name people to praise them.'),
    extras: s('[[caso:objetivos]]', '[[caso:objetivos]]'),
  },
  {
    id: 'sellup',
    keys: ['sellup', 'venta', 'sales', 'prospect', 'comercial', 'hubspot', 'apollo'],
    replies: [
      s('SellUp nace de una pregunta del equipo comercial de UBITS: con 206.000 empresas posibles, ¿a cuál llamamos mañana, a quién y qué le decimos? Diseñé tres agentes que encuentran la empresa, dan con la persona que decide y preparan el primer contacto, con una persona aprobando cada paso.', 'SellUp comes from a question by UBITS’ sales team: with 206,000 possible companies, which one do we call tomorrow, who, and what do we say? I designed three agents that find the company, reach the decision-maker and prepare the first contact, with a person approving each step.'),
    ],
    deep: s('Lo clave fue el costo y la confianza: nada se paga si lo gratis alcanza, y nada entra a HubSpot sin revisión. Antes se buscaba a mano, sin criterio común y con duplicados.', 'The key was cost and trust: nothing gets paid for if free is enough, and nothing enters HubSpot unreviewed. Before, people searched by hand, with no shared criteria and with duplicates.'),
    extras: s('[[caso:sellup]]', '[[caso:sellup]]'),
  },
  {
    id: 'encuestas',
    keys: ['encuesta', 'survey', 'clima laboral', 'clima organizacional', 'nom 035', 'enps', 'anonim'],
    replies: [
      s('Encuestas de UBITS era crear en blanco o con plantilla, sin traer lo que la empresa ya había medido. Lo rediseñé como un solo constructor que sirve igual para un pulso de cinco preguntas, un clima de cincuenta o la norma del país, sin que nadie tema responder con honestidad.', 'UBITS Surveys meant starting blank or from a template, with no way to bring what the company had already measured. I redesigned it as a single builder that works for a five-question pulse, a fifty-question climate survey or the country’s regulation, without anyone fearing to answer honestly.'),
    ],
    deep: s('La parte más delicada fue el anonimato: si un grupo tiene menos de cinco respuestas, sus resultados no se muestran. Y una encuesta no termina cuando se cierra; termina cuando alguien hace algo con ella, por eso los resultados se vuelven acciones.', 'The most delicate part was anonymity: if a group has fewer than five answers, its results aren’t shown. And a survey doesn’t end when it closes; it ends when someone acts on it, so results turn into actions.'),
    extras: s('[[caso:encuestas]]', '[[caso:encuestas]]'),
  },
  {
    id: 'process',
    keys: ['proceso', 'process', 'metodo', 'method', 'como trabajas', 'how do you work', 'primero', 'first', 'research', 'investigacion', 'empiezas', 'start'],
    replies: [
      s('Voy de puntos sueltos a conexiones: escucho el problema sin filtros, busco lo que se repite, lo resumo en una pregunta y pocos principios, bocetos a mano, pantallas reales y mido. Lo primero que diseño es lo que más se repite en el día de quien lo usa.', 'I go from loose dots to connections: I listen to the problem unfiltered, look for what repeats, sum it up in one question and a few principles, hand sketches, real screens, and I measure. What I design first is what repeats most in the user’s day.'),
      s('Antes de abrir Figma necesito dos cosas: evidencia y una pregunta. La evidencia sale de entrevistas, datos, soporte y de comparar productos; la pregunta es un «¿cómo podríamos…?» que decide qué entra y qué no. Con eso los bocetos van rápido.', 'Before opening Figma I need two things: evidence and a question. The evidence comes from interviews, data, support and comparing products; the question is a “how might we…?” that decides what gets in. With that, sketching goes fast.'),
    ],
    deep: s('Cuento cada caso en ocho etapas: los puntos, patrones, la idea, bocetos, forma, IA en el proceso, impacto y demo. La IA me acompaña en todas: agrupar notas, generar variantes, prototipar y evaluar.', 'I tell every case in eight stages: dots, patterns, idea, sketches, form, AI in the process, impact and demo. AI comes along in all of them: clustering notes, generating variants, prototyping and evaluating.'),
    extras: s('[[sugerencia:¿Cómo mides si funcionó?]]', '[[sugerencia:How do you measure if it worked?]]'),
  },
  {
    id: 'design-system',
    keys: ['sistema de diseno', 'design system', 'tokens', 'componentes', 'components', ' ui ', 'visual', 'interfaz', 'interface'],
    replies: [
      s('Me gustan los sistemas que dejan personalizar sin romper. En Thema, el sistema de Barberlytics, basta un color para que la app entera tome la identidad de la barbería, mientras éxito, error y aviso significan lo mismo en todos los temas. Son 218 componentes, y la IA lee las mismas reglas que las personas.', 'I like systems that let you customize without breaking. In Thema, Barberlytics’ system, one color is enough for the whole app to take on the shop’s identity, while success, error and warning mean the same in every theme. It’s 218 components, and AI reads the same rules people do.'),
    ],
    extras: s('[[caso:barberlytics]]', '[[caso:barberlytics]]'),
  },
  {
    id: 'experience',
    keys: ['experiencia', 'experience', 'trabajado', 'worked', 'anos', 'years', 'carrera', 'career', 'ubits', 'siigo', 'trayectoria'],
    replies: [
      s('Llevo más de diez años en producto digital. Hoy estoy en UBITS como Diseñador UX/UI Senior Specialist, en software de Recursos Humanos; entre 2022 y 2025 lideré el diseño de Barberlytics, y antes estuve en Siigo diseñando un ERP contable, de nómina a facturación electrónica. Empecé como diseñador gráfico y director de arte; de ahí viene mi ojo visual.', 'I have 10+ years in digital product. Today I’m at UBITS as Senior UX/UI Design Specialist, in HR software; between 2022 and 2025 I led design at Barberlytics, and before that I was at Siigo designing an accounting ERP, from payroll to e-invoicing. I started as a graphic designer and art director; that’s where my visual eye comes from.'),
    ],
    deep: s('En Siigo aprendí a trabajar con metodologías como Design Thinking, Lean UX, Agile UX y Shape Up; en UBITS conecto cada decisión con adopción y outcomes; en Barberlytics aprendí a diseñar y construir un producto completo con IA.', 'At Siigo I learned to work with Design Thinking, Lean UX, Agile UX and Shape Up; at UBITS I tie every decision to adoption and outcomes; at Barberlytics I learned to design and build a whole product with AI.'),
    extras: s('[[cv]]', '[[cv]]'),
  },
  {
    id: 'team',
    keys: ['equipo', 'team', 'trabajas con', 'desarrolladores', 'developers', ' pm ', 'product manager', 'stakeholder', 'colabor', 'lider', 'lead'],
    replies: [
      s('Trabajo muy pegado a producto y desarrollo. Llevo la evidencia a la mesa, dejo las decisiones escritas con su porqué y, cuando una idea genera dudas, la prototipo para que la discusión sea sobre algo real. En Objetivos trabajé con PM, front y QA en el rediseño del admin.', 'I work very close to product and engineering. I bring evidence to the table, write decisions down with their why and, when an idea raises doubts, I prototype it so the discussion is about something real. In Goals I worked with PM, front-end and QA on the admin redesign.'),
    ],
    extras: s('[[caso:objetivos]]', '[[caso:objetivos]]'),
  },
  {
    id: 'tools',
    keys: ['herramienta', 'tool', 'figma', 'stack', 'software', 'n8n', 'supabase', 'notion', 'jira'],
    replies: [
      s('En IA: Claude, Claude Code, Cursor, Antigravity, ChatGPT y Figma Make. En diseño, Figma y Adobe. Y para producto y datos, Supabase, Notion, Jira y n8n o Make. Pero la herramienta cambia; lo que se queda es el criterio.', 'For AI: Claude, Claude Code, Cursor, Antigravity, ChatGPT and Figma Make. For design, Figma and Adobe. And for product and data, Supabase, Notion, Jira and n8n or Make. Tools change, though; judgment stays.'),
    ],
  },
  {
    id: 'education',
    keys: ['estudio', 'estudiaste', 'educa', 'study', 'education', 'platzi', 'universidad', 'university', 'certific'],
    replies: [
      s('Soy diseñador gráfico profesional de Los Libertadores (2010–2014). Tengo la certificación internacional UX-PM niveles 1, 2 y 3 de UXalliance (2018) y las carreras de UI, UX y Diseño de Producto de Platzi.', 'I’m a graphic designer from Los Libertadores (2010–2014). I hold the International UX-PM certification levels 1, 2 and 3 from UXalliance (2018) and Platzi’s UI, UX and Product Design tracks.'),
    ],
    extras: s('[[cv]]', '[[cv]]'),
  },
  {
    id: 'money',
    keys: ['salario', 'salary', 'cobras', 'tarifa', 'rate', 'precio', 'price', 'cuanto cuesta', 'how much'],
    replies: [s('Eso prefiero hablarlo directo, porque depende mucho del alcance y del equipo. Escríbeme y lo conversamos.', 'I’d rather talk about that directly, since it depends a lot on scope and team. Write to me and we’ll talk it through.')],
    extras: s('[[contacto]]', '[[contacto]]'),
  },
  {
    id: 'contact',
    keys: ['contacto', 'contact', 'correo', 'email', 'mail', 'whatsapp', 'telefono', 'phone', 'llamar', ' call', 'hablar', 'talk', 'disponible', 'available', 'remoto', 'remote'],
    replies: [s(`Con gusto. Escríbeme a ${PROFILE.email} o por WhatsApp al ${PROFILE.phoneDisplay}. Estoy en ${PROFILE.location.es} y trabajo en remoto o híbrido.`, `Gladly. Email me at ${PROFILE.email} or WhatsApp me at ${PROFILE.phoneDisplay}. I’m based in ${PROFILE.location.en} and work remote or hybrid.`)],
    extras: s('[[contacto]]', '[[contacto]]'),
  },
  {
    id: 'cv',
    keys: ['hoja de vida', ' cv', 'resume', 'curriculum'],
    replies: [s('Claro, aquí la tienes. Si quieres, también te cuento lo que no cabe en una hoja de vida: cómo tomo decisiones.', 'Sure, here it is. If you like, I can also tell you what doesn’t fit in a résumé: how I make decisions.')],
    extras: s('[[cv]]', '[[cv]]'),
  },
  {
    id: 'hello',
    keys: ['hola', 'hello', ' hi ', 'buenas', ' hey ', 'buen dia', 'good morning'],
    replies: [
      s('¡Hola! Qué bueno tenerte por aquí. Pregúntame lo que quieras: cómo pienso un producto, cómo lo mido o cómo uso la IA para construirlo.', 'Hi! Great to have you here. Ask me anything: how I think a product through, how I measure it or how I use AI to build it.'),
      s('¡Hola! Soy Elkin. ¿Te cuento de algún caso o prefieres saber cómo trabajo?', 'Hi! I’m Elkin. Shall I tell you about a case, or would you rather know how I work?'),
    ],
    extras: s('[[sugerencia:Cuéntame de Barberlytics]]\n[[sugerencia:¿Cómo usas la IA?]]', '[[sugerencia:Tell me about Barberlytics]]\n[[sugerencia:How do you use AI?]]'),
  },
  {
    id: 'thanks',
    keys: ['gracias', 'thanks', 'thank you', 'genial', 'great', 'perfecto'],
    replies: [s('¡Con gusto! Si quieres seguir la conversación en persona, aquí estoy.', 'My pleasure! If you’d like to continue the conversation in person, I’m here.')],
    extras: s('[[contacto]]', '[[contacto]]'),
  },
]

/** Preguntas que piden ir más a fondo en el tema anterior. */
export const FOLLOW_UP = ['y eso', 'como asi', 'por que', 'cuentame mas', 'mas detalle', 'un ejemplo', 'ejemplo', 'como lo', 'profundiza', 'y luego', 'tell me more', 'why', 'how so', 'example', 'more detail', 'go deeper', 'and then']

export const FALLBACK: readonly L[] = [
  s('Esa no la tengo a mano, pero me encantaría conversarla. Mientras, te puedo contar de mis casos, de cómo mido un producto o de cómo uso la IA para construir.', 'I don’t have that one at hand, but I’d love to talk it through. Meanwhile, I can tell you about my cases, how I measure a product or how I use AI to build.'),
  s('Buena pregunta; prefiero no improvisarte una respuesta. Si quieres, la hablamos directo. Y si te sirve, pregúntame por Barberlytics, Objetivos, SellUp o Encuestas.', 'Good question; I’d rather not improvise an answer. If you like, let’s talk directly. And if it helps, ask me about Barberlytics, Goals, SellUp or Surveys.'),
]
