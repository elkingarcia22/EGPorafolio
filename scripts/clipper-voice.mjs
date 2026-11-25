// Genera la voz de Clipper con Gemini TTS (voz «Achird», la misma de la reserva)
// para el capítulo «Forma» del caso Clipper.
//
//   GEMINI_API_KEY=... node scripts/clipper-voice.mjs
//
// Escribe public/cases/barberlytics/clipper-voice-{greeting,reply}-{es,en}.wav.
// Los textos son los de lib/content/cases/barberlytics/clipper-case.ts (voice):
// si cambian allá, se cambian aquí y se vuelve a correr.
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const MODEL = 'gemini-2.5-flash-preview-tts'
const VOICE = 'Achird'
const OUT = join(process.cwd(), 'public/cases/barberlytics')
/** PCM que devuelve Gemini: 16 bits, 24 kHz, mono */
const RATE = 24000

const STYLE = {
  es: 'Dilo en español de Colombia, cálido, tranquilo y sonriendo, como un barbero amable que atiende por teléfono:',
  en: 'Say it warmly, calm and smiling, like a friendly barber answering the phone:',
}

const LINES = {
  greeting: {
    es: '¡Hola! Soy Clipper, te ayudo a agendar. Dime, ¿qué quieres hacer hoy?',
    en: 'Hi! I’m Clipper, I’ll help you book. Tell me, what would you like to do today?',
  },
  reply: {
    es: '¡Listo, Martín! Nicolás te espera mañana a las 4. ¿Te lo confirmo?',
    en: 'Done, Martín! Nicolás will see you tomorrow at 4. Shall I confirm?',
  },
}

const key = process.env.GEMINI_API_KEY
if (!key) {
  console.error('Falta GEMINI_API_KEY. Uso: GEMINI_API_KEY=... node scripts/clipper-voice.mjs')
  process.exit(1)
}

/** Envuelve el PCM en un encabezado WAV para que el navegador lo reproduzca. */
function wav(pcm) {
  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + pcm.length, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20)
  header.writeUInt16LE(1, 22)
  header.writeUInt32LE(RATE, 24)
  header.writeUInt32LE(RATE * 2, 28)
  header.writeUInt16LE(2, 32)
  header.writeUInt16LE(16, 34)
  header.writeUInt32LE(pcm.length, 40)
  return Buffer.concat([header, pcm])
}

async function speak(text, lang) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${STYLE[lang]} ${text}` }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } },
      },
    }),
  })
  if (!res.ok) throw new Error(`Gemini respondió ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const data = await res.json()
  const b64 = data?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data
  if (!b64) throw new Error('Gemini no devolvió audio')
  return wav(Buffer.from(b64, 'base64'))
}

for (const [id, byLang] of Object.entries(LINES)) {
  for (const [lang, text] of Object.entries(byLang)) {
    const file = join(OUT, `clipper-voice-${id}-${lang}.wav`)
    try {
      await writeFile(file, await speak(text, lang))
      console.log(`✓ ${file}`)
    } catch (error) {
      console.error(`✕ ${id} (${lang}): ${error instanceof Error ? error.message : error}`)
      process.exitCode = 1
    }
  }
}
