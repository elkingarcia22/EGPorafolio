// Graba la llamada simulada de Clipper (capítulo «Forma» del caso Clipper) con
// una voz masculina de ElevenLabs (Eric, modelo multilingüe).
//
//   ELEVENLABS_API_KEY=... node scripts/clipper-voice.mjs
//
// Escribe public/cases/barberlytics/clipper-voice-{greeting,reply}-{es,en}.mp3.
// Los textos son los de lib/content/cases/barberlytics/clipper-case.ts (voice):
// si cambian allá, se cambian aquí y se vuelve a correr.
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const VOICE_ID = 'cjVigY5qzO86Huf0OWal'
const MODEL = 'eleven_multilingual_v2'
const OUT = join(process.cwd(), 'public/cases/barberlytics')
const SETTINGS = { stability: 0.45, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true }

/** Los números van en letra para que los diga como en una llamada */
const LINES = {
  greeting: {
    es: '¡Hola! Soy Clipper, te ayudo a agendar. Dime, ¿qué quieres hacer hoy?',
    en: 'Hi! I’m Clipper, I’ll help you book. Tell me, what would you like to do today?',
  },
  reply: {
    es: '¡Listo, Martín! Nicolás te espera mañana a las cuatro. ¿Te lo confirmo?',
    en: 'Done, Martín! Nicolás will see you tomorrow at four. Shall I confirm?',
  },
}

const key = process.env.ELEVENLABS_API_KEY
if (!key) {
  console.error('Falta ELEVENLABS_API_KEY. Uso: ELEVENLABS_API_KEY=... node scripts/clipper-voice.mjs')
  process.exit(1)
}

async function speak(text, lang) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'xi-api-key': key },
    body: JSON.stringify({ text, model_id: MODEL, language_code: lang, voice_settings: SETTINGS }),
  })
  if (!res.ok) throw new Error(`ElevenLabs respondió ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return Buffer.from(await res.arrayBuffer())
}

for (const [id, byLang] of Object.entries(LINES)) {
  for (const [lang, text] of Object.entries(byLang)) {
    const file = join(OUT, `clipper-voice-${id}-${lang}.mp3`)
    try {
      await writeFile(file, await speak(text, lang))
      console.log(`✓ ${file}`)
    } catch (error) {
      console.error(`✕ ${id} (${lang}): ${error instanceof Error ? error.message : error}`)
      process.exitCode = 1
    }
  }
}
