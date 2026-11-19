'use client'

import { useLocale, type L } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { CaseShell } from '../shared/case-shell'
import { ClipperDots } from './clipper-dots'
import { ClipperIdea } from './clipper-idea'
import { ClipperInPlatform } from './clipper-in-platform'
import { OrbConstructionBoard, OrbLayersBoard } from './clipper-orb-sketches'
import { ClipperHero } from './clipper-hero'
import { AgentLoop } from './clipper-pieces'
import { ClipperVoice } from './clipper-voice'
import { AnswerBoard, AutonomySpectrum, ClipperDemo, ClipperImpact, OrbSection } from './clipper-sections'
import { ClipperAiProcess } from './clipper-ai-process'

const H3 = 'mb-4 flex items-baseline gap-4 text-[clamp(1.35rem,1rem+1vw,1.9rem)]'

function Section({ n, title, body, children }: { n: string; title: L; body: L; children: React.ReactNode }) {
  const { t } = useLocale()
  return (
    <section className="mt-[clamp(4rem,3rem+4vw,7rem)] first:mt-0">
      <h3 data-reveal="mask" className={H3}>
        <span className="mono-label text-signal">{n}</span>
        {t(title)}
      </h3>
      <p data-reveal className="mb-8 max-w-[62ch] leading-relaxed opacity-80">{t(body)}</p>
      {children}
    </section>
  )
}

function ClipperForm() {
  return (
    <div>
      <Section n="5.1" title={{ es: 'Una pregunta, por dentro', en: 'One question, inside' }} body={{ es: 'Ejemplos de las pruebas y evaluaciones del agente. A la izquierda, lo que ve la persona; a la derecha, lo que pasa por dentro: entiende quién pregunta, elige una herramienta de su rol, revisa las cifras y responde diciendo qué consultó.', en: 'Examples from the agent’s tests and evaluations. On the left, what the person sees; on the right, what happens inside: it understands who’s asking, picks a tool from their role, checks the figures and answers saying what it looked up.' }}>
        <AgentLoop />
      </Section>
      <Section n="5.2" title={{ es: 'La voz', en: 'The voice' }} body={{ es: 'Escucha con paciencia —si la frase queda abierta, espera— y en la reserva contesta como una llamada. En la app del equipo, por ahora, la voz es dictado.', en: 'It listens patiently —if the phrase is left open, it waits— and in booking it answers like a phone call. In the team app, for now, voice is dictation.' }}>
        <ClipperVoice />
      </Section>
      <Section n="5.3" title={{ es: 'El orbe', en: 'The orb' }} body={{ es: 'El poste de barbería hecho esfera: tres estados y una sola regla, ser el único símbolo de IA del producto.', en: 'The barber pole turned sphere: three states and one rule, being the product’s only AI symbol.' }}>
        <OrbSection />
      </Section>
      <Section n="5.4" title={{ es: 'En la plataforma y en la reserva', en: 'In the platform and in booking' }} body={{ es: 'Así se ve hoy: el panel lateral dentro de la plataforma, las tarjetas de propuesta y el Clipper que atiende al cliente en la reserva.', en: 'How it looks today: the side panel inside the platform, the proposal cards and the Clipper that serves clients in booking.' }}>
        <ClipperInPlatform />
      </Section>
    </div>
  )
}

function ClipperSketches() {
  const { t } = useLocale()
  return (
    <div className="space-y-12">
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t({ es: 'Antes del modelo, la forma de una buena respuesta: corta, con su fuente a la vista y con los cambios como propuestas, nunca como hechos. Y la presencia de Clipper: cómo un poste de barbería se vuelve una esfera, capa por capa.', en: 'Before the model, the shape of a good answer: short, with its source in view, and changes as proposals, never as facts. And Clipper’s presence: how a barber pole becomes a sphere, layer by layer.' })}</p>
      <AnswerBoard />
      <OrbConstructionBoard />
      <OrbLayersBoard />
    </div>
  )
}


/** Caso Clipper: de los puntos al impacto, más la demo. */
export function ClipperCase() {
  const { t } = useLocale()
  return (
    <CaseShell
      title={t(CLIPPER_CASE.title)}
      hero={<ClipperHero />}
      content={{
        puntos: ClipperDots,
        patrones: AutonomySpectrum,
        idea: ClipperIdea,
        bocetos: ClipperSketches,
        forma: ClipperForm,
        ia: ClipperAiProcess,
        impacto: ClipperImpact,
        demo: ClipperDemo,
      }}
    />
  )
}
