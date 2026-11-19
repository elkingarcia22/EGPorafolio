import type { Locale } from '@/lib/i18n'
import { FALLBACK, FOLLOW_UP, TOPICS, type Topic } from './local-replies'

/**
 * Respaldo local del agente: si el modelo no está disponible (sin clave, sin créditos o con error),
 * elige la respuesta escrita a mano que mejor encaja, varía la forma de decirla, entiende los
 * «¿y eso cómo?» sobre el tema anterior y devuelve las mismas marcas [[…]] que usa la interfaz.
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

/** La pregunta con espacios a los lados y sin signos: así « ia » no coincide dentro de «deberíamos». */
function normalize(text: string): string {
  return ` ${fold(text).replace(/[¿?¡!.,;:()«»"]/g, ' ').replace(/\s+/g, ' ')} `
}

/** El tema con más palabras clave presentes (desempata el orden de la lista). */
function bestTopic(q: string): Topic | null {
  let best: Topic | null = null
  let score = 0
  for (const topic of TOPICS) {
    const hits = topic.keys.filter((k) => q.includes(fold(k))).length
    if (hits > score) {
      best = topic
      score = hits
    }
  }
  return best
}

const withExtras = (text: string, topic: Topic, locale: Locale) => `${text}${topic.extras ? `\n\n${topic.extras[locale]}` : ''}`

export function answerQuestion(question: string, locale: Locale, memory: LocalMemory): string {
  const q = normalize(question)
  const topic = bestTopic(q)
  const wantsMore = FOLLOW_UP.some((k) => q.includes(fold(k)))
  const previous = TOPICS.find((t) => t.id === memory.lastTopic)

  // «¿Y eso cómo?» sin tema nuevo (o sobre el mismo): profundiza en el anterior.
  if (wantsMore && (!topic || topic.id === previous?.id) && previous?.deep && !memory.deepGiven[previous.id]) {
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
  memory.lastTopic = topic.id
  // Si ya dijo todas sus versiones y hay profundidad pendiente, la usa en vez de repetirse.
  if (n >= topic.replies.length && topic.deep && !memory.deepGiven[topic.id]) {
    memory.deepGiven[topic.id] = true
    return withExtras(topic.deep[locale], topic, locale)
  }
  return withExtras(topic.replies[n % topic.replies.length][locale], topic, locale)
}
