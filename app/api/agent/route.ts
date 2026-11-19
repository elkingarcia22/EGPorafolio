import Anthropic from '@anthropic-ai/sdk'
import type { Locale } from '@/lib/i18n'
import { systemPrompt } from '@/lib/agent/persona'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MODEL = process.env.AGENT_MODEL ?? 'claude-sonnet-5-5'
const MAX_TOKENS = 700
const MAX_TURNS = 16
const MAX_CHARS = 1200
const RATE_LIMIT = 20
const RATE_WINDOW_MS = 10 * 60 * 1000

interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

/** Límite simple por IP en memoria: suficiente para un portafolio y evita abusos baratos. */
const hits = new Map<string, number[]>()
function allowed(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent)
    return false
  }
  hits.set(ip, [...recent, now])
  return true
}

/** Valida lo que llega del navegador: solo turnos de texto, cortos y alternados. */
function parse(body: unknown): { messages: ChatTurn[]; locale: Locale } | null {
  if (typeof body !== 'object' || body === null) return null
  const { messages, locale } = body as { messages?: unknown; locale?: unknown }
  if (!Array.isArray(messages) || messages.length === 0) return null
  const turns = messages.slice(-MAX_TURNS).filter(
    (m): m is ChatTurn => typeof m === 'object' && m !== null && ((m as ChatTurn).role === 'user' || (m as ChatTurn).role === 'assistant') && typeof (m as ChatTurn).content === 'string' && (m as ChatTurn).content.trim().length > 0,
  )
  if (turns.length === 0 || turns[turns.length - 1].role !== 'user') return null
  // La conversación debe empezar por la persona.
  while (turns.length && turns[0].role !== 'user') turns.shift()
  return { messages: turns.map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) })), locale: locale === 'en' ? 'en' : 'es' }
}

const json = (status: number, data: Record<string, unknown>) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } })

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return json(503, { error: 'unconfigured' })

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  if (!allowed(ip)) return json(429, { error: 'rate_limited' })

  let input: ReturnType<typeof parse>
  try {
    input = parse(await request.json())
  } catch {
    input = null
  }
  if (!input) return json(400, { error: 'bad_request' })

  const client = new Anthropic({ apiKey })
  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      // El conocimiento es largo y no cambia: se guarda en caché entre preguntas.
      system: [{ type: 'text', text: systemPrompt(input.locale), cache_control: { type: 'ephemeral' } }],
      messages: input.messages,
    })
    const encoder = new TextEncoder()
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') controller.enqueue(encoder.encode(event.delta.text))
          }
        } catch (error) {
          console.error('[agent] stream failed', error instanceof Error ? error.message : error)
        } finally {
          controller.close()
        }
      },
      cancel() {
        stream.abort()
      },
    })
    return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } })
  } catch (error) {
    console.error('[agent] request failed', error instanceof Error ? error.message : error)
    return json(502, { error: 'upstream' })
  }
}
