'use client'

import Image from 'next/image'
import { useLocale, type L } from '@/lib/i18n'
import { CLIPPER_CASE } from '@/lib/content/cases/barberlytics/clipper-case'
import { PhoneBody, StatusBar } from '@/components/case/kit/device'
import { CaseShell } from '../shared/case-shell'
import { ClipperDots } from './clipper-dots'
import { ClipperIdea } from './clipper-idea'
import { ClipperHero } from './clipper-hero'
import { AgentLoop, ProposalFlow, ToolsByRole, VoiceMode } from './clipper-pieces'
import { AnswerBoard, AutonomySpectrum, BuildSection, ClipperDemo, ClipperImpact, OrbSection } from './clipper-sections'

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

/** Capturas reales de Clipper en la plataforma y en la reserva. */
function InPlatform() {
  const { t } = useLocale()
  const shots = [
    { src: 'clipper-action', w: 1040, h: 730, cap: { es: 'Tarjeta de propuesta real: antes tachado, después al lado, aviso de choque.', en: 'Real proposal card: before struck through, after beside it, clash warning.' } },
    { src: 'clipper-question', w: 1040, h: 680, cap: { es: 'En la reserva: pregunta con opciones numeradas.', en: 'In booking: a question with numbered options.' } },
  ]
  return (
    <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="space-y-6">
        <figure data-reveal="device" className="overflow-hidden rounded-xl ring-1 ring-fg/15">
          <Image src="/cases/barberlytics/clipper-drawer.webp" width={1600} height={744} alt={t({ es: 'Panel de Clipper abierto sobre la plataforma.', en: 'Clipper panel open over the platform.' })} sizes="(min-width: 1024px) 55vw, 100vw" className="block h-auto w-full" />
        </figure>
        <div className="grid gap-6 sm:grid-cols-2">
          {shots.map((s) => (
            <figure key={s.src} data-reveal>
              <div className="overflow-hidden rounded-xl ring-1 ring-fg/15"><Image src={`/cases/barberlytics/${s.src}.webp`} width={s.w} height={s.h} alt={t(s.cap)} sizes="(min-width: 640px) 28vw, 100vw" className="block h-auto w-full" /></div>
              <figcaption className="mt-2 text-xs opacity-65">{t(s.cap)}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div data-reveal="device" className="mx-auto w-full max-w-[260px]">
        <PhoneBody>
          <StatusBar />
          <Image src="/cases/barberlytics/clipper-thread.webp" width={780} height={1688} alt={t({ es: 'Clipper en la reserva saluda a Marcela y propone horarios.', en: 'Booking Clipper greets Marcela and proposes times.' })} sizes="260px" className="block h-auto w-full" />
        </PhoneBody>
      </div>
    </div>
  )
}

function ClipperForm() {
  return (
    <div>
      <Section n="5.1" title={{ es: 'Una pregunta, por dentro', en: 'One question, inside' }} body={{ es: 'Ejemplos de las pruebas y evaluaciones del agente. A la izquierda, lo que ve la persona; a la derecha, lo que pasa por dentro: entiende quién pregunta, elige una herramienta de su rol, revisa las cifras y responde diciendo qué consultó.', en: 'Examples from the agent’s tests and evaluations. On the left, what the person sees; on the right, what happens inside: it understands who’s asking, picks a tool from their role, checks the figures and answers saying what it looked up.' }}>
        <AgentLoop />
      </Section>
      <Section n="5.2" title={{ es: 'Dieciocho herramientas, según quién pregunta', en: 'Eighteen tools, depending on who asks' }} body={{ es: 'Trece consultan y cinco proponen. Cada rol ve solo las suyas, y el rol sale de la sesión firmada, no de lo que pida el navegador.', en: 'Thirteen read and five propose. Each role only sees its own, and the role comes from the signed session, not from what the browser asks for.' }}>
        <ToolsByRole />
      </Section>
      <Section n="5.3" title={{ es: 'Propone; tú aplicas', en: 'It proposes; you apply' }} body={{ es: 'Clipper nunca cambia nada solo: deja una tarjeta con el antes y el después. Aplicar, Descartar y Deshacer, con avisos cuando choca con otra cita o cuando es un dato de salud.', en: 'Clipper never changes anything alone: it leaves a card with before and after. Apply, Discard and Undo, with warnings when it clashes with another visit or when it’s health data.' }}>
        <ProposalFlow />
      </Section>
      <Section n="5.4" title={{ es: 'La voz', en: 'The voice' }} body={{ es: 'Escucha con paciencia —si la frase queda abierta, espera— y en la reserva contesta como una llamada. En la app del equipo, por ahora, la voz es dictado.', en: 'It listens patiently —if the phrase is left open, it waits— and in booking it answers like a phone call. In the team app, for now, voice is dictation.' }}>
        <VoiceMode />
      </Section>
      <Section n="5.5" title={{ es: 'El orbe', en: 'The orb' }} body={{ es: 'El poste de barbería hecho esfera: tres estados y una sola regla, ser el único símbolo de IA del producto.', en: 'The barber pole turned sphere: three states and one rule, being the product’s only AI symbol.' }}>
        <OrbSection />
      </Section>
      <Section n="5.6" title={{ es: 'En la plataforma y en la reserva', en: 'In the platform and in booking' }} body={{ es: 'Así se ve hoy: el panel lateral dentro de la plataforma, las tarjetas de propuesta y el Clipper que atiende al cliente en la reserva.', en: 'How it looks today: the side panel inside the platform, the proposal cards and the Clipper that serves clients in booking.' }}>
        <InPlatform />
      </Section>
    </div>
  )
}

function ClipperSketches() {
  const { t } = useLocale()
  return (
    <div className="space-y-12">
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t({ es: 'Antes del modelo, la forma de una buena respuesta: corta, con su fuente a la vista y con los cambios como propuestas, nunca como hechos.', en: 'Before the model, the shape of a good answer: short, with its source in view, and changes as proposals, never as facts.' })}</p>
      <AnswerBoard />
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
        ia: BuildSection,
        impacto: ClipperImpact,
        demo: ClipperDemo,
      }}
    />
  )
}
