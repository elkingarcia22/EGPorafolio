import type { Locale, L } from '@/lib/i18n'
import { PROJECTS } from '@/lib/content/projects'
import { JOBS, PROFILE, TOOLS } from '@/lib/content/profile'

/**
 * Agente de demostración: responde con reglas sobre el contenido de la
 * hoja de vida. Está aislado en esta función para poder cambiarlo luego
 * por un modelo real (API) sin tocar la interfaz.
 */
interface Intent {
  keys: readonly string[]
  answer: (locale: Locale) => string
}

const pick = (text: L, locale: Locale) => text[locale]

const INTENTS: readonly Intent[] = [
  {
    keys: ['hola', 'hello', 'hi', 'buenas', 'hey'],
    answer: (l) =>
      pick({
        es: '¡Hola! Soy el agente de Elkin. Puedo contarte de su experiencia, su proceso, cómo usa la IA o sus proyectos.',
        en: 'Hi! I’m Elkin’s agent. I can tell you about his experience, his process, how he uses AI or his projects.',
      }, l),
  },
  {
    keys: [' ia', 'ai', 'inteligencia', 'claude', 'cursor', 'llm', 'artificial', 'agente', 'agent'],
    answer: (l) =>
      pick({
        es: 'Elkin integra IA en todo el ciclo: para agrupar investigación, generar variaciones, prototipar en código con Cursor y Claude Code, y también dentro de los productos (por ejemplo, la carga masiva que entiende cualquier Excel). Hoy diseña y construye herramientas que usan miles de personas.',
        en: 'Elkin uses AI across the whole cycle: to cluster research, generate variations, prototype in code with Cursor and Claude Code, and inside the products too (for example, a bulk import that understands any spreadsheet). Today he designs and builds tools used by thousands of people.',
      }, l),
  },
  {
    keys: ['experiencia', 'experience', 'trabajo', 'work', 'años', 'years', 'carrera', 'career', 'ubits', 'siigo'],
    answer: (l) => {
      const jobs = JOBS.map((j) => `${j.company} (${j.period}) — ${pick(j.role, l)}`).join('; ')
      return pick({
        es: `Más de 10 años de experiencia: ${jobs}.`,
        en: `10+ years of experience: ${jobs}.`,
      }, l)
    },
  },
  {
    keys: ['proceso', 'process', 'metodo', 'método', 'como trabaja', 'how do', 'how does'],
    answer: (l) =>
      pick({
        es: 'Su proceso va del ruido a la señal: 1) Ruido — escuchar el problema sin filtros; 2) Frecuencia — encontrar el patrón y el insight; 3) Forma — bocetos, wireframes y sistema de diseño; 4) Transmisión — lanzar y medir adopción y outcomes.',
        en: 'His process goes from noise to signal: 1) Noise — listen to the problem unfiltered; 2) Frequency — find the pattern and the insight; 3) Form — sketches, wireframes and design system; 4) Broadcast — ship and measure adoption and outcomes.',
      }, l),
  },
  {
    keys: ['proyecto', 'project', 'portafolio', 'portfolio', 'casos', 'case', 'barberlytics'],
    answer: (l) => {
      const list = PROJECTS.map((p) => `${pick(p.title, l)} (${p.client})`).join(', ')
      return pick({
        es: `Puedes explorar: ${list}. Cada caso muestra el proceso completo, del problema a los resultados.`,
        en: `You can explore: ${list}. Each case shows the full process, from problem to results.`,
      }, l)
    },
  },
  {
    keys: ['herramienta', 'tool', 'figma', 'stack', 'software'],
    answer: (l) =>
      pick({ es: `Sus herramientas: ${TOOLS.join(', ')}.`, en: `His tools: ${TOOLS.join(', ')}.` }, l),
  },
  {
    keys: ['contacto', 'contact', 'correo', 'email', 'mail', 'contratar', 'hire', 'disponible', 'available'],
    answer: (l) =>
      pick({
        es: `Puedes escribirle a ${PROFILE.email}. Está en ${PROFILE.location.es}.`,
        en: `You can reach him at ${PROFILE.email}. He’s based in ${PROFILE.location.en}.`,
      }, l),
  },
  {
    keys: ['estudio', 'educa', 'study', 'education', 'platzi', 'universidad', 'university'],
    answer: (l) =>
      pick({
        es: 'Diseñador gráfico (Universidad Los Libertadores, 2014), certificado internacional de UX (UX Alliance) y carreras de diseño UI, UX y de producto en Platzi.',
        en: 'Graphic designer (Universidad Los Libertadores, 2014), International UX Certificate (UX Alliance) and UI, UX and product design tracks at Platzi.',
      }, l),
  },
]

const FALLBACK: L = {
  es: 'Aún estoy en modo demo y no tengo esa respuesta. Prueba preguntando por su experiencia, su proceso, la IA o sus proyectos.',
  en: 'I’m still in demo mode and don’t have that answer. Try asking about his experience, his process, AI or his projects.',
}

function normalize(text: string): string {
  return ` ${text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')} `
}

export function answerQuestion(question: string, locale: Locale): string {
  const q = normalize(question)
  const intent = INTENTS.find((i) => i.keys.some((k) => q.includes(normalize(k).trim()) || q.includes(k)))
  return intent ? intent.answer(locale) : pick(FALLBACK, locale)
}

export const SUGGESTIONS: readonly L[] = [
  { es: '¿Cómo usas la IA?', en: 'How do you use AI?' },
  { es: '¿Cuál es tu proceso?', en: 'What’s your process?' },
  { es: '¿Dónde has trabajado?', en: 'Where have you worked?' },
  { es: '¿Cómo te contacto?', en: 'How can I reach you?' },
]
