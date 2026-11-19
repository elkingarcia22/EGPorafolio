import type { Locale } from '@/lib/i18n'
import { FALLBACK, FOLLOW_UP, TOPICS, type Topic } from './local-replies'

/**
 * Respaldo local del agente: si el modelo no está disponible (sin clave, sin créditos o con error),
 * elige la respuesta escrita a mano que mejor encaja —tolerando errores de tipeo—, varía la forma de
 * decirla, entiende los «¿y eso cómo?» sobre el tema anterior y devuelve las marcas [[…]] de la interfaz.
 */

/** Lo que el agente recuerda de la conversación para sonar natural. */
export interface LocalMemory {
  lastTopic: string | null
  /** Cuántas veces ha respondido cada tema (para no repetir la misma frase). */
  used: Record<string, number>
  deepGiven: Record<string, boolean>
}

export const newMemory = (): LocalMemory => ({ lastTopic: null, used: {}, deepGiven: {} })

const fold = (text: string) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const SOCIAL = new Set(['hello', 'thanks'])

/** Distancia de edición, con tope: solo importa si es 0, 1 o 2. */
function distance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3
  const prev = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]
    prev[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j]
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1))
      diag = tmp
    }
  }
  return prev[b.length]
}

/** ¿Esta palabra de la pregunta es la clave, con un error de tipeo o una conjugación cercana? */
/** Palabras comunes que solo valen exactas: «gente» no es «agente», «tienes» no es «tiene». */
const EXACT_ONLY = new Set(['gente', 'tienes', 'tiene', 'haces', 'hacer', 'como', 'cuando', 'donde', 'para', 'sobre', 'todo', 'cual', 'esta', 'estas', 'eres', 'mas', 'puedes', 'quieres', 'usas', 'tus', 'que'])

function wordMatches(token: string, key: string): boolean {
  if (token === key) return true
  if (EXACT_ONLY.has(token)) return false
  if (key.length <= 3) return false // ia, ui, cv, arr…: solo exactas
  if (token.length >= 4 && (token.startsWith(key) || key.startsWith(token)) && Math.abs(token.length - key.length) <= 3) return true
  // Misma raíz: «bocetación» y «bocetas», «prototipado» y «prototipos».
  let common = 0
  while (common < token.length && common < key.length && token[common] === key[common]) common++
  if (common >= 5 && common >= key.length - 2) return true
  // Un error de tipeo; dos solo en palabras largas del mismo largo («prospectos» no es «proyectos»).
  const d = distance(token, key)
  return key.length >= 5 && (d <= 1 || (d === 2 && key.length >= 9 && token.length === key.length))
}

function keyMatches(q: string, tokens: readonly string[], rawKey: string): boolean {
  const key = fold(rawKey).trim()
  if (!key.includes(' ')) return tokens.some((t) => wordMatches(t, key))
  if (q.includes(` ${key} `) || q.includes(key)) return true
  // Frases: todas sus palabras presentes, con tolerancia a errores.
  return key.split(' ').every((part) => tokens.some((t) => wordMatches(t, part)))
}

/**
 * Puntos de un tema: cuántas palabras distintas de la pregunta lo activan (las frases cuentan doble).
 * Así «bocetación» no suma tres veces por coincidir con «boceto», «bocetos» y «bocetas».
 */
function topicPoints(topic: Topic, q: string, tokens: readonly string[]): number {
  const hitTokens = new Set<string>()
  let phrases = 0
  for (const raw of topic.keys) {
    const key = fold(raw).trim()
    if (key.includes(' ')) {
      if (keyMatches(q, tokens, key)) phrases++
      continue
    }
    tokens.forEach((t) => wordMatches(t, key) && hitTokens.add(t))
  }
  return (hitTokens.size + phrases * 2) * (topic.weight ?? 1)
}

function score(q: string, tokens: readonly string[]): { topic: Topic; points: number }[] {
  return TOPICS.map((topic) => ({ topic, points: topicPoints(topic, q, tokens) }))
    .filter((r) => r.points > 0)
    .sort((a, b) => b.points - a.points)
}

const withExtras = (text: string, topic: Topic, locale: Locale) => `${text}${topic.extras ? `\n\n${topic.extras[locale]}` : ''}`

/** ¿La pregunta junta varias cosas? («cómo boceteas logos y qué herramientas usas») */
const COMPOUND = [' y ', ' and ', ' tambien ', ' also ', ' ademas ']

/** Las otras partes de una pregunta compuesta, en una frase cada una (máximo dos). */
function alsoAnswer(q: string, ranked: { topic: Topic; points: number }[], main: Topic, locale: Locale): string {
  if (!COMPOUND.some((c) => q.includes(c))) return ''
  const extra = ranked.filter((r) => r.topic.id !== main.id && r.topic.short && r.points >= 1).slice(0, 2)
  return extra.map((r) => `\n\n${r.topic.short?.[locale] ?? ''}`).join('')
}

function route(question: string) {
  const q = ` ${fold(question).replace(/[¿?¡!.,;:()«»"]/g, ' ').replace(/\s+/g, ' ').trim()} `
  const tokens = q.trim().split(' ')
  const ranked = score(q, tokens)
  // Un saludo solo responde como saludo si no viene con una pregunta real.
  const topic = (ranked.find((r) => !SOCIAL.has(r.topic.id)) ?? ranked[0])?.topic ?? null
  return { q, ranked, topic }
}

/** A qué tema va una pregunta (para probar el enrutado). */
export const routeTopic = (question: string): string | null => route(question).topic?.id ?? null

export function answerQuestion(question: string, locale: Locale, memory: LocalMemory): string {
  const { q, ranked, topic } = route(question)
  const greeted = ranked.some((r) => r.topic.id === 'hello')
  const hello = greeted && topic && topic.id !== 'hello' ? (locale === 'en' ? 'Hi! ' : '¡Hola! ') : ''
  const wantsMore = FOLLOW_UP.some((k) => q.includes(fold(k)))
  const previous = TOPICS.find((t) => t.id === memory.lastTopic)

  // «¿Y eso cómo?» sin tema nuevo (o sobre el mismo): profundiza en el anterior.
  if (wantsMore && (!topic || SOCIAL.has(topic.id) || topic.id === previous?.id) && previous?.deep && !memory.deepGiven[previous.id]) {
    memory.deepGiven[previous.id] = true
    return withExtras(previous.deep[locale], previous, locale)
  }

  if (!topic) {
    const n = memory.used.__fallback ?? 0
    memory.used.__fallback = n + 1
    return `${FALLBACK[n % FALLBACK.length][locale]}\n\n[[contacto]]`
  }

  const n = memory.used[topic.id] ?? 0
  memory.used[topic.id] = n + 1
  if (!SOCIAL.has(topic.id)) memory.lastTopic = topic.id
  // Si ya dijo todas sus versiones y hay profundidad pendiente, la usa en vez de repetirse.
  if (n >= topic.replies.length && topic.deep && !memory.deepGiven[topic.id]) {
    memory.deepGiven[topic.id] = true
    return withExtras(hello + topic.deep[locale], topic, locale)
  }
  return withExtras(hello + topic.replies[n % topic.replies.length][locale] + alsoAnswer(q, ranked, topic, locale), topic, locale)
}
