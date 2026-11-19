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
function wordMatches(token: string, key: string): boolean {
  if (token === key) return true
  if (key.length <= 3) return false // ia, ui, cv, arr…: solo exactas
  if (token.length >= 4 && (token.startsWith(key) || key.startsWith(token)) && Math.abs(token.length - key.length) <= 3) return true
  return key.length >= 5 && distance(token, key) <= (key.length >= 8 ? 2 : 1)
}

function keyMatches(q: string, tokens: readonly string[], rawKey: string): boolean {
  const key = fold(rawKey).trim()
  if (!key.includes(' ')) return tokens.some((t) => wordMatches(t, key))
  if (q.includes(` ${key} `) || q.includes(key)) return true
  // Frases: todas sus palabras presentes, con tolerancia a errores.
  return key.split(' ').every((part) => tokens.some((t) => wordMatches(t, part)))
}

function score(q: string, tokens: readonly string[]): { topic: Topic; points: number }[] {
  return TOPICS.map((topic) => ({ topic, points: topic.keys.filter((k) => keyMatches(q, tokens, k)).length * (topic.weight ?? 1) }))
    .filter((r) => r.points > 0)
    .sort((a, b) => b.points - a.points)
}

const withExtras = (text: string, topic: Topic, locale: Locale) => `${text}${topic.extras ? `\n\n${topic.extras[locale]}` : ''}`

export function answerQuestion(question: string, locale: Locale, memory: LocalMemory): string {
  const q = ` ${fold(question).replace(/[¿?¡!.,;:()«»"]/g, ' ').replace(/\s+/g, ' ').trim()} `
  const tokens = q.trim().split(' ')
  const ranked = score(q, tokens)
  const greeted = ranked.some((r) => r.topic.id === 'hello')
  // Un saludo solo responde como saludo si no viene con una pregunta real.
  const topic = (ranked.find((r) => !SOCIAL.has(r.topic.id)) ?? ranked[0])?.topic ?? null
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
  return withExtras(hello + topic.replies[n % topic.replies.length][locale], topic, locale)
}
